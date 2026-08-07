import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, MoreHorizontal, Settings, ShieldAlert, Key, UserCheck, HardDrive, HelpCircle, Activity, LayoutGrid, Layers, Calendar, CreditCard, Shield } from "lucide-react";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("Newest");
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [profileTab, setProfileTab] = useState("Overview");
  
  const [organizations, setOrganizations] = useState([]);
  const [rawState, setRawState] = useState({
    programs: [],
    team: [],
    learners: []
  });

  const [activeMenuId, setActiveMenuId] = useState(null);

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
        users: team.length + learners.length,
        programs: programs.length,
        sessions: totalSessions,
        resources: totalResources,
        storageUsed: `${34 + totalResources * 2}MB`,
        storageLimit: currentPlan.includes("Enterprise") ? "50GB" : "10GB",
        created: "June 12, 2026",
        health: isSuspended ? "At Risk" : (totalSessions > 0 ? "Good" : "Warning"),
        healthReasons: healthReason,
        lastLogin: "Today, 10:14 AM",
        lastActivity: "2 minutes ago",
        logo: "⚡"
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
        users: 52,
        programs: 2,
        sessions: 12,
        resources: 6,
        storageUsed: "1.2GB",
        storageLimit: voltPowerPlan.includes("Enterprise") ? "50GB" : "10GB",
        created: "March 12, 2026",
        health: voltPowerSuspended ? "At Risk" : "Good",
        healthReasons: voltPowerSuspended ? ["⚠ Workspace Suspended"] : ["✓ Workspace Active", "✓ Stable Revenue"],
        lastLogin: "Yesterday, 4:30 PM",
        lastActivity: "1 day ago",
        logo: "🔋"
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
    setActiveMenuId(null);
  };

  const handleUpdatePlan = (org, plan) => {
    localStorage.setItem(`oyen_plan_${org.slug}`, plan);
    loadDatabase();
    window.dispatchEvent(new Event("storage"));
    setActiveMenuId(null);
  };

  const handleImpersonate = (org) => {
    alert(`Bypassing auth security: Impersonating ${org.ownerName} (${org.ownerEmail})`);
    localStorage.setItem("oyen_impersonating", "true");
    localStorage.setItem("oyen_impersonated_org", org.name);
    window.location.href = "/";
  };

  const activeOrg = organizations.find(o => o.id === activeProfileId);

  // Sorting logic
  const sortedOrgs = [...organizations].sort((a, b) => {
    if (sortOption === "Most Users") return b.users - a.users;
    if (sortOption === "Newest") return new Date(b.created) - new Date(a.created);
    if (sortOption === "Oldest") return new Date(a.created) - new Date(b.created);
    return 0;
  });

  const filteredOrgs = sortedOrgs.filter(o => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = o.name.toLowerCase().includes(query) ||
                          o.ownerEmail.toLowerCase().includes(query) ||
                          o.slug.toLowerCase().includes(query) ||
                          o.plan.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Active") return matchesSearch && o.status === "Active";
    if (activeFilter === "Suspended") return matchesSearch && o.status === "Suspended";
    if (activeFilter === "Trial") return matchesSearch && o.plan.toLowerCase().includes("trial");
    if (activeFilter === "Enterprise") return matchesSearch && o.plan === "Enterprise";
    if (activeFilter === "Pro") return matchesSearch && o.plan === "Pro";
    return matchesSearch;
  });

  // Render detail dashboard for organization profile
  if (activeOrg) {
    // Sourced facilitators & participants lists
    const facilitatorsList = activeOrg.slug === "voltpower-ltd" ? [
      { name: "Donald West", email: "west@voltpower.co", role: "Facilitator", status: "Active", joined: "March 15, 2026", lastActive: "1 day ago" }
    ] : rawState.team.filter(m => (m.role || "").toLowerCase().includes("facilitator")).map(m => ({
      name: m.name || m.email.split("@")[0].toUpperCase(),
      email: m.email,
      role: "Facilitator",
      status: "Active",
      joined: "June 12, 2026",
      lastActive: "Today"
    }));

    const participantsList = activeOrg.slug === "voltpower-ltd" ? [] : rawState.learners.map(m => ({
      name: m.name || m.email.split("@")[0].toUpperCase(),
      email: m.email,
      role: "Learner",
      status: "Active",
      joined: "June 15, 2026",
      lastActive: "Today"
    }));

    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveProfileId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Tenant Registry</span>
        </button>

        {/* Profile Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "2rem" }}>{activeOrg.logo}</div>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeOrg.name}</h3>
                <span style={{ fontSize: "0.72rem", color: "#6B7280", fontFamily: "monospace" }}>{activeOrg.slug}</span>
              </div>
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
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
              {["Overview", "Users", "Programs", "Facilitators", "Participants", "Billing", "Storage", "AI Usage", "Activity", "Audit Logs", "Security", "Settings"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: profileTab === tab ? 700 : 500,
                    color: profileTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem", whiteSpace: "nowrap",
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

              {profileTab === "Facilitators" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>FACILITATOR</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>EMAIL</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>JOINED</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilitatorsList.map((fac, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{fac.name}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{fac.email}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{fac.joined}</td>
                        </tr>
                      ))}
                      {facilitatorsList.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No facilitators registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Participants" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>PARTICIPANT</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>EMAIL</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>JOINED</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantsList.map((part, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{part.name}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{part.email}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{part.joined}</td>
                        </tr>
                      ))}
                      {participantsList.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No participants registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Billing" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#6B7280" }}>
                  <CreditCard size={24} style={{ marginBottom: "0.5rem" }} />
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>No billing records available yet.</p>
                </div>
              )}

              {profileTab === "Storage" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div>Total Used: <strong>{activeOrg.storageUsed}</strong></div>
                  <div>Allocated Quota: <strong>{activeOrg.storageLimit}</strong></div>
                  <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem", color: "#6B7280" }}>
                    No large video or recording files located.
                  </div>
                </div>
              )}

              {profileTab === "AI Usage" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#6B7280" }}>
                  <Cpu size={24} style={{ marginBottom: "0.5rem" }} />
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>No AI usage logs detected today.</p>
                </div>
              )}

              {profileTab === "Activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "09:21", action: `John created program in ${activeOrg.name}`, meta: "Audit Log" },
                    { time: "09:34", action: "Facilitator uploaded slides document", meta: "Audit Log" }
                  ].map((act, i) => (
                    <div key={i} style={{ padding: "0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{act.time} - <strong>{act.action}</strong></span>
                      <span style={{ color: "#6B7280" }}>{act.meta}</span>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === "Audit Logs" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>OPERATOR</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>ACTION</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>IP ADDRESS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                        <td style={{ padding: "0.75rem 1rem" }}>John David</td>
                        <td style={{ padding: "0.75rem 1rem" }}>Workspace Settings Update</td>
                        <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace" }}>192.168.1.42</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Security" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div>API Access Tokens: <strong>No active tokens configured</strong></div>
                  <div>2FA Status: <strong>Disabled</strong></div>
                  <div>Recent Logins: <strong>1 active session (Mozilla/Mac OS X)</strong></div>
                </div>
              )}

              {profileTab === "Settings" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "0.8rem" }}>
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Branding Settings</strong>
                    <input type="color" defaultValue="#D9A928" style={{ border: "1px solid #E6DED0", cursor: "pointer" }} />
                  </div>
                  <div>
                    <strong>Allowed Domains</strong>
                    <p style={{ margin: "0.15rem 0 0 0", color: "#6B7280" }}>Restricted to matching emails domains.</p>
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
                onClick={() => handleImpersonate(activeOrg)}
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
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Organizations</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage every organization running on OYEN.</span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Organizations</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{organizations.length}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Active</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>
            {organizations.filter(o => o.status === "Active").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Trial</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>
            {organizations.filter(o => o.plan.toLowerCase().includes("trial")).length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Suspended</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E15D5D" }}>
            {organizations.filter(o => o.status === "Suspended").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Needs Review</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#D9A928" }}>0</h4>
        </div>
      </div>

      {/* Action Bar controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search organizations, owner, subscription slug..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "Active", "Suspended", "Trial", "Enterprise"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                border: "1px solid #E6DED0", borderRadius: "6px", fontSize: "0.78rem",
                padding: "0.45rem 0.85rem", cursor: "pointer",
                backgroundColor: activeFilter === tab ? "#D9A928" : "#FCFBF8",
                color: activeFilter === tab ? "#FFFFFF" : "#1B1B1B", fontWeight: 700
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <select 
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none" }}
        >
          <option>Newest</option>
          <option>Oldest</option>
          <option>Most Users</option>
        </select>
      </div>

      {/* Main Table Grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "visible", backgroundColor: "#FCFBF8", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>WORKSPACE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>SUBSCRIPTION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>USERS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PROGRAMS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STORAGE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((org, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>{org.logo}</span>
                    <span>{org.name}</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.ownerEmail}</td>
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
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.users}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.programs}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{org.storageUsed} / {org.storageLimit}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right", position: "relative" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => {
                        setActiveProfileId(org.id);
                        setProfileTab("Overview");
                      }}
                      style={{ border: "none", background: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === org.id ? null : org.id)}
                      style={{ border: "none", background: "none", color: "#6B7280", cursor: "pointer" }}
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    {activeMenuId === org.id && (
                      <div style={{
                        position: "absolute", top: "30px", right: "1.25rem", width: "180px",
                        backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)", zIndex: 100, padding: "0.25rem",
                        display: "flex", flexDirection: "column", textAlign: "left"
                      }}>
                        <button 
                          onClick={() => { setActiveProfileId(org.id); setProfileTab("Overview"); setActiveMenuId(null); }}
                          style={{ border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          Open Profile
                        </button>
                        <button 
                          onClick={() => handleImpersonate(org)}
                          style={{ border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          Impersonate Owner
                        </button>
                        <button 
                          onClick={() => handleToggleSuspend(org)}
                          style={{ border: "none", background: "none", color: org.status === "Active" ? "#E15D5D" : "#18B67A", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {org.status === "Active" ? "Suspend Workspace" : "Unsuspend Workspace"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
