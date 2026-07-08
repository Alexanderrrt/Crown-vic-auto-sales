"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  CarFront,
  CalendarClock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { dealershipFacts } from "@/lib/dealership-data";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/contact", label: "Contact" },
];

const mobilePrompts = [
  "Hybrid and EV focused inventory",
  "AI showroom assistance",
  "Financing, trade-in, and test-drive help",
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
      <div className="border-b border-slate-200/70 bg-[linear-gradient(90deg,#f4ead6,#f7f2e8,#edf4f1)]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
            <span>Independent hybrid and EV dealership</span>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <span>{dealershipFacts.hours}</span>
            <span>{dealershipFacts.city}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[linear-gradient(180deg,rgba(11,24,31,0.96),rgba(17,35,44,0.92))] text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#f4c56a,#f29e5a)] text-slate-950 shadow-[0_12px_26px_rgba(242,158,90,0.24)]">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-amber-200">Crown Vic Auto Sales</p>
              <p className="text-sm text-slate-300">Premium hybrid and EV buying experience</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {publicLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${dealershipFacts.phoneHref}`}
              className="rounded-full border border-white/14 bg-white/6 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone className="mr-2 inline h-4 w-4 text-amber-200" />
              {dealershipFacts.phone}
            </a>
            <Link
              href="/contact"
              className="rounded-full bg-[linear-gradient(135deg,#f4c56a,#f29e5a)] px-4 py-2 text-sm font-black text-slate-950 transition hover:brightness-105"
            >
              <MessageCircle className="mr-2 inline h-4 w-4" />
              Talk to sales
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-white/6 text-white md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-white/8 bg-[linear-gradient(180deg,#12212b,#10212a)] px-4 py-4 md:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-4">
                <div className="flex items-center gap-2 text-amber-200">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Modern shopping flow</p>
                </div>
                <div className="mt-3 space-y-2">
                  {mobilePrompts.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/6 px-3 py-3 text-sm font-semibold text-slate-100">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                      pathname === link.href ? "bg-white text-slate-950" : "bg-white/6 text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="grid gap-3">
                <a href={`tel:${dealershipFacts.phoneHref}`} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-white">
                  Call {dealershipFacts.phone}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[linear-gradient(135deg,#f4c56a,#f29e5a)] px-4 py-3 text-sm font-black text-slate-950"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-slate-200/70 bg-[linear-gradient(180deg,#10212a,#132833_48%,#1e3941_100%)] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-amber-200">Crown Vic Auto Sales</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.03em] text-white">
              A modern storefront for buyers shopping smarter hybrids and EVs.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Built to help buyers compare vehicles, ask better questions, and move into trade-in, financing, and test-drive steps without the usual dealership friction.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f4c56a,#f29e5a)] px-4 py-2 text-sm font-black text-slate-950 transition hover:brightness-105"
              >
                Shop inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/6 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <CalendarClock className="h-4 w-4 text-amber-200" />
                Book a test drive
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Visit and contact</p>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <p className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/6 p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                <span>
                  {dealershipFacts.addressLine}
                  <br />
                  {dealershipFacts.city}
                </span>
              </p>
              <a href={`tel:${dealershipFacts.phoneHref}`} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/6 p-4 font-bold text-white transition hover:bg-white/10">
                <Phone className="h-4 w-4 text-amber-200" />
                {dealershipFacts.phone}
              </a>
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Hours</p>
                <p className="mt-2 font-bold text-white">{dealershipFacts.hours}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Explore</p>
            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/inventory" label="Browse inventory" />
              <FooterLink href="/contact" label="Financing and trade-in help" />
              <FooterLink href="/contact" label="Talk to the dealership" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-slate-100 transition hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}
