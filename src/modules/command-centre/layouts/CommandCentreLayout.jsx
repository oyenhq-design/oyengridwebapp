import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronRight, Building, Users, Shield, Cpu, Terminal, DollarSign, Activity, Layers, Settings, Home, Award, BarChart2, FolderCheck, CreditCard } from "lucide-react";

export default function CommandCentreLayout({ children, currentTab, setCurrentTab }) {
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [openGroup, setOpenGroup] = useState("Company");

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

  // Executive Domain Navigation Tree
  const navDomains = [
    { 
      id: "Overview", 
      label: "Overview", 
      icon: <Home size={15} />,
      subpages: []
    },
    { 
      id: "Company", 
      label: "Company", 
      icon: <Building size={15} />,
      subpages: ["Headquarters", "Staff", "Roles", "Viewers"]
    },
    { 
      id: "Organizations", 
      label: "Organizations", 
      icon: <Layers size={15} />,
      subpages: ["Organizations", "Verification", "Domains"]
    },
    { 
      id: "Customers", 
      label: "Customers", 
      icon: <Users size={15} />,
      subpages: ["CRM", "Billing", "Support"]
    },
    { 
      id: "Programs", 
      label: "Programs", 
      icon: <FolderCheck size={15} />,
      subpages: ["Programs", "Templates", "Certificates"]
    },
    { 
      id: "Subscriptions", 
      label: "Subscriptions", 
      icon: <CreditCard size={15} />,
      subpages: ["Plans", "Revenue", "Payments", "Coupons"]
    },
    { 
      id: "Platform", 
      label: "Platform", 
      icon: <Cpu size={15} />,
      subpages: ["Services", "AI", "Storage", "Notifications"]
    },
    { 
      id: "Analytics", 
      label: "Analytics", 
      icon: <BarChart2 size={15} />,
      subpages: ["Revenue", "Growth", "Engagement", "Reports"]
    },
    { 
      id: "Security", 
      label: "Security", 
      icon: <Shield size={15} />,
      subpages: ["Audit Logs", "Access", "Compliance"]
    },
    { 
      id: "System", 
      label: "System", 
      icon: <Settings size={15} />,
      subpages: ["Integrations", "Backups", "Settings"]
    },
  ];

  const searchCommands = [
    { label: "Go to Executive Overview", action: () => setCurrentTab("Overview"), cat: "Navigation" },
    { label: "Go to Company HQ & Staff", action: () => setCurrentTab("Company"), cat: "Navigation" },
    { label: "Go to Customer Organizations", action: () => setCurrentTab("Organizations"), cat: "Navigation" },
    { label: "Go to Customer Success CRM", action: () => setCurrentTab("Customers"), cat: "Navigation" },
    { label: "Go to Programs & Templates", action: () => setCurrentTab("Programs"), cat: "Navigation" },
    { label: "Go to Subscriptions & Revenue", action: () => setCurrentTab("Subscriptions"), cat: "Navigation" },
    { label: "Go to Platform AI & Services", action: () => setCurrentTab("Platform"), cat: "Navigation" },
    { label: "Go to Executive Analytics", action: () => setCurrentTab("Analytics"), cat: "Navigation" },
    { label: "Go to Security & Compliance", action: () => setCurrentTab("Security"), cat: "Navigation" },
    { label: "Go to System Configuration", action: () => setCurrentTab("System"), cat: "Navigation" },
  ];

  const filteredCommands = searchCommands.filter(c =>
    c.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F4ED", color: "#111111", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar (Dark Panel) */}
      <aside style={{ width: "260px", backgroundColor: "#101010", borderRight: "1px solid #E6DED0", display: "flex", flexDirection: "column", padding: "1.5rem 1.1rem", boxSizing: "border-box" }}>
        
        {/* Logo header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", cursor: "pointer", paddingLeft: "0.25rem" }} onClick={() => setCurrentTab("Overview")}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#D9A928" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
              COMMAND CENTRE
            </span>
            <span style={{ fontSize: "0.65rem", color: "#888888", fontWeight: 600, letterSpacing: "0.5px" }}>
              OYEN GROUP OS v2.0
            </span>
          </div>
        </div>

        {/* Linear style search trigger */}
        <button 
          onClick={() => setShowCommandBar(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px",
            backgroundColor: "#181818", border: "1px solid #2A2A2A",
            color: "#888888", fontSize: "0.75rem", cursor: "pointer", marginBottom: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Search size={13} />
            <span>Search Command Centre...</span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "#666666", backgroundColor: "#222222", padding: "0.1rem 0.35rem", borderRadius: "3px" }}>⌘K</span>
        </button>

        {/* Executive Domain Tree */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#555555", textTransform: "uppercase", letterSpacing: "1px", padding: "0.25rem 0.6rem", marginBottom: "0.25rem" }}>
            Executive Headquarters
          </div>

          {navDomains.map((domain) => {
            const isActive = currentTab === domain.id || (currentTab === "Dashboard" && domain.id === "Overview");
            const isOpen = openGroup === domain.id;
            const hasSubpages = domain.subpages.length > 0;

            return (
              <div key={domain.id} style={{ display: "flex", flexDirection: "column" }}>
                <button
                  onClick={() => {
                    setCurrentTab(domain.id);
                    if (hasSubpages) setOpenGroup(isOpen ? null : domain.id);
                  }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", textAlign: "left", padding: "0.55rem 0.75rem", borderRadius: "8px",
                    border: "none", backgroundColor: isActive ? "#181818" : "transparent",
                    color: isActive ? "#D9A928" : "#999999", fontSize: "0.82rem",
                    fontWeight: isActive ? 700 : 500, cursor: "pointer", transition: "all 0.15s ease"
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = "#999999"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ color: isActive ? "#D9A928" : "#666666" }}>{domain.icon}</span>
                    <span>{domain.label}</span>
                  </div>
                  {hasSubpages && (
                    <span style={{ opacity: 0.6 }}>
                      {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                  )}
                </button>

                {/* Subpages list */}
                {hasSubpages && isOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", paddingLeft: "2rem", marginTop: "0.2rem", marginBottom: "0.4rem" }}>
                    {domain.subpages.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setCurrentTab(domain.id)}
                        style={{
                          border: "none", background: "none", color: "#777777", fontSize: "0.75rem",
                          textAlign: "left", padding: "0.25rem 0.5rem", borderRadius: "4px", cursor: "pointer"
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                        onMouseLeave={e => e.currentTarget.style.color = "#777777"}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Workspace Separator Badge */}
        <div style={{ borderTop: "1px solid #222222", paddingTop: "1rem", marginTop: "1rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#666666", textTransform: "uppercase", letterSpacing: "0.5px" }}>OYEN GROUP Headquarters</div>
          <div style={{ fontSize: "0.72rem", color: "#AAAAAA", fontWeight: 600, marginTop: "0.15rem" }}>Executive Command Realm</div>
        </div>
      </aside>

      {/* Main OS Viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <header style={{ height: "64px", backgroundColor: "#FCFBF8", borderBottom: "1px solid #E6DED0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", boxSizing: "border-box" }}>
          <div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              OYEN GROUP Command Centre
            </h2>
            <span style={{ fontSize: "0.68rem", color: "#707070" }}>Enterprise Executive Headquarters</span>
          </div>

          {/* System Status Pills & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.68rem" }}>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>Production</span>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                Platform <strong style={{ color: "#18B67A" }}>● Operational</strong>
              </span>
              <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                AI Engine <strong style={{ color: "#18B67A" }}>● Online</strong>
              </span>
            </div>

            {/* + Action Dropdown */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.85rem",
                  backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF",
                  fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", outline: "none"
                }}
              >
                <span>+ Create</span>
                <ChevronDown size={12} />
              </button>

              {showDropdown && (
                <div style={{
                  position: "absolute", top: "38px", right: 0, width: "170px",
                  backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)", zIndex: 100, padding: "0.35rem", display: "flex", flexDirection: "column"
                }}>
                  {["Customer Org", "Internal Employee", "Feature Flag", "Security Audit"].map(act => (
                    <button
                      key={act}
                      onClick={() => {
                        alert(`Action triggered: ${act}`);
                        setShowDropdown(false);
                      }}
                      style={{
                        border: "none", background: "none", color: "#111111", fontSize: "0.78rem",
                        padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px", fontWeight: 500
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F7F4ED"}
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

        {/* Main Content Viewport */}
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
            backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1000,
            display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "8vh 2rem"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: "550px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0",
              borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              overflow: "hidden", display: "flex", flexDirection: "column"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "1rem 1.25rem", borderBottom: "1px solid #E6DED0" }}>
              <Search size={18} color="#707070" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search modules, customer orgs, staff, logs..."
                value={commandSearch}
                onChange={e => setCommandSearch(e.target.value)}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#111111", fontSize: "0.9rem" }}
              />
            </div>
            
            <div style={{ maxHeight: "320px", overflowY: "auto", padding: "0.5rem" }}>
              {filteredCommands.map((c, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    c.action();
                    setShowCommandBar(false);
                  }}
                  style={{
                    padding: "0.7rem 0.9rem", borderRadius: "6px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: "0.82rem", color: "#111111"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#F7F4ED"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span>{c.label}</span>
                  <span style={{ fontSize: "0.68rem", color: "#707070", textTransform: "uppercase", fontWeight: 700 }}>{c.cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
