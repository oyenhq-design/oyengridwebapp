import React, { useState } from "react";
import { Globe, ShieldCheck, RefreshCw, Plus, CheckCircle2, AlertTriangle, Lock, ExternalLink } from "lucide-react";

export default function OrganizationsDomainsPage() {
  const domains = [
    { org: "ABC Energy Workspace", domain: "academy.abcenergy.com", ssl: "Active (Auto-Renew)", dns: "CNAME Verified", primary: "Yes", created: "Jun 12, 2026", checked: "5 mins ago", status: "Connected" },
    { org: "VoltPower Ltd", domain: "training.voltpower.co", ssl: "Active", dns: "CNAME Verified", primary: "Yes", created: "Mar 12, 2026", checked: "12 mins ago", status: "Connected" },
    { org: "Lagos State Education Board", domain: "learn.lagosstate.gov.ng", ssl: "Active", dns: "A Record Verified", primary: "Yes", created: "May 01, 2026", checked: "1 hour ago", status: "Connected" },
    { org: "MTN Academy West Africa", domain: "academy.mtn.ng", ssl: "Active", dns: "CNAME Verified", primary: "Yes", created: "Apr 18, 2026", checked: "30 mins ago", status: "Connected" },
    { org: "Global Tech Academy", domain: "portal.globaltech.io", ssl: "Pending SSL", dns: "Pending DNS Propagation", primary: "No", created: "Aug 02, 2026", checked: "Just now", status: "Pending DNS" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Organizations <span style={{ color: "#D9A928" }}>/</span> Domains
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Branded Custom Domains & SSL Management
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Configure custom domain URLs (e.g., academy.abcenergy.com), DNS verification records, and automated SSL certificate provisioning.
            </p>
          </div>

          <button
            onClick={() => alert("Connect Custom Domain Modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Connect Custom Domain
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS (6 Domain Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Connected Custom Domains", val: "184 Domains", color: "#111111" },
          { label: "Pending DNS Records", val: "8 Pending", color: "#2563EB" },
          { label: "Verified Domains", val: "176 Verified", color: "#18B67A" },
          { label: "SSL Certificates", val: "184 Active", color: "#18B67A" },
          { label: "Expired Domains", val: "2 Expired", color: "#707070" },
          { label: "Failed Verification", val: "3 Failed", color: "#EF4444" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* CUSTOM DOMAINS DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CUSTOM DOMAIN URL</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>SSL STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DNS STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PRIMARY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LAST CHECKED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{d.org}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#D9A928", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>{d.domain}</span>
                    <ExternalLink size={12} color="#D9A928" />
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#18B67A", fontWeight: 600 }}>🔒 {d.ssl}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{d.dns}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{d.primary}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{d.checked}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: d.status === "Connected" ? "#E6F8F0" : "#FFF7E4", color: d.status === "Connected" ? "#18B67A" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {d.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Rechecking DNS records for ${d.domain}...`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Recheck DNS →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK DOMAIN ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Domain & SSL Console Actions
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Connect New Custom Domain",
            "Force DNS Record Recheck",
            "Generate SSL Certificate (Let's Encrypt / Wildcard)",
            "Change Primary Organization Domain",
            "View Raw DNS CNAME & A Record Values"
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
