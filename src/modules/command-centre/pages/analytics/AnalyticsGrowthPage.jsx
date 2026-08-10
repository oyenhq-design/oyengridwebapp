import React from "react";
import { TrendingUp, Users, Building2, BookOpen, Download } from "lucide-react";

export default function AnalyticsGrowthPage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Analytics <span style={{ color: "#D9A928" }}>/</span> Growth
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Ecosystem Expansion & Growth Velocity
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Read-only metrics tracking organization onboarding, program creation speed, learner acquisition, and retention rates.
            </p>
          </div>

          <button
            onClick={() => alert("Exporting Growth Velocity Report...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <Download size={14} /> Export Growth Brief
          </button>
        </div>
      </div>

      {/* GROWTH KPIS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "New Orgs This Month", val: "+18 Orgs", color: "#18B67A" },
          { label: "New Programs Created", val: "+45 Progs", color: "#18B67A" },
          { label: "New Learners Onboarded", val: "+1,420 Users", color: "#2563EB" },
          { label: "New Facilitators", val: "+64 Facs", color: "#D9A928" },
          { label: "New Enterprise Clients", val: "+3 Enterprise", color: "#7C3AED" },
          { label: "Customer Retention", val: "96.8%", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* REGIONAL GROWTH BREAKDOWN */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
          Ecosystem Growth Velocity by Region & Quarter
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
          {[
            { region: "West Africa (NG, GH)", growth: "+24.8% QoQ", status: "High Growth" },
            { region: "East Africa (KE, UG)", growth: "+18.2% QoQ", status: "Steady Growth" },
            { region: "Southern Africa (ZA)", growth: "+12.5% QoQ", status: "Expanding" },
            { region: "International Portals", growth: "+9.4% QoQ", status: "Early Adoption" }
          ].map((g, i) => (
            <div key={i} style={{ border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem", backgroundColor: "#F7F4ED" }}>
              <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600 }}>{g.region}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#18B67A", margin: "0.25rem 0" }}>{g.growth}</div>
              <div style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 700 }}>{g.status}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
