"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import type { Vehicle } from "@/lib/dealership-data";

const emptyForm = {
  vehicleId: "",
  title: "",
  year: "",
  make: "",
  model: "",
  trim: "",
  vin: "",
  stockNumber: "",
  category: "Inventory",
  summary: "",
  price: "",
  mileage: "",
  mpg: "",
  transmission: "Automatic",
  drivetrain: "FWD",
  exteriorColor: "",
  interiorColor: "",
  fuelType: "",
  bodyStyle: "",
  image: "",
  media: "",
  specs: "",
  status: "available",
  isFeatured: false,
};

export function AdminVehicleForm({ vehicles = [] }: { vehicles?: Vehicle[] }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [form, setForm] = useState(emptyForm);

  async function submit(formData: FormData) {
    setState("loading");
    setMessage("");

    const title = String(formData.get("title") ?? "");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const vehicleId = String(formData.get("vehicleId") ?? "");
    const response = await fetch("/api/admin/vehicles", {
      method: vehicleId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: vehicleId || undefined,
        title,
        slug,
        year: String(formData.get("year") ?? ""),
        make: String(formData.get("make") ?? ""),
        model: String(formData.get("model") ?? ""),
        trim: String(formData.get("trim") ?? ""),
        vin: String(formData.get("vin") ?? ""),
        stockNumber: String(formData.get("stockNumber") ?? ""),
        category: String(formData.get("category") ?? "Inventory"),
        summary: String(formData.get("summary") ?? ""),
        price: String(formData.get("price") ?? ""),
        mileage: String(formData.get("mileage") ?? ""),
        mpg: String(formData.get("mpg") ?? ""),
        transmission: String(formData.get("transmission") ?? "Automatic"),
        drivetrain: String(formData.get("drivetrain") ?? "FWD"),
        exteriorColor: String(formData.get("exteriorColor") ?? ""),
        interiorColor: String(formData.get("interiorColor") ?? ""),
        fuelType: String(formData.get("fuelType") ?? ""),
        bodyStyle: String(formData.get("bodyStyle") ?? ""),
        image: String(formData.get("image") ?? ""),
        media: parseLines(String(formData.get("media") ?? "")),
        specs: parseSpecs(String(formData.get("specs") ?? "")),
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
    setMessage(vehicleId ? "Vehicle updated. Refresh the page to review changes." : "Vehicle created. Refresh the page to see it in the manager.");
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
      <h2 className="mt-2 text-2xl font-black text-slate-950">{selectedVehicleId ? "Edit vehicle" : "Add vehicle"}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Create a listing with the pricing, media, specs, and merchandising details your team needs so the vehicle detail page feels complete from day one.
      </p>
      <input type="hidden" name="vehicleId" value={form.vehicleId} />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="md:col-span-3">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Mode</span>
          <select
            value={selectedVehicleId}
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedVehicleId(nextId);
              if (!nextId) {
                setForm(emptyForm);
                return;
              }

              const vehicle = vehicles.find((item) => item.id === nextId);
              if (!vehicle) return;

              setForm({
                vehicleId: vehicle.id,
                title: vehicle.title,
                year: vehicle.year ? String(vehicle.year) : "",
                make: vehicle.make ?? "",
                model: vehicle.model ?? "",
                trim: vehicle.trim ?? "",
                vin: vehicle.vin ?? "",
                stockNumber: vehicle.stockNumber ?? "",
                category: vehicle.category,
                summary: vehicle.summary,
                price: vehicle.price,
                mileage: vehicle.mileage,
                mpg: vehicle.mpg,
                transmission: vehicle.transmission,
                drivetrain: vehicle.drivetrain,
                exteriorColor: vehicle.exteriorColor ?? "",
                interiorColor: vehicle.interiorColor ?? "",
                fuelType: vehicle.fuelType ?? "",
                bodyStyle: vehicle.bodyStyle ?? "",
                image: vehicle.image,
                media: (vehicle.media ?? []).join("\n"),
                specs: (vehicle.specs ?? []).map((spec) => `${spec.group} | ${spec.label} | ${spec.value}`).join("\n"),
                status: vehicle.status ?? "available",
                isFeatured: Boolean(vehicle.isFeatured),
              });
            }}
            className="h-12 w-full rounded-2xl border border-white/80 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          >
            <option value="">Create new vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.title}
              </option>
            ))}
          </select>
        </label>
        <Field name="title" label="Title" required className="md:col-span-2" value={form.title} onChange={setForm} />
        <Field name="year" label="Year" value={form.year} onChange={setForm} />
        <Field name="make" label="Make" value={form.make} onChange={setForm} />
        <Field name="model" label="Model" value={form.model} onChange={setForm} />
        <Field name="trim" label="Trim" value={form.trim} onChange={setForm} />
        <Field name="vin" label="VIN" value={form.vin} onChange={setForm} />
        <Field name="stockNumber" label="Stock #" value={form.stockNumber} onChange={setForm} />
        <Field name="category" label="Category" value={form.category} onChange={setForm} />
        <Field name="price" label="Price" value={form.price} onChange={setForm} />
        <Field name="mileage" label="Mileage" value={form.mileage} onChange={setForm} />
        <Field name="mpg" label="MPG / MPGe" value={form.mpg} onChange={setForm} />
        <Field name="transmission" label="Transmission" value={form.transmission} onChange={setForm} />
        <Field name="drivetrain" label="Drivetrain" value={form.drivetrain} onChange={setForm} />
        <Field name="exteriorColor" label="Exterior color" value={form.exteriorColor} onChange={setForm} />
        <Field name="interiorColor" label="Interior color" value={form.interiorColor} onChange={setForm} />
        <Field name="fuelType" label="Fuel type" value={form.fuelType} onChange={setForm} />
        <Field name="bodyStyle" label="Body style" value={form.bodyStyle} onChange={setForm} />
        <Field name="image" label="Image URL" className="md:col-span-2" value={form.image} onChange={setForm} />
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
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
            value={form.summary}
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            className="w-full resize-none rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          />
        </label>
        <label className="md:col-span-3">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Gallery image URLs</span>
          <textarea
            name="media"
            rows={4}
            value={form.media}
            onChange={(event) => setForm((current) => ({ ...current, media: event.target.value }))}
            placeholder={"One image URL per line"}
            className="w-full resize-none rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          />
        </label>
        <label className="md:col-span-3">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Vehicle specs</span>
          <textarea
            name="specs"
            rows={5}
            value={form.specs}
            onChange={(event) => setForm((current) => ({ ...current, specs: event.target.value }))}
            placeholder={"Format: Group | Label | Value\nExample: Highlights | Trim | SE"}
            className="w-full resize-none rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
          />
        </label>
        <label className="inline-flex w-fit items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-slate-800">
          <input
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
            className="h-4 w-4 rounded border-amber-400 text-amber-600"
          />
          Feature on homepage
        </label>
      </div>
      <button
        disabled={state === "loading"}
        className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        <PlusCircle className="h-4 w-4" />
        {state === "loading" ? "Saving..." : selectedVehicleId ? "Update vehicle" : "Create vehicle"}
      </button>
      {message && <p className={`mt-3 text-sm font-semibold ${state === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</p>}
    </form>
  );
}

function Field({
  name,
  label,
  required = false,
  className = "",
  value,
  onChange,
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        required={required}
        name={name}
        value={value}
        onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))}
        className="h-12 w-full rounded-2xl border border-white/80 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/70"
      />
    </label>
  );
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSpecs(value: string) {
  return value
    .split(/\r?\n/)
    .map((line, index) => {
      const [group = "Features", label = "", specValue = ""] = line.split("|").map((part) => part.trim());
      if (!label || !specValue) return null;
      return {
        group,
        label,
        value: specValue,
        sortOrder: index,
      };
    })
    .filter((item): item is { group: string; label: string; value: string; sortOrder: number } => Boolean(item));
}
