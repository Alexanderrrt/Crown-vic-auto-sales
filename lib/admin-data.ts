import { inventoryVehicles, type Vehicle } from "@/lib/dealership-data";
import { getInventory } from "@/lib/inventory";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  vehicleSlug?: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  name: string;
  phone: string;
  appointmentAt: string;
  status: string;
  vehicleSlug?: string;
};

export async function getAdminOverview() {
  const client = getSupabaseAdmin();
  const inventory = await getInventory();

  if (!client) {
    return {
      inventory,
      leads: demoLeads,
      appointments: demoAppointments,
      chatSessions: 0,
      analytics: {
        vehicleViews: 1248,
        leadConversionRate: "8.4%",
        chatConversionRate: "21%",
        popularVehicle: inventory[0]?.title ?? "Featured inventory",
      },
    };
  }

  const [leads, appointments, chatSessions, analyticsEvents] = await Promise.all([
    client.from("leads").select("*").order("created_at", { ascending: false }).limit(25),
    client.from("appointments").select("*").order("appointment_at", { ascending: true }).limit(10),
    client.from("chat_sessions").select("id", { count: "exact", head: true }),
    client.from("analytics_events").select("event_type, vehicle_slug").limit(500),
  ]);

  return {
    inventory,
    leads: leads.data?.map(toLead) ?? demoLeads,
    appointments: appointments.data?.map(toAppointment) ?? demoAppointments,
    chatSessions: chatSessions.count ?? 0,
    analytics: summarizeAnalytics(analyticsEvents.data ?? [], inventory),
  };
}

function toLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    message: String(row.message ?? ""),
    source: String(row.source ?? "site"),
    status: String(row.status ?? "new"),
    vehicleSlug: typeof row.vehicle_slug === "string" ? row.vehicle_slug : undefined,
    createdAt: String(row.created_at ?? ""),
  };
}

function toAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    appointmentAt: String(row.appointment_at ?? ""),
    status: String(row.status ?? "requested"),
    vehicleSlug: typeof row.vehicle_slug === "string" ? row.vehicle_slug : undefined,
  };
}

function summarizeAnalytics(events: Record<string, unknown>[], inventory: Vehicle[]) {
  const views = events.filter((event) => event.event_type === "vehicle_view");
  const leads = events.filter((event) => event.event_type === "lead_created");
  const chats = events.filter((event) => event.event_type === "chat_qualified");
  const popularSlug = mostFrequent(views.map((event) => String(event.vehicle_slug ?? "")));

  return {
    vehicleViews: views.length,
    leadConversionRate: views.length ? `${Math.round((leads.length / views.length) * 1000) / 10}%` : "0%",
    chatConversionRate: views.length ? `${Math.round((chats.length / views.length) * 1000) / 10}%` : "0%",
    popularVehicle: inventory.find((vehicle) => vehicle.slug === popularSlug)?.title ?? inventory[0]?.title ?? "Featured inventory",
  };
}

function mostFrequent(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

const demoLeads: Lead[] = [
  {
    id: "demo-lead-1",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    phone: "(408) 555-0191",
    message: "Looking for a hybrid under $18k with low monthly payments.",
    source: "AI chat",
    status: "new",
    vehicleSlug: inventoryVehicles[0]?.slug,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-lead-2",
    name: "Daniel Kim",
    email: "daniel@example.com",
    phone: "(650) 555-0124",
    message: "Wants to test drive an EV crossover this weekend.",
    source: "test-drive",
    status: "contacted",
    vehicleSlug: inventoryVehicles[1]?.slug,
    createdAt: new Date().toISOString(),
  },
];

const demoAppointments: Appointment[] = [
  {
    id: "demo-appointment-1",
    name: "Daniel Kim",
    phone: "(650) 555-0124",
    appointmentAt: new Date(Date.now() + 86400000).toISOString(),
    status: "requested",
    vehicleSlug: inventoryVehicles[1]?.slug,
  },
];
