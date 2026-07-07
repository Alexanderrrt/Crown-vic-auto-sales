import Link from "next/link";
import Image from "next/image";
import { CarFront, Gauge, Fuel } from "lucide-react";
import type { Vehicle } from "@/lib/dealership-data";

export function FeaturedVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/inventory/${vehicle.slug}`} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image src={vehicle.image} alt={vehicle.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{vehicle.featuredLabel}</div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{vehicle.category}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{vehicle.title}</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-slate-600">
          <Meta icon={<CarFront className="h-4 w-4" />} label="Mileage" value={vehicle.mileage} />
          <Meta icon={<Gauge className="h-4 w-4" />} label="Price" value={vehicle.price} />
          <Meta icon={<Fuel className="h-4 w-4" />} label="MPG" value={vehicle.mpg} />
        </div>
      </div>
    </Link>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-1 text-slate-400">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
