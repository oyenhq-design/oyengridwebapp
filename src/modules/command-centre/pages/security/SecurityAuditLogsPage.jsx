import React, { useState } from "react";
import { ShieldCheck, Search, Filter, Download, Lock, AlertTriangle, Terminal, Globe } from "lucide-react";

export default function SecurityAuditLogsPage() {
  const [filterAction, setFilterAction] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const auditLogs = [
    { timestamp: "2026-08-10 14:12:05", actor: "Shola Oyewole (CEO)", role: "Super Administrator", action: "Organization Suspended", target: "Global Tech Academy (ORG-402)", ip: "197.210.64.12", browser: "Chrome 127 (macOS)", location: "Lagos, NG" },
    { timestamp: "2026-08-10 13:45:22", actor: "Femi Adebayo (Ops)", role: "Operations Lead", action: "Payment Refunded", target: "Invoice INV-9921 ($850)", ip: "102.89.22.180", browser: "Edge 126 (Windows)", location: "Lagos, NG" },
    { timestamp: "2026-08-10 11:20:14", actor: "Sarah Compliance", role: "Compliance Officer", action: "Document Approved", target: "UNICEF CAC Registration", ip: "41.203.77.10", browser: "Firefox 128 (Linux)", location: "Abuja, NG" },
    { timestamp: "2026-08-10 09:05:00", actor: "System Daemon", role: "Automated Worker", action: "SSL Provisioned", target: "academy.abcenergy.com", ip: "127.0.0.1", browser: "Internal Worker Bot", location: "AWS us-east-1" }
  ];

  const filteredLogs = auditLogs.filter(l => {
    const matchesSearch = l.actor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterAction === "All" || l.action.includes(filterAction);
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Security <span style={{ color: "#D9A928" }}>/</span> Audit Logs
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Immutable System Audit Log Trail
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Cryptographically verified audit trail tracking every modification, approval, suspension, role change, and financial refund.
            </p>
          </div>

          <button
            onClick={() => alert("Exporting Cryptographic Audit Ledger...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <Download size={14} /> Export Audit Ledger
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
          <Search size={15} color="#707070" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, target record, or IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", flex: 1, fontSize: "0.82rem", color: "#111111" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={15} color="#707070" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: "#111111", outline: "none", fontWeight: 600 }}
          >
            <option value="All">All Audit Action Categories</option>
            <option value="Suspended">Suspension Events</option>
            <option value="Refunded">Financial Refunds</option>
            <option value="Approved">Document Approvals</option>
            <option value="SSL">Infrastructure SSL</option>
          </select>
        </div>
      </section>

      {/* AUDIT LOG TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>TIMESTAMP (UTC)</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ACTOR & ROLE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ACTION PERFORMED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>AFFECTED RECORD</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>IP ADDRESS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CLIENT BROWSER / LOCATION</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((l, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontFamily: "monospace", color: "#707070", fontSize: "0.75rem" }}>{l.timestamp}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>
                  <div>{l.actor}</div>
                  <span style={{ fontSize: "0.68rem", color: "#D9A928" }}>{l.role}</span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {l.action}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{l.target}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontFamily: "monospace", color: "#111111" }}>{l.ip}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070", fontSize: "0.75rem" }}>{l.browser} ({l.location})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
