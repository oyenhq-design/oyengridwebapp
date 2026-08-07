import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, MoreHorizontal, ShieldAlert, Key, UserCheck, HardDrive, HelpCircle, Activity, Globe, MessageSquare, Cpu } from "lucide-react";

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [caseTab, setCaseTab] = useState("Overview");
  
  const [cases, setCases] = useState([]);
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

      const primaryCase = {
        id: "case_01",
        orgName,
        ownerName,
        ownerEmail,
        plan: currentPlan,
        subject: "AI Summary generation timeout during Week 2 Bootcamp session",
        category: "AI",
        priority: "High",
        status: isSuspended ? "Closed" : "Investigating",
        created: "Today, 08:15 AM",
        updated: "2 mins ago",
        desc: "When compiling the AI insight compilation for the Battery Storage program, facilitators receive a timeout warning from the services node.",
        device: "Chrome v120 / macOS Sonoma",
        ip: "192.168.1.12",
        sla: "Target: 4 hours • 1h 45m remaining",
        historyCount: 1,
        programsCount: programs.length,
        usersCount: team.length + learners.length,
      };

      const secondaryCase = {
        id: "case_02",
        orgName: "VoltPower Ltd",
        ownerName: "Sarah Jenkins",
        ownerEmail: "sarah@voltpower.co",
        plan: "Pro",
        subject: "Workspace login verification pending invitation confirmation link expiration",
        category: "Authentication",
        priority: "Medium",
        status: "Waiting for Customer",
        created: "Yesterday, 02:40 PM",
        updated: "Yesterday, 04:30 PM",
        desc: "Sarah invited a new facilitator, but the activation link timed out. Needs a manual override to verify email state.",
        device: "Firefox v119 / Windows 11",
        ip: "10.0.0.45",
        sla: "Target: 24 hours • Operational",
        historyCount: 0,
        programsCount: 2,
        usersCount: 52
      };

      setCases([primaryCase, secondaryCase]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleToggleSuspend = (orgSlug) => {
    const isSuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";
    localStorage.setItem(`oyen_suspended_${orgSlug}`, isSuspended ? "false" : "true");
    loadDatabase();
    window.dispatchEvent(new Event("storage"));
  };

  const handleImpersonate = (c) => {
    alert(`Audit Logged: Impersonating ${c.ownerName} to address Case ID: ${c.id}`);
    localStorage.setItem("oyen_impersonating", "true");
    localStorage.setItem("oyen_impersonated_org", c.orgName);
    window.location.href = "/";
  };

  const activeCase = cases.find(c => c.id === activeCaseId);

  const filteredCases = cases.filter(c => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = c.orgName.toLowerCase().includes(query) ||
                          c.subject.toLowerCase().includes(query) ||
                          c.category.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Investigating") return matchesSearch && c.status === "Investigating";
    if (activeFilter === "Waiting") return matchesSearch && c.status.includes("Waiting");
    return matchesSearch;
  });

  // Render detail dashboard for support case
  if (activeCase) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveCaseId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Customer Operations</span>
        </button>

        {/* Case Cockpit Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeCase.subject}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: activeCase.priority === "High" ? "rgba(225, 93, 93, 0.12)" : "#FFF7E4", border: "1px solid #E6DED0", color: activeCase.priority === "High" ? "#E15D5D" : "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeCase.priority} Priority
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeCase.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Organization: <strong>{activeCase.orgName}</strong> • Owner: {activeCase.ownerName} ({activeCase.ownerEmail}) • Case ID: <span style={{ fontFamily: "monospace" }}>{activeCase.id}</span>
            </div>
          </div>
        </div>

        {/* Tab content split layout */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Overview", "Communication", "Related Records", "AI Assistance"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCaseTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: caseTab === tab ? 700 : 500,
                    color: caseTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: caseTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {caseTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
                    <div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Description</span>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#1B1B1B" }}>{activeCase.desc}</p>
                    </div>

                    <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Diagnostics Environment</span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.25rem" }}>
                        <div>Device User Agent: <strong>{activeCase.device}</strong></div>
                        <div>Client IP: <strong>{activeCase.ip}</strong></div>
                        <div>SLA status: <strong>{activeCase.sla}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Case Timeline logs */}
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                      Case Operations Timeline
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                      <div>08:15 AM - <strong>Case created by administrator</strong></div>
                      <div>08:18 AM - <strong>Assigned to platform support queues</strong></div>
                      <div>08:25 AM - <strong>Telemetry logs diagnosed</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {caseTab === "Communication" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  
                  {/* Comm log list */}
                  <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", backgroundColor: "#FCFBF8", padding: "1.25rem", fontSize: "0.8rem" }}>
                    <strong>Public Support Reply (To: {activeCase.ownerEmail})</strong>
                    <p style={{ color: "#6B7280", margin: "0.25rem 0 0 0" }}>We have flagged the AI timeout compile request with developers. We will notify you once resolved.</p>
                  </div>

                  {/* Reply Input */}
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Send Reply / Comment</span>
                    <textarea placeholder="Enter email response or staff operations note..." style={{ width: "100%", height: "80px", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", padding: "0.55rem", boxSizing: "border-box", outline: "none", resize: "none", fontSize: "0.8rem", color: "#1B1B1B" }} />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => alert("Public reply dispatched")} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>Send Reply</button>
                      <button onClick={() => alert("Internal comment added")} style={{ padding: "0.45rem 0.85rem", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", borderRadius: "6px", color: "#1B1B1B", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>Add Internal Note</button>
                    </div>
                  </div>

                </div>
              )}

              {caseTab === "Related Records" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div>Active Workspace Users: <strong>{activeCase.usersCount} users</strong></div>
                  <div>Active Programs: <strong>{activeCase.programsCount} programs</strong></div>
                  <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem", color: "#6B7280" }}>
                    Related Billing Plan: {activeCase.plan}
                  </div>
                </div>
              )}

              {caseTab === "AI Assistance" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D9A928" }}>
                    <Cpu size={16} />
                    <strong>OYEN AI Copilot Diagnostics</strong>
                  </div>
                  <div>Possible Cause: <strong>AI Insight compilation timeout during resource payload parsing.</strong></div>
                  <div>Suggested Action: <strong>Check database transaction lock thresholds or retry summary generation.</strong></div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Quick Tools Admin Sidebar Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Quick Tools
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handleImpersonate(activeCase)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Impersonate Owner
              </button>

              <button 
                onClick={() => handleToggleSuspend(activeCase.orgName.toLowerCase().replace(/[^a-z0-9]/g, "-"))}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#E15D5D", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Suspend Workspace
              </button>

              <div style={{ borderTop: "1px solid #E6DED0", marginTop: "1rem", paddingTop: "1rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Customer History</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  <div>Plan: <strong>{activeCase.plan}</strong></div>
                  <div>Previous cases: <strong>{activeCase.historyCount} case</strong></div>
                  <div>Roster programs: <strong>{activeCase.programsCount} programs</strong></div>
                </div>
              </div>
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
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Customer Operations</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage, diagnose and resolve every active customer case operating across OYEN.</span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Open Cases</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>
            {cases.filter(c => c.status !== "Closed").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Resolved Today</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>0</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Avg Resolution Time</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>45 mins</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Critical Cases</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E15D5D" }}>
            {cases.filter(c => c.priority === "Critical").length}
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
            placeholder="Search cases by subject, organization slug, category..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "Investigating", "Waiting"].map(tab => (
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

      {/* Cases Directory Table */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>CASE ID</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>SUBJECT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>CATEGORY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PRIORITY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>LAST UPDATED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{c.id}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{c.orgName}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B" }}>{c.subject}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{c.category}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: c.priority === "High" ? "rgba(225, 93, 93, 0.12)" : "#FFF7E4",
                    color: c.priority === "High" ? "#E15D5D" : "#D9A928"
                  }}>
                    {c.priority}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem" }}>{c.status}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{c.updated}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setCaseTab("Overview");
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
