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
      <div className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
        <label className="flex h-11 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3">
          <Search className="h-4 w-4 text-neutral-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search make, model, body, fuel..." />
        </label>
        <Select icon={<SlidersHorizontal className="h-4 w-4" />} label="Body" value={bodyStyle} onChange={setBodyStyle} options={bodyStyles} />
        <Select icon={<SlidersHorizontal className="h-4 w-4" />} label="Fuel" value={fuelType} onChange={setFuelType} options={fuelTypes} />
        <Select icon={<SlidersHorizontal className="h-4 w-4" />} label="Budget" value={maxPrice} onChange={setMaxPrice} options={["all", "12000", "16000", "20000", "26000"]} format={formatBudget} />
        <Select icon={<ArrowUpDown className="h-4 w-4" />} label="Sort" value={sort} onChange={(value) => setSort(value as SortMode)} options={["featured", "price-low", "mileage-low", "newest"]} format={formatSort} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
        <p>{filteredVehicles.length} vehicles match your search</p>
        <p>Updated from Supabase when configured</p>
      </div>

      {filteredVehicles.length ? (
        <InventoryGrid vehicles={filteredVehicles} />
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center">
          <p className="text-lg font-black text-neutral-950">No vehicles matched those filters.</p>
          <p className="mt-2 text-sm text-neutral-600">Try widening the budget or changing the body style.</p>
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
    <label className="flex h-11 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3">
      <span className="text-neutral-500">{icon}</span>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm outline-none">
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
