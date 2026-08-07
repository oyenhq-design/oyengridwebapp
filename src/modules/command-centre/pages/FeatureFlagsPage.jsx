import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ShieldAlert, Cpu, ToggleLeft, ToggleRight, Play, RefreshCw, AlertTriangle, Key, Layers, Activity } from "lucide-react";

export default function FeatureFlagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeFlagId, setActiveFlagId] = useState(null);
  const [flagTab, setFlagTab] = useState("Rollout");
  
  const [flags, setFlags] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];

      const assistantState = localStorage.getItem("oyen_flag_assistant") || "Enabled";
      const recorderState = localStorage.getItem("oyen_flag_recorder") || "Disabled";

      const primaryFlag = {
        id: "flag_01",
        name: "AI Operational Assistant",
        key: "ai_operational_assistant",
        status: assistantState,
        env: "Production",
        rollout: assistantState === "Enabled" ? "10%" : "0%",
        target: "Enterprise Only",
        owner: "Engineering",
        desc: "Powers automatic helper suggestions and facilitation insights within workspaces.",
        created: "June 18, 2026",
        updated: "2 hours ago",
        dependsOn: null,
        usersImpacted: team.length + 5,
        orgsEnabled: [orgName]
      };

      const secondaryFlag = {
        id: "flag_02",
        name: "Attendance Intelligence",
        key: "attendance_intelligence",
        status: "Beta",
        env: "Production",
        rollout: "50%",
        target: "Beta Users Only",
        owner: "AI Team",
        desc: "Analyzes facial attention levels and check-in times to score session attendance.",
        created: "June 20, 2026",
        updated: "Yesterday",
        dependsOn: "ai_operational_assistant",
        usersImpacted: team.length,
        orgsEnabled: [orgName]
      };

      const tertiaryFlag = {
        id: "flag_03",
        name: "Live Session Recorder",
        key: "live_session_recorder",
        status: recorderState,
        env: "Staging",
        rollout: "0%",
        target: "Internal Only",
        owner: "Product",
        desc: "Records ongoing sessions and uploads video streams directly into workspace resources.",
        created: "June 25, 2026",
        updated: "3 days ago",
        dependsOn: null,
        usersImpacted: 0,
        orgsEnabled: []
      };

      setFlags([primaryFlag, secondaryFlag, tertiaryFlag]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleToggleFlag = (flag, nextState) => {
    const role = "Platform Super Admin"; // Mock role auth check
    if (confirm(`Are you sure you want to change flag state for ${flag.key} to ${nextState}? This change will write to production audit logs.`)) {
      if (flag.key === "ai_operational_assistant") {
        localStorage.setItem("oyen_flag_assistant", nextState);
      } else if (flag.key === "live_session_recorder") {
        localStorage.setItem("oyen_flag_recorder", nextState);
      }
      loadDatabase();
      window.dispatchEvent(new Event("storage"));
      alert("Feature Flag configuration committed instantly.");
    }
  };

  const activeFlag = flags.find(f => f.id === activeFlagId);

  const filteredFlags = flags.filter(f => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = f.name.toLowerCase().includes(query) ||
                          f.key.toLowerCase().includes(query) ||
                          f.owner.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Enabled") return matchesSearch && f.status === "Enabled";
    if (activeFilter === "Disabled") return matchesSearch && f.status === "Disabled";
    if (activeFilter === "Beta") return matchesSearch && f.status === "Beta";
    return matchesSearch;
  });

  if (activeFlag) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveFlagId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Feature Flags Registry</span>
        </button>

        {/* Flag Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeFlag.name}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeFlag.key}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: activeFlag.status === "Enabled" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)", color: activeFlag.status === "Enabled" ? "#18B67A" : "#E15D5D", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeFlag.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Environment: <strong>{activeFlag.env}</strong> • Owner: {activeFlag.owner} • Last Updated: {activeFlag.updated}
            </div>
          </div>
        </div>

        {/* Flag Content split layouts */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs Navigation */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Rollout", "Conditions", "History", "Dependencies", "Analytics"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFlagTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: flagTab === tab ? 700 : 500,
                    color: flagTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: flagTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {flagTab === "Rollout" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                    <strong>Gradual rollout controls</strong>
                    <div style={{ marginTop: "1rem" }}>
                      <span>Current Production Rollout: <strong>{activeFlag.rollout}</strong></span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue={activeFlag.rollout.replace("%", "")}
                        onChange={e => alert(`Updating rollout threshold to ${e.target.value}%...`)}
                        style={{ width: "100%", accentColor: "#D9A928", marginTop: "0.5rem" }} 
                      />
                    </div>
                  </div>

                  {/* Target org lists */}
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                      Target Organizations Enablement
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.50rem", fontSize: "0.8rem" }}>
                      {activeFlag.orgsEnabled.map((org, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                          <span>{org}</span>
                          <strong style={{ color: "#18B67A" }}>Enabled</strong>
                        </div>
                      ))}
                      {activeFlag.orgsEnabled.length === 0 && (
                        <div style={{ color: "#6B7280" }}>No target workspace overrides mapped.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {flagTab === "Conditions" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Rollout override conditions</strong>
                  <div style={{ marginTop: "1rem", color: "#6B7280" }}>
                    <div>- Plan equals: <strong>{activeFlag.target}</strong></div>
                  </div>
                </div>
              )}

              {flagTab === "History" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "Today, 10:12 AM", action: `Rollout rules updated by Platform Operator`, meta: "Audit Logs" },
                    { time: "Yesterday, 04:30 PM", action: `Flag registered into environment registry`, meta: "Audit Logs" }
                  ].map((act, i) => (
                    <div key={i} style={{ padding: "0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{act.time} - <strong>{act.action}</strong></span>
                      <span style={{ color: "#6B7280" }}>{act.meta}</span>
                    </div>
                  ))}
                </div>
              )}

              {flagTab === "Dependencies" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Dependency Rules</strong>
                  <div style={{ marginTop: "1rem" }}>
                    {activeFlag.dependsOn ? (
                      <div>Depends on: <strong style={{ fontFamily: "monospace" }}>{activeFlag.dependsOn}</strong></div>
                    ) : (
                      <div style={{ color: "#6B7280" }}>No flag dependencies found.</div>
                    )}
                  </div>
                </div>
              )}

              {flagTab === "Analytics" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                  <div>Active Users Impacted: <strong>{activeFlag.usersImpacted} users</strong></div>
                  <div>Enabled Organizations: <strong>{activeFlag.orgsEnabled.length} workspaces</strong></div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Emergency Actions Sidebar Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Emergency Override Controls
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handleToggleFlag(activeFlag, activeFlag.status === "Enabled" ? "Disabled" : "Enabled")}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: activeFlag.status === "Enabled" ? "#E15D5D" : "#18B67A", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                {activeFlag.status === "Enabled" ? "Disable Immediately" : "Enable Flag"}
              </button>

              <button 
                onClick={() => alert("Rollback sequence completed.")}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Rollback Feature
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
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Feature Flags</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Safely manage gradual rollouts and feature targets across the OYEN Platform.</span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Total Flags</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{flags.length}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Enabled in Production</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>
            {flags.filter(f => f.status === "Enabled").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Beta Rollouts</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#D9A928" }}>
            {flags.filter(f => f.status === "Beta").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Experimental / Staging</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>
            {flags.filter(f => f.status === "Disabled" && f.env === "Staging").length}
          </h4>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search feature flags by name, key, owner..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "Enabled", "Disabled", "Beta"].map(tab => (
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
      </div>

      {/* Table grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>FEATURE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>KEY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ENVIRONMENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ROLLOUT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>TARGET</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredFlags.map((flag, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{flag.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280", fontFamily: "monospace" }}>{flag.key}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: flag.status === "Enabled" ? "rgba(24, 182, 122, 0.12)" : (flag.status === "Beta" ? "rgba(229, 185, 60, 0.12)" : "rgba(225, 93, 93, 0.12)"),
                    color: flag.status === "Enabled" ? "#18B67A" : (flag.status === "Beta" ? "#E5B93C" : "#E15D5D")
                  }}>
                    {flag.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{flag.env}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B", fontWeight: 700 }}>{flag.rollout}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{flag.target}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{flag.owner}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveFlagId(flag.id);
                      setFlagTab("Rollout");
                    }}
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

    </div>
  );
}
