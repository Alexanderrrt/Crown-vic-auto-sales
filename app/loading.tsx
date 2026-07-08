export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl animate-pulse space-y-6">
        <div className="h-6 w-40 rounded-full bg-slate-200" />
        <div className="h-14 w-full max-w-3xl rounded-[28px] bg-slate-200" />
        <div className="h-6 w-full max-w-2xl rounded-full bg-slate-200" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-sm">
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-24 rounded-full bg-slate-200" />
                <div className="h-6 w-3/4 rounded-full bg-slate-200" />
                <div className="h-4 w-full rounded-full bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded-full bg-slate-200" />
                  <div className="h-8 w-20 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
