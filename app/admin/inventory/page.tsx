import { AdminPageIntro } from "@/components/admin-page-intro";
import { AdminVehicleForm } from "@/components/admin-vehicle-form";
import { InventoryAdminTable } from "@/components/inventory-admin-table";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const vehicles = await getInventory();

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Inventory management"
        title="Inventory"
        body="Use the form to add or edit a vehicle. Use the table to feature, publish, or remove listings quickly."
      />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminVehicleForm vehicles={vehicles} />
        <InventoryAdminTable vehicles={vehicles} />
      </div>
    </div>
  );
}
