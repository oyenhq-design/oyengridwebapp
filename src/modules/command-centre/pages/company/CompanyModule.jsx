import React, { useState } from "react";
import TeamPage from "./TeamPage";
import DepartmentsPage from "./DepartmentsPage";
import RolesPage from "./RolesPage";
import PermissionsPage from "./PermissionsPage";
import OrganizationPage from "./OrganizationPage";

export default function CompanyModule({ initialSubtab = "Team" }) {
  const [subTab, setSubTab] = useState(initialSubtab);

  const subtabs = [
    { id: "Team", label: "Team" },
    { id: "Departments", label: "Departments" },
    { id: "Executives", label: "Executives" },
    { id: "Projects", label: "Internal Projects" },
    { id: "Meetings", label: "Meetings" },
    { id: "Calendar", label: "Company Calendar" },
    { id: "Assets", label: "Assets" },
    { id: "Documents", label: "Documents" },
    { id: "Settings", label: "Company Settings" },
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", backgroundColor: "#F7F4ED", minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Subpage Header Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px" }}>
              OYEN GROUP Internal Operating System
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.2rem 0 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Company Operations
            </h2>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #E6DED0", overflowX: "auto", paddingBottom: "0.1rem" }}>
          {subtabs.map(tab => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.6rem 1rem",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#111111" : "#707070",
                  cursor: "pointer",
                  borderBottom: isActive ? "2px solid #D9A928" : "2px solid transparent",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subpage Views */}
      <div>
        {subTab === "Team" && <TeamPage />}
        {subTab === "Departments" && <DepartmentsPage />}
        {subTab === "Executives" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Executive Dashboard</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { title: "Monthly Growth Rate", val: "+24.8%", color: "#18B67A" },
                { title: "Platform Reliability", val: "99.98%", color: "#D9A928" },
                { title: "Active Enterprises", val: "142 Orgs", color: "#111111" },
                { title: "Net Retention Rate", val: "118%", color: "#18B67A" }
              ].map((kpi, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, textTransform: "uppercase" }}>{kpi.title}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: kpi.color, marginTop: "0.36rem" }}>{kpi.val}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#707070", margin: 0 }}>
              Read-only strategic metric cockpit reserved for Founder, Co-Founder, and C-Suite Executives.
            </p>
          </div>
        )}
        {subTab === "Projects" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Internal Projects</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { name: "Command Centre v2 Refactor", owner: "Engineering & Product", status: "In Progress", target: "Q3 2026" },
                { name: "Zero-Trust Infrastructure Hardening", owner: "Security & Ops", status: "Active", target: "Q3 2026" },
                { name: "OYEN AI Voice Assistant v1", owner: "AI Research", status: "Planning", target: "Q4 2026" }
              ].map((proj, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111111" }}>{proj.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.2rem" }}>Owner: {proj.owner}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{proj.status}</span>
                    <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.2rem" }}>Target: {proj.target}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {subTab === "Meetings" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Internal Meetings & Syncs</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { title: "Weekly Leadership Sync", time: "Mondays @ 09:00 AM WAT", lead: "CEO & Founders" },
                { title: "Engineering All-Hands", time: "Wednesdays @ 03:00 PM WAT", lead: "VP Engineering" },
                { title: "Product Roadmap Review", time: "Fridays @ 04:00 PM WAT", lead: "Head of Product" }
              ].map((m, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{m.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.15rem" }}>Lead: {m.lead}</div>
                  </div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#D9A928" }}>{m.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {subTab === "Calendar" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Company Calendar</h3>
            <p style={{ fontSize: "0.85rem", color: "#707070" }}>Internal company events, product release schedules, and quarterly reviews.</p>
          </div>
        )}
        {subTab === "Assets" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Company Assets</h3>
            <p style={{ fontSize: "0.85rem", color: "#707070" }}>Hardware inventory, domain registrations, brand media kits, and security tokens.</p>
          </div>
        )}
        {subTab === "Documents" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Internal Documents & Policies</h3>
            <p style={{ fontSize: "0.85rem", color: "#707070" }}>OYEN GROUP standard operating procedures, handbook, legal contracts, and security policies.</p>
          </div>
        )}
        {subTab === "Settings" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Company Settings</h3>
            <OrganizationPage />
          </div>
        )}
      </div>
    </div>
  );
}
