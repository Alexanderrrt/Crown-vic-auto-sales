"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function AdminVehicleForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("loading");
    setMessage("");

    const title = String(formData.get("title") ?? "");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const response = await fetch("/api/admin/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        year: String(formData.get("year") ?? ""),
        make: String(formData.get("make") ?? ""),
        model: String(formData.get("model") ?? ""),
        category: String(formData.get("category") ?? "Inventory"),
        summary: String(formData.get("summary") ?? ""),
        price: String(formData.get("price") ?? ""),
        mileage: String(formData.get("mileage") ?? ""),
        mpg: String(formData.get("mpg") ?? ""),
        fuelType: String(formData.get("fuelType") ?? ""),
        bodyStyle: String(formData.get("bodyStyle") ?? ""),
        image: String(formData.get("image") ?? ""),
        status: String(formData.get("status") ?? "available"),
        isFeatured: formData.get("isFeatured") === "on",
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setState("error");
      setMessage(typeof result.error === "string" ? result.error : "Could not create vehicle.");
      return;
    }

    setState("success");
    setMessage("Vehicle created. Refresh the page to see it in the manager.");
  }

  return (
    <form
      action={submit}
      className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,243,235,0.96))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-center gap-2 text-amber-700">
        <PlusCircle className="h-4 w-4" />
        <p className="text-xs font-bold uppercase tracking-[0.18em]">Inventory manager</p>
      </div>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Add vehicle</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Create a new listing with the details your sales team and shoppers need first. You can refine media, pricing, and merchandising after publish.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Field name="title" label="Title" required className="md:col-span-2" />
        <Field name="year" label="Year" />
        <Field name="make" label="Make" />
        <Field name="model" label="Model" />
        <Field name="category" label="Category" />
        <Field name="price" label="Price" />
        <Field name="mileage" label="Mileage" />
        <Field name="mpg" label="MPG / MPGe" />
        <Field name="fuelType" label="Fuel type" />
        <Field name="bodyStyle" label="Body style" />
        <Field name="image" label="Image URL" className="md:col-span-2" />
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span>
          <select
            name="status"
            className="h-12 w-full rounded-2xl border border-white/80 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="md:col-span-3">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Summary</span>
          <textarea
            name="summary"
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          />
        </label>
        <label className="inline-flex w-fit items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-slate-800">
          <input name="isFeatured" type="checkbox" className="h-4 w-4 rounded border-amber-400 text-amber-600" />
          Feature on homepage
        </label>
      </div>
      <button
        disabled={state === "loading"}
        className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        <PlusCircle className="h-4 w-4" />
        {state === "loading" ? "Creating..." : "Create vehicle"}
      </button>
      {message && <p className={`mt-3 text-sm font-semibold ${state === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</p>}
    </form>
  );
}

function Field({ name, label, required = false, className = "" }: { name: string; label: string; required?: boolean; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        required={required}
        name={name}
        className="h-12 w-full rounded-2xl border border-white/80 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
      />
    </label>
  );
}
