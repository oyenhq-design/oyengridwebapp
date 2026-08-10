import React, { useState, useEffect } from "react";
import { ChevronLeft, Search, Filter, UserPlus, Download, ShieldCheck } from "lucide-react";
import { CompanyService } from "../../../../core/company/CompanyService";

export default function TeamPage() {
  const [activeEmployeeId, setActiveEmployeeId] = useState(null);
  const [employeeSubTab, setEmployeeSubTab] = useState("Overview");
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    setEmployees(CompanyService.getEmployees());
  }, []);

  const activeEmp = employees.find(e => e.id === activeEmployeeId);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || emp.dept.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box" }}>
      
      {/* ── KPI CARDS ABOVE TABLE ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Employees", val: "2", sub: "Active staff" },
          { label: "Departments", val: "6", sub: "Core units" },
          { label: "Executives", val: "2", sub: "Founders & C-Suite" },
          { label: "Pending Invites", val: "0", sub: "No pending" },
          { label: "Internal Projects", val: "8", sub: "Active roadmap" },
          { label: "Open Tasks", val: "14", sub: "Assigned items" },
        ].map((kpi, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "10px", padding: "1rem 1.15rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#707070", textTransform: "uppercase", letterSpacing: "0.5px" }}>{kpi.label}</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif", margin: "0.2rem 0 0.1rem" }}>{kpi.val}</div>
            <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {!activeEmp ? (
        <div style={{ border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
          
          {/* Header Controls */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E6DED0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>People Directory</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>Manage OYEN Group internal employee profiles and system permissions.</span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              {/* Search input */}
              <div style={{ position: "relative" }}>
                <Search size={14} color="#707070" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    padding: "0.45rem 0.75rem 0.45rem 2rem", fontSize: "0.78rem", borderRadius: "6px",
                    border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", outline: "none", width: "180px"
                  }}
                />
              </div>

              <button onClick={() => alert("Bulk invite modal triggered...")} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>
                <UserPlus size={13} />
                <span>Invite People</span>
              </button>
            </div>
          </div>

          {/* Department Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", padding: "0.75rem 1.5rem", borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED", overflowX: "auto" }}>
            {["All", "Leadership", "Engineering", "Operations", "Finance", "Support", "Marketing", "Design"].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: "0.3rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: selectedDept === dept ? 700 : 500,
                  border: selectedDept === dept ? "1px solid #D9A928" : "1px solid #E6DED0",
                  backgroundColor: selectedDept === dept ? "#FFF7E4" : "#FCFBF8",
                  color: selectedDept === dept ? "#D9A928" : "#707070", cursor: "pointer", whiteSpace: "nowrap"
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Employee Directory Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070" }}>EMPLOYEE</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070" }}>POSITION</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070" }}>DEPARTMENT</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070" }}>ACCESS LEVEL</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070" }}>STATUS</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070" }}>LAST ACTIVE</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{emp.name}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{emp.title}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{emp.dept}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{emp.role}</td>
                  <td style={{ padding: "1.1rem 1.25rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070", fontSize: "0.75rem" }}>Today @ 09:44 WAT</td>
                  <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                    <button onClick={() => { setActiveEmployeeId(emp.id); setEmployeeSubTab("Overview"); }} style={{ background: "none", border: "1px solid #E6DED0", borderRadius: "6px", color: "#D9A928", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem" }}>
                      View / Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Telemetry */}
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #E6DED0", fontSize: "0.78rem", color: "#707070", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>2 Active Employees</strong> • 0 Pending Invitations • 0 Suspended Accounts
            </div>
            <button onClick={() => alert("Exporting People Directory CSV...")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", color: "#707070", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>
              <Download size={12} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      ) : (
        /* Employee Detail View */
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button onClick={() => setActiveEmployeeId(null)} style={{ background: "none", border: "none", color: "#707070", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, padding: 0 }}>
              ← Back to People Directory
            </button>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111111" }}>{activeEmp.name}</div>
          </div>

          <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #E6DED0", fontSize: "0.8rem" }}>
            {["Overview", "Permissions", "Ownership", "Activity", "Devices", "Security"].map(tab => (
              <button
                key={tab}
                onClick={() => setEmployeeSubTab(tab)}
                style={{
                  background: "none", border: "none", cursor: "pointer", fontWeight: employeeSubTab === tab ? 700 : 500,
                  color: employeeSubTab === tab ? "#111111" : "#707070", paddingBottom: "0.5rem",
                  borderBottom: employeeSubTab === tab ? "2px solid #D9A928" : "none"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ minHeight: "200px" }}>
            {employeeSubTab === "Overview" && (
              <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.82rem" }}>
                <div>Position: <strong>{activeEmp.title}</strong></div>
                <div>Department: <strong>{activeEmp.dept}</strong></div>
                <div>Manager: <strong>{activeEmp.manager}</strong></div>
                <div>Joined: <strong>{activeEmp.joined}</strong></div>
                <div>Email: <strong>{activeEmp.email}</strong></div>
                <div>Phone: <strong>{activeEmp.phone}</strong></div>
              </div>
            )}

            {employeeSubTab === "Permissions" && (
              <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", fontSize: "0.82rem" }}>
                <strong>Inherited Permissions via Role: {activeEmp.role}</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                  {activeEmp.ownership.map(perm => (
                    <div key={perm} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.5rem" }}>
                      <span>{perm} Modules Access</span>
                      <strong style={{ color: "#18B67A" }}>Inherited Access</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {employeeSubTab === "Ownership" && (
              <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", fontSize: "0.82rem" }}>
                <strong>Operational Ownership Scopes</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                  {activeEmp.ownership.map(own => (
                    <div key={own} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.5rem" }}>
                      <span>{own}</span>
                      <strong style={{ color: "#D9A928" }}>Primary Owner</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {employeeSubTab === "Activity" && (
              <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", fontSize: "0.82rem" }}>
                <strong>Recent Operational Activity</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem" }}>
                  {activeEmp.activity.map((act, i) => (
                    <div key={i} style={{ padding: "0.5rem", backgroundColor: "#F7F4ED", borderRadius: "6px" }}>● {act}</div>
                  ))}
                </div>
              </div>
            )}

            {employeeSubTab === "Devices" && (
              <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", fontSize: "0.82rem" }}>
                <strong>Trusted Workstation Devices</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
                  <div>Client Device: <strong>{activeEmp.device.browser} ({activeEmp.device.os})</strong></div>
                  <div>IP Address: <strong style={{ fontFamily: "monospace" }}>{activeEmp.device.ip}</strong></div>
                </div>
              </div>
            )}

            {employeeSubTab === "Security" && (
              <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", fontSize: "0.82rem" }}>
                <strong>Security & MFA Telemetry</strong>
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div>SSO Multi-Factor Authentication: <strong style={{ color: "#18B67A" }}>{activeEmp.security.mfa}</strong></div>
                  <div>Recovery Email: <strong>{activeEmp.security.recovery}</strong></div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
