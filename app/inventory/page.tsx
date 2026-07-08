import { InventoryExplorer } from "@/components/inventory-explorer";
import { SavedVehiclesPanel } from "@/components/saved-vehicles-panel";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const inventoryVehicles = await getInventory();
  return (
    <main className="min-h-screen bg-[#f7f1e7] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_42%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_32%)]" />
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Inventory</p>
        <h1 className="mt-2 text-4xl font-black sm:text-5xl">Browse the current lot</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
          Search by budget, fuel type, body style, and mileage. Every inquiry can flow straight into the dealership CRM.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
          <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-sm">Hybrid and EV focused inventory</span>
          <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-sm">Trade-in and financing CTAs on every listing</span>
          <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-sm">Built for faster lead capture</span>
        </div>
        <SavedVehiclesPanel vehicles={inventoryVehicles} />
        <InventoryExplorer vehicles={inventoryVehicles} />
      </div>
    </main>
  );
}
