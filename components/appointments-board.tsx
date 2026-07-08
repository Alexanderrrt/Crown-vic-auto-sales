"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Appointment } from "@/lib/admin-data";

const statuses = ["requested", "confirmed", "completed", "cancelled"] as const;

export function AppointmentsBoard({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function updateAppointment(id: string, status: string) {
    setBusyId(id);
    setMessage("");
    const response = await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update appointment.");
      setBusyId(null);
      return;
    }
    setMessage("Appointment updated.");
    startTransition(() => router.refresh());
    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {appointments.map((appointment) => {
          const busy = busyId === appointment.id || isPending;
          return (
            <article key={appointment.id} className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">{appointment.vehicleSlug ?? "walk-in"}</p>
                  <h2 className="mt-1 text-xl font-black">{appointment.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{formatDate(appointment.appointmentAt)}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold capitalize">{appointment.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-neutral-600">
                <a href={`tel:${appointment.phone}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100">
                  <Phone className="h-3 w-3" />
                  Call
                </a>
                {appointment.email ? (
                  <a href={`mailto:${appointment.email}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100">
                    <Mail className="h-3 w-3" />
                    Email
                  </a>
                ) : null}
                <Link href={`/admin/appointments/${appointment.id}`} className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900 transition hover:bg-amber-100">
                  Open workspace
                </Link>
              </div>
              <div className="mt-4">
                <select
                  defaultValue={appointment.status}
                  disabled={busy}
                  onChange={(event) => updateAppointment(appointment.id, event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Schedule pending";
  return date.toLocaleString();
}
