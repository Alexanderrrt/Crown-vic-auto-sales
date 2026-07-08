import Link from "next/link";
import Image from "next/image";
import { VehicleCollectionActions } from "@/components/vehicle-collection-actions";
import type { Vehicle } from "@/lib/dealership-data";

export function InventoryGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle, index) => (
        <article
          key={vehicle.id}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <Link href={`/inventory/${vehicle.slug}`} className="block">
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={vehicle.image}
                alt={vehicle.title}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-900 shadow-sm">
                {vehicle.status ?? "available"}
              </span>
              {vehicle.isFeatured ? <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Featured</span> : null}
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">{vehicle.category}</p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">{vehicle.title}</h3>
                </div>
                <p className="font-heading text-xl font-bold text-slate-900">{vehicle.price}</p>
              </div>
              <p className="line-clamp-2 text-sm leading-6 text-slate-600">{vehicle.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <Chip>{vehicle.mileage}</Chip>
                <Chip>{vehicle.transmission}</Chip>
                <Chip>{vehicle.drivetrain}</Chip>
                {vehicle.fuelType && <Chip>{vehicle.fuelType}</Chip>}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-sm font-semibold text-slate-600">View details</span>
                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition duration-200 group-hover:bg-red-600">
                  Open listing
                </span>
              </div>
            </div>
          </Link>
          <div className="px-5 pb-5">
            <VehicleCollectionActions slug={vehicle.slug} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">{children}</span>;
}
