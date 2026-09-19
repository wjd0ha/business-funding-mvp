import { createClient } from "@supabase/supabase-js";

export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return createClient(url || "https://preview-placeholder.supabase.co", key || "sb_publishable_preview_placeholder", {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}
