-- ============================================================
-- DEWA 3D Print Service — Database Schema
-- Run this in the Supabase SQL editor for your project.
-- ============================================================

-- Colors (filament options)
create table public.colors (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  hex  text not null
);

-- Pickup locations
create table public.pickup_locations (
  id   uuid primary key default gen_random_uuid(),
  name text not null
);

-- 3D Models catalog
create table public.models (
  id                     uuid primary key default gen_random_uuid(),
  title                  text not null,
  description            text,
  category               text,
  tags                   text[]    not null default '{}',
  images                 text[]    not null default '{}',
  glb_file_url           text,
  base_print_time_minutes integer  not null default 60,
  available_colors       uuid[]    not null default '{}',
  created_by             uuid      references auth.users(id) on delete set null,
  created_at             timestamptz not null default now()
);

-- Print requests (no auth — submitted by any employee)
create table public.requests (
  id                  uuid primary key default gen_random_uuid(),
  model_id            uuid references public.models(id) on delete set null,
  color_id            uuid references public.colors(id) on delete set null,
  pickup_location_id  uuid references public.pickup_locations(id) on delete set null,
  customer_name       text not null,
  phone               text not null,
  email               text,
  payroll_id          text not null,
  status              text not null default 'new'
                        check (status in ('new', 'in_progress', 'ready', 'completed')),
  estimated_print_time integer,           -- minutes, set by admin
  created_at          timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.colors           enable row level security;
alter table public.pickup_locations enable row level security;
alter table public.models           enable row level security;
alter table public.requests         enable row level security;

-- Colors: anyone can read
create policy "colors_public_read" on public.colors
  for select using (true);

-- Colors: admins can manage
create policy "colors_admin_write" on public.colors
  for all using (auth.uid() is not null);

-- Pickup locations: anyone can read
create policy "locations_public_read" on public.pickup_locations
  for select using (true);

-- Pickup locations: admins can manage
create policy "locations_admin_write" on public.pickup_locations
  for all using (auth.uid() is not null);

-- Models: anyone can read
create policy "models_public_read" on public.models
  for select using (true);

-- Models: admins can create / update / delete
create policy "models_admin_insert" on public.models
  for insert with check (auth.uid() is not null);

create policy "models_admin_update" on public.models
  for update using (auth.uid() is not null);

create policy "models_admin_delete" on public.models
  for delete using (auth.uid() is not null);

-- Requests: anyone can insert (public form — no login)
create policy "requests_public_insert" on public.requests
  for insert with check (true);

-- Requests: only admins can read or update
create policy "requests_admin_read" on public.requests
  for select using (auth.uid() is not null);

create policy "requests_admin_update" on public.requests
  for update using (auth.uid() is not null);

-- ============================================================
-- Storage buckets (create via Supabase dashboard or CLI)
-- ============================================================
-- Bucket: "model-images"  — public read, admin write
-- Bucket: "model-glb"     — public read, admin write
