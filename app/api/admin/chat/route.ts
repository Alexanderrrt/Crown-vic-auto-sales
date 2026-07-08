import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const chatUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["ai_active", "needs_human", "closed"]).optional(),
  summary: z.string().max(1200).optional(),
  createLead: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = chatUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const updates: Record<string, unknown> = {};
  if (typeof parsed.data.status === "string") updates.status = parsed.data.status;
  if (typeof parsed.data.summary === "string") updates.summary = parsed.data.summary;
  if (!Object.keys(updates).length && !parsed.data.createLead) {
    return NextResponse.json({ ok: false, error: "No changes provided." }, { status: 400 });
  }

  if (Object.keys(updates).length) {
    const { error } = await client.from("chat_sessions").update(updates).eq("id", parsed.data.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (parsed.data.createLead) {
    const { data: session, error: sessionError } = await client
      .from("chat_sessions")
      .select("id, lead_id, vehicle_slug, buyer_intent, chat_messages(role, content)")
      .eq("id", parsed.data.id)
      .single();

    if (sessionError) return NextResponse.json({ ok: false, error: sessionError.message }, { status: 500 });
    if (session.lead_id) return NextResponse.json({ ok: true, leadId: session.lead_id });

    const messages = Array.isArray(session.chat_messages) ? session.chat_messages : [];
    const firstUserMessage = messages.find((message) => message.role === "user");
    const summary = typeof parsed.data.summary === "string" ? parsed.data.summary : "";

    const { data: lead, error: leadError } = await client
      .from("leads")
      .insert({
        source: "ai-chat",
        name: "AI chat shopper",
        phone: "",
        email: "",
        message: summary || String(firstUserMessage?.content ?? "Lead created from chat inbox."),
        vehicle_slug: session.vehicle_slug ?? null,
        status: "new",
        budget: session.buyer_intent ?? null,
      })
      .select("id")
      .single();

    if (leadError) return NextResponse.json({ ok: false, error: leadError.message }, { status: 500 });

    await Promise.all([
      client.from("chat_sessions").update({ lead_id: lead.id, status: "needs_human" }).eq("id", parsed.data.id),
      client.from("lead_events").insert({
        lead_id: lead.id,
        event_type: "lead_created_from_chat",
        note: `Lead created from chat session ${parsed.data.id}`,
        clerk_user_id: userId,
        metadata: { chatSessionId: parsed.data.id },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
