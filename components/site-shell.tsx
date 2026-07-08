"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, MapPin, Menu, MessageCircle, Phone, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { dealershipFacts } from "@/lib/dealership-data";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isPublicRoute = !pathname.startsWith("/admin") && !pathname.startsWith("/sign-in") && !pathname.startsWith("/sign-up");

  if (!isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="border-b border-slate-200/70 bg-[#fff7eb]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
            <span>Hybrid and EV focused independent dealer</span>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <span>{dealershipFacts.hours}</span>
            <span>{dealershipFacts.city}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#243447)] text-white shadow-lg shadow-slate-900/10">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Crown Vic Auto Sales</p>
              <p className="text-sm text-slate-600">Premium hybrid and EV browsing</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {publicLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href={`tel:${dealershipFacts.phoneHref}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Phone className="mr-2 inline h-4 w-4" />
              {dealershipFacts.phone}
            </a>
            <Link href="/contact" className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">
              <MessageCircle className="mr-2 inline h-4 w-4" />
              Talk to sales
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    pathname === link.href ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href={`tel:${dealershipFacts.phoneHref}`} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                Call {dealershipFacts.phone}
              </a>
              <Link href="/contact" onClick={() => setOpen(false)} className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
                Talk to sales
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-[linear-gradient(180deg,#fff7eb,#f4ede1)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Crown Vic Auto Sales</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">A cleaner way to shop pre-owned hybrid and EV inventory.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Built to help buyers browse faster, ask smarter questions, and connect with the sales team without the usual dealership friction.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Visit</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-700" />
                <span>
                  {dealershipFacts.addressLine}
                  <br />
                  {dealershipFacts.city}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-700" />
                <a href={`tel:${dealershipFacts.phoneHref}`} className="font-semibold hover:text-slate-950">
                  {dealershipFacts.phone}
                </a>
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Browse</p>
            <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-700">
              <Link href="/inventory" className="hover:text-slate-950">
                Shop inventory
              </Link>
              <Link href="/contact" className="hover:text-slate-950">
                Financing and trade-in help
              </Link>
              <Link href="/contact" className="hover:text-slate-950">
                Book a test drive
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
