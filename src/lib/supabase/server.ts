import { createSupabaseAdmin, createSupabaseClient } from "@/lib/supabase";

/** Server Components / Route Handlers — anon client */
export function getSupabaseServerClient() {
  return createSupabaseClient();
}

/** Server-only admin ops (service_role) */
export function getSupabaseAdmin() {
  return createSupabaseAdmin();
}
