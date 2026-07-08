import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildInventoryDigest,
  detectBuyerIntent,
  extractContactDetails,
  extractShopperName,
  isHumanHandoffIntent,
  rankInventory,
} from "@/lib/chat-assistant";
import { dealershipFacts } from "@/lib/dealership-data";
import { getInventory } from "@/lib/inventory";
import { guardPublicRequest } from "@/lib/request-guard";
import { getSupabaseServerAnon } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const openai = process.env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const lastMessage = String(messages.at(-1)?.content ?? "");
  const visitorId = String(body?.visitorId ?? "anonymous");
  const vehicleSlug = typeof body?.vehicleSlug === "string" ? body.vehicleSlug : undefined;
  const guard = guardPublicRequest(req, {
    key: "chat-session",
    limit: 12,
    windowMs: 10 * 60 * 1000,
    content: lastMessage,
  });
  if (!guard.ok) {
    return NextResponse.json({ ok: false, error: guard.error }, { status: guard.status });
  }

  const inventory = await getInventory();
  const rankedVehicles = rankInventory(lastMessage, inventory);
  const detectedIntent = detectBuyerIntent(lastMessage, vehicleSlug);
  const contact = extractContactDetails(lastMessage);
  const shopperName = extractShopperName(lastMessage);

  const sessionId = await ensureChatSession({
    sessionId: typeof body?.sessionId === "string" ? body.sessionId : undefined,
    visitorId,
    vehicleSlug,
    buyerIntent: detectedIntent,
  });

  await logChatMessage(sessionId, "user", lastMessage);
  await logAnalyticsEvent({
    eventType: "chat_message",
    visitorId,
    vehicleSlug: vehicleSlug ?? rankedVehicles[0]?.slug,
    metadata: { sessionId, role: "user", buyerIntent: detectedIntent },
  });

  const reply = openai
    ? await createAiReply(messages, lastMessage, rankedVehicles, detectedIntent)
    : fallbackReply(lastMessage, rankedVehicles, detectedIntent);
  await logChatMessage(sessionId, "assistant", reply);
  await updateChatSession(sessionId, {
    status: isHumanHandoffIntent(lastMessage) || contact.phone || contact.email ? "needs_human" : undefined,
    buyer_intent: detectedIntent,
    summary: buildSessionSummary(lastMessage, detectedIntent, rankedVehicles),
    vehicle_slug: vehicleSlug ?? rankedVehicles[0]?.slug,
  });

  let leadId: string | undefined;
  if ((contact.phone || contact.email) && sessionId !== "local-session") {
    leadId = await createLeadFromChatSession({
      sessionId,
      visitorId,
      message: lastMessage,
      vehicleSlug: vehicleSlug ?? rankedVehicles[0]?.slug,
      buyerIntent: detectedIntent,
      contact,
      shopperName,
    });
  }

  if (leadId) {
    await logAnalyticsEvent({
      eventType: "chat_qualified",
      visitorId,
      vehicleSlug: vehicleSlug ?? rankedVehicles[0]?.slug,
      leadId,
      metadata: { sessionId, buyerIntent: detectedIntent, capturedVia: "chat_contact" },
    });
  } else if (isHumanHandoffIntent(lastMessage)) {
    await logAnalyticsEvent({
      eventType: "chat_handoff_requested",
      visitorId,
      vehicleSlug: vehicleSlug ?? rankedVehicles[0]?.slug,
      metadata: { sessionId, buyerIntent: detectedIntent },
    });
  }

  return NextResponse.json({
    message: reply,
    sessionId,
    leadId,
    buyerIntent: detectedIntent,
    recommendationSlugs: rankedVehicles.slice(0, 3).map((vehicle) => vehicle.slug),
  });
}

async function createAiReply(messages: Array<{ role?: string; content?: unknown }>, lastMessage: string, rankedVehicles: Awaited<ReturnType<typeof rankInventory>>, detectedIntent: string) {
  const system = `
You are the AI sales assistant for ${dealershipFacts.name}, a San Jose dealership specializing in hybrid and EV vehicles.
Help shoppers compare inventory, estimate trade-in next steps, request test drives, and route qualified buyers to staff.

Guardrails:
- Do not promise financing approval, final payment terms, warranties, or unavailable inventory.
- If a buyer is ready to buy, asks for financing, gives contact details, or needs exact terms, ask for name and phone and recommend staff follow-up.
- Never invent a vehicle, availability status, payment approval, or warranty coverage.
- Keep answers concise, specific, and dealership-friendly.

Detected buyer intent:
- ${detectedIntent}

Best inventory matches:
${buildInventoryDigest(rankedVehicles).join("\n")}

Dealership:
- Phone: ${dealershipFacts.phone}
- Address: ${dealershipFacts.addressLine}, ${dealershipFacts.city}
- Hours: ${dealershipFacts.hours}
`.trim();

  try {
    const response = await openai!.responses.create({
      model: groqModel,
      input: [
        { role: "system", content: system },
        ...messages.slice(-10).map((message) => ({
          role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: String(message.content ?? ""),
        })),
      ],
    });

    return response.output_text?.trim() || fallbackReply(lastMessage, rankedVehicles, detectedIntent);
  } catch {
    return fallbackReply(lastMessage, rankedVehicles, detectedIntent);
  }
}

async function ensureChatSession({
  sessionId,
  visitorId,
  vehicleSlug,
  buyerIntent,
}: {
  sessionId?: string;
  visitorId: string;
  vehicleSlug?: string;
  buyerIntent: string;
}) {
  const client = getSupabaseAdmin() ?? getSupabaseServerAnon();
  if (!client) return sessionId ?? "local-session";
  if (sessionId) return sessionId;

  const { data } = await client
    .from("chat_sessions")
    .insert({
      visitor_id: visitorId,
      vehicle_slug: vehicleSlug,
      buyer_intent: buyerIntent,
    })
    .select("id")
    .single();

  return data?.id ?? "local-session";
}

async function logChatMessage(sessionId: string, role: "user" | "assistant", content: string) {
  const client = getSupabaseAdmin() ?? getSupabaseServerAnon();
  if (!client || sessionId === "local-session" || !content.trim()) return;

  await client.from("chat_messages").insert({ session_id: sessionId, role, content });
}

async function updateChatSession(
  sessionId: string,
  updates: { status?: string; summary?: string; buyer_intent?: string; vehicle_slug?: string },
) {
  const client = getSupabaseAdmin();
  if (!client || sessionId === "local-session") return;

  const payload = Object.fromEntries(Object.entries(updates).filter(([, value]) => typeof value === "string" && value.trim()));
  if (!Object.keys(payload).length) return;
  await client.from("chat_sessions").update(payload).eq("id", sessionId);
}

async function createLeadFromChatSession({
  sessionId,
  visitorId,
  message,
  vehicleSlug,
  buyerIntent,
  contact,
  shopperName,
}: {
  sessionId: string;
  visitorId: string;
  message: string;
  vehicleSlug?: string;
  buyerIntent: string;
  contact: { email?: string; phone?: string };
  shopperName?: string;
}) {
  const client = getSupabaseAdmin();
  if (!client || sessionId === "local-session") return undefined;

  const existing = await client.from("chat_sessions").select("lead_id").eq("id", sessionId).maybeSingle();
  if (existing.data?.lead_id) return String(existing.data.lead_id);

  const { data: lead, error } = await client
    .from("leads")
    .insert({
      source: "ai-chat",
      name: shopperName ?? "AI chat shopper",
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      message,
      vehicle_slug: vehicleSlug,
      budget: buyerIntent,
      status: "new",
    })
    .select("id")
    .single();

  if (error || !lead?.id) return undefined;

  await Promise.all([
    client.from("chat_sessions").update({ lead_id: lead.id, status: "needs_human" }).eq("id", sessionId),
    client.from("lead_events").insert({
      lead_id: lead.id,
      event_type: "lead_created_from_chat",
      note: `Lead created from AI chat for visitor ${visitorId}`,
      metadata: { sessionId, vehicleSlug: vehicleSlug ?? null, buyerIntent, shopperName: shopperName ?? null },
    }),
  ]);

  return String(lead.id);
}

async function logAnalyticsEvent({
  eventType,
  visitorId,
  vehicleSlug,
  leadId,
  metadata,
}: {
  eventType: string;
  visitorId?: string;
  vehicleSlug?: string;
  leadId?: string;
  metadata?: Record<string, unknown>;
}) {
  const client = getSupabaseAdmin();
  const fallbackClient = getSupabaseServerAnon();
  const writableClient = client ?? fallbackClient;
  if (!writableClient) return;
  await writableClient.from("analytics_events").insert({
    event_type: eventType,
    visitor_id: visitorId,
    vehicle_slug: vehicleSlug,
    lead_id: leadId,
    metadata: metadata ?? {},
  });
}

function buildSessionSummary(lastMessage: string, detectedIntent: string, rankedVehicles: Awaited<ReturnType<typeof rankInventory>>) {
  const topVehicle = rankedVehicles[0]?.title;
  const summaryParts = [
    `Intent: ${detectedIntent.replaceAll("_", " ")}`,
    topVehicle ? `Best match: ${topVehicle}` : null,
    lastMessage ? `Latest request: ${lastMessage.slice(0, 140)}` : null,
  ].filter(Boolean);
  return summaryParts.join(" | ");
}

function fallbackReply(lastMessage: string, rankedVehicles: Awaited<ReturnType<typeof rankInventory>>, detectedIntent: string) {
  const lower = lastMessage.toLowerCase();
  if (lower.includes("hours")) return `We're open ${dealershipFacts.hours}.`;
  if (lower.includes("trade")) return "Share your year, make, model, mileage, and condition and I can help route a trade-in request to the team.";
  if (lower.includes("budget") || lower.includes("under")) {
    const suggestions = rankedVehicles.slice(0, 3).map((vehicle) => vehicle.title).join(", ");
    return suggestions
      ? `Based on that budget, a few strong matches are ${suggestions}. If you want, I can narrow that by hybrid, EV, sedan, or SUV.`
      : "Tell me your budget, body style, and whether you prefer hybrid or EV, and I can narrow the inventory.";
  }
  if (detectedIntent === "financing") {
    return "I can help you take the next financing step, but I can’t promise approval or final payment terms here. Share your name and phone number and the team can follow up with exact options.";
  }
  return `I can help with inventory, financing interest, trade-ins, and dealership info. Crown Vic Auto Sales is at ${dealershipFacts.addressLine}, ${dealershipFacts.city}.`;
}
