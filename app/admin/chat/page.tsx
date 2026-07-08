import { MessageCircle, UserRoundCheck } from "lucide-react";
import { AdminPageIntro } from "@/components/admin-page-intro";
import { ChatInbox } from "@/components/chat-inbox";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-6">
      <AdminPageIntro
        eyebrow="AI handoff"
        title="Chat inbox"
        body="Use this page when the assistant needs a human. Review buyer intent, open the matching lead or vehicle, then move the shopper toward contact or an appointment."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2 text-amber-700">
          <MessageCircle className="h-5 w-5" />
          <p className="text-xs font-bold uppercase tracking-[0.18em]">Chat inbox</p>
        </div>
        <h1 className="mt-2 text-3xl font-black">AI conversations</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Conversations from the public assistant are stored here once Supabase env vars are configured. Staff can review intent, interested vehicles, and takeover status.
        </p>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-neutral-600">Total sessions</p>
          <p className="mt-1 text-4xl font-black">{overview.chatSessions}</p>
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2 text-emerald-700">
          <UserRoundCheck className="h-5 w-5" />
          <p className="text-xs font-bold uppercase tracking-[0.18em]">Human handoff</p>
        </div>
        <h2 className="mt-2 text-2xl font-black">Recommended workflow</h2>
        <div className="mt-5 grid gap-3">
          {["Review buyer intent", "Open matching vehicle", "Call or text lead", "Move lead to appointment", "Mark chat closed"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[linear-gradient(180deg,#1f2937,#0f172a)] text-sm font-black text-white">{index + 1}</span>
              <p className="font-bold">{item}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="xl:col-span-2">
        <ChatInbox sessions={overview.chatInbox} />
      </section>
      </div>
    </div>
  );
}
