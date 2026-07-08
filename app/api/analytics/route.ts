import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const analyticsSchema = z.object({
  eventType: z.string().min(1).max(80),
  visitorId: z.string().max(120).optional(),
  vehicleSlug: z.string().max(160).optional(),
  leadId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  const parsed = analyticsSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: true });

  const payload = parsed.data;
  const { error } = await client.from("analytics_events").insert({
    event_type: payload.eventType,
    visitor_id: payload.visitorId,
    vehicle_slug: payload.vehicleSlug,
    lead_id: payload.leadId,
    metadata: payload.metadata ?? {},
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
