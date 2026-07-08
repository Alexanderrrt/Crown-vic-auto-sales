import { AppointmentsBoard } from "@/components/appointments-board";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const { appointments } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Appointments</p>
        <h1 className="mt-2 text-3xl font-black">Scheduled buyers</h1>
        <p className="mt-2 text-sm text-slate-600">Confirm, complete, or cancel appointments while keeping CRM activity in sync.</p>
      </div>
      <AppointmentsBoard appointments={appointments} />
    </div>
  );
}
