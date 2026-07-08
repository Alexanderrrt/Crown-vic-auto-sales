"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, CalendarClock, CarFront, Inbox, LayoutDashboard, MessagesSquare } from "lucide-react";

const navGroups = [
  {
    label: "Daily work",
    items: [
      { href: "/admin", label: "Home", description: "Start here", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", description: "Call, text, follow up", icon: Inbox },
      { href: "/admin/appointments", label: "Appointments", description: "Confirm showroom visits", icon: CalendarClock },
      { href: "/admin/chat", label: "Chat", description: "Take over AI conversations", icon: MessagesSquare },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/inventory", label: "Inventory", description: "Update vehicles and pricing", icon: CarFront },
      { href: "/admin/activity", label: "Activity", description: "See the full customer timeline", icon: Activity },
      { href: "/admin/analytics", label: "Analytics", description: "Track performance and demand", icon: BarChart3 },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f2f4f7,#e7ebf0)] text-neutral-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800/70 bg-[linear-gradient(180deg,#171c24,#10141b)] p-5 text-white shadow-[24px_0_48px_rgba(15,23,42,0.18)] lg:block">
        <Link href="/" className="block">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Crown Vic</p>
          <h1 className="mt-1 text-xl font-black text-white">Dealer OS</h1>
          <p className="mt-2 text-sm text-slate-400">Built to make daily dealership work easier to understand and faster to act on.</p>
        </Link>
        <div className="mt-8 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{group.label}</p>
              <nav className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-2xl px-3 py-3 transition ${
                        active ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-black">{item.label}</p>
                          <p className={`text-xs ${active ? "text-slate-500" : "text-slate-500"}`}>{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,249,251,0.88))] px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Authenticated staff workspace</p>
              <h2 className="text-lg font-black text-slate-950">Daily tasks, customer follow-up, and dealership operations</h2>
            </div>
            {clerkConfigured ? (
              <UserButton />
            ) : (
              <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800">
                Clerk env needed
              </span>
            )}
          </div>
          <nav className="mt-3 flex gap-2 overflow-auto lg:hidden">
            {navGroups.flatMap((group) => group.items).map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white/80 px-3 text-sm font-bold text-slate-700">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
