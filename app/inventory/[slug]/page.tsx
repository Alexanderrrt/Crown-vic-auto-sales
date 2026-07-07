import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChatPanel } from "@/components/chat-panel";
import { LeadForm } from "@/components/lead-form";
import { getVehicleBySlug } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <main className="bg-[#f5f2ea] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/70">
          <div className="relative aspect-[16/10] bg-slate-100">
            <Image src={vehicle.image} alt={vehicle.title} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">{vehicle.category}</p>
            <h1 className="mt-2 text-4xl font-black">{vehicle.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <Badge>{vehicle.price}</Badge>
              <Badge>{vehicle.mileage}</Badge>
              <Badge>{vehicle.mpg}</Badge>
              <Badge>{vehicle.transmission}</Badge>
              <Badge>{vehicle.drivetrain}</Badge>
            </div>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{vehicle.summary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Spec label="Stock" value={vehicle.stockNumber ?? "Available"} />
              <Spec label="Fuel" value={vehicle.fuelType ?? vehicle.category} />
              <Spec label="Body" value={vehicle.bodyStyle ?? "Ask sales"} />
              <Spec label="Status" value={vehicle.status ?? "available"} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#financing" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Get financing help
              </Link>
              <Link href="#trade" className="rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
                Value my trade
              </Link>
            </div>
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
          <LeadForm source="test-drive" vehicleSlug={vehicle.slug} title="Book a test drive" compact />
        </aside>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{children}</span>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize text-slate-950">{value}</p>
    </div>
  );
}
