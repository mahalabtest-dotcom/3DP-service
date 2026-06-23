-- ============================================================
-- DEWA 3D Print Service — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Filament colours
insert into public.colors (name, hex) values
  ('Black',  '#1C2B2A'),
  ('White',  '#F5F5F5'),
  ('Grey',   '#9CA3AF');

-- Pickup locations
insert into public.pickup_locations (name) values
  ('Al Sheraa'),
  ('Hudaiba'),
  ('Al Quoz'),
  ('Al Ruwayyah');
