import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, MessageCircle, Phone } from "lucide-react";
import { LeadWorkspaceControls } from "@/components/lead-workspace-controls";
import { getLeadDetail } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { lead, relatedAppointments, relatedChats, staffProfiles } = await getLeadDetail(id);
  if (!lead) notFound();

  const owner = lead.assignedTo ? staffProfiles.find((staff) => staff.clerkUserId === lead.assignedTo) : null;
  const openTasks = lead.events?.filter((event) => event.eventType === "task_created" && !event.metadata?.completed) ?? [];
  const timeline = [...(lead.events ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Lead workspace</p>
          <h1 className="mt-2 text-3xl font-black">{lead.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{lead.message}</p>
        </div>
        <Link href="/admin/leads" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          Back to pipeline
        </Link>
      </div>

      <section className="grid gap-4 xl:grid-cols-4">
        <SummaryCard label="Stage" value={lead.status} />
        <SummaryCard label="Owner" value={owner?.name ?? "Unassigned"} />
        <SummaryCard label="Open tasks" value={String(openTasks.length)} />
        <SummaryCard label="Related chats" value={String(relatedChats.length)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-6">
          <Panel title="Lead controls" eyebrow="Actions">
            <LeadWorkspaceControls lead={lead} staffProfiles={staffProfiles} />
          </Panel>

          <Panel title="Buyer details" eyebrow="Profile">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-bold">Phone:</span> {lead.phone || "Not provided"}</p>
              <p><span className="font-bold">Email:</span> {lead.email || "Not provided"}</p>
              <p><span className="font-bold">Vehicle:</span> {lead.vehicleSlug ?? "General shopping"}</p>
              <p><span className="font-bold">Budget:</span> {lead.budget ?? "Not specified"}</p>
              <p><span className="font-bold">Trade:</span> {lead.tradeVehicle ?? "None supplied"}</p>
            </div>
          </Panel>

          <Panel title="Open tasks" eyebrow="Follow-up">
            <div className="space-y-3">
              {openTasks.length ? (
                openTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <p className="font-semibold">{task.note}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(task.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No open tasks on this lead.</p>
              )}
            </div>
          </Panel>

          <Panel title="Appointments" eyebrow="Schedule">
            <div className="space-y-3">
              {relatedAppointments.length ? (
                relatedAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold capitalize">{appointment.status}</p>
                        <p className="mt-1">{formatDate(appointment.appointmentAt)}</p>
                        {appointment.vehicleSlug ? <p className="mt-1 text-xs text-slate-500">Vehicle: {appointment.vehicleSlug}</p> : null}
                      </div>
                      <Link href="/admin/appointments" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100">
                        Open desk
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  <p>No appointments linked yet.</p>
                  <Link href="/admin/appointments" className="mt-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100">
                    Open appointments desk
                  </Link>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Activity timeline" eyebrow="History">
            <div className="space-y-3">
              {timeline.length ? (
                timeline.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      <span>{event.eventType.replaceAll("_", " ")}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{event.note}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(event.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No CRM activity recorded yet.</p>
              )}
            </div>
          </Panel>

          <Panel title="Connected chat sessions" eyebrow="Inbox">
            <div className="space-y-3">
              {relatedChats.length ? (
                relatedChats.map((chat) => (
                  <div key={chat.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold">{chat.status}</span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">{chat.buyerIntent}</span>
                      </div>
                      <Link href="/admin/chat" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100">
                        Open inbox
                      </Link>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{chat.summary || "No summary yet."}</p>
                    {chat.vehicleSlug ? <p className="mt-1 text-xs text-slate-500">Vehicle: {chat.vehicleSlug}</p> : null}
                    <div className="mt-3 space-y-2">
                      {chat.messages.slice(-3).map((message) => (
                        <div key={message.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                          <span className="font-bold capitalize">{message.role}</span>: {message.content}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  <p>No linked chat sessions.</p>
                  <Link href="/admin/chat" className="mt-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100">
                    Open chat inbox
                  </Link>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <QuickAction
          icon={<Phone className="h-4 w-4" />}
          title="Call buyer"
          body={lead.phone || "Phone not supplied yet"}
          href={lead.phone ? `tel:${lead.phone}` : undefined}
        />
        <QuickAction
          icon={<CalendarClock className="h-4 w-4" />}
          title="Open appointments"
          body={relatedAppointments.length ? `${relatedAppointments.length} linked appointment(s)` : "No appointment yet"}
          href="/admin/appointments"
        />
        <QuickAction
          icon={<MessageCircle className="h-4 w-4" />}
          title="Review inbox"
          body={relatedChats.length ? `${relatedChats.length} linked chat session(s)` : "No linked chat"}
          href="/admin/chat"
        />
      </section>
    </div>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black capitalize text-slate-950">{value}</p>
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
  href?: string;
}) {
  const content = (
    <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:bg-white">
      <div className="text-amber-700">{icon}</div>
      <p className="mt-3 font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );

  if (!href) return content;
  if (href.startsWith("tel:")) return <a href={href}>{content}</a>;
  return <Link href={href}>{content}</Link>;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}
