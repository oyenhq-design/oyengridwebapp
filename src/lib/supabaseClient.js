import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ewefoxpkcwaniduwqyzj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZWZveHBrY3dhbmlkdXdxeXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzg0MTQsImV4cCI6MjEwMTk1NDQxNH0.rLwUsoYe6McpHOiXoCvKYI07IMA1GSIrkzFQWrAUFgU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
