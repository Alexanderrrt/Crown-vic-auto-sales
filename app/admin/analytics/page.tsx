import { BarChart3, CalendarClock, MousePointerClick, Percent, PhoneCall, Star } from "lucide-react";
import { AdminPageIntro } from "@/components/admin-page-intro";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const { analytics } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Analytics"
        title="What is working"
        body="Use this page to spot which vehicles, forms, and conversations are creating the most buyer action so the team knows where to focus."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<MousePointerClick className="h-5 w-5" />} label="Vehicle views" value={String(analytics.vehicleViews)} />
        <Metric icon={<Percent className="h-5 w-5" />} label="Lead conversion" value={analytics.leadConversionRate} />
        <Metric icon={<BarChart3 className="h-5 w-5" />} label="Chat conversion" value={analytics.chatConversionRate} />
        <Metric icon={<Star className="h-5 w-5" />} label="Top vehicle" value={analytics.popularVehicle} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric icon={<CalendarClock className="h-5 w-5" />} label="Appointment requests" value={String(analytics.appointmentRequests)} />
        <Metric icon={<PhoneCall className="h-5 w-5" />} label="Human handoff requests" value={String(analytics.handoffRequests)} />
        <Metric icon={<Star className="h-5 w-5" />} label="Top lead source" value={analytics.topLeadSource} />
      </section>

      <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-black">Tracking priorities</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Panel title="Inventory demand" body="Track views, saves, chat mentions, and lead submissions per vehicle." />
          <Panel title="Lead quality" body="Separate contact, trade-in, financing, and test-drive requests by source." />
          <Panel title="Chat outcomes" body="Measure AI-qualified shoppers, human handoff, and appointment conversion." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-black">Lead source mix</h2>
          <div className="mt-5 space-y-3">
            {analytics.sourceBreakdown.length ? (
              analytics.sourceBreakdown.map((item) => (
                <DataRow key={item.source} label={item.source} value={`${item.count} lead${item.count === 1 ? "" : "s"}`} />
              ))
            ) : (
              <EmptyState text="Lead source data will appear here as form and chat submissions accumulate." />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-black">Chat intent mix</h2>
          <div className="mt-5 space-y-3">
            {analytics.chatIntentBreakdown.length ? (
              analytics.chatIntentBreakdown.map((item) => (
                <DataRow key={item.intent} label={item.intent.replaceAll("_", " ")} value={`${item.count} message${item.count === 1 ? "" : "s"}`} />
              ))
            ) : (
              <EmptyState text="Buyer intent categories will show here once chat activity accumulates." />
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-black">Top demand vehicles</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {analytics.demandVehicles.length ? (
            analytics.demandVehicles.map((vehicle) => (
              <div key={vehicle.slug} className="rounded-lg border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f4f6f8)] p-4">
                <p className="font-black">{vehicle.title}</p>
                <p className="mt-3 text-sm text-neutral-600">Views: {vehicle.views}</p>
                <p className="mt-1 text-sm text-neutral-600">Leads: {vehicle.leads}</p>
                <p className="mt-1 text-sm text-neutral-600">Chats: {vehicle.chats}</p>
              </div>
            ))
          ) : (
            <EmptyState text="Vehicle demand data will appear here once analytics events are collected." />
          )}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="text-amber-700">{icon}</div>
      <p className="mt-4 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-600">{label}</p>
    </div>
  );
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f4f6f8)] p-4">
      <p className="font-black">{title}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f4f6f8)] px-4 py-3">
      <p className="font-bold capitalize text-slate-900">{label}</p>
      <p className="text-sm font-semibold text-slate-600">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">{text}</p>;
}
