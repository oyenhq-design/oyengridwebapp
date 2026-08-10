import React, { useState } from "react";
import { Search, UserPlus, Download, Filter, MoreVertical, ShieldAlert, CheckCircle, Clock } from "lucide-react";

export default function StaffDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Sample internal OYEN staff dataset
  const staffMembers = [
    { id: 1, name: "Shola Oyewole", title: "Founder & Chief Executive Officer", dept: "Leadership", manager: "Board of Directors", type: "Full-Time", role: "Founder", status: "Active", lastActive: "Just now", avatar: "SO" },
    { id: 2, name: "Amina Bello", title: "Co-Founder & Chief Technology Officer", dept: "Leadership", manager: "CEO", type: "Full-Time", role: "Executive", status: "Active", lastActive: "5 mins ago", avatar: "AB" },
    { id: 3, name: "David Okonjo", title: "VP of Product Engineering", dept: "Engineering", manager: "CTO", type: "Full-Time", role: "Engineering Lead", status: "Active", lastActive: "12 mins ago", avatar: "DO" },
    { id: 4, name: "Grace Chukwu", title: "Head of Operations & Success", dept: "Operations", manager: "CEO", type: "Full-Time", role: "Operations Head", status: "Active", lastActive: "1 hour ago", avatar: "GC" },
    { id: 5, name: "Tunde Bakare", title: "Head of Finance & Corporate Strategy", dept: "Finance", manager: "CEO", type: "Full-Time", role: "Finance Head", status: "Active", lastActive: "3 hours ago", avatar: "TB" },
    { id: 6, name: "Nneka Eze", title: "Senior AI Research Scientist", dept: "Engineering", manager: "VP Engineering", type: "Full-Time", role: "AI Staff", status: "Active", lastActive: "30 mins ago", avatar: "NE" },
    { id: 7, name: "Michael Vance", title: "Director of Global Enterprise Sales", dept: "Marketing", manager: "Head of Ops", type: "Full-Time", role: "Sales Lead", status: "Active", lastActive: "4 hours ago", avatar: "MV" },
    { id: 8, name: "Fatima Al-Hassan", title: "Lead Legal & Regulatory Counsel", dept: "Legal", manager: "CEO", type: "Contractor", role: "Legal Counsel", status: "Active", lastActive: "Yesterday", avatar: "FA" },
    { id: 9, name: "Samuel Adebayo", title: "Senior Security Systems Architect", dept: "Engineering", manager: "VP Engineering", type: "Full-Time", role: "Security Eng", status: "Suspended", lastActive: "3 days ago", avatar: "SA" },
  ];

  const departments = ["All", "Leadership", "Engineering", "Finance", "Operations", "Marketing", "HR", "Support", "Design", "Legal"];

  const filteredStaff = staffMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || member.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1.25rem" }}>
        {[
          { title: "Total Employees", val: "48", sub: "Full-Time Staff", color: "#111111" },
          { title: "Executives & C-Suite", val: "6", sub: "Founders & VPs", color: "#D9A928" },
          { title: "Active Departments", val: "12", sub: "Cross-Functional", color: "#2563EB" },
          { title: "Pending Invitations", val: "3", sub: "Awaiting Onboarding", color: "#18B67A" },
          { title: "Suspended Accounts", val: "1", sub: "Security Review", color: "#DC2626" },
          { title: "Contractors", val: "8", sub: "External Advisors", color: "#707070" },
        ].map((card, i) => (
          <div key={i} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "10px", padding: "1.15rem" }}>
            <div style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.title}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: card.color, marginTop: "0.25rem", fontFamily: "'Outfit', sans-serif" }}>{card.val}</div>
            <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.15rem" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Staff Directory Section */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Controls Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              OYEN GROUP Staff Directory
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Manage employee profiles, departmental assignments, and status</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button 
              onClick={() => alert("Exporting Staff Directory CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px",
                color: "#111111", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
              }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button 
              onClick={() => alert("Opening Employee Invitation Modal...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer"
              }}
            >
              <UserPlus size={14} />
              <span>+ Invite Employee</span>
            </button>
          </div>
        </div>

        {/* Search & Advanced Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", borderTop: "1px solid #E6DED0", paddingTop: "1.25rem" }}>
          
          {/* Search Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "0.5rem 0.85rem", width: "320px" }}>
            <Search size={15} color="#707070" />
            <input 
              type="text" 
              placeholder="Search by name, position, or role..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", fontSize: "0.8rem", color: "#111111", width: "100%" }}
            />
          </div>

          {/* Department Filter Pills */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 700, marginRight: "0.4rem" }}>Filter by Department:</span>
            {departments.map(dept => {
              const isActive = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  style={{
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? "#111111" : "#F7F4ED",
                    color: isActive ? "#D9A928" : "#707070",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {dept}
                </button>
              );
            })}
          </div>

        </div>

        {/* Staff Directory Table */}
        <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>EMPLOYEE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>POSITION</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>DEPARTMENT</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>MANAGER</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>TYPE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>ROLE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700 }}>LAST ACTIVE</th>
                <th style={{ padding: "0.85rem 1rem", color: "#707070", fontWeight: 700, textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((emp, i) => (
                <tr 
                  key={emp.id} 
                  style={{ borderBottom: "1px solid #E6DED0" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F7F4ED"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={{ padding: "1rem", fontWeight: 700 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#111111", color: "#D9A928", fontSize: "0.75rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {emp.avatar}
                      </div>
                      <span style={{ color: "#111111" }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "#111111", fontWeight: 500 }}>{emp.title}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.15rem 0.45rem", borderRadius: "4px", fontSize: "0.72rem", color: "#111111", fontWeight: 600 }}>
                      {emp.dept}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "#707070" }}>{emp.manager}</td>
                  <td style={{ padding: "1rem", color: "#707070" }}>{emp.type}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#D9A928" }}>{emp.role}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      fontSize: "0.68rem", fontWeight: 800, 
                      backgroundColor: emp.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(220, 38, 38, 0.12)",
                      color: emp.status === "Active" ? "#18B67A" : "#DC2626", 
                      padding: "0.15rem 0.5rem", borderRadius: "4px" 
                    }}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "#707070", fontSize: "0.75rem" }}>{emp.lastActive}</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button 
                      onClick={() => alert(`Managing Staff Profile: ${emp.name}`)}
                      style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
