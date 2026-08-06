import React from "react";

export default function DashboardPage() {
  const events = [
    { time: "09:19", action: "Organization Suspended", details: "CyberCorp - Terms Violation", status: "Critical" },
    { time: "09:18", action: "AI Summary Generated", details: "Solar Tech Bootcamp - Week 2" },
    { time: "09:16", action: "Payment received", details: "₦2.4M from VoltPower Ltd" },
    { time: "09:15", action: "John invited 18 facilitators", details: "Workspace Super Admin Action" },
    { time: "09:12", action: "ABC Energy created a workspace", details: "Self-serve Registration" },
  ];

  const sideRailItems = {
    incidents: [
      { text: "AI Worker node latency spiked", type: "warning" },
      { text: "Support queue exceeds SLA threshold", type: "info" }
    ],
    reviews: [
      { text: "WindForce Partners signup verification", action: "Review" }
    ],
    trials: [
      { text: " VoltPower Trial expires in 2 days" }
    ]
  };

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box" }}>
      
      {/* 1. Platform Snapshot Horizontal Panel */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}>
          
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Organizations</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>523</h4>
            <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>
              <span style={{ color: "#18B67A", fontWeight: 700 }}>+12 Today</span> • Pending 4
            </div>
          </div>

          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Users</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>18,492</h4>
            <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>
              Online 9,221 • Flagged 3
            </div>
          </div>

          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Revenue</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0", color: "#1B1B1B" }}>₦12.8M</h4>
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
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: e.status === "Critical" ? "#E15D5D" : "#18B67A" }} />
                <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#1B1B1B" }}>{e.action}</strong>
                  <span style={{ color: "#6B7280" }}>{e.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ops Side Rail */}
        <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Active Incidents panel */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#E15D5D", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 0.75rem 0" }}>
              Active Incidents (2)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {sideRailItems.incidents.map((inc, i) => (
                <div key={i} style={{ fontSize: "0.75rem", color: "#1B1B1B", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#E5B93C" }} />
                  <span>{inc.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reviews panel */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 0.75rem 0" }}>
              Pending Reviews
            </h4>
            {sideRailItems.reviews.map((rev, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                <span>{rev.text}</span>
                <button onClick={() => alert("Verification opened")} style={{ background: "none", border: "none", color: "#D9A928", fontWeight: 700, cursor: "pointer" }}>{rev.action}</button>
              </div>
            ))}
          </div>

          {/* Expiring Trials panel */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 0.75rem 0" }}>
              Expiring Trials
            </h4>
            {sideRailItems.trials.map((tr, i) => (
              <div key={i} style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                {tr.text}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
