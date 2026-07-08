import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, MessageCircle, UserRound } from "lucide-react";
import { ChatWorkspaceControls } from "@/components/chat-workspace-controls";
import { getChatSessionDetail } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session, lead, relatedAppointments, vehicle } = await getChatSessionDetail(id);
  if (!session) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Chat workspace</p>
          <h1 className="mt-2 text-3xl font-black">Session {session.id.slice(0, 8)}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review buyer intent, message history, related appointments, and next best action before human takeover.
          </p>
        </div>
        <Link href="/admin/chat" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          Back to inbox
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Status" value={session.status} />
        <SummaryCard label="Intent" value={session.buyerIntent || "general"} />
        <SummaryCard label="Lead linked" value={lead ? "Yes" : "No"} />
        <SummaryCard label="Appointments" value={String(relatedAppointments.length)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel eyebrow="Conversation" title="Message history">
          <div className="space-y-3">
            {session.messages.length ? (
              session.messages.map((message) => (
                <div key={message.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{message.role}</span>
                    <span className="text-xs text-slate-400">{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{message.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No messages captured yet.</p>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Actions" title="Workspace controls">
            <ChatWorkspaceControls session={session} />
          </Panel>

          <Panel eyebrow="AI" title="Session summary">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-bold">Summary:</span> {session.summary || "No AI summary yet."}</p>
              <p><span className="font-bold">Vehicle slug:</span> {session.vehicleSlug ?? "General inventory question"}</p>
              <p><span className="font-bold">Visitor ID:</span> {session.visitorId}</p>
            </div>
          </Panel>

          <Panel eyebrow="Vehicle" title="Recommended unit">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-bold">Vehicle:</span> {vehicle?.title ?? session.vehicleSlug ?? "Not matched yet"}</p>
              <p><span className="font-bold">Price:</span> {vehicle ? `$${vehicle.price.toLocaleString()}` : "Check inventory"}</p>
              <p><span className="font-bold">Mileage:</span> {vehicle ? `${vehicle.mileage.toLocaleString()} mi` : "Check inventory"}</p>
              {vehicle ? (
                <Link href={`/inventory/${vehicle.slug}`} className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-900 transition hover:bg-amber-100">
                  Open vehicle page
                </Link>
              ) : null}
            </div>
          </Panel>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel eyebrow="CRM" title="Linked lead">
          {lead ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-lg font-black text-slate-950">{lead.name}</p>
                <p className="mt-1 text-sm text-slate-600">{lead.message}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{lead.status}</span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{lead.source}</span>
                </div>
              </div>
              <Link href={`/admin/leads/${lead.id}`} className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                Open lead workspace
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
              No lead has been linked to this chat yet. Use the inbox workflow to convert this conversation when the buyer is qualified.
            </div>
          )}
        </Panel>

        <Panel eyebrow="Schedule" title="Related appointments">
          <div className="space-y-3">
            {relatedAppointments.length ? (
              relatedAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{appointment.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(appointment.appointmentAt)}</p>
                    </div>
                    <Link href={`/admin/appointments/${appointment.id}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100">
                      Open appointment
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No appointments are linked to this chat yet.</p>
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <QuickAction icon={<MessageCircle className="h-4 w-4" />} title="Main inbox" body="Update takeover status or convert leads" href="/admin/chat" />
        <QuickAction icon={<CalendarClock className="h-4 w-4" />} title="Appointments desk" body={relatedAppointments.length ? `${relatedAppointments.length} linked appointment(s)` : "No linked appointments"} href="/admin/appointments" />
        <QuickAction icon={<UserRound className="h-4 w-4" />} title="Lead pipeline" body={lead ? `Lead: ${lead.name}` : "No linked lead yet"} href={lead ? `/admin/leads/${lead.id}` : "/admin/leads"} />
      </section>
    </div>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black capitalize text-slate-950">{value}</p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:bg-white">
      <div className="text-emerald-700">{icon}</div>
      <p className="mt-3 font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </Link>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}
