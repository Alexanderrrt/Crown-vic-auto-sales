"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Appointment } from "@/lib/admin-data";

const statuses = ["requested", "confirmed", "completed", "cancelled"] as const;

export function AppointmentWorkspaceControls({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function updateAppointment(status: string) {
    setMessage("");
    const response = await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointment.id, status }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update appointment.");
      return;
    }
    setMessage("Appointment updated.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Visit status</label>
        <select
          defaultValue={appointment.status}
          disabled={isPending}
          onChange={(event) => updateAppointment(event.target.value)}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
        Status changes here sync back to the appointment desk and log CRM activity when a lead is linked.
      </div>
    </div>
  );
}
