import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#fff7eb_100%)] px-4 py-16 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-[36px] border border-white/70 bg-white/85 p-10 text-center shadow-[0_24px_80px_rgba(148,163,184,0.16)]">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-700">404</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">This vehicle page went off the lot.</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
          The listing may have sold, moved, or never existed. You can head back to inventory or reach the sales team for help finding something similar.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/inventory" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Browse inventory
          </Link>
          <Link href="/contact" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Talk to sales
          </Link>
        </div>
      </div>
    </main>
  );
}
