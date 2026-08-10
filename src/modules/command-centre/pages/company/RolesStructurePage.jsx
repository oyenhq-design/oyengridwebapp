import React, { useState } from "react";
import { Shield, Layers, Users, CheckCircle2, Lock, Plus, Key, ChevronRight } from "lucide-react";

export default function RolesStructurePage() {
  const [selectedRole, setSelectedRole] = useState("Founder / CEO");

  const roles = [
    { title: "Founder / CEO", scope: "Global Platform Root", members: 2, level: "Level 0 (Root)" },
    { title: "Co-Founder / Executive", scope: "Executive Governance", members: 3, level: "Level 1" },
    { title: "Department Head", scope: "Departmental Command", members: 12, level: "Level 2" },
    { title: "Staff Engineer / Lead", scope: "Module Ownership", members: 18, level: "Level 3" },
    { title: "Operations Analyst", scope: "Read/Write Support", members: 10, level: "Level 4" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Company <span style={{ color: "#D9A928" }}>/</span> Roles
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Organizational Roles & Access Hierarchy
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage internal company hierarchy, permission matrices, role templates, access levels, and department structures.
            </p>
          </div>

          <button
            onClick={() => alert("Create Custom Role modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Create Custom Role
          </button>
        </div>
      </div>

      {/* 1. ORGANIZATION CHART & DEPARTMENT HIERARCHY */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Company Organizational Hierarchy
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { level: "Founder / CEO", sub: "Root Access • System Governance", count: "2 Executives" },
            { level: "Co-Founder & C-Suite", sub: "Departmental Leadership", count: "3 Executives" },
            { level: "Department Heads", sub: "Operational Execution", count: "12 VPs & Directors" },
            { level: "Internal Staff Roles", sub: "Module Scopes", count: "28 Team Members" }
          ].map((hier, idx) => (
            <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
              <div style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 700 }}>LEVEL {idx}</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111111", marginTop: "0.2rem" }}>{hier.level}</div>
              <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.15rem" }}>{hier.sub}</div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#18B67A", marginTop: "0.5rem", display: "block" }}>{hier.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. PERMISSION MATRIX & ACCESS LEVELS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "2rem" }}>
        
        {/* Role List */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Role Templates & Definitions
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {roles.map((r, idx) => {
              const isSelected = selectedRole === r.title;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedRole(r.title)}
                  style={{
                    backgroundColor: isSelected ? "#FFF7E4" : "#F7F4ED",
                    border: isSelected ? "1px solid #D9A928" : "1px solid #E6DED0",
                    borderRadius: "8px", padding: "1rem 1.25rem", cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{r.title}</strong>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, backgroundColor: "#E6DED0", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                      {r.level}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.2rem" }}>{r.scope} • {r.members} Staff assigned</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Permission Matrix */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Permission Matrix for: <strong style={{ color: "#111111" }}>{selectedRole}</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.8rem" }}>
            {[
              { module: "Company Headquarters OS", access: "Full Control (Read/Write/Execute)" },
              { module: "Customer Organizations & Billing", access: "Full Control (Read/Write/Execute)" },
              { module: "Platform Authentication & Security", access: "Full Control (Root)" },
              { module: "OYEN AI Engine Configuration", access: "Full Control" },
              { module: "Engineering Releases & Deployments", access: "Full Control" },
              { module: "Audit Logs & Security Inspection", access: "Full Control" }
            ].map((perm, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem 1rem", borderRadius: "6px" }}>
                <span style={{ fontWeight: 600, color: "#111111" }}>{perm.module}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#18B67A", backgroundColor: "#E6F8F0", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  {perm.access}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
