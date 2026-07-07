import OpenAI from "openai";
import { NextResponse } from "next/server";
import { dealershipFacts } from "@/lib/dealership-data";
import { getInventory } from "@/lib/inventory";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const lastMessage = String(messages.at(-1)?.content ?? "");
  const visitorId = String(body?.visitorId ?? "anonymous");
  const vehicleSlug = typeof body?.vehicleSlug === "string" ? body.vehicleSlug : undefined;
  const sessionId = await ensureChatSession({
    sessionId: typeof body?.sessionId === "string" ? body.sessionId : undefined,
    visitorId,
    vehicleSlug,
  });

  await logChatMessage(sessionId, "user", lastMessage);

  const reply = openai ? await createAiReply(messages, lastMessage) : fallbackReply(lastMessage);
  await logChatMessage(sessionId, "assistant", reply);

  return NextResponse.json({ message: reply, sessionId });
}

async function createAiReply(messages: Array<{ role?: string; content?: unknown }>, lastMessage: string) {
  const inventory = await getInventory();
  const system = `
You are the AI sales assistant for ${dealershipFacts.name}, a San Jose dealership specializing in hybrid and EV vehicles.
Help shoppers compare inventory, estimate trade-in next steps, request test drives, and route qualified buyers to staff.

Guardrails:
- Do not promise financing approval, final payment terms, warranties, or unavailable inventory.
- If a buyer is ready to buy, asks for financing, gives contact details, or needs exact terms, ask for name and phone and recommend staff follow-up.
- Keep answers concise, specific, and dealership-friendly.

Inventory snapshot:
${inventory
  .map((v) => `- ${v.title} | ${v.price} | ${v.mileage} | ${v.category} | ${v.transmission} | ${v.drivetrain} | ${v.status ?? "available"}`)
  .join("\n")}

Dealership:
- Phone: ${dealershipFacts.phone}
- Address: ${dealershipFacts.addressLine}, ${dealershipFacts.city}
- Hours: ${dealershipFacts.hours}
`.trim();

  try {
    const response = await openai!.responses.create({
      model: "gpt-5.1",
      input: [
        { role: "system", content: system },
        ...messages.slice(-10).map((message) => ({
          role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: String(message.content ?? ""),
        })),
      ],
    });

    return response.output_text?.trim() || fallbackReply(lastMessage);
  } catch {
    return fallbackReply(lastMessage);
  }
}

async function ensureChatSession({ sessionId, visitorId, vehicleSlug }: { sessionId?: string; visitorId: string; vehicleSlug?: string }) {
  const client = getSupabaseAdmin();
  if (!client) return sessionId ?? "local-session";
  if (sessionId) return sessionId;

  const { data } = await client
    .from("chat_sessions")
    .insert({
      visitor_id: visitorId,
      vehicle_slug: vehicleSlug,
      buyer_intent: vehicleSlug ? "vehicle_detail" : "general_shopping",
    })
    .select("id")
    .single();

  return data?.id ?? "local-session";
}

async function logChatMessage(sessionId: string, role: "user" | "assistant", content: string) {
  const client = getSupabaseAdmin();
  if (!client || sessionId === "local-session" || !content.trim()) return;

  await client.from("chat_messages").insert({ session_id: sessionId, role, content });
}

function fallbackReply(lastMessage: string) {
  const lower = lastMessage.toLowerCase();
  if (lower.includes("hours")) return `We're open ${dealershipFacts.hours}.`;
  if (lower.includes("trade")) return "Share your year, make, model, mileage, and condition and I can help route a trade-in request to the team.";
  if (lower.includes("budget") || lower.includes("under")) return "Tell me your budget, body style, and whether you prefer hybrid or EV, and I can narrow the inventory.";
  return `I can help with inventory, financing interest, trade-ins, and dealership info. Crown Vic Auto Sales is at ${dealershipFacts.addressLine}, ${dealershipFacts.city}.`;
}
