-- WiszMe database schema. Run against a fresh Supabase project.
-- Covers only the WiszMe-native experiences (Good Morning / Good Night) —
-- Birthday/Anniversary/Valentine/Special Date/Just Because/Date
-- Invitation/New Year/Christmas are NOT stored here; those categories
-- route out to their own existing products (BirthzMe/UzMe/DatezMe/FeztMe),
-- each with their own database.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "profiles are self-readable" on profiles for select using (auth.uid() = id);
create policy "profiles are self-writable" on profiles for update using (auth.uid() = id);
create policy "profiles are self-insertable" on profiles for insert with check (auth.uid() = id);

create table if not exists wisz_wishes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,

  category text not null check (category in (
    'good-morning', 'good-night', 'mothers-day', 'fathers-day',
    'wedding', 'new-baby', 'get-well-soon', 'good-luck',
    'housewarming', 'diwali', 'sinhala-tamil-new-year'
  )),
  template text not null check (template in (
    'sunrise-letter', 'wake-up-window', 'moon-letter', 'sleepy-cloud',
    'flower-bouquet', 'medal-of-honor', 'rings-join', 'baby-announce',
    'get-well-flowers', 'lucky-charm', 'new-home-sunrise', 'diya-light', 'avurudu-lamp'
  )),

  recipient_name text not null check (char_length(recipient_name) between 1 and 60),
  recipient_nickname text,
  sender_name text not null check (char_length(sender_name) between 1 and 60),

  main_message text not null check (char_length(main_message) <= 3000),
  main_photo_url text,
  memories jsonb not null default '[]'::jsonb,

  music_url text,
  music_type text check (music_type in ('builtin', 'custom')),

  accent_color text,
  has_watermark boolean not null default true,

  status text not null default 'draft' check (status in ('draft', 'published', 'opened', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_wisz_wishes_creator on wisz_wishes (creator_id);
create index if not exists idx_wisz_wishes_slug on wisz_wishes (slug);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_wisz_wishes_updated_at on wisz_wishes;
create trigger trg_wisz_wishes_updated_at
  before update on wisz_wishes
  for each row execute function set_updated_at();

alter table wisz_wishes enable row level security;

create policy "creators can select own wishes" on wisz_wishes for select using (auth.uid() = creator_id);
create policy "creators can insert own wishes" on wisz_wishes for insert with check (auth.uid() = creator_id);
create policy "creators can update own wishes" on wisz_wishes for update using (auth.uid() = creator_id);
create policy "creators can delete own wishes" on wisz_wishes for delete using (auth.uid() = creator_id);

create policy "public can view published wish by slug"
  on wisz_wishes for select
  using (status in ('published', 'opened', 'completed'));

create table if not exists wisz_events (
  id uuid primary key default gen_random_uuid(),
  wish_id uuid not null references wisz_wishes (id) on delete cascade,
  event_type text not null check (event_type in (
    'opened', 'music_started', 'interaction', 'message_revealed', 'completed'
  )),
  created_at timestamptz not null default now()
);

create index if not exists idx_wisz_events_wish on wisz_events (wish_id);

alter table wisz_events enable row level security;

create policy "creators can view own wish events"
  on wisz_events for select
  using (
    exists (
      select 1 from wisz_wishes w
      where w.id = wisz_events.wish_id
        and w.creator_id = auth.uid()
    )
  );
