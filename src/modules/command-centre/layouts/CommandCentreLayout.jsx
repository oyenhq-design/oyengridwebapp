import React, { useState, useEffect } from "react";
import { Search, Plus, Sparkles, Terminal, Activity, Shield, AlertTriangle } from "lucide-react";

export default function CommandCentreLayout({ children, currentTab, setCurrentTab }) {
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Keyboard shortcut listener: Command/Ctrl + K to open Command Bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandBar(true);
      }
      if (e.key === "Escape") {
        setShowCommandBar(false);
        setShowQuickActions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuGroups = [
    {
      title: "HOME",
      items: [{ id: "Dashboard", label: "Overview" }]
    },
    {
      title: "OPERATIONS",
      items: [
        { id: "Organizations", label: "Organizations" },
        { id: "Users", label: "Users" },
        { id: "Support", label: "Support" }
      ]
    },
    {
      title: "PLATFORM",
      items: [
        { id: "Analytics", label: "Analytics" },
        { id: "Billing", label: "Billing" },
        { id: "AI", label: "AI Command" },
        { id: "FeatureFlags", label: "Feature Flags" }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { id: "Security", label: "Security" },
        { id: "AuditLogs", label: "Audit Logs" },
        { id: "Maintenance", label: "Maintenance" }
      ]
    },
    {
      title: "SETTINGS",
      items: [{ id: "Settings", label: "Settings" }]
    }
  ];

  // All searchable commands for Command Bar
  const commands = [
    { label: "Go to Dashboard", action: () => setCurrentTab("Dashboard"), category: "Navigation" },
    { label: "Go to Organizations", action: () => setCurrentTab("Organizations"), category: "Navigation" },
    { label: "Go to Users", action: () => setCurrentTab("Users"), category: "Navigation" },
    { label: "Go to AI Command", action: () => setCurrentTab("AI"), category: "Navigation" },
    { label: "Go to Feature Flags", action: () => setCurrentTab("FeatureFlags"), category: "Navigation" },
    { label: "Go to Platform Settings", action: () => setCurrentTab("Settings"), category: "Navigation" },
    { label: "Create Organization", action: () => alert("Redirecting to create organization..."), category: "Actions" },
    { label: "Invite Staff Member", action: () => alert("Opening staff invitation window..."), category: "Actions" },
    { label: "Run System Maintenance", action: () => alert("Initiating system maintenance sequence..."), category: "Actions" },
  ];

  const filteredCommands = commands.filter(c =>
    c.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#090909", color: "#F5F2ED", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "#090909", borderRight: "1px solid #1E1E1E", display: "flex", flexDirection: "column", padding: "1.5rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#F5C542" }} />
          <h1 style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", margin: 0, color: "#FFFFFF" }}>
            Command Centre
          </h1>
        </div>

        {/* Search Command Bar Button */}
        <button 
          onClick={() => setShowCommandBar(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px",
            backgroundColor: "#111111", border: "1px solid #1E1E1E",
            color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", marginBottom: "1.5rem",
            textAlign: "left"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Search size={14} />
            <span>Search console...</span>
          </div>
          <span style={{ fontSize: "0.68rem", backgroundColor: "#1E1E1E", padding: "0.1rem 0.35rem", borderRadius: "4px", color: "#AAAAAA" }}>⌘K</span>
        </button>

        {/* Grouped Menu List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1, overflowY: "auto" }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", letterSpacing: "1px", paddingLeft: "0.75rem", marginBottom: "0.3rem" }}>
                {group.title}
              </span>
              {group.items.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    style={{
                      width: "100%", textAlign: "left", padding: "0.55rem 0.75rem", borderRadius: "6px",
                      border: "none", backgroundColor: isActive ? "#111111" : "transparent",
                      color: isActive ? "#F5C542" : "#AAAAAA", fontSize: "0.82rem",
                      fontWeight: isActive ? 700 : 500, cursor: "pointer", transition: "all 0.15s ease"
                    }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <header style={{ height: "65px", backgroundColor: "#090909", borderBottom: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
          <div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#FFFFFF", fontFamily: "'Outfit', sans-serif" }}>OYEN COMMAND CENTRE</h2>
            <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Managing the OYEN Platform</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* Version & Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "#AAAAAA" }}>
              <span style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", padding: "0.2rem 0.5rem", borderRadius: "4px", color: "#6B7280" }}>v1.0.0-beta</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", backgroundColor: "#111111", border: "1px solid #1E1E1E", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                <span style={{ color: "#10B981", fontWeight: 700 }}>99.99% Operational</span>
              </div>
              <span style={{ backgroundColor: "rgba(245, 197, 66, 0.12)", border: "1px solid #F5C542", color: "#F5C542", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                Production Live
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, overflowY: "auto", backgroundColor: "#090909" }}>
          {children}
        </main>
      </div>

      {/* Floating Quick Action Trigger button */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100 }}>
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          style={{
            width: "52px", height: "52px", borderRadius: "50%",
            backgroundColor: "#F5C542", border: "none", color: "#090909",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 15px rgba(245, 197, 66, 0.3)",
            transition: "all 0.2s ease"
          }}
        >
          <Plus size={22} strokeWidth={3} />
        </button>

        {showQuickActions && (
          <div style={{
            position: "absolute", bottom: "60px", right: 0, width: "200px",
            backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)", padding: "0.4rem", display: "flex", flexDirection: "column", gap: "0.25rem"
          }}>
            {[
              "Create Organization",
              "Invite Staff Member",
              "Broadcast Notice",
              "Run Maintenance",
              "Impersonate User",
              "Create Feature Flag"
            ].map(act => (
              <button
                key={act}
                onClick={() => {
                  alert(`Executing action: ${act}`);
                  setShowQuickActions(false);
                }}
                style={{
                  width: "100%", border: "none", background: "none", color: "#AAAAAA",
                  textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "6px",
                  fontSize: "0.78rem", cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1E1E1E"; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#AAAAAA"; }}
              >
                {act}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Command Bar Modal */}
      {showCommandBar && (
        <div 
          onClick={() => setShowCommandBar(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000,
            display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "8vh 2rem"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: "550px", backgroundColor: "#111111", border: "1px solid #1E1E1E",
              borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
              overflow: "hidden", display: "flex", flexDirection: "column"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "1rem", borderBottom: "1px solid #1E1E1E" }}>
              <Search size={18} color="#6B7280" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search commands, tools or navigation..."
                value={commandSearch}
                onChange={e => setCommandSearch(e.target.value)}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#FFFFFF", fontSize: "0.9rem" }}
              />
            </div>
            
            <div style={{ maxHeight: "300px", overflowY: "auto", padding: "0.5rem" }}>
              {filteredCommands.map((c, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    c.action();
                    setShowCommandBar(false);
                  }}
                  style={{
                    padding: "0.65rem 0.85rem", borderRadius: "6px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: "0.82rem", color: "#AAAAAA"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1E1E1E"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#AAAAAA"; }}
                >
                  <span>{c.label}</span>
                  <span style={{ fontSize: "0.68rem", color: "#6B7280", textTransform: "uppercase", fontWeight: 700 }}>{c.category}</span>
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#6B7280", fontSize: "0.8rem" }}>
                  No commands matching "{commandSearch}"
                </div>
              )}
            </div>
            
            <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #1E1E1E", backgroundColor: "#0C0C0C", display: "flex", justifyContent: "flex-end", gap: "1rem", fontSize: "0.68rem", color: "#6B7280" }}>
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
