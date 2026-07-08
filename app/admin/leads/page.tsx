import { AdminPageIntro } from "@/components/admin-page-intro";
import { CrmBoard } from "@/components/crm-board";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { leads, staffProfiles } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="Lead CRM"
        title="Pipeline"
        body="Use this page for shopper follow-up. Each column is a stage. Open a lead when you need the full workspace with notes, tasks, chats, and appointments."
      />
      <CrmBoard leads={leads} staffProfiles={staffProfiles} />
    </div>
  );
}
