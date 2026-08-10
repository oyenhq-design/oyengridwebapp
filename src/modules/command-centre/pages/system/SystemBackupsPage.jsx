import React from "react";
import { HardDrive, Download, RefreshCw, Plus, CheckCircle2, ShieldCheck, Database } from "lucide-react";

export default function SystemBackupsPage() {
  const backups = [
    { name: "Full System Database Snapshot (PostgreSQL)", type: "Automated DB Snapshot", size: "42.8 GB", created: "Today @ 03:00 AM", health: "Verified 100% Intact" },
    { name: "Media Assets & S3 Storage Backup", type: "Media Storage", size: "2.4 TB", created: "Yesterday @ 01:00 AM", health: "Verified 100% Intact" },
    { name: "Digital Certificates Ledger Backup", type: "Certificates DB", size: "8.2 GB", created: "Today @ 04:00 AM", health: "Verified 100% Intact" },
    { name: "Pre-Deployment Manual Safety Snapshot", type: "Manual Snapshot", size: "41.5 GB", created: "Aug 08, 2026", health: "Verified 100% Intact" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          System <span style={{ color: "#D9A928" }}>/</span> Backups
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Database Snapshots & Disaster Recovery Backups
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Automated daily PostgreSQL snapshots, media storage backups, point-in-time recovery points, and manual snapshot triggers.
            </p>
          </div>

          <button
            onClick={() => alert("Triggering Manual System Backup...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Create Manual Backup
          </button>
        </div>
      </div>

      {/* BACKUPS DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>SNAPSHOT NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>BACKUP TYPE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ARCHIVE SIZE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CREATED TIMESTAMP</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>BACKUP HEALTH</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((b, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{b.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#D9A928", fontWeight: 600 }}>{b.type}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111", fontFamily: "monospace" }}>{b.size}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{b.created}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#E6F8F0", color: "#18B67A", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    ✓ {b.health}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Initiating point-in-time restore from ${b.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Restore →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
