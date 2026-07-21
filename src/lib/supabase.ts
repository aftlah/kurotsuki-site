import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export const isSupabaseConfigured =
  Boolean(supabaseConfig.url) && Boolean(supabaseConfig.anonKey);

function missingConfigError(): never {
  throw new Error(
    "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
  );
}

/** Client-side / anon key — untuk browser & public API */
export function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) missingConfigError();
  return createClient(supabaseConfig.url, supabaseConfig.anonKey);
}

/** Server-only — service role (bypass RLS). Jangan expose ke client. */
export function createSupabaseAdmin(): SupabaseClient {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error(
      "Supabase admin belum dikonfigurasi. Isi SUPABASE_SERVICE_ROLE_KEY di .env.local"
    );
  }
  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
