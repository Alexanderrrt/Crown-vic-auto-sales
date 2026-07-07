export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Contact</p>
          <h1 className="mt-2 text-4xl font-black">Talk to the dealership</h1>
          <p className="mt-4 text-slate-300">
            This page is wired for lead capture and can be connected to Supabase so every inquiry lands in a shared inbox.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <p>Crown Vic Auto Sales</p>
            <p>3732 Stevens Creek Blvd</p>
            <p>San Jose, CA 95117</p>
            <p>(408) 684-5036</p>
          </div>
        </section>
        <section className="rounded-[2rem] bg-white p-8 text-slate-950">
          <h2 className="text-2xl font-black">Lead form</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="First name" />
            <Field label="Last name" />
            <Field label="Email" />
            <Field label="Phone" />
            <Field label="Vehicle interest" className="sm:col-span-2" />
            <Field label="Message" className="sm:col-span-2" />
          </div>
          <button className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950">Send inquiry</button>
        </section>
      </div>
    </main>
  );
}

function Field({ label, className = "" }: { label: string; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
    </label>
  );
}
