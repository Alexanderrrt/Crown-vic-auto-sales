import { z } from "zod";

export const leadSchema = z.object({
  source: z.string().min(1).default("site"),
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email").or(z.literal("")).default(""),
  phone: z.string().min(7, "Phone is required").max(40),
  message: z.string().max(2000).default(""),
  vehicleSlug: z.string().max(160).optional(),
  budget: z.string().max(80).optional(),
  tradeVehicle: z.string().max(160).optional(),
});

export const appointmentSchema = leadSchema.extend({
  appointmentAt: z.string().max(120).optional(),
});

export const vehicleCreateSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().min(2).max(160),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  make: z.string().max(80).optional(),
  model: z.string().max(80).optional(),
  trim: z.string().max(80).optional(),
  category: z.string().min(1).max(120).default("Inventory"),
  summary: z.string().max(800).default(""),
  price: z.string().max(80).default(""),
  mileage: z.string().max(80).default(""),
  mpg: z.string().max(80).default(""),
  transmission: z.string().max(80).default("Automatic"),
  drivetrain: z.string().max(80).default("FWD"),
  fuelType: z.string().max(80).optional(),
  bodyStyle: z.string().max(80).optional(),
  image: z.string().url().or(z.literal("")).default(""),
  status: z.enum(["available", "pending", "sold", "draft"]).default("available"),
  isFeatured: z.boolean().default(false),
});
