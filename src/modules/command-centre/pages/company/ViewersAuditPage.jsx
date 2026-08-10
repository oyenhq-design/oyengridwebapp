import React, { useState } from "react";
import { ShieldCheck, Eye, Download, FileText, Lock, AlertTriangle, Clock, Filter, CheckCircle2 } from "lucide-react";

export default function ViewersAuditPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Viewer Accounts Dataset (External Governance, Investors, Board, Auditors)
  const viewerAccounts = [
    { id: 1, name: "Dr. Babatunde Fowler", org: "Board of Directors", scope: "Executive Board Overview", perm: "Read-Only Strategic", status: "Active", expiry: "Dec 2027", lastLogin: "Yesterday" },
    { id: 2, name: "Katherine Sterling", org: "Sequoia Capital Africa", scope: "Financial & Investor KPI Dashboard", perm: "Read-Only Investor", status: "Active", expiry: "Jun 2027", lastLogin: "3 days ago" },
    { id: 3, name: "Prof. Chidi Odinkalu", org: "Advisory Board", scope: "Corporate Governance & Ethics", perm: "Read-Only Advisor", status: "Active", expiry: "Jan 2028", lastLogin: "1 week ago" },
    { id: 4, name: "Engr. Folashade Aderemi", org: "Lagos State Ministry of Tech", scope: "Government Compliance Audit", perm: "Read-Only Regulatory", status: "Active", expiry: "Nov 2026", lastLogin: "2 weeks ago" },
    { id: 5, name: "Marcus Vance, CPA", org: "PwC External Audit Team", scope: "Financial & Security Audit Logs", perm: "Read-Only Audit", status: "Active", expiry: "Sep 2026", lastLogin: "4 hours ago" },
  ];

  // Internal Governance Audit Logs
  const auditLogs = [
    { time: "10:15", event: "Viewer Account Invited", detail: "Marcus Vance (PwC Audit Team) granted Read-Only Audit scope", actor: "Shola Oyewole (CEO)", cat: "Governance", color: "#D9A928" },
    { time: "09:40", event: "Department Created", detail: "AI Research & Innovation Department established", actor: "Amina Bello (CTO)", cat: "Structure", color: "#2563EB" },
    { time: "09:12", event: "Role Permission Escalated", detail: "Senior Security Architect assigned Security Lead role", actor: "Amina Bello (CTO)", cat: "Security", color: "#7C3AED" },
    { time: "08:50", event: "Policy Document Edited", detail: "Zero-Trust Infrastructure Security Policy updated to v3.2", actor: "David Okonjo (VP Eng)", cat: "Policy", color: "#18B67A" },
    { time: "Yesterday", event: "Employee Account Suspended", detail: "Samuel Adebayo account suspended pending security review", actor: "Grace Chukwu (Ops Head)", cat: "Security", color: "#DC2626" },
    { time: "Yesterday", event: "Vendor SLA Approved", detail: "AWS Enterprise Cloud Services Agreement approved", actor: "Tunde Bakare (Finance Head)", cat: "Vendor", color: "#18B67A" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Governance & Compliance Header Card */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.2rem" }}>
              Corporate Governance & Transparency
            </div>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Viewers, Compliance & Audit Control
            </h2>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#707070", fontWeight: 500 }}>
              Manage read-only executive viewers (Board Members, Investors, Auditors), view immutable internal audit streams, and monitor regulatory compliance.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button 
              onClick={() => alert("Downloading Security Login History...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px",
                color: "#111111", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
              }}
            >
              <Download size={14} />
              <span>Download Login History</span>
            </button>

            <button 
              onClick={() => alert("Generating Governance Audit Report PDF...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
              }}
            >
              <FileText size={14} />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. VIEWER ACCOUNTS (BOARD, INVESTORS, AUDITORS) */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Read-Only Viewer Accounts
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Board members, investors, advisors, government officials, external auditors</span>
          </div>

          <button 
            onClick={() => alert("Opening Invite Viewer Modal...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#111111", border: "none", borderRadius: "6px",
              color: "#D9A928", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
            }}
          >
            <Eye size={14} />
            <span>+ Invite Viewer</span>
          </button>
        </div>

        {/* Viewers Table */}
        <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>VIEWER NAME</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>ORGANIZATION</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>ACCESS SCOPE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>PERMISSIONS</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>EXPIRY DATE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>LAST LOGIN</th>
              </tr>
            </thead>
            <tbody>
              {viewerAccounts.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #E6DED0" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#111111" }}>{v.name}</td>
                  <td style={{ padding: "1rem", color: "#111111", fontWeight: 600 }}>{v.org}</td>
                  <td style={{ padding: "1rem", color: "#707070" }}>{v.scope}</td>
                  <td style={{ padding: "1rem", color: "#D9A928", fontWeight: 600 }}>{v.perm}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "#707070", fontSize: "0.75rem" }}>{v.expiry}</td>
                  <td style={{ padding: "1rem", color: "#707070", fontSize: "0.75rem" }}>{v.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2 & 3. AUDIT LOGS STREAM & COMPLIANCE FRAMEWORKS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
        
        {/* Internal Audit Stream */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Immutable Corporate Audit Trail
            </h3>
            <span style={{ fontSize: "0.72rem", color: "#707070" }}>System-level log</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {auditLogs.map((log, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.8rem", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.6rem" }}>
                <span style={{ color: "#707070", fontFamily: "monospace", width: "55px", flexShrink: 0 }}>{log.time}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "#111111" }}>{log.event}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.1rem" }}>{log.detail}</div>
                  <div style={{ fontSize: "0.68rem", color: "#707070", marginTop: "0.05rem" }}>Actor: <strong>{log.actor}</strong></div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: log.color, backgroundColor: "#F7F4ED", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid #E6DED0" }}>
                  {log.cat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Frameworks & Security Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Compliance Frameworks */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Regulatory Compliance Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem" }}>
              {[
                { std: "ISO 27001 Security", status: "Compliant & Certified", color: "#18B67A" },
                { std: "NDPR (Nigeria Data Protection)", status: "100% Compliant", color: "#18B67A" },
                { std: "GDPR (European Union)", status: "Fully Compliant", color: "#18B67A" },
                { std: "Internal Security Policies", status: "18 Policies Enforced", color: "#D9A928" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
                  <span style={{ fontWeight: 700, color: "#111111" }}>{c.std}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: c.color }}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Events Monitoring */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Security Threat Monitoring
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.78rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Failed Login Attempts:</span> <strong style={{ color: "#18B67A" }}>0 Failed (Clean)</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Permission Escalations:</span> <strong style={{ color: "#111111" }}>1 Verified</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Expired Sessions Purged:</span> <strong style={{ color: "#707070" }}>14 Sessions</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Disabled Accounts:</span> <strong style={{ color: "#DC2626" }}>1 Account</strong></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
