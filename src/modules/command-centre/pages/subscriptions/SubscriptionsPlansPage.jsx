import React from "react";
import { CreditCard, Plus, CheckCircle2, DollarSign, Layers, HardDrive, Cpu } from "lucide-react";

export default function SubscriptionsPlansPage() {
  const plans = [
    { name: "Basic Tier", price: "$450 / mo", storage: "100 GB", aiCredits: "50,000 / mo", orgs: 42, target: "Small Training Companies", status: "Active" },
    { name: "Standard Tier", price: "$1,200 / mo", storage: "500 GB", aiCredits: "250,000 / mo", orgs: 88, target: "Growing Bootcamps & Academies", status: "Active" },
    { name: "Premium Tier", price: "$2,800 / mo", storage: "2 TB", aiCredits: "1,000,000 / mo", orgs: 64, target: "Large Educational Institutions", status: "Active" },
    { name: "Premium+ Enterprise", price: "Custom ($5,000+ / mo)", storage: "Unlimited", aiCredits: "Custom Quota", orgs: 21, target: "Government & Global Enterprises", status: "Active" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Plans
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Subscription Plan Products & Pricing
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage OYEN GRID subscription plans (Basic, Standard, Premium, Premium+), pricing tiers, feature caps, storage allocations, and AI credit limits.
            </p>
          </div>

          <button
            onClick={() => alert("Create Subscription Plan Modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Create New Plan
          </button>
        </div>
      </div>

      {/* PLAN CATALOG CARDS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {plans.map((p, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase" }}>{p.status}</span>
                <span style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700 }}>{p.orgs} Customer Orgs</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#111111" }}>{p.name}</h3>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", margin: "0.5rem 0 1rem", fontFamily: "'Outfit', sans-serif" }}>{p.price}</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.78rem", color: "#707070" }}>
                <div>💾 Storage Limit: <strong style={{ color: "#111111" }}>{p.storage}</strong></div>
                <div>🤖 AI Token Credits: <strong style={{ color: "#111111" }}>{p.aiCredits}</strong></div>
                <div>🎯 Target Segment: <strong style={{ color: "#111111" }}>{p.target}</strong></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={() => alert(`Editing plan: ${p.name}`)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                Edit Plan
              </button>
              <button onClick={() => alert(`Retiring plan: ${p.name}`)} style={{ padding: "0.5rem 0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#EF4444", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                Retire
              </button>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
