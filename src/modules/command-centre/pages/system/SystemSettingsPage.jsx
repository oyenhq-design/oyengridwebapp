import React, { useState } from "react";
import { Settings, ShieldCheck, AlertTriangle, Save, RefreshCw, Power } from "lucide-react";

export default function SystemSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          System <span style={{ color: "#D9A928" }}>/</span> Settings
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Global Infrastructure Settings & Master Policies
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Restricted configuration console for Founders and Super Administrators. Every edit creates an immutable Audit Log entry.
            </p>
          </div>

          <button
            onClick={() => {
              setMaintenanceMode(!maintenanceMode);
              alert(`Maintenance Mode set to: ${!maintenanceMode ? "ENABLED" : "DISABLED"} (Audit logged)`);
            }}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: maintenanceMode ? "#EF4444" : "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: maintenanceMode ? "#FFFFFF" : "#111111"
            }}
          >
            <Power size={14} /> {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
          </button>
        </div>
      </div>

      {/* SUPER ADMIN NOTICE BANNER */}
      <div style={{ backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", borderRadius: "8px", padding: "0.85rem 1.25rem", fontSize: "0.78rem", color: "#D9A928", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>🔒</span> <strong>Founders & Super Admin Access Only:</strong> Modifications here directly govern global platform behavior and will trigger immediate security compliance alerts.
      </div>

      {/* GLOBAL CONFIGURATION SECTIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Platform Identity & Regional Defaults
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginBottom: "0.25rem" }}>Platform Title</label>
              <input type="text" defaultValue="OYEN GRID Enterprise Platform" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem", fontWeight: 600 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginBottom: "0.25rem" }}>Primary Timezone</label>
              <input type="text" defaultValue="Africa/Lagos (WAT) / UTC+1" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem", fontWeight: 600 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginBottom: "0.25rem" }}>Default Language</label>
              <input type="text" defaultValue="English (UK / Global Standard)" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem", fontWeight: 600 }} />
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            AI & Storage Quotas Defaults
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginBottom: "0.25rem" }}>Default Organization AI Token Limit</label>
              <input type="text" defaultValue="250,000 Tokens / Month" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem", fontWeight: 600 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginBottom: "0.25rem" }}>Default Storage Cap Per Workspace</label>
              <input type="text" defaultValue="500 GB S3 Allocation" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem", fontWeight: 600 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginBottom: "0.25rem" }}>Password Security Policy</label>
              <input type="text" defaultValue="Enterprise Strict (12+ Chars, MFA Enforced)" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.82rem", fontWeight: 600 }} />
            </div>
          </div>
        </section>
      </div>

      {/* SAVE BUTTON */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => alert("Master platform settings updated & Audit Logged.")}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem",
            backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
            fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
          }}
        >
          <Save size={15} /> Save Platform Configuration
        </button>
      </div>

    </div>
  );
}
