"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ChatSessionSummary } from "@/lib/admin-data";

export function ChatInbox({ sessions }: { sessions: ChatSessionSummary[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function updateSession(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    setMessage("");
    const response = await fetch("/api/admin/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update chat session.");
      setBusyId(null);
      return;
    }
    setMessage("Chat session updated.");
    startTransition(() => router.refresh());
    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <section className="grid gap-3 md:grid-cols-3">
        <HelperCard title="Keep AI active" body="Leave routine shopping chats open when the buyer is still browsing." />
        <HelperCard title="Mark for human" body="Use human follow-up when the shopper asks for a call, deal help, or next steps." />
        <HelperCard title="Convert to lead" body="Create a lead when there is real contact intent and the store should follow up." />
      </section>
      <div className="grid gap-4">
        {sessions.map((session) => {
          const busy = busyId === session.id || isPending;
          const lastMessages = session.messages.slice(-4);
          return (
            <article key={session.id} className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{formatIntent(session.buyerIntent)}</p>
                  <h3 className="mt-1 text-xl font-black">Session {session.id.slice(0, 8)}</h3>
                  <p className="mt-1 text-sm text-slate-600">{session.summary || "No AI summary yet."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold">{formatStatus(session.status)}</span>
                  {session.vehicleSlug ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">{session.vehicleSlug}</span> : null}
                  <Link href={`/admin/chat/${session.id}`} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100">
                    Open workspace
                  </Link>
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Conversation preview</p>
                  {lastMessages.length ? (
                    lastMessages.map((chat) => (
                      <div key={chat.id} className="rounded-xl bg-white px-3 py-2 text-sm shadow-sm">
                        <span className="font-bold capitalize">{chat.role}</span>: {chat.content}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No messages captured yet.</p>
                  )}
                </div>
                <div className="space-y-3">
                  <label>
                    <span className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Who owns this conversation</span>
                    <select
                      defaultValue={session.status}
                      disabled={busy}
                      onChange={(event) => updateSession(session.id, { status: event.target.value })}
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                    >
                      <option value="ai_active">AI is handling it</option>
                      <option value="needs_human">A teammate should reply</option>
                      <option value="closed">Conversation is closed</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => updateSession(session.id, { status: "needs_human" })}
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    Mark for human follow-up
                  </button>
                  {!session.leadId ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => updateSession(session.id, { createLead: true, status: "needs_human", summary: session.summary })}
                      className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 disabled:opacity-50"
                    >
                      Convert to lead
                    </button>
                  ) : null}
                  {session.leadId ? <p className="text-sm text-slate-600">Linked lead: {session.leadId}</p> : <p className="text-sm text-slate-600">No linked lead yet.</p>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function formatIntent(intent?: string | null) {
  return (intent || "general_shopping").replaceAll("_", " ");
}

function formatStatus(status: string) {
  switch (status) {
    case "ai_active":
      return "AI active";
    case "needs_human":
      return "Needs human";
    case "closed":
      return "Closed";
    default:
      return status.replaceAll("_", " ");
  }
}

function HelperCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
