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

    setState("success");
  }

  return (
    <form action={submit} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-amber-700">
        {source === "test-drive" ? <CalendarClock className="h-4 w-4" /> : <SendHorizontal className="h-4 w-4" />}
        <p className="text-xs font-bold uppercase tracking-[0.18em]">{source.replace("-", " ")}</p>
      </div>
      <h2 className="mt-2 text-xl font-black text-neutral-950">{title}</h2>

      <div className={`mt-5 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field name="name" label="Name" required />
        <Field name="phone" label="Phone" required />
        <Field name="email" label="Email" type="email" />
        <Field name="budget" label="Budget" />
        {source === "trade-in" && <Field name="tradeVehicle" label="Trade vehicle" className={compact ? "" : "sm:col-span-2"} />}
        {source === "test-drive" && <Field name="appointmentAt" label="Preferred time" className={compact ? "" : "sm:col-span-2"} />}
        <label className={compact ? "" : "sm:col-span-2"}>
          <span className="mb-1.5 block text-sm font-semibold text-neutral-700">Message</span>
          <textarea name="message" rows={compact ? 3 : 4} className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-400" />
        </label>
      </div>

      {state === "success" ? (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Sent. The sales team can follow up from the CRM.
        </div>
      ) : (
        <button disabled={state === "loading"} className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
          <SendHorizontal className="h-4 w-4" />
          {state === "loading" ? "Sending..." : "Send"}
        </button>
      )}

      {state === "error" && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </form>
  );
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
      <span className="mb-1.5 block text-sm font-semibold text-neutral-700">{label}</span>
      <input required={required} name={name} type={type} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none transition focus:border-neutral-400" />
    </label>
  );
}
