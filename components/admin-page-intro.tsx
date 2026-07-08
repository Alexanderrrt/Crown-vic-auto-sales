import Link from "next/link";

export function AdminPageIntro({
  eyebrow,
  title,
  body,
  actionLabel,
  actionHref,
}: {
  eyebrow: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f7f9fb)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
