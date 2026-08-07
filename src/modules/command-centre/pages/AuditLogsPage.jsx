import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, Calendar, Download, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [activeEventId, setActiveEventId] = useState(null);
  
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    criticalEvents: 0,
    failedOps: 0,
    todayActivity: 0
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];

      const parsedEvents = [];

      // Event 1: Program Created
      programs.forEach((prog, i) => {
        parsedEvents.push({
          id: `ev_p_${i}`,
          timestamp: "Today, 10:21 AM",
          user: localStorage.getItem("oyen_owner_first_name") || "Shola Oyewole",
          email: localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com",
          role: "Platform Super Admin",
          orgName: orgName,
          workspace: orgSlug,
          module: "Programs",
          action: "Created Program",
          resource: prog.name,
          objectId: prog.id || `prog_${i}`,
          result: "Success",
          ip: "197.210.64.12",
          browser: "Chrome v120",
          device: "MacBook Pro",
          before: "Draft State",
          after: `Program: ${prog.name} (Active)`,
          severity: "Information"
        });
      });

      // Event 2: Operator Logged In
      parsedEvents.push({
        id: "ev_auth_01",
        timestamp: "Today, 08:30 AM",
        user: "System Operator",
        email: "operator@oyengrid.com",
        role: "Operator",
        orgName: orgName,
        workspace: orgSlug,
        module: "Authentication",
        action: "User Login",
        resource: "Console Access",
        objectId: "auth_sys",
        result: "Success",
        ip: "192.168.1.1",
        browser: "Chrome v120",
        device: "Linux Workstation",
        before: "Offline",
        after: "Online Session",
        severity: "Information"
      });

      // VoltPower Subscription Created
      parsedEvents.push({
        id: "ev_bill_01",
        timestamp: "Yesterday, 04:30 PM",
        user: "Sarah Jenkins",
        email: "sarah@voltpower.co",
        role: "Organization Administrator",
        orgName: "VoltPower Ltd",
        workspace: "voltpower-ltd",
        module: "Billing",
        action: "Subscription Started",
        resource: "Pro Plan Subscription",
        objectId: "sub_vp_01",
        result: "Success",
        ip: "10.0.0.45",
        browser: "Firefox v119",
        device: "Windows Desktop",
        before: "None (Free Trial)",
        after: "Active Pro Subscription",
        severity: "Information"
      });

      setEvents(parsedEvents);

      setStats({
        totalEvents: parsedEvents.length,
        criticalEvents: parsedEvents.filter(e => e.severity === "Critical").length,
        failedOps: parsedEvents.filter(e => e.result === "Failed").length,
        todayActivity: parsedEvents.filter(e => e.timestamp.includes("Today")).length
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

  const activeEvent = events.find(e => e.id === activeEventId);

  const filteredEvents = events.filter(e => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = e.user.toLowerCase().includes(query) ||
                          e.action.toLowerCase().includes(query) ||
                          e.resource.toLowerCase().includes(query) ||
                          e.module.toLowerCase().includes(query);
    
    const matchesSeverity = severityFilter === "all" ? true : e.severity === severityFilter;
    const matchesModule = moduleFilter === "all" ? true : e.module === moduleFilter;

    return matchesSearch && matchesSeverity && matchesModule;
  });

  if (activeEvent) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveEventId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Audit Logs Directory</span>
        </button>

        {/* Header Details */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeEvent.action}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeEvent.module}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeEvent.result}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Timestamp: <strong>{activeEvent.timestamp}</strong> • Actor: {activeEvent.user} ({activeEvent.email})
            </div>
          </div>
        </div>

        {/* Change Comparison split layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "3rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Event Metadata details */}
            <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
              <div>Resource Type: <strong>{activeEvent.module}</strong></div>
              <div>Object ID: <strong style={{ fontFamily: "monospace" }}>{activeEvent.objectId}</strong></div>
              <div>Actor IP: <strong style={{ fontFamily: "monospace" }}>{activeEvent.ip}</strong></div>
              <div>Browser / Client: <strong>{activeEvent.browser}</strong></div>
              <div>Target Workspace: <strong style={{ fontFamily: "monospace" }}>{activeEvent.workspace}</strong></div>
              <div>Target Organization: <strong>{activeEvent.orgName}</strong></div>
            </div>

            {/* Change Comparison panel */}
            <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                Ledger Change Comparison
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", fontSize: "0.8rem" }}>
                <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
                  <span style={{ color: "#6B7280" }}>Before Value</span>
                  <pre style={{ margin: "0.25rem 0 0 0", whiteSpace: "pre-wrap", fontFamily: "monospace", color: "#E15D5D" }}>{activeEvent.before}</pre>
                </div>
                <div>
                  <span style={{ color: "#6B7280" }}>After Value</span>
                  <pre style={{ margin: "0.25rem 0 0 0", whiteSpace: "pre-wrap", fontFamily: "monospace", color: "#18B67A" }}>{activeEvent.after}</pre>
                </div>
              </div>
            </div>

          </div>

          {/* Right sidebar details */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Actor Context
            </h4>
            <div>Name: <strong>{activeEvent.user}</strong></div>
            <div>Role: <strong>{activeEvent.role}</strong></div>
            <div>Device: <strong>{activeEvent.device}</strong></div>
            <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "1rem" }}>
              <span style={{ color: "#6B7280", fontSize: "0.7rem" }}>All audit log operations are strictly immutable and cannot be backdated or overwrote.</span>
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
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Audit Logs</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>View the complete history of operational activity across the OYEN Platform.</span>
        </div>

        {/* Top actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => alert("Generating compliance audits...")} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            Compliance Report
          </button>
          <button onClick={() => alert("Exporting audit CSV...")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
            <Download size={14} />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Total Events</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{stats.totalEvents}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Critical Events</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E15D5D" }}>{stats.criticalEvents}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Failed Operations</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{stats.failedOps}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Today's Activity</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>{stats.todayActivity}</h4>
        </div>
      </div>

      {/* Action Bar controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search logs by actor, organization, action..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Severity Filters */}
        <select 
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none" }}
        >
          <option value="all">All Severities</option>
          <option value="Information">Information</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>

        {/* Module Filters */}
        <select 
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none" }}
        >
          <option value="all">All Modules</option>
          <option value="Programs">Programs</option>
          <option value="Authentication">Authentication</option>
          <option value="Billing">Billing</option>
        </select>
      </div>

      {/* Main Table logs registry */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>TIMESTAMP</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>USER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>MODULE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ACTION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>RESOURCE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>RESULT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((ev, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem" }}>{ev.timestamp}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700 }}>{ev.user}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ev.orgName}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ev.module}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 600 }}>{ev.action}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{ev.resource}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: ev.result === "Success" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)",
                    color: ev.result === "Success" ? "#18B67A" : "#E15D5D"
                  }}>
                    {ev.result}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => setActiveEventId(ev.id)}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    View
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
