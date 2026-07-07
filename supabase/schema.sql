create extension if not exists "pgcrypto";

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'Inventory',
  summary text not null default '',
  price text not null default '',
  mileage text not null default '',
  mpg text not null default '',
  transmission text not null default '',
  drivetrain text not null default '',
  image text not null default '',
  featured_label text not null default 'Featured',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'site',
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  message text not null default '',
  vehicle_slug text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
alter table public.leads enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicles' and policyname = 'read vehicles') then
    create policy "read vehicles" on public.vehicles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'insert leads') then
    create policy "insert leads" on public.leads for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chat_sessions' and policyname = 'insert sessions') then
    create policy "insert sessions" on public.chat_sessions for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chat_messages' and policyname = 'insert messages') then
    create policy "insert messages" on public.chat_messages for insert with check (true);
  end if;
end $$;

insert into public.vehicles (slug, title, category, summary, price, mileage, mpg, transmission, drivetrain, image, featured_label, is_featured)
values
  ('2024-toyota-corolla-hybrid', '2024 Toyota Corolla Hybrid', 'Hybrid sedan', 'Efficient, modern, and ideal for daily commuting or rideshare use.', '$19,222', '111,064 mi', '53 city / 46 hwy', 'Automatic', 'FWD', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80', 'Featured', true),
  ('2022-hyundai-ioniq-5', '2022 Hyundai Ioniq 5', 'Electric crossover', 'Fast-charging EV with futuristic design and everyday practicality.', '$19,777', '64,636 mi', '114 MPGe', 'Single-speed', 'RWD', 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80', 'EV pick', true),
  ('2016-toyota-prius-c', '2016 Toyota Prius c', 'Commuter hatchback', 'Budget-friendly efficiency with a small footprint and strong mpg.', '$11,444', '92,080 mi', '53 city / 46 hwy', 'Automatic', 'FWD', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80', 'Value', false)
on conflict (slug) do nothing;
