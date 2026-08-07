import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, Calendar, Download, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, Layers, Play, Cpu } from "lucide-react";

export default function ReleasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeReleaseId, setActiveReleaseId] = useState(null);
  const [releaseTab, setReleaseTab] = useState("Details");
  
  const [releases, setReleases] = useState([]);
  const [assistantFlag, setAssistantFlag] = useState("10%");

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const assistantState = localStorage.getItem("oyen_flag_assistant") || "Enabled";
      setAssistantFlag(assistantState === "Enabled" ? "10%" : "0%");

      const currentRelease = {
        id: "rel_01",
        version: "v2.1.0",
        name: "LMS Tenant Overhaul & AI Command Center",
        status: "Released",
        env: "Production",
        date: "Today, 09:14 AM",
        lead: "Engineering Lead",
        desc: "Upgraded the platform admin panels to full-viewport CRM modules and integrated AI Command centers.",
        features: ["ai_operational_assistant", "attendance_intelligence"],
        duration: "3.5s",
        successRate: "100%",
        approvals: {
          engineering: "Approved",
          qa: "Approved",
          security: "Approved",
          operations: "Approved"
        }
      };

      const secondaryRelease = {
        id: "rel_02",
        version: "v2.0.0",
        name: "Database Cluster Migration",
        status: "Released",
        env: "Production",
        date: "June 12, 2026",
        lead: "Database Ops Lead",
        desc: "Migrated the key workspace configuration metrics and state schemas to a high-availability server setup.",
        features: [],
        duration: "12s",
        successRate: "100%",
        approvals: {
          engineering: "Approved",
          qa: "Approved",
          security: "Approved",
          operations: "Approved"
        }
      };

      setReleases([currentRelease, secondaryRelease]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleRollback = (rel) => {
    if (confirm(`Confirm roll back sequence for release ${rel.version}? This restores production schemas to version ${rel.version === "v2.1.0" ? "v2.0.0" : "v1.9.0"} instantly.`)) {
      alert("Deployment Rollback completed.");
    }
  };

  const activeRelease = releases.find(r => r.id === activeReleaseId);

  const filteredReleases = releases.filter(r => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = r.version.toLowerCase().includes(query) ||
                          r.name.toLowerCase().includes(query) ||
                          r.lead.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Released") return matchesSearch && r.status === "Released";
    return matchesSearch;
  });

  if (activeRelease) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveReleaseId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Releases Registry</span>
        </button>

        {/* Release Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeRelease.name}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeRelease.version}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeRelease.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Environment: <strong>{activeRelease.env}</strong> • Release Lead: {activeRelease.lead} • Completed: {activeRelease.date}
            </div>
          </div>
        </div>

        {/* Tab content split layout */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs Navigation */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Details", "Release Notes", "Deployment", "Feature Rollout", "Testing", "Monitoring"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setReleaseTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: releaseTab === tab ? 700 : 500,
                    color: releaseTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: releaseTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {releaseTab === "Details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
                    <div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Description</span>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#1B1B1B" }}>{activeRelease.desc}</p>
                    </div>

                    <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Release Properties</span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.25rem" }}>
                        <div>Deployment Duration: <strong>{activeRelease.duration}</strong></div>
                        <div>Triggered By: <strong>{activeRelease.lead}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Release Timeline */}
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                      Release Timeline
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                      <div>09:10 AM - <strong>Deployment initialized by Lead</strong></div>
                      <div>09:12 AM - <strong>QA and automated test passes whitelisted</strong></div>
                      <div>09:14 AM - <strong>Production deployment version completed successfully</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {releaseTab === "Release Notes" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.82rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>
                    Release Notes
                  </span>
                  <div>
                    <strong>New Features:</strong>
                    <ul style={{ margin: "0.25rem 0 1rem 0", paddingLeft: "1.2rem" }}>
                      <li>Full viewport CRM modules for workspace managers.</li>
                      <li>AI Command status hearts vector indexes diagnostics logs.</li>
                    </ul>
                  </div>
                </div>
              )}

              {releaseTab === "Deployment" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Deployment Execution Logs</strong>
                  <pre style={{ backgroundColor: "#F7F4ED", padding: "0.75rem", borderRadius: "6px", fontSize: "0.75rem", marginTop: "0.5rem", overflowX: "auto" }}>
                    [09:10] vite build successful...{"\n"}
                    [09:14] client environment version mounted to Production.
                  </pre>
                </div>
              )}

              {releaseTab === "Feature Rollout" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Included Feature Flags</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.50rem", marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                      <span>AI Operational Assistant (ai_operational_assistant)</span>
                      <strong>{assistantFlag} Rollout</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Attendance Intelligence (attendance_intelligence)</span>
                      <strong>50% Rollout</strong>
                    </div>
                  </div>
                </div>
              )}

              {releaseTab === "Testing" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Automated Test Reports</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <div>Automated Test Suite: <strong style={{ color: "#18B67A" }}>Passed (100%)</strong></div>
                    <div>QA Manual Review: <strong style={{ color: "#18B67A" }}>Approved</strong></div>
                  </div>
                </div>
              )}

              {releaseTab === "Monitoring" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#6B7280" }}>
                  <Cpu size={24} style={{ marginBottom: "0.5rem" }} />
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>Post-release telemetry metrics healthy. Platform errors logged: 0</p>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Sidebar Action Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Deployment Controls
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handleRollback(activeRelease)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E15D5D", borderRadius: "6px",
                  backgroundColor: "rgba(225, 93, 93, 0.08)", color: "#E15D5D", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Rollback Release
              </button>

              <div style={{ borderTop: "1px solid #E6DED0", marginTop: "1rem", paddingTop: "1rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>QA Sign-off</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  <div>Engineering: <strong style={{ color: "#18B67A" }}>{activeRelease.approvals.engineering}</strong></div>
                  <div>QA sign-off: <strong style={{ color: "#18B67A" }}>{activeRelease.approvals.qa}</strong></div>
                  <div>Security check: <strong style={{ color: "#18B67A" }}>{activeRelease.approvals.security}</strong></div>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Releases</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Plan, approve, deploy, and monitor software releases across the OYEN Platform.</span>
        </div>
      </div>

      {/* SECTION 1 — Current Release Card */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Current Production Release
        </span>
        {releases.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
            <div>
              <span>Current Production Version</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#D9A928", marginTop: "0.25rem" }}>{releases[0].version}</strong>
            </div>
            <div>
              <span>Release Status</span>
              <strong style={{ display: "block", color: "#18B67A", fontSize: "1.2rem", marginTop: "0.25rem" }}>{releases[0].status}</strong>
            </div>
            <div>
              <span>Completed</span>
              <strong style={{ display: "block", fontSize: "1.2rem", marginTop: "0.25rem" }}>{releases[0].date}</strong>
            </div>
            <div>
              <span>Release Lead</span>
              <strong style={{ display: "block", fontSize: "1.2rem", marginTop: "0.25rem" }}>{releases[0].lead}</strong>
            </div>
          </div>
        ) : (
          <div style={{ color: "#6B7280", fontSize: "0.8rem" }}>No software releases have been created yet.</div>
        )}
      </section>

      {/* SECTION 2 — Release Pipeline */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Release Pipeline Stages
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", fontSize: "0.8rem" }}>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>Planning</strong>
            <div style={{ color: "#6B7280", marginTop: "0.5rem" }}>No active releases in planning.</div>
          </div>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>QA testing</strong>
            <div style={{ color: "#6B7280", marginTop: "0.5rem" }}>No active releases in testing.</div>
          </div>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>Deploying</strong>
            <div style={{ color: "#6B7280", marginTop: "0.5rem" }}>No active deployments.</div>
          </div>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>Completed</strong>
            {releases.map((rel, i) => (
              <div key={i} style={{ marginTop: "0.5rem", fontWeight: 700 }}>{rel.version} ({rel.status})</div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Release History Table */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Release Registry Log
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>VERSION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>RELEASE NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ENVIRONMENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>COMPLETED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>LEAD</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredReleases.map((rel, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{rel.version}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B" }}>{rel.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{rel.env}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: rel.status === "Released" ? "rgba(24, 182, 122, 0.12)" : "rgba(229, 185, 60, 0.12)",
                    color: rel.status === "Released" ? "#18B67A" : "#E5B93C"
                  }}>
                    {rel.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{rel.date}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{rel.lead}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveReleaseId(rel.id);
                      setReleaseTab("Details");
                    }}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    View Release
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
