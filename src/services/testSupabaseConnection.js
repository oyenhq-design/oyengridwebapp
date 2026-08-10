import { supabase } from "../lib/supabaseClient";

/**
 * Utility function to verify connection to Supabase and query public.pricing_plans
 */
export async function testSupabasePricingPlansConnection() {
  try {
    console.log("🔌 Initiating Supabase connection test to 'pricing_plans' table...");
    
    const { data, error, count } = await supabase
      .from("pricing_plans")
      .select("*", { count: "exact" });

    if (error) {
      console.warn("⚠️ Supabase 'pricing_plans' query notice:", error.message || error);
      return { success: false, error, data: [] };
    }

    console.log(`✅ Supabase Connection Successful! Retrieved ${data?.length || 0} pricing records from 'pricing_plans'.`);
    if (data && data.length > 0) {
      console.table(data);
    }
    
    return { success: true, count: data?.length || 0, data };
  } catch (err) {
    console.warn("⚠️ Supabase Connection Test Exception:", err);
    return { success: false, error: err, data: [] };
  }
}
