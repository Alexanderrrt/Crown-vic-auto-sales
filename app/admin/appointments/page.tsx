import { AppointmentsBoard } from "@/components/appointments-board";
import { AdminPageIntro } from "@/components/admin-page-intro";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const { appointments } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Appointments"
        title="Buyer visits"
        body="Use this page to confirm who is coming in, who already visited, and who needs a quick reschedule or follow-up."
      />
      <AppointmentsBoard appointments={appointments} />
    </div>
  );
}
