import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { BarChart3, CarFront, Inbox, LayoutDashboard, MessagesSquare } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Inventory", icon: CarFront },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/chat", label: "Chat", icon: MessagesSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white p-5 lg:block">
        <Link href="/" className="block">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700">Crown Vic</p>
          <h1 className="mt-1 text-xl font-black">Dealer OS</h1>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Authenticated staff workspace</p>
              <h2 className="text-lg font-black">Inventory, leads, chat, and analytics</h2>
            </div>
            {clerkConfigured ? (
              <UserButton />
            ) : (
              <span className="rounded-md bg-amber-100 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800">
                Clerk env needed
              </span>
            )}
          </div>
          <nav className="mt-3 flex gap-2 overflow-auto lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm font-bold">
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
