import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Fuel, Gauge } from "lucide-react";
import type { Vehicle } from "@/lib/dealership-data";

export function FeaturedVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image src={vehicle.image} alt={vehicle.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">{vehicle.featuredLabel}</div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">{vehicle.category}</p>
            <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">{vehicle.title}</h3>
          </div>
          <p className="font-heading text-xl font-bold text-slate-900">{vehicle.price}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <Meta icon={<Gauge className="h-4 w-4" />} label="Mileage" value={vehicle.mileage} />
          <Meta icon={<Fuel className="h-4 w-4" />} label="MPG" value={vehicle.mpg} />
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <p className="text-sm font-semibold text-slate-600">See full details</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition duration-200 group-hover:bg-red-600">
            View
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-1.5 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
