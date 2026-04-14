-- ============================================================
-- Luminous Studio — Migración Abril 2026
-- Agrega: tracking de respuestas, dominio propio, white-label, subdominios
--
-- CÓMO EJECUTAR:
-- 1. Entra a https://app.supabase.com → tu proyecto
-- 2. SQL Editor → New query
-- 3. Copia y pega TODO este archivo
-- 4. Click "Run" (o Ctrl+Enter)
--
-- Es SEGURO ejecutarlo varias veces (usa IF NOT EXISTS en todo).
-- No toca tus datos existentes.
-- ============================================================

-- ── 1. Response Events (tracking de uso mensual) ────────────
-- Cuenta 1 respuesta por visitante único, por contenido, por mes.
-- La UNIQUE constraint impide duplicados automáticamente.
create table if not exists public.response_events (
  id           uuid        default uuid_generate_v4() primary key,
  owner_id     uuid        references auth.users on delete cascade not null,
  content_type text        not null,        -- 'quiz' o 'miniapp'
  content_id   text        not null,
  visitor_id   text        not null,
  month        text        not null,        -- formato 'YYYY-MM'
  created_at   timestamptz default now(),
  unique (owner_id, content_type, content_id, visitor_id, month)
);

-- Índice para consultas rápidas de conteo por mes
create index if not exists idx_response_events_owner_month
  on public.response_events (owner_id, month);

-- Seguridad: solo el dueño puede ver sus respuestas, cualquiera puede insertar
alter table public.response_events enable row level security;

drop policy if exists "responses_select_own" on public.response_events;
create policy "responses_select_own" on public.response_events
  for select using (auth.uid() = owner_id);

drop policy if exists "responses_insert_any" on public.response_events;
create policy "responses_insert_any" on public.response_events
  for insert with check (true);

-- ── 2. Campos nuevos en profiles ────────────────────────────
-- Dominio propio (Pro+)
alter table public.profiles add column if not exists custom_domain text default '';

-- White-label (Elite)
alter table public.profiles add column if not exists white_label      boolean default false;
alter table public.profiles add column if not exists white_label_name text    default '';
alter table public.profiles add column if not exists white_label_logo text    default '';

-- Subdominios (Elite, máximo 5 — se valida en frontend)
alter table public.profiles add column if not exists subdomains jsonb default '[]'::jsonb;

-- ============================================================
-- LISTO. Si ves "Success. No rows returned", todo funcionó.
--
-- Verificar que funcionó (opcional — pega esto en otra query):
--   select column_name from information_schema.columns
--   where table_name = 'profiles'
--     and column_name in ('custom_domain','white_label','subdomains');
--   -- Debe devolver 3 filas.
--
--   select count(*) from public.response_events;
--   -- Debe devolver 0 (tabla recién creada).
-- ============================================================
