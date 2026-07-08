import { Mail, Phone } from "lucide-react";
import { getAdminOverview } from "@/lib/admin-data";

const stages = ["new", "contacted", "appointment", "won", "lost"];

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { leads } = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Lead CRM</p>
        <h1 className="mt-2 text-3xl font-black">Pipeline</h1>
      </div>

      <section className="grid gap-4 xl:grid-cols-5">
        {stages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.status === stage);
          return (
            <div key={stage} className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <h2 className="font-black capitalize">{stage}</h2>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold">{stageLeads.length}</span>
              </div>
              <div className="mt-4 space-y-3">
                {stageLeads.map((lead) => (
                  <article key={lead.id} className="rounded-lg border border-slate-200 bg-white/90 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
                    <p className="font-black">{lead.name}</p>
                    <p className="mt-1 line-clamp-3 text-sm text-neutral-600">{lead.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-neutral-600">
                      <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100">
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 transition hover:bg-slate-100">
                          <Mail className="h-3 w-3" />
                          Email
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
