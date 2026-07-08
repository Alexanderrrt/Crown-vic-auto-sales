import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { inventoryVehicles, toVehicle, type Vehicle } from "@/lib/dealership-data";

type VehicleMediaRow = {
  url?: string | null;
  sort_order?: number | null;
};

type VehicleSpecRow = {
  id?: string | null;
  spec_group?: string | null;
  label?: string | null;
  spec_value?: string | null;
  sort_order?: number | null;
};

export async function getInventory(): Promise<Vehicle[]> {
  const client = getSupabaseAdmin() ?? supabase;
  if (!client) return inventoryVehicles;

  const { data, error } = await client
    .from("vehicles")
    .select("*, vehicle_media(url, sort_order), vehicle_specs(id, spec_group, label, spec_value, sort_order)")
    .neq("status", "draft")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data?.length) return inventoryVehicles;

  return data.map((row) => {
    const media = Array.isArray(row.vehicle_media)
      ? (row.vehicle_media as VehicleMediaRow[]).sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)).map((item) => String(item.url))
      : undefined;
    const specs = Array.isArray(row.vehicle_specs)
      ? (row.vehicle_specs as VehicleSpecRow[]).sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
      : undefined;
    return toVehicle({ ...row, media, specs, image: row.image || media?.[0] });
  });
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const client = getSupabaseAdmin() ?? supabase;
  if (!client) return inventoryVehicles.find((vehicle) => vehicle.slug === slug) ?? null;

  const { data, error } = await client
    .from("vehicles")
    .select("*, vehicle_media(url, sort_order), vehicle_specs(id, spec_group, label, spec_value, sort_order)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return inventoryVehicles.find((vehicle) => vehicle.slug === slug) ?? null;

  const media = Array.isArray(data.vehicle_media)
    ? (data.vehicle_media as VehicleMediaRow[]).sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)).map((item) => String(item.url))
    : undefined;
  const specs = Array.isArray(data.vehicle_specs)
    ? (data.vehicle_specs as VehicleSpecRow[]).sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    : undefined;

  return toVehicle({ ...data, media, specs, image: data.image || media?.[0] });
}
