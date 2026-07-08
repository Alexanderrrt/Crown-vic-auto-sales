import { NextResponse } from "next/server";
import { guardPublicRequest } from "@/lib/request-guard";
import { getSupabaseServerAnon } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { appointmentSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const guard = guardPublicRequest(req, {
    key: "appointment-form",
    limit: 4,
    windowMs: 15 * 60 * 1000,
    honeypot: typeof body.website === "string" ? body.website : "",
    content: `${String(body.message ?? "")} ${String(body.email ?? "")} ${String(body.phone ?? "")}`,
  });
  if (!guard.ok) {
    return NextResponse.json({ ok: false, error: guard.error }, { status: guard.status });
  }

  const parsed = appointmentSchema.safeParse({ ...body, source: body.source ?? "test-drive" });

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin() ?? getSupabaseServerAnon();
  if (!client) {
    return NextResponse.json({ ok: false, error: "Appointment storage is not configured yet." }, { status: 503 });
  }

  const payload = parsed.data;
  const lead = await client
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
      status: "appointment",
    })
    .select("id")
    .single();

  if (lead.error) {
    return NextResponse.json({ ok: false, error: lead.error.message }, { status: 500 });
  }

  const appointment = await client
    .from("appointments")
    .insert({
      lead_id: lead.data.id,
      vehicle_slug: payload.vehicleSlug,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      appointment_at: payload.appointmentAt || null,
    })
    .select("id")
    .single();

  if (appointment.error) {
    return NextResponse.json({ ok: false, error: appointment.error.message }, { status: 500 });
  }

  await client.from("lead_events").insert({
    lead_id: lead.data.id,
    event_type: "appointment_requested",
    note: "Test-drive appointment requested",
    metadata: { appointmentId: appointment.data.id, vehicleSlug: payload.vehicleSlug ?? null, requestIp: guard.identity.ip },
  });

  await client.from("analytics_events").insert({
    event_type: "appointment_requested",
    vehicle_slug: payload.vehicleSlug,
    lead_id: lead.data.id,
    metadata: { appointmentId: appointment.data.id, source: payload.source },
  });

  return NextResponse.json({ ok: true, leadId: lead.data.id, appointmentId: appointment.data.id });
}
