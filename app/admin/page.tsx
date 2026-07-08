import Link from "next/link";
import { ArrowRight, CalendarClock, CarFront, ListChecks, MessageCircle, TrendingUp, Users } from "lucide-react";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<CarFront className="h-5 w-5" />} label="Inventory" value={String(overview.inventory.length)} />
        <Metric icon={<Users className="h-5 w-5" />} label="Open leads" value={String(overview.leads.length)} />
        <Metric icon={<CalendarClock className="h-5 w-5" />} label="Appointments" value={String(overview.appointments.length)} />
        <Metric icon={<MessageCircle className="h-5 w-5" />} label="Chat sessions" value={String(overview.chatSessions)} />
        <Metric icon={<ListChecks className="h-5 w-5" />} label="Open tasks" value={String(overview.openTasks)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">CRM pipeline</p>
              <h2 className="mt-1 text-2xl font-black">Newest leads</h2>
            </div>
            <Link href="/admin/leads" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 divide-y divide-neutral-100">
            {overview.leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-black">{lead.name}</p>
                  <p className="mt-1 text-sm text-neutral-600">{lead.message}</p>
                </div>
                <span className="w-fit rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold capitalize text-neutral-700">{lead.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/70 bg-[linear-gradient(180deg,#18202a,#0f172a)] p-5 text-white shadow-[0_18px_44px_rgba(15,23,42,0.20)]">
          <div className="flex items-center gap-2 text-amber-300">
            <TrendingUp className="h-5 w-5" />
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Performance</p>
          </div>
          <h2 className="mt-2 text-2xl font-black">Lead generation snapshot</h2>
          <div className="mt-6 grid gap-3">
            <DarkMetric label="Vehicle views" value={String(overview.analytics.vehicleViews)} />
            <DarkMetric label="Lead conversion" value={overview.analytics.leadConversionRate} />
            <DarkMetric label="Chat conversion" value={overview.analytics.chatConversionRate} />
            <DarkMetric label="Most active vehicle" value={overview.analytics.popularVehicle} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Appointment desk</p>
            <h2 className="mt-1 text-2xl font-black">Upcoming buyers</h2>
          </div>
          <Link href="/admin/appointments" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            Manage appointments
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {overview.appointments.slice(0, 3).map((appointment) => (
            <div key={appointment.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{appointment.vehicleSlug ?? "walk-in"}</p>
              <p className="mt-1 font-black">{appointment.name}</p>
              <p className="mt-1 text-sm text-slate-600">{appointment.appointmentAt ? new Date(appointment.appointmentAt).toLocaleString() : "Schedule pending"}</p>
              <span className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold capitalize">{appointment.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-800/70 bg-[linear-gradient(180deg,#1b2430,#0f172a)] p-5 text-white shadow-[0_18px_44px_rgba(15,23,42,0.20)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Activity timeline</p>
          <h2 className="mt-2 text-2xl font-black">One place to audit every customer move</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Leads, AI chats, and appointments now roll up into a single timeline so managers can coach the team and catch dropped follow-up faster.
          </p>
          <Link href="/admin/activity" className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15">
            Open activity timeline
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Staff routing</p>
              <h2 className="mt-1 text-2xl font-black">Current ownership</h2>
            </div>
            <Link href="/admin/leads" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              Open CRM
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {overview.staffProfiles.slice(0, 4).map((staff) => {
              const ownedLeadCount = overview.leads.filter((lead) => lead.assignedTo === staff.clerkUserId).length;
              return (
                <div key={staff.clerkUserId} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
                  <div>
                    <p className="font-black text-slate-950">{staff.name}</p>
                    <p className="text-sm text-slate-500">{staff.role}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
                    {ownedLeadCount} lead{ownedLeadCount === 1 ? "" : "s"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="text-amber-700">{icon}</div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-600">{label}</p>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}
