import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const PlanFeaturesContext = createContext(null);

export function PlanFeaturesProvider({ children }) {
  const [features, setFeatures] = useState([]);
  const [aiAllocation, setAiAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePlanName, setActivePlanName] = useState("");

  const syncPlan = async () => {
    try {
      setLoading(true);
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const planName = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise Trial";
      setActivePlanName(planName);

      // 1. Fetch matching plan from pricing_plans
      const { data: plan, error: planErr } = await supabase
        .from("pricing_plans")
        .select("id")
        .ilike("name", planName.trim())
        .limit(1);

      if (planErr || !plan || plan.length === 0) {
        // Fallback: If not found, look up by standard fallback plan
        setFeatures([]);
        setAiAllocation(null);
        return;
      }

      const planId = plan[0].id;

      // 2. Fetch associated features and AI token allocations in parallel
      const [featuresRes, aiRes] = await Promise.all([
        supabase
          .from("pricing_plan_features")
          .select("*")
          .eq("plan_id", planId),
        supabase
          .from("pricing_plan_ai_allocation")
          .select("*")
          .eq("plan_id", planId)
          .maybeSingle()
      ]);

      setFeatures(featuresRes.data || []);
      setAiAllocation(aiRes.data || null);
    } catch (err) {
      console.warn("Failed to load plan features from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncPlan();

    // Listen to changes in local storage (e.g. plan upgrades on checkout)
    window.addEventListener("storage", syncPlan);
    return () => window.removeEventListener("storage", syncPlan);
  }, []);

  const isFeatureEnabled = (featureName) => {
    // If loading or empty, default to true for basic/enterprise trial fallback
    if (loading || features.length === 0) return true;
    
    const matched = features.find(
      (f) => f.feature_name.toLowerCase() === featureName.toLowerCase()
    );
    return matched ? matched.enabled : false;
  };

  const getFeatureLimit = (featureName) => {
    if (loading || features.length === 0) return "Unlimited";
    const matched = features.find(
      (f) => f.feature_name.toLowerCase() === featureName.toLowerCase()
    );
    return matched ? matched.usage_limit : "Unlimited";
  };

  return (
    <PlanFeaturesContext.Provider
      value={{
        features,
        aiAllocation,
        loading,
        activePlanName,
        isFeatureEnabled,
        getFeatureLimit,
        refresh: syncPlan
      }}
    >
      {children}
    </PlanFeaturesContext.Provider>
  );
}

export function usePlanFeatures() {
  const context = useContext(PlanFeaturesContext);
  if (!context) {
    throw new Error("usePlanFeatures must be used within a PlanFeaturesProvider");
  }
  return context;
}
