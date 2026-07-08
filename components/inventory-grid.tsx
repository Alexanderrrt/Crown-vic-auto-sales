import Link from "next/link";
import Image from "next/image";
import { VehicleCollectionActions } from "@/components/vehicle-collection-actions";
import type { Vehicle } from "@/lib/dealership-data";

export function InventoryGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {vehicles.map((vehicle, index) => (
        <article
          key={vehicle.id}
          className="group overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,242,233,0.94))] shadow-[0_22px_60px_rgba(148,163,184,0.16)] transition hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(148,163,184,0.22)]"
        >
          <Link href={`/inventory/${vehicle.slug}`} className="block">
            <div className="relative aspect-[4/3]">
              <Image
                src={vehicle.image}
                alt={vehicle.title}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold capitalize text-slate-950 shadow-sm">
                {vehicle.status ?? "available"}
              </span>
              {vehicle.isFeatured ? <span className="absolute right-3 top-3 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">Featured</span> : null}
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{vehicle.category}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-950">{vehicle.title}</h3>
                </div>
                <p className="text-xl font-black text-slate-950">{vehicle.price}</p>
              </div>
              <p className="line-clamp-2 text-sm leading-6 text-slate-600">{vehicle.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <Chip>{vehicle.mileage}</Chip>
                <Chip>{vehicle.transmission}</Chip>
                <Chip>{vehicle.drivetrain}</Chip>
                {vehicle.fuelType && <Chip>{vehicle.fuelType}</Chip>}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/70 pt-3">
                <span className="text-sm font-semibold text-slate-700">View details</span>
                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white transition group-hover:bg-amber-300 group-hover:text-slate-950">
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
  return <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 font-medium shadow-sm">{children}</span>;
}
