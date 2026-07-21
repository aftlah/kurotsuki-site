import { createSupabaseClient } from "@/lib/supabase";

let client: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}
