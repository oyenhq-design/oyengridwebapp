import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronRight, Building, Users, Shield, Cpu, Terminal, DollarSign, Activity, Layers, Settings, Home, BookOpen, CreditCard, BarChart2, ShieldCheck } from "lucide-react";

export default function CommandCentreLayout({ children, currentTab, setCurrentTab }) {
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});

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

  // Executive Navigation Blueprint
  const groups = [
    {
      id: "Company",
      title: "Company",
      icon: <Building size={14} />,
      items: [
        { id: "Company_Headquarters", label: "Headquarters" },
        { id: "Company_Staff", label: "Staff Directory" },
        { id: "Company_Roles", label: "Roles" },
        { id: "Company_Viewers", label: "Viewers" }
      ]
    },
    {
      id: "Organizations",
      title: "Organizations",
      icon: <Building size={14} />,
      items: [
        { id: "Organizations_List", label: "Organizations" },
        { id: "Organizations_Verification", label: "Verification" },
        { id: "Organizations_Domains", label: "Domains" }
      ]
    },
    {
      id: "Customers",
      title: "Customers",
      icon: <Users size={14} />,
      items: [
        { id: "Customers_CRM", label: "CRM" },
        { id: "Customers_Billing", label: "Billing" },
        { id: "Customers_Support", label: "Support" }
      ]
    },
    {
      id: "Programs",
      title: "Programs",
      icon: <BookOpen size={14} />,
      items: [
        { id: "Programs_List", label: "Programs" },
        { id: "Programs_Templates", label: "Templates" },
        { id: "Programs_Certificates", label: "Certificates" }
      ]
    },
    {
      id: "Subscriptions",
      title: "Subscriptions",
      icon: <CreditCard size={14} />,
      items: [
        { id: "Subscriptions_Plans", label: "Plans" },
        { id: "Subscriptions_Revenue", label: "Revenue" },
        { id: "Subscriptions_Payments", label: "Payments" },
        { id: "Subscriptions_Coupons", label: "Coupons" }
      ]
    },
    {
      id: "Platform",
      title: "Platform",
      icon: <Layers size={14} />,
      items: [
        { id: "Platform_Services", label: "Services" },
        { id: "Platform_AI", label: "AI Engine" },
        { id: "Platform_Storage", label: "Storage" },
        { id: "Platform_Notifications", label: "Notifications" }
      ]
    },
    {
      id: "Analytics",
      title: "Analytics",
      icon: <BarChart2 size={14} />,
      items: [
        { id: "Analytics_Revenue", label: "Revenue" },
        { id: "Analytics_Growth", label: "Growth" },
        { id: "Analytics_Engagement", label: "Engagement" },
        { id: "Analytics_Reports", label: "Reports" }
      ]
    },
    {
      id: "Security",
      title: "Security",
      icon: <ShieldCheck size={14} />,
      items: [
        { id: "Security_Audit", label: "Audit Logs" },
        { id: "Security_Access", label: "Access Control" },
        { id: "Security_Compliance", label: "Compliance" }
      ]
    },
    {
      id: "System",
      title: "System",
      icon: <Settings size={14} />,
      items: [
        { id: "System_Integrations", label: "Integrations" },
        { id: "System_Backups", label: "Backups" },
        { id: "System_Settings", label: "Settings" }
      ]
    }
  ];

  const searchCommands = [
    { label: "Go to Executive Overview", action: () => setCurrentTab("Overview"), cat: "Navigation" },
    { label: "Go to Company Headquarters", action: () => setCurrentTab("Company_Headquarters"), cat: "Navigation" },
    { label: "Go to Organizations", action: () => setCurrentTab("Organizations_List"), cat: "Navigation" },
    { label: "Go to Subscriptions & Revenue", action: () => setCurrentTab("Subscriptions_Revenue"), cat: "Navigation" },
    { label: "Go to OYEN AI Engine", action: () => setCurrentTab("Platform_AI"), cat: "Navigation" },
    { label: "Go to Audit Logs", action: () => setCurrentTab("Security_Audit"), cat: "Navigation" },
  ];

  const filteredCommands = searchCommands.filter(c =>
    c.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F4ED", color: "#111111", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar Panel */}
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

        {/* Search trigger */}
        <button 
          onClick={() => setShowCommandBar(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px",
            backgroundColor: "#181818", border: "1px solid #2A2A2A",
            color: "#888888", fontSize: "0.75rem", cursor: "pointer", marginBottom: "1.25rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Search size={13} />
            <span>Search console...</span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "#666666", backgroundColor: "#222222", padding: "0.1rem 0.35rem", borderRadius: "3px" }}>⌘K</span>
        </button>

        {/* Overview item */}
        <button
          onClick={() => setCurrentTab("Overview")}
          style={{
            display: "flex", alignItems: "center", gap: "0.65rem",
            width: "100%", textAlign: "left", padding: "0.55rem 0.75rem", borderRadius: "8px",
            border: "none", backgroundColor: currentTab === "Overview" || currentTab === "Dashboard" ? "#181818" : "transparent",
            color: currentTab === "Overview" || currentTab === "Dashboard" ? "#D9A928" : "#999999", fontSize: "0.82rem",
            fontWeight: currentTab === "Overview" || currentTab === "Dashboard" ? 700 : 500, cursor: "pointer", marginBottom: "0.75rem", transition: "all 0.15s ease"
          }}
        >
          <Home size={15} color={currentTab === "Overview" || currentTab === "Dashboard" ? "#D9A928" : "#666666"} />
          <span>Overview</span>
        </button>

        {/* Collapsible Executive Groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, overflowY: "auto" }}>
          {groups.map((group) => {
            const isCollapsed = collapsedGroups[group.id];
            const isGroupActive = currentTab.startsWith(group.id);
            return (
              <div key={group.id} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", background: "none", border: "none", color: isGroupActive ? "#D9A928" : "#777777",
                    fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.8px", padding: "0.35rem 0.5rem", cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {group.icon}
                    <span>{group.title}</span>
                  </div>
                  {isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                </button>

                {!isCollapsed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", paddingLeft: "0.5rem" }}>
                    {group.items.map((item) => {
                      const isActive = currentTab === item.id || currentTab === group.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setCurrentTab(item.id)}
                          style={{
                            width: "100%", textAlign: "left", padding: "0.4rem 0.75rem", borderRadius: "6px",
                            border: "none", backgroundColor: isActive ? "#181818" : "transparent",
                            color: isActive ? "#D9A928" : "#999999", fontSize: "0.78rem",
                            fontWeight: isActive ? 700 : 500, cursor: "pointer", transition: "all 0.1s"
                          }}
                          onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = "#FFFFFF"; }}
                          onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = "#999999"; }}
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

        {/* Bottom Badge */}
        <div style={{ borderTop: "1px solid #222222", paddingTop: "0.85rem", marginTop: "0.75rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#666666", textTransform: "uppercase", letterSpacing: "0.5px" }}>OYEN GROUP Headquarters</div>
          <div style={{ fontSize: "0.72rem", color: "#AAAAAA", fontWeight: 600, marginTop: "0.15rem" }}>Internal Operations Realm</div>
        </div>
      </aside>

      {/* Main Viewport */}
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
                Ecosystem <strong style={{ color: "#18B67A" }}>● Operational</strong>
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
                  {["Customer Org", "Internal Staff", "Feature Flag", "Security Audit"].map(act => (
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

        {/* Content Viewport */}
        <main style={{ flex: 1, overflowY: "auto", backgroundColor: "#F7F4ED" }}>
          {children}
        </main>
      </div>

      {/* Command Bar Modal */}
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
                placeholder="Search executive modules, orgs, users..."
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
