import React, { useState } from "react";
import { Shield, Lock, Layers, Plus, Copy, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";

export default function RolesStructurePage() {
  const [selectedRoleTab, setSelectedRoleTab] = useState("Founder");

  // Corporate Org Hierarchy Levels
  const hierarchyLevels = [
    { level: "Level 1", title: "Founder / CEO", scope: "Unrestricted Full Access across all OYEN GROUP & Customer systems", desc: "Top-tier operational and legal authority." },
    { level: "Level 2", title: "C-Suite Executives", scope: "Full Corporate Read/Write Access + Executive Financial Approval", desc: "Co-Founder, CTO, VP Engineering, VP Product, Head of Finance." },
    { level: "Level 3", title: "Department Heads", scope: "Departmental Administration & Team Management Scopes", desc: "Heads of Operations, Marketing, Legal, HR, Support, AI Research." },
    { level: "Level 4", title: "Managers & Leads", scope: "Team Lead & Project Ownership Scopes", desc: "Engineering Leads, Product Managers, Senior Staff." },
    { level: "Level 5", title: "Full Staff Employees", scope: "Standard Operational Scope within Assigned Department", desc: "Software Engineers, Operations Specialists, Support Reps." },
    { level: "Level 6", title: "Interns & Contractors", scope: "Restricted Project-Based Read-Only Scopes", desc: "External Advisors, Legal Contractors, Graduate Interns." },
  ];

  // Role Templates Dataset
  const roleTemplates = [
    { name: "Founder", type: "System Tier 1", users: 1, permissionsCount: "All 42 Permissions" },
    { name: "Executive", type: "System Tier 2", users: 5, permissionsCount: "38 Permissions" },
    { name: "Finance", type: "Departmental", users: 4, permissionsCount: "24 Permissions" },
    { name: "Engineering", type: "Departmental", users: 14, permissionsCount: "30 Permissions" },
    { name: "Operations", type: "Departmental", users: 8, permissionsCount: "28 Permissions" },
    { name: "Marketing", type: "Departmental", users: 6, permissionsCount: "18 Permissions" },
    { name: "Support", type: "Departmental", users: 5, permissionsCount: "16 Permissions" },
    { name: "HR", type: "Departmental", users: 3, permissionsCount: "22 Permissions" },
    { name: "Legal", type: "Departmental", users: 2, permissionsCount: "20 Permissions" },
    { name: "Design", type: "Departmental", users: 3, permissionsCount: "14 Permissions" },
  ];

  // Access Controls Matrix Items
  const accessControls = [
    { action: "Invite & Onboard Staff", founder: true, executive: true, deptHead: true, manager: false, employee: false },
    { action: "Delete / Deactivate Accounts", founder: true, executive: true, deptHead: false, manager: false, employee: false },
    { action: "Create Corporate Departments", founder: true, executive: true, deptHead: false, manager: false, employee: false },
    { action: "Manage Customer Organizations", founder: true, executive: true, deptHead: true, manager: true, employee: false },
    { action: "Manage Platform Infrastructure", founder: true, executive: true, deptHead: false, manager: false, employee: false },
    { action: "Manage Billing & Subscriptions", founder: true, executive: true, deptHead: false, manager: false, employee: false },
    { action: "View Financial Revenue Cockpit", founder: true, executive: true, deptHead: true, manager: false, employee: false },
    { action: "Manage Third-Party Integrations", founder: true, executive: true, deptHead: true, manager: false, employee: false },
    { action: "View System Security Audit Logs", founder: true, executive: true, deptHead: true, manager: true, employee: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Info Banner */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.2rem" }}>
          Access & Permission Control System
        </div>
        <h2 style={{ fontSize: "1.65rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
          Corporate Roles & Hierarchy Architecture
        </h2>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "#707070", fontWeight: 500 }}>
          Define organizational authority tiers, role templates, access matrix policies, and custom administrative permissions.
        </p>
      </div>

      {/* 1. ORGANIZATION HIERARCHY CHART */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
          Organizational Command Hierarchy
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {hierarchyLevels.map((lvl, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem 1.25rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "#D9A928", width: "65px", textTransform: "uppercase" }}>{lvl.level}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#111111" }}>{lvl.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.15rem" }}>{lvl.desc}</div>
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#18B67A", backgroundColor: "#F0FDF4", padding: "0.2rem 0.55rem", borderRadius: "4px", border: "1px solid #BBF7D0" }}>
                {lvl.scope}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ROLE TEMPLATES & CUSTOM ROLE CREATOR */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Role Templates & Custom Roles
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Pre-configured departmental roles and custom permission profiles</span>
          </div>

          <button 
            onClick={() => alert("Opening Custom Role Creator...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
            }}
          >
            <Plus size={14} />
            <span>+ Create Custom Role</span>
          </button>
        </div>

        {/* Roles Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {roleTemplates.map((role, i) => (
            <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.15rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#111111", fontSize: "0.9rem" }}>{role.name}</strong>
                <span style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 700, backgroundColor: "#FFF7E4", padding: "0.15rem 0.4rem", borderRadius: "3px" }}>
                  {role.type}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#707070" }}>Assigned Users: <strong style={{ color: "#111111" }}>{role.users} Staff</strong></div>
              <div style={{ fontSize: "0.75rem", color: "#18B67A", fontWeight: 600 }}>{role.permissionsCount}</div>
              
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", borderTop: "1px solid #E6DED0", paddingTop: "0.5rem" }}>
                <button onClick={() => alert(`Editing Role: ${role.name}`)} style={{ background: "none", border: "none", color: "#707070", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700 }}>Edit</button>
                <button onClick={() => alert(`Duplicating Role: ${role.name}`)} style={{ background: "none", border: "none", color: "#707070", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700 }}>Duplicate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ACCESS CONTROLS PERMISSION MATRIX */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
          Access Controls & Permission Matrix
        </h3>

        <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>ACTION / CAPABILITY</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700, textAlign: "center" }}>FOUNDER</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700, textAlign: "center" }}>EXECUTIVE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700, textAlign: "center" }}>DEPT HEAD</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700, textAlign: "center" }}>MANAGER</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700, textAlign: "center" }}>EMPLOYEE</th>
              </tr>
            </thead>
            <tbody>
              {accessControls.map((ac, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#111111" }}>{ac.action}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{ac.founder ? <CheckCircle2 size={16} color="#18B67A" /> : <XCircle size={16} color="#9CA3AF" />}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{ac.executive ? <CheckCircle2 size={16} color="#18B67A" /> : <XCircle size={16} color="#9CA3AF" />}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{ac.deptHead ? <CheckCircle2 size={16} color="#18B67A" /> : <XCircle size={16} color="#9CA3AF" />}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{ac.manager ? <CheckCircle2 size={16} color="#18B67A" /> : <XCircle size={16} color="#9CA3AF" />}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{ac.employee ? <CheckCircle2 size={16} color="#18B67A" /> : <XCircle size={16} color="#9CA3AF" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
