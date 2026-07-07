import { InventoryExplorer } from "@/components/inventory-explorer";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const inventoryVehicles = await getInventory();
  return (
    <main className="min-h-screen bg-[#f5f2ea] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Inventory</p>
        <h1 className="mt-2 text-4xl font-black">Browse the current lot</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">
          Search by budget, fuel type, body style, and mileage. Every inquiry can flow straight into the dealership CRM.
        </p>
        <InventoryExplorer vehicles={inventoryVehicles} />
      </div>
    </main>
  );
}
