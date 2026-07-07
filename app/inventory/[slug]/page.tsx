import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChatPanel } from "@/components/chat-panel";
import { inventoryVehicles } from "@/lib/dealership-data";
import { getVehicleBySlug } from "@/lib/inventory";

export const dynamicParams = false;

export function generateStaticParams() {
  return inventoryVehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <main className="bg-[#f5f2ea] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/70">
          <div className="relative aspect-[16/10] bg-slate-100">
            <Image src={vehicle.image} alt={vehicle.title} fill className="object-cover" />
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
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              A redesigned vehicle detail page should include CARFAX, options, financing links, trade-in valuation, and conversation prompts powered by the AI assistant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Get financing help
              </Link>
              <Link href="/contact" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
                Value my trade
              </Link>
            </div>
          </div>
        </section>
        <ChatPanel />
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{children}</span>;
}
