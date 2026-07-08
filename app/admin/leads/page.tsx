import { CrmBoard } from "@/components/crm-board";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { leads, staffProfiles } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Lead CRM</p>
        <h1 className="mt-2 text-3xl font-black">Pipeline</h1>
        <p className="mt-2 text-sm text-slate-600">Move buyers through the pipeline, log notes, and keep every follow-up traceable.</p>
      </div>
      <CrmBoard leads={leads} staffProfiles={staffProfiles} />
    </div>
  );
}
