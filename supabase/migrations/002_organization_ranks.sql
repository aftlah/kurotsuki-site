-- ============================================================
-- Migration 002: Organization ranks, divisions, site roles
-- Jalankan di Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add new columns (safe for existing DB)
alter table public.profiles
  add column if not exists job_title text,
  add column if not exists division text;

-- 2. Migrate legacy role values
update public.profiles
set role = case
  when role in ('owner', 'admin') then 'admin'
  else 'member'
end;

-- 3. Migrate legacy rank text to org ranks
update public.profiles
set rank = case
  when role = 'admin' and lower(coalesce(rank, '')) in ('leader', 'oyabun') then 'oyabun'
  when role = 'admin' then 'wakagashira'
  when lower(coalesce(rank, '')) in (
    'oyabun', 'wakagashira', 'kaicho', 'onnakashira', 'taicho', 'koseiin', 'shinjin'
  ) then lower(rank)
  else 'shinjin'
end;

-- Clear job_title when not kaicho
update public.profiles
set job_title = null
where rank <> 'kaicho';

-- 3. Drop old role constraint and apply new ones
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  alter column rank set default 'shinjin',
  alter column role set default 'member';

alter table public.profiles
  add constraint profiles_role_check
    check (role in ('member', 'admin'));

alter table public.profiles drop constraint if exists profiles_rank_check;
alter table public.profiles
  add constraint profiles_rank_check
    check (rank in (
      'oyabun', 'wakagashira', 'kaicho', 'onnakashira',
      'taicho', 'koseiin', 'shinjin'
    ));

alter table public.profiles drop constraint if exists profiles_job_title_check;
alter table public.profiles
  add constraint profiles_job_title_check
    check (job_title is null or job_title in ('komon', 'sodan'));

alter table public.profiles drop constraint if exists profiles_division_check;
alter table public.profiles
  add constraint profiles_division_check
    check (division is null or division in (
      'kitsune_unit', 'mitsugyo', 'somukanri',
      'ryutsutosei', 'geenbakodo', 'kodosakusenbu'
    ));

alter table public.profiles drop constraint if exists profiles_job_title_rank_check;
alter table public.profiles
  add constraint profiles_job_title_rank_check
    check (job_title is null or rank = 'kaicho');

create index if not exists profiles_rank_idx on public.profiles (rank);
create index if not exists profiles_division_idx on public.profiles (division);

-- 4. Rank level helper
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

-- 5. Permission helper (mirror src/lib/organization/permissions.ts)
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

  -- Site admin bypass
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

-- 6. Update handle_new_user trigger
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

-- 7. Drop old RLS policies and recreate with permission helpers
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_managed" on public.profiles;
drop policy if exists "announcements_insert_admin" on public.announcements;
drop policy if exists "shop_items_manage_admin" on public.shop_items;
drop policy if exists "shop_orders_select_admin" on public.shop_orders;
drop policy if exists "attendance_select_admin" on public.attendance_logs;
drop policy if exists "attendance_insert_admin" on public.attendance_logs;

-- Profiles: own update (cannot change role/rank/division/job_title via RLS)
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

create policy "announcements_insert_admin"
  on public.announcements for insert
  to authenticated
  with check (public.current_user_has_permission('announcements.manage'));

create policy "shop_items_manage_admin"
  on public.shop_items for all
  to authenticated
  using (public.current_user_has_permission('shop.manage'))
  with check (public.current_user_has_permission('shop.manage'));

create policy "shop_orders_select_admin"
  on public.shop_orders for select
  to authenticated
  using (public.current_user_has_permission('shop.manage'));

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
