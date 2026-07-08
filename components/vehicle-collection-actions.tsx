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
        className={`rounded-full px-3 py-2 text-xs font-bold transition ${saved ? "bg-rose-100 text-rose-700" : "bg-white/90 text-slate-700"}`}
      >
        <Heart className="mr-1 inline h-3.5 w-3.5" />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => toggle(COMPARE_KEY, compared, setCompared)}
        className={`rounded-full px-3 py-2 text-xs font-bold transition ${compared ? "bg-teal-100 text-teal-800" : "bg-white/90 text-slate-700"}`}
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
