import { NextResponse } from "next/server";
import { guardPublicRequest } from "@/lib/request-guard";
import { getSupabaseServerAnon } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { leadSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const guard = guardPublicRequest(req, {
    key: "lead-form",
    limit: 6,
    windowMs: 15 * 60 * 1000,
    honeypot: typeof body.website === "string" ? body.website : "",
    content: `${String(body.message ?? "")} ${String(body.email ?? "")}`,
  });
  if (!guard.ok) {
    return NextResponse.json({ ok: false, error: guard.error }, { status: guard.status });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin() ?? getSupabaseServerAnon();
  if (!client) {
    return NextResponse.json({ ok: false, error: "Lead storage is not configured yet." }, { status: 503 });
  }

  const payload = parsed.data;
  const { data, error } = await client
    .from("leads")
    .insert({
      source: payload.source,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      vehicle_slug: payload.vehicleSlug,
      budget: payload.budget,
      trade_vehicle: payload.tradeVehicle,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  await Promise.all([
    client.from("lead_events").insert({
      lead_id: data.id,
      event_type: "lead_created",
      note: `Lead created from ${payload.source}`,
      metadata: { vehicleSlug: payload.vehicleSlug ?? null, requestIp: guard.identity.ip },
    }),
    client.from("analytics_events").insert({
      event_type: "lead_created",
      vehicle_slug: payload.vehicleSlug,
      lead_id: data.id,
      metadata: { source: payload.source, budget: payload.budget ?? null, tradeVehicle: payload.tradeVehicle ?? null },
    }),
  ]);

  return NextResponse.json({ ok: true, leadId: data.id });
}
