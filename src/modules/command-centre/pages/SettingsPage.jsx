import React from "react";
import { Settings, Plus } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Platform Settings</h3>
        <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Manage global configuration parameters for the OYEN GRID ecosystem</span>
      </div>

      {/* Premium Empty State */}
      <div 
        style={{
          border: "1px dashed #1E1E1E", borderRadius: "10px", padding: "4rem 2rem",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", backgroundColor: "#111111", gap: "1rem", marginTop: "1rem"
        }}
      >
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5C542" }}>
          <Settings size={22} />
        </div>
        <div>
          <h4 style={{ margin: "0 0 0.25rem 0", color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem" }}>No configuration created</h4>
          <p style={{ margin: 0, color: "#6B7280", fontSize: "0.78rem" }}>Configure system variables, database connection thresholds, and global cache controls.</p>
        </div>
        <button 
          onClick={() => alert("Creating configuration...")}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem",
            backgroundColor: "#F5C542", border: "none", borderRadius: "6px", color: "#090909",
            fontWeight: 700, fontSize: "0.8rem", cursor: "pointer"
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Create Configuration</span>
        </button>
      </div>

    </div>
  );
}
