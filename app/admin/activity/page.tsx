import { ActivityFeed } from "@/components/activity-feed";
import { getActivityFeed } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const items = await getActivityFeed();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Customer activity</p>
        <h1 className="mt-2 text-3xl font-black">Unified timeline</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Review the full customer journey across leads, appointments, and AI conversations in chronological order.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="All activity" value={String(items.length)} />
        <Metric label="Lead events" value={String(items.filter((item) => item.type === "lead_event").length)} />
        <Metric label="Appointments" value={String(items.filter((item) => item.type === "appointment").length)} />
        <Metric label="Chats" value={String(items.filter((item) => item.type === "chat").length)} />
      </section>
      <ActivityFeed items={items} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
