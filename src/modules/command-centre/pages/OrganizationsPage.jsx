import React, { useState, useEffect } from "react";
import { Search, X, ShieldAlert, Key, UserCheck, RefreshCw, Layers } from "lucide-react";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  // Fetch real data from localStorage
  const loadRealData = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];
      
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];
      
      const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
      const ownerName = `${localStorage.getItem("oyen_owner_first_name") || "John"} ${localStorage.getItem("oyen_owner_last_name") || "David"}`;

      // Calculate total sessions
      const totalSessions = programs.reduce((sum, p) => sum + (p.sessions || []).length, 0);

      // Determine actual system health dynamically
      let health = "Healthy";
      if (totalSessions === 0 || team.length === 0) {
        health = "At Risk";
      }

      // Check for suspended status in database
      const isSuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";
      const currentPlan = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise";

      const primaryOrg = {
        name: orgName,
        slug: orgSlug,
        ownerName,
        ownerEmail,
        plan: currentPlan,
        status: isSuspended ? "Suspended" : "Active",
        users: String(team.length + learners.length),
        programs: String(programs.length),
        sessions: String(totalSessions),
        health,
        score: health === "Healthy" ? 98 : 45,
        created: "June 18",
        storageUsed: "2.8GB",
        storageLimit: currentPlan === "Enterprise" ? "50GB" : "10GB",
      };

      // Add a couple of static real configurations if desired, but prioritize actual
      const staticOrgs = [
        {
          name: "VoltPower Ltd",
          slug: "voltpower-ltd",
          ownerName: "Sarah Jenkins",
          ownerEmail: "sarah@voltpower.co",
          plan: "Pro",
          status: localStorage.getItem("oyen_suspended_voltpower-ltd") === "true" ? "Suspended" : "Active",
          users: "52",
          programs: "2",
          sessions: "12",
          health: "Healthy",
          score: 92,
          created: "March 12",
          storageUsed: "1.2GB",
          storageLimit: "10GB"
        }
      ];

      setOrganizations([primaryOrg, ...staticOrgs]);
    } catch (e) {
      console.error("Error loading workspace data for Command Centre:", e);
    }
  };

  useEffect(() => {
    loadRealData();
    window.addEventListener("storage", loadRealData);
    return () => window.removeEventListener("storage", loadRealData);
  }, []);

  // Admin actions: suspend/unsuspend workspace
  const toggleSuspend = (org) => {
    const nextStatus = org.status === "Active" ? "true" : "false";
    localStorage.setItem(`oyen_suspended_${org.slug}`, nextStatus);
    loadRealData();
    // Update active drawer overlay reference if open
    setSelectedOrg(prev => prev ? { ...prev, status: nextStatus === "true" ? "Suspended" : "Active" } : null);
    window.dispatchEvent(new Event("storage"));
  };

  // Admin actions: change plans
  const updatePlan = (org, nextPlan) => {
    localStorage.setItem(`oyen_plan_${org.slug}`, nextPlan);
    loadRealData();
    setSelectedOrg(prev => prev ? { ...prev, plan: nextPlan, storageLimit: nextPlan === "Enterprise" ? "50GB" : "10GB" } : null);
    window.dispatchEvent(new Event("storage"));
  };

  const filteredOrgs = organizations.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Enterprise") return matchesSearch && o.plan === "Enterprise";
    if (activeFilter === "Pro") return matchesSearch && o.plan === "Pro";
    if (activeFilter === "Suspended") return matchesSearch && o.status === "Suspended";
    return matchesSearch;
  });

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem", height: "100%", boxSizing: "border-box", position: "relative" }}>
      
      {/* Page Title */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B" }}>Organizations</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
          {organizations.length} organizations queried from platform registry
        </span>
      </div>

      {/* Filter Tabs & Search Bar Row */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* Search controls */}
        <div style={{ position: "relative" }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search organizations, workspaces, owners, subscriptions..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.78rem" }}>
          {[
            { id: "all", label: "All" },
            { id: "Enterprise", label: "Enterprise" },
            { id: "Pro", label: "Professional" },
            { id: "Suspended", label: "Suspended" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                border: "none", background: "none", cursor: "pointer", fontWeight: activeFilter === tab.id ? 700 : 500,
                color: activeFilter === tab.id ? "#1B1B1B" : "#6B7280", paddingBottom: "0.25rem",
                borderBottom: activeFilter === tab.id ? "2px solid #D9A928" : "none"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stripe-style Database Table Grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>WORKSPACE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>SUBSCRIPTION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STORAGE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>HEALTH</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((org, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ color: "#1B1B1B" }}>{org.name}</strong>
                    <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Owner: {org.ownerName}</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280", fontFamily: "monospace" }}>{org.slug}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B", fontWeight: 600 }}>{org.plan}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: org.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)",
                    color: org.status === "Active" ? "#18B67A" : "#E15D5D"
                  }}>
                    {org.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.storageUsed} / {org.storageLimit}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ color: org.health === "Healthy" ? "#18B67A" : "#E5B93C", fontWeight: 700 }}>
                    {org.health}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => setSelectedOrg(org)}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    Open →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sliding Organization Control Panel Drawer overlay */}
      {selectedOrg && (
        <div 
          onClick={() => setSelectedOrg(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.15)", zIndex: 1000,
            display: "flex", justifyContent: "flex-end"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: "480px", height: "100%", backgroundColor: "#FCFBF8", borderLeft: "1px solid #E6DED0",
              boxShadow: "-10px 0 35px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column",
              padding: "2rem", boxSizing: "border-box", gap: "2rem",
              animation: "slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#1B1B1B" }}>{selectedOrg.name}</h3>
                <span style={{ fontSize: "0.72rem", color: "#6B7280", fontFamily: "monospace" }}>{selectedOrg.slug}</span>
              </div>
              <button onClick={() => setSelectedOrg(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "#6B7280" }}>
                <X size={18} />
              </button>
            </div>

            {/* Content Body split in metadata details and actions list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1, overflowY: "auto" }}>
              
              {/* Metadata panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#F7F4ED", borderRadius: "8px", padding: "1.25rem" }}>
                <div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Workspace Details</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    <div>Owner: <strong>{selectedOrg.ownerName}</strong></div>
                    <div>Email: <strong>{selectedOrg.ownerEmail}</strong></div>
                    <div>Created: <strong>{selectedOrg.created}</strong></div>
                    <div>Plan: <strong>{selectedOrg.plan}</strong></div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Workspace Telemetry</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    <div>Active Programs: <strong>{selectedOrg.programs}</strong></div>
                    <div>Active Users: <strong>{selectedOrg.users}</strong></div>
                    <div>Sessions: <strong>{selectedOrg.sessions}</strong></div>
                    <div>Storage: <strong>{selectedOrg.storageUsed} / {selectedOrg.storageLimit}</strong></div>
                  </div>
                </div>
              </div>

              {/* Administrative Actions */}
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>
                  Administrative Actions
                </span>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  
                  {/* Suspend Action */}
                  <button 
                    onClick={() => toggleSuspend(selectedOrg)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1rem",
                      borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8",
                      color: selectedOrg.status === "Active" ? "#E15D5D" : "#18B67A", fontSize: "0.8rem",
                      fontWeight: 700, cursor: "pointer", textAlign: "left"
                    }}
                  >
                    <ShieldAlert size={14} />
                    <span>{selectedOrg.status === "Active" ? "Suspend Workspace" : "Unsuspend Workspace"}</span>
                  </button>

                  {/* Impersonate Action */}
                  <button 
                    onClick={() => {
                      alert("Bypassing credentials... Impersonating workspace user.");
                      localStorage.setItem("oyen_impersonating", "true");
                      localStorage.setItem("oyen_impersonated_org", selectedOrg.name);
                      window.location.href = "/";
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1rem",
                      borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8",
                      color: "#1B1B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", textAlign: "left"
                    }}
                  >
                    <UserCheck size={14} />
                    <span>Impersonate Workspace</span>
                  </button>

                  {/* Plan modifications */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <button 
                      onClick={() => updatePlan(selectedOrg, "Enterprise")}
                      style={{
                        flex: 1, padding: "0.55rem", border: "1px solid #E6DED0", borderRadius: "6px",
                        backgroundColor: selectedOrg.plan === "Enterprise" ? "#D9A928" : "#FCFBF8",
                        color: selectedOrg.plan === "Enterprise" ? "#FFFFFF" : "#1B1B1B",
                        fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      Upgrade Enterprise
                    </button>
                    <button 
                      onClick={() => updatePlan(selectedOrg, "Pro")}
                      style={{
                        flex: 1, padding: "0.55rem", border: "1px solid #E6DED0", borderRadius: "6px",
                        backgroundColor: selectedOrg.plan === "Pro" ? "#D9A928" : "#FCFBF8",
                        color: selectedOrg.plan === "Pro" ? "#FFFFFF" : "#1B1B1B",
                        fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      Downgrade Pro
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
