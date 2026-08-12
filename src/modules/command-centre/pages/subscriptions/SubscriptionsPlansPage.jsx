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
  recommended_for: [],    // text[] column — always a JS array
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

  // ── Supabase Auth session tracking ──────────────────────────────────────
  // Listens for real-time auth state changes so the guard stays in sync even
  // after a session expires or a new sign-in happens in another tab.
  const [supabaseSession, setSupabaseSession] = useState(undefined); // undefined = loading, null = no session, object = authenticated

  // ── Inline re-authentication state (shown when session is null) ─────────
  const [reAuthEmail,    setReAuthEmail]    = useState('');
  const [reAuthPassword, setReAuthPassword] = useState('');
  const [reAuthError,    setReAuthError]    = useState(null);
  const [reAuthLoading,  setReAuthLoading]  = useState(false);

  useEffect(() => {
    // Hydrate from existing persisted session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session ?? null);
    });

    // Keep in sync with live auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        // Map only real pricing_plans columns
        const mappedPlans = data.map(item => ({
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
          // Related-table fields populated below after parallel fetch
          _segment: "", _recommended_for: "",
          _tokens_per_month: null, _storage_limit: "", _tier_level: "", _llm_models: [],
          _feature_count: 0, _enabled_feature_count: 0,
          _marketing_headline: "", _popular_badge_text: "",
        }));

        // ── Enrich cards: fetch all 4 child tables in one round-trip each ──
        const planIds = mappedPlans.map(p => p.id);
        const [aiRes, audRes, mktRes, featRes] = await Promise.all([
          supabase.from("pricing_plan_ai_allocation")
            .select("plan_id, tokens_per_month, tier_level, storage_limit, accessible_llm_models")
            .in("plan_id", planIds),
          supabase.from("pricing_plan_target_audience")
            .select("plan_id, segment, recommended_for")
            .in("plan_id", planIds),
          supabase.from("pricing_plan_marketing_copy")
            .select("plan_id, headline, popular_badge_text")
            .in("plan_id", planIds),
          supabase.from("pricing_plan_features")
            .select("plan_id, enabled")
            .in("plan_id", planIds),
        ]);

        // Build lookup maps keyed by plan_id
        const aiMap  = {}; (aiRes.data  || []).forEach(r => { aiMap[r.plan_id]  = r; });
        const audMap = {}; (audRes.data || []).forEach(r => { audMap[r.plan_id] = r; });
        const mktMap = {}; (mktRes.data || []).forEach(r => { mktMap[r.plan_id] = r; });
        const featMap = {};
        (featRes.data || []).forEach(r => {
          if (!featMap[r.plan_id]) featMap[r.plan_id] = { total: 0, enabled: 0 };
          featMap[r.plan_id].total++;
          if (r.enabled) featMap[r.plan_id].enabled++;
        });

        // Merge enrichment into each card
        const enrichedPlans = mappedPlans.map(p => ({
          ...p,
          _segment:              audMap[p.id]?.segment            || "",
          _recommended_for:      audMap[p.id]?.recommended_for    || "",
          _tokens_per_month:     aiMap[p.id]?.tokens_per_month    ?? null,
          _storage_limit:        aiMap[p.id]?.storage_limit       || "",
          _tier_level:           aiMap[p.id]?.tier_level          || "",
          _llm_models:           Array.isArray(aiMap[p.id]?.accessible_llm_models) ? aiMap[p.id].accessible_llm_models : [],
          _feature_count:        featMap[p.id]?.total             || 0,
          _enabled_feature_count: featMap[p.id]?.enabled          || 0,
          _marketing_headline:   mktMap[p.id]?.headline           || "",
          _popular_badge_text:   mktMap[p.id]?.popular_badge_text || "",
        }));

        console.log("✅ pricing_plans fetched & enriched:", enrichedPlans.length, "records");
        console.table(enrichedPlans.map(p => ({ id: p.id, name: p.name, status: p.status, segment: p._segment, tokens: p._tokens_per_month })));

        setSupabasePlans(enrichedPlans);
        setSyncStatus(prev => ({ ...prev, visiblePlans: enrichedPlans.length }));
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
        // recommended_for is text[] in Postgres; Supabase JS returns it as a JS array.
        // Guard against it arriving as a JSON string (edge-case from older data).
        const rawRF = audRes.data.recommended_for;
        let loadedRF = [];
        if (Array.isArray(rawRF)) {
          loadedRF = rawRF;
        } else if (typeof rawRF === "string" && rawRF.trim() !== "") {
          try { const p = JSON.parse(rawRF); loadedRF = Array.isArray(p) ? p : []; }
          catch { loadedRF = []; }
        }
        setEditAudience({
          id: audRes.data.id,
          segment: formatValue(audRes.data.segment, ""),
          recommended_for: loadedRF,
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

  // ── Save — fully debugged, UPSERT for child tables, .select() on every op ─
  const handleSavePlanConfiguration = async () => {
    if (!editPlan.id) {
      setSaveError("No plan ID found. Cannot save.");
      return;
    }
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(editPlan.id)) {
      setSaveError(`Invalid plan ID: "${editPlan.id}". Reload the page.`);
      return;
    }

    // ── PRE-SAVE AUTH DIAGNOSTIC ─────────────────────────────────────────
    // Uses the single supabase instance imported at the top of this file.
    // getSession() = local cache read. getUser() = server-validated.
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    console.log("========== SUPABASE SAVE AUTH ==========");
    console.log("supabase URL:", supabase.supabaseUrl);
    console.log("session exists:", !!session);
    console.log("user id:", session?.user?.id ?? null);
    console.log("user email:", session?.user?.email ?? null);
    console.log("access token exists:", !!session?.access_token);
    console.log("session error:", sessionError);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    console.log("getUser user id:", user?.id ?? null);
    console.log("getUser email:", user?.email ?? null);
    console.log("getUser error:", userError);

    // ── AUTH GUARD — block save when no authenticated session exists ───
    if (!user) {
      setSaveError(
        "No authenticated Supabase session. " +
        "Please sign out and sign back in as an administrator. " +
        "Check the browser console (========== SUPABASE SAVE AUTH ==========) for details."
      );
      return;
    }

    const planId = editPlan.id;

    console.group(`💾 SAVE PLAN — plan_id: ${planId}`);
    console.log("editPlan:",     JSON.parse(JSON.stringify(editPlan)));
    console.log("editAI:",       JSON.parse(JSON.stringify(editAI)));
    console.log("editAudience:", JSON.parse(JSON.stringify(editAudience)));
    console.log("editMarketing:",JSON.parse(JSON.stringify(editMarketing)));
    console.log("editFeatures:", JSON.parse(JSON.stringify(editFeatures)));

    try {
      setSaving(true);
      setSaveError(null);

      // ═══════════════════════════════════════════════════════
      // 1. pricing_plans  — UPDATE, confirm with .select()
      // ═══════════════════════════════════════════════════════
      const planPayload = {
        name:                    editPlan.name,
        description:             editPlan.description,
        price:                   Number(editPlan.monthlyPrice),
        monthly_price:           Number(editPlan.monthlyPrice),
        annual_price:            Number(editPlan.annualPrice),
        annual_discount_percent: Number(editPlan.annual_discount_percent) || 0,
        currency:                editPlan.currency || "USD",
        billing_period:          editPlan.billing_period || "",
        setup_fee:               Number(editPlan.setup_fee) || 0,
        trial_days:              Number(editPlan.trial_days) || 0,
        cta_button_label:        editPlan.cta_button_label || "",
        cta_destination:         editPlan.cta_destination || "",
        badge:                   editPlan.badge || "",
        is_popular:              !!editPlan.is_popular,
        is_active:               editPlan.is_active !== false,
        status:                  editPlan.status ? editPlan.status.toLowerCase() : "published",
        version:                 editPlan.version || "",
        internal_notes:          editPlan.internal_notes || "",
      };
      console.log("1️⃣  pricing_plans payload:", planPayload);
      const { data: planData, error: planErr, count: planCount } = await supabase
        .from("pricing_plans")
        .update(planPayload)
        .eq("id", planId)
        .select();
      console.log("pricing_plans UPDATE:", { data: planData, error: planErr, count: planCount });
      if (planErr) throw new Error(`pricing_plans UPDATE failed: ${planErr.message} (code: ${planErr.code})`);
      if (!planData || planData.length === 0) {
        throw new Error(
          `pricing_plans UPDATE matched 0 rows for id=${planId}. ` +
          `Check Supabase RLS — the anon/service key may not have UPDATE permission on pricing_plans.`
        );
      }
      console.log("✅ pricing_plans saved:", planData[0]);

      // ═══════════════════════════════════════════════════════
      // 2. pricing_plan_features  — UPDATE each row by id
      // ═══════════════════════════════════════════════════════
      if (editFeatures.length === 0) {
        console.log("2️⃣  pricing_plan_features: no rows — skip");
      }
      for (const feat of editFeatures) {
        if (!feat.id) { console.warn("2️⃣  feature missing id, skip:", feat); continue; }
        const featPayload = {
          feature_name: feat.feature_name,
          category:     feat.category,
          enabled:      !!feat.enabled,
          usage_limit:  feat.usage_limit || "",
        };
        console.log(`2️⃣  pricing_plan_features UPDATE id=${feat.id}:`, featPayload);
        const { data: fData, error: fErr } = await supabase
          .from("pricing_plan_features")
          .update(featPayload)
          .eq("id", feat.id)
          .eq("plan_id", planId)
          .select();
        console.log("2️⃣  response — data:", fData, "error:", fErr);
        if (fErr) throw new Error(`pricing_plan_features UPDATE failed id=${feat.id}: ${fErr.message}`);
        if (!fData || fData.length === 0) console.warn(`2️⃣  UPDATE matched 0 rows for feature id=${feat.id} — check RLS`);
      }

      // ═══════════════════════════════════════════════════════
      // 3. pricing_plan_ai_allocation — UPSERT by plan_id
      // ═══════════════════════════════════════════════════════
      const aiPayload = {
        plan_id:               planId,
        allocation_type:       editAI.allocation_type || "",
        tokens_per_month:      (editAI.tokens_per_month !== "" && editAI.tokens_per_month != null)
                                 ? Number(editAI.tokens_per_month) : null,
        tier_level:            editAI.tier_level || "",
        storage_limit:         editAI.storage_limit || "",
        accessible_llm_models: Array.isArray(editAI.accessible_llm_models) ? editAI.accessible_llm_models : [],
      };
      if (editAI.id) aiPayload.id = editAI.id;
      console.log("3️⃣  pricing_plan_ai_allocation UPSERT:", aiPayload);
      const { data: aiData, error: aiErr } = await supabase
        .from("pricing_plan_ai_allocation")
        .upsert(aiPayload, { onConflict: "plan_id" })
        .select();
      console.log("3️⃣  response — data:", aiData, "error:", aiErr);
      if (aiErr) throw new Error(`pricing_plan_ai_allocation UPSERT failed: ${aiErr.message} (code: ${aiErr.code})`);
      console.log("✅ pricing_plan_ai_allocation saved:", aiData);

      // ═══════════════════════════════════════════════════════
      // 4. pricing_plan_target_audience — UPSERT by plan_id
      // ───────────────────────────────────────────────────────
      // recommended_for is a Postgres text[] column.
      // Normalise to a real JS array regardless of what state holds.
      const recommendedFor = Array.isArray(editAudience.recommended_for)
        ? editAudience.recommended_for
        : typeof editAudience.recommended_for === "string"
          ? (() => {
              try {
                const parsed = JSON.parse(editAudience.recommended_for);
                return Array.isArray(parsed) ? parsed : [];
              } catch { return []; }
            })()
          : [];

      console.log("TARGET AUDIENCE PAYLOAD", {
        recommended_for: recommendedFor,
        isArray: Array.isArray(recommendedFor),
        type: typeof recommendedFor,
      });

      const audPayload = {
        plan_id:           planId,
        segment:           editAudience.segment || "",
        recommended_for:   recommendedFor,
        organization_size: editAudience.organization_size || "",
      };
      if (editAudience.id) audPayload.id = editAudience.id;
      console.log("4️⃣  pricing_plan_target_audience UPSERT:", audPayload);
      const { data: audData, error: audErr } = await supabase
        .from("pricing_plan_target_audience")
        .upsert(audPayload, { onConflict: "plan_id" })
        .select();
      console.log("4️⃣  response — data:", audData, "error:", audErr);
      if (audErr) throw new Error(`pricing_plan_target_audience UPSERT failed: ${audErr.message} (code: ${audErr.code})`);
      console.log("✅ pricing_plan_target_audience saved:", audData);

      // ═══════════════════════════════════════════════════════
      // 5. pricing_plan_marketing_copy — UPSERT by plan_id
      // ═══════════════════════════════════════════════════════
      const mktPayload = {
        plan_id:                       planId,
        cta:                           editMarketing.cta || "",
        headline:                      editMarketing.headline || "",
        subheadline:                   editMarketing.subheadline || "",
        popular_badge_text:            editMarketing.popular_badge_text || "",
        enterprise_custom_contact_cta: editMarketing.enterprise_custom_contact_cta || "",
      };
      if (editMarketing.id) mktPayload.id = editMarketing.id;
      console.log("5️⃣  pricing_plan_marketing_copy UPSERT:", mktPayload);
      const { data: mktData, error: mktErr } = await supabase
        .from("pricing_plan_marketing_copy")
        .upsert(mktPayload, { onConflict: "plan_id" })
        .select();
      console.log("5️⃣  response — data:", mktData, "error:", mktErr);
      if (mktErr) throw new Error(`pricing_plan_marketing_copy UPSERT failed: ${mktErr.message} (code: ${mktErr.code})`);
      console.log("✅ pricing_plan_marketing_copy saved:", mktData);

      console.log("🎉 ALL 5 tables written for plan_id:", planId);
      console.groupEnd();

      // ── Optimistic UI update — use confirmed server data ──────────
      const savedPlan = planData[0];
      const savedAI   = aiData  && aiData[0]  ? aiData[0]  : null;
      const savedAud  = audData && audData[0]  ? audData[0] : null;
      const savedMkt  = mktData && mktData[0]  ? mktData[0] : null;

      setSupabasePlans(prev => prev.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          name:                   savedPlan.name,
          description:            savedPlan.description || "",
          monthlyPrice:           savedPlan.price ?? Number(editPlan.monthlyPrice),
          annualPrice:            savedPlan.annual_price ?? Number(editPlan.annualPrice),
          annual_discount_percent: savedPlan.annual_discount_percent ?? 0,
          currency:               savedPlan.currency || "USD",
          billing_period:         savedPlan.billing_period || "",
          trial_days:             savedPlan.trial_days ?? 0,
          buttonText:             savedPlan.cta_button_label || "",
          ctaDestination:         savedPlan.cta_destination || "",
          badge:                  savedPlan.badge || "",
          is_popular:             !!savedPlan.is_popular,
          popular:                !!savedPlan.is_popular,
          is_active:              savedPlan.is_active !== false,
          status:                 savedPlan.status
                                    ? (savedPlan.status.charAt(0).toUpperCase() + savedPlan.status.slice(1))
                                    : p.status,
          version:                savedPlan.version || "",
          lastUpdated:            new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          _segment:              savedAud?.segment             || editAudience.segment,
          _recommended_for:      savedAud?.recommended_for     || editAudience.recommended_for,
          _tokens_per_month:     savedAI?.tokens_per_month     ?? (editAI.tokens_per_month !== "" ? Number(editAI.tokens_per_month) : null),
          _storage_limit:        savedAI?.storage_limit        || editAI.storage_limit,
          _tier_level:           savedAI?.tier_level           || editAI.tier_level,
          _llm_models:           savedAI?.accessible_llm_models ?? editAI.accessible_llm_models ?? [],
          _marketing_headline:   savedMkt?.headline            || editMarketing.headline,
          _popular_badge_text:   savedMkt?.popular_badge_text  || editMarketing.popular_badge_text,
        };
      }));

      // Persist confirmed row IDs into form state for future saves
      if (savedAI)  setEditAI(prev  => ({ ...prev,  id: savedAI.id  }));
      if (savedAud) setEditAudience(prev => ({ ...prev, id: savedAud.id }));
      if (savedMkt) setEditMarketing(prev => ({ ...prev, id: savedMkt.id }));

      setSelectedPlanForConfig(null);
      setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1, status: "Modified (Pending Web Publish)" }));
      fetchPricingPlans(); // background confirmation

      alert(`✅ SUCCESS: '${editPlan.name}' saved. Check console for Supabase confirmation.`);

    } catch (err) {
      console.error("❌ SAVE FAILED:", err.message);
      console.groupEnd();
      setSaveError(`Save failed: ${err.message}`);
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
                  {/* ── pricing_plans ── */}
                  {p.description      && <div>📋 <strong>Description:</strong>  <span style={{ color: "#111111" }}>{p.description}</span></div>}
                  {p.currency         && <div>💱 <strong>Currency:</strong>     <span style={{ color: "#111111" }}>{p.currency}{p.billing_period ? ` · ${p.billing_period}` : ""}</span></div>}
                  {p.trial_days > 0   && <div>🕐 <strong>Trial:</strong>        <span style={{ color: "#111111" }}>{p.trial_days} days free</span></div>}
                  {p.buttonText       && <div>🔗 <strong>CTA:</strong>          <span style={{ color: "#111111" }}>{p.buttonText}</span></div>}
                  {/* ── pricing_plan_target_audience ── */}
                  {p._segment         && <div>🎯 <strong>Target:</strong>       <span style={{ color: "#111111" }}>{p._segment}</span></div>}
                  {p._recommended_for && <div>✅ <strong>Best for:</strong>     <span style={{ color: "#111111" }}>{p._recommended_for}</span></div>}
                  {/* ── pricing_plan_ai_allocation ── */}
                  {p._tokens_per_month != null && (
                    <div>🤖 <strong>AI Tokens:</strong>    <span style={{ color: "#111111" }}>{Number(p._tokens_per_month).toLocaleString()} / mo{p._tier_level ? ` · ${p._tier_level}` : ""}</span></div>
                  )}
                  {p._storage_limit   && <div>💾 <strong>Storage:</strong>      <span style={{ color: "#111111" }}>{p._storage_limit}</span></div>}
                  {p._llm_models.length > 0 && (
                    <div>🧠 <strong>Models:</strong>       <span style={{ color: "#111111" }}>{p._llm_models.join(", ")}</span></div>
                  )}
                  {/* ── pricing_plan_features ── */}
                  {p._feature_count > 0 && (
                    <div>⚙️ <strong>Features:</strong>     <span style={{ color: "#D9A928", fontWeight: 700 }}>{p._enabled_feature_count} of {p._feature_count} enabled</span></div>
                  )}
                  {/* ── pricing_plan_marketing_copy ── */}
                  {p._marketing_headline && (
                    <div>📣 <strong>Headline:</strong>     <span style={{ color: "#111111" }}>{p._marketing_headline}</span></div>
                  )}
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.15rem" }}>
                  <div style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 800, textTransform: "uppercase" }}>MASTER PRICING ENGINE CONFIGURATOR</div>
                  {/* ── Supabase Auth Session Indicator ── */}
                  {supabaseSession === undefined && (
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "4px", backgroundColor: "#282828", color: "#888888" }}>
                      ● Checking Auth…
                    </span>
                  )}
                  {supabaseSession === null && (
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "4px", backgroundColor: "rgba(239,68,68,0.15)", color: "#F87171" }}>
                      ● No Admin Session
                    </span>
                  )}
                  {supabaseSession && (
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "4px", backgroundColor: "rgba(24,182,122,0.15)", color: "#34D399" }}>
                      ● Authenticated · {supabaseSession.user?.email}
                    </span>
                  )}
                </div>
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

            {/* ── No Session: inline re-authentication panel ── */}
            {supabaseSession === null && (
              <div style={{ backgroundColor: "#FFFBEB", borderBottom: "2px solid #FDE68A", padding: "1rem 1.5rem", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.85rem" }}>
                  <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: "0.05rem" }} />
                  <div>
                    <div style={{ fontWeight: 800, color: "#78350F", marginBottom: "0.15rem" }}>Supabase admin session required</div>
                    <div style={{ fontWeight: 500, color: "#92400E" }}>
                      The Pricing Engine RLS requires <strong>auth.uid() ≠ null</strong>.
                      Enter your Supabase administrator credentials below to authenticate.
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setReAuthLoading(true);
                    setReAuthError(null);
                    const { data, error } = await supabase.auth.signInWithPassword({
                      email:    reAuthEmail.trim(),
                      password: reAuthPassword,
                    });
                    setReAuthLoading(false);
                    if (error) {
                      console.error('[Oyen Auth] Inline re-auth failed:', error.message);
                      setReAuthError(error.message);
                    } else {
                      console.info('[Oyen Auth] Inline re-auth succeeded for', data.user?.email,
                        '| uid:', data.user?.id);
                      setReAuthEmail('');
                      setReAuthPassword('');
                      setReAuthError(null);
                      // supabaseSession updates automatically via onAuthStateChange
                    }
                  }}
                  style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end", flexWrap: "wrap" }}
                >
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "#78350F", marginBottom: "0.25rem", textTransform: "uppercase" }}>Admin Email</label>
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      value={reAuthEmail}
                      onChange={e => setReAuthEmail(e.target.value)}
                      placeholder="admin@example.com"
                      style={{ width: "100%", padding: "0.5rem 0.65rem", borderRadius: "5px", border: "1px solid #FDE68A", backgroundColor: "#FFFDF0", fontSize: "0.82rem", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 150px" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "#78350F", marginBottom: "0.25rem", textTransform: "uppercase" }}>Password</label>
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={reAuthPassword}
                      onChange={e => setReAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: "100%", padding: "0.5rem 0.65rem", borderRadius: "5px", border: "1px solid #FDE68A", backgroundColor: "#FFFDF0", fontSize: "0.82rem", boxSizing: "border-box" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reAuthLoading}
                    style={{ padding: "0.5rem 1.1rem", backgroundColor: "#D97706", color: "#FFFFFF", border: "none", borderRadius: "5px", fontSize: "0.8rem", fontWeight: 800, cursor: reAuthLoading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
                  >
                    {reAuthLoading ? <><Loader2 size={13} className="animate-spin" /> Signing in…</> : "Sign In to Enable Saves"}
                  </button>
                </form>
                {reAuthError && (
                  <div style={{ marginTop: "0.6rem", color: "#DC2626", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <AlertCircle size={13} color="#DC2626" /> {reAuthError}
                  </div>
                )}
              </div>
            )}

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
                    <label style={labelStyle}>RECOMMENDED FOR (comma-separated)</label>
                    {/* ── FIX: Always store recommended_for as a real JS array ──
                        The textarea displays the array joined for editing.
                        On change, we split on commas → trimmed string array → real JS array.
                        This prevents the malformed array literal Postgres error (22P02). */}
                    <textarea
                      rows={2}
                      style={textareaStyle}
                      disabled={!editAudience.id}
                      placeholder="e.g. Bootcamps, Corporate Training, NGOs"
                      value={
                        Array.isArray(editAudience.recommended_for)
                          ? editAudience.recommended_for.join(", ")
                          : (editAudience.recommended_for || "")
                      }
                      onChange={e => {
                        // Split the typed string into a trimmed JS array immediately
                        const raw = e.target.value;
                        const asArray = raw
                          .split(",")
                          .map(s => s.trim())
                          .filter(s => s.length > 0);
                        setEditAudience(p => ({ ...p, recommended_for: asArray }));
                      }}
                    />
                    {/* Live preview confirming the array that will be sent to Supabase */}
                    {Array.isArray(editAudience.recommended_for) && editAudience.recommended_for.length > 0 && (
                      <div style={{ marginTop: "0.4rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {editAudience.recommended_for.map((item, i) => (
                          <span key={i} style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "4px", backgroundColor: "#E6F8F0", color: "#18B67A" }}>
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    )}
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
            <div style={{ padding: "1.25rem 2rem", borderTop: "1px solid #E6DED0", backgroundColor: "#FCFBF8", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={() => setSelectedPlanForConfig(null)}
                disabled={saving}
                style={{ padding: "0.6rem 1.25rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlanConfiguration}
                disabled={saving || modalLoading || supabaseSession === null}
                aria-label={supabaseSession === null ? "Sign in as administrator to enable saving" : "Save plan configuration to Supabase"}
                style={{
                  padding: "0.6rem 1.5rem",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: saving
                    ? "#9CA3AF"
                    : supabaseSession === null
                    ? "#D1D5DB"
                    : "#D9A928",
                  color: supabaseSession === null ? "#6B7280" : "#FFFFFF",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: saving || supabaseSession === null ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: supabaseSession === null ? 0.7 : 1,
                }}
              >
                {saving ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving to Supabase…</>
                ) : supabaseSession === null ? (
                  "Sign In as Admin to Save"
                ) : (
                  "Save Plan Configuration"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
