-- Discord OAuth — link Discord account to profile
alter table public.profiles
  add column if not exists discord_id text unique;

create index if not exists profiles_discord_id_idx on public.profiles (discord_id);
