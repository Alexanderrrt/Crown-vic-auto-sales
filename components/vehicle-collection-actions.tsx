"use client";

import { Heart, Scale } from "lucide-react";
import { useState } from "react";

const SAVED_KEY = "crown-vic-saved";
const COMPARE_KEY = "crown-vic-compare";

export function VehicleCollectionActions({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [saved, setSaved] = useState(() => readList(SAVED_KEY).includes(slug));
  const [compared, setCompared] = useState(() => readList(COMPARE_KEY).includes(slug));

  function toggle(key: string, current: boolean, setter: (value: boolean) => void) {
    const list = readList(key);
    const next = current ? list.filter((item) => item !== slug) : [...new Set([...list, slug])].slice(0, 4);
    localStorage.setItem(key, JSON.stringify(next));
    setter(!current);
    window.dispatchEvent(new CustomEvent("crown-vic-collection-change"));
  }

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-4"}`}>
      <button
        type="button"
        onClick={() => toggle(SAVED_KEY, saved, setSaved)}
        className={`inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-xs font-semibold transition duration-200 ${
          saved ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Heart className={`mr-1 inline h-3.5 w-3.5 ${saved ? "fill-red-600 text-red-600" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => toggle(COMPARE_KEY, compared, setCompared)}
        className={`inline-flex min-h-9 items-center rounded-full border px-3 py-2 text-xs font-semibold transition duration-200 ${
          compared ? "border-slate-300 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Scale className="mr-1 inline h-3.5 w-3.5" />
        {compared ? "Comparing" : "Compare"}
      </button>
    </div>
  );
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
