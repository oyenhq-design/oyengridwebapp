import React, { useState } from "react";
import { BookOpen, Search, Filter, Plus, Download, ChevronRight, Users, Calendar, Award } from "lucide-react";

export default function ProgramsMasterPage() {
  const [filterSolution, setFilterSolution] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const programs = [
    { name: "Cloud Architecture Masterclass 2026", org: "ABC Energy Workspace", category: "Cloud & Ops", solution: "Corporate Academy", manager: "Shola Oyewole", start: "Aug 01, 2026", end: "Nov 30, 2026", learners: 250, facilitators: 6, pct: "68%", status: "Running" },
    { name: "Grid Operations & Safety Training", org: "VoltPower Ltd", category: "Safety", solution: "Training Provider", manager: "Sarah Jenkins", start: "Jul 15, 2026", end: "Sep 15, 2026", learners: 120, facilitators: 3, pct: "85%", status: "Running" },
    { name: "STEM Education Leaders Workshop", org: "Lagos State Education Board", category: "Leadership", solution: "Institution Portal", manager: "Femi Adebayo", start: "Sep 01, 2026", end: "Dec 15, 2026", learners: 850, facilitators: 18, pct: "0%", status: "Scheduled" },
    { name: "Executive Leadership Acceleration", org: "MTN Academy West Africa", category: "Executive", solution: "Corporate Academy", manager: "Kofi Annan", start: "Jun 01, 2026", end: "Aug 01, 2026", learners: 180, facilitators: 5, pct: "100%", status: "Completed" }
  ];

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterSolution === "All" || p.solution.includes(filterSolution) || p.status === filterSolution;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Programs <span style={{ color: "#D9A928" }}>/</span> Programs
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Ecosystem Programs Directory
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Master workspace managing all running, scheduled, completed, and draft learning programs across customer organizations.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Exporting Programs CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Export Programs
            </button>
            <button
              onClick={() => alert("Create Program Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Create Program
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (7 Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Programs", val: "806", color: "#111111" },
          { label: "Running Programs", val: "142", color: "#18B67A" },
          { label: "Scheduled Programs", val: "38", color: "#2563EB" },
          { label: "Draft Programs", val: "19", color: "#D9A928" },
          { label: "Archived Programs", val: "84", color: "#707070" },
          { label: "Completed Programs", val: "520", color: "#707070" },
          { label: "Cancelled Programs", val: "3", color: "#EF4444" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* SEARCH & FILTERS BAR */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
          <Search size={15} color="#707070" />
          <input
            type="text"
            placeholder="Search programs by title, organization, or manager..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", flex: 1, fontSize: "0.82rem", color: "#111111" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={15} color="#707070" />
          <select
            value={filterSolution}
            onChange={e => setFilterSolution(e.target.value)}
            style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: "#111111", outline: "none", fontWeight: 600 }}
          >
            <option value="All">All Solution Types & Statuses</option>
            <option value="Running">Running</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Corporate Academy">Corporate Academy</option>
            <option value="Training Provider">Training Provider</option>
            <option value="Institution Portal">Institution</option>
          </select>
        </div>
      </section>

      {/* PROGRAM DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PROGRAM NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CATEGORY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PROGRAM MANAGER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DATES</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LEARNERS / FACILITATORS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>COMPLETION %</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{p.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{p.org}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#D9A928", fontWeight: 600 }}>{p.category}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{p.manager}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070", fontSize: "0.75rem" }}>{p.start} → {p.end}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{p.learners} Learners / {p.facilitators} Facs</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 800, color: "#18B67A" }}>{p.pct}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: p.status === "Running" ? "#E6F8F0" : p.status === "Scheduled" ? "#EFF6FF" : "#F7F4ED", color: p.status === "Running" ? "#18B67A" : p.status === "Scheduled" ? "#2563EB" : "#707070", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Managing program: ${p.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Manage →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK PROGRAM ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Program Management Shortcuts
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create New Ecosystem Program",
            "Duplicate Existing Program Structure",
            "Archive Completed Program Records",
            "Suspend Program Workspace",
            "Assign Dedicated Program Manager",
            "Export Program Performance Brief"
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => alert(`Triggered: ${act}`)}
              style={{
                padding: "0.65rem 1.15rem", border: "1px solid #E6DED0", borderRadius: "8px",
                backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem",
                fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#D9A928"; e.currentTarget.style.backgroundColor = "#FFF7E4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E6DED0"; e.currentTarget.style.backgroundColor = "#F7F4ED"; }}
            >
              {act}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
