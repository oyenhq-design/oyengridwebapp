import React from "react";
import { Settings, Plus } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#1B1B1B" }}>Platform Settings</h3>
        <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Manage global configuration parameters for the OYEN GRID ecosystem</span>
      </div>

      {/* Premium Empty State */}
      <div 
        style={{
          border: "1px dashed #E6DED0", borderRadius: "10px", padding: "4rem 2rem",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", backgroundColor: "#FCFBF8", gap: "1rem", marginTop: "1rem"
        }}
      >
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#F7F4ED", display: "flex", alignItems: "center", justifyContent: "center", color: "#D9A928" }}>
          <Settings size={22} />
        </div>
        <div>
          <h4 style={{ margin: "0 0 0.25rem 0", color: "#1B1B1B", fontWeight: 700, fontSize: "0.9rem" }}>No configuration created</h4>
          <p style={{ margin: 0, color: "#6B7280", fontSize: "0.78rem" }}>Configure system variables, database connection thresholds, and global cache controls.</p>
        </div>
        <button 
          onClick={() => alert("Creating configuration...")}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem",
            backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF",
            fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", outline: "none"
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Create Configuration</span>
        </button>
      </div>

    </div>
  );
}
