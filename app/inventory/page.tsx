import Link from "next/link";
import { ArrowRight, BadgeDollarSign, BatteryCharging, MessageCircle, ShieldCheck } from "lucide-react";
import { InventoryExplorer } from "@/components/inventory-explorer";
import { SavedVehiclesPanel } from "@/components/saved-vehicles-panel";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

const valueNotes = [
  {
    title: "Hybrid and EV first",
    body: "Efficient commuters and electrified vehicles make up the heart of the lot.",
    icon: <BatteryCharging className="h-5 w-5" />,
  },
  {
    title: "Everything up front",
    body: "Price, mileage, and mpg on every card — no calling just to find out the basics.",
    icon: <BadgeDollarSign className="h-5 w-5" />,
  },
  {
    title: "Save and compare",
    body: "Shortlist the vehicles you like and compare them side by side as you browse.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export default async function InventoryPage() {
  const inventoryVehicles = await getInventory();
  const featuredCount = inventoryVehicles.filter((vehicle) => vehicle.isFeatured).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(220,38,38,0.14),transparent_40%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="animate-fade-up max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-400">Current inventory</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Browse the lot.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              {inventoryVehicles.length} vehicles available now. Search by body style, fuel type, budget, and mileage — then
              save or compare the ones that fit your commute and price range.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition duration-200 hover:bg-red-700"
              >
                <MessageCircle className="h-4 w-4" />
                Ask about a vehicle
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
              >
                Back to showroom
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="animate-fade-up animation-delay-200 mt-10 grid gap-4 sm:grid-cols-3">
            <StatCard value={String(inventoryVehicles.length)} label="live vehicles" />
            <StatCard value={String(featuredCount)} label="featured picks" />
            <StatCard value="7 days" label="showroom availability" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {valueNotes.map((note) => (
            <div key={note.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">{note.icon}</div>
              <h2 className="mt-3 font-heading text-base font-semibold text-slate-900">{note.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{note.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SavedVehiclesPanel vehicles={inventoryVehicles} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Search the lot</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Filter, shortlist, and compare.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Narrow the lot to what actually fits, then open a listing for full specs, photos, and payment estimates.
            </p>
          </div>

          <InventoryExplorer vehicles={inventoryVehicles} />
        </div>
      </section>
    </main>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="font-heading text-2xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{label}</p>
    </div>
  );
}
