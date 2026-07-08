import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { vehicleCreateSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = vehicleCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const vehicle = parsed.data;
  const { data, error } = await client
    .from("vehicles")
    .insert({
      title: vehicle.title,
      slug: vehicle.slug,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      vin: vehicle.vin,
      stock_number: vehicle.stockNumber,
      category: vehicle.category,
      summary: vehicle.summary,
      price: vehicle.price,
      price_number: parseMoney(vehicle.price),
      mileage: vehicle.mileage,
      mileage_number: parseMoney(vehicle.mileage),
      mpg: vehicle.mpg,
      transmission: vehicle.transmission,
      drivetrain: vehicle.drivetrain,
      exterior_color: vehicle.exteriorColor,
      interior_color: vehicle.interiorColor,
      fuel_type: vehicle.fuelType,
      body_style: vehicle.bodyStyle,
      image: vehicle.image,
      featured_label: buildFeaturedLabel(vehicle),
      status: vehicle.status,
      is_featured: vehicle.isFeatured,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const mediaRows = dedupeMedia(vehicle).map((url, index) => ({
    vehicle_id: data.id,
    url,
    alt: vehicle.title,
    sort_order: index,
    media_type: "image",
  }));

  if (mediaRows.length) {
    const { error: mediaError } = await client.from("vehicle_media").insert(mediaRows);
    if (mediaError) return NextResponse.json({ ok: false, error: mediaError.message }, { status: 500 });
  }

  const specRows = vehicle.specs.map((spec, index) => ({
    vehicle_id: data.id,
    spec_group: spec.group,
    label: spec.label,
    spec_value: spec.value,
    sort_order: spec.sortOrder ?? index,
  }));

  if (specRows.length) {
    const { error: specError } = await client.from("vehicle_specs").insert(specRows);
    if (specError) return NextResponse.json({ ok: false, error: specError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}

const vehicleReplaceSchema = vehicleCreateSchema.extend({
  id: z.string().uuid(),
});

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = vehicleReplaceSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const vehicle = parsed.data;
  const { error } = await client
    .from("vehicles")
    .update({
      title: vehicle.title,
      slug: vehicle.slug,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      vin: vehicle.vin,
      stock_number: vehicle.stockNumber,
      category: vehicle.category,
      summary: vehicle.summary,
      price: vehicle.price,
      price_number: parseMoney(vehicle.price),
      mileage: vehicle.mileage,
      mileage_number: parseMoney(vehicle.mileage),
      mpg: vehicle.mpg,
      transmission: vehicle.transmission,
      drivetrain: vehicle.drivetrain,
      exterior_color: vehicle.exteriorColor,
      interior_color: vehicle.interiorColor,
      fuel_type: vehicle.fuelType,
      body_style: vehicle.bodyStyle,
      image: vehicle.image,
      featured_label: buildFeaturedLabel(vehicle),
      status: vehicle.status,
      is_featured: vehicle.isFeatured,
    })
    .eq("id", vehicle.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const { error: deleteMediaError } = await client.from("vehicle_media").delete().eq("vehicle_id", vehicle.id);
  if (deleteMediaError) return NextResponse.json({ ok: false, error: deleteMediaError.message }, { status: 500 });

  const mediaRows = dedupeMedia(vehicle).map((url, index) => ({
    vehicle_id: vehicle.id,
    url,
    alt: vehicle.title,
    sort_order: index,
    media_type: "image",
  }));
  if (mediaRows.length) {
    const { error: mediaError } = await client.from("vehicle_media").insert(mediaRows);
    if (mediaError) return NextResponse.json({ ok: false, error: mediaError.message }, { status: 500 });
  }

  const { error: deleteSpecsError } = await client.from("vehicle_specs").delete().eq("vehicle_id", vehicle.id);
  if (deleteSpecsError) return NextResponse.json({ ok: false, error: deleteSpecsError.message }, { status: 500 });

  const specRows = vehicle.specs.map((spec, index) => ({
    vehicle_id: vehicle.id,
    spec_group: spec.group,
    label: spec.label,
    spec_value: spec.value,
    sort_order: spec.sortOrder ?? index,
  }));
  if (specRows.length) {
    const { error: specError } = await client.from("vehicle_specs").insert(specRows);
    if (specError) return NextResponse.json({ ok: false, error: specError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

const vehicleUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["available", "pending", "sold", "draft"]).optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = vehicleUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const updates: Record<string, unknown> = {};
  if (typeof parsed.data.status === "string") updates.status = parsed.data.status;
  if (typeof parsed.data.isFeatured === "boolean") updates.is_featured = parsed.data.isFeatured;
  if (!Object.keys(updates).length) return NextResponse.json({ ok: false, error: "No changes provided." }, { status: 400 });

  const { error } = await client.from("vehicles").update(updates).eq("id", parsed.data.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

const vehicleDeleteSchema = z.object({
  id: z.string().uuid(),
});

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = vehicleDeleteSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ ok: false, error: "Supabase service role is not configured." }, { status: 503 });

  const { error } = await client.from("vehicles").delete().eq("id", parsed.data.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function dedupeMedia(vehicle: { image: string; media: string[] }) {
  return [...new Set([vehicle.image, ...vehicle.media].filter(Boolean))];
}

function buildFeaturedLabel(vehicle: { fuelType?: string; bodyStyle?: string; category: string }) {
  if (vehicle.fuelType === "Electric") return "EV pick";
  if (vehicle.fuelType === "Hybrid") return "Hybrid pick";
  if (vehicle.bodyStyle) return vehicle.bodyStyle;
  return vehicle.category;
}
