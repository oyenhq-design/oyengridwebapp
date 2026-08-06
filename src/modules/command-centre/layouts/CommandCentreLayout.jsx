import React from "react";

export default function CommandCentreLayout({ children, currentTab, setCurrentTab }) {
  const sidebarItems = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Organizations", label: "Organizations" },
    { id: "Users", label: "Users" },
    { id: "Billing", label: "Billing" },
    { id: "Analytics", label: "Analytics" },
    { id: "Support", label: "Support" },
    { id: "AI", label: "OYEN AI" },
    { id: "Security", label: "Security" },
    { id: "AuditLogs", label: "Audit Logs" },
    { id: "FeatureFlags", label: "Feature Flags" },
    { id: "Maintenance", label: "Maintenance" },
    { id: "Settings", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0C0C0C", color: "#F5F2ED", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "240px", backgroundColor: "#111111", borderRight: "1px solid #222222", display: "flex", flexDirection: "column", padding: "1.5rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#D9B233" }} />
          <h1 style={{ fontSize: "0.95rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px", margin: 0, color: "#FFFDF9" }}>
            Command Centre
          </h1>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          {sidebarItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isActive ? "#222222" : "transparent",
                  color: isActive ? "#D9B233" : "#AAAAAA",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ height: "60px", backgroundColor: "#111111", borderBottom: "1px solid #222222", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Current Workspace:</span>
            <strong style={{ fontSize: "0.8rem", color: "#F5F2ED" }}>OYEN Group HQ</strong>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span style={{ fontSize: "0.72rem", color: "#10B981", fontWeight: 600 }}>Active Connection</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#AAAAAA" }}>ops@oyen.group</span>
            <span style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "4px", backgroundColor: "#222222", border: "1px solid #333333", color: "#D9B233", fontWeight: 700 }}>
              OPERATIONS STAFF
            </span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main style={{ flex: 1, overflowY: "auto", backgroundColor: "#0C0C0C" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
