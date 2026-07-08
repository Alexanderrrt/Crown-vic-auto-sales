import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const leadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "appointment", "won", "lost", "spam"]).optional(),
  note: z.string().max(1000).optional(),
  task: z.string().max(240).optional(),
  completeTask: z.string().uuid().optional(),
  assignedTo: z.string().max(120).optional(),
});

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = leadUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const { id, status, note, task, completeTask, assignedTo } = parsed.data;

  if (status) {
    const { error } = await client.from("leads").update({ status }).eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    await client.from("lead_events").insert({
      lead_id: id,
      event_type: "status_changed",
      note: `Lead moved to ${status}`,
      clerk_user_id: userId,
      metadata: { status },
    });
  }

  if (typeof assignedTo === "string") {
    const { error } = await client.from("leads").update({ assigned_to: assignedTo || null }).eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    await client.from("lead_events").insert({
      lead_id: id,
      event_type: "assignment_changed",
      note: assignedTo ? `Lead assigned to ${assignedTo}` : "Lead unassigned",
      clerk_user_id: userId,
      metadata: { assignedTo: assignedTo || null },
    });
  }

  if (note?.trim()) {
    const { error } = await client.from("lead_events").insert({
      lead_id: id,
      event_type: "note_added",
      note: note.trim(),
      clerk_user_id: userId,
      metadata: {},
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (task?.trim()) {
    const { error } = await client.from("lead_events").insert({
      lead_id: id,
      event_type: "task_created",
      note: task.trim(),
      clerk_user_id: userId,
      metadata: { completed: false },
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (completeTask) {
    const { error } = await client
      .from("lead_events")
      .update({
        event_type: "task_completed",
        metadata: { completed: true, completedAt: new Date().toISOString() },
      })
      .eq("id", completeTask)
      .eq("lead_id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
