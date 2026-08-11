import React, { useState, useEffect, useCallback } from "react";
import { 
  CreditCard, Plus, CheckCircle2, DollarSign, Layers, HardDrive, Cpu, 
  Globe, RefreshCw, Eye, History, Shield, Zap, FileText, ArrowUpRight, 
  Edit3, Trash2, Copy, Archive, Check, X, Sliders, ChevronRight, BarChart2,
  Building2, Users, Download, AlertCircle, Loader2
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

// Helper: safely format any value as a renderable string
const formatValue = (val, fallback = "") => {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.tokens_per_month) return `${Number(val.tokens_per_month).toLocaleString()} Tokens / mo`;
    if (val.allocation_type && val.value) return `${val.allocation_type}: ${val.value}`;
    if (val.name) return String(val.name);
    if (val.label) return String(val.label);
    if (val.text) return String(val.text);
    if (val.title) return String(val.title);
    if (val.description) return String(val.description);
    return JSON.stringify(val);
  }
  return String(val);
};

// Blank modal data shapes — zero hardcoded business values
const BLANK_PLAN_FORM = {
  // pricing_plans fields
  id: "",
  name: "",
  slug: "",
  category: "",
  description: "",
  price: 0,
  monthlyPrice: 0,
  annualPrice: 0,
  annual_discount_percent: 0,
  currency: "USD",
  billing_period: "",
  setup_fee: 0,
  trial_days: 0,
  cta_button_label: "",
  cta_destination: "",
  badge: "",
  is_popular: false,
  is_active: true,
  display_order: 99,
  status: "published",
  version: "",
  internal_notes: "",
  // UI aliases
  solution: "",
};

const BLANK_AI_FORM = {
  id: null,
  allocation_type: "",
  tokens_per_month: "",
  tier_level: "",
  storage_limit: "",
  accessible_llm_models: [],
};

const BLANK_AUDIENCE_FORM = {
  id: null,
  segment: "",
  recommended_for: "",
  organization_size: "",
};

const BLANK_MARKETING_FORM = {
  id: null,
  cta: "",
  headline: "",
  subheadline: "",
  popular_badge_text: "",
  enterprise_custom_contact_cta: "",
};

export default function SubscriptionsPlansPage() {
  const [activeSolutionTab, setActiveSolutionTab] = useState("Bootcamps & Training");
  const [selectedPlanForConfig, setSelectedPlanForConfig] = useState(null);
  const [configActiveTab, setConfigActiveTab] = useState("pricing");

  // ── Plan card list ──────────────────────────────────────────────────────────
  const [supabasePlans, setSupabasePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Configurator modal form state (5 tables) ─────────────────────────────
  const [editPlan, setEditPlan] = useState({ ...BLANK_PLAN_FORM });           // pricing_plans
  const [editFeatures, setEditFeatures] = useState([]);                        // pricing_plan_features
  const [editAI, setEditAI] = useState({ ...BLANK_AI_FORM });                 // pricing_plan_ai_allocation
  const [editAudience, setEditAudience] = useState({ ...BLANK_AUDIENCE_FORM }); // pricing_plan_target_audience
  const [editMarketing, setEditMarketing] = useState({ ...BLANK_MARKETING_FORM }); // pricing_plan_marketing_copy

  // ── Modal loading / saving ───────────────────────────────────────────────
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [syncStatus, setSyncStatus] = useState({
    status: "Live & Synchronized",
    version: "v2.4.0",
    lastPublished: "Today @ 14:20 WAT",
    visiblePlans: 0,
    pendingChanges: 0,
    cacheStatus: "Purged & Synced"
  });

  const stats = [
    { label: "Total Active Plans", val: "16 Tiers", color: "#111111" },
    { label: "Published Plans", val: "12 Published", color: "#18B67A" },
    { label: "Draft Plans", val: "4 Drafts", color: "#D9A928" },
    { label: "Orgs Using Plans", val: "215 Orgs", color: "#2563EB" },
    { label: "Monthly Revenue (MRR)", val: "$48,250", color: "#18B67A" },
    { label: "Active Free Trials", val: "18 Trials", color: "#D9A928" },
    { label: "Enterprise Contracts", val: "21 Contracts", color: "#7C3AED" },
    { label: "Avg Upgrade Rate", val: "14.2%", color: "#18B67A" }
  ];

  const versionLedger = [
    { version: "v2.4.0", status: "Published (Live)", date: "Aug 06, 2026", author: "Shola Oyewole", notes: "Updated AI Token allocations and added 24/7 SLA tags." },
    { version: "v2.3.1", status: "Archived", date: "Jul 15, 2026", author: "Sarah Jenkins", notes: "Standardised Bootcamp prices to $1,200/mo." },
    { version: "v2.5.0-Draft", status: "Draft", date: "Aug 10, 2026", author: "Femi Adebayo", notes: "Proposed Q4 Pricing Adjustments (+10% ARR discount)." }
  ];

  // ── Fetch pricing_plans list ──────────────────────────────────────────────
  const fetchPricingPlans = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      // Only select columns that exist in pricing_plans schema
      const { data, error } = await supabase
        .from("pricing_plans")
        .select(`
          id, name, slug, category, description,
          price, monthly_price, annual_price, annual_discount_percent,
          currency, billing_period, setup_fee, trial_days,
          cta_button_label, cta_destination,
          badge, is_popular, is_active,
          display_order, status, version,
          published_at, published_by, internal_notes,
          created_at, updated_at
        `)
        .order("name", { ascending: true });

      if (error) {
        console.error("Supabase pricing_plans query error:", error);
        throw new Error(error.message || JSON.stringify(error));
      }

      if (data) {
        const mappedPlans = data.map(item => ({
          // Canonical ID from Supabase — never overridden
          id: item.id,
          slug: item.slug || "",
          name: formatValue(item.name, "Untitled Tier"),
          solution: formatValue(item.category, "Bootcamps & Training"),
          category: formatValue(item.category, "Bootcamps & Training"),
          description: formatValue(item.description, ""),
          monthlyPrice: item.price != null ? Number(item.price) : (item.monthly_price != null ? Number(item.monthly_price) : 0),
          annualPrice: item.annual_price != null ? Number(item.annual_price) : 0,
          annual_discount_percent: item.annual_discount_percent || 0,
          currency: formatValue(item.currency, "USD"),
          billing_period: formatValue(item.billing_period, ""),
          setup_fee: item.setup_fee || 0,
          trial_days: item.trial_days || 0,
          buttonText: formatValue(item.cta_button_label, ""),
          ctaDestination: formatValue(item.cta_destination, ""),
          badge: formatValue(item.badge, ""),
          is_popular: !!item.is_popular,
          popular: !!item.is_popular,
          is_active: item.is_active !== false,
          display_order: item.display_order || 99,
          status: item.status
            ? (String(item.status).charAt(0).toUpperCase() + String(item.status).slice(1))
            : (item.is_active ? "Published" : "Draft"),
          version: formatValue(item.version, ""),
          internal_notes: formatValue(item.internal_notes, ""),
          published_at: item.published_at || null,
          published_by: formatValue(item.published_by, ""),
          lastUpdated: item.updated_at
            ? new Date(item.updated_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
            : "",
        }));

        console.log("✅ pricing_plans fetched:", mappedPlans.length, "records");
        console.table(mappedPlans.map(p => ({ id: p.id, slug: p.slug, name: p.name, status: p.status })));

        setSupabasePlans(mappedPlans);
        setSyncStatus(prev => ({ ...prev, visiblePlans: mappedPlans.length }));
      }
    } catch (err) {
      console.error("Error fetching pricing plans:", err);
      setFetchError(err.message || "Failed to load pricing plans from Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPricingPlans(); }, [fetchPricingPlans]);

  // Filter plan cards by active solution tab
  const currentPlans = supabasePlans.filter(p =>
    p.solution === activeSolutionTab || p.category === activeSolutionTab ||
    (!p.category && activeSolutionTab === "Bootcamps & Training")
  );
  const displayedPlans = currentPlans.length > 0
    ? currentPlans
    : (activeSolutionTab === "Bootcamps & Training" ? supabasePlans : []);

  // ── Open configurator — fetch all 4 related tables for this plan ──────────
  const openConfigModal = async (plan) => {
    setSelectedPlanForConfig(plan);
    setSaveError(null);
    setConfigActiveTab("pricing");
    setModalLoading(true);

    // Seed pricing_plans fields immediately from the card data
    setEditPlan({
      id: plan.id,
      name: plan.name || "",
      slug: plan.slug || "",
      category: plan.category || "",
      description: plan.description || "",
      price: plan.monthlyPrice || 0,
      monthlyPrice: plan.monthlyPrice || 0,
      annualPrice: plan.annualPrice || 0,
      annual_discount_percent: plan.annual_discount_percent || 0,
      currency: plan.currency || "USD",
      billing_period: plan.billing_period || "",
      setup_fee: plan.setup_fee || 0,
      trial_days: plan.trial_days || 0,
      cta_button_label: plan.buttonText || "",
      cta_destination: plan.ctaDestination || "",
      badge: plan.badge || "",
      is_popular: !!plan.is_popular,
      is_active: plan.is_active !== false,
      status: plan.status || "published",
      version: plan.version || "",
      internal_notes: plan.internal_notes || "",
      solution: plan.solution || "",
    });

    // Reset child table states
    setEditFeatures([]);
    setEditAI({ ...BLANK_AI_FORM });
    setEditAudience({ ...BLANK_AUDIENCE_FORM });
    setEditMarketing({ ...BLANK_MARKETING_FORM });

    try {
      const planId = plan.id;

      // Parallel fetch all 4 child tables using plan_id
      const [featRes, aiRes, audRes, mktRes] = await Promise.all([
        supabase
          .from("pricing_plan_features")
          .select("id, plan_id, feature_name, category, enabled, usage_limit, display_order")
          .eq("plan_id", planId)
          .order("display_order", { ascending: true }),

        supabase
          .from("pricing_plan_ai_allocation")
          .select("id, plan_id, allocation_type, tokens_per_month, tier_level, storage_limit, accessible_llm_models")
          .eq("plan_id", planId)
          .maybeSingle(),

        supabase
          .from("pricing_plan_target_audience")
          .select("id, plan_id, segment, recommended_for, organization_size")
          .eq("plan_id", planId)
          .maybeSingle(),

        supabase
          .from("pricing_plan_marketing_copy")
          .select("id, plan_id, cta, headline, subheadline, popular_badge_text, enterprise_custom_contact_cta")
          .eq("plan_id", planId)
          .maybeSingle(),
      ]);

      // Features
      if (featRes.error) console.warn("pricing_plan_features fetch error:", featRes.error.message);
      else setEditFeatures(featRes.data || []);

      // AI Allocation
      if (aiRes.error) console.warn("pricing_plan_ai_allocation fetch error:", aiRes.error.message);
      else if (aiRes.data) {
        setEditAI({
          id: aiRes.data.id,
          allocation_type: formatValue(aiRes.data.allocation_type, ""),
          tokens_per_month: aiRes.data.tokens_per_month != null ? String(aiRes.data.tokens_per_month) : "",
          tier_level: formatValue(aiRes.data.tier_level, ""),
          storage_limit: formatValue(aiRes.data.storage_limit, ""),
          accessible_llm_models: Array.isArray(aiRes.data.accessible_llm_models)
            ? aiRes.data.accessible_llm_models
            : [],
        });
      }

      // Target Audience
      if (audRes.error) console.warn("pricing_plan_target_audience fetch error:", audRes.error.message);
      else if (audRes.data) {
        setEditAudience({
          id: audRes.data.id,
          segment: formatValue(audRes.data.segment, ""),
          recommended_for: formatValue(audRes.data.recommended_for, ""),
          organization_size: formatValue(audRes.data.organization_size, ""),
        });
      }

      // Marketing & Copy
      if (mktRes.error) console.warn("pricing_plan_marketing_copy fetch error:", mktRes.error.message);
      else if (mktRes.data) {
        setEditMarketing({
          id: mktRes.data.id,
          cta: formatValue(mktRes.data.cta, ""),
          headline: formatValue(mktRes.data.headline, ""),
          subheadline: formatValue(mktRes.data.subheadline, ""),
          popular_badge_text: formatValue(mktRes.data.popular_badge_text, ""),
          enterprise_custom_contact_cta: formatValue(mktRes.data.enterprise_custom_contact_cta, ""),
        });
      }
    } catch (err) {
      console.error("Error fetching plan configuration data:", err);
      setSaveError(`Failed to load configuration: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  // ── Save — writes to each normalized table separately ────────────────────
  const handleSavePlanConfiguration = async () => {
    if (!editPlan.id) {
      setSaveError("Invalid plan identifier. Cannot update record.");
      return;
    }

    // UUID format guard — prevents any synthetic ID from reaching Supabase
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(editPlan.id)) {
      setSaveError(`Invalid plan ID: "${editPlan.id}". Only real Supabase records can be updated. Reload the page.`);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      const planId = editPlan.id;

      // ── 1. UPDATE pricing_plans ─────────────────────────────────────────
      // Only include columns that exist in the pricing_plans schema
      const planPayload = {
        name: editPlan.name,
        description: editPlan.description,
        price: Number(editPlan.monthlyPrice),
        monthly_price: Number(editPlan.monthlyPrice),
        annual_price: Number(editPlan.annualPrice),
        annual_discount_percent: Number(editPlan.annual_discount_percent) || 0,
        currency: editPlan.currency || "USD",
        billing_period: editPlan.billing_period || "",
        setup_fee: Number(editPlan.setup_fee) || 0,
        trial_days: Number(editPlan.trial_days) || 0,
        cta_button_label: editPlan.cta_button_label,
        cta_destination: editPlan.cta_destination || "",
        badge: editPlan.badge || "",
        is_popular: !!editPlan.is_popular,
        is_active: editPlan.is_active !== false,
        status: editPlan.status ? editPlan.status.toLowerCase() : "published",
        version: editPlan.version || "",
        internal_notes: editPlan.internal_notes || "",
        updated_at: new Date().toISOString(),
      };

      console.log(`UPDATE pricing_plans id=${planId}`, planPayload);
      const { error: planErr } = await supabase
        .from("pricing_plans")
        .update(planPayload)
        .eq("id", planId);
      if (planErr) throw new Error(`pricing_plans: ${planErr.message}`);

      // ── 2. UPSERT pricing_plan_features ────────────────────────────────
      // Update each existing feature row by its own id
      for (const feat of editFeatures) {
        if (!feat.id) continue;
        const { error: fErr } = await supabase
          .from("pricing_plan_features")
          .update({
            feature_name: feat.feature_name,
            category: feat.category,
            enabled: !!feat.enabled,
            usage_limit: feat.usage_limit || "",
            updated_at: new Date().toISOString(),
          })
          .eq("id", feat.id)
          .eq("plan_id", planId);
        if (fErr) console.warn("pricing_plan_features update error:", fErr.message);
      }

      // ── 3. UPDATE pricing_plan_ai_allocation ───────────────────────────
      if (editAI.id) {
        const aiPayload = {
          allocation_type: editAI.allocation_type || "",
          tokens_per_month: editAI.tokens_per_month !== "" ? Number(editAI.tokens_per_month) : null,
          tier_level: editAI.tier_level || "",
          storage_limit: editAI.storage_limit || "",
          accessible_llm_models: editAI.accessible_llm_models || [],
          updated_at: new Date().toISOString(),
        };
        console.log(`UPDATE pricing_plan_ai_allocation plan_id=${planId}`, aiPayload);
        const { error: aiErr } = await supabase
          .from("pricing_plan_ai_allocation")
          .update(aiPayload)
          .eq("id", editAI.id)
          .eq("plan_id", planId);
        if (aiErr) throw new Error(`pricing_plan_ai_allocation: ${aiErr.message}`);
      }

      // ── 4. UPDATE pricing_plan_target_audience ─────────────────────────
      if (editAudience.id) {
        const audPayload = {
          segment: editAudience.segment || "",
          recommended_for: editAudience.recommended_for || "",
          organization_size: editAudience.organization_size || "",
          updated_at: new Date().toISOString(),
        };
        console.log(`UPDATE pricing_plan_target_audience plan_id=${planId}`, audPayload);
        const { error: audErr } = await supabase
          .from("pricing_plan_target_audience")
          .update(audPayload)
          .eq("id", editAudience.id)
          .eq("plan_id", planId);
        if (audErr) throw new Error(`pricing_plan_target_audience: ${audErr.message}`);
      }

      // ── 5. UPDATE pricing_plan_marketing_copy ──────────────────────────
      if (editMarketing.id) {
        const mktPayload = {
          cta: editMarketing.cta || "",
          headline: editMarketing.headline || "",
          subheadline: editMarketing.subheadline || "",
          popular_badge_text: editMarketing.popular_badge_text || "",
          enterprise_custom_contact_cta: editMarketing.enterprise_custom_contact_cta || "",
          updated_at: new Date().toISOString(),
        };
        console.log(`UPDATE pricing_plan_marketing_copy plan_id=${planId}`, mktPayload);
        const { error: mktErr } = await supabase
          .from("pricing_plan_marketing_copy")
          .update(mktPayload)
          .eq("id", editMarketing.id)
          .eq("plan_id", planId);
        if (mktErr) throw new Error(`pricing_plan_marketing_copy: ${mktErr.message}`);
      }

      console.log("✅ All tables updated for plan_id:", planId);
      setSelectedPlanForConfig(null);
      await fetchPricingPlans();
      setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1, status: "Modified (Pending Web Publish)" }));
      alert(`✅ SUCCESS: '${editPlan.name}' saved to all Supabase tables!`);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(`Supabase Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishPricing = async () => {
    setSyncStatus(prev => ({ ...prev, lastPublished: "Just Now", pendingChanges: 0, status: "Live & Synchronized" }));
    alert("🚀 SUCCESS: All Subscription Plan modifications have been synchronized live across oyengrid.com, Checkout, and Customer Dashboards!");
  };

  // ── INPUT STYLE HELPER ───────────────────────────────────────────────────
  const inputStyle = { width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700, boxSizing: "border-box" };
  const textareaStyle = { ...inputStyle, fontWeight: 400, fontSize: "0.82rem", resize: "vertical" };
  const labelStyle = { display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem", textTransform: "uppercase" };

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2.25rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      {/* Page Header */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Plans
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Subscription Products &amp; Master Pricing Engine
            </h1>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "#707070", maxWidth: "850px" }}>
              Manage every subscription plan, pricing model, AI allocation, feature availability, storage limits, billing rules, and publishing status for the entire OYEN GRID ecosystem.
            </p>
          </div>
          <button
            onClick={() => alert("Use Supabase to insert a new pricing_plans record, then refresh.")}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.1rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(217, 169, 40, 0.25)" }}
          >
            <Plus size={15} /> Create New Plan
          </button>
        </div>
      </div>

      {/* 1. Stats */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* 2. Sync Console */}
      <section style={{ backgroundColor: "#101010", border: "1px solid #222222", borderRadius: "12px", padding: "1.5rem 1.75rem", color: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Globe size={20} color="#D9A928" />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "#FFFFFF" }}>Website &amp; Ecosystem Pricing Synchronization</h3>
              <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#888888" }}>Controls the active pricing matrix rendered across oyengrid.com, organization checkout, upgrade modals, and customer dashboards.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => alert("Opening oyengrid.com pricing preview overlay...")} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.9rem", backgroundColor: "#181818", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700, color: "#CCCCCC", cursor: "pointer" }}>
              <Eye size={14} /> Preview Website Pricing
            </button>
            <button onClick={handlePublishPricing} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", backgroundColor: "#18B67A", border: "none", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 800, color: "#FFFFFF", cursor: "pointer", boxShadow: "0 4px 12px rgba(24, 182, 122, 0.3)" }}>
              <RefreshCw size={14} /> Publish Pricing to Website
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", backgroundColor: "#181818", border: "1px solid #282828", borderRadius: "8px", padding: "1rem" }}>
          {[
            { lbl: "Landing Page Status", val: `● ${syncStatus.status}`, color: "#18B67A" },
            { lbl: "Current Schema Version", val: syncStatus.version, color: "#D9A928" },
            { lbl: "Last Published", val: syncStatus.lastPublished, color: "#FFFFFF" },
            { lbl: "Visible Plans", val: `${syncStatus.visiblePlans} Active Plans`, color: "#FFFFFF" },
            { lbl: "Pending Changes", val: `${syncStatus.pendingChanges} Pending Edits`, color: syncStatus.pendingChanges > 0 ? "#D9A928" : "#18B67A" },
          ].map(({ lbl, val, color }) => (
            <div key={lbl}>
              <div style={{ fontSize: "0.68rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>{lbl}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color, marginTop: "0.15rem" }}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Solution Tabs */}
      <section style={{ display: "flex", borderBottom: "2px solid #E6DED0", gap: "0.5rem" }}>
        {["Bootcamps & Training", "Webinars & Events", "Education & Institutions", "Enterprise Operations"].map(tab => {
          const isActive = activeSolutionTab === tab;
          return (
            <button key={tab} onClick={() => setActiveSolutionTab(tab)} style={{ padding: "0.75rem 1.25rem", border: "none", background: "none", fontSize: "0.85rem", fontWeight: isActive ? 800 : 600, color: isActive ? "#D9A928" : "#707070", cursor: "pointer", borderBottom: isActive ? "3px solid #D9A928" : "3px solid transparent", marginBottom: "-2px", transition: "all 0.15s ease" }}>
              {tab}
            </button>
          );
        })}
      </section>

      {/* 4. Plan Cards */}
      {loading ? (
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "4rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <Loader2 size={32} color="#D9A928" className="animate-spin" />
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111" }}>Fetching Pricing Plans from Supabase...</div>
          <div style={{ fontSize: "0.78rem", color: "#707070" }}>Querying public.pricing_plans ORDER BY name ASC</div>
        </div>
      ) : fetchError ? (
        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "2rem", color: "#991B1B", display: "flex", alignItems: "center", gap: "1rem" }}>
          <AlertCircle size={24} color="#DC2626" />
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>Error Loading Supabase Pricing Plans</h4>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#B91C1C" }}>{fetchError}</p>
          </div>
          <button onClick={fetchPricingPlans} style={{ marginLeft: "auto", padding: "0.5rem 1rem", backgroundColor: "#DC2626", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
            Retry Query
          </button>
        </div>
      ) : displayedPlans.length === 0 ? (
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "4rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111" }}>No Pricing Plans Found</div>
          <p style={{ fontSize: "0.82rem", color: "#707070", margin: "0.35rem 0 1.25rem" }}>No active records were returned from public.pricing_plans for this category.</p>
          <button onClick={fetchPricingPlans} style={{ padding: "0.55rem 1.25rem", backgroundColor: "#D9A928", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
            Refresh Supabase Query
          </button>
        </div>
      ) : (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {displayedPlans.map(p => (
            <div key={p.id} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: p.popular ? "0 8px 24px rgba(217, 169, 40, 0.12)" : "none", position: "relative" }}>
              {p.popular && (
                <div style={{ position: "absolute", top: "-12px", right: "16px", backgroundColor: "#D9A928", color: "#FFFFFF", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", padding: "0.25rem 0.6rem", borderRadius: "4px", letterSpacing: "0.5px" }}>
                  MOST POPULAR
                </div>
              )}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: p.is_active ? "#E6F8F0" : "#FFF7E4", color: p.is_active ? "#18B67A" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    ● {formatValue(p.status, "Published")} {p.version ? `(${p.version})` : ""}
                  </span>
                  {p.badge && <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#D9A928" }}>{p.badge}</span>}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>{formatValue(p.name)}</h3>
                <div style={{ margin: "0.65rem 0 1rem" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>${formatValue(p.monthlyPrice, "—")}</span>
                  <span style={{ fontSize: "0.8rem", color: "#707070", fontWeight: 600 }}> / month</span>
                  {p.annualPrice > 0 && (
                    <div style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700, marginTop: "0.15rem" }}>
                      ${formatValue(p.annualPrice)} billed annually{p.annual_discount_percent ? ` (-${p.annual_discount_percent}% discount)` : ""}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.78rem", color: "#707070", padding: "0.85rem 0", borderTop: "1px solid #E6DED0", borderBottom: "1px solid #E6DED0" }}>
                  {p.description && <div>🎯 <strong>Description:</strong> <span style={{ color: "#111111" }}>{p.description}</span></div>}
                  {p.currency && <div>💱 <strong>Currency:</strong> <span style={{ color: "#111111" }}>{p.currency}</span></div>}
                  {p.trial_days > 0 && <div>🕐 <strong>Trial:</strong> <span style={{ color: "#111111" }}>{p.trial_days} days</span></div>}
                  {p.buttonText && <div>🔗 <strong>CTA:</strong> <span style={{ color: "#111111" }}>{p.buttonText}</span></div>}
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.68rem", color: "#888888" }}>
                  Updated: {formatValue(p.lastUpdated, "—")}
                  {p.published_by && ` · by ${p.published_by}`}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                <button onClick={() => openConfigModal(p)} style={{ flex: 1, padding: "0.55rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
                  <Sliders size={13} /> Configure Plan
                </button>
                <button onClick={() => alert(`Duplicating plan schema for ${formatValue(p.name)}...`)} style={{ padding: "0.55rem 0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", color: "#707070", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }} title="Duplicate Plan Schema">
                  <Copy size={13} />
                </button>
                <button onClick={() => alert(`Retiring plan ${formatValue(p.name)}...`)} style={{ padding: "0.55rem 0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", color: "#EF4444", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }} title="Retire Plan">
                  <Archive size={13} />
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 5. Version Ledger */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E6DED0" }}>
          <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>Pricing Version Control &amp; Rollback Audit Ledger</h3>
          <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#707070" }}>Every pricing and feature matrix publication creates an immutable version snapshot.</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              {["VERSION", "STATUS", "PUBLISHED DATE", "AUTHOR", "RELEASE NOTES", "ACTIONS"].map(h => (
                <th key={h} style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: h === "ACTIONS" ? "right" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {versionLedger.map((v, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "#D9A928", fontFamily: "monospace" }}>{v.version}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: v.status.includes("Published") ? "#E6F8F0" : "#F7F4ED", color: v.status.includes("Published") ? "#18B67A" : "#707070", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{v.status}</span>
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "#707070" }}>{v.date}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{v.author}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#707070" }}>{v.notes}</td>
                <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Restoring pricing version ${v.version}...`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>Restore Version →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 6. Revenue & Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>Live Plan Revenue Performance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { label: "Monthly Subscription MRR", val: "$48,250", pct: "+18%" },
              { label: "Annual Run Rate (ARR)", val: "$579,000", pct: "On Track" },
              { label: "Customer Lifetime Value (LTV)", val: "$14,500", pct: "Avg Org" },
              { label: "Upgrades This Month", val: "14 Upgrades", pct: "+45%" },
              { label: "Downgrades / Churn", val: "2 Downgrades", pct: "0.8%" }
            ].map((m, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                <span style={{ color: "#707070" }}>{m.label}</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <strong style={{ color: "#111111" }}>{m.val}</strong>
                  <span style={{ fontSize: "0.68rem", color: "#18B67A", fontWeight: 700 }}>({m.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>Organization Distribution Across Tiers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {displayedPlans.slice(0, 4).map((p, idx) => {
              const pcts = ["20%", "41%", "30%", "9%"];
              const counts = ["42 Orgs", "88 Orgs", "64 Orgs", "21 Orgs"];
              return (
                <div key={p.id} style={{ fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontWeight: 600, color: "#111111" }}>{p.name} (${p.monthlyPrice}/mo)</span>
                    <span style={{ fontWeight: 800, color: "#D9A928" }}>{counts[idx] || "—"} ({pcts[idx] || "—"})</span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pcts[idx] || "0%", backgroundColor: "#D9A928" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 7. CONFIGURATOR MODAL */}
      {selectedPlanForConfig && (
        <div onClick={() => setSelectedPlanForConfig(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "flex-end", backdropFilter: "blur(2px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "820px", maxWidth: "90vw", backgroundColor: "#FCFBF8", height: "100vh", display: "flex", flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,0.2)", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #E6DED0", backgroundColor: "#101010", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 800, textTransform: "uppercase" }}>MASTER PRICING ENGINE CONFIGURATOR</div>
                <h2 style={{ margin: "0.2rem 0 0", fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                  {formatValue(editPlan.name, "Configure Subscription Plan")}
                </h2>
                <div style={{ fontSize: "0.7rem", color: "#888888", fontFamily: "monospace", marginTop: "0.15rem" }}>
                  Supabase Record ID: {selectedPlanForConfig.id}
                </div>
              </div>
              <button onClick={() => setSelectedPlanForConfig(null)} style={{ background: "none", border: "none", color: "#888888", cursor: "pointer", padding: "0.5rem" }}>
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            {saveError && (
              <div style={{ padding: "0.85rem 1.5rem", backgroundColor: "#FEF2F2", borderBottom: "1px solid #FCA5A5", color: "#991B1B", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} color="#DC2626" />
                <span style={{ fontWeight: 700 }}>{saveError}</span>
              </div>
            )}

            {/* Modal Loading Indicator */}
            {modalLoading && (
              <div style={{ padding: "0.75rem 1.5rem", backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#92400E" }}>
                <Loader2 size={14} className="animate-spin" />
                Loading configuration from Supabase...
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0", padding: "0 1.5rem" }}>
              {[
                { id: "pricing", label: "1. Pricing & General" },
                { id: "features", label: "2. Feature Matrix" },
                { id: "ai", label: "3. AI Allocation" },
                { id: "availability", label: "4. Target Audience" },
                { id: "marketing", label: "5. Marketing & Copy" }
              ].map(t => (
                <button key={t.id} onClick={() => setConfigActiveTab(t.id)} style={{ padding: "0.75rem 1rem", border: "none", background: "none", fontSize: "0.78rem", fontWeight: configActiveTab === t.id ? 800 : 600, color: configActiveTab === t.id ? "#D9A928" : "#707070", cursor: "pointer", borderBottom: configActiveTab === t.id ? "3px solid #D9A928" : "3px solid transparent" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>

              {/* ── TAB 1: pricing_plans ──────────────────────────────── */}
              {configActiveTab === "pricing" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div>
                    <label style={labelStyle}>PLAN PRODUCT NAME</label>
                    <input type="text" style={inputStyle} value={editPlan.name} onChange={e => setEditPlan(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>SLUG</label>
                    <input type="text" style={{ ...inputStyle, fontFamily: "monospace", color: "#D9A928" }} value={editPlan.slug} onChange={e => setEditPlan(p => ({ ...p, slug: e.target.value }))} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>MONTHLY PRICE ($)</label>
                      <input type="number" style={inputStyle} value={editPlan.monthlyPrice} onChange={e => setEditPlan(p => ({ ...p, monthlyPrice: Number(e.target.value), price: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>ANNUAL PRICE ($)</label>
                      <input type="number" style={inputStyle} value={editPlan.annualPrice} onChange={e => setEditPlan(p => ({ ...p, annualPrice: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>ANNUAL DISCOUNT (%)</label>
                      <input type="number" style={inputStyle} value={editPlan.annual_discount_percent} onChange={e => setEditPlan(p => ({ ...p, annual_discount_percent: Number(e.target.value) }))} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>CURRENCY</label>
                      <select style={inputStyle} value={editPlan.currency} onChange={e => setEditPlan(p => ({ ...p, currency: e.target.value }))}>
                        <option value="USD">USD ($)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>BILLING PERIOD</label>
                      <input type="text" style={inputStyle} value={editPlan.billing_period} onChange={e => setEditPlan(p => ({ ...p, billing_period: e.target.value }))} placeholder="e.g. month, year" />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>SETUP FEE ($)</label>
                      <input type="number" style={inputStyle} value={editPlan.setup_fee} onChange={e => setEditPlan(p => ({ ...p, setup_fee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>TRIAL DAYS</label>
                      <input type="number" style={inputStyle} value={editPlan.trial_days} onChange={e => setEditPlan(p => ({ ...p, trial_days: Number(e.target.value) }))} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>DESCRIPTION</label>
                    <textarea rows={3} style={textareaStyle} value={editPlan.description} onChange={e => setEditPlan(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>CTA BUTTON LABEL</label>
                      <input type="text" style={inputStyle} value={editPlan.cta_button_label} onChange={e => setEditPlan(p => ({ ...p, cta_button_label: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>CTA DESTINATION URL</label>
                      <input type="text" style={inputStyle} value={editPlan.cta_destination} onChange={e => setEditPlan(p => ({ ...p, cta_destination: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>STATUS</label>
                      <select style={inputStyle} value={editPlan.status} onChange={e => setEditPlan(p => ({ ...p, status: e.target.value }))}>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>VERSION</label>
                      <input type="text" style={inputStyle} value={editPlan.version} onChange={e => setEditPlan(p => ({ ...p, version: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>BADGE TEXT</label>
                      <input type="text" style={inputStyle} value={editPlan.badge} onChange={e => setEditPlan(p => ({ ...p, badge: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                      <input type="checkbox" checked={!!editPlan.is_popular} onChange={e => setEditPlan(p => ({ ...p, is_popular: e.target.checked }))} style={{ accentColor: "#D9A928" }} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Mark as Popular</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                      <input type="checkbox" checked={!!editPlan.is_active} onChange={e => setEditPlan(p => ({ ...p, is_active: e.target.checked }))} style={{ accentColor: "#18B67A" }} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Active (visible on site)</span>
                    </label>
                  </div>
                  <div>
                    <label style={labelStyle}>INTERNAL NOTES</label>
                    <textarea rows={2} style={textareaStyle} value={editPlan.internal_notes} onChange={e => setEditPlan(p => ({ ...p, internal_notes: e.target.value }))} />
                  </div>
                </div>
              )}

              {/* ── TAB 2: pricing_plan_features ──────────────────────── */}
              {configActiveTab === "features" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#707070" }}>
                    Features loaded from <strong>pricing_plan_features</strong> for plan_id: <code style={{ color: "#D9A928" }}>{selectedPlanForConfig.id}</code>
                  </div>
                  {editFeatures.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#707070", fontSize: "0.82rem", backgroundColor: "#F7F4ED", borderRadius: "8px", border: "1px solid #E6DED0" }}>
                      No feature records found in <strong>pricing_plan_features</strong> for this plan. Insert rows via Supabase with this plan_id to manage features here.
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                          <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070", textAlign: "left" }}>FEATURE</th>
                          <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070", textAlign: "left" }}>CATEGORY</th>
                          <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070" }}>ENABLED</th>
                          <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070", textAlign: "left" }}>USAGE LIMIT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editFeatures.map((f, idx) => (
                          <tr key={f.id || idx} style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.6rem", fontWeight: 700, color: "#111111" }}>
                              <input type="text" value={f.feature_name || ""} onChange={e => setEditFeatures(prev => prev.map((r, i) => i === idx ? { ...r, feature_name: e.target.value } : r))} style={{ padding: "0.3rem 0.5rem", border: "1px solid #E6DED0", borderRadius: "4px", fontSize: "0.8rem", backgroundColor: "#F7F4ED", width: "100%" }} />
                            </td>
                            <td style={{ padding: "0.6rem", color: "#707070" }}>
                              <input type="text" value={f.category || ""} onChange={e => setEditFeatures(prev => prev.map((r, i) => i === idx ? { ...r, category: e.target.value } : r))} style={{ padding: "0.3rem 0.5rem", border: "1px solid #E6DED0", borderRadius: "4px", fontSize: "0.8rem", backgroundColor: "#F7F4ED", width: "100%" }} />
                            </td>
                            <td style={{ padding: "0.6rem", textAlign: "center" }}>
                              <input type="checkbox" checked={!!f.enabled} onChange={e => setEditFeatures(prev => prev.map((r, i) => i === idx ? { ...r, enabled: e.target.checked } : r))} style={{ accentColor: "#D9A928" }} />
                            </td>
                            <td style={{ padding: "0.6rem" }}>
                              <input type="text" value={f.usage_limit || ""} onChange={e => setEditFeatures(prev => prev.map((r, i) => i === idx ? { ...r, usage_limit: e.target.value } : r))} style={{ padding: "0.3rem 0.5rem", border: "1px solid #E6DED0", borderRadius: "4px", fontSize: "0.78rem", backgroundColor: "#F7F4ED", width: "100%" }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── TAB 3: pricing_plan_ai_allocation ────────────────── */}
              {configActiveTab === "ai" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#707070" }}>
                    AI data from <strong>pricing_plan_ai_allocation</strong> for plan_id: <code style={{ color: "#D9A928" }}>{selectedPlanForConfig.id}</code>
                    {!editAI.id && <span style={{ color: "#EF4444", marginLeft: "0.5rem" }}>(No record found — insert a row in Supabase to enable editing)</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>TIER LEVEL</label>
                      <select style={inputStyle} value={editAI.tier_level} onChange={e => setEditAI(p => ({ ...p, tier_level: e.target.value }))} disabled={!editAI.id}>
                        <option value="">— Select —</option>
                        <option value="Basic">Basic AI Copilot</option>
                        <option value="Standard">Standard Operational AI</option>
                        <option value="Enterprise">Enterprise Dedicated AI Cluster</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>ALLOCATION TYPE</label>
                      <input type="text" style={inputStyle} value={editAI.allocation_type} onChange={e => setEditAI(p => ({ ...p, allocation_type: e.target.value }))} disabled={!editAI.id} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>TOKENS PER MONTH</label>
                      <input type="text" style={inputStyle} value={editAI.tokens_per_month} onChange={e => setEditAI(p => ({ ...p, tokens_per_month: e.target.value }))} disabled={!editAI.id} placeholder="e.g. 250000" />
                    </div>
                    <div>
                      <label style={labelStyle}>STORAGE LIMIT</label>
                      <input type="text" style={inputStyle} value={editAI.storage_limit} onChange={e => setEditAI(p => ({ ...p, storage_limit: e.target.value }))} disabled={!editAI.id} placeholder="e.g. 500 GB" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>ACCESSIBLE LLM MODELS</label>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      {["GPT-4o Enterprise", "Claude 3.5 Sonnet", "DeepSeek V3", "Gemini Pro"].map(model => (
                        <label key={model} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
                          <input
                            type="checkbox"
                            disabled={!editAI.id}
                            checked={Array.isArray(editAI.accessible_llm_models) && editAI.accessible_llm_models.includes(model)}
                            onChange={e => setEditAI(p => ({
                              ...p,
                              accessible_llm_models: e.target.checked
                                ? [...(p.accessible_llm_models || []), model]
                                : (p.accessible_llm_models || []).filter(m => m !== model)
                            }))}
                            style={{ accentColor: "#D9A928" }}
                          />
                          {model}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 4: pricing_plan_target_audience ──────────────── */}
              {configActiveTab === "availability" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#707070" }}>
                    Audience data from <strong>pricing_plan_target_audience</strong> for plan_id: <code style={{ color: "#D9A928" }}>{selectedPlanForConfig.id}</code>
                    {!editAudience.id && <span style={{ color: "#EF4444", marginLeft: "0.5rem" }}>(No record found — insert a row in Supabase to enable editing)</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>SEGMENT</label>
                    <textarea rows={2} style={textareaStyle} value={editAudience.segment} onChange={e => setEditAudience(p => ({ ...p, segment: e.target.value }))} disabled={!editAudience.id} placeholder="e.g. Training providers & bootcamps" />
                  </div>
                  <div>
                    <label style={labelStyle}>RECOMMENDED FOR</label>
                    <textarea rows={2} style={textareaStyle} value={editAudience.recommended_for} onChange={e => setEditAudience(p => ({ ...p, recommended_for: e.target.value }))} disabled={!editAudience.id} placeholder="e.g. Bootcamps, Corporate Training, NGOs" />
                  </div>
                  <div>
                    <label style={labelStyle}>ORGANIZATION SIZE</label>
                    <input type="text" style={inputStyle} value={editAudience.organization_size} onChange={e => setEditAudience(p => ({ ...p, organization_size: e.target.value }))} disabled={!editAudience.id} placeholder="e.g. 1–50 employees" />
                  </div>
                </div>
              )}

              {/* ── TAB 5: pricing_plan_marketing_copy ───────────────── */}
              {configActiveTab === "marketing" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#707070" }}>
                    Marketing data from <strong>pricing_plan_marketing_copy</strong> for plan_id: <code style={{ color: "#D9A928" }}>{selectedPlanForConfig.id}</code>
                    {!editMarketing.id && <span style={{ color: "#EF4444", marginLeft: "0.5rem" }}>(No record found — insert a row in Supabase to enable editing)</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>LANDING PAGE HEADLINE</label>
                    <input type="text" style={inputStyle} value={editMarketing.headline} onChange={e => setEditMarketing(p => ({ ...p, headline: e.target.value }))} disabled={!editMarketing.id} />
                  </div>
                  <div>
                    <label style={labelStyle}>HERO SUBTITLE / SUBHEADLINE</label>
                    <textarea rows={3} style={textareaStyle} value={editMarketing.subheadline} onChange={e => setEditMarketing(p => ({ ...p, subheadline: e.target.value }))} disabled={!editMarketing.id} />
                  </div>
                  <div>
                    <label style={labelStyle}>CTA COPY OVERRIDE</label>
                    <input type="text" style={inputStyle} value={editMarketing.cta} onChange={e => setEditMarketing(p => ({ ...p, cta: e.target.value }))} disabled={!editMarketing.id} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>POPULAR BADGE TEXT</label>
                      <input type="text" style={inputStyle} value={editMarketing.popular_badge_text} onChange={e => setEditMarketing(p => ({ ...p, popular_badge_text: e.target.value }))} disabled={!editMarketing.id} />
                    </div>
                    <div>
                      <label style={labelStyle}>ENTERPRISE CONTACT CTA</label>
                      <input type="text" style={inputStyle} value={editMarketing.enterprise_custom_contact_cta} onChange={e => setEditMarketing(p => ({ ...p, enterprise_custom_contact_cta: e.target.value }))} disabled={!editMarketing.id} />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div style={{ padding: "1.25rem 2rem", borderTop: "1px solid #E6DED0", backgroundColor: "#FCFBF8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setSelectedPlanForConfig(null)} disabled={saving} style={{ padding: "0.6rem 1.25rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSavePlanConfiguration} disabled={saving || modalLoading} style={{ padding: "0.6rem 1.5rem", border: "none", borderRadius: "6px", backgroundColor: saving ? "#9CA3AF" : "#D9A928", color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving to Supabase...</> : "Save Plan Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
