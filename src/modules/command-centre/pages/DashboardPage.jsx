import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    totalOrgs: 2,
    activeOrgs: 2,
    suspendedOrgs: 0,
    totalUsers: 0,
    totalPrograms: 0,
    mrr: "₦12.8M",
  });

  const loadTelemetry = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];
      
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];

      const isPrimarySuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";
      const primaryPlan = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise";

      const primaryOrgActive = !isPrimarySuspended;
      const voltPowerActive = localStorage.getItem("oyen_suspended_voltpower-ltd") !== "true";

      const totalOrgs = 2;
      const activeOrgs = (primaryOrgActive ? 1 : 0) + (voltPowerActive ? 1 : 0);
      const suspendedOrgs = totalOrgs - activeOrgs;

      const totalUsers = team.length + learners.length + 52; // Active + static VoltPower
      const totalPrograms = programs.length + 2; // Active + static VoltPower

      // Calculate MRR: Enterprise is ₦500k, Pro is ₦250k
      const primaryRev = primaryPlan === "Enterprise" ? 500000 : 250000;
      const voltPlan = localStorage.getItem("oyen_plan_voltpower-ltd") || "Pro";
      const voltRev = voltPlan === "Enterprise" ? 500000 : 250000;
      const mrrVal = ((primaryRev + voltRev) / 1000).toFixed(0);

      setTelemetry({
        totalOrgs,
        activeOrgs,
        suspendedOrgs,
        totalUsers,
        totalPrograms,
        mrr: `₦${mrrVal}K`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTelemetry();
    window.addEventListener("storage", loadTelemetry);
    return () => window.removeEventListener("storage", loadTelemetry);
  }, []);

  const events = [
    { time: "09:18", event: "Workspace Created", meta: "ABC Energy", type: "success" },
    { time: "09:16", event: "Payment Received", meta: "Enterprise Plan", type: "success" },
    { time: "09:14", event: "Program Published", meta: "Solar Training", type: "info" },
    { time: "09:12", event: "AI Summary Generated", meta: "Week 4 Session", type: "info" },
    { time: "09:09", event: "Organization Suspended", meta: "Policy Violation", type: "error" },
  ];

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box" }}>
      
      {/* 1. Platform Snapshot Horizontal Panel */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}>
          
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Organizations</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>{telemetry.totalOrgs}</h4>
            <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>
              <span style={{ color: "#18B67A", fontWeight: 700 }}>{telemetry.activeOrgs} Active</span> • {telemetry.suspendedOrgs} Suspended
            </div>
          </div>

          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Users</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>{telemetry.totalUsers}</h4>
            <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>
              Queried Active Members
            </div>
          </div>

          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Revenue</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>{telemetry.mrr}</h4>
            <div style={{ fontSize: "0.72rem", color: "#10B981" }}>
              MRR • +8.4% MoM
            </div>
          </div>

          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Platform Health</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#18B67A" }}>99.99%</h4>
            <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>
              APIs, DB, Queue online
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>AI Systems</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>1.2M</h4>
            <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>
              Reqs • Avg 180ms
            </div>
          </div>

        </div>
      </section>

      {/* 2. Lower Operations Grid (Timeline + Sidebar) */}
      <div style={{ display: "flex", gap: "2rem" }}>
        
        {/* Left Column: Live Event Stream */}
        <div style={{ flex: 1, backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "#6B7280", letterSpacing: "1px", margin: "0 0 1.25rem 0" }}>
            Live Event Stream
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {events.map((e, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8rem", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.75rem" }}>
                <span style={{ color: "#6B7280", fontFamily: "monospace", width: "45px" }}>{e.time}</span>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: e.type === "error" ? "#E15D5D" : "#18B67A" }} />
                <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#1B1B1B" }}>{e.event}</strong>
                  <span style={{ color: "#6B7280" }}>{e.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ops Side Rail */}
        <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#E15D5D", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 0.75rem 0" }}>
              Active Incidents (2)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem" }}>
              <div>● AI Worker node latency spiked</div>
              <div>● Support queue exceeds SLA threshold</div>
            </div>
          </div>

          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 0.75rem 0" }}>
              Pending Reviews
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
              <span>WindForce Partners verification</span>
              <button onClick={() => alert("Verification opened")} style={{ background: "none", border: "none", color: "#D9A928", fontWeight: 700, cursor: "pointer" }}>Review</button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
