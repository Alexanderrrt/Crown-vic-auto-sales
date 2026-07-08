import { BadgeCheck, CircleDollarSign, Leaf, Shield } from "lucide-react";

export type Vehicle = {
  id: string;
  slug: string;
  title: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vin?: string;
  stockNumber?: string;
  category: string;
  summary: string;
  price: string;
  priceNumber?: number;
  mileage: string;
  mileageNumber?: number;
  mpg: string;
  transmission: string;
  drivetrain: string;
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  bodyStyle?: string;
  status?: "available" | "pending" | "sold" | "draft";
  isFeatured?: boolean;
  views?: number;
  leadCount?: number;
  image: string;
  media?: string[];
  specs?: VehicleSpec[];
  featuredLabel: string;
};

export type VehicleSpec = {
  id?: string;
  group: string;
  label: string;
  value: string;
  sortOrder?: number;
};

export const dealershipFacts = {
  name: "Crown Vic Auto Sales",
  phone: "(408) 684-5036",
  phoneHref: "+14086845036",
  addressLine: "3732 Stevens Creek Blvd",
  city: "San Jose, CA 95117",
  hours: "10:00 AM - 6:00 PM",
};

export const siteStats = [
  { value: "22+", label: "years in the pre-owned auto business" },
  { value: "Hybrid + EV", label: "specialty inventory focus" },
  { value: "7 days", label: "weekly showroom availability" },
];

export const trustSignals = [
  {
    icon: BadgeCheck,
    title: "Experienced dealer",
    description: "Built around the real Crown Vic story: veteran pre-owned specialists with a long-term customer base.",
  },
  {
    icon: Leaf,
    title: "Hybrid and EV focus",
    description: "The new site emphasizes fuel efficiency, commuter value, and electrified inventory first.",
  },
  {
    icon: Shield,
    title: "Transparent shopping",
    description: "Dedicated pages for inventory, finance, trade-in, and contact keep the journey straightforward.",
  },
  {
    icon: CircleDollarSign,
    title: "Lead-friendly design",
    description: "Every page gives buyers a next step, whether they are comparing price, mileage, or monthly budget.",
  },
];

export const featuredVehicles: Vehicle[] = [
  {
    id: "1",
    slug: "2024-toyota-corolla-hybrid",
    title: "2024 Toyota Corolla Hybrid",
    category: "Hybrid sedan",
    summary: "Efficient, modern, and ideal for daily commuting or rideshare use.",
    price: "$19,222",
    mileage: "111,064 mi",
    mpg: "53 city / 46 hwy",
    transmission: "Automatic",
    drivetrain: "FWD",
    fuelType: "Hybrid",
    bodyStyle: "Sedan",
    status: "available",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
    media: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    ],
    specs: [
      { group: "Highlights", label: "Trim", value: "LE", sortOrder: 1 },
      { group: "Highlights", label: "Fuel economy", value: "53 city / 46 hwy", sortOrder: 2 },
      { group: "Comfort", label: "Interior", value: "Black cloth", sortOrder: 3 },
      { group: "Safety", label: "Driver support", value: "Modern commuter assist features", sortOrder: 4 },
    ],
    featuredLabel: "Featured",
  },
  {
    id: "2",
    slug: "2022-hyundai-ioniq-5",
    title: "2022 Hyundai Ioniq 5",
    category: "Electric crossover",
    summary: "Fast-charging EV with futuristic design and everyday practicality.",
    price: "$19,777",
    mileage: "64,636 mi",
    mpg: "114 MPGe",
    transmission: "Single-speed",
    drivetrain: "RWD",
    fuelType: "Electric",
    bodyStyle: "SUV",
    status: "available",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80",
    media: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
    ],
    specs: [
      { group: "Highlights", label: "Trim", value: "SE", sortOrder: 1 },
      { group: "EV", label: "Charging", value: "Fast-charge capable", sortOrder: 2 },
      { group: "Space", label: "Body style", value: "Electric crossover", sortOrder: 3 },
      { group: "Use case", label: "Best for", value: "Daily commuting and family errands", sortOrder: 4 },
    ],
    featuredLabel: "EV pick",
  },
];

export const inventoryVehicles: Vehicle[] = [
  ...featuredVehicles,
  {
    id: "3",
    slug: "2016-toyota-prius-c",
    title: "2016 Toyota Prius c",
    category: "Commuter hatchback",
    summary: "Budget-friendly efficiency with a small footprint and strong mpg.",
    price: "$11,444",
    mileage: "92,080 mi",
    mpg: "53 city / 46 hwy",
    transmission: "Automatic",
    drivetrain: "FWD",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
    media: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    ],
    specs: [
      { group: "Highlights", label: "Trim", value: "Two", sortOrder: 1 },
      { group: "Budget", label: "Positioning", value: "Value commuter", sortOrder: 2 },
      { group: "Efficiency", label: "Fuel economy", value: "53 city / 46 hwy", sortOrder: 3 },
      { group: "City use", label: "Footprint", value: "Compact hatchback", sortOrder: 4 },
    ],
    featuredLabel: "Value",
  },
  {
    id: "4",
    slug: "2021-ford-mustang-mach-e",
    title: "2021 Ford Mustang Mach-E",
    category: "Electric SUV",
    summary: "A performance-minded electric crossover with strong presence.",
    price: "$22,888",
    mileage: "53,850 mi",
    mpg: "98 MPGe",
    transmission: "Automatic",
    drivetrain: "AWD",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    media: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80"],
    featuredLabel: "Popular",
  },
  {
    id: "5",
    slug: "2019-toyota-prius",
    title: "2019 Toyota Prius",
    category: "Hybrid hatchback",
    summary: "The classic efficient commuter with practical cargo room.",
    price: "$13,333",
    mileage: "89,100 mi",
    mpg: "54 city / 50 hwy",
    transmission: "Automatic",
    drivetrain: "FWD",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    media: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80"],
    featuredLabel: "Commuter",
  },
  {
    id: "6",
    slug: "2020-lexus-ux-250h",
    title: "2020 Lexus UX 250h",
    category: "Luxury hybrid",
    summary: "Premium hybrid crossover with upscale feel and solid efficiency.",
    price: "$25,333",
    mileage: "57,442 mi",
    mpg: "41 city / 38 hwy",
    transmission: "CVT",
    drivetrain: "AWD",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
    media: ["https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80"],
    featuredLabel: "Luxury",
  },
  {
    id: "7",
    slug: "2022-honda-insight",
    title: "2022 Honda Insight",
    category: "Hybrid sedan",
    summary: "Clean styling, strong reliability reputation, and excellent daily usability.",
    price: "$17,333",
    mileage: "100,028 mi",
    mpg: "55 city / 49 hwy",
    transmission: "Automatic",
    drivetrain: "FWD",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    media: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"],
    featuredLabel: "Efficiency",
  },
  {
    id: "8",
    slug: "2019-ford-fusion-hybrid",
    title: "2019 Ford Fusion Hybrid",
    category: "Hybrid sedan",
    summary: "Balanced, comfortable, and priced for practical buyers.",
    price: "$16,666",
    mileage: "55,029 mi",
    mpg: "43 city / 41 hwy",
    transmission: "Automatic",
    drivetrain: "FWD",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80",
    media: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80"],
    featuredLabel: "Family",
  },
];

export function toVehicle(row: Partial<Record<string, unknown>>): Vehicle {
  return {
    id: String(row.id ?? row.slug ?? crypto.randomUUID()),
    slug: String(row.slug ?? row.id ?? "vehicle"),
    title: String(row.title ?? "Untitled vehicle"),
    year: toOptionalNumber(row.year),
    make: toOptionalString(row.make),
    model: toOptionalString(row.model),
    trim: toOptionalString(row.trim),
    vin: toOptionalString(row.vin),
    stockNumber: toOptionalString(row.stock_number ?? row.stockNumber),
    category: String(row.category ?? "Inventory"),
    summary: String(row.summary ?? ""),
    price: String(row.price ?? ""),
    priceNumber: toOptionalNumber(row.price_number ?? row.priceNumber),
    mileage: String(row.mileage ?? ""),
    mileageNumber: toOptionalNumber(row.mileage_number ?? row.mileageNumber),
    mpg: String(row.mpg ?? ""),
    transmission: String(row.transmission ?? ""),
    drivetrain: String(row.drivetrain ?? ""),
    exteriorColor: toOptionalString(row.exterior_color ?? row.exteriorColor),
    interiorColor: toOptionalString(row.interior_color ?? row.interiorColor),
    fuelType: toOptionalString(row.fuel_type ?? row.fuelType),
    bodyStyle: toOptionalString(row.body_style ?? row.bodyStyle),
    status: toVehicleStatus(row.status),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
    views: toOptionalNumber(row.views),
    leadCount: toOptionalNumber(row.lead_count ?? row.leadCount),
    image: String(row.image ?? ""),
    media: Array.isArray(row.media) ? row.media.map(String) : undefined,
    specs: Array.isArray(row.specs)
      ? row.specs.map((item) => {
          const spec = item as Record<string, unknown>;
          return {
            id: typeof spec.id === "string" ? spec.id : undefined,
            group: String(spec.group ?? spec.spec_group ?? "Features"),
            label: String(spec.label ?? ""),
            value: String(spec.value ?? spec.spec_value ?? ""),
            sortOrder: toOptionalNumber(spec.sortOrder ?? spec.sort_order),
          };
        })
      : undefined,
    featuredLabel: String(row.featured_label ?? row.featuredLabel ?? "Featured"),
  };
}

function toOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function toOptionalNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function toVehicleStatus(value: unknown): Vehicle["status"] {
  if (value === "pending" || value === "sold" || value === "draft") return value;
  return "available";
}
