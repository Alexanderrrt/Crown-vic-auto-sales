import OpenAI from "openai";
import { NextResponse } from "next/server";
import { inventoryVehicles, dealershipFacts } from "@/lib/dealership-data";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const lastMessage = String(messages.at(-1)?.content ?? "");

  if (!openai) {
    return NextResponse.json({ message: fallbackReply(lastMessage) });
  }

  const system = `
You are the AI sales assistant for ${dealershipFacts.name}, a San Jose dealership specializing in hybrid and EV vehicles.
Goals:
- help shoppers find inventory that fits their budget and needs
- answer questions about hours, address, trade-ins, financing, and vehicle details
- encourage a handoff to sales when the user wants to buy, apply, or book a visit

Inventory snapshot:
${inventoryVehicles
  .map((v) => `- ${v.title} | ${v.price} | ${v.mileage} | ${v.category} | ${v.transmission} | ${v.drivetrain}`)
  .join("\n")}

Dealership facts:
- Phone: ${dealershipFacts.phone}
- Address: ${dealershipFacts.addressLine}, ${dealershipFacts.city}
- Hours: ${dealershipFacts.hours}

Keep responses concise, specific, and dealer-friendly.
`.trim();

  try {
    const response = await openai.responses.create({
      model: "gpt-5.1",
      input: [
        { role: "system", content: system },
        ...messages.slice(-10).map((message: { role?: string; content?: unknown }) => ({
          role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: String(message.content ?? ""),
        })),
      ],
    });

    const message = response.output_text?.trim() || fallbackReply(lastMessage);
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ message: fallbackReply(lastMessage) });
  }
}

function fallbackReply(lastMessage: string) {
  const lower = lastMessage.toLowerCase();
  if (lower.includes("hours")) return `We’re open ${dealershipFacts.hours}.`;
  if (lower.includes("trade")) return "Share your year, make, model, mileage, and condition and I’ll help estimate your trade.";
  if (lower.includes("budget") || lower.includes("under")) return "Tell me your budget, body style, and whether you want hybrid or EV, and I’ll narrow the lot.";
  return `I can help with inventory, financing, trade-ins, and dealership info. Crown Vic Auto Sales is at ${dealershipFacts.addressLine}, ${dealershipFacts.city}.`;
}
