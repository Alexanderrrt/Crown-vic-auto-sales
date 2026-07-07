import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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
      category: vehicle.category,
      summary: vehicle.summary,
      price: vehicle.price,
      price_number: parseMoney(vehicle.price),
      mileage: vehicle.mileage,
      mileage_number: parseMoney(vehicle.mileage),
      mpg: vehicle.mpg,
      transmission: vehicle.transmission,
      drivetrain: vehicle.drivetrain,
      fuel_type: vehicle.fuelType,
      body_style: vehicle.bodyStyle,
      image: vehicle.image,
      status: vehicle.status,
      is_featured: vehicle.isFeatured,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data.id });
}

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}
