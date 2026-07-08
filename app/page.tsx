import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  Clock,
  Leaf,
  MapPin,
  MessageCircle,
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
    title: "EV answers in plain language",
    body: "Range, charging, and fit-for-your-life questions answered without the jargon.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Trade-in and financing help",
    body: "Get a direction on your trade and monthly budget before you ever set foot on the lot.",
    icon: <BadgeDollarSign className="h-5 w-5" />,
  },
];

const conciergePrompts = [
  "Show me hybrids under $15k",
  "Best mpg options for rideshare",
  "Help me trade in my current car",
  "Which EV is best for commuting?",
];

const buyingSteps = [
  { number: "01", title: "Browse the lot", body: "Start with featured picks or filter the full inventory by budget, body style, and fuel type." },
  { number: "02", title: "Ask anything", body: "Use the concierge for mpg, pricing, trade-in, and EV questions — or call the team directly." },
  { number: "03", title: "Visit and drive", body: "Book a test drive and finish the paperwork with a team that has done this for 22+ years." },
];

export default async function Home() {
  const inventoryVehicles = await getInventory();
  const featuredVehicles = inventoryVehicles.filter((vehicle) => vehicle.isFeatured).slice(0, 3);
  const homepageFeatured = featuredVehicles.length ? featuredVehicles : inventoryVehicles.slice(0, 3);
  const quickInventory = inventoryVehicles.slice(0, 6);

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(220,38,38,0.16),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(148,163,184,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="animate-fade-up space-y-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-300">
              <Sparkles className="h-4 w-4" />
              San Jose hybrid &amp; EV specialists
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Find the right pre-owned hybrid or EV, faster.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Hand-picked, fuel-efficient inventory in San Jose. Browse featured vehicles, filter the lot to your budget,
                and get real answers from our showroom concierge in minutes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition duration-200 hover:bg-red-700"
              >
                Shop inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to sales
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {siteStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-heading text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {shopperSignals.map((signal) => (
                <div key={signal.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-red-400">{signal.icon}</div>
                  <h2 className="mt-3 font-heading text-base font-semibold text-white">{signal.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{signal.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up animation-delay-200 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">AI showroom concierge</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">Start with a question, not a form.</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Live assistant</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Ask about pricing, mpg, trade-ins, or EV options — the assistant knows the lot and connects you with the team when you&apos;re ready.
              </p>
              <div className="mt-4 grid gap-2">
                {conciergePrompts.map((prompt) => (
                  <div key={prompt} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    &ldquo;{prompt}&rdquo;
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <MapPin className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Visit the showroom</p>
                </div>
                <p className="mt-3 font-heading text-lg font-bold">{dealershipFacts.addressLine}</p>
                <p className="mt-1 text-sm text-slate-600">{dealershipFacts.city}</p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white">
                  <Clock className="h-4 w-4 text-red-400" />
                  <p className="text-sm font-semibold">{dealershipFacts.hours}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <CalendarClock className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Open 7 days</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Walk-ins welcome, or book a test drive ahead of time and we&apos;ll have the vehicle ready.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
                >
                  Book a visit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustSignals.map((signal) => (
            <div
              key={signal.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <signal.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">{signal.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{signal.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Featured inventory</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Vehicles worth a first look</h2>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
          >
            Full inventory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {homepageFeatured.map((vehicle) => (
            <FeaturedVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Browse the lot</p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Search by budget, body style, and fuel type.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Every listing shows price, mileage, and mpg up front — save the ones you like and compare them side by side.
              </p>
            </div>
            <InventoryFilters />
          </div>

          <div className="mt-4">
            <InventoryGrid vehicles={quickInventory} />
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800"
            >
              Explore full inventory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-slate-900 p-7 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-400">How buying works</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Three steps from browsing to keys.</h2>
            <div className="mt-6 space-y-3">
              {buyingSteps.map((step) => (
                <div key={step.number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 font-heading text-xs font-bold text-white">
                    {step.number}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Star className="mt-1 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm leading-6 text-slate-300">
                Not sure where to start? Ask the concierge about hybrid sedans under your budget, EV commuting, or what works best for rideshare.
              </p>
            </div>
          </div>

          <ChatPanel />
        </div>
      </section>
    </main>
  );
}
