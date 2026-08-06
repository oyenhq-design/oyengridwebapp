import React, { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const orgs = [
    { name: "ABC Energy", status: "Active", plan: "Enterprise", users: "127", programs: "4", health: "Healthy", score: 98 },
    { name: "VoltPower Ltd", status: "Active", plan: "Pro", users: "52", programs: "2", health: "Healthy", score: 92 },
    { name: "Solar Technology Fellows", status: "Active", plan: "Enterprise", users: "305", programs: "8", health: "Healthy", score: 99 },
    { name: "CyberCorp International", status: "Suspended", plan: "Enterprise", users: "88", programs: "3", health: "At Risk", score: 45 },
    { name: "WindForce Partners", status: "Active", plan: "Trial", users: "8", programs: "1", health: "Healthy", score: 85 },
  ];

  const filteredOrgs = orgs.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Organizations</h3>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Manage SaaS tenants, plan metrics and customer health indices</span>
        </div>
      </div>

      {/* Control Bar (Stripe-style) */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "8px", padding: "0.75rem 1rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search organizations by name or plan..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.45rem 0.75rem 0.45rem 2.25rem", borderRadius: "6px", border: "1px solid #1E1E1E", backgroundColor: "#090909", color: "#FFFFFF", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", border: "1px solid #1E1E1E", borderRadius: "6px", backgroundColor: "#090909", color: "#AAAAAA", fontSize: "0.78rem", cursor: "pointer" }}>
          <SlidersHorizontal size={13} />
          <span>Filters</span>
        </button>
      </div>

      {/* Grid Table */}
      <div style={{ border: "1px solid #1E1E1E", borderRadius: "8px", overflow: "hidden", backgroundColor: "#111111" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1E1E1E", backgroundColor: "#090909" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PLAN</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>USERS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PROGRAMS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>HEALTH SCORE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((org, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #1E1E1E" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.01)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "#FFFFFF" }}>{org.name}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: org.status === "Active" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                    color: org.status === "Active" ? "#10B981" : "#EF4444"
                  }}>
                    {org.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "#AAAAAA" }}>{org.plan}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#AAAAAA" }}>{org.users}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#AAAAAA" }}>{org.programs}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "60px", height: "4px", backgroundColor: "#1E1E1E", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${org.score}%`, height: "100%", backgroundColor: org.score > 80 ? "#10B981" : "#EF4444" }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#AAAAAA", fontWeight: 600 }}>{org.score}%</span>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <button style={{ background: "none", border: "none", color: "#F5C542", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
