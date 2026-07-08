import Link from "next/link";
import { ArrowRight, BadgeDollarSign, BatteryCharging, CarFront, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { InventoryExplorer } from "@/components/inventory-explorer";
import { SavedVehiclesPanel } from "@/components/saved-vehicles-panel";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

const valueNotes = [
  {
    title: "Hybrid and EV first",
    body: "The lot is framed around efficient commuter value, electrified choices, and stronger fit-for-life browsing.",
    icon: <BatteryCharging className="h-5 w-5" />,
  },
  {
    title: "Conversion-ready browsing",
    body: "Trade-in, financing, availability, and appointment actions stay close to the listings instead of hiding deep in the site.",
    icon: <BadgeDollarSign className="h-5 w-5" />,
  },
  {
    title: "Cleaner decision path",
    body: "Shoppers can save, compare, filter, and move into detail pages with much less friction than the old directory-style flow.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export default async function InventoryPage() {
  const inventoryVehicles = await getInventory();
  const featuredCount = inventoryVehicles.filter((vehicle) => vehicle.isFeatured).length;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ee_0%,#edf3f0_18%,#f7f1e7_18%,#f7f4ee_100%)] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(191,219,187,0.28),transparent_26%),radial-gradient(circle_at_84%_24%,rgba(242,163,90,0.22),transparent_24%),linear-gradient(135deg,#10212a_0%,#132833_48%,#193844_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-14">
          <div className="space-y-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-200 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Inventory showroom
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-6xl">Browse the current lot like a premium storefront.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                Search by body style, fuel type, budget, and mileage, then save or compare the vehicles that actually fit your commute and price range.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f4c56a,#f29e5a)] px-6 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_18px_40px_rgba(242,158,90,0.24)] transition hover:brightness-105"
              >
                Ask about a vehicle
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/12"
              >
                <CarFront className="h-4 w-4" />
                Back to showroom
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard value={String(inventoryVehicles.length)} label="live vehicles" />
              <StatCard value={String(featuredCount)} label="featured picks" />
              <StatCard value="CRM-ready" label="lead capture flow" />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(248,242,229,0.98),rgba(255,255,255,0.98))] p-5 text-slate-950 shadow-[0_28px_60px_rgba(3,12,19,0.34)]">
            <div className="rounded-[28px] bg-[linear-gradient(145deg,#f5ead8,#ffffff)] p-5">
              <div className="flex items-center gap-2 text-emerald-700">
                <Gauge className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">What&apos;s better now</p>
              </div>
              <div className="mt-5 space-y-3">
                {valueNotes.map((note) => (
                  <div key={note.title} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-3 text-amber-700">
                      {note.icon}
                      <p className="font-black text-slate-950">{note.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{note.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SavedVehiclesPanel vehicles={inventoryVehicles} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-slate-200/80 bg-[linear-gradient(180deg,#fffdf8,#edf4f1)] p-7 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Search the lot</p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">Filter, shortlist, and compare with much less friction.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Every listing is part of a stronger buying flow now, with cleaner filtering, clearer highlights, and direct paths into dealership contact.
              </p>
            </div>
          </div>

          <InventoryExplorer vehicles={inventoryVehicles} />
        </div>
      </section>
    </main>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{label}</p>
    </div>
  );
}
