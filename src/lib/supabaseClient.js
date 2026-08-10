import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://UkKiTJVsJ4Dcf4MBpT.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_UkKiTJVsJ4Dcf4MBpT_3xw_awInrYXV";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
