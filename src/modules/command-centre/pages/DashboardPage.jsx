import React, { useState, useEffect } from "react";
import { ShieldCheck, Layers, Users, BookOpen, Calendar, HelpCircle, HardDrive, Cpu, Terminal, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    orgName: "ABC Energy Workspace",
    orgSlug: "abc-energy",
    ownerName: "Shola Oyewole",
    ownerEmail: "owner@oyengrid.com",
    plan: "Enterprise Trial",
    status: "Healthy",
    adminCount: 1,
    pmCount: 0,
    facCount: 0,
    learnerCount: 0,
    programs: [],
    totalSessions: 0,
    totalResources: 0,
    storageUsed: "34MB",
    organizations: [],
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const loadEcosystemData = () => {
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

      let pmCount = 0;
      let facCount = 0;
      team.forEach(member => {
        const role = (member.role || "").toLowerCase();
        if (role.includes("program") || role.includes("manager")) pmCount++;
        else if (role.includes("facilitator")) facCount++;
      });

      const totalSessions = programs.reduce((sum, p) => sum + (p.sessions || []).length, 0);
      const totalResources = programs.reduce((sum, p) => sum + (p.resources || []).length, 0);

      const isPrimarySuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";
      const primaryPlan = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise Trial";

      const primaryOrg = {
        name: orgName,
        slug: orgSlug,
        ownerName,
        ownerEmail,
        plan: primaryPlan,
        status: isPrimarySuspended ? "Suspended" : "Active",
        users: String(team.length + learners.length),
        programs: String(programs.length),
        sessions: String(totalSessions),
        created: "June 12, 2026"
      };

      const voltPowerSuspended = localStorage.getItem("oyen_suspended_voltpower-ltd") === "true";
      const voltPowerPlan = localStorage.getItem("oyen_plan_voltpower-ltd") || "Pro";
      
      const secondaryOrg = {
        name: "VoltPower Ltd",
        slug: "voltpower-ltd",
        ownerName: "Sarah Jenkins",
        ownerEmail: "sarah@voltpower.co",
        plan: voltPowerPlan,
        status: voltPowerSuspended ? "Suspended" : "Active",
        users: "52",
        programs: "2",
        sessions: "12",
        created: "March 12, 2026"
      };

      const orgList = [primaryOrg, secondaryOrg];

      setTelemetry({
        orgName,
        orgSlug,
        ownerName,
        ownerEmail,
        plan: primaryPlan,
        status: isPrimarySuspended ? "Suspended" : "Healthy",
        adminCount: 1,
        pmCount,
        facCount,
        learnerCount: learners.length,
        programs,
        totalSessions,
        totalResources,
        storageUsed: `${34 + totalResources * 2}MB`,
        organizations: orgList
      });

      // Calculate Attention Alerts
      const activeAlerts = [];
      if (isPrimarySuspended) activeAlerts.push(`Organization Suspended: ${orgName}`);
      if (voltPowerSuspended) activeAlerts.push(`Organization Suspended: VoltPower Ltd`);
      if (totalSessions === 0) activeAlerts.push(`Storage Warning: No active session logs for ${orgName}`);
      setAlerts(activeAlerts);

      // Audit logs - seed with actual events + actions taken in workspace
      const logs = [
        { time: "10:01", text: "Workspace settings updated", detail: "General configuration" },
        { time: "09:44", text: "Role updated", detail: `${ownerName} assigned as Administrator` },
      ];
      if (programs.length > 0) {
        logs.unshift({ time: "09:30", text: "Program created", detail: programs[0].name });
      }
      if (team.length > 0) {
        logs.unshift({ time: "09:18", text: "Team member invitation created", detail: team[0].email });
      }
      setAuditLogs(logs);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadEcosystemData();
    window.addEventListener("storage", loadEcosystemData);
    return () => window.removeEventListener("storage", loadEcosystemData);
  }, []);

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* SECTION 1 — Platform Status (Hero) */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.25rem 0", color: "#1B1B1B" }}>Platform Status</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#18B67A", fontWeight: 700 }}>● All core services are operational.</p>
          </div>
          <ShieldCheck size={26} color="#18B67A" />
        </div>
        
        {/* Core service indicators grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "1.5rem", fontSize: "0.78rem" }}>
          {[
            { label: "API Gateway", val: "Healthy" },
            { label: "Authentication", val: "Healthy" },
            { label: "Database Core", val: "Healthy" },
            { label: "Asset Storage", val: "Healthy" },
            { label: "SMTP Dispatcher", val: "Healthy" },
            { label: "AI Engines", val: "Healthy" },
            { label: "Background Workers", val: "Healthy" },
            { label: "Live Sessions", val: telemetry.totalSessions > 0 ? "Healthy" : "Healthy" },
          ].map((svc, i) => (
            <div key={i} style={{ border: "1px solid #E6DED0", padding: "0.6rem 0.85rem", borderRadius: "6px", backgroundColor: "#F7F4ED", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6B7280" }}>{svc.label}</span>
              <strong style={{ color: "#18B67A" }}>{svc.val}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 — Needs Attention */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
          Needs Attention
        </span>
        {alerts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {alerts.map((al, idx) => (
              <div key={idx} style={{ fontSize: "0.78rem", color: "#E15D5D", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>●</span>
                <span>{al}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>No operational issues requiring attention.</p>
        )}
      </section>

      {/* Grid wrapper for split panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 3 — Today's Activity */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Today's Activity
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {auditLogs.map((log, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.75rem" }}>
                <span style={{ color: "#6B7280", fontFamily: "monospace", width: "40px" }}>{log.time}</span>
                <div>
                  <strong style={{ color: "#1B1B1B" }}>{log.text}</strong>
                  <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "0.1rem" }}>{log.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 — Ecosystem Snapshot */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            Ecosystem Snapshot
          </span>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.8rem" }}>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>Organizations</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#1B1B1B", marginTop: "0.2rem" }}>{telemetry.organizations.length}</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>Programs</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#1B1B1B", marginTop: "0.2rem" }}>{telemetry.programs.length}</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>Facilitators</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#1B1B1B", marginTop: "0.2rem" }}>{telemetry.facCount}</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>Learners</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#1B1B1B", marginTop: "0.2rem" }}>{telemetry.learnerCount}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 5 — System Health */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          System Health Check
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ color: "#6B7280" }}>Primary SQL Database</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>Connected</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ color: "#6B7280" }}>Email dispatch Dispatchers</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>Operational</strong>
          </div>
          <div>
            <span style={{ color: "#6B7280" }}>Real-time socket clusters</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>Connected</strong>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Pending Reviews */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
          Pending Approvals
        </span>
        <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
          No pending approvals requiring verification.
        </div>
      </section>

      {/* SECTION 7 — Recent Organizations */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Recent Organizations
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {telemetry.organizations.map((org, i) => (
            <div key={i} style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "6px", backgroundColor: "#F7F4ED", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
              <div>
                <strong style={{ color: "#1B1B1B" }}>{org.name}</strong>
                <div style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: "0.15rem" }}>
                  Owner: {org.ownerName} • Plan: {org.plan} • Status: {org.status}
                </div>
              </div>
              <span style={{ color: "#D9A928", fontWeight: 700, fontSize: "0.75rem" }}>Active</span>
            </div>
          ))}
        </div>
      </section>

      {/* Grid: Support & Security */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 8 — Support Overview */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
            Support Queue
          </span>
          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
            No active support tickets.
          </div>
        </div>

        {/* SECTION 9 — Security Overview */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
            Security Events
          </span>
          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
            No active security warnings or failed logins.
          </div>
        </div>

      </div>

      {/* Grid: Background Jobs & Deployments */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 10 — Background Jobs */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Background Tasks
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>SMTP Mail dispatcher</span>
              <strong style={{ color: "#18B67A" }}>Idle</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>AI Summary compiler</span>
              <strong style={{ color: "#18B67A" }}>Idle</strong>
            </div>
          </div>
        </div>

        {/* SECTION 11 — Latest Deployment */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            Deployments Cockpit
          </span>
          <div>Version: <strong>v1.0.0-stable</strong></div>
          <div>Environment: <strong>Production Live</strong></div>
          <div>Commit: <strong style={{ fontFamily: "monospace" }}>bef13d1</strong></div>
        </div>

      </div>

      {/* SECTION 12 — Quick Actions */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Quick Actions Shortcuts
        </span>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => alert("Creating organization...")} style={{ padding: "0.55rem 1rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
            Create Organization
          </button>
          <button onClick={() => alert("Inviting Staff...")} style={{ padding: "0.55rem 1rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
            Invite Internal Staff
          </button>
          <button onClick={() => alert("Redirecting to audit logs...")} style={{ padding: "0.55rem 1rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
            View Audit Logs
          </button>
        </div>
      </section>

    </div>
  );
}
