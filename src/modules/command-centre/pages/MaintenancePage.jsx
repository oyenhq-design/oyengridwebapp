import React, { useState, useEffect } from "react";
import { RefreshCw, Play, ShieldAlert, Cpu, HardDrive, Terminal, ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle, Key } from "lucide-react";

export default function MaintenancePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);
  
  const [systemStats, setSystemStats] = useState({
    activeOrgsCount: 2,
    deploymentsCount: 3,
    scheduledCount: 0
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];

      const totalResources = programs.reduce((sum, p) => sum + (p.resources || []).length, 0);

      const savedMaintenance = localStorage.getItem("oyen_maintenance_enabled") === "true";
      setMaintenanceMode(savedMaintenance);

      setSystemStats({
        activeOrgsCount: 2,
        deploymentsCount: 3,
        scheduledCount: 0
      });

      setActiveJobs([
        { id: "job_01", type: "AI Insight Sync", status: "Completed", lastRun: "Today, 10:21 AM", duration: "1.2s" },
        { id: "job_02", type: "DB Backup Sync", status: "Completed", lastRun: "Today, 04:00 AM", duration: "12s" }
      ]);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleToggleMaintenance = () => {
    if (confirm("Confirm maintenance state override? This updates the public router landing state instantly.")) {
      const nextVal = !maintenanceMode;
      localStorage.setItem("oyen_maintenance_enabled", nextVal ? "true" : "false");
      setMaintenanceMode(nextVal);
      window.dispatchEvent(new Event("storage"));
      alert(`Platform Maintenance Mode set to: ${nextVal ? "ON" : "OFF"}`);
    }
  };

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Maintenance & Platform Operations</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage platform availability, maintenance windows, deployments, and operational services across OYEN.</span>
        </div>
        
        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={handleToggleMaintenance} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#E15D5D", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            Start Maintenance
          </button>
          <button onClick={loadDatabase} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* SECTION 1 — Platform Status */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Platform Health Status
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Platform Status</span>
            <strong style={{ display: "block", color: "#18B67A", fontSize: "1rem", marginTop: "0.25rem" }}>Operational</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Maintenance Mode</span>
            <strong style={{ display: "block", color: maintenanceMode ? "#E15D5D" : "#6B7280", fontSize: "1rem", marginTop: "0.25rem" }}>
              {maintenanceMode ? "Enabled" : "Disabled"}
            </strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Deployments Status</span>
            <strong style={{ display: "block", fontSize: "1rem", marginTop: "0.25rem" }}>Idle</strong>
          </div>
          <div>
            <span>Email Dispatcher</span>
            <strong style={{ display: "block", color: "#18B67A", fontSize: "1rem", marginTop: "0.25rem" }}>Healthy</strong>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Maintenance Windows */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
        <p style={{ margin: 0, fontSize: "0.8rem" }}>No maintenance events have been scheduled.</p>
      </section>

      {/* SECTION 3 — Platform Maintenance Mode Configuration */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          Maintenance Mode Configuration
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Custom Notice Message</label>
            <input type="text" defaultValue="OYEN Platform is currently undergoing system upgrades." style={{ width: "100%", padding: "0.45rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Scope Allocation</label>
            <select style={{ width: "100%", padding: "0.45rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8" }}>
              <option>Entire Platform</option>
              <option>Staging Scope Only</option>
            </select>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Deployments */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Deployment history registry
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>VERSION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>ENVIRONMENT</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>COMPLETED</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #E6DED0" }}>
              <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>v2.1.0</td>
              <td style={{ padding: "0.85rem 1.25rem" }}>Production</td>
              <td style={{ padding: "0.85rem 1.25rem" }}>Today, 09:14 AM</td>
              <td style={{ padding: "0.85rem 1.25rem", color: "#18B67A" }}>Completed</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 5 — Service Health */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Service Health Monitors
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>API Gateway Router</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>● Operational</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Database Node</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>● Operational</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>AI Core Services</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>● Operational</strong>
          </div>
          <div>
            <span>Storage Bucket</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>● Operational</strong>
          </div>
        </div>
      </section>

      {/* Grid: Background Jobs & Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 6 — Background Jobs */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Background Workers Queue
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Queued Jobs</span>
              <strong>0 jobs</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Completed Today</span>
              <strong style={{ color: "#18B67A" }}>{activeJobs.length} completed</strong>
            </div>
          </div>
        </div>

        {/* SECTION 7 — Scheduled Tasks */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1.25rem" }}>
            Cron Tasks Scheduler
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            {activeJobs.map((job, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{job.type}</span>
                <span>{job.lastRun}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 8 — Platform Notifications Broadcaster */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          Broadcast Platform Banner
        </span>
        <textarea placeholder="Broadcasting maintenance alert message..." style={{ width: "100%", height: "80px", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", padding: "0.55rem", boxSizing: "border-box", outline: "none", resize: "none", fontSize: "0.8rem" }} />
        <button onClick={() => alert("Banner alert broadcasted successfully.")} style={{ width: "max-content", padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>Broadcast Notification</button>
      </section>

      {/* SECTION 9 — Operational Logs Timeline */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Operational Logs
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8rem" }}>
          <div>Today, 09:14 AM - <strong>Platform deployment version v2.1.0 completed.</strong></div>
          <div>Today, 08:30 AM - <strong>Operational databases verified online.</strong></div>
        </div>
      </section>

      {/* Grid: Emergency actions & settings */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 10 — Emergency Controls */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
            Emergency Controls
          </span>
          <button 
            onClick={() => {
              if (confirm("Confirm immediate system cache flush? This affects active user queries.")) {
                alert("Platform Cache cleared.");
              }
            }}
            style={{ width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", textAlign: "left" }}
          >
            Flush Memory Cache
          </button>
          <button 
            onClick={() => {
              if (confirm("Confirm immediate background workers restart sequence?")) {
                alert("Workers restarted.");
              }
            }}
            style={{ width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", textAlign: "left" }}
          >
            Restart Background Workers
          </button>
        </div>

        {/* SECTION 11 — Maintenance History */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", textAlign: "left", marginBottom: "1.25rem" }}>
            Completed Upgrades History
          </span>
          <p style={{ margin: 0, fontSize: "0.8rem", padding: "1rem" }}>No maintenance events have been scheduled.</p>
        </div>

      </div>

      {/* SECTION 12 — Operational Settings */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          Operations Settings
        </span>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Estimated Maintenance Display Duration</span>
          <strong>60 mins</strong>
        </div>
      </section>

      {/* SECTION 13 — Audit Trail */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Operations Audit Trail
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>TIMESTAMP</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>ACTION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>PERFORMED BY</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #E6DED0" }}>
              <td style={{ padding: "0.85rem 1.25rem" }}>Today, 09:14 AM</td>
              <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Version deployment v2.1.0 executed</td>
              <td style={{ padding: "0.85rem 1.25rem" }}>System Operator</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
