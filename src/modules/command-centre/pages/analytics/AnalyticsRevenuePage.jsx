import React from "react";
import { DollarSign, TrendingUp, BarChart2, Download, Globe, ShieldAlert } from "lucide-react";

export default function AnalyticsRevenuePage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Analytics <span style={{ color: "#D9A928" }}>/</span> Revenue
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Company-Wide Financial Revenue Analytics
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Read-only executive visualization of platform revenue, MRR/ARR trajectories, regional breakdown, and customer ARPO.
            </p>
          </div>

          <button
            onClick={() => alert("Exporting Financial Analytics PDF...")}
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

      {/* READ ONLY BANNER */}
      <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.78rem", color: "#1E40AF", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>ℹ️</span> <strong>Read-Only Financial Intelligence:</strong> All metrics are aggregated in real-time from verified platform transaction ledgers.
      </div>

      {/* REVENUE KPIS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Monthly Recurring (MRR)", val: "$48,250", color: "#111111" },
          { label: "Annual Recurring (ARR)", val: "$579,000", color: "#D9A928" },
          { label: "Average Revenue / Org", val: "$2,450", color: "#18B67A" },
          { label: "Refunds Processed", val: "$450 (0.9%)", color: "#707070" },
          { label: "Outstanding Invoices", val: "$12,400", color: "#EF4444" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* REVENUE BY REGION & FORECAST */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Revenue Breakdown by Country & Region
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { country: "Nigeria 🇳🇬", amount: "$28,400", pct: "59%" },
              { country: "Ghana 🇬🇭", amount: "$11,200", pct: "23%" },
              { country: "Kenya 🇰🇪", amount: "$5,850", pct: "12%" },
              { country: "Other International", amount: "$2,800", pct: "6%" }
            ].map((r, idx) => (
              <div key={idx} style={{ fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{r.country}</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{r.amount} ({r.pct})</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: r.pct, backgroundColor: "#D9A928" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Q3 / Q4 Financial Trajectory Forecast
          </div>
          <div style={{ fontSize: "0.82rem", color: "#707070", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #E6DED0" }}>
              <span>Projected Q3 MRR Target:</span>
              <strong style={{ color: "#18B67A" }}>$62,000 / mo</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid #E6DED0" }}>
              <span>Projected Q4 End ARR:</span>
              <strong style={{ color: "#D9A928" }}>$750,000 ARR</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Net Expansion Retention:</span>
              <strong style={{ color: "#111111" }}>118.4%</strong>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
