import React, { useState, useEffect } from "react";
import { Search, ChevronRight, HelpCircle, Save, ShieldAlert, Cpu, Layers, Play, Key, Users, Globe } from "lucide-react";

export default function CompanyPage() {
  const [currentSubTab, setCurrentSubTab] = useState("Organization");
  const [activeEmployeeId, setActiveEmployeeId] = useState(null);
  const [employeeSubTab, setEmployeeSubTab] = useState("Overview");

  // Company Form State
  const [companyName, setCompanyName] = useState("OYEN Group");
  const [legalName, setLegalName] = useState("OYEN Technologies Ltd");
  const [primaryDomain, setPrimaryDomain] = useState("oyengrid.com");
  const [appDomain, setAppDomain] = useState("app.oyengrid.com");
  const [ccDomain, setCcDomain] = useState("admin.oyengrid.com");
  const [supportEmail, setSupportEmail] = useState("support@oyengrid.com");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [country, setCountry] = useState("Nigeria");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});

  const loadDatabase = () => {
    try {
      const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
      const ownerFirstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
      const ownerLastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";

      // Employee 1: CEO
      const emp1 = {
        id: "emp_01",
        name: `${ownerFirstName} ${ownerLastName}`,
        email: ownerEmail,
        title: "Founder & CEO",
        dept: "Leadership",
        role: "Platform Founder",
        manager: "Board of Directors",
        type: "Full-time",
        joined: "June 12, 2026",
        status: "Active",
        phone: "+234 809 123 4567",
        ownership: ["Platform", "Security", "Deployments", "Releases"],
        activity: ["Created Organization", "Approved Deployment v2.1.0"],
        device: { browser: "Chrome v120", os: "macOS", location: "Lagos, Nigeria", ip: "197.210.64.12" },
        security: { mfa: "Enabled", recovery: "recovery@oyengrid.com" }
      };

      // Employee 2: CTO
      const emp2 = {
        id: "emp_02",
        name: "Temi Alao",
        email: "temi@oyengrid.com",
        title: "Co-Founder & CTO",
        dept: "Engineering",
        role: "Engineering Lead",
        manager: `${ownerFirstName} ${ownerLastName}`,
        type: "Full-time",
        joined: "June 15, 2026",
        status: "Active",
        phone: "+234 809 987 6543",
        ownership: ["AI Command", "FeatureFlags", "Infrastructure"],
        activity: ["Approved Deployment v2.0.0"],
        device: { browser: "Firefox v119", os: "Linux", location: "Remote, Nigeria", ip: "192.168.1.1" },
        security: { mfa: "Enabled", recovery: "recovery-temi@oyengrid.com" }
      };

      setEmployees([emp1, emp2]);

      setDepartments([
        { name: "Leadership", manager: emp1.name, count: 1 },
        { name: "Engineering", manager: emp2.name, count: 1 },
        { name: "Product", manager: "None Assigned", count: 0 },
        { name: "Operations", manager: "None Assigned", count: 0 },
        { name: "Support", manager: "None Assigned", count: 0 },
        { name: "Finance", manager: "None Assigned", count: 0 },
        { name: "AI", manager: "None Assigned", count: 0 },
        { name: "Marketing", manager: "None Assigned", count: 0 },
        { name: "Legal", manager: "None Assigned", count: 0 },
        { name: "HR", manager: "None Assigned", count: 0 }
      ]);

      setRoles([
        { name: "Platform Founder", desc: "Permanent system admin role. Access to all operational parameters.", modules: "All Modules" },
        { name: "Engineering Lead", desc: "Manages deployments, releases, and feature flags.", modules: "DevOps, Releases, Flags" },
        { name: "Product Manager", desc: "Evaluates experiments and target flags.", modules: "Experiments, Flags" }
      ]);

      setPermissions({
        "Organizations": ["Read", "Create", "Manage Settings"],
        "Workspaces": ["Read", "Archive", "Override Limits"],
        "Security": ["Read SOC", "Terminate Session", "IP Block"],
        "Deployments": ["Trigger Build", "Rollback Release"]
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

  const handleSaveCompany = () => {
    alert("Company configuration details saved successfully.");
  };

  const activeEmp = employees.find(e => e.id === activeEmployeeId);

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Foundation</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage OYEN employees, departments, roles, permissions, and internal responsibilities.</span>
      </div>

      {/* Sub navigation bar */}
      <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
        {["Organization", "Team", "Departments", "Roles", "Permissions", "Org Chart"].map(sub => (
          <button
            key={sub}
            onClick={() => {
              setCurrentSubTab(sub);
              setActiveEmployeeId(null); // Close profiles if switching tabs
            }}
            style={{
              background: "none", border: "none", cursor: "pointer", fontWeight: currentSubTab === sub ? 700 : 500,
              color: currentSubTab === sub ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
              borderBottom: currentSubTab === sub ? "2px solid #D9A928" : "none"
            }}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Primary Sub Tabs Views */}
      <div style={{ minHeight: "400px" }}>
        
        {/* VIEW 1: Organization Page */}
        {currentSubTab === "Organization" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px" }}>
              Company Information
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Company Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Legal Name</label>
                <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Primary Domain</label>
                <input type="text" value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>App Domain</label>
                <input type="text" value={appDomain} onChange={e => setAppDomain(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Command Centre Domain</label>
                <input type="text" value={ccDomain} onChange={e => setCcDomain(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Support Email Address</label>
                <input type="text" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Time Zone</label>
                <input type="text" value={timezone} onChange={e => setTimezone(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Country</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
              </div>
            </div>

            <button onClick={handleSaveCompany} style={{ width: "max-content", alignSelf: "flex-end", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
              <Save size={14} />
              <span>Save Configuration</span>
            </button>
          </div>
        )}

        {/* VIEW 2: Team Directory (Includes Employee Profiles Viewport) */}
        {currentSubTab === "Team" && (
          <div>
            {!activeEmp ? (
              <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
                  Employee Directory
                </span>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>NAME</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>POSITION</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DEPARTMENT</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>ROLE</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>STATUS</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700 }}>{emp.name}</td>
                        <td style={{ padding: "1.1rem 1.25rem" }}>{emp.title}</td>
                        <td style={{ padding: "1.1rem 1.25rem" }}>{emp.dept}</td>
                        <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{emp.role}</td>
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                            {emp.status}
                          </span>
                        </td>
                        <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                          <button onClick={() => { setActiveEmployeeId(emp.id); setEmployeeSubTab("Overview"); }} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700 }}>
                            Open Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "1.5rem", borderTop: "1px solid #E6DED0", fontSize: "0.78rem", color: "#6B7280", textAlign: "center" }}>
                  Only the founding team has been added.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* Profile Header */}
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  <button onClick={() => setActiveEmployeeId(null)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, padding: 0 }}>
                    ← Back
                  </button>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>{activeEmp.name}</div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                    {activeEmp.role}
                  </span>
                </div>

                {/* Profile Sub navigation */}
                <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #E6DED0", fontSize: "0.8rem" }}>
                  {["Overview", "Permissions", "Ownership", "Activity", "Devices", "Security"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setEmployeeSubTab(tab)}
                      style={{
                        background: "none", border: "none", cursor: "pointer", fontWeight: employeeSubTab === tab ? 700 : 500,
                        color: employeeSubTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.4rem",
                        borderBottom: employeeSubTab === tab ? "2px solid #D9A928" : "none"
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Profile Tabs content */}
                <div style={{ minHeight: "200px" }}>
                  
                  {employeeSubTab === "Overview" && (
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
                      <div>Position: <strong>{activeEmp.title}</strong></div>
                      <div>Department: <strong>{activeEmp.dept}</strong></div>
                      <div>Manager: <strong>{activeEmp.manager}</strong></div>
                      <div>Joined: <strong>{activeEmp.joined}</strong></div>
                      <div>Email: <strong>{activeEmp.email}</strong></div>
                      <div>Phone: <strong>{activeEmp.phone}</strong></div>
                    </div>
                  )}

                  {employeeSubTab === "Permissions" && (
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                      <strong>Inherited Permissions via Role: {activeEmp.role}</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1rem" }}>
                        {activeEmp.permissions.map(perm => (
                          <div key={perm} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                            <span>{perm} Modules Access</span>
                            <strong style={{ color: "#18B67A" }}>Inherited</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {employeeSubTab === "Ownership" && (
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                      <strong>Operational Ownership Scopes</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1rem" }}>
                        {activeEmp.ownership.map(own => (
                          <div key={own} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                            <span>{own}</span>
                            <strong>Owner</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {employeeSubTab === "Activity" && (
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                      <strong>Recent Operational Activity</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                        {activeEmp.activity.map((act, i) => (
                          <div key={i}>● {act}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {employeeSubTab === "Devices" && (
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                      <strong>Trusted Devices</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
                        <div>Client: <strong>{activeEmp.device.browser} ({activeEmp.device.os})</strong></div>
                        <div>IP Address: <strong style={{ fontFamily: "monospace" }}>{activeEmp.device.ip}</strong></div>
                      </div>
                    </div>
                  )}

                  {employeeSubTab === "Security" && (
                    <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                      <strong>MFA Status</strong>
                      <div style={{ marginTop: "1rem" }}>
                        <div>SSO MFA: <strong>{activeEmp.security.mfa}</strong></div>
                        <div>Recovery Email: <strong>{activeEmp.security.recovery}</strong></div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Departments Table */}
        {currentSubTab === "Departments" && (
          <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
              Company Department Index
            </span>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                  <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DEPARTMENT NAME</th>
                  <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DEPARTMENT HEAD</th>
                  <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>ASSIGNED MEMBERS</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                    <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700 }}>{dept.name}</td>
                    <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{dept.manager}</td>
                    <td style={{ padding: "1.1rem 1.25rem" }}>
                      {dept.count > 0 ? (
                        <strong>{dept.count} Members</strong>
                      ) : (
                        <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>No employees assigned.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 4: Roles Table */}
        {currentSubTab === "Roles" && (
          <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
              System Roles & Inherited access
            </span>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                  <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>ROLE NAME</th>
                  <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DESCRIPTION</th>
                  <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>INHERITED SYSTEM ACCESS</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                    <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700 }}>{role.name}</td>
                    <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{role.desc}</td>
                    <td style={{ padding: "1.1rem 1.25rem" }}>
                      <strong>{role.modules}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 5: Permissions Matrix */}
        {currentSubTab === "Permissions" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px" }}>
              System Permissions Registry Matrix
            </span>
            {Object.keys(permissions).map(cat => (
              <div key={cat} style={{ borderBottom: "1px solid #E6DED0", paddingBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
                <strong>{cat} Rules</strong>
                <span style={{ color: "#6B7280" }}>{permissions[cat].join(", ")}</span>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 6: Org Chart Layout */}
        {currentSubTab === "Org Chart" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", fontSize: "0.82rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px" }}>
              Reporting Hierarchy Chart
            </span>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem 1.5rem", borderRadius: "6px", backgroundColor: "#FFF7E4", fontWeight: 700 }}>
              Shola Oyewole (CEO)
            </div>
            <div style={{ color: "#6B7280" }}>↓</div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem 1.5rem", borderRadius: "6px", backgroundColor: "#FFF7E4", fontWeight: 700 }}>
              Temi Alao (CTO)
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
