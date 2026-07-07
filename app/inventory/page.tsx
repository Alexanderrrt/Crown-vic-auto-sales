import { InventoryGrid } from "@/components/inventory-grid";
import { getInventory } from "@/lib/inventory";

export default async function InventoryPage() {
  const inventoryVehicles = await getInventory();
  return (
    <main className="min-h-screen bg-[#f5f2ea] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Inventory</p>
        <h1 className="mt-2 text-4xl font-black">Browse the current lot</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">
          This is the new searchable inventory experience. In production, the cards will populate from Supabase and can be filtered by price, body style, mileage, and more.
        </p>
        <InventoryGrid vehicles={inventoryVehicles} />
      </div>
    </main>
  );
}
