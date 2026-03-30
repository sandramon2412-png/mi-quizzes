-- ============================================================
-- Luminous Studio — Supabase Schema
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com → SQL Editor → New query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles (extends auth.users) ───────────────────────────
create table public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  name            text,
  email           text,
  bio             text,
  plan            text    default 'free',
  claude_api_key  text,
  groq_api_key    text,
  notifications   jsonb   default '{"sales":true,"quizCompleted":true,"weekly":false}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Quizzes ──────────────────────────────────────────────────
create table public.quizzes (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references public.profiles(id) on delete cascade not null,
  title             text,
  subtitle          text,
  product           text,
  niche             text,
  status            text    default 'draft',
  estimated_minutes int     default 2,
  questions         jsonb   default '[]'::jsonb,
  profiles          jsonb   default '[]'::jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ── Mini-Apps ────────────────────────────────────────────────
create table public.mini_apps (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  name         text,
  type         text,
  niche        text,
  product      text,
  description  text,
  icon         text,
  access_codes text[]  default '{}',
  status       text    default 'active',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Leads (captured from quiz completions) ──────────────────
create table public.leads (
  id           uuid primary key default uuid_generate_v4(),
  quiz_id      uuid references public.quizzes(id) on delete cascade,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  name         text,
  email        text,
  profile_id   text,
  profile_name text,
  profile_emoji text,
  answers      jsonb   default '[]'::jsonb,
  created_at   timestamptz default now()
);

-- ── Analytics Events ─────────────────────────────────────────
create table public.analytics_events (
  id         uuid primary key default uuid_generate_v4(),
  quiz_id    uuid references public.quizzes(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  event_type text,   -- 'view' | 'completion'
  profile_id text,
  created_at timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.quizzes        enable row level security;
alter table public.mini_apps      enable row level security;
alter table public.leads          enable row level security;
alter table public.analytics_events enable row level security;

-- Profiles: own only
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Quizzes: public read, owner write
create policy "quizzes_select_all"    on public.quizzes for select using (true);
create policy "quizzes_insert_own"    on public.quizzes for insert with check (auth.uid() = user_id);
create policy "quizzes_update_own"    on public.quizzes for update using (auth.uid() = user_id);
create policy "quizzes_delete_own"    on public.quizzes for delete using (auth.uid() = user_id);

-- Mini-apps: public read, owner write
create policy "mini_apps_select_all"  on public.mini_apps for select using (true);
create policy "mini_apps_insert_own"  on public.mini_apps for insert with check (auth.uid() = user_id);
create policy "mini_apps_update_own"  on public.mini_apps for update using (auth.uid() = user_id);
create policy "mini_apps_delete_own"  on public.mini_apps for delete using (auth.uid() = user_id);

-- Leads: anyone can insert (quiz takers are anonymous), owner reads
create policy "leads_insert_anon"     on public.leads for insert with check (true);
create policy "leads_select_own"      on public.leads for select using (auth.uid() = user_id);
create policy "leads_delete_own"      on public.leads for delete using (auth.uid() = user_id);

-- Analytics: anyone can insert, owner reads
create policy "analytics_insert_anon" on public.analytics_events for insert with check (true);
create policy "analytics_select_own"  on public.analytics_events for select using (auth.uid() = user_id);

-- ── Auto-create profile on sign up ──────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Quiz settings column (run this in Supabase SQL Editor to enable full functionality) ──
-- Stores: postQuizAction, landingUrl, productUrl, paymentUrl, metaPixelId,
--         metaCapiToken, whatsappNumber, leadCapture, miniAppId, etc.
alter table public.quizzes add column if not exists settings jsonb default '{}'::jsonb;

-- (Legacy columns, no longer needed with settings jsonb)
-- alter table public.quizzes add column if not exists meta_pixel_id   text default '';
-- alter table public.quizzes add column if not exists meta_capi_token text default '';
