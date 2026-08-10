import React from "react";
import { HardDrive, Download, Plus, Trash2, Archive, Layers } from "lucide-react";

export default function PlatformStoragePage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Platform <span style={{ color: "#D9A928" }}>/</span> Storage
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Global Storage & Bandwidth Allocation
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Monitor global S3 bucket usage, media files, digital certificate archives, backup allocations, and organization storage limits.
            </p>
          </div>

          <button
            onClick={() => alert("Expanding Storage Volume Capacity...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Expand Storage Pool
          </button>
        </div>
      </div>

      {/* STORAGE CAPACITY KPIS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Storage Used", val: "4.2 TB / 10 TB", color: "#111111" },
          { label: "Available Capacity", val: "5.8 TB Available", color: "#18B67A" },
          { label: "Monthly Bandwidth", val: "1.8 TB Egress", color: "#2563EB" },
          { label: "Media Assets", val: "2.4 TB (57%)", color: "#D9A928" },
          { label: "System Backups", val: "1.1 TB (26%)", color: "#707070" },
          { label: "Documents & Certs", val: "700 GB (17%)", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* STORAGE ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Storage Console Actions
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Expand AWS S3 Bucket Capacity",
            "Trigger Automated Temporary File Cleanup",
            "Archive Cold Historical Logs",
            "Generate Storage Quota Audit Report"
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
