import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  // console.error("si");
}

export const supabase = createClient(
  SUPABASE_URL  ?? "https://placeholder.supabase.co",
  SUPABASE_ANON ?? "placeholder"
);