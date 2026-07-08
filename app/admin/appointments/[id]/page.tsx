import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, MessageCircle, Phone } from "lucide-react";
import { AppointmentWorkspaceControls } from "@/components/appointment-workspace-controls";
import { getAppointmentDetail } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { appointment, lead, relatedChats, vehicle } = await getAppointmentDetail(id);
  if (!appointment) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Appointment workspace</p>
          <h1 className="mt-2 text-3xl font-black">{appointment.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review the scheduled visit, buyer context, and related conversations before the showroom handoff.
          </p>
        </div>
        <Link href="/admin/appointments" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          Back to appointments
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Status" value={appointment.status} />
        <SummaryCard label="Visit time" value={formatDate(appointment.appointmentAt)} />
        <SummaryCard label="Related chats" value={String(relatedChats.length)} />
        <SummaryCard label="Lead linked" value={lead ? "Yes" : "No"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel eyebrow="Actions" title="Workspace controls">
          <AppointmentWorkspaceControls appointment={appointment} />
        </Panel>

        <Panel eyebrow="Buyer" title="Contact details">
          <div className="space-y-3 text-sm text-slate-700">
            <p><span className="font-bold">Phone:</span> {appointment.phone}</p>
            <p><span className="font-bold">Email:</span> {appointment.email || "Not provided"}</p>
            <p><span className="font-bold">Vehicle slug:</span> {appointment.vehicleSlug ?? "Walk-in / general visit"}</p>
            <p><span className="font-bold">Lead record:</span> {lead ? lead.name : "Not linked yet"}</p>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel eyebrow="Vehicle" title="Showroom prep">
          <div className="space-y-3 text-sm text-slate-700">
            <p><span className="font-bold">Vehicle:</span> {vehicle?.title ?? appointment.vehicleSlug ?? "Unassigned"}</p>
            <p><span className="font-bold">Price:</span> {vehicle ? `$${vehicle.price.toLocaleString()}` : "Check inventory"}</p>
            <p><span className="font-bold">Mileage:</span> {vehicle ? `${vehicle.mileage.toLocaleString()} mi` : "Check inventory"}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {vehicle ? (
                <Link href={`/inventory/${vehicle.slug}`} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-900 transition hover:bg-amber-100">
                  Open vehicle page
                </Link>
              ) : null}
              <Link href="/admin/appointments" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-50">
                Manage status
              </Link>
            </div>
          </div>
        </Panel>

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
            <p className="text-sm text-slate-500">No lead is linked to this appointment yet.</p>
          )}
        </Panel>

        <Panel eyebrow="Inbox" title="Related chats">
          <div className="space-y-3">
            {relatedChats.length ? (
              relatedChats.map((chat) => (
                <div key={chat.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{chat.status}</span>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-900">{chat.buyerIntent}</span>
                    </div>
                    <Link href={`/admin/chat/${chat.id}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100">
                      Open chat
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{chat.summary || "No summary yet."}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No related AI conversations were linked to this appointment.</p>
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <QuickAction icon={<Phone className="h-4 w-4" />} title="Call shopper" body={appointment.phone} href={`tel:${appointment.phone}`} />
        <QuickAction icon={<CalendarClock className="h-4 w-4" />} title="Appointments desk" body="Update confirmation and visit status" href="/admin/appointments" />
        <QuickAction icon={<MessageCircle className="h-4 w-4" />} title="Chat inbox" body={relatedChats.length ? `${relatedChats.length} related conversation(s)` : "Review other sessions"} href="/admin/chat" />
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
  const content = (
    <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:bg-white">
      <div className="text-amber-700">{icon}</div>
      <p className="mt-3 font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );

  if (href.startsWith("tel:")) return <a href={href}>{content}</a>;
  return <Link href={href}>{content}</Link>;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Schedule pending";
  return date.toLocaleString();
}
