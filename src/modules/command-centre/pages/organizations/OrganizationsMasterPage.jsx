import React, { useState } from "react";
import { Building2, Search, Filter, Plus, Download, ChevronRight, ShieldCheck, AlertTriangle, Users, BookOpen, Globe } from "lucide-react";

export default function OrganizationsMasterPage() {
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const organizations = [
    { logo: "⚡", name: "ABC Energy Workspace", industry: "Energy & Utilities", solution: "Corporate Academy", plan: "Enterprise Trial", owner: "Shola Oyewole", country: "Nigeria 🇳🇬", programs: 8, learners: "2,450", status: "Active", renewal: "Dec 15, 2026", health: "98% (Healthy)" },
    { logo: "🔋", name: "VoltPower Ltd", industry: "Power Generation", solution: "Training Provider", plan: "Standard Pro", owner: "Sarah Jenkins", country: "Nigeria 🇳🇬", programs: 3, learners: "520", status: "Active", renewal: "Nov 30, 2026", health: "92% (Healthy)" },
    { logo: "🏛️", name: "Lagos State Education Board", industry: "Government & Education", solution: "Institution Portal", plan: "Premium Enterprise", owner: "Femi Adebayo", country: "Nigeria 🇳🇬", programs: 24, learners: "8,900", status: "Active", renewal: "Jan 10, 2027", health: "96% (Healthy)" },
    { logo: "📱", name: "MTN Academy West Africa", industry: "Telecommunications", solution: "Corporate Academy", plan: "Premium+", owner: "Kofi Annan", country: "Ghana 🇬🇭", programs: 14, learners: "4,120", status: "Active", renewal: "Oct 20, 2026", health: "95% (Healthy)" },
    { logo: "🎓", name: "Global Tech Academy", industry: "EdTech Bootcamp", solution: "Bootcamp Host", plan: "Standard", owner: "Amara Chukwu", country: "Kenya 🇰🇪", programs: 4, learners: "380", status: "Suspended", renewal: "Sep 12, 2026", health: "42% (Risk)" },
    { logo: "🏫", name: "University of Ghana Hub", industry: "Higher Education", solution: "Institution Portal", plan: "Institution Tier", owner: "Kwame Nkrumah", country: "Ghana 🇬🇭", programs: 12, learners: "3,200", status: "Trial", renewal: "Trial (12d)", health: "88% (Healthy)" }
  ];

  const filteredOrgs = organizations.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || o.solution.includes(filterType) || o.plan.includes(filterType) || o.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Organizations <span style={{ color: "#D9A928" }}>/</span> Organizations
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Customer Organizations Workspace
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Master directory of every Training Company, University, NGO, Government Agency, Enterprise, and Webinar Host operating on OYEN GRID.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Exporting Organizations Master CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Export Organizations
            </button>
            <button
              onClick={() => alert("Create Organization Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Create Organization
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (8 Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Organizations", val: "247", color: "#111111" },
          { label: "Active Organizations", val: "228", color: "#18B67A" },
          { label: "Trial Organizations", val: "18", color: "#2563EB" },
          { label: "Suspended Orgs", val: "2", color: "#EF4444" },
          { label: "Enterprise Customers", val: "38", color: "#7C3AED" },
          { label: "New This Month", val: "+18", color: "#18B67A" },
          { label: "Pending Verification", val: "6", color: "#D9A928" },
          { label: "Renewals This Month", val: "14", color: "#111111" }
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
            placeholder="Search organizations by name, industry, or owner..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", flex: 1, fontSize: "0.82rem", color: "#111111" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={15} color="#707070" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: "#111111", outline: "none", fontWeight: 600 }}
          >
            <option value="All">All Solution Types & Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Suspended">Suspended</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Training">Training Provider</option>
            <option value="Institution">Institution</option>
            <option value="Bootcamp">Bootcamp</option>
          </select>
        </div>
      </section>

      {/* MAIN MASTER TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>INDUSTRY & SOLUTION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PLAN TIER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>COUNTRY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PROGRAMS / LEARNERS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>RENEWAL DATE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((o, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{o.logo}</span>
                    <span>{o.name}</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>
                  <div>{o.industry}</div>
                  <span style={{ fontSize: "0.68rem", color: "#D9A928", fontWeight: 700 }}>{o.solution}</span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{o.plan}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{o.owner}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{o.country}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{o.programs} Progs / {o.learners} Users</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: o.status === "Active" ? "#E6F8F0" : o.status === "Suspended" ? "#FEF2F2" : "#FFF7E4", color: o.status === "Active" ? "#18B67A" : o.status === "Suspended" ? "#EF4444" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{o.renewal}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Opening Master Workspace inspect for ${o.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Inspect →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK ACTIONS CONSOLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Organizations Quick Actions Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create New Organization",
            "Invite Organization Owner",
            "Assign Customer Success Manager",
            "Suspend / Reinstate Workspace",
            "Export Organizations Directory"
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
