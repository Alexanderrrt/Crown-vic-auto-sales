"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Lead, StaffProfile } from "@/lib/admin-data";

const stages = ["new", "contacted", "appointment", "won", "lost"] as const;

export function CrmBoard({ leads, staffProfiles }: { leads: Lead[]; staffProfiles: StaffProfile[] }) {
  const router = useRouter();
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [draftTasks, setDraftTasks] = useState<Record<string, string>>({});
  const [busyLeadId, setBusyLeadId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function updateLead(id: string, payload: Record<string, unknown>) {
    setBusyLeadId(id);
    setMessage("");
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update lead.");
      setBusyLeadId(null);
      return;
    }
    setMessage("Lead updated.");
    setDraftNotes((current) => ({ ...current, [id]: "" }));
    startTransition(() => router.refresh());
    setBusyLeadId(null);
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <section className="grid gap-3 md:grid-cols-3">
        <QuickHelpCard title="New" body="Fresh shoppers who need a first reply or assignment." />
        <QuickHelpCard title="Appointment" body="People close to visiting or already scheduled." />
        <QuickHelpCard title="Won or lost" body="Closed outcomes so the pipeline stays clean." />
      </section>
      <section className="grid gap-4 xl:grid-cols-5">
        {stages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.status === stage);
          return (
            <div key={stage} className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black capitalize">{stage}</h2>
                  <p className="mt-1 text-xs text-slate-500">{describeStage(stage)}</p>
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold">{stageLeads.length}</span>
              </div>
              <div className="mt-4 space-y-3">
                {!stageLeads.length ? <EmptyLane text={emptyStageMessage(stage)} /> : null}
                {stageLeads.map((lead) => {
                  const busy = busyLeadId === lead.id || isPending;
                  return (
                    <article key={lead.id} className="rounded-lg border border-slate-200 bg-white/90 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-black">{lead.name}</p>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          Open
                        </Link>
                      </div>
                      <p className="mt-1 line-clamp-3 text-sm text-neutral-600">{lead.message}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-neutral-600">
                        <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100">
                          <Phone className="h-3 w-3" />
                          Call
                        </a>
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100">
                            <Mail className="h-3 w-3" />
                            Email
                          </a>
                        )}
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-slate-600">
                        {lead.vehicleSlug ? <p>Vehicle: {lead.vehicleSlug}</p> : null}
                        {lead.budget ? <p>Budget: {lead.budget}</p> : null}
                        {lead.tradeVehicle ? <p>Trade: {lead.tradeVehicle}</p> : null}
                        {lead.assignedTo ? <p>Owner: {staffProfiles.find((staff) => staff.clerkUserId === lead.assignedTo)?.name ?? lead.assignedTo}</p> : <p>Owner: Unassigned</p>}
                      </div>
                      <div className="mt-3">
                        <select
                          defaultValue={lead.assignedTo ?? ""}
                          disabled={busy}
                          onChange={(event) => updateLead(lead.id, { assignedTo: event.target.value })}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none"
                        >
                          <option value="">Unassigned</option>
                          {staffProfiles.map((staff) => (
                            <option key={staff.clerkUserId} value={staff.clerkUserId}>
                              {staff.name} ({staff.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3">
                        <select
                          defaultValue={lead.status}
                          disabled={busy}
                          onChange={(event) => updateLead(lead.id, { status: event.target.value })}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none"
                        >
                          {stages.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                          <option value="spam">spam</option>
                        </select>
                      </div>
                      <div className="mt-3">
                        <textarea
                          value={draftNotes[lead.id] ?? ""}
                          onChange={(event) => setDraftNotes((current) => ({ ...current, [lead.id]: event.target.value }))}
                          rows={3}
                          placeholder="Add note for follow-up, objection, or appointment details"
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                        />
                        <button
                          type="button"
                          disabled={busy || !(draftNotes[lead.id] ?? "").trim()}
                          onClick={() => updateLead(lead.id, { note: draftNotes[lead.id] })}
                          className="mt-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                        >
                          Save note
                        </button>
                      </div>
                      <div className="mt-3">
                        <input
                          value={draftTasks[lead.id] ?? ""}
                          onChange={(event) => setDraftTasks((current) => ({ ...current, [lead.id]: event.target.value }))}
                          placeholder="Create follow-up task"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none"
                        />
                        <button
                          type="button"
                          disabled={busy || !(draftTasks[lead.id] ?? "").trim()}
                          onClick={() => updateLead(lead.id, { task: draftTasks[lead.id] })}
                          className="mt-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-900 disabled:opacity-50"
                        >
                          Add task
                        </button>
                      </div>
                      {lead.events?.length ? (
                        <div className="mt-3 border-t border-slate-200 pt-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Timeline</p>
                          <div className="mt-2 space-y-2">
                            {lead.events.slice(0, 4).map((event) => (
                              <div key={event.id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                <p>
                                  <span className="font-semibold capitalize">{event.eventType.replaceAll("_", " ")}</span>: {event.note}
                                </p>
                                <p className="mt-1 text-[11px] text-slate-500">{formatTimelineDate(event.createdAt)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {lead.events?.some((event) => event.eventType === "task_created") ? (
                        <div className="mt-3 border-t border-slate-200 pt-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Open tasks</p>
                          <div className="mt-2 space-y-2">
                            {lead.events
                              .filter((event) => event.eventType === "task_created" && !event.metadata?.completed)
                              .slice(0, 2)
                              .map((event) => (
                                <div key={event.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                                  <span>{event.note}</span>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => updateLead(lead.id, { completeTask: event.id })}
                                    className="rounded-full border border-slate-200 bg-white px-2 py-1 font-bold"
                                  >
                                    Complete
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function formatTimelineDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}

function describeStage(stage: (typeof stages)[number]) {
  switch (stage) {
    case "new":
      return "Needs a first touch";
    case "contacted":
      return "Conversation started";
    case "appointment":
      return "Working toward a visit";
    case "won":
      return "Deal moved forward";
    case "lost":
      return "Closed without sale";
    default:
      return "";
  }
}

function emptyStageMessage(stage: (typeof stages)[number]) {
  switch (stage) {
    case "new":
      return "No fresh leads waiting right now.";
    case "contacted":
      return "No active follow-ups in this stage.";
    case "appointment":
      return "Nobody is parked in appointment stage right now.";
    case "won":
      return "Closed wins will appear here.";
    case "lost":
      return "Closed lost leads will appear here.";
    default:
      return "No leads here yet.";
  }
}

function QuickHelpCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function EmptyLane({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">{text}</p>;
}
