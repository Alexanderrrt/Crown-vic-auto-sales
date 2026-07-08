"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ChatSessionSummary } from "@/lib/admin-data";

const statuses = ["ai_active", "needs_human", "closed"] as const;

export function ChatWorkspaceControls({ session }: { session: ChatSessionSummary }) {
  const router = useRouter();
  const [summary, setSummary] = useState(session.summary);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function updateSession(payload: Record<string, unknown>) {
    setMessage("");
    const response = await fetch("/api/admin/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, ...payload }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update chat session.");
      return;
    }
    setMessage("Chat session updated.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Takeover status</label>
        <select
          defaultValue={session.status}
          disabled={isPending}
          onChange={(event) => updateSession({ status: event.target.value })}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Sales summary</label>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={5}
          placeholder="Capture budget, vehicle interest, trade, and next best action"
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
        />
        <button
          type="button"
          disabled={isPending || !summary.trim()}
          onClick={() => updateSession({ summary })}
          className="mt-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          Save summary
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => updateSession({ status: "needs_human" })}
          className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 disabled:opacity-50"
        >
          Mark for follow-up
        </button>
        {!session.leadId ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => updateSession({ createLead: true, status: "needs_human", summary })}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900 disabled:opacity-50"
          >
            Convert to lead
          </button>
        ) : null}
      </div>
    </div>
  );
}
