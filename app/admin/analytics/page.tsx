import { BarChart3, MousePointerClick, Percent, Star } from "lucide-react";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const { analytics } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Analytics</p>
        <h1 className="mt-2 text-3xl font-black">Lead generation health</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<MousePointerClick className="h-5 w-5" />} label="Vehicle views" value={String(analytics.vehicleViews)} />
        <Metric icon={<Percent className="h-5 w-5" />} label="Lead conversion" value={analytics.leadConversionRate} />
        <Metric icon={<BarChart3 className="h-5 w-5" />} label="Chat conversion" value={analytics.chatConversionRate} />
        <Metric icon={<Star className="h-5 w-5" />} label="Top vehicle" value={analytics.popularVehicle} />
      </section>

      <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-black">Tracking priorities</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Panel title="Inventory demand" body="Track views, saves, chat mentions, and lead submissions per vehicle." />
          <Panel title="Lead quality" body="Separate contact, trade-in, financing, and test-drive requests by source." />
          <Panel title="Chat outcomes" body="Measure AI-qualified shoppers, human handoff, and appointment conversion." />
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
