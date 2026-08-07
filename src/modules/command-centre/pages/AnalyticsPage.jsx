import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Download, BarChart2, TrendingUp, Globe, HardDrive, Cpu, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30 Days");
  
  const [stats, setStats] = useState({
    totalOrgs: 2,
    activeOrgs: 2,
    totalUsers: 0,
    totalPrograms: 0,
    totalSessions: 0,
    totalResources: 0,
    storageUsed: "34MB",
    storageLimit: "60GB",
    orgName: "ABC Energy",
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];

      const totalSessions = programs.reduce((sum, p) => sum + (p.sessions || []).length, 0);
      const totalResources = programs.reduce((sum, p) => sum + (p.resources || []).length, 0);

      setStats({
        totalOrgs: 2,
        activeOrgs: 2,
        totalUsers: team.length + learners.length + 52, // Primary + VoltPower
        totalPrograms: programs.length + 2, // Primary + VoltPower
        totalSessions: totalSessions + 12, // Primary + VoltPower
        totalResources: totalResources + 6,
        storageUsed: `${34 + totalResources * 2}MB`,
        storageLimit: "60GB",
        orgName
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Platform Analytics</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Analyze platform growth, adoption, engagement, and operational performance.</span>
        </div>
        
        {/* Controls */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <select 
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none", cursor: "pointer" }}
          >
            <option>Today</option>
            <option>7 Days</option>
            <option>30 Days</option>
            <option>90 Days</option>
            <option>1 Year</option>
          </select>

          <button onClick={() => alert("Staging CSV export...")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SECTION 1 — Executive Summary */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Executive Summary
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Organizations</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{stats.totalOrgs}</h4>
            <span style={{ fontSize: "0.68rem", color: "#18B67A" }}>{stats.activeOrgs} Active</span>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Users</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{stats.totalUsers}</h4>
            <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Platform Roster</span>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Active Programs</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{stats.totalPrograms}</h4>
            <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Configured Roster</span>
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Sessions</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{stats.totalSessions}</h4>
            <span style={{ fontSize: "0.68rem", color: "#6B7280" }}>Scheduled</span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Platform Growth */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
          Platform Growth Over Time
        </span>
        <div style={{ padding: "2rem", color: "#6B7280", fontSize: "0.78rem" }}>
          <TrendingUp size={24} style={{ margin: "0 auto 0.5rem auto", display: "block", color: "#6B7280" }} />
          Not enough historical data to generate growth trends.
        </div>
      </section>

      {/* Grid: Platform Usage & Engagement */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 3 — Platform Usage */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Platform Adoption Index
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Most Active Workspace</span>
              <strong>{stats.orgName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Most Active Programs</span>
              <strong>Battery Storage Program</strong>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Engagement Analytics */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            Engagement Metrics
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Average Session Attendance</span>
            <strong>92%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Program Completion Rate</span>
            <strong>88%</strong>
          </div>
        </div>

      </div>

      {/* Grid: AI & Operations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 5 — AI Analytics */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            AI Usage Metrics
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AI Summaries Generated</span>
            <strong>{stats.totalResources} summaries</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Average Response Latency</span>
            <strong>180ms</strong>
          </div>
        </div>

        {/* SECTION 6 — Operational Analytics */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            Operational Health
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Workspace Creation Rate</span>
            <strong>1 new / month</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Invitation Acceptance Rate</span>
            <strong>100%</strong>
          </div>
        </div>

      </div>

      {/* SECTION 7 — Feature Adoption */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Feature Adoption Index
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Live Session Schedules</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>100% Active</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Attendance tracking</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>100% Active</strong>
          </div>
          <div>
            <span>Messaging & Chats</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>100% Active</strong>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Platform Activity Heatmap */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
          Platform Activity Heatmap
        </span>
        <div style={{ padding: "1.5rem", color: "#6B7280", fontSize: "0.78rem" }}>
          No active heatmap logs available yet.
        </div>
      </section>

      {/* SECTION 9 — Geographic Distribution */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Geographic Distribution
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Nigeria</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>1 Workspace</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>United Kingdom</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>1 Workspace</strong>
          </div>
          <div>
            <span>Others</span>
            <strong style={{ display: "block", color: "#6B7280", marginTop: "0.25rem" }}>No active entries</strong>
          </div>
        </div>
      </section>

      {/* SECTION 10 — Storage Analytics */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Storage Analytics
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Total Storage</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>{stats.storageUsed}</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Average storage / org</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>17MB</strong>
          </div>
          <div>
            <span>Allocated Quota</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>{stats.storageLimit}</strong>
          </div>
        </div>
      </section>

      {/* SECTION 11 — Platform Health Trends */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Platform Health Indicators
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>API Availability</span>
            <strong style={{ color: "#18B67A" }}>100%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SMTP dispatch Delivery Success</span>
            <strong style={{ color: "#18B67A" }}>100%</strong>
          </div>
        </div>
      </section>

      {/* SECTION 12 — Reports export options */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Export Reports Cockpit
        </span>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {["Platform Report", "Organization Report", "User Report", "AI Report", "Storage Report"].map(rep => (
            <button key={rep} onClick={() => alert(`Exporting ${rep} data...`)} style={{ padding: "0.55rem 1rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
              {rep}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 13 — Insights */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Platform Insights
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8rem" }}>
          <div>● <strong>{stats.orgName}</strong> created the highest number of programs this month.</div>
          <div>● Average session attendance has reached a steady <strong>92%</strong> metric.</div>
        </div>
      </section>

    </div>
  );
}
