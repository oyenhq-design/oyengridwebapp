import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ShieldAlert, Key, UserCheck, HardDrive, Settings, HelpCircle, Activity, Globe, Palette } from "lucide-react";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeProfileId, setActiveProfileId] = useState(null); // When null: show list. Otherwise: show profile.
  const [profileTab, setProfileTab] = useState("Overview");
  
  const [organizations, setOrganizations] = useState([]);
  const [rawState, setRawState] = useState({
    programs: [],
    team: [],
    learners: []
  });

  const loadDatabase = () => {
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
      const ownerName = `${localStorage.getItem("oyen_owner_first_name") || "Shola"} ${localStorage.getItem("oyen_owner_last_name") || "Oyewole"}`;

      setRawState({ programs, team, learners });

      const isSuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";
      const currentPlan = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise Trial";

      const totalSessions = programs.reduce((sum, p) => sum + (p.sessions || []).length, 0);
      const totalResources = programs.reduce((sum, p) => sum + (p.resources || []).length, 0);

      // Compute dynamic health metrics
      const healthReason = [];
      if (isSuspended) {
        healthReason.push("⚠ Workspace is currently suspended");
      } else {
        healthReason.push("✓ Workspace Active");
        if (team.length > 0) healthReason.push("✓ Active Staff Present");
        if (programs.length > 0) healthReason.push("✓ Active Programs Sourced");
        if (totalSessions === 0) healthReason.push("⚠ No Session Scheduled in 21 days");
      }

      const primaryOrg = {
        id: "org_x82D93",
        name: orgName,
        slug: orgSlug,
        ownerName,
        ownerEmail,
        plan: currentPlan,
        status: isSuspended ? "Suspended" : "Active",
        users: String(team.length + learners.length),
        programs: String(programs.length),
        sessions: String(totalSessions),
        resources: String(totalResources),
        storageUsed: `${34 + totalResources * 2}MB`,
        storageLimit: currentPlan.includes("Enterprise") ? "50GB" : "10GB",
        created: "June 12, 2026",
        health: isSuspended ? "At Risk" : (totalSessions > 0 ? "Good" : "Warning"),
        healthReasons: healthReason,
        lastLogin: "Today, 10:14 AM",
        lastActivity: "2 minutes ago"
      };

      const voltPowerSuspended = localStorage.getItem("oyen_suspended_voltpower-ltd") === "true";
      const voltPowerPlan = localStorage.getItem("oyen_plan_voltpower-ltd") || "Pro";
      
      const secondaryOrg = {
        id: "org_z11B94",
        name: "VoltPower Ltd",
        slug: "voltpower-ltd",
        ownerName: "Sarah Jenkins",
        ownerEmail: "sarah@voltpower.co",
        plan: voltPowerPlan,
        status: voltPowerSuspended ? "Suspended" : "Active",
        users: "52",
        programs: "2",
        sessions: "12",
        resources: "6",
        storageUsed: "1.2GB",
        storageLimit: voltPowerPlan.includes("Enterprise") ? "50GB" : "10GB",
        created: "March 12, 2026",
        health: voltPowerSuspended ? "At Risk" : "Good",
        healthReasons: voltPowerSuspended ? ["⚠ Workspace Suspended"] : ["✓ Workspace Active", "✓ Stable Revenue"],
        lastLogin: "Yesterday, 4:30 PM",
        lastActivity: "1 day ago"
      };

      setOrganizations([primaryOrg, secondaryOrg]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleToggleSuspend = (org) => {
    const nextStatus = org.status === "Active" ? "true" : "false";
    localStorage.setItem(`oyen_suspended_${org.slug}`, nextStatus);
    loadDatabase();
    window.dispatchEvent(new Event("storage"));
  };

  const handleUpdatePlan = (org, plan) => {
    localStorage.setItem(`oyen_plan_${org.slug}`, plan);
    loadDatabase();
    window.dispatchEvent(new Event("storage"));
  };

  const handleImpersonate = (org) => {
    alert(`Bypassing auth security: Impersonating ${org.ownerName} (${org.ownerEmail})`);
    localStorage.setItem("oyen_impersonating", "true");
    localStorage.setItem("oyen_impersonated_org", org.name);
    window.location.href = "/";
  };

  const activeOrg = organizations.find(o => o.id === activeProfileId);

  const filteredOrgs = organizations.filter(o => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = o.name.toLowerCase().includes(query) ||
                          o.ownerEmail.toLowerCase().includes(query) ||
                          o.slug.toLowerCase().includes(query) ||
                          o.plan.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Active") return matchesSearch && o.status === "Active";
    if (activeFilter === "Suspended") return matchesSearch && o.status === "Suspended";
    return matchesSearch;
  });

  // Render detail dashboard for organization profile
  if (activeOrg) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveProfileId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Organizations</span>
        </button>

        {/* Profile Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeOrg.name}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeOrg.plan}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: activeOrg.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)", color: activeOrg.status === "Active" ? "#18B67A" : "#E15D5D", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                Workspace {activeOrg.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Owner: <strong>{activeOrg.ownerName}</strong> ({activeOrg.ownerEmail}) • Created: {activeOrg.created} • ID: <span style={{ fontFamily: "monospace" }}>{activeOrg.id}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Tabs & Right Sidebar Actions */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          {/* Left Column: Navigation Tabs & Views */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs List */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Overview", "Users", "Programs", "Sessions", "Resources", "Activity", "Security", "Settings"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: profileTab === tab ? 700 : 500,
                    color: profileTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: profileTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Viewport */}
            <div style={{ minHeight: "300px" }}>
              
              {profileTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Organization Health Calculation */}
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Organization Health</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0.25rem 0 0.5rem 0", color: activeOrg.health === "Good" ? "#18B67A" : "#D9A928" }}>
                      Health: {activeOrg.health}
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {activeOrg.healthReasons.map((r, i) => (
                        <div key={i} style={{ fontSize: "0.75rem", color: "#1B1B1B" }}>{r}</div>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry metrics strip */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Users</span>
                      <h5 style={{ fontSize: "1.25rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{activeOrg.users}</h5>
                    </div>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Programs</span>
                      <h5 style={{ fontSize: "1.25rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{activeOrg.programs}</h5>
                    </div>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Sessions</span>
                      <h5 style={{ fontSize: "1.25rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{activeOrg.sessions}</h5>
                    </div>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Storage</span>
                      <h5 style={{ fontSize: "1.25rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{activeOrg.storageUsed}</h5>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === "Users" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>USER</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>ROLE</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeOrg.slug === "voltpower-ltd" ? (
                        <>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>Sarah Jenkins (sarah@voltpower.co)</td>
                            <td style={{ padding: "0.75rem 1rem" }}>Administrator</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                          </tr>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>Donald West (west@voltpower.co)</td>
                            <td style={{ padding: "0.75rem 1rem" }}>Facilitator</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>{activeOrg.ownerName} ({activeOrg.ownerEmail})</td>
                            <td style={{ padding: "0.75rem 1rem" }}>Administrator</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                          </tr>
                          {rawState.team.map((member, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                              <td style={{ padding: "0.75rem 1rem" }}>{member.name || member.email.split("@")[0].toUpperCase()} ({member.email})</td>
                              <td style={{ padding: "0.75rem 1rem" }}>{member.role || "Member"}</td>
                              <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Programs" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>PROGRAM</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>SESSIONS</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeOrg.slug === "voltpower-ltd" ? (
                        <>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>Solar Installation Bootcamp</td>
                            <td style={{ padding: "0.75rem 1rem" }}>8 Sessions</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                          </tr>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>Grid Operations Intro</td>
                            <td style={{ padding: "0.75rem 1rem" }}>4 Sessions</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>Archived</td>
                          </tr>
                        </>
                      ) : (
                        rawState.programs.map((prog, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>{prog.name}</td>
                            <td style={{ padding: "0.75rem 1rem" }}>{(prog.sessions || []).length} Sessions</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Sessions" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
                  {activeOrg.sessions === "0" ? "No sessions created yet. Instruct the administrator to schedule a session." : `Ecosystem supports ${activeOrg.sessions} scheduled sessions.`}
                </div>
              )}

              {profileTab === "Resources" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
                  {activeOrg.resources === "0" ? "No resource documents uploaded yet." : `Ecosystem stores ${activeOrg.resources} documents.`}
                </div>
              )}

              {profileTab === "Activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "09:21", action: `John created program in ${activeOrg.name}`, meta: "Audit Log" },
                    { time: "09:34", action: "Facilitator uploaded slides document", meta: "Audit Log" }
                  ].map((act, i) => (
                    <div key={i} style={{ padding: "0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.8rem", display: "flex", justifySpace: "between", justifyContent: "space-between" }}>
                      <span>{act.time} - <strong>{act.action}</strong></span>
                      <span style={{ color: "#6B7280" }}>{act.meta}</span>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === "Security" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div>API Access Tokens: <strong>No tokens configured</strong></div>
                  <div>2FA Status: <strong>Disabled</strong></div>
                  <div>Recent Logins: <strong>1 active session (Mozilla/Mac OS X)</strong></div>
                </div>
              )}

              {profileTab === "Settings" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "0.8rem" }}>
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Brand Identity Color</strong>
                    <input type="color" defaultValue="#D9A928" style={{ border: "1px solid #E6DED0", cursor: "pointer" }} />
                  </div>
                  <div>
                    <strong>Workspace Visibility</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "#6B7280" }}>Visible to all organization email domains.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Admin Actions Sidebar Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Admin Actions
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              
              <button 
                onClick={() => {
                  localStorage.setItem("oyen_impersonating", "true");
                  localStorage.setItem("oyen_impersonated_org", activeOrg.name);
                  window.location.href = "/";
                }}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Impersonate Owner
              </button>

              <button 
                onClick={() => handleToggleSuspend(activeOrg)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: activeOrg.status === "Active" ? "#E15D5D" : "#18B67A", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                {activeOrg.status === "Active" ? "Suspend Organization" : "Unsuspend Organization"}
              </button>

              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
                <button 
                  onClick={() => handleUpdatePlan(activeOrg, "Enterprise")}
                  style={{
                    flex: 1, padding: "0.45rem", border: "1px solid #E6DED0", borderRadius: "4px",
                    backgroundColor: activeOrg.plan === "Enterprise" ? "#D9A928" : "#F7F4ED",
                    color: activeOrg.plan === "Enterprise" ? "#FFFFFF" : "#1B1B1B",
                    fontSize: "0.72rem", fontWeight: 700, cursor: "pointer"
                  }}
                >
                  Enterprise
                </button>
                <button 
                  onClick={() => handleUpdatePlan(activeOrg, "Pro")}
                  style={{
                    flex: 1, padding: "0.45rem", border: "1px solid #E6DED0", borderRadius: "4px",
                    backgroundColor: activeOrg.plan === "Pro" ? "#D9A928" : "#F7F4ED",
                    color: activeOrg.plan === "Pro" ? "#FFFFFF" : "#1B1B1B",
                    fontSize: "0.72rem", fontWeight: 700, cursor: "pointer"
                  }}
                >
                  Pro
                </button>
              </div>

              <button 
                onClick={() => {
                  if(confirm("Confirm deletion? This action is irreversible.")) {
                    localStorage.removeItem(`oyen_suspended_${activeOrg.slug}`);
                    localStorage.removeItem(`oyen_plan_${activeOrg.slug}`);
                    alert("Organization request staged for deletion.");
                    setActiveProfileId(null);
                    loadDatabase();
                  }
                }}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E15D5D", borderRadius: "6px",
                  backgroundColor: "rgba(225, 93, 93, 0.08)", color: "#E15D5D", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left", marginTop: "1rem"
                }}
              >
                Delete Organization
              </button>

            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box" }}>
      
      {/* List Header */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Organizations</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage every organization running on OYEN.</span>
      </div>

      {/* Stats summary strip */}
      <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "#6B7280" }}>
        <span><strong>{organizations.length}</strong> Organizations</span> •
        <span><strong>{organizations.filter(o => o.status === "Active").length}</strong> Active</span> •
        <span><strong>{organizations.filter(o => o.status === "Suspended").length}</strong> Suspended</span>
      </div>

      {/* Search and Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search organizations by name, slug or owner..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filter triggers */}
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem" }}>
          {[
            { id: "all", label: "All" },
            { id: "Active", label: "Active" },
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

      {/* Organizations Listing Grid Table */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PLAN</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>USERS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PROGRAMS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STORAGE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((org, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{org.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.ownerEmail}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B", fontWeight: 600 }}>{org.plan}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.users}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.programs}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.storageUsed}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: org.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)",
                    color: org.status === "Active" ? "#18B67A" : "#E15D5D"
                  }}>
                    {org.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveProfileId(org.id);
                      setProfileTab("Overview");
                    }}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
