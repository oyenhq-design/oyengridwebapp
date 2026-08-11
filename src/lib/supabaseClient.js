import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ewefoxpkcwaniduwqyzj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZWZveHBrY3dhbmlkdXdxeXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzg0MTQsImV4cCI6MjEwMTk1NDQxNH0.rLwUsoYe6McpHOiXoCvKYI07IMA1GSIrkzFQWrAUFgU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // Store session in localStorage so it survives page reloads
    autoRefreshToken: true,     // Automatically refresh the JWT before it expires
    detectSessionInUrl: true,   // Pick up OAuth / magic-link tokens from the URL hash
    storageKey: 'oyen_supabase_auth', // Namespaced key — avoids collisions with oyen_* app keys
  },
});

export default supabase;
