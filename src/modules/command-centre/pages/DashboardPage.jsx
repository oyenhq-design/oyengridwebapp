import React from "react";
import { Users, Building2, BookOpen, Calendar, Cpu, CreditCard, HelpCircle, Activity } from "lucide-react";

export default function DashboardPage() {
  const metrics = [
    { label: "Organizations", value: "523", subtext: "+12 Today", icon: <Building2 size={16} color="#F5C542" /> },
    { label: "Users", value: "18,492", subtext: "+104 Today", icon: <Users size={16} color="#F5C542" /> },
    { label: "Programs", value: "1,282", subtext: "Running", icon: <BookOpen size={16} color="#F5C542" /> },
    { label: "Sessions", value: "63", subtext: "Live Right Now", icon: <Calendar size={16} color="#10B981" /> },
    { label: "AI Usage", value: "92%", subtext: "Healthy", icon: <Cpu size={16} color="#10B981" /> },
    { label: "Payments", value: "₦12.8M", subtext: "MRR", icon: <CreditCard size={16} color="#F5C542" /> },
    { label: "Support", value: "7", subtext: "Open Tickets", icon: <HelpCircle size={16} color="#EF4444" /> },
    { label: "Platform Health", value: "99.98%", subtext: "Operational", icon: <Activity size={16} color="#10B981" /> },
  ];

  const activities = [
    { time: "09:19", text: "Organization Suspended", details: "CyberCorp - Terms Violation", badged: true },
    { time: "09:18", text: "AI Summary Generated", details: "Solar Tech Fellowship" },
    { time: "09:16", text: "Payment received", details: "₦2.4M from VoltPower Ltd" },
    { time: "09:15", text: "John invited 18 facilitators", details: "Admin Action" },
    { time: "09:12", text: "ABC Energy created a workspace", details: "Self-serve Signup" },
  ];

  return (
    <div style={{ padding: "2rem", display: "flex", gap: "2rem", height: "100%", boxSizing: "border-box" }}>
      
      {/* Metrics Grid Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Dashboard Overview</h3>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Real-time ecosystem metrics across all tenants</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
          {metrics.map((card, i) => (
            <div 
              key={i}
              style={{
                backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "8px",
                padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#AAAAAA", fontWeight: 600 }}>{card.label}</span>
                {card.icon}
              </div>
              <strong style={{ fontSize: "1.5rem", color: "#FFFFFF", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{card.value}</strong>
              <span style={{ fontSize: "0.68rem", color: card.subtext.includes("Today") || card.subtext === "Running" || card.subtext === "Operational" ? "#10B981" : "#AAAAAA", fontWeight: 600 }}>
                {card.subtext}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Timeline Sidebar Column */}
      <div style={{ width: "320px", backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "10px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
            Live Activity
          </h4>
          <span style={{ fontSize: "0.65rem", color: "#6B7280" }}>Real-time updates</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto" }}>
          {activities.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: "0.75rem", fontSize: "0.78rem" }}>
              <span style={{ color: "#6B7280", fontWeight: 700, fontFamily: "monospace" }}>{item.time}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <span style={{ fontWeight: 700, color: item.badged ? "#EF4444" : "#F5F2ED" }}>{item.text}</span>
                <span style={{ fontSize: "0.68rem", color: "#AAAAAA" }}>{item.details}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
