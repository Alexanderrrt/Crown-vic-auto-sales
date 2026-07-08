import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  CarFront,
  Gauge,
  Leaf,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { FeaturedVehicleCard } from "@/components/featured-vehicle-card";
import { InventoryFilters } from "@/components/inventory-filters";
import { InventoryGrid } from "@/components/inventory-grid";
import { dealershipFacts, siteStats, trustSignals } from "@/lib/dealership-data";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

const shopperSignals = [
  {
    title: "Commuter-ready hybrids",
    body: "High-mpg sedans and hatchbacks picked for Bay Area daily driving and rideshare value.",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    title: "EV guidance without guesswork",
    body: "Range, charging, and fit-for-life questions answered in plain language by the AI showroom.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Faster next steps",
    body: "Trade-in, financing interest, and appointment requests are built into every key shopping moment.",
    icon: <BadgeDollarSign className="h-5 w-5" />,
  },
];

const shopperBenefits = [
  {
    title: "Hybrid and EV first",
    body: "The homepage now leads with Crown Vic's real differentiator instead of feeling like a generic used-car lot.",
    icon: <CarFront className="h-5 w-5" />,
  },
  {
    title: "Clear buying path",
    body: "Browse featured vehicles, filter the lot, ask the assistant, then move into contact or test-drive flows naturally.",
    icon: <ArrowRight className="h-5 w-5" />,
  },
  {
    title: "Trust before pressure",
    body: "Hours, location, process clarity, and transparent language are surfaced early to reduce shopping friction.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

const conciergePrompts = [
  "Show me hybrids under $15k",
  "Best mpg options for rideshare",
  "Help me trade in my current car",
  "Which EV is best for commuting?",
];

export default async function Home() {
  const inventoryVehicles = await getInventory();
  const featuredVehicles = inventoryVehicles.filter((vehicle) => vehicle.isFeatured).slice(0, 3);
  const homepageFeatured = featuredVehicles.length ? featuredVehicles : inventoryVehicles.slice(0, 3);
  const quickInventory = inventoryVehicles.slice(0, 6);

  return (
    <main className="bg-[linear-gradient(180deg,#f5efe4_0%,#f7f1e7_14%,#e4ecea_14%,#edf2ef_38%,#f8f5ef_38%,#f7f4ee_100%)] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(191,219,187,0.28),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(242,163,90,0.26),transparent_22%),linear-gradient(135deg,#10212a_0%,#132833_45%,#1c3943_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-200 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                San Jose hybrid and EV specialists
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-black tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  A cleaner, faster way to shop pre-owned hybrids and EVs.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                  Crown Vic Auto Sales now feels like a modern automotive storefront, with featured inventory, intelligent filtering,
                  and an AI concierge that helps buyers narrow the lot in minutes.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/inventory"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f4c56a,#f29e5a)] px-6 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_18px_40px_rgba(242,158,90,0.26)] transition hover:translate-y-[-1px] hover:brightness-105"
                >
                  Shop inventory
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/12"
                >
                  <MessageCircle className="h-4 w-4" />
                  Talk to sales
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {siteStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur"
                  >
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {shopperSignals.map((signal) => (
                <div key={signal.title} className="rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <div className="text-amber-200">{signal.icon}</div>
                  <h2 className="mt-4 text-lg font-black">{signal.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{signal.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(248,242,229,0.98),rgba(255,255,255,0.98))] p-5 text-slate-950 shadow-[0_28px_60px_rgba(3,12,19,0.34)]">
              <div className="rounded-[28px] bg-[linear-gradient(145deg,#f6e9d1,#ffffff)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">AI showroom concierge</p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">Start with a question, not a form.</h2>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
                      Ask about pricing range, mpg, trade-in help, EV options, or the best commuter vehicles. The assistant routes qualified shoppers into the CRM.
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
                    Live assistant
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {conciergePrompts.map((prompt) => (
                    <div key={prompt} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Prompt idea</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f7f1e7)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-2 text-amber-700">
                  <MapPin className="h-4 w-4" />
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Visit the showroom</p>
                </div>
                <p className="mt-3 text-xl font-black text-slate-950">{dealershipFacts.addressLine}</p>
                <p className="mt-1 text-sm text-slate-600">{dealershipFacts.city}</p>
                <div className="mt-5 rounded-2xl bg-slate-950 px-4 py-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Hours</p>
                  <p className="mt-2 text-lg font-black">{dealershipFacts.hours}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#eaf1ef)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CalendarClock className="h-4 w-4" />
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Best next steps</p>
                </div>
                <div className="mt-4 space-y-3">
                  <StepRow number="01" title="Browse featured vehicles" body="See a tighter shortlist up front instead of digging through a generic grid first." />
                  <StepRow number="02" title="Use AI for fit and budget" body="Quickly narrow the lot around mpg, monthly comfort, body style, or EV needs." />
                  <StepRow number="03" title="Move into trade, finance, or test drive" body="The buying path stays clear across every major conversion step." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustSignals.map((signal) => (
            <div
              key={signal.title}
              className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f7f4ee)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
            >
              <signal.icon className="h-6 w-6 text-amber-700" />
              <h3 className="mt-4 text-lg font-black text-slate-950">{signal.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{signal.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <div className="rounded-[34px] bg-[linear-gradient(155deg,#12232d,#173240_58%,#254956_100%)] p-7 text-white shadow-[0_30px_60px_rgba(15,23,42,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">Why this feels better</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">A homepage that sells confidence, not clutter.</h2>
            <div className="mt-6 space-y-4">
              {shopperBenefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="mt-1 text-amber-200">{benefit.icon}</div>
                  <div>
                    <p className="text-base font-black">{benefit.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{benefit.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,rgba(242,158,90,0.18),rgba(134,239,172,0.12))] p-5">
              <div className="flex items-center gap-2 text-amber-200">
                <Gauge className="h-4 w-4" />
                <p className="text-xs font-black uppercase tracking-[0.18em]">Buyer experience</p>
              </div>
              <p className="mt-2 text-2xl font-black">Designed to get shoppers from "maybe" to "shortlist" much faster.</p>
            </div>
          </div>

          <div className="rounded-[34px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f5efe5)] p-7 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-700">Featured inventory</p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">Vehicles worth opening first</h2>
              </div>
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Full inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {homepageFeatured.map((vehicle) => (
                <FeaturedVehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-slate-200/80 bg-[linear-gradient(180deg,#fffdf8,#ecf3f0)] p-7 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Inventory search</p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">Search the lot like a real storefront, not a classifieds feed.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Filter quickly, save comparison candidates, and jump into vehicle pages with stronger specs, better media, and conversion actions built in.
              </p>
            </div>
            <InventoryFilters />
          </div>

          <div className="mt-6">
            <InventoryGrid vehicles={quickInventory} />
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
            >
              Explore full inventory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <div className="rounded-[34px] bg-[linear-gradient(155deg,#f4e7d0,#ffffff_55%,#edf5f2)] p-7 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-700">Human plus AI</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">Ask the assistant now, then let the team take it from there.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The assistant helps with inventory fit, pricing range, trade-in direction, hours, and test-drive questions, then hands high-intent shoppers into the dealership workflow.
            </p>

            <div className="mt-6 space-y-3">
              <MiniCallout
                title="Recommended for buyers"
                body="Ask about hybrid sedans under a budget, EV commuting options, test drives, and what makes the most sense for rideshare."
                icon={<Star className="h-5 w-5" />}
              />
              <MiniCallout
                title="Recommended for the dealership"
                body="High-intent conversations can be tracked, summarized, and routed into CRM follow-up instead of disappearing into a generic site widget."
                icon={<MessageCircle className="h-5 w-5" />}
              />
            </div>
          </div>

          <ChatPanel />
        </div>
      </section>
    </main>
  );
}

function StepRow({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black tracking-[0.14em] text-white">
        {number}
      </div>
      <div>
        <p className="font-black text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}

function MiniCallout({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="mt-1 text-amber-700">{icon}</div>
      <div>
        <p className="font-black text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}
