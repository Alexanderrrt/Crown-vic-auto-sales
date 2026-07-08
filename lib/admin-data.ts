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
  budget?: string;
  tradeVehicle?: string;
  assignedTo?: string;
  createdAt: string;
  events?: LeadEvent[];
};

export type Appointment = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  appointmentAt: string;
  status: string;
  vehicleSlug?: string;
  leadId?: string;
};

export type LeadEvent = {
  id: string;
  eventType: string;
  note: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type ChatSessionSummary = {
  id: string;
  visitorId: string;
  vehicleSlug?: string;
  status: string;
  summary: string;
  buyerIntent: string;
  leadId?: string;
  createdAt: string;
  messages: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

export type StaffProfile = {
  clerkUserId: string;
  name: string;
  role: string;
};

export type ActivityItem = {
  id: string;
  type: "lead" | "lead_event" | "appointment" | "chat";
  title: string;
  description: string;
  createdAt: string;
  status?: string;
  href?: string;
  relatedLeadId?: string;
  relatedVehicleSlug?: string;
};

export async function getAdminOverview() {
  const client = getSupabaseAdmin();
  const inventory = await getInventory();

  if (!client) {
    const openTasks = countOpenTasks(demoLeads);
    return {
      inventory,
      leads: demoLeads,
      appointments: demoAppointments,
      chatSessions: demoChatSessions.length,
      chatInbox: demoChatSessions,
      openTasks,
      staffProfiles: demoStaffProfiles,
      analytics: {
        vehicleViews: 1248,
        leadConversionRate: "8.4%",
        chatConversionRate: "21%",
        popularVehicle: inventory[0]?.title ?? "Featured inventory",
        appointmentRequests: 16,
        handoffRequests: 11,
        topLeadSource: "ai-chat",
      },
    };
  }

  const [leads, appointments, chatSessions, analyticsEvents, staffProfiles] = await Promise.all([
    client
      .from("leads")
      .select("*, lead_events(id, event_type, note, created_at, metadata)")
      .order("created_at", { ascending: false })
      .limit(25),
    client.from("appointments").select("*").order("appointment_at", { ascending: true }).limit(10),
    client
      .from("chat_sessions")
      .select("id, visitor_id, vehicle_slug, status, summary, buyer_intent, lead_id, created_at, chat_messages(id, role, content, created_at)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .limit(20),
    client.from("analytics_events").select("event_type, vehicle_slug").limit(500),
    client.from("staff_profiles").select("clerk_user_id, name, role").order("name", { ascending: true }).limit(20),
  ]);

  return {
    inventory,
    leads: leads.data?.map(toLead) ?? demoLeads,
    appointments: appointments.data?.map(toAppointment) ?? demoAppointments,
    chatSessions: chatSessions.count ?? 0,
    chatInbox: chatSessions.data?.map(toChatSession) ?? demoChatSessions,
    openTasks: countOpenTasks(leads.data?.map(toLead) ?? demoLeads),
    staffProfiles: staffProfiles.data?.map(toStaffProfile) ?? demoStaffProfiles,
    analytics: summarizeAnalytics(analyticsEvents.data ?? [], inventory),
  };
}

export async function getLeadDetail(id: string) {
  const overview = await getAdminOverview();
  const lead = overview.leads.find((item) => item.id === id) ?? null;
  const relatedAppointments = overview.appointments.filter((appointment) => appointment.leadId === id);
  const relatedChats = overview.chatInbox.filter((session) => session.leadId === id);

  return {
    lead,
    relatedAppointments,
    relatedChats,
    staffProfiles: overview.staffProfiles,
  };
}

export async function getAppointmentDetail(id: string) {
  const overview = await getAdminOverview();
  const appointment = overview.appointments.find((item) => item.id === id) ?? null;
  const lead = appointment?.leadId ? overview.leads.find((item) => item.id === appointment.leadId) ?? null : null;
  const relatedChats = appointment?.leadId ? overview.chatInbox.filter((session) => session.leadId === appointment.leadId) : [];
  const vehicle = appointment?.vehicleSlug ? overview.inventory.find((item) => item.slug === appointment.vehicleSlug) ?? null : null;

  return {
    appointment,
    lead,
    relatedChats,
    vehicle,
    staffProfiles: overview.staffProfiles,
  };
}

export async function getChatSessionDetail(id: string) {
  const overview = await getAdminOverview();
  const session = overview.chatInbox.find((item) => item.id === id) ?? null;
  const lead = session?.leadId ? overview.leads.find((item) => item.id === session.leadId) ?? null : null;
  const relatedAppointments = session?.leadId ? overview.appointments.filter((item) => item.leadId === session.leadId) : [];
  const vehicle = session?.vehicleSlug ? overview.inventory.find((item) => item.slug === session.vehicleSlug) ?? null : null;

  return {
    session,
    lead,
    relatedAppointments,
    vehicle,
    staffProfiles: overview.staffProfiles,
  };
}

export async function getActivityFeed() {
  const overview = await getAdminOverview();
  const items: ActivityItem[] = [];

  for (const lead of overview.leads) {
    items.push({
      id: `lead-${lead.id}`,
      type: "lead",
      title: lead.name,
      description: lead.message || "New shopper inquiry received.",
      createdAt: lead.createdAt,
      status: lead.status,
      href: `/admin/leads/${lead.id}`,
      relatedLeadId: lead.id,
      relatedVehicleSlug: lead.vehicleSlug,
    });

    for (const event of lead.events ?? []) {
      items.push({
        id: `lead-event-${event.id}`,
        type: "lead_event",
        title: lead.name,
        description: `${event.eventType.replaceAll("_", " ")}: ${event.note}`,
        createdAt: event.createdAt,
        status: lead.status,
        href: `/admin/leads/${lead.id}`,
        relatedLeadId: lead.id,
        relatedVehicleSlug: lead.vehicleSlug,
      });
    }
  }

  for (const appointment of overview.appointments) {
    items.push({
      id: `appointment-${appointment.id}`,
      type: "appointment",
      title: appointment.name,
      description: `Appointment ${appointment.status} for ${appointment.vehicleSlug ?? "general showroom visit"}.`,
      createdAt: appointment.appointmentAt,
      status: appointment.status,
      href: `/admin/appointments/${appointment.id}`,
      relatedLeadId: appointment.leadId,
      relatedVehicleSlug: appointment.vehicleSlug,
    });
  }

  for (const session of overview.chatInbox) {
    items.push({
      id: `chat-${session.id}`,
      type: "chat",
      title: `Chat ${session.id.slice(0, 8)}`,
      description: session.summary || "AI conversation awaiting review.",
      createdAt: session.createdAt,
      status: session.status,
      href: `/admin/chat/${session.id}`,
      relatedLeadId: session.leadId,
      relatedVehicleSlug: session.vehicleSlug,
    });
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    budget: typeof row.budget === "string" ? row.budget : undefined,
    tradeVehicle: typeof row.trade_vehicle === "string" ? row.trade_vehicle : undefined,
    assignedTo: typeof row.assigned_to === "string" ? row.assigned_to : undefined,
    createdAt: String(row.created_at ?? ""),
    events: Array.isArray(row.lead_events) ? row.lead_events.map(toLeadEvent) : [],
  };
}

function toAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: typeof row.email === "string" ? row.email : undefined,
    phone: String(row.phone ?? ""),
    appointmentAt: String(row.appointment_at ?? ""),
    status: String(row.status ?? "requested"),
    vehicleSlug: typeof row.vehicle_slug === "string" ? row.vehicle_slug : undefined,
    leadId: typeof row.lead_id === "string" ? row.lead_id : undefined,
  };
}

function toLeadEvent(row: Record<string, unknown>): LeadEvent {
  return {
    id: String(row.id ?? ""),
    eventType: String(row.event_type ?? ""),
    note: String(row.note ?? ""),
    createdAt: String(row.created_at ?? ""),
    metadata: typeof row.metadata === "object" && row.metadata ? (row.metadata as Record<string, unknown>) : undefined,
  };
}

function toChatSession(row: Record<string, unknown>): ChatSessionSummary {
  return {
    id: String(row.id ?? ""),
    visitorId: String(row.visitor_id ?? ""),
    vehicleSlug: typeof row.vehicle_slug === "string" ? row.vehicle_slug : undefined,
    status: String(row.status ?? "ai_active"),
    summary: String(row.summary ?? ""),
    buyerIntent: String(row.buyer_intent ?? ""),
    leadId: typeof row.lead_id === "string" ? row.lead_id : undefined,
    createdAt: String(row.created_at ?? ""),
    messages: Array.isArray(row.chat_messages) ? row.chat_messages.map(toChatMessage) : [],
  };
}

function toChatMessage(row: Record<string, unknown>): ChatMessage {
  return {
    id: String(row.id ?? ""),
    role: String(row.role ?? ""),
    content: String(row.content ?? ""),
    createdAt: String(row.created_at ?? ""),
  };
}

function toStaffProfile(row: Record<string, unknown>): StaffProfile {
  return {
    clerkUserId: String(row.clerk_user_id ?? ""),
    name: String(row.name ?? ""),
    role: String(row.role ?? "sales"),
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
    appointmentRequests: events.filter((event) => event.event_type === "appointment_requested").length,
    handoffRequests: events.filter((event) => event.event_type === "chat_handoff_requested").length,
    topLeadSource: mostFrequent(
      leads
        .map((event) => {
          const metadata = event.metadata as Record<string, unknown> | undefined;
          return typeof metadata?.source === "string" ? metadata.source : "";
        })
        .filter(Boolean),
    ) || "site",
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

function countOpenTasks(leads: Lead[]) {
  return leads.reduce((total, lead) => {
    const open = lead.events?.filter((event) => event.eventType === "task_created" && !event.metadata?.completed).length ?? 0;
    return total + open;
  }, 0);
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
    events: [
      {
        id: "task-demo-1",
        eventType: "task_created",
        note: "Call buyer before lunch with hybrid shortlist",
        createdAt: new Date().toISOString(),
        metadata: { completed: false },
      },
      {
        id: "note-demo-1",
        eventType: "note_added",
        note: "Interested in low monthly payment and high mpg commuter options.",
        createdAt: new Date().toISOString(),
      },
    ],
    assignedTo: "staff-owner-1",
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
    assignedTo: "staff-sales-1",
  },
];

const demoAppointments: Appointment[] = [
  {
    id: "demo-appointment-1",
    name: "Daniel Kim",
    email: "daniel@example.com",
    phone: "(650) 555-0124",
    appointmentAt: new Date(Date.now() + 86400000).toISOString(),
    status: "requested",
    vehicleSlug: inventoryVehicles[1]?.slug,
    leadId: demoLeads[1]?.id,
  },
];

const demoStaffProfiles: StaffProfile[] = [
  { clerkUserId: "staff-owner-1", name: "Alex Manager", role: "owner" },
  { clerkUserId: "staff-sales-1", name: "Jordan Sales", role: "sales" },
];

const demoChatSessions: ChatSessionSummary[] = [
  {
    id: "demo-chat-1",
    visitorId: "visitor-1",
    vehicleSlug: inventoryVehicles[0]?.slug,
    status: "needs_human",
    summary: "Buyer wants a hybrid under $18k with payment guidance and is ready for contact.",
    buyerIntent: "high_intent_financing",
    leadId: demoLeads[0]?.id,
    createdAt: new Date().toISOString(),
    messages: [
      { id: "m1", role: "user", content: "What hybrids under $18k do you have?", createdAt: new Date().toISOString() },
      { id: "m2", role: "assistant", content: "I can help narrow the inventory and route a financing conversation.", createdAt: new Date().toISOString() },
    ],
  },
  {
    id: "demo-chat-2",
    visitorId: "visitor-2",
    vehicleSlug: inventoryVehicles[1]?.slug,
    status: "ai_active",
    summary: "Shopper comparing EV crossover options for weekend test drive.",
    buyerIntent: "vehicle_compare",
    createdAt: new Date().toISOString(),
    messages: [
      { id: "m3", role: "user", content: "Can I book a test drive this weekend?", createdAt: new Date().toISOString() },
      { id: "m4", role: "assistant", content: "Yes, I can route that to the sales team.", createdAt: new Date().toISOString() },
    ],
  },
];
