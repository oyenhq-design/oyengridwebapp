import React, { useState, useEffect } from "react";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState({});

  const loadDatabase = () => {
    try {
      setPermissions({
        "Organizations": ["Read", "Create", "Manage Settings"],
        "Workspaces": ["Read", "Archive", "Override Limits"],
        "Security": ["Read SOC", "Terminate Session", "IP Block"],
        "Deployments": ["Trigger Build", "Rollback Release"]
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Permissions Matrix</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage internal corporate permissions, system modules, and accessible actions.</span>
      </div>

      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px" }}>
          System Permissions Registry Matrix
        </span>
        {Object.keys(permissions).map(cat => (
          <div key={cat} style={{ borderBottom: "1px solid #E6DED0", paddingBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
            <strong>{cat} Rules</strong>
            <span style={{ color: "#6B7280" }}>{permissions[cat].join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
