import Link from "next/link";
import { CalendarClock, CarFront, CircleUserRound, MessageCircleMore, NotebookPen } from "lucide-react";
import type { ActivityItem } from "@/lib/admin-data";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-amber-700">{getIcon(item.type)}</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{item.type.replaceAll("_", " ")}</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{formatDate(item.createdAt)}</span>
                  {item.status ? <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{item.status}</span> : null}
                  {item.relatedVehicleSlug ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-900">{item.relatedVehicleSlug}</span> : null}
                </div>
              </div>
            </div>
            {item.href ? (
              <Link href={item.href} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                Open record
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function getIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "lead":
      return <CircleUserRound className="h-5 w-5" />;
    case "lead_event":
      return <NotebookPen className="h-5 w-5" />;
    case "appointment":
      return <CalendarClock className="h-5 w-5" />;
    case "chat":
      return <MessageCircleMore className="h-5 w-5" />;
    default:
      return <CarFront className="h-5 w-5" />;
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}
