import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const appointmentUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["requested", "confirmed", "completed", "cancelled"]),
});

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = appointmentUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const { id, status } = parsed.data;
  const { data, error } = await client.from("appointments").update({ status }).eq("id", id).select("lead_id").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (data?.lead_id) {
    await client.from("lead_events").insert({
      lead_id: data.lead_id,
      event_type: "appointment_status",
      note: `Appointment marked ${status}`,
      clerk_user_id: userId,
      metadata: { appointmentId: id, status },
    });
  }

  return NextResponse.json({ ok: true });
}
