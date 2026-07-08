"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { InventoryGrid } from "@/components/inventory-grid";
import type { Vehicle } from "@/lib/dealership-data";

type SortMode = "featured" | "price-low" | "mileage-low" | "newest";

export function InventoryExplorer({ vehicles }: { vehicles: Vehicle[] }) {
  const [query, setQuery] = useState("");
  const [bodyStyle, setBodyStyle] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sort, setSort] = useState<SortMode>("featured");
  const deferredQuery = useDeferredValue(query);

  const bodyStyles = unique(["all", ...vehicles.map((vehicle) => vehicle.bodyStyle ?? vehicle.category)]);
  const fuelTypes = unique(["all", ...vehicles.map((vehicle) => vehicle.fuelType ?? vehicle.category)]);

  const filteredVehicles = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();

    return vehicles
      .filter((vehicle) => {
        const searchable = [vehicle.title, vehicle.category, vehicle.summary, vehicle.make, vehicle.model, vehicle.fuelType, vehicle.bodyStyle].join(" ").toLowerCase();
        const matchesSearch = !search || searchable.includes(search);
        const matchesBody = bodyStyle === "all" || (vehicle.bodyStyle ?? vehicle.category) === bodyStyle;
        const matchesFuel = fuelType === "all" || (vehicle.fuelType ?? vehicle.category) === fuelType;
        const matchesPrice = maxPrice === "all" || (vehicle.priceNumber ?? parsePrice(vehicle.price)) <= Number(maxPrice);
        return matchesSearch && matchesBody && matchesFuel && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "price-low") return (a.priceNumber ?? parsePrice(a.price)) - (b.priceNumber ?? parsePrice(b.price));
        if (sort === "mileage-low") return (a.mileageNumber ?? parsePrice(a.mileage)) - (b.mileageNumber ?? parsePrice(b.mileage));
        if (sort === "newest") return (b.year ?? 0) - (a.year ?? 0);
        return Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false);
      });
  }, [vehicles, deferredQuery, bodyStyle, fuelType, maxPrice, sort]);

  return (
    <section className="mt-8">
      <div className="grid gap-3 rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,241,228,0.96))] p-4 shadow-[0_24px_70px_rgba(148,163,184,0.18)] lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
        <label className="flex h-12 items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-4">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 outline-none"
            placeholder="Search make, model, body, fuel..."
          />
        </label>
        <Select icon={<SlidersHorizontal className="h-4 w-4" />} label="Body" value={bodyStyle} onChange={setBodyStyle} options={bodyStyles} />
        <Select icon={<SlidersHorizontal className="h-4 w-4" />} label="Fuel" value={fuelType} onChange={setFuelType} options={fuelTypes} />
        <Select icon={<SlidersHorizontal className="h-4 w-4" />} label="Budget" value={maxPrice} onChange={setMaxPrice} options={["all", "12000", "16000", "20000", "26000"]} format={formatBudget} />
        <Select icon={<ArrowUpDown className="h-4 w-4" />} label="Sort" value={sort} onChange={(value) => setSort(value as SortMode)} options={["featured", "price-low", "mileage-low", "newest"]} format={formatSort} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <p>{filteredVehicles.length} vehicles match your search</p>
        <p className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-800">Updated from Supabase when configured</p>
      </div>

      {filteredVehicles.length ? (
        <InventoryGrid vehicles={filteredVehicles} />
      ) : (
        <div className="mt-8 rounded-[30px] border border-dashed border-amber-300 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,247,235,0.92))] p-10 text-center">
          <p className="text-lg font-black text-slate-950">No vehicles matched those filters.</p>
          <p className="mt-2 text-sm text-slate-600">Try widening the budget or changing the body style.</p>
        </div>
      )}
    </section>
  );
}

function Select({
  icon,
  label,
  value,
  options,
  onChange,
  format = titleCase,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  format?: (value: string) => string;
}) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-4">
      <span className="text-slate-500">{icon}</span>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
        {options.map((option) => (
          <option key={option} value={option}>
            {format(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function parsePrice(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function titleCase(value: string) {
  if (value === "all") return "All";
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatBudget(value: string) {
  return value === "all" ? "Any price" : `Under $${Number(value).toLocaleString()}`;
}

function formatSort(value: string) {
  const labels: Record<string, string> = {
    featured: "Featured",
    "price-low": "Price low",
    "mileage-low": "Mileage low",
    newest: "Newest",
  };
  return labels[value] ?? value;
}
