import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildInventoryDigest,
  detectBuyerIntent,
  extractContactDetails,
  extractShopperName,
  extractVehiclePreferences,
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
  const preferences = extractVehiclePreferences(lastMessage);

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
      preferences,
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
You are the online sales assistant for ${dealershipFacts.name}, a San Jose dealership specializing in hybrid and EV vehicles.
You should feel very human: warm, grounded, conversational, and easy to talk to.
Your job is to help shoppers compare inventory, talk through trade-in or financing next steps, answer dealership questions, and smoothly hand serious buyers to the team.

Guardrails:
- Do not promise financing approval, final payment terms, warranties, or unavailable inventory.
- If a buyer is ready to buy, asks for financing, gives contact details, or needs exact terms, ask for name and phone and recommend staff follow-up.
- Never invent a vehicle, availability status, payment approval, or warranty coverage.
- Keep answers natural and conversational, not scripted or corporate.
- Usually answer in 2 to 4 sentences.
- Ask at most one helpful follow-up question when it would move the conversation forward.
- Use plain language and sound like a good dealership salesperson texting with a customer.
- When you mention vehicles, make the recommendation feel personal and specific rather than dumping a list.
- Avoid bullet lists unless the shopper explicitly asks for a list or comparison.
- Never say things like "I'd be happy to help", "I can certainly help with that", "as an AI", "great question", "absolutely!", "feel free", or "let me know" unless it sounds truly natural in context.
- Do not sound like customer support or a chatbot. Sound like a real human salesperson texting quickly but thoughtfully.
- Mirror the shopper's tone a little. If they are casual, be casual. If they are direct, be direct.
- Prefer specific observations over filler. If you mention a vehicle, say why it fits.
- Do not over-explain. No motivational fluff. No generic closing line in every reply.

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

    return humanizeReply(response.output_text?.trim() || fallbackReply(lastMessage, rankedVehicles, detectedIntent));
  } catch {
    return humanizeReply(fallbackReply(lastMessage, rankedVehicles, detectedIntent));
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
  preferences,
}: {
  sessionId: string;
  visitorId: string;
  message: string;
  vehicleSlug?: string;
  buyerIntent: string;
  contact: { email?: string; phone?: string };
  shopperName?: string;
  preferences: { bodyStyle?: string; fuelType?: string; useCase?: string };
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
      metadata: { sessionId, vehicleSlug: vehicleSlug ?? null, buyerIntent, shopperName: shopperName ?? null, preferences },
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
  if (lower.includes("hours")) return `We're open ${dealershipFacts.hours}. If you want, I can also help you narrow the inventory before you stop by.`;
  if (lower.includes("trade")) return "Absolutely. If you send your trade's year, make, model, mileage, and overall condition, I can help point you in the right direction and get the team involved.";
  if (lower.includes("budget") || lower.includes("under")) {
    const suggestions = rankedVehicles.slice(0, 3).map((vehicle) => vehicle.title).join(", ");
    return suggestions
      ? `A few strong matches in that range would be ${suggestions}. If you want, I can narrow that down even more based on whether you'd rather stay with a hybrid, go full EV, or stick to something like a sedan or SUV.`
      : "Tell me your budget and what kind of vehicle you want, and I can help narrow it down for you.";
  }
  if (detectedIntent === "financing") {
    return "I can help you get pointed in the right direction on financing, but I can't promise approval or exact payment terms here in chat. If you want, send your name and phone number and the team can follow up with real options.";
  }
  return `I can help with inventory, trade-ins, financing questions, and dealership info. Crown Vic Auto Sales is at ${dealershipFacts.addressLine}, ${dealershipFacts.city}. What are you shopping for right now?`;
}

function humanizeReply(reply: string) {
  const cleaned = reply
    .replace(/\b(?:I'd be happy to help(?: with that)?\.?\s*)/gi, "")
    .replace(/\b(?:I can certainly help(?: with that)?\.?\s*)/gi, "")
    .replace(/\b(?:As an AI|As a virtual assistant)[^.!?]*[.!?]\s*/gi, "")
    .replace(/\b(?:Great question[.!?]?\s*)/gi, "")
    .replace(/\b(?:Feel free to)[^.!?]*[.!?]\s*/gi, "")
    .replace(/\b(?:Let me know if you have any other questions[.!?]?\s*)/gi, "")
    .replace(/\b(?:Absolutely[.!]?\s*)/gi, "Yeah, ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned || "Tell me what you're trying to find and I'll narrow it down.";
}
