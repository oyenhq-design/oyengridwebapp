import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, MoreHorizontal, Settings, ShieldAlert, Key, UserCheck, HardDrive, HelpCircle, Activity, LayoutGrid, Layers, Calendar, Cpu } from "lucide-react";

export default function WorkspacesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("Newest");
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [profileTab, setProfileTab] = useState("Overview");
  
  const [workspaces, setWorkspaces] = useState([]);
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

      const isPaused = localStorage.getItem(`oyen_paused_${orgSlug}`) === "true";
      const currentPlan = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise Trial";

      const totalSessions = programs.reduce((sum, p) => sum + (p.sessions || []).length, 0);
      const totalResources = programs.reduce((sum, p) => sum + (p.resources || []).length, 0);

      const primaryWorkspace = {
        id: "ws_a92D38",
        name: orgName,
        slug: orgSlug,
        orgName,
        ownerName,
        ownerEmail,
        plan: currentPlan,
        status: isPaused ? "Paused" : "Active",
        users: team.length + learners.length,
        programs: programs.length,
        sessions: totalSessions,
        resources: totalResources,
        storageUsed: `${34 + totalResources * 2}MB`,
        storageLimit: currentPlan.includes("Enterprise") ? "50GB" : "10GB",
        created: "June 12, 2026",
        lastActivity: "2 minutes ago",
        logo: "⚡",
        env: "Production"
      };

      const secondaryOrgPaused = localStorage.getItem("oyen_paused_voltpower-ltd") === "true";
      
      const secondaryWorkspace = {
        id: "ws_b11B49",
        name: "VoltPower Ltd",
        slug: "voltpower-ltd",
        orgName: "VoltPower Ltd",
        ownerName: "Sarah Jenkins",
        ownerEmail: "sarah@voltpower.co",
        plan: "Pro",
        status: secondaryOrgPaused ? "Paused" : "Active",
        users: 52,
        programs: 2,
        sessions: 12,
        resources: 6,
        storageUsed: "1.2GB",
        storageLimit: "10GB",
        created: "March 12, 2026",
        lastActivity: "1 day ago",
        logo: "🔋",
        env: "Production"
      };

      setWorkspaces([primaryWorkspace, secondaryWorkspace]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleTogglePause = (ws) => {
    const nextStatus = ws.status === "Active" ? "true" : "false";
    localStorage.setItem(`oyen_paused_${ws.slug}`, nextStatus);
    loadDatabase();
    window.dispatchEvent(new Event("storage"));
    setActiveMenuId(null);
  };

  const handleImpersonate = (ws) => {
    alert(`Bypassing security controls: Impersonating ${ws.ownerName} in environment ${ws.name}`);
    localStorage.setItem("oyen_impersonating", "true");
    localStorage.setItem("oyen_impersonated_org", ws.name);
    window.location.href = "/";
  };

  const activeWs = workspaces.find(w => w.id === activeProfileId);

  const sortedWorkspaces = [...workspaces].sort((a, b) => {
    if (sortOption === "Most Programs") return b.programs - a.programs;
    if (sortOption === "Most Users") return b.users - a.users;
    if (sortOption === "Newest") return new Date(b.created) - new Date(a.created);
    return 0;
  });

  const filteredWorkspaces = sortedWorkspaces.filter(w => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = w.name.toLowerCase().includes(query) ||
                          w.slug.toLowerCase().includes(query) ||
                          w.ownerEmail.toLowerCase().includes(query) ||
                          w.plan.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Active") return matchesSearch && w.status === "Active";
    if (activeFilter === "Paused") return matchesSearch && w.status === "Paused";
    return matchesSearch;
  });

  // Render detail dashboard for workspace profile
  if (activeWs) {
    const facilitatorsList = activeWs.slug === "voltpower-ltd" ? [
      { name: "Donald West", email: "west@voltpower.co", role: "Facilitator", status: "Active", joined: "March 15, 2026", lastActive: "1 day ago" }
    ] : rawState.team.filter(m => (m.role || "").toLowerCase().includes("facilitator")).map(m => ({
      name: m.name || m.email.split("@")[0].toUpperCase(),
      email: m.email,
      role: "Facilitator",
      status: "Active",
      joined: "June 12, 2026",
      lastActive: "Today"
    }));

    const participantsList = activeWs.slug === "voltpower-ltd" ? [] : rawState.learners.map(m => ({
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
          <span>Back to Workspaces Registry</span>
        </button>

        {/* Workspace Profile Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "2rem" }}>{activeWs.logo}</div>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeWs.name}</h3>
                <span style={{ fontSize: "0.72rem", color: "#6B7280", fontFamily: "monospace" }}>{activeWs.slug}</span>
              </div>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeWs.plan}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: activeWs.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)", color: activeWs.status === "Active" ? "#18B67A" : "#E5B93C", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                Environment {activeWs.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Organization: <strong>{activeWs.orgName}</strong> • Owner: {activeWs.ownerName} • ID: <span style={{ fontFamily: "monospace" }}>{activeWs.id}</span>
            </div>
          </div>
        </div>

        {/* Workspace Profile Tabs and Action columns */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs control */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
              {["Overview", "Programs", "Users", "Facilitators", "Participants", "Sessions", "Resources", "AI", "Storage", "Activity", "Audit Logs", "Settings"].map(tab => (
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

            {/* Tab viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {profileTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
                    <div>Workspace Name: <strong>{activeWs.name}</strong></div>
                    <div>Slug: <strong style={{ fontFamily: "monospace" }}>{activeWs.slug}</strong></div>
                    <div>Owner: <strong>{activeWs.ownerName}</strong> ({activeWs.ownerEmail})</div>
                    <div>Environment: <strong>{activeWs.env}</strong></div>
                    <div>Created Date: <strong>{activeWs.created}</strong></div>
                    <div>Last Activity: <strong>{activeWs.lastActivity}</strong></div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Programs</span>
                      <h5 style={{ fontSize: "1.2rem", margin: "0.15rem 0 0 0", fontWeight: 800 }}>{activeWs.programs}</h5>
                    </div>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Active Users</span>
                      <h5 style={{ fontSize: "1.2rem", margin: "0.15rem 0 0 0", fontWeight: 800 }}>{activeWs.users}</h5>
                    </div>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Sessions</span>
                      <h5 style={{ fontSize: "1.2rem", margin: "0.15rem 0 0 0", fontWeight: 800 }}>{activeWs.sessions}</h5>
                    </div>
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Storage Used</span>
                      <h5 style={{ fontSize: "1.2rem", margin: "0.15rem 0 0 0", fontWeight: 800 }}>{activeWs.storageUsed}</h5>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === "Programs" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
                  {activeWs.programs === 0 ? (
                    <div style={{ color: "#6B7280", fontSize: "0.8rem", textAlign: "center" }}>No programs have been created in this workspace.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                          <th style={{ padding: "0.6rem 0.85rem", color: "#6B7280" }}>PROGRAM</th>
                          <th style={{ padding: "0.6rem 0.85rem", color: "#6B7280" }}>SESSIONS</th>
                          <th style={{ padding: "0.6rem 0.85rem", color: "#6B7280" }}>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeWs.slug === "voltpower-ltd" ? (
                          <>
                            <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                              <td style={{ padding: "0.6rem 0.85rem", fontWeight: 700 }}>Solar Installation Bootcamp</td>
                              <td style={{ padding: "0.6rem 0.85rem" }}>8 Sessions</td>
                              <td style={{ padding: "0.6rem 0.85rem", color: "#18B67A" }}>Active</td>
                            </tr>
                          </>
                        ) : (
                          rawState.programs.map((prog, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                              <td style={{ padding: "0.6rem 0.85rem", fontWeight: 700 }}>{prog.name}</td>
                              <td style={{ padding: "0.6rem 0.85rem" }}>{(prog.sessions || []).length} Sessions</td>
                              <td style={{ padding: "0.6rem 0.85rem", color: "#18B67A" }}>Active</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
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
                      {activeWs.slug === "voltpower-ltd" ? (
                        <>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>Sarah Jenkins (sarah@voltpower.co)</td>
                            <td style={{ padding: "0.75rem 1rem" }}>Administrator</td>
                            <td style={{ padding: "0.75rem 1rem", color: "#18B67A" }}>Active</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                            <td style={{ padding: "0.75rem 1rem" }}>{activeWs.ownerName} ({activeWs.ownerEmail})</td>
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

              {profileTab === "Facilitators" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>FACILITATOR</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>EMAIL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilitatorsList.map((fac, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{fac.name}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{fac.email}</td>
                        </tr>
                      ))}
                      {facilitatorsList.length === 0 && (
                        <tr>
                          <td colSpan={2} style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No facilitators registered.</td>
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
                      </tr>
                    </thead>
                    <tbody>
                      {participantsList.map((part, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{part.name}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{part.email}</td>
                        </tr>
                      ))}
                      {participantsList.length === 0 && (
                        <tr>
                          <td colSpan={2} style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No participants registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Sessions" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
                  {activeWs.sessions === 0 ? "No sessions scheduled." : `${activeWs.sessions} scheduled sessions discovered.`}
                </div>
              )}

              {profileTab === "Resources" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
                  {activeWs.resources === 0 ? "Workspace storage is currently empty." : `Document storage holds ${activeWs.resources} assets.`}
                </div>
              )}

              {profileTab === "AI" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#6B7280" }}>
                  <Cpu size={24} style={{ marginBottom: "0.5rem" }} />
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>No AI activity logs detected today.</p>
                </div>
              )}

              {profileTab === "Storage" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div>Total Used: <strong>{activeWs.storageUsed}</strong></div>
                  <div>Allocated Quota: <strong>{activeWs.storageLimit}</strong></div>
                </div>
              )}

              {profileTab === "Activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "09:21", action: `Workspace Environment ${activeWs.name} created`, meta: "Audit Log" },
                    { time: "09:34", action: "Active staff roster configured", meta: "Audit Log" }
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
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                        <td style={{ padding: "0.75rem 1rem" }}>System Operator</td>
                        <td style={{ padding: "0.75rem 1rem" }}>Environment mounted</td>
                        <td style={{ padding: "0.75rem 1rem" }}>Today, 08:30 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Settings" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "0.8rem" }}>
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Environment Visibility</strong>
                    <input type="text" defaultValue="Production" style={{ border: "1px solid #E6DED0", padding: "0.45rem", borderRadius: "6px" }} />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Actions Sidebar Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Environment Controls
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handleImpersonate(activeWs)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Impersonate Workspace
              </button>

              <button 
                onClick={() => handleTogglePause(activeWs)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: activeWs.status === "Active" ? "#E5B93C" : "#18B67A", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                {activeWs.status === "Active" ? "Pause Workspace" : "Resume Workspace"}
              </button>

              <button 
                onClick={() => {
                  if(confirm("Are you sure you want to delete this workspace environment? All data will be wiped.")) {
                    localStorage.removeItem(`oyen_paused_${activeWs.slug}`);
                    alert("Workspace environment request staged for deletion.");
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
                Delete Workspace
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
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Workspaces</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage every active workspace operating across the OYEN Platform.</span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Total Workspaces</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{workspaces.length}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Active Workspaces</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>
            {workspaces.filter(w => w.status === "Active").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Paused Workspaces</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E5B93C" }}>
            {workspaces.filter(w => w.status === "Paused").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Archived Workspaces</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>0</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Needs Attention</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E15D5D" }}>0</h4>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search workspaces by name, owner slug..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "Active", "Paused"].map(tab => (
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

        {/* Sort */}
        <select 
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none" }}
        >
          <option>Newest</option>
          <option>Most Users</option>
          <option>Most Programs</option>
        </select>
      </div>

      {/* Main Workspace Table Grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "visible", backgroundColor: "#FCFBF8", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>WORKSPACE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>USERS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PROGRAMS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>SESSIONS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STORAGE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkspaces.map((ws, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>{ws.logo}</span>
                    <span>{ws.name}</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ws.orgName}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ws.ownerEmail}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ws.users}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ws.programs}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ws.sessions}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ws.storageUsed} / {ws.storageLimit}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: ws.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(229, 185, 60, 0.12)",
                    color: ws.status === "Active" ? "#18B67A" : "#E5B93C"
                  }}>
                    {ws.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right", position: "relative" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => {
                        setActiveProfileId(ws.id);
                        setProfileTab("Overview");
                      }}
                      style={{ border: "none", background: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === ws.id ? null : ws.id)}
                      style={{ border: "none", background: "none", color: "#6B7280", cursor: "pointer" }}
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    {activeMenuId === ws.id && (
                      <div style={{
                        position: "absolute", top: "30px", right: "1.25rem", width: "180px",
                        backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)", zIndex: 100, padding: "0.25rem",
                        display: "flex", flexDirection: "column", textAlign: "left"
                      }}>
                        <button 
                          onClick={() => { setActiveProfileId(ws.id); setProfileTab("Overview"); setActiveMenuId(null); }}
                          style={{ border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          Open Profile
                        </button>
                        <button 
                          onClick={() => handleImpersonate(ws)}
                          style={{ border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          Impersonate Owner
                        </button>
                        <button 
                          onClick={() => handleTogglePause(ws)}
                          style={{ border: "none", background: "none", color: ws.status === "Active" ? "#E5B93C" : "#18B67A", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {ws.status === "Active" ? "Pause Workspace" : "Resume Workspace"}
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
