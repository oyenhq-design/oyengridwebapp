import React from "react";
import { ShieldCheck, Cpu, GitCommit } from "lucide-react";

export default function DashboardPage() {
  const events = [
    { time: "09:18", event: "Workspace Created", meta: "ABC Energy", type: "success" },
    { time: "09:16", event: "Payment Received", meta: "Enterprise Plan", type: "success" },
    { time: "09:14", event: "Program Published", meta: "Solar Training", type: "info" },
    { time: "09:12", event: "AI Summary Generated", meta: "Week 4 Session", type: "info" },
    { time: "09:09", event: "Organization Suspended", meta: "Policy Violation", type: "error" },
  ];

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box" }}>
      
      {/* 1. Platform Health Panel */}
      <section style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "8px", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px" }}>Platform Health</span>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0.25rem 0", color: "#10B981", fontFamily: "'Outfit', sans-serif" }}>
              99.99% Operational
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#AAAAAA" }}>No incidents. All core cluster systems and API services online.</p>
          </div>
          <ShieldCheck size={32} color="#10B981" />
        </div>
      </section>

      {/* 2. Operational Metrics Panel (Vercel Style) */}
      <section style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "8px", padding: "2rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1.5rem" }}>
          Operational Metrics
        </span>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          
          <div style={{ borderRight: "1px solid #1E1E1E", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#888888" }}>Organizations</span>
            <h4 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.35rem 0 0.15rem 0", color: "#FFFFFF", fontFamily: "'Outfit', sans-serif" }}>523</h4>
            <span style={{ fontSize: "0.72rem", color: "#10B981" }}>+12 today</span>
          </div>

          <div style={{ borderRight: "1px solid #1E1E1E", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#888888" }}>Users</span>
            <h4 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.35rem 0 0.15rem 0", color: "#FFFFFF", fontFamily: "'Outfit', sans-serif" }}>18,492</h4>
            <span style={{ fontSize: "0.72rem", color: "#10B981" }}>+104 today</span>
          </div>

          <div style={{ borderRight: "1px solid #1E1E1E", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#888888" }}>Programs</span>
            <h4 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.35rem 0 0.15rem 0", color: "#FFFFFF", fontFamily: "'Outfit', sans-serif" }}>1,282</h4>
            <span style={{ fontSize: "0.72rem", color: "#AAAAAA" }}>Running</span>
          </div>

          <div>
            <span style={{ fontSize: "0.78rem", color: "#888888" }}>Revenue</span>
            <h4 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.35rem 0 0.15rem 0", color: "#FFFFFF", fontFamily: "'Outfit', sans-serif" }}>₦12.8M</h4>
            <span style={{ fontSize: "0.72rem", color: "#F4C542" }}>MRR</span>
          </div>

        </div>
      </section>

      {/* 3. Live Event Stream Panel (GitHub Actions style) */}
      <section style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "8px", padding: "2rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1.5rem" }}>
          Live Event Stream
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {events.map((e, idx) => (
            <div 
              key={idx} 
              style={{
                display: "flex", alignItems: "center", gap: "1.25rem", padding: "0.75rem 1rem",
                borderRadius: "6px", border: "1px solid #1E1E1E", backgroundColor: "#090909"
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "#6B7280", fontFamily: "monospace", width: "40px" }}>{e.time}</span>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: e.type === "success" ? "#10B981" : e.type === "error" ? "#EF4444" : "#3B82F6" }} />
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <strong style={{ color: "#F5F2ED" }}>{e.event}</strong>
                <span style={{ color: "#888888" }}>{e.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
