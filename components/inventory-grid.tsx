import Link from "next/link";
import Image from "next/image";
import type { Vehicle } from "@/lib/dealership-data";

export function InventoryGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {vehicles.map((vehicle, index) => (
        <Link key={vehicle.id} href={`/inventory/${vehicle.slug}`} className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
          <div className="relative aspect-[4/3]">
            <Image src={vehicle.image} alt={vehicle.title} fill loading={index === 0 ? "eager" : "lazy"} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold capitalize text-slate-950 shadow-sm">
              {vehicle.status ?? "available"}
            </span>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{vehicle.category}</p>
                <h3 className="mt-1 font-bold text-slate-950">{vehicle.title}</h3>
              </div>
              <p className="text-lg font-black text-slate-950">{vehicle.price}</p>
            </div>
            <p className="text-sm text-slate-600">{vehicle.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              <Chip>{vehicle.mileage}</Chip>
              <Chip>{vehicle.transmission}</Chip>
              <Chip>{vehicle.drivetrain}</Chip>
              {vehicle.fuelType && <Chip>{vehicle.fuelType}</Chip>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium">{children}</span>;
}
