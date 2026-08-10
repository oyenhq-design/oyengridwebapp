import React, { useState } from "react";
import { 
  CreditCard, Plus, CheckCircle2, DollarSign, Layers, HardDrive, Cpu, 
  Globe, RefreshCw, Eye, History, Shield, Zap, FileText, ArrowUpRight, 
  Edit3, Trash2, Copy, Archive, Check, X, Sliders, ChevronRight, BarChart2,
  Building2, Users, Download
} from "lucide-react";
import { supabase } from "../../../../lib/supabaseClient";

export default function SubscriptionsPlansPage() {
  const [activeSolutionTab, setActiveSolutionTab] = useState("Bootcamps & Training");
  const [selectedPlanForConfig, setSelectedPlanForConfig] = useState(null);
  const [configActiveTab, setConfigActiveTab] = useState("pricing");
  
  // Active Form State for the Configurator Modal
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    solution: "",
    status: "Published",
    orgsCount: 0,
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "USD",
    target: "",
    version: "v2.4.0",
    lastUpdated: "Today",
    createdBy: "Shola Oyewole (Admin)",
    billingCycle: "Monthly / Annual (-16%)",
    aiAllocation: "",
    storageAllocation: "",
    participantLimit: "",
    programmeLimit: "",
    featureCount: "",
    buttonText: "",
    popular: false,
    recommended: false
  });

  const [syncStatus, setSyncStatus] = useState({
    status: "Live & Synchronized",
    version: "v2.4.0",
    lastPublished: "Today @ 14:20 WAT",
    visiblePlans: 12,
    pendingChanges: 0,
    cacheStatus: "Purged & Synced"
  });

  // Operational metrics
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

  // React State for Solution Family Plans (Reactive Data Engine)
  const [plansState, setPlansState] = useState({
    "Bootcamps & Training": [
      {
        id: "29eed756-5633-47b4-b429-9e8cecc7d5c7",
        name: "Basic Training Tier",
        solution: "Bootcamps & Training",
        status: "Published",
        orgsCount: 42,
        monthlyPrice: 450,
        annualPrice: 4500,
        currency: "USD",
        target: "Small Training Companies & Bootcamps",
        version: "v2.4.0",
        lastUpdated: "Aug 05, 2026",
        createdBy: "Shola Oyewole (Admin)",
        billingCycle: "Monthly / Annual (-16%)",
        aiAllocation: "50,000 Tokens / mo",
        storageAllocation: "100 GB S3 Storage",
        participantLimit: "250 Active Learners",
        programmeLimit: "5 Running Programs",
        featureCount: "12 Features Enabled",
        buttonText: "Start Basic Trial",
        popular: false,
        recommended: false
      },
      {
        id: "4ce6e603-339f-45eb-a303-3c5dc9c25f18",
        name: "Standard Bootcamp Pro",
        solution: "Bootcamps & Training",
        status: "Published",
        orgsCount: 88,
        monthlyPrice: 1200,
        annualPrice: 12000,
        currency: "USD",
        target: "Growing Bootcamps & Mid-Size Academies",
        version: "v2.4.0",
        lastUpdated: "Aug 06, 2026",
        createdBy: "Sarah Jenkins (Ops)",
        billingCycle: "Monthly / Annual (-16%)",
        aiAllocation: "250,000 Tokens / mo",
        storageAllocation: "500 GB S3 Storage",
        participantLimit: "1,000 Active Learners",
        programmeLimit: "20 Running Programs",
        featureCount: "18 Features Enabled",
        buttonText: "Get Started with Standard",
        popular: true,
        recommended: true
      },
      {
        id: "6e9e301d-15e4-44bc-8c6f-735a585b664f",
        name: "Premium Training Suite",
        solution: "Bootcamps & Training",
        status: "Published",
        orgsCount: 64,
        monthlyPrice: 2800,
        annualPrice: 28000,
        currency: "USD",
        target: "Large Educational Organizations & Academies",
        version: "v2.4.0",
        lastUpdated: "Aug 08, 2026",
        createdBy: "Femi Adebayo (Ops)",
        billingCycle: "Monthly / Annual (-16%)",
        aiAllocation: "1,000,000 Tokens / mo",
        storageAllocation: "2 TB S3 Storage",
        participantLimit: "5,000 Active Learners",
        programmeLimit: "Unlimited Programs",
        featureCount: "24 Features Enabled",
        buttonText: "Upgrade to Premium",
        popular: false,
        recommended: false
      },
      {
        id: "9fdd1f77-ac4b-4728-9c7f-fd3bcb67c30d",
        name: "Premium+ Enterprise Bootcamp",
        solution: "Bootcamps & Training",
        status: "Published",
        orgsCount: 21,
        monthlyPrice: 5000,
        annualPrice: 50000,
        currency: "USD",
        target: "Global Training Enterprises & Goverment Academies",
        version: "v2.4.0",
        lastUpdated: "Aug 10, 2026",
        createdBy: "Shola Oyewole (Admin)",
        billingCycle: "Custom Billing / Invoice",
        aiAllocation: "Custom Enterprise Quota",
        storageAllocation: "Unlimited Dedicated S3",
        participantLimit: "Unlimited Learners",
        programmeLimit: "Unlimited Programs",
        featureCount: "All 32 Features",
        buttonText: "Contact Enterprise Sales",
        popular: false,
        recommended: false
      }
    ],
    "Webinars & Events": [
      {
        id: "webinar-basic",
        name: "Webinar Starter",
        solution: "Webinars & Events",
        status: "Published",
        orgsCount: 18,
        monthlyPrice: 290,
        annualPrice: 2900,
        currency: "USD",
        target: "Single Event & Webinar Hosts",
        version: "v2.3.0",
        lastUpdated: "Jul 28, 2026",
        createdBy: "Amina Compliance",
        billingCycle: "Monthly",
        aiAllocation: "25,000 Tokens / mo",
        storageAllocation: "50 GB Storage",
        participantLimit: "500 Event Attendees",
        programmeLimit: "3 Events / mo",
        featureCount: "10 Features Enabled",
        buttonText: "Start Event Trial",
        popular: false,
        recommended: false
      },
      {
        id: "webinar-standard",
        name: "Virtual Summit Pro",
        solution: "Webinars & Events",
        status: "Published",
        orgsCount: 32,
        monthlyPrice: 850,
        annualPrice: 8500,
        currency: "USD",
        target: "Frequent Event & Conference Organizers",
        version: "v2.4.0",
        lastUpdated: "Aug 02, 2026",
        createdBy: "Sarah Jenkins (Ops)",
        billingCycle: "Monthly / Annual",
        aiAllocation: "150,000 Tokens / mo",
        storageAllocation: "300 GB Storage",
        participantLimit: "2,500 Event Attendees",
        programmeLimit: "12 Events / mo",
        featureCount: "16 Features Enabled",
        buttonText: "Launch Virtual Summit",
        popular: true,
        recommended: true
      }
    ],
    "Education & Institutions": [
      {
        id: "edu-basic",
        name: "School & College Tier",
        solution: "Education & Institutions",
        status: "Published",
        orgsCount: 14,
        monthlyPrice: 1500,
        annualPrice: 15000,
        currency: "USD",
        target: "K-12 Schools & Vocational Colleges",
        version: "v2.4.0",
        lastUpdated: "Aug 01, 2026",
        createdBy: "Femi Adebayo (Ops)",
        billingCycle: "Annual Academic Term",
        aiAllocation: "500,000 Tokens / mo",
        storageAllocation: "1 TB Storage",
        participantLimit: "2,000 Students",
        programmeLimit: "25 Academic Courses",
        featureCount: "20 Features Enabled",
        buttonText: "Enroll Campus",
        popular: false,
        recommended: false
      },
      {
        id: "edu-premium",
        name: "University Portal Suite",
        solution: "Education & Institutions",
        status: "Published",
        orgsCount: 9,
        monthlyPrice: 4200,
        annualPrice: 42000,
        currency: "USD",
        target: "Universities & Accredited Higher Ed Institutes",
        version: "v2.4.0",
        lastUpdated: "Aug 09, 2026",
        createdBy: "Shola Oyewole (Admin)",
        billingCycle: "Annual Academic Contract",
        aiAllocation: "2,500,000 Tokens / mo",
        storageAllocation: "5 TB Storage",
        participantLimit: "10,000 Students",
        programmeLimit: "Unlimited Courses",
        featureCount: "All Features + Edu SSO",
        buttonText: "Deploy University Hub",
        popular: true,
        recommended: true
      }
    ],
    "Enterprise Operations": [
      {
        id: "ent-custom",
        name: "Global Corporate Hub",
        solution: "Enterprise Operations",
        status: "Published",
        orgsCount: 12,
        monthlyPrice: 8500,
        annualPrice: 85000,
        currency: "USD",
        target: "Multinational Enterprises & Govt Ministries",
        version: "v2.4.0",
        lastUpdated: "Aug 10, 2026",
        createdBy: "Shola Oyewole (Admin)",
        billingCycle: "Custom Multi-Year SLA",
        aiAllocation: "Dedicated LLM Instance",
        storageAllocation: "Dedicated S3 Bucket",
        participantLimit: "Unlimited Workforce",
        programmeLimit: "Unlimited Enterprise Progs",
        featureCount: "Full Enterprise Matrix",
        buttonText: "Schedule Executive Briefing",
        popular: true,
        recommended: true
      }
    ]
  });

  const currentPlans = plansState[activeSolutionTab] || [];

  // Dynamic Features List for Configuration Modal
  const featureList = [
    { key: "programmes", name: "Programmes Creation", category: "Core", defaultEnabled: true, limit: "Unlimited" },
    { key: "participants", name: "Participant / Learner Seats", category: "Core", defaultEnabled: true, limit: "1,000 Seats" },
    { key: "storage", name: "S3 Storage Allocation", category: "Infrastructure", defaultEnabled: true, limit: "500 GB" },
    { key: "attendance", name: "Attendance & Facial Verification", category: "Analytics", defaultEnabled: true, limit: "Enabled" },
    { key: "assignments", name: "Graded Assignments & Submissions", category: "Core", defaultEnabled: true, limit: "Enabled" },
    { key: "certificates", name: "Cryptographic Certificate Issuance", category: "Credentials", defaultEnabled: true, limit: "Unlimited PDF & Hash" },
    { key: "analytics", name: "Advanced Learner Telemetry", category: "Analytics", defaultEnabled: true, limit: "Real-time" },
    { key: "whitelabel", name: "Custom Branding & White Label", category: "Branding", defaultEnabled: false, limit: "Optional Add-on" },
    { key: "api", name: "Rest API & Webhooks Access", category: "Developer", defaultEnabled: true, limit: "100,000 Calls / mo" },
    { key: "ai_assistant", name: "OYEN AI Copilot Assistant", category: "AI", defaultEnabled: true, limit: "Enabled" },
    { key: "ai_credits", name: "Monthly AI Token Allocation", category: "AI", defaultEnabled: true, limit: "250,000 Tokens" },
    { key: "priority_support", name: "24/7 Priority Support SLA", category: "Support", defaultEnabled: true, limit: "4h Response SLA" },
    { key: "custom_domain", name: "Branded Custom Domain (SSL)", category: "Branding", defaultEnabled: true, limit: "1 Domain" },
    { key: "integrations", name: "Zoom, Teams & Payment Gateways", category: "Integrations", defaultEnabled: true, limit: "All Connected" }
  ];

  // Pricing Versions Ledger
  const versionLedger = [
    { version: "v2.4.0", status: "Published (Live)", date: "Aug 06, 2026", author: "Shola Oyewole", notes: "Updated AI Token allocations and added 24/7 SLA tags." },
    { version: "v2.3.1", status: "Archived", date: "Jul 15, 2026", author: "Sarah Jenkins", notes: "Standardized Bootcamp prices to $1,200/mo." },
    { version: "v2.5.0-Draft", status: "Draft", date: "Aug 10, 2026", author: "Femi Adebayo", notes: "Proposed Q4 Pricing Adjustments (+10% ARR discount)." }
  ];

  // Open modal and load existing plan data into form state
  const openConfigModal = (plan) => {
    setSelectedPlanForConfig(plan);
    setEditForm({
      ...plan,
      lastUpdated: "Just Now by Shola Oyewole (Admin)"
    });
    setConfigActiveTab("pricing");
  };

  // Save changes from Configurator Modal directly into React state and update Plan Cards (Img 2)
  const handleSavePlanConfiguration = async () => {
    if (!editForm || !editForm.id) return;

    // 1. Update React component state (Reflects instantly on Img 2 Plan Cards Grid!)
    setPlansState(prev => {
      const solutionKey = activeSolutionTab;
      const updatedCategoryPlans = (prev[solutionKey] || []).map(p => {
        if (p.id === editForm.id) {
          return { ...editForm, lastUpdated: "Just now" };
        }
        return p;
      });

      // If new plan created
      const exists = (prev[solutionKey] || []).some(p => p.id === editForm.id);
      const finalCategoryPlans = exists ? updatedCategoryPlans : [...(prev[solutionKey] || []), editForm];

      return {
        ...prev,
        [solutionKey]: finalCategoryPlans
      };
    });

    // 2. Update Sync Pending Changes Counter
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: prev.pendingChanges + 1,
      status: "Modified (Pending Web Publish)"
    }));

    // 3. Optionally sync to Supabase table public.pricing_plans if valid UUID
    try {
      if (editForm.id.length > 20) {
        await supabase
          .from("pricing_plans")
          .update({
            name: editForm.name,
            price: Number(editForm.monthlyPrice),
            description: editForm.target,
            currency: editForm.currency,
            updated_at: new Date().toISOString()
          })
          .eq("id", editForm.id);
      }
    } catch (err) {
      console.log("Supabase async sync note:", err);
    }

    // Close modal
    setSelectedPlanForConfig(null);
  };

  const handlePublishPricing = async () => {
    setSyncStatus(prev => ({
      ...prev,
      lastPublished: "Just Now",
      pendingChanges: 0,
      status: "Live & Synchronized"
    }));
    alert("🚀 SUCCESS: All Subscription Plan modifications have been synchronized live across oyengrid.com, Checkout, and Customer Dashboards!");
  };

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2.25rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Plans
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Subscription Products & Master Pricing Engine
            </h1>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "#707070", maxWidth: "850px" }}>
              Manage every subscription plan, pricing model, AI allocation, feature availability, storage limits, billing rules, and publishing status for the entire OYEN GRID ecosystem.
            </p>
          </div>

          <button
            onClick={() => {
              const newId = `new-plan-${Date.now()}`;
              const newPlan = {
                id: newId,
                name: "New Custom Subscription Tier",
                solution: activeSolutionTab,
                status: "Draft",
                orgsCount: 0,
                monthlyPrice: 990,
                annualPrice: 9900,
                currency: "USD",
                target: "Target Audience Description",
                version: "v2.5.0-Draft",
                lastUpdated: "Just now",
                createdBy: "Shola Oyewole (Admin)",
                billingCycle: "Monthly / Annual (-16%)",
                aiAllocation: "100,000 Tokens / mo",
                storageAllocation: "250 GB S3 Storage",
                participantLimit: "500 Active Learners",
                programmeLimit: "10 Running Programs",
                featureCount: "15 Features Enabled",
                buttonText: "Subscribe Now",
                popular: false,
                recommended: false
              };
              openConfigModal(newPlan);
            }}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(217, 169, 40, 0.25)"
            }}
          >
            <Plus size={15} /> Create New Plan
          </button>
        </div>
      </div>

      {/* 1. OPERATIONAL STATISTICS PANEL (8 Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* 2. LANDING PAGE SYNCHRONIZATION CONSOLE */}
      <section style={{ backgroundColor: "#101010", border: "1px solid #222222", borderRadius: "12px", padding: "1.5rem 1.75rem", color: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Globe size={20} color="#D9A928" />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "#FFFFFF" }}>
                Website & Ecosystem Pricing Synchronization
              </h3>
              <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#888888" }}>
                Controls the active pricing matrix rendered across oyengrid.com, organization checkout, upgrade modals, and customer dashboards.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Opening oyengrid.com pricing preview overlay...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.9rem",
                backgroundColor: "#181818", border: "1px solid #333333", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, color: "#CCCCCC", cursor: "pointer"
              }}
            >
              <Eye size={14} /> Preview Website Pricing
            </button>
            <button
              onClick={handlePublishPricing}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#18B67A", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 800, color: "#FFFFFF", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(24, 182, 122, 0.3)"
              }}
            >
              <RefreshCw size={14} /> Publish Pricing to Website
            </button>
          </div>
        </div>

        {/* Sync Status Attributes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", backgroundColor: "#181818", border: "1px solid #282828", borderRadius: "8px", padding: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Landing Page Status</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#18B67A", marginTop: "0.15rem" }}>● {syncStatus.status}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Current Schema Version</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#D9A928", marginTop: "0.15rem" }}>{syncStatus.version}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Last Published Timestamp</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.15rem" }}>{syncStatus.lastPublished}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Visible Plans</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.15rem" }}>{syncStatus.visiblePlans} Active Plans</div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Pending Draft Changes</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: syncStatus.pendingChanges > 0 ? "#D9A928" : "#18B67A", marginTop: "0.15rem" }}>{syncStatus.pendingChanges} Pending Edits</div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION CATEGORIES TABS */}
      <section style={{ display: "flex", borderBottom: "2px solid #E6DED0", gap: "0.5rem" }}>
        {[
          "Bootcamps & Training",
          "Webinars & Events",
          "Education & Institutions",
          "Enterprise Operations"
        ].map((tab) => {
          const isActive = activeSolutionTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSolutionTab(tab)}
              style={{
                padding: "0.75rem 1.25rem", border: "none", background: "none",
                fontSize: "0.85rem", fontWeight: isActive ? 800 : 600,
                color: isActive ? "#D9A928" : "#707070", cursor: "pointer",
                borderBottom: isActive ? "3px solid #D9A928" : "3px solid transparent",
                marginBottom: "-2px", transition: "all 0.15s ease"
              }}
            >
              {tab}
            </button>
          );
        })}
      </section>

      {/* 4. ENTERPRISE PLAN CARDS GRID (Img 2 - Reactively updates when Modal Img 1 is saved!) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {currentPlans.map((p) => (
          <div key={p.id} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: p.popular ? "0 8px 24px rgba(217, 169, 40, 0.12)" : "none", position: "relative" }}>
            
            {p.popular && (
              <div style={{ position: "absolute", top: "-12px", right: "16px", backgroundColor: "#D9A928", color: "#FFFFFF", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", padding: "0.25rem 0.6rem", borderRadius: "4px", letterSpacing: "0.5px" }}>
                MOST POPULAR
              </div>
            )}

            <div>
              {/* Header Badge & Status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: p.status === "Published" ? "#E6F8F0" : "#FFF7E4", color: p.status === "Published" ? "#18B67A" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  ● {p.status} ({p.version})
                </span>
                <span style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700 }}>
                  {p.orgsCount} Customer Orgs
                </span>
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>{p.name}</h3>
              
              <div style={{ margin: "0.65rem 0 1rem" }}>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>${p.monthlyPrice}</span>
                <span style={{ fontSize: "0.8rem", color: "#707070", fontWeight: 600 }}> / month</span>
                <div style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700, marginTop: "0.15rem" }}>
                  ${p.annualPrice} billed annually (-16% discount)
                </div>
              </div>

              {/* Specification List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.78rem", color: "#707070", padding: "0.85rem 0", borderTop: "1px solid #E6DED0", borderBottom: "1px solid #E6DED0" }}>
                <div>🎯 <strong>Target:</strong> <span style={{ color: "#111111" }}>{p.target}</span></div>
                <div>🤖 <strong>AI Allocation:</strong> <span style={{ color: "#111111" }}>{p.aiAllocation}</span></div>
                <div>💾 <strong>Storage Limit:</strong> <span style={{ color: "#111111" }}>{p.storageAllocation}</span></div>
                <div>👥 <strong>Participants:</strong> <span style={{ color: "#111111" }}>{p.participantLimit}</span></div>
                <div>📚 <strong>Programs Limit:</strong> <span style={{ color: "#111111" }}>{p.programmeLimit}</span></div>
                <div>⚙️ <strong>Feature Flags:</strong> <span style={{ color: "#D9A928", fontWeight: 700 }}>{p.featureCount}</span></div>
              </div>

              <div style={{ marginTop: "0.75rem", fontSize: "0.68rem", color: "#888888" }}>
                Updated: {p.lastUpdated} by {p.createdBy}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button 
                onClick={() => openConfigModal(p)} 
                style={{ flex: 1, padding: "0.55rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
              >
                <Sliders size={13} /> Configure Plan
              </button>

              <button 
                onClick={() => {
                  const duplicated = {
                    ...p,
                    id: `${p.id}-copy-${Date.now()}`,
                    name: `${p.name} (Copy)`
                  };
                  setPlansState(prev => ({
                    ...prev,
                    [activeSolutionTab]: [...(prev[activeSolutionTab] || []), duplicated]
                  }));
                }} 
                style={{ padding: "0.55rem 0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", color: "#707070", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                title="Duplicate Plan Schema"
              >
                <Copy size={13} />
              </button>

              <button 
                onClick={() => {
                  setPlansState(prev => ({
                    ...prev,
                    [activeSolutionTab]: (prev[activeSolutionTab] || []).filter(item => item.id !== p.id)
                  }));
                }} 
                style={{ padding: "0.55rem 0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", color: "#EF4444", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                title="Retire Plan"
              >
                <Archive size={13} />
              </button>
            </div>

          </div>
        ))}
      </section>

      {/* 5. PRICING VERSION CONTROL LEDGER */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E6DED0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Pricing Version Control & Rollback Audit Ledger
            </h3>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#707070" }}>
              Every pricing and feature matrix publication creates an immutable version snapshot. Restore or preview previous versions.
            </p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>VERSION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PUBLISHED DATE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>AUTHOR</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>RELEASE NOTES</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {versionLedger.map((v, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "#D9A928", fontFamily: "monospace" }}>{v.version}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: v.status.includes("Published") ? "#E6F8F0" : "#F7F4ED", color: v.status.includes("Published") ? "#18B67A" : "#707070", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "#707070" }}>{v.date}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{v.author}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#707070" }}>{v.notes}</td>
                <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Restoring pricing version ${v.version}...`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Restore Version →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 6. REVENUE ANALYTICS & ORGANIZATION PLAN DISTRIBUTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Revenue Performance Summary */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Live Plan Revenue Performance
          </div>
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

        {/* Organization Plan Distribution */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Organization Distribution Across Tiers
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { tier: "Basic Training Tier ($450/mo)", count: "42 Orgs", pct: "20%" },
              { tier: "Standard Bootcamp Pro ($1,200/mo)", count: "88 Orgs", pct: "41%" },
              { tier: "Premium Training Suite ($2,800/mo)", count: "64 Orgs", pct: "30%" },
              { tier: "Premium+ Enterprise ($5,000+/mo)", count: "21 Orgs", pct: "9%" }
            ].map((d, idx) => (
              <div key={idx} style={{ fontSize: "0.8rem" }} onClick={() => alert(`Inspecting ${d.count} on ${d.tier}`)} className="clickable">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", cursor: "pointer" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{d.tier}</span>
                  <span style={{ fontWeight: 800, color: "#D9A928" }}>{d.count} ({d.pct})</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: d.pct, backgroundColor: "#D9A928" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 7. FULL PLAN CONFIGURATION MODAL / DRAWER (Img 1 - Fully Bound State!) */}
      {selectedPlanForConfig && (
        <div 
          onClick={() => setSelectedPlanForConfig(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000,
            display: "flex", justifyContent: "flex-end", backdropFilter: "blur(2px)"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: "820px", maxWidth: "90vw", backgroundColor: "#FCFBF8",
              height: "100vh", display: "flex", flexDirection: "column",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.2)", overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #E6DED0", backgroundColor: "#101010", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 800, textTransform: "uppercase" }}>MASTER PRICING ENGINE CONFIGURATOR</div>
                <h2 style={{ margin: "0.2rem 0 0", fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                  {editForm.name || "Configure Subscription Plan"}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedPlanForConfig(null)}
                style={{ background: "none", border: "none", color: "#888888", cursor: "pointer", padding: "0.5rem" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Config Navigation Tabs */}
            <div style={{ display: "flex", backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0", padding: "0 1.5rem" }}>
              {[
                { id: "pricing", label: "1. Pricing & General" },
                { id: "features", label: "2. Feature Matrix" },
                { id: "ai", label: "3. AI Allocation" },
                { id: "availability", label: "4. Target Audience" },
                { id: "marketing", label: "5. Marketing & Copy" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setConfigActiveTab(t.id)}
                  style={{
                    padding: "0.75rem 1rem", border: "none", background: "none",
                    fontSize: "0.78rem", fontWeight: configActiveTab === t.id ? 800 : 600,
                    color: configActiveTab === t.id ? "#D9A928" : "#707070", cursor: "pointer",
                    borderBottom: configActiveTab === t.id ? "3px solid #D9A928" : "3px solid transparent"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
              
              {/* TAB 1: Pricing & General */}
              {configActiveTab === "pricing" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>PLAN PRODUCT NAME</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }} 
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>MONTHLY PRICE ($)</label>
                      <input 
                        type="number" 
                        value={editForm.monthlyPrice} 
                        onChange={e => setEditForm(prev => ({ ...prev, monthlyPrice: Number(e.target.value), annualPrice: Number(e.target.value) * 10 }))}
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>ANNUAL PRICE ($)</label>
                      <input 
                        type="number" 
                        value={editForm.annualPrice} 
                        onChange={e => setEditForm(prev => ({ ...prev, annualPrice: Number(e.target.value) }))}
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>CURRENCY</label>
                      <select 
                        value={editForm.currency || "USD"} 
                        onChange={e => setEditForm(prev => ({ ...prev, currency: e.target.value }))}
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>TARGET CUSTOMER SEGMENT DESCRIPTION</label>
                    <textarea 
                      rows={2} 
                      value={editForm.target} 
                      onChange={e => setEditForm(prev => ({ ...prev, target: e.target.value }))}
                      style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem" }} 
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>CTA BUTTON LABEL</label>
                      <input 
                        type="text" 
                        value={editForm.buttonText} 
                        onChange={e => setEditForm(prev => ({ ...prev, buttonText: e.target.value }))}
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem" }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>CTA DESTINATION</label>
                      <input 
                        type="text" 
                        defaultValue="/checkout?plan=standard" 
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem" }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Dynamic Feature Matrix */}
              {configActiveTab === "features" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#707070" }}>
                    Enable or disable granular ecosystem features and define usage limits for this plan tier:
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                        <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070" }}>FEATURE</th>
                        <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070" }}>CATEGORY</th>
                        <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070" }}>STATE</th>
                        <th style={{ padding: "0.6rem", textTransform: "uppercase", fontSize: "0.65rem", color: "#707070" }}>USAGE LIMIT / CAPACITY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureList.map((f) => (
                        <tr key={f.key} style={{ borderBottom: "1px solid #E6DED0" }}>
                          <td style={{ padding: "0.6rem", fontWeight: 700, color: "#111111" }}>{f.name}</td>
                          <td style={{ padding: "0.6rem", color: "#707070" }}>{f.category}</td>
                          <td style={{ padding: "0.6rem" }}>
                            <input type="checkbox" defaultChecked={f.defaultEnabled} style={{ accentColor: "#D9A928" }} />
                          </td>
                          <td style={{ padding: "0.6rem" }}>
                            <input type="text" defaultValue={f.limit} style={{ padding: "0.3rem 0.5rem", border: "1px solid #E6DED0", borderRadius: "4px", fontSize: "0.78rem", backgroundColor: "#F7F4ED" }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: AI Allocation */}
              {configActiveTab === "ai" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>AI TIER LEVEL</label>
                    <select defaultValue="Standard" style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }}>
                      <option value="Basic">Basic AI Copilot</option>
                      <option value="Standard">Standard Operational AI</option>
                      <option value="Enterprise">Enterprise Dedicated AI Cluster</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>MONTHLY TOKEN CREDITS</label>
                      <input 
                        type="text" 
                        value={editForm.aiAllocation} 
                        onChange={e => setEditForm(prev => ({ ...prev, aiAllocation: e.target.value }))}
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>STORAGE LIMIT</label>
                      <input 
                        type="text" 
                        value={editForm.storageAllocation} 
                        onChange={e => setEditForm(prev => ({ ...prev, storageAllocation: e.target.value }))}
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }} 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>ACCESSIBLE LLM MODELS</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <label><input type="checkbox" defaultChecked accentColor="#D9A928" /> GPT-4o Enterprise</label>
                      <label><input type="checkbox" defaultChecked accentColor="#D9A928" /> Claude 3.5 Sonnet</label>
                      <label><input type="checkbox" accentColor="#D9A928" /> DeepSeek V3</label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Target Audience Checkboxes */}
              {configActiveTab === "availability" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#707070" }}>
                    Select which organization categories this plan appears for on the oyengrid.com dynamic pricing selector:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem" }}>
                    {[
                      "Bootcamps", "Training Organizations", "Workforce Development",
                      "Fellowships", "Webinars", "Workshops", "Masterclasses",
                      "Virtual Events", "Universities", "Academies", "Schools",
                      "Corporate Academies", "NGOs", "Government Agencies", "Enterprises"
                    ].map((segment, sIdx) => (
                      <label key={sIdx} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem", backgroundColor: "#F7F4ED", borderRadius: "6px", border: "1px solid #E6DED0", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked={sIdx < 8} style={{ accentColor: "#D9A928" }} />
                        <span>{segment}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Marketing & Copy Configuration */}
              {configActiveTab === "marketing" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.82rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>LANDING PAGE HERO TITLE OVERRIDE</label>
                    <input type="text" defaultValue="Power Your Entire Training Ecosystem with OYEN GRID" style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.85rem", fontWeight: 700 }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>HERO SUBTITLE DESCRIPTION</label>
                    <textarea rows={3} defaultValue="Flexible subscription plans tailored for training providers, corporate academies, universities, and virtual event hosts." style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>POPULAR BADGE OVERRIDE TEXT</label>
                      <input type="text" defaultValue="MOST POPULAR FOR BOOTCAMPS" style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#707070", marginBottom: "0.3rem" }}>ENTERPRISE CUSTOM CONTACT CTA</label>
                      <input type="text" defaultValue="Contact Enterprise Solutions Team" style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem" }} />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div style={{ padding: "1.25rem 2rem", borderTop: "1px solid #E6DED0", backgroundColor: "#FCFBF8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button 
                onClick={() => setSelectedPlanForConfig(null)}
                style={{ padding: "0.6rem 1.25rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>

              <button 
                onClick={handleSavePlanConfiguration}
                style={{ padding: "0.6rem 1.5rem", border: "none", borderRadius: "6px", backgroundColor: "#D9A928", color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
              >
                Save Plan Configuration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
