import React, { useState, useEffect } from "react";
import { Users, Search, Filter, Plus, Download, ChevronRight, Mail, Shield, Smartphone } from "lucide-react";
import { CompanyService } from "../../../../core/company/CompanyService";

export default function StaffDirectoryPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [activeEmployeeId, setActiveEmployeeId] = useState(null);

  useEffect(() => {
    setEmployees(CompanyService.getEmployees());
  }, []);

  const filteredStaff = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || e.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  const selectedEmp = employees.find(e => e.id === activeEmployeeId);

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Company <span style={{ color: "#D9A928" }}>/</span> Staff
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Staff & Employee Directory
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage OYEN GROUP internal staff members, employment statuses, department assignments, and profile credentials.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Exporting Staff Directory CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={() => alert("Invite New Staff Member modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Invite Employee
            </button>
          </div>
        </div>
      </div>

      {/* Staff Statistics */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Internal Employees", val: employees.length, color: "#111111" },
          { label: "Active Full-time Staff", val: employees.filter(e => e.status === "Active").length, color: "#18B67A" },
          { label: "Departments Represented", val: "12 Depts", color: "#111111" },
          { label: "MFA Enforcement", val: "100% Enforced", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* Search & Filter Bar */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
          <Search size={15} color="#707070" />
          <input
            type="text"
            placeholder="Search employees by name, title, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", flex: 1, fontSize: "0.82rem", color: "#111111" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={15} color="#707070" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: "#111111", outline: "none", fontWeight: 600 }}
          >
            <option value="All">All Departments</option>
            <option value="Executive">Executive</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </section>

      {/* Main Table or Selected Profile View */}
      {!selectedEmp ? (
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>EMPLOYEE NAME</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>POSITION</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DEPARTMENT</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>MANAGER</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((emp, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{emp.name}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{emp.title}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{emp.dept}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{emp.manager || "Executive Board"}</td>
                  <td style={{ padding: "1.1rem 1.25rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#E6F8F0", color: "#18B67A", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                    <button onClick={() => setActiveEmployeeId(emp.id)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                      View Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
          <button onClick={() => setActiveEmployeeId(null)} style={{ background: "none", border: "none", color: "#707070", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, marginBottom: "1rem", padding: 0 }}>
            ← Back to Directory
          </button>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#111111" }}>{selectedEmp.name}</h2>
              <span style={{ fontSize: "0.8rem", color: "#707070" }}>{selectedEmp.title} • {selectedEmp.dept}</span>
            </div>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, backgroundColor: "#E6F8F0", color: "#18B67A", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>
              {selectedEmp.status}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px", fontSize: "0.82rem" }}>
            <div>Manager: <strong>{selectedEmp.manager}</strong></div>
            <div>Joined: <strong>{selectedEmp.joined}</strong></div>
            <div>Email: <strong>{selectedEmp.email}</strong></div>
            <div>Role Assignment: <strong>{selectedEmp.role}</strong></div>
          </div>
        </section>
      )}

    </div>
  );
}
