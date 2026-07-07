import Image from "next/image";
import { AdminVehicleForm } from "@/components/admin-vehicle-form";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const vehicles = await getInventory();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <AdminVehicleForm />

      <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Current lot</p>
        <h1 className="mt-2 text-2xl font-black">Inventory control</h1>
        <div className="mt-5 overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="py-3 pr-4">Vehicle</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Mileage</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={vehicle.image} alt={vehicle.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-black">{vehicle.title}</p>
                        <p className="text-xs text-neutral-500">{vehicle.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-bold">{vehicle.price}</td>
                  <td className="py-3 pr-4 text-neutral-600">{vehicle.mileage}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-bold capitalize">{vehicle.status}</span>
                  </td>
                  <td className="py-3 pr-4">{vehicle.isFeatured ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
