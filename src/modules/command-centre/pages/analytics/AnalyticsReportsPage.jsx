import React from "react";
import { FileText, Download, Calendar, Mail, Clock, Plus, Layers } from "lucide-react";

export default function AnalyticsReportsPage() {
  const reports = [
    { title: "Financial & Revenue Audit Report Q2 2026", type: "Revenue", format: "PDF / Excel", schedule: "Monthly (Automated)", lastGenerated: "Aug 01, 2026" },
    { title: "Organization Onboarding & Verification Summary", type: "Organization", format: "PDF", schedule: "Weekly", lastGenerated: "Aug 05, 2026" },
    { title: "Program Completion & Facilitator Performance Ledger", type: "Program", format: "Excel / CSV", schedule: "Bi-Weekly", lastGenerated: "Jul 30, 2026" },
    { title: "Global Certificate Issuance & Revocation Audit", type: "Certificate", format: "PDF (Cryptographic Hash)", schedule: "Monthly", lastGenerated: "Aug 02, 2026" },
    { title: "Learner Attendance & Live Session Participation", type: "Attendance", format: "Excel", schedule: "Daily Dispatch", lastGenerated: "Today @ 06:00 AM" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Analytics <span style={{ color: "#D9A928" }}>/</span> Reports
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Enterprise Intelligence Reporting Center
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Generate, schedule, email, and export executive compliance, revenue, program, learner, and audit reports.
            </p>
          </div>

          <button
            onClick={() => alert("Generate Custom Report Modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Generate Custom Report
          </button>
        </div>
      </div>

      {/* REPORT CATALOG TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>REPORT TITLE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CATEGORY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>FORMAT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>SCHEDULE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LAST GENERATED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{r.title}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#D9A928", fontWeight: 600 }}>{r.type}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{r.format}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#18B67A", fontWeight: 600 }}>{r.schedule}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{r.lastGenerated}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Exporting ${r.title}...`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Export ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK REPORT ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Report Dispatch Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Generate One-Off Executive Report",
            "Schedule Automated Monthly Dispatch",
            "Export Executive Summary PDF",
            "Export Raw Data Excel (.xlsx)",
            "Email Report to Board & Leadership"
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => alert(`Triggered: ${act}`)}
              style={{
                padding: "0.65rem 1.15rem", border: "1px solid #E6DED0", borderRadius: "8px",
                backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem",
                fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#D9A928"; e.currentTarget.style.backgroundColor = "#FFF7E4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E6DED0"; e.currentTarget.style.backgroundColor = "#F7F4ED"; }}
            >
              {act}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
