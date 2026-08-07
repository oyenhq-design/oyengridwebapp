import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, Calendar, Download, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, Layers, Play, Cpu, HardDrive } from "lucide-react";

export default function DeploymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeDeployId, setActiveDeployId] = useState(null);
  const [deployTab, setDeployTab] = useState("Details");
  
  const [deployments, setDeployments] = useState([]);

  const loadDatabase = () => {
    try {
      const currentDeploy = {
        id: "dep_01",
        version: "v2.1.0",
        env: "Production",
        commit: "d719154",
        branch: "main",
        status: "Completed",
        duration: "3.8s",
        triggeredBy: "Engineering Lead",
        timestamp: "Today, 09:14 AM",
        desc: "LMS Tenant Overhaul & AI Command Center integration",
        logs: [
          "[09:10:02] vite build started...",
          "[09:12:15] transforming modules...",
          "[09:13:30] compressing static assets...",
          "[09:14:00] mounting client bundle v2.1.0. Complete."
        ],
        migrations: [
          { name: "20260807_add_iam_rollout", duration: "180ms", status: "Success" }
        ]
      };

      const secondaryDeploy = {
        id: "dep_02",
        version: "v2.0.0",
        env: "Production",
        commit: "ef52232",
        branch: "main",
        status: "Completed",
        duration: "12s",
        triggeredBy: "DevOps Lead",
        timestamp: "June 12, 2026",
        desc: "Database Cluster Migration",
        logs: ["[04:00] migrating schemas to postgreSQL Cluster nodes. Complete."],
        migrations: [
          { name: "20260612_cluster_schemas", duration: "1.2s", status: "Success" }
        ]
      };

      setDeployments([currentDeploy, secondaryDeploy]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleRollback = (dep) => {
    if (confirm(`Confirm immediate rollback sequence for deployment version ${dep.version}? This restores production code target to ${dep.version === "v2.1.0" ? "v2.0.0" : "v1.9.0"} instantly.`)) {
      alert("Deployment Rollback completed.");
    }
  };

  const activeDeploy = deployments.find(d => d.id === activeDeployId);

  const filteredDeploys = deployments.filter(d => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = d.version.toLowerCase().includes(query) ||
                          d.commit.toLowerCase().includes(query) ||
                          d.triggeredBy.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Completed") return matchesSearch && d.status === "Completed";
    return matchesSearch;
  });

  if (activeDeploy) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveDeployId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Deployments Registry</span>
        </button>

        {/* Deploy Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Deployment ID: {activeDeploy.id}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeDeploy.version}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeDeploy.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Commit: <strong style={{ fontFamily: "monospace" }}>{activeDeploy.commit}</strong> ({activeDeploy.branch}) • Triggered By: {activeDeploy.triggeredBy} • Completed: {activeDeploy.timestamp}
            </div>
          </div>
        </div>

        {/* Tab content split layout */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs Navigation */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Details", "Build Pipeline", "Build Logs", "Infrastructure Health", "Database Migrations"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setDeployTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: deployTab === tab ? 700 : 500,
                    color: deployTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: deployTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {deployTab === "Details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
                    <div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Description</span>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#1B1B1B" }}>{activeDeploy.desc}</p>
                    </div>

                    <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Execution Parameters</span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.25rem" }}>
                        <div>Build Duration: <strong>{activeDeploy.duration}</strong></div>
                        <div>Target Environment: <strong>{activeDeploy.env}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Timeline */}
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                      Deployment Timeline
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                      <div>09:10 AM - <strong>Build task queued</strong></div>
                      <div>09:12 AM - <strong>Vite modules build compilation passes</strong></div>
                      <div>09:14 AM - <strong>Production deployment verification checks green</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {deployTab === "Build Pipeline" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.82rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                    Pipeline Build Steps
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>1. Install Dependencies</span>
                      <strong style={{ color: "#18B67A" }}>Completed (12s)</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>2. Compile Build Bundles</span>
                      <strong style={{ color: "#18B67A" }}>Completed (3.8s)</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>3. Static Analysis & Tests</span>
                      <strong style={{ color: "#18B67A" }}>Completed (4s)</strong>
                    </div>
                  </div>
                </div>
              )}

              {deployTab === "Build Logs" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Vite Build Output Stream</strong>
                  <pre style={{ backgroundColor: "#F7F4ED", padding: "0.75rem", borderRadius: "6px", fontSize: "0.75rem", marginTop: "0.5rem", overflowX: "auto" }}>
                    {activeDeploy.logs.join("\n")}
                  </pre>
                </div>
              )}

              {deployTab === "Infrastructure Health" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Service Heartbeats</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.50rem", marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Frontend Static Buckets</span>
                      <strong style={{ color: "#18B67A" }}>● Healthy</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>API Gateways Router</span>
                      <strong style={{ color: "#18B67A" }}>● Healthy</strong>
                    </div>
                  </div>
                </div>
              )}

              {deployTab === "Database Migrations" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Executed Database Migrations</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.50rem", marginTop: "0.75rem" }}>
                    {activeDeploy.migrations.map((mig, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{mig.name}</span>
                        <strong style={{ color: "#18B67A" }}>{mig.status} ({mig.duration})</strong>
                      </div>
                    ))}
                    {activeDeploy.migrations.length === 0 && (
                      <div style={{ color: "#6B7280" }}>No database migrations executed.</div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Sidebar Action Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              DevOps Actions
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handleRollback(activeDeploy)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E15D5D", borderRadius: "6px",
                  backgroundColor: "rgba(225, 93, 93, 0.08)", color: "#E15D5D", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Rollback Deployment
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Deployments</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Monitor deployments, environments, infrastructure health, and deployment history.</span>
        </div>
      </div>

      {/* SECTION 1 — Current Deployment Card */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Current Active Deployment
        </span>
        {deployments.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
            <div>
              <span>Active Version</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#D9A928", marginTop: "0.25rem" }}>{deployments[0].version}</strong>
            </div>
            <div>
              <span>Commit Hash</span>
              <strong style={{ display: "block", fontSize: "1.2rem", marginTop: "0.25rem", fontFamily: "monospace" }}>{deployments[0].commit}</strong>
            </div>
            <div>
              <span>Environment Target</span>
              <strong style={{ display: "block", fontSize: "1.2rem", marginTop: "0.25rem" }}>{deployments[0].env}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong style={{ display: "block", color: "#18B67A", fontSize: "1.2rem", marginTop: "0.25rem" }}>{deployments[0].status}</strong>
            </div>
          </div>
        ) : (
          <div style={{ color: "#6B7280", fontSize: "0.8rem" }}>No deployments have been executed yet.</div>
        )}
      </section>

      {/* SECTION 2 — Environment Status Grid */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Environment Status Grid
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", fontSize: "0.8rem" }}>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>Staging URL</strong>
            <div style={{ color: "#D9A928", marginTop: "0.5rem" }}>staging.oyengrid.com</div>
            <span style={{ fontSize: "0.7rem", color: "#18B67A" }}>● Healthy</span>
          </div>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>Production URL</strong>
            <div style={{ color: "#D9A928", marginTop: "0.5rem" }}>app.oyengrid.com</div>
            <span style={{ fontSize: "0.7rem", color: "#18B67A" }}>● Healthy</span>
          </div>
          <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
            <strong>Development URL</strong>
            <div style={{ color: "#6B7280", marginTop: "0.5rem" }}>localhost:5173</div>
            <span style={{ fontSize: "0.7rem", color: "#18B67A" }}>● Healthy</span>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Deployment History Table */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Deployment History Table
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>DEPLOYMENT ID</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>VERSION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>COMMIT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>DURATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>TRIGGERED BY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>TIMESTAMP</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDeploys.map((dep, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{dep.id}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B" }}>{dep.version}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280", fontFamily: "monospace" }}>{dep.commit}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: dep.status === "Completed" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)",
                    color: dep.status === "Completed" ? "#18B67A" : "#E15D5D"
                  }}>
                    {dep.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{dep.duration}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{dep.triggeredBy}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{dep.timestamp}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveDeployId(dep.id);
                      setDeployTab("Details");
                    }}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    View Details
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
