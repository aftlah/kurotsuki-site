-- ============================================================
-- Kurotsuki-Kai — Supabase Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  rank text not null default 'shinjin'
    check (rank in (
      'oyabun', 'wakagashira', 'kaicho', 'onnakashira',
      'taicho', 'koseiin', 'shinjin'
    )),
  job_title text
    check (job_title is null or job_title in ('komon', 'sodan')),
  division text
    check (division is null or division in (
      'kitsune_unit', 'mitsugyo', 'somukanri',
      'ryutsutosei', 'geenbakodo', 'kodosakusenbu'
    )),
  role text not null default 'member'
    check (role in ('member', 'admin')),
  is_online boolean not null default false,
  vitality_points integer not null default 0,
  streak integer not null default 0,
  focus_hours numeric(6, 2) not null default 0,
  avatar_url text,
  discord_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_job_title_rank_check
    check (job_title is null or rank = 'kaicho')
);

create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_rank_idx on public.profiles (rank);
create index if not exists profiles_division_idx on public.profiles (division);
create index if not exists profiles_discord_id_idx on public.profiles (discord_id);

-- ------------------------------------------------------------
-- 2. ANNOUNCEMENTS (Communiqué / pengumuman dashboard)
-- ------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  type text not null default 'general'
    check (type in ('event', 'resource', 'general', 'tradition', 'discipline', 'honor')),
  is_featured boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists announcements_type_idx on public.announcements (type);
create index if not exists announcements_created_at_idx on public.announcements (created_at desc);

-- ------------------------------------------------------------
-- 3. SHOP ITEMS (Toko Senjata)
-- ------------------------------------------------------------
create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  category text not null default 'General',
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shop_items_category_idx on public.shop_items (category);
create index if not exists shop_items_active_idx on public.shop_items (is_active);

-- ------------------------------------------------------------
-- 4. SHOP ORDERS (pembelian / keranjang selesai)
-- ------------------------------------------------------------
create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id uuid not null references public.shop_items (id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  total_price integer not null check (total_price >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists shop_orders_user_idx on public.shop_orders (user_id);
create index if not exists shop_orders_created_at_idx on public.shop_orders (created_at desc);

-- ------------------------------------------------------------
-- 5. ATTENDANCE LOGS (Panel Admin — check in/out)
-- ------------------------------------------------------------
create table if not exists public.attendance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null check (action in ('check_in', 'check_out')),
  status text not null default 'success'
    check (status in ('success', 'failed')),
  recorded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists attendance_logs_user_idx on public.attendance_logs (user_id);
create index if not exists attendance_logs_created_at_idx on public.attendance_logs (created_at desc);

-- ------------------------------------------------------------
-- 6. UPDATED_AT trigger helper
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists shop_items_set_updated_at on public.shop_items;
create trigger shop_items_set_updated_at
  before update on public.shop_items
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7. Rank level + permission helpers
-- ------------------------------------------------------------
create or replace function public.profile_rank_level(p_rank text)
returns int
language sql
immutable
as $$
  select case p_rank
    when 'oyabun' then 7
    when 'wakagashira' then 6
    when 'kaicho' then 5
    when 'onnakashira' then 4
    when 'taicho' then 3
    when 'koseiin' then 2
    when 'shinjin' then 1
    else 0
  end;
$$;

create or replace function public.current_user_has_permission(perm text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  p record;
begin
  select role, rank, division
  into p
  from public.profiles
  where id = auth.uid();

  if not found then
    return false;
  end if;

  if p.role = 'admin' then
    return true;
  end if;

  case perm
    when 'admin.access' then
      return p.rank in ('kaicho', 'onnakashira', 'taicho')
        and p.division is not null;

    when 'members.view_all' then
      return p.rank in ('oyabun', 'wakagashira', 'kaicho', 'onnakashira');

    when 'members.view_division' then
      return p.division is not null;

    when 'members.manage' then
      return false;

    when 'announcements.manage' then
      return p.division = 'somukanri'
        and public.profile_rank_level(p.rank) >= public.profile_rank_level('koseiin');

    when 'shop.manage' then
      return false;

    when 'attendance.manage' then
      return p.division = 'somukanri'
        and public.profile_rank_level(p.rank) >= public.profile_rank_level('koseiin');

    when 'attendance.manage_division' then
      return p.division is not null
        and public.profile_rank_level(p.rank) >= public.profile_rank_level('taicho');

    else
      return false;
  end case;
end;
$$;

-- ------------------------------------------------------------
-- 8. Auto-create profile when user registers (auth.users)
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, username, display_name, role, rank, job_title, division
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'member',
    'shinjin',
    null,
    null
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.shop_items enable row level security;
alter table public.shop_orders enable row level security;
alter table public.attendance_logs enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and rank = (select rank from public.profiles where id = auth.uid())
    and division is not distinct from (select division from public.profiles where id = auth.uid())
    and job_title is not distinct from (select job_title from public.profiles where id = auth.uid())
  );

create policy "profiles_update_managed"
  on public.profiles for update
  to authenticated
  using (public.current_user_has_permission('members.manage'))
  with check (public.current_user_has_permission('members.manage'));

create policy "announcements_select_authenticated"
  on public.announcements for select
  to authenticated
  using (true);

create policy "announcements_insert_admin"
  on public.announcements for insert
  to authenticated
  with check (public.current_user_has_permission('announcements.manage'));

create policy "shop_items_select_active"
  on public.shop_items for select
  to authenticated
  using (is_active = true);

create policy "shop_items_manage_admin"
  on public.shop_items for all
  to authenticated
  using (public.current_user_has_permission('shop.manage'))
  with check (public.current_user_has_permission('shop.manage'));

create policy "shop_orders_select_own"
  on public.shop_orders for select
  to authenticated
  using (user_id = auth.uid());

create policy "shop_orders_insert_own"
  on public.shop_orders for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "shop_orders_select_admin"
  on public.shop_orders for select
  to authenticated
  using (public.current_user_has_permission('shop.manage'));

create policy "attendance_select_own"
  on public.attendance_logs for select
  to authenticated
  using (user_id = auth.uid());

create policy "attendance_select_admin"
  on public.attendance_logs for select
  to authenticated
  using (
    public.current_user_has_permission('attendance.manage')
    or public.current_user_has_permission('attendance.manage_division')
  );

create policy "attendance_insert_admin"
  on public.attendance_logs for insert
  to authenticated
  with check (
    public.current_user_has_permission('attendance.manage')
    or public.current_user_has_permission('attendance.manage_division')
  );
