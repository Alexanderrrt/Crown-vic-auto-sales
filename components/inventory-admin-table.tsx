"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Vehicle } from "@/lib/dealership-data";

export function InventoryAdminTable({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function runAction(vehicleId: string, body: Record<string, unknown>, method: "PATCH" | "DELETE") {
    setPendingId(vehicleId);
    setMessage("");

    const response = await fetch("/api/admin/vehicles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: vehicleId, ...body }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      setMessage(typeof result.error === "string" ? result.error : "Could not update inventory.");
      setPendingId(null);
      return;
    }

    setMessage(method === "DELETE" ? "Vehicle removed from inventory." : "Inventory updated.");
    startTransition(() => router.refresh());
    setPendingId(null);
  }

  return (
    <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Current lot</p>
      <h1 className="mt-2 text-2xl font-black">Inventory control</h1>
      <p className="mt-2 text-sm text-slate-600">Quickly feature vehicles, cycle their live status, or remove older units from the lot.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MiniGuide title="Feature" body="Push a vehicle higher across the shopper experience." />
        <MiniGuide title="Set status" body="Use available for live units, pending for active deals, and draft for hidden work." />
        <MiniGuide title="Delete" body="Remove a unit only when you are sure it should leave the system." />
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-slate-700">{message}</p> : null}
      <div className="mt-5 overflow-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="py-3 pr-4">Vehicle</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">Mileage</th>
              <th className="py-3 pr-4">Media</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Featured</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.map((vehicle) => {
              const busy = pendingId === vehicle.id || isPending;
              const nextStatus = vehicle.status === "draft" ? "available" : vehicle.status === "available" ? "pending" : "draft";

              return (
                <tr key={vehicle.id} className="transition hover:bg-slate-50/80">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={vehicle.image} alt={vehicle.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-black">{vehicle.title}</p>
                        <p className="text-xs text-neutral-500">{[vehicle.category, vehicle.trim, vehicle.stockNumber].filter(Boolean).join(" | ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-bold">{vehicle.price}</td>
                  <td className="py-3 pr-4 text-neutral-600">{vehicle.mileage}</td>
                  <td className="py-3 pr-4 text-neutral-600">{vehicle.media?.length ?? 0} images</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold capitalize">{vehicle.status}</span>
                  </td>
                  <td className="py-3 pr-4">{vehicle.isFeatured ? "Yes" : "No"}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => runAction(vehicle.id, { isFeatured: !vehicle.isFeatured }, "PATCH")}
                        className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50"
                      >
                        {vehicle.isFeatured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => runAction(vehicle.id, { status: nextStatus }, "PATCH")}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Set {nextStatus}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => runAction(vehicle.id, {}, "DELETE")}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MiniGuide({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
