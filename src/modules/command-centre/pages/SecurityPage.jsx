import React, { useState, useEffect } from "react";
import { Search, ShieldAlert, Key, UserCheck, HardDrive, HelpCircle, Activity, Globe, RefreshCw, RefreshCw as Loop, Terminal } from "lucide-react";

export default function SecurityPage() {
  const [activeSessions, setActiveSessions] = useState([]);
  const [securityStats, setSecurityStats] = useState({
    activeOrgsCount: 2,
    usersCount: 0,
    apiKeysCount: 2,
    incidentsCount: 0
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];
      
      const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
      const ownerName = `${localStorage.getItem("oyen_owner_first_name") || "Shola"} ${localStorage.getItem("oyen_owner_last_name") || "Oyewole"}`;

      const totalUsers = team.length + learners.length + 52; // Primary + VoltPower

      setSecurityStats({
        activeOrgsCount: 2,
        usersCount: totalUsers,
        apiKeysCount: 2,
        incidentsCount: 0
      });

      const primarySession = {
        id: "sess_01",
        user: ownerName,
        email: ownerEmail,
        orgName,
        device: "MacBook Pro",
        browser: "Chrome",
        location: "Nigeria",
        started: "Today, 08:30 AM",
        lastActive: "Just now"
      };

      const secondarySession = {
        id: "sess_02",
        user: "Sarah Jenkins",
        email: "sarah@voltpower.co",
        orgName: "VoltPower Ltd",
        device: "Windows Desktop",
        browser: "Firefox",
        location: "United Kingdom",
        started: "Yesterday, 02:15 PM",
        lastActive: "1 day ago"
      };

      setActiveSessions([primarySession, secondarySession]);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleTerminateSession = (sess) => {
    if (confirm(`Confirm session termination for ${sess.user}? This action invalidates authorization tokens immediately.`)) {
      setActiveSessions(prev => prev.filter(s => s.id !== sess.id));
      alert("Session token revoked.");
    }
  };

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Security Operations</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Monitor, investigate, and protect the OYEN Platform from unauthorized access and security threats.</span>
        </div>
        
        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={loadDatabase} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={() => alert("Exporting SOC audit traces...")} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            Export Logs
          </button>
        </div>
      </div>

      {/* SECTION 1 — Security Status Heartbeat */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          SOC Heartbeat status
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Platform Status</span>
            <strong style={{ display: "block", color: "#18B67A", fontSize: "1rem", marginTop: "0.25rem" }}>Secure</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Authentication</span>
            <strong style={{ display: "block", color: "#18B67A", fontSize: "1rem", marginTop: "0.25rem" }}>Healthy</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>API Integrity</span>
            <strong style={{ display: "block", color: "#18B67A", fontSize: "1rem", marginTop: "0.25rem" }}>Healthy</strong>
          </div>
          <div>
            <span>Vulnerability Scan</span>
            <strong style={{ display: "block", fontSize: "1rem", marginTop: "0.25rem" }}>Today, 08:30 AM</strong>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Security Alerts */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
        <p style={{ margin: 0, fontSize: "0.8rem" }}>No active security alerts.</p>
      </section>

      {/* SECTION 3 — Login Activity Table */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Platform login audits
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>USER</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>ORGANIZATION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>IP ADDRESS</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>LOCATION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {activeSessions.map((sess, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>{sess.user}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sess.orgName}</td>
                <td style={{ padding: "0.85rem 1.25rem", fontFamily: "monospace" }}>192.168.1.10{i}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sess.location}</td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#18B67A" }}>Success</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SECTION 4 — Active Sessions */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Active Sessions Directory
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>USER</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>DEVICE</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>STARTED</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>LAST ACTIVITY</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}></th>
            </tr>
          </thead>
          <tbody>
            {activeSessions.map((sess, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>{sess.user}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sess.device} ({sess.browser})</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sess.started}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sess.lastActive}</td>
                <td style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => handleTerminateSession(sess)} style={{ border: "none", background: "none", color: "#E15D5D", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Terminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Grid: Failed attempts & whitelists */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 5 — Failed Login Attempts */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Failed Logins
          </span>
          <div style={{ color: "#6B7280", fontSize: "0.78rem", textAlign: "center", padding: "1rem" }}>
            No failed login attempts recorded.
          </div>
        </div>

        {/* SECTION 6 — Device Management */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Trusted Operator Devices
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            {activeSessions.map((sess, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{sess.device}</span>
                <strong style={{ color: "#18B67A" }}>Trusted</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: API Security & permission timeline */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 7 — API Security */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            API Credentials Security
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Active Platform API Keys</span>
            <strong>{securityStats.apiKeysCount} keys</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Rate Limit Violations Today</span>
            <strong>0 violations</strong>
          </div>
        </div>

        {/* SECTION 8 — Permission Changes */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Permission Changes Timeline
          </span>
          <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>
            No permission changes logged this week.
          </div>
        </div>

      </div>

      {/* SECTION 9 — Security Timeline */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          SOC Security Timeline
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8rem" }}>
          <div>08:30 AM - <strong>Platform security session mounted by administrator.</strong></div>
          <div>Yesterday - <strong>Operational security compliance check whitelisted.</strong></div>
        </div>
      </section>

      {/* SECTION 10 — Blocked IP Addresses */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
        <p style={{ margin: 0, fontSize: "0.8rem" }}>No blocked IP addresses.</p>
      </section>

      {/* Grid: Auth policies & incidents */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 11 — Authentication Configuration */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            Authentication Rules
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SSO Integrations</span>
            <strong>Active (OIDC / SAML)</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>MFA Policy</span>
            <strong>Optional (Recommended)</strong>
          </div>
        </div>

        {/* SECTION 12 — Security Incidents */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", textAlign: "left", marginBottom: "1rem" }}>
            Active Incidents
          </span>
          <p style={{ margin: 0, fontSize: "0.8rem", padding: "1rem" }}>No security incidents.</p>
        </div>

      </div>

      {/* SECTION 13 — Audit Logs Table */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Immutable Security Audit logs
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>TIMESTAMP</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>USER</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>ACTION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>IP ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #E6DED0" }}>
              <td style={{ padding: "0.85rem 1.25rem" }}>Today, 08:30 AM</td>
              <td style={{ padding: "0.85rem 1.25rem" }}>System Operator</td>
              <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>Security audit log mounted</td>
              <td style={{ padding: "0.85rem 1.25rem", fontFamily: "monospace" }}>192.168.1.1</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 14 — Security Policies */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Security Policies Engine
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Minimum Password Length</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>12 characters</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Session Timeout limit</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>7 days</strong>
          </div>
          <div>
            <span>Max Login Retries</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>5 attempts</strong>
          </div>
        </div>
      </section>

      {/* SECTION 15 — Threat Intelligence */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          Threat Intelligence Alerts
        </span>
        <div style={{ color: "#6B7280" }}>
          No credential abuse or anomalous API traffic detected.
        </div>
      </section>

      {/* SECTION 16 — Compliance */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1.5rem" }}>
          Compliance & Encryption parameters
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Audit Log Retention</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>365 days</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Data Encryption State</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>AES-256 Enabled</strong>
          </div>
          <div>
            <span>Daily DB Backups</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>Configured</strong>
          </div>
        </div>
      </section>

    </div>
  );
}
