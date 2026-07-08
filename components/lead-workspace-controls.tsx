"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Lead, StaffProfile } from "@/lib/admin-data";

const stages = ["new", "contacted", "appointment", "won", "lost", "spam"] as const;

export function LeadWorkspaceControls({ lead, staffProfiles }: { lead: Lead; staffProfiles: StaffProfile[] }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const openTasks = lead.events?.filter((event) => event.eventType === "task_created" && !event.metadata?.completed) ?? [];

  async function updateLead(payload: Record<string, unknown>) {
    setMessage("");
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, ...payload }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update lead.");
      return;
    }
    setMessage("Lead workspace updated.");
    if ("note" in payload) setNote("");
    if ("task" in payload) setTask("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Owner</label>
        <select
          defaultValue={lead.assignedTo ?? ""}
          disabled={isPending}
          onChange={(event) => updateLead({ assignedTo: event.target.value })}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          <option value="">Unassigned</option>
          {staffProfiles.map((staff) => (
            <option key={staff.clerkUserId} value={staff.clerkUserId}>
              {staff.name} ({staff.role})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Stage</label>
        <select
          defaultValue={lead.status}
          disabled={isPending}
          onChange={(event) => updateLead({ status: event.target.value })}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Add note</label>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Log an objection, financing note, or call summary"
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
        />
        <button
          type="button"
          disabled={isPending || !note.trim()}
          onClick={() => updateLead({ note })}
          className="mt-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          Save note
        </button>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Create task</label>
        <input
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Example: Call after work hours with updated payment estimate"
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
        />
        <button
          type="button"
          disabled={isPending || !task.trim()}
          onClick={() => updateLead({ task })}
          className="mt-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-900 disabled:opacity-50"
        >
          Add task
        </button>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Complete tasks</label>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
            {openTasks.length} open
          </span>
        </div>
        <div className="space-y-2">
          {openTasks.length ? (
            openTasks.map((openTask) => (
              <div key={openTask.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{openTask.note}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(openTask.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => updateLead({ completeTask: openTask.id })}
                  className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-900 disabled:opacity-50"
                >
                  Complete
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
              No active tasks on this lead right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
