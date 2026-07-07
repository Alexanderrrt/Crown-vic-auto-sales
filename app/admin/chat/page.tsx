import { MessageCircle, UserRoundCheck } from "lucide-react";
import { getAdminOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const overview = await getAdminOverview();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-700">
          <MessageCircle className="h-5 w-5" />
          <p className="text-xs font-bold uppercase tracking-[0.18em]">Chat inbox</p>
        </div>
        <h1 className="mt-2 text-3xl font-black">AI conversations</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Conversations from the public assistant are stored here once Supabase env vars are configured. Staff can review intent, interested vehicles, and takeover status.
        </p>
        <div className="mt-5 rounded-lg bg-neutral-100 p-4">
          <p className="text-sm font-bold text-neutral-600">Total sessions</p>
          <p className="mt-1 text-4xl font-black">{overview.chatSessions}</p>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700">
          <UserRoundCheck className="h-5 w-5" />
          <p className="text-xs font-bold uppercase tracking-[0.18em]">Human handoff</p>
        </div>
        <h2 className="mt-2 text-2xl font-black">Recommended workflow</h2>
        <div className="mt-5 grid gap-3">
          {["Review buyer intent", "Open matching vehicle", "Call or text lead", "Move lead to appointment", "Mark chat closed"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-950 text-sm font-black text-white">{index + 1}</span>
              <p className="font-bold">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
