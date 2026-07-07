import { supabase } from "@/lib/supabase";
import { inventoryVehicles, toVehicle, type Vehicle } from "@/lib/dealership-data";

export async function getInventory(): Promise<Vehicle[]> {
  if (!supabase) return inventoryVehicles;

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data?.length) return inventoryVehicles;

  return data.map((row) => toVehicle(row));
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  if (!supabase) return inventoryVehicles.find((vehicle) => vehicle.slug === slug) ?? null;

  const { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return inventoryVehicles.find((vehicle) => vehicle.slug === slug) ?? null;

  return toVehicle(data);
}
