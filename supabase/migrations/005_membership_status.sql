-- Membership approval queue for Discord signups
-- Default 'approved' keeps existing members and admin-created accounts active.

alter table public.profiles
  add column if not exists membership_status text not null default 'approved';

alter table public.profiles
  drop constraint if exists profiles_membership_status_check;

alter table public.profiles
  add constraint profiles_membership_status_check
    check (membership_status in ('pending', 'approved'));

create index if not exists profiles_membership_status_idx
  on public.profiles (membership_status);

-- Backfill any nulls (defensive if column was added without default in older drafts)
update public.profiles
set membership_status = 'approved'
where membership_status is null;
