"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, SendHorizontal } from "lucide-react";

type LeadFormProps = {
  source: "contact" | "financing" | "trade-in" | "test-drive" | "vehicle-detail" | "ai-chat";
  vehicleSlug?: string;
  title?: string;
  compact?: boolean;
};

type FormState = "idle" | "loading" | "success" | "error";

export function LeadForm({ source, vehicleSlug, title = "Send an inquiry", compact = false }: LeadFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setState("loading");
    setError("");

    const payload = {
      source,
      vehicleSlug,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      tradeVehicle: String(formData.get("tradeVehicle") ?? ""),
      appointmentAt: String(formData.get("appointmentAt") ?? ""),
      website: String(formData.get("website") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const endpoint = source === "test-drive" ? "/api/appointments" : "/api/leads";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setState("error");
      setError(typeof result.error === "string" ? result.error : "Please check the form and try again.");
      return;
    }

    await trackLeadEvent({
      eventType: source === "test-drive" ? "appointment_request_submitted" : "lead_form_submitted",
      vehicleSlug,
      leadId: typeof result.leadId === "string" ? result.leadId : undefined,
      metadata: { source, compact },
    });
    setState("success");
  }

  return (
    <form action={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-red-600">
        {source === "test-drive" ? <CalendarClock className="h-4 w-4" /> : <SendHorizontal className="h-4 w-4" />}
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{source.replace("-", " ")}</p>
      </div>
      <h2 className="mt-2 font-heading text-xl font-bold text-slate-900">{title}</h2>

      <div className={`mt-5 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field name="name" label="Name" required />
        <Field name="phone" label="Phone" required />
        <Field name="email" label="Email" type="email" />
        <Field name="budget" label="Budget" />
        {source === "trade-in" && <Field name="tradeVehicle" label="Trade vehicle" className={compact ? "" : "sm:col-span-2"} />}
        {source === "test-drive" && <Field name="appointmentAt" label="Preferred time" className={compact ? "" : "sm:col-span-2"} />}
        <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
        <label className={compact ? "" : "sm:col-span-2"}>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Message</span>
          <textarea
            name="message"
            rows={compact ? 3 : 4}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        </label>
      </div>

      {state === "success" ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Sent. The sales team will follow up shortly.
        </div>
      ) : (
        <button
          disabled={state === "loading"}
          className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal className="h-4 w-4" />
          {state === "loading" ? "Sending..." : "Send"}
        </button>
      )}

      {state === "error" && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </form>
  );
}

async function trackLeadEvent({
  eventType,
  vehicleSlug,
  leadId,
  metadata,
}: {
  eventType: string;
  vehicleSlug?: string;
  leadId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        vehicleSlug,
        leadId,
        metadata: metadata ?? {},
      }),
    });
  } catch {
    // Ignore analytics delivery issues so lead capture never blocks.
  }
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        required={required}
        name={name}
        type={type}
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}
