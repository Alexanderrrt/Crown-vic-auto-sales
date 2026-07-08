import Link from "next/link";
import { ArrowRight, CarFront, Fuel, Gauge, MapPin, MessageCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import { FeaturedVehicleCard } from "@/components/featured-vehicle-card";
import { InventoryFilters } from "@/components/inventory-filters";
import { InventoryGrid } from "@/components/inventory-grid";
import { ChatPanel } from "@/components/chat-panel";
import { dealershipFacts, siteStats, trustSignals } from "@/lib/dealership-data";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function Home() {
  const inventoryVehicles = await getInventory();
  const featuredVehicles = inventoryVehicles.filter((vehicle) => vehicle.isFeatured).slice(0, 2);
  const homepageFeatured = featuredVehicles.length ? featuredVehicles : inventoryVehicles.slice(0, 2);

  return (
    <main className="bg-[radial-gradient(circle_at_top_left,_rgba(232,141,78,0.26),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(69,142,144,0.16),_transparent_24%),linear-gradient(180deg,_#161717_0%,_#1a212b_38%,_#f4ede1_38%,_#fbf6ee_100%)] text-slate-950">
      <section className="mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col gap-10 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-300/10 px-4 py-2 text-sm font-medium text-orange-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              <Sparkles className="h-4 w-4" />
              Premium modern dealership experience
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Find the right hybrid or EV without the usual dealership friction.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Shop Crown Vic Auto Sales with intelligent filters, deep vehicle detail pages, and an AI assistant that can help with trade-ins, financing, and vehicle matching in seconds.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-300 via-amber-300 to-lime-200 px-6 py-3.5 font-semibold text-slate-950 shadow-[0_14px_28px_rgba(236,151,79,0.28)] transition hover:translate-y-[-1px] hover:brightness-105" href="/inventory">
                Shop inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:border-cyan-200/40 hover:bg-white/10" href="/contact">
                <MessageCircle className="h-4 w-4" />
                Talk to sales
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {siteStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-5 text-white shadow-2xl shadow-black/20 backdrop-blur">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,#fff7ec,#ffffff)] p-4 shadow-2xl shadow-black/30">
            <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,#101922,#1e2938)] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-300">AI showroom</p>
                  <h2 className="mt-2 text-2xl font-bold">Ask about any car</h2>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">Online now</div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-200">
                <ChatPrompt label="Budget" value="Show me hybrid SUVs under $20k" />
                <ChatPrompt label="Need" value="Recommend the best commuter EVs" />
                <ChatPrompt label="Trade-in" value="Estimate my trade and monthly payment" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <QuickFact icon={<MapPin className="h-4 w-4" />} label={dealershipFacts.city} value={dealershipFacts.addressLine} />
                <QuickFact icon={<Fuel className="h-4 w-4" />} label="Specialty" value="Hybrid + EV" />
                <QuickFact icon={<ShieldCheck className="h-4 w-4" />} label="Business hours" value="Daily walk-ins" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trustSignals.map((signal) => (
            <div key={signal.title} className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#1a212b,#111827)] p-6 text-white shadow-xl shadow-slate-950/20">
              <signal.icon className="h-6 w-6 text-orange-300" />
              <h3 className="mt-4 text-lg font-semibold">{signal.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{signal.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] bg-[linear-gradient(180deg,#ffffff,#fff7ea)] p-6 shadow-xl shadow-orange-100/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-700">Featured inventory</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">Cars worth putting on your shortlist</h2>
              </div>
              <Link className="hidden rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 md:inline-flex" href="/inventory">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {homepageFeatured.map((vehicle) => (
                <FeaturedVehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(180deg,#15202a,#0f172a)] p-6 text-white shadow-xl shadow-slate-950/25">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Why Crown Vic</p>
            <h2 className="mt-2 text-3xl font-black">Built for buyers who want clarity, not pressure.</h2>
            <div className="mt-6 space-y-4">
              <ValueRow icon={<CarFront className="h-5 w-5" />} title="Smart search" body="Filter by make, body style, mileage, drivetrain, price, and more." />
              <ValueRow icon={<Gauge className="h-5 w-5" />} title="Faster decisions" body="See featured inventory, payment-friendly options, and quick answers in chat." />
              <ValueRow icon={<Star className="h-5 w-5" />} title="Trust-first experience" body="Structured lead capture, transparent details, and dealer credibility throughout." />
            </div>
            <div className="mt-6 rounded-3xl bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(45,212,191,0.12))] p-5">
              <p className="text-sm text-slate-300">Need a recommendation?</p>
              <p className="mt-2 text-2xl font-bold">Tell the AI what you need and it will narrow the lot for you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-orange-100 bg-[linear-gradient(180deg,#fffaf2,#f9ecdb)] p-6 shadow-xl shadow-orange-100/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-700">Browse inventory</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Search the lot like a modern storefront</h2>
            </div>
            <InventoryFilters />
          </div>
          <InventoryGrid vehicles={inventoryVehicles.slice(0, 8)} />
          <div className="mt-6 flex justify-center">
            <Link className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#243447)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110" href="/inventory">
              Explore full inventory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ChatPanel />
      </section>
    </main>
  );
}

function ChatPrompt({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">{label}</p>
      <p className="mt-1 text-base">{value}</p>
    </div>
  );
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
      <div className="flex items-center gap-2 text-amber-300">
        {icon}
        <p className="text-xs uppercase tracking-[0.3em]">{label}</p>
      </div>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}

function ValueRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mt-1 text-amber-300">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">{body}</p>
      </div>
    </div>
  );
}
