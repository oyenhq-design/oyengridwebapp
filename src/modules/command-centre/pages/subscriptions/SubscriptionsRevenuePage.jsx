import React from "react";
import { DollarSign, TrendingUp, BarChart2, ArrowUpRight, Download, Calendar } from "lucide-react";

export default function SubscriptionsRevenuePage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Revenue
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Financial Revenue Performance Dashboard
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Executive SaaS financial analytics, MRR/ARR trajectories, revenue breakdown by solution type and subscription plan tier.
            </p>
          </div>

          <button
            onClick={() => alert("Exporting Revenue Statement CSV...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <Download size={14} /> Export Revenue Report
          </button>
        </div>
      </div>

      {/* TOP REVENUE METRICS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Monthly Recurring (MRR)", val: "$48,250", color: "#111111", sub: "+18.4% vs last month" },
          { label: "Annual Run Rate (ARR)", val: "$579,000", color: "#D9A928", sub: "Projected annual" },
          { label: "Net Revenue Retention", val: "118%", color: "#18B67A", sub: "Expansion MRR positive" },
          { label: "Outstanding Invoices", val: "$12,400", color: "#EF4444", sub: "14 invoices pending" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem 1.25rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
            <span style={{ fontSize: "0.7rem", color: "#18B67A", fontWeight: 600, marginTop: "0.15rem", display: "block" }}>{stat.sub}</span>
          </div>
        ))}
      </section>

      {/* REVENUE BREAKDOWN BY SOLUTION & PLAN */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Revenue Breakdown by Solution Category
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { solution: "Corporate Academies", mrr: "$24,500", pct: "51%" },
              { solution: "Training Providers", mrr: "$12,800", pct: "26%" },
              { solution: "Institution Portals", mrr: "$6,900", pct: "14%" },
              { solution: "Bootcamp & Webinars", mrr: "$4,050", pct: "9%" }
            ].map((sol, idx) => (
              <div key={idx} style={{ fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{sol.solution}</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{sol.mrr} ({sol.pct})</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: sol.pct, backgroundColor: "#D9A928" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Revenue Breakdown by Subscription Tier
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { tier: "Premium+ Enterprise", mrr: "$21,000", pct: "43%" },
              { tier: "Standard Tier", mrr: "$15,400", pct: "32%" },
              { tier: "Premium Tier", mrr: "$8,200", pct: "17%" },
              { tier: "Basic Tier", mrr: "$3,650", pct: "8%" }
            ].map((t, idx) => (
              <div key={idx} style={{ fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{t.tier}</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{t.mrr} ({t.pct})</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: t.pct, backgroundColor: "#18B67A" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
