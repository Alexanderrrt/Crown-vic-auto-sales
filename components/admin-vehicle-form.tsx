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
    <form action={submit} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-amber-700">
        <PlusCircle className="h-4 w-4" />
        <p className="text-xs font-bold uppercase tracking-[0.18em]">Inventory manager</p>
      </div>
      <h2 className="mt-2 text-2xl font-black">Add vehicle</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
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
          <span className="mb-1.5 block text-sm font-semibold text-neutral-700">Status</span>
          <select name="status" className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="md:col-span-3">
          <span className="mb-1.5 block text-sm font-semibold text-neutral-700">Summary</span>
          <textarea name="summary" rows={3} className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none" />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-neutral-700">
          <input name="isFeatured" type="checkbox" className="h-4 w-4" />
          Feature on homepage
        </label>
      </div>
      <button disabled={state === "loading"} className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60">
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
      <span className="mb-1.5 block text-sm font-semibold text-neutral-700">{label}</span>
      <input required={required} name={name} className="h-11 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none transition focus:border-neutral-400" />
    </label>
  );
}
