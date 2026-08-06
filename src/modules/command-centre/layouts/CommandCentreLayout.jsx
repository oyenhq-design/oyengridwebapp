import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

export default function CommandCentreLayout({ children, currentTab, setCurrentTab }) {
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Collapsible navigation groups
  const [collapsedGroups, setCollapsedGroups] = useState({
    Operations: false,
    Platform: false,
    Infrastructure: false,
    Development: false,
    Company: false,
  });

  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandBar(true);
      }
      if (e.key === "Escape") {
        setShowCommandBar(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groups = [
    {
      id: "Operations",
      title: "Operations",
      items: [
        { id: "Organizations", label: "Organizations" },
        { id: "Workspaces", label: "Workspaces" },
        { id: "Users", label: "Users" },
        { id: "Support", label: "Support" }
      ]
    },
    {
      id: "Platform",
      title: "Platform",
      items: [
        { id: "Analytics", label: "Analytics" },
        { id: "Billing", label: "Billing" },
        { id: "AI", label: "AI Command" },
        { id: "FeatureFlags", label: "Feature Flags" }
      ]
    },
    {
      id: "Infrastructure",
      title: "Infrastructure",
      items: [
        { id: "Security", label: "Security" },
        { id: "AuditLogs", label: "Audit Logs" },
        { id: "Maintenance", label: "Maintenance" }
      ]
    },
    {
      id: "Development",
      title: "Development",
      items: [
        { id: "Releases", label: "Releases" },
        { id: "Deployments", label: "Deployments" },
        { id: "Experiments", label: "Experiments" }
      ]
    },
    {
      id: "Company",
      title: "Company",
      items: [
        { id: "Team", label: "Team" },
        { id: "APIKeys", label: "API Keys" },
        { id: "Settings", label: "Settings" }
      ]
    }
  ];

  const searchCommands = [
    { label: "Go to Dashboard", action: () => setCurrentTab("Dashboard"), cat: "Navigation" },
    { label: "Go to Organizations", action: () => setCurrentTab("Organizations"), cat: "Navigation" },
    { label: "Go to Settings", action: () => setCurrentTab("Settings"), cat: "Navigation" },
  ];

  const filteredCommands = searchCommands.filter(c =>
    c.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar (Dark Panel) */}
      <aside style={{ width: "250px", backgroundColor: "#101010", borderRight: "1px solid #E6DED0", display: "flex", flexDirection: "column", padding: "1.75rem 1.25rem", boxSizing: "border-box" }}>
        
        {/* Logo header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem", cursor: "pointer" }} onClick={() => setCurrentTab("Dashboard")}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D9A928" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px", color: "#ffffff" }}>
            Command Centre
          </span>
        </div>

        {/* Linear style search trigger */}
        <button 
          onClick={() => setShowCommandBar(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px",
            backgroundColor: "#181818", border: "1px solid #2A2A2A",
            color: "#6B7280", fontSize: "0.75rem", cursor: "pointer", marginBottom: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Search size={13} />
            <span>Search console...</span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "#6B7280" }}>⌘K</span>
        </button>

        {/* Collapsible Menu items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto" }}>
          <button
            onClick={() => setCurrentTab("Dashboard")}
            style={{
              width: "100%", textAlign: "left", padding: "0.45rem 0.75rem", borderRadius: "6px",
              border: "none", backgroundColor: currentTab === "Dashboard" ? "#181818" : "transparent",
              color: currentTab === "Dashboard" ? "#D9A928" : "#AAAAAA", fontSize: "0.78rem",
              fontWeight: currentTab === "Dashboard" ? 700 : 500, cursor: "pointer"
            }}
          >
            Overview
          </button>

          {groups.map((group) => {
            const isCollapsed = collapsedGroups[group.id];
            return (
              <div key={group.id} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", background: "none", border: "none", color: "#6B7280",
                    fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.8px", padding: "0.25rem 0.5rem", cursor: "pointer"
                  }}
                >
                  <span>{group.title}</span>
                  {isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                </button>

                {!isCollapsed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", paddingLeft: "0.5rem" }}>
                    {group.items.map((item) => {
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setCurrentTab(item.id)}
                          style={{
                            width: "100%", textAlign: "left", padding: "0.4rem 0.75rem", borderRadius: "6px",
                            border: "none", backgroundColor: isActive ? "#181818" : "transparent",
                            color: isActive ? "#D9A928" : "#888888", fontSize: "0.78rem",
                            fontWeight: isActive ? 700 : 500, cursor: "pointer", transition: "all 0.1s"
                          }}
                          onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = "#FFFFFF"; }}
                          onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = "#888888"; }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main OS Viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header (Vercel style status pills) */}
        <header style={{ height: "65px", backgroundColor: "#FDFBF7", borderBottom: "1px solid #E6DED0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", boxSizing: "border-box" }}>
          <div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>OYEN Command Centre</h2>
            <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Internal Platform Operations</span>
          </div>

          {/* Vercel Status Pills & Dropdown Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.68rem" }}>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.45rem", borderRadius: "4px" }}>Production</span>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.45rem", borderRadius: "4px" }}>
                API <strong style={{ color: "#18B67A" }}>● Healthy</strong>
              </span>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.45rem", borderRadius: "4px" }}>
                Workers <strong style={{ color: "#E5B93C" }}>● 2 Delayed</strong>
              </span>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.45rem", borderRadius: "4px" }}>
                Database <strong style={{ color: "#18B67A" }}>● Healthy</strong>
              </span>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.45rem", borderRadius: "4px" }}>
                AI <strong style={{ color: "#E5B93C" }}>● Elevated</strong>
              </span>
            </div>

            {/* + New Dropdown */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.85rem",
                  backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF",
                  fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", outline: "none"
                }}
              >
                <span>+ New</span>
                <ChevronDown size={12} />
              </button>

              {showDropdown && (
                <div style={{
                  position: "absolute", top: "35px", right: 0, width: "160px",
                  backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)", zIndex: 100, padding: "0.25rem", display: "flex", flexDirection: "column"
                }}>
                  {["Workspace", "Organization", "Feature Flag", "Experiment", "Admin User"].map(act => (
                    <button
                      key={act}
                      onClick={() => {
                        alert(`Creating: ${act}`);
                        setShowDropdown(false);
                      }}
                      style={{
                        border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem",
                        padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Pane */}
        <main style={{ flex: 1, overflowY: "auto", backgroundColor: "#F7F4ED" }}>
          {children}
        </main>
      </div>

      {/* Command Bar console modal */}
      {showCommandBar && (
        <div 
          onClick={() => setShowCommandBar(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1000,
            display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "8vh 2rem"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: "550px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0",
              borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              overflow: "hidden", display: "flex", flexDirection: "column"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "1rem", borderBottom: "1px solid #E6DED0" }}>
              <Search size={18} color="#6B7280" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search organizations, users, workspaces, logs..."
                value={commandSearch}
                onChange={e => setCommandSearch(e.target.value)}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#1B1B1B", fontSize: "0.9rem" }}
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
                    fontSize: "0.82rem", color: "#1B1B1B"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FFF7E4"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span>{c.label}</span>
                  <span style={{ fontSize: "0.68rem", color: "#6B7280", textTransform: "uppercase", fontWeight: 700 }}>{c.cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
