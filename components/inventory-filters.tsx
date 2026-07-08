"use client";

export function InventoryFilters() {
  return (
    <div className="flex flex-wrap gap-3">
      <Select label="Make" options={["All makes", "Toyota", "Honda", "Hyundai", "Ford"]} />
      <Select label="Body style" options={["All styles", "Sedan", "SUV", "Wagon", "Hatchback"]} />
      <Select label="Budget" options={["No max", "$10k", "$15k", "$20k", "$25k"]} />
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
      <span className="sr-only">{label}</span>
      <select className="cursor-pointer bg-transparent outline-none" defaultValue={options[0]}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
