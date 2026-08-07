import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, Calendar, Download, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, Layers, Play, Cpu, Globe, Users } from "lucide-react";

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeEmployeeId, setActiveEmployeeId] = useState(null);
  const [teamTab, setTeamTab] = useState("Details");
  
  const [employees, setEmployees] = useState([]);

  const loadDatabase = () => {
    try {
      const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
      const ownerFirstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
      const ownerLastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";

      const staffPrimary = {
        id: "emp_01",
        name: `${ownerFirstName} ${ownerLastName}`,
        email: ownerEmail,
        title: "Chief Executive Officer",
        dept: "Executive",
        status: "Active",
        role: "Platform Super Admin",
        location: "Lagos, Nigeria",
        joined: "June 12, 2026",
        lastActive: "Just now",
        phone: "+234 809 123 4567",
        manager: "Board of Directors",
        type: "Full-Time",
        permissions: ["Command Centre", "Security", "Deployments", "Releases", "FeatureFlags"],
        ownership: {
          flag: "ai_operational_assistant",
          workspace: "ABC Energy Workspace"
        }
      };

      const staffSecondary = {
        id: "emp_02",
        name: "Temi Alao",
        email: "temi@oyengrid.com",
        title: "Engineering Lead",
        dept: "Engineering",
        status: "Active",
        role: "Operator",
        location: "Remote, Nigeria",
        joined: "June 15, 2026",
        lastActive: "Today, 10:14 AM",
        phone: "+234 809 987 6543",
        manager: `${ownerFirstName} ${ownerLastName}`,
        type: "Full-Time",
        permissions: ["Deployments", "Releases", "FeatureFlags"],
        ownership: {
          flag: "attendance_intelligence",
          workspace: "VoltPower Ltd"
        }
      };

      setEmployees([staffPrimary, staffSecondary]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleUpdatePermission = (emp, perm) => {
    if (confirm(`Confirm permission adjust for ${emp.name}? This writes directly to production audit log records.`)) {
      alert("Employee permissions updated.");
    }
  };

  const activeEmp = employees.find(e => e.id === activeEmployeeId);

  const filteredEmployees = employees.filter(e => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = e.name.toLowerCase().includes(query) ||
                          e.email.toLowerCase().includes(query) ||
                          e.title.toLowerCase().includes(query) ||
                          e.dept.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Active") return matchesSearch && e.status === "Active";
    return matchesSearch;
  });

  if (activeEmp) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveEmployeeId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Company Directory</span>
        </button>

        {/* Employee Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#E6DED0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800 }}>
                {activeEmp.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeEmp.name}</h3>
                <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>{activeEmp.email}</span>
              </div>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeEmp.title}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: activeEmp.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)", color: activeEmp.status === "Active" ? "#18B67A" : "#E15D5D", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeEmp.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Department: <strong>{activeEmp.dept}</strong> • Joined: {activeEmp.joined} • Employee ID: <span style={{ fontFamily: "monospace" }}>{activeEmp.id}</span>
            </div>
          </div>
        </div>

        {/* split layouts */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs Navigation */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Details", "Permissions", "Ownership", "Activity", "Workload"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTeamTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: teamTab === tab ? 700 : 500,
                    color: teamTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: teamTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {teamTab === "Details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
                    <div>Location: <strong>{activeEmp.location}</strong></div>
                    <div>Phone: <strong>{activeEmp.phone}</strong></div>
                    <div>Reports To: <strong>{activeEmp.manager}</strong></div>
                    <div>Employment Type: <strong>{activeEmp.type}</strong></div>
                  </div>
                </div>
              )}

              {teamTab === "Permissions" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Assigned System Permissions</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                    {["Command Centre", "Security", "Deployments", "Releases", "FeatureFlags"].map(perm => (
                      <div key={perm} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                        <span>{perm} access</span>
                        <button onClick={() => handleUpdatePermission(activeEmp, perm)} style={{ background: "none", border: "none", color: "#E15D5D", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700 }}>
                          Revoke Access
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {teamTab === "Ownership" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Operational Ownership Mappings</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                    <div>Feature Flag Owner: <strong style={{ fontFamily: "monospace" }}>{activeEmp.ownership.flag}</strong></div>
                    <div>Workspace Lead: <strong style={{ fontFamily: "monospace" }}>{activeEmp.ownership.workspace}</strong></div>
                  </div>
                </div>
              )}

              {teamTab === "Activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "09:14 AM", action: `Approved production deployment version v2.1.0`, meta: "Release logs" }
                  ].map((act, i) => (
                    <div key={i} style={{ padding: "0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{act.time} - <strong>{act.action}</strong></span>
                      <span style={{ color: "#6B7280" }}>{act.meta}</span>
                    </div>
                  ))}
                </div>
              )}

              {teamTab === "Workload" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Current Workload Tasks</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                    <div>Open Support Cases: <strong>0 cases</strong></div>
                    <div>Pending Approvals: <strong>0 approvals</strong></div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Sidebar Action Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              HR Actions
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => alert("Staging department transfer workflow...")}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Transfer Department
              </button>

              <button 
                onClick={() => {
                  if(confirm("Confirm internal account suspension? This locks access instantly.")) {
                    alert("Account suspended.");
                  }
                }}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E15D5D", borderRadius: "6px",
                  backgroundColor: "rgba(225, 93, 93, 0.08)", color: "#E15D5D", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Suspend Account
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
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Team</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage OYEN employees, departments, roles, permissions, and internal responsibilities.</span>
        </div>
      </div>

      {/* SECTION 1 — Company Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Total Employees</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{employees.length}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Active Employees</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>
            {employees.filter(e => e.status === "Active").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Departments</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>2</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Pending Invitations</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>0</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Suspended Accounts</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E15D5D" }}>0</h4>
        </div>
      </div>

      {/* Main Table grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Internal Employee Registry
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>JOB TITLE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>DEPARTMENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ROLE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>LOCATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{emp.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B" }}>{emp.title}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{emp.dept}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{emp.role}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A"
                  }}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{emp.location}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveEmployeeId(emp.id);
                      setTeamTab("Details");
                    }}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    Open
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
