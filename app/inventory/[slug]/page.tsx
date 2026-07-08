import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { LeadForm } from "@/components/lead-form";
import { VehicleCollectionActions } from "@/components/vehicle-collection-actions";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { VehicleViewTracker } from "@/components/vehicle-view-tracker";
import { getVehicleBySlug } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();
  const gallery = vehicle.media?.length ? vehicle.media : [vehicle.image];
  const specGroups = groupSpecs(vehicle.specs ?? []);

  return (
    <main className="bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <VehicleViewTracker vehicleSlug={vehicle.slug} />
      <div className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between gap-4">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inventory
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`tel:+14086845036`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:bg-slate-100"
          >
            <Phone className="h-4 w-4" />
            Call sales
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-700"
          >
            Ask a question
          </Link>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <VehicleGallery title={vehicle.title} images={gallery} />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-900 shadow-sm">{vehicle.status ?? "available"}</span>
              {vehicle.isFeatured ? <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Featured</span> : null}
            </div>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">{vehicle.category}</p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{vehicle.title}</h1>
              <p className="font-heading text-3xl font-bold text-slate-900">{vehicle.price}</p>
            </div>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{vehicle.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>{vehicle.mileage}</Badge>
              <Badge>{vehicle.mpg}</Badge>
              <Badge>{vehicle.transmission}</Badge>
              <Badge>{vehicle.drivetrain}</Badge>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Spec label="Stock" value={vehicle.stockNumber ?? "Available"} />
              <Spec label="Fuel" value={vehicle.fuelType ?? vehicle.category} />
              <Spec label="Body" value={vehicle.bodyStyle ?? "Ask sales"} />
              <Spec label="Status" value={vehicle.status ?? "available"} />
            </div>
            <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
              <ActionStat label="Why it stands out" value={vehicle.featuredLabel} />
              <ActionStat label="Best fit for" value={vehicle.bodyStyle ?? "Daily driving"} />
              <ActionStat label="Next move" value="Ask about payments or trade-in" />
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Equipment and highlights</p>
                    <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900">More detail before you reach out</h2>
                  </div>
                  <a
                    href={`https://www.carfax.com/VehicleHistory/ar20/${vehicle.vin ?? vehicle.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
                  >
                    CARFAX / history
                  </a>
                </div>
                <div className="mt-5 space-y-5">
                  {specGroups.length ? (
                    specGroups.map((group) => (
                      <div key={group.name}>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{group.name}</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {group.items.map((item) => (
                            <div key={`${group.name}-${item.label}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FallbackSpec label="Exterior color" value={vehicle.exteriorColor ?? "Ask sales"} />
                      <FallbackSpec label="Interior color" value={vehicle.interiorColor ?? "Ask sales"} />
                      <FallbackSpec label="Fuel type" value={vehicle.fuelType ?? "Ask sales"} />
                      <FallbackSpec label="Body style" value={vehicle.bodyStyle ?? "Ask sales"} />
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-400">Payment planning</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">Estimate before you ask.</h2>
                <div className="mt-5 space-y-3">
                  <PaymentRow label="Vehicle price" value={vehicle.price || "Ask sales"} />
                  <PaymentRow label="Estimated down" value={estimateDownPayment(vehicle.priceNumber)} />
                  <PaymentRow label="Estimated monthly" value={estimateMonthly(vehicle.priceNumber)} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Estimates are for shopping guidance only. Final monthly payment depends on credit, taxes, fees, lender terms, and approved structure.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#test-drive" className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-red-700">
                Book a test drive
              </Link>
              <Link href="#financing" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800">
                Get financing help
              </Link>
              <Link href="#trade" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100">
                Value my trade
              </Link>
            </div>
            <VehicleCollectionActions slug={vehicle.slug} compact />
          </div>
        </section>
        <aside className="space-y-5">
          <ChatPanel vehicleSlug={vehicle.slug} />
          <div id="financing">
            <LeadForm source="financing" vehicleSlug={vehicle.slug} title="Ask about payments" compact />
          </div>
          <div id="trade">
            <LeadForm source="trade-in" vehicleSlug={vehicle.slug} title="Value a trade-in" compact />
          </div>
          <div id="test-drive">
            <LeadForm source="test-drive" vehicleSlug={vehicle.slug} title="Book a test drive" compact />
          </div>
        </aside>
      </div>
      <div className="sticky bottom-4 z-20 mx-auto mt-6 flex w-full max-w-7xl justify-center px-2 lg:hidden">
        <div className="flex w-full max-w-xl items-center justify-between gap-2 rounded-full border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur">
          <a href={`tel:+14086845036`} className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
            Call
          </a>
          <Link href="#test-drive" className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">
            Test drive
          </Link>
          <Link href="#financing" className="flex-1 rounded-full bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white">
            Financing
          </Link>
        </div>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{children}</span>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize text-slate-900">{value}</p>
    </div>
  );
}

function ActionStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function FallbackSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PaymentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function estimateDownPayment(price?: number) {
  if (!price) return "Ask sales";
  return `$${Math.round(price * 0.1).toLocaleString()}`;
}

function estimateMonthly(price?: number) {
  if (!price) return "Ask sales";
  const monthly = Math.round((price * 0.9) / 60);
  return `$${monthly.toLocaleString()}/mo est.`;
}

function groupSpecs(specs: NonNullable<Awaited<ReturnType<typeof getVehicleBySlug>>>["specs"]) {
  const groups = new Map<string, { name: string; items: { label: string; value: string }[] }>();
  for (const spec of specs ?? []) {
    const name = spec.group || "Features";
    const existing = groups.get(name) ?? { name, items: [] };
    existing.items.push({ label: spec.label, value: spec.value });
    groups.set(name, existing);
  }
  return [...groups.values()];
}
