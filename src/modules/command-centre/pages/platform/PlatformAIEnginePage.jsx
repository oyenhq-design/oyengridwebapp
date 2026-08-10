import React from "react";
import { Cpu, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Activity, BarChart2 } from "lucide-react";

export default function PlatformAIEnginePage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Platform <span style={{ color: "#D9A928" }}>/</span> AI Engine
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              OYEN AI Command Engine & Token Governance
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Monitor AI API request rates, token consumption, response latencies, LLM models (GPT-4o, Claude 3.5), prompt logs, and rate limit throttling.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Switching Default LLM Model...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Cpu size={14} /> Switch Active Model
            </button>
            <button
              onClick={() => alert("Restarting OYEN AI Engine Cluster...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <RefreshCw size={14} /> Restart AI Cluster
            </button>
          </div>
        </div>
      </div>

      {/* AI ENGINE KPIS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "AI Requests Today", val: "12,450 Requests", color: "#111111" },
          { label: "Daily Token Consumption", val: "485,000 Tokens", color: "#D9A928" },
          { label: "Monthly Token Usage", val: "14.2M Tokens", color: "#111111" },
          { label: "Average Response Time", val: "0.42 Seconds", color: "#18B67A" },
          { label: "Active LLM Models", val: "GPT-4o & Claude 3.5", color: "#2563EB" },
          { label: "Question Accuracy", val: "99.8% Success", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* AI ENGINE ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          AI Engine Governance Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Restart AI Service Cluster",
            "Switch Default Model (GPT-4o ↔ Claude 3.5)",
            "Throttle Over-Quota Organizations",
            "Inspect Real-time Prompt Logs",
            "Purge AI Response Cache"
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => alert(`Triggered: ${act}`)}
              style={{
                padding: "0.65rem 1.15rem", border: "1px solid #E6DED0", borderRadius: "8px",
                backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem",
                fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#D9A928"; e.currentTarget.style.backgroundColor = "#FFF7E4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E6DED0"; e.currentTarget.style.backgroundColor = "#F7F4ED"; }}
            >
              {act}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
