import React, { useState } from "react";
import { ShieldCheck, Eye, Download, FileText, Lock, Key, Clock, AlertTriangle } from "lucide-react";

export default function ViewersAuditPage() {
  const [activeTab, setActiveTab] = useState("Viewers");

  const viewers = [
    { name: "Dr. Adewale Tinubu", role: "Board Member", org: "OYEN GROUP Board", status: "Active Read-only", lastLogin: "Today @ 09:12 AM" },
    { name: "Sarah Al-Hassan", role: "Lead Investor", org: "Ventures Africa Fund", status: "Active Read-only", lastLogin: "Yesterday @ 04:45 PM" },
    { name: "Prof. Kwame Mensah", role: "Strategic Advisor", org: "African EdTech Council", status: "Active Read-only", lastLogin: "3 days ago" },
    { name: "Deloitte Audit Team", role: "External Auditor", org: "Deloitte & Touche", status: "Audit Window Open", lastLogin: "Today @ 11:30 AM" }
  ];

  const auditLogs = [
    { time: "11:30 AM", user: "Deloitte Audit Team", action: "Downloaded Q2 2026 SOC2 Compliance Report", ip: "197.210.64.12" },
    { time: "09:12 AM", user: "Dr. Adewale Tinubu", action: "Viewed Corporate Revenue & ARR Dashboard", ip: "102.89.43.11" },
    { time: "08:45 AM", user: "Sarah Al-Hassan", action: "Inspected Customer Health Scores & NPS", ip: "105.112.23.89" },
    { time: "07:30 AM", user: "System Guard", action: "Automated Governance Compliance Scan Completed", ip: "Internal System" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Company <span style={{ color: "#D9A928" }}>/</span> Viewers
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Read-Only Governance & Audit Console
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage read-only access for Board Members, Investors, Advisors, and External Auditors alongside compliance logs.
            </p>
          </div>

          <button
            onClick={() => alert("Export Audit Report CSV")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <Download size={14} /> Export Audit Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Active Read-Only Viewers", val: "4 Accounts", color: "#111111" },
          { label: "External Compliance Audit", val: "In Progress (SOC2)", color: "#D9A928" },
          { label: "Audit Log Integrity", val: "100% Immutable", color: "#18B67A" },
          { label: "Security Anomalies", val: "0 Warnings", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* 1. VIEWER ACCOUNTS (BOARD, INVESTORS, AUDITORS) */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Authorized Governance & External Viewers
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {viewers.map((v, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem 1.25rem", borderRadius: "8px" }}>
              <div>
                <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{v.name}</strong>
                <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.15rem" }}>
                  Role: {v.role} • Entity: {v.org}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#E6F8F0", color: "#18B67A", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  {v.status}
                </span>
                <div style={{ fontSize: "0.7rem", color: "#707070", marginTop: "0.2rem" }}>Last Login: {v.lastLogin}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. AUDIT LOGS & COMPLIANCE REPORTS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Audit Trail & Access History
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {auditLogs.map((log, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.65rem", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#707070", width: "65px" }}>{log.time}</span>
                <div>
                  <strong style={{ color: "#111111" }}>{log.user}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.1rem" }}>{log.action}</div>
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#707070" }}>{log.ip}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
