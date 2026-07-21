-- Pendataan anggota baru (admin) — dikirim ke Discord
create table if not exists public.member_intake_records (
  id uuid primary key default gen_random_uuid(),
  ic_name text not null,
  japanese_name text not null,
  citizen_id text not null,
  ic_phone text not null,
  vehicle_plates text,
  ktp_photo_path text not null,
  submitted_by uuid references public.profiles (id) on delete set null,
  discord_sent_at timestamptz,
  discord_error text,
  created_at timestamptz not null default now()
);

create index if not exists member_intake_records_created_at_idx
  on public.member_intake_records (created_at desc);

create index if not exists member_intake_records_citizen_id_idx
  on public.member_intake_records (citizen_id);

alter table public.member_intake_records enable row level security;

-- Bucket private untuk foto KTP (akses via service role / signed URL)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-intake-ktp',
  'member-intake-ktp',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
