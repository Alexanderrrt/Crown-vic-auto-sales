create extension if not exists "pgcrypto";

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  year integer,
  make text,
  model text,
  trim text,
  vin text,
  stock_number text,
  category text not null default 'Inventory',
  summary text not null default '',
  price text not null default '',
  price_number numeric,
  mileage text not null default '',
  mileage_number integer,
  mpg text not null default '',
  transmission text not null default '',
  drivetrain text not null default '',
  exterior_color text,
  interior_color text,
  fuel_type text,
  body_style text,
  status text not null default 'available' check (status in ('available', 'pending', 'sold', 'draft')),
  image text not null default '',
  featured_label text not null default 'Featured',
  is_featured boolean not null default false,
  views integer not null default 0,
  lead_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_media (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  media_type text not null default 'image',
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_specs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  spec_group text not null default 'features',
  label text not null,
  value text not null,
  sort_order integer not null default 0
);

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  name text not null default '',
  email text not null default '',
  role text not null default 'sales' check (role in ('owner', 'manager', 'sales', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'site',
  status text not null default 'new' check (status in ('new', 'contacted', 'appointment', 'won', 'lost', 'spam')),
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  message text not null default '',
  vehicle_slug text,
  budget text,
  trade_vehicle text,
  assigned_to text references public.staff_profiles(clerk_user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  event_type text not null,
  note text not null default '',
  clerk_user_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  vehicle_slug text,
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  appointment_at timestamptz,
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  assigned_to text references public.staff_profiles(clerk_user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  lead_id uuid references public.leads(id) on delete set null,
  vehicle_slug text,
  status text not null default 'ai_active' check (status in ('ai_active', 'needs_human', 'closed')),
  summary text not null default '',
  buyer_intent text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'staff', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.dealership_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  visitor_id text,
  vehicle_slug text,
  lead_id uuid references public.leads(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
alter table public.vehicle_media enable row level security;
alter table public.vehicle_specs enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.appointments enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.dealership_settings enable row level security;
alter table public.analytics_events enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicles' and policyname = 'public read published vehicles') then
    create policy "public read published vehicles" on public.vehicles for select using (status in ('available', 'pending', 'sold'));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicle_media' and policyname = 'public read vehicle media') then
    create policy "public read vehicle media" on public.vehicle_media for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicle_specs' and policyname = 'public read vehicle specs') then
    create policy "public read vehicle specs" on public.vehicle_specs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'public insert leads') then
    create policy "public insert leads" on public.leads for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'public insert appointments') then
    create policy "public insert appointments" on public.appointments for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chat_sessions' and policyname = 'public insert chat sessions') then
    create policy "public insert chat sessions" on public.chat_sessions for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chat_messages' and policyname = 'public insert chat messages') then
    create policy "public insert chat messages" on public.chat_messages for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'analytics_events' and policyname = 'public insert analytics') then
    create policy "public insert analytics" on public.analytics_events for insert with check (true);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values
  ('vehicle-media', 'vehicle-media', true),
  ('site-media', 'site-media', true),
  ('documents', 'documents', false)
on conflict (id) do nothing;

insert into public.vehicles (
  slug, title, year, make, model, trim, category, summary, price, price_number, mileage, mileage_number,
  mpg, transmission, drivetrain, exterior_color, interior_color, fuel_type, body_style, image, featured_label, is_featured
)
values
  ('2024-toyota-corolla-hybrid', '2024 Toyota Corolla Hybrid', 2024, 'Toyota', 'Corolla Hybrid', 'LE', 'Hybrid sedan', 'Efficient, modern, and ideal for daily commuting or rideshare use.', '$19,222', 19222, '111,064 mi', 111064, '53 city / 46 hwy', 'Automatic', 'FWD', 'White', 'Black', 'Hybrid', 'Sedan', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80', 'Featured', true),
  ('2022-hyundai-ioniq-5', '2022 Hyundai Ioniq 5', 2022, 'Hyundai', 'Ioniq 5', 'SE', 'Electric crossover', 'Fast-charging EV with futuristic design and everyday practicality.', '$19,777', 19777, '64,636 mi', 64636, '114 MPGe', 'Single-speed', 'RWD', 'Gray', 'Black', 'Electric', 'SUV', 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80', 'EV pick', true),
  ('2016-toyota-prius-c', '2016 Toyota Prius c', 2016, 'Toyota', 'Prius c', 'Two', 'Commuter hatchback', 'Budget-friendly efficiency with a small footprint and strong mpg.', '$11,444', 11444, '92,080 mi', 92080, '53 city / 46 hwy', 'Automatic', 'FWD', 'Silver', 'Gray', 'Hybrid', 'Hatchback', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80', 'Value', false)
on conflict (slug) do nothing;
