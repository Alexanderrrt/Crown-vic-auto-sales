"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  CarFront,
  CalendarClock,
  Clock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
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
      <div className="bg-slate-900 text-slate-300">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs font-medium sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-red-400" />
            <span>
              {dealershipFacts.addressLine}, {dealershipFacts.city}
            </span>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-red-400" />
              {dealershipFacts.hours}
            </span>
            <a href={`tel:${dealershipFacts.phoneHref}`} className="flex items-center gap-1.5 font-semibold text-white transition hover:text-red-300">
              <Phone className="h-3.5 w-3.5 text-red-400" />
              {dealershipFacts.phone}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-base font-bold tracking-tight text-slate-900">Crown Vic Auto Sales</p>
              <p className="text-xs text-slate-500">Hybrid &amp; EV specialists — San Jose</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {publicLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`tel:${dealershipFacts.phoneHref}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
            >
              <Phone className="h-4 w-4" />
              {dealershipFacts.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-700"
            >
              <MessageCircle className="h-4 w-4" />
              Talk to sales
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
              <div className="flex flex-col gap-2">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      pathname === link.href ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="grid gap-2 border-t border-slate-200 pt-3">
                <a
                  href={`tel:${dealershipFacts.phoneHref}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <Phone className="h-4 w-4" />
                  Call {dealershipFacts.phone}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <CarFront className="h-5 w-5" />
              </div>
              <p className="font-heading text-lg font-bold tracking-tight">Crown Vic Auto Sales</p>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Pre-owned hybrids and EVs, hand-picked for Bay Area commuters. Compare vehicles, ask questions, and move into
              trade-in, financing, or a test drive without the usual dealership friction.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-700"
              >
                Shop inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
              >
                <CalendarClock className="h-4 w-4" />
                Book a test drive
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Visit and contact</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>
                  {dealershipFacts.addressLine}
                  <br />
                  {dealershipFacts.city}
                </span>
              </p>
              <a
                href={`tel:${dealershipFacts.phoneHref}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-red-400" />
                {dealershipFacts.phone}
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="font-semibold text-white">{dealershipFacts.hours}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Explore</p>
            <div className="mt-5 flex flex-col gap-2">
              <FooterLink href="/inventory" label="Browse inventory" />
              <FooterLink href="/contact" label="Financing and trade-in help" />
              <FooterLink href="/contact" label="Talk to the dealership" />
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto w-full max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} Crown Vic Auto Sales. All vehicles subject to prior sale.
          </p>
        </div>
      </footer>
    </>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}
