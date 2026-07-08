import Link from "next/link";
import { ArrowLeft, MapPin, Phone, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { dealershipFacts } from "@/lib/dealership-data";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#14212d_0%,#1f3641_42%,#f7f1e7_42%,#f7f1e7_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to showroom
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Crown Vic Auto Sales</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">Talk with a real sales team.</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-200">
                Ask about availability, financing, trade-ins, appointments, or the best hybrid and EV options for your budget.
              </p>
            </div>

            <div className="grid gap-3">
              <Info icon={<MapPin className="h-5 w-5" />} label="Visit" value={`${dealershipFacts.addressLine}, ${dealershipFacts.city}`} />
              <Info icon={<Phone className="h-5 w-5" />} label="Call" value={dealershipFacts.phone} />
              <Info icon={<ShieldCheck className="h-5 w-5" />} label="Hours" value={dealershipFacts.hours} />
            </div>
          </section>

          <LeadForm source="contact" title="Send a message to sales" />
        </div>
      </div>
    </main>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur">
      <div className="text-amber-300">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}
