import React, { useState } from "react";
import { Search } from "lucide-react";

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
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Title */}
      <div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#1B1B1B" }}>Organizations</h3>
        <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Manage SaaS tenants, plan metrics and customer health indices</span>
      </div>

      {/* Control Bar */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "0.75rem 1rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search organizations by name or plan..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.45rem 0.75rem 0.45rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Stripe-style Customer Table Grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
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
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{org.name}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: org.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)",
                    color: org.status === "Active" ? "#18B67A" : "#E15D5D"
                  }}>
                    {org.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem", color: "#6B7280" }}>{org.plan}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#6B7280" }}>{org.users}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#6B7280" }}>{org.programs}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "60px", height: "4px", backgroundColor: "#E6DED0", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${org.score}%`, height: "100%", backgroundColor: org.score > 80 ? "#18B67A" : "#E15D5D" }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#6B7280", fontWeight: 600 }}>{org.score}%</span>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <button style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}>
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
