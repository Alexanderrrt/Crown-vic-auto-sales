import type { Vehicle } from "@/lib/dealership-data";

export type BuyerIntent =
  | "general_shopping"
  | "vehicle_detail"
  | "budget_shopper"
  | "trade_in"
  | "financing"
  | "test_drive"
  | "availability_check"
  | "high_intent";

export function detectBuyerIntent(message: string, vehicleSlug?: string): BuyerIntent {
  const lower = message.toLowerCase();
  if (hasAny(lower, ["test drive", "appointment", "come see", "schedule"])) return "test_drive";
  if (hasAny(lower, ["finance", "financing", "monthly payment", "apr", "credit"])) return "financing";
  if (hasAny(lower, ["trade", "trade-in", "trade in", "value my"])) return "trade_in";
  if (hasAny(lower, ["available", "still have", "in stock"])) return "availability_check";
  if (hasAny(lower, ["under $", "under ", "budget", "payment"])) return "budget_shopper";
  if (vehicleSlug) return "vehicle_detail";
  if (hasAny(lower, ["ready to buy", "call me", "text me", "contact me"])) return "high_intent";
  return "general_shopping";
}

export function extractBudget(message: string) {
  const match = message.match(/\$?\s?(\d{2,3})(?:[,\s]?(\d{3}))?\s?(k|grand)?/i);
  if (!match) return undefined;
  const base = Number(`${match[1]}${match[2] ?? ""}`);
  if (!Number.isFinite(base)) return undefined;
  return match[3] ? base * 1000 : base;
}

export function extractContactDetails(message: string) {
  const email = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = message.match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)?.[0];
  return { email, phone };
}

export function extractShopperName(message: string) {
  const patterns = [
    /my name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /i am\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /i'm\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /this is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return undefined;
}

export function isHumanHandoffIntent(message: string) {
  const lower = message.toLowerCase();
  return hasAny(lower, [
    "call me",
    "text me",
    "contact me",
    "ready to buy",
    "when can i come",
    "i want this one",
    "apply",
    "finance",
    "test drive",
  ]);
}

export function rankInventory(query: string, inventory: Vehicle[]) {
  const lower = query.toLowerCase();
  const budget = extractBudget(lower);
  const wantsHybrid = lower.includes("hybrid");
  const wantsEv = lower.includes("ev") || lower.includes("electric");
  const wantsSuv = hasAny(lower, ["suv", "crossover"]);
  const wantsSedan = lower.includes("sedan");
  const wantsRideshare = hasAny(lower, ["rideshare", "uber", "lyft", "commute", "mpg"]);

  return [...inventory]
    .map((vehicle) => {
      let score = 0;
      const text = `${vehicle.title} ${vehicle.category} ${vehicle.summary} ${vehicle.fuelType ?? ""} ${vehicle.bodyStyle ?? ""}`.toLowerCase();

      if (vehicle.status === "available") score += 4;
      if (wantsHybrid && text.includes("hybrid")) score += 8;
      if (wantsEv && (text.includes("electric") || text.includes("ev"))) score += 8;
      if (wantsSuv && (text.includes("suv") || text.includes("crossover"))) score += 5;
      if (wantsSedan && text.includes("sedan")) score += 5;
      if (wantsRideshare && /\b5\d\b/.test(vehicle.mpg)) score += 6;

      for (const token of lower.split(/\s+/)) {
        if (token.length > 2 && text.includes(token)) score += 1;
      }

      const price = vehicle.priceNumber ?? parseCurrency(vehicle.price);
      if (budget && price) {
        if (price <= budget) score += 10;
        else if (price <= budget * 1.15) score += 4;
      }

      return { vehicle, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.vehicle);
}

export function buildInventoryDigest(vehicles: Vehicle[], limit = 6) {
  return vehicles.slice(0, limit).map((vehicle) => {
    const price = vehicle.price || "Call for price";
    const mileage = vehicle.mileage || "Mileage on request";
    return `- ${vehicle.title} | ${price} | ${mileage} | ${vehicle.mpg || "Efficiency info available"} | ${vehicle.status ?? "available"}`;
  });
}

function parseCurrency(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function hasAny(value: string, matches: string[]) {
  return matches.some((match) => value.includes(match));
}
