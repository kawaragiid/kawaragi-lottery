import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi sederhana agar error lebih jelas di console
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL atau Key tidak ditemukan di .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
