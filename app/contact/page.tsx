import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { dealershipFacts } from "@/lib/dealership-data";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to showroom
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="animate-fade-up space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Crown Vic Auto Sales</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Talk with a real sales team.</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                Ask about availability, financing, trade-ins, appointments, or the best hybrid and EV options for your budget.
              </p>
            </div>

            <div className="grid gap-3">
              <Info icon={<MapPin className="h-5 w-5" />} label="Visit" value={`${dealershipFacts.addressLine}, ${dealershipFacts.city}`} />
              <Info icon={<Phone className="h-5 w-5" />} label="Call" value={dealershipFacts.phone} href={`tel:${dealershipFacts.phoneHref}`} />
              <Info icon={<Clock className="h-5 w-5" />} label="Hours" value={dealershipFacts.hours} />
            </div>

            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-400">Prefer to talk now?</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Call during showroom hours and you&apos;ll reach the sales floor directly — no phone tree, no callback queue.
              </p>
              <a
                href={`tel:${dealershipFacts.phoneHref}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-red-700"
              >
                <Phone className="h-4 w-4" />
                {dealershipFacts.phone}
              </a>
            </div>
          </section>

          <div className="animate-fade-up animation-delay-100">
            <LeadForm source="contact" title="Send a message to sales" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="mt-1 font-semibold text-slate-900">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:bg-slate-100">
        {content}
      </a>
    );
  }

  return <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{content}</div>;
}
