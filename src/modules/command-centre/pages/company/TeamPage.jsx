import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

export default function TeamPage() {
  const [activeEmployeeId, setActiveEmployeeId] = useState(null);
  const [employeeSubTab, setEmployeeSubTab] = useState("Overview");
  const [employees, setEmployees] = useState([]);

  const loadDatabase = () => {
    try {
      const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
      const ownerFirstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
      const ownerLastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";

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
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  const activeEmp = employees.find(e => e.id === activeEmployeeId);

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Team</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage OYEN Group internal employee profiles and systems permissions.</span>
      </div>

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
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button onClick={() => setActiveEmployeeId(null)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, padding: 0 }}>
              ← Back
            </button>
            <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>{activeEmp.name}</div>
          </div>

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
                  {activeEmp.ownership.map(perm => (
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
  );
}
