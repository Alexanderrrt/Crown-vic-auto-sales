"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Vehicle } from "@/lib/dealership-data";

const SAVED_KEY = "crown-vic-saved";
const COMPARE_KEY = "crown-vic-compare";

export function SavedVehiclesPanel({ vehicles }: { vehicles: Vehicle[] }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setSavedSlugs(readList(SAVED_KEY));
      setCompareSlugs(readList(COMPARE_KEY));
    };
    sync();
    window.addEventListener("crown-vic-collection-change", sync as EventListener);
    return () => window.removeEventListener("crown-vic-collection-change", sync as EventListener);
  }, []);

  const saved = vehicles.filter((vehicle) => savedSlugs.includes(vehicle.slug));
  const compared = vehicles.filter((vehicle) => compareSlugs.includes(vehicle.slug));

  if (!saved.length && !compared.length) return null;

  return (
    <section className="mt-8 rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,233,0.95))] p-5 shadow-[0_22px_60px_rgba(148,163,184,0.16)]">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Saved vehicles</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Your shortlist</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {saved.length ? saved.map((vehicle) => <Pill key={vehicle.id} href={`/inventory/${vehicle.slug}`} label={vehicle.title} />) : <Empty text="Save vehicles while you browse." />}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Compare queue</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Vehicles to compare</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {compared.length
              ? compared.map((vehicle) => <Pill key={vehicle.id} href={`/inventory/${vehicle.slug}`} label={`${vehicle.title} - ${vehicle.price}`} />)
              : <Empty text="Add up to four vehicles to compare." />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white">
      {label}
    </Link>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

function readList(key: string) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
