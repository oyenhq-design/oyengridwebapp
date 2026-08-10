import React, { useState } from "react";
import { Users, Search, Filter, Plus, Download, ChevronRight, UserPlus, Briefcase, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function CustomerCRMPage() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const customers = [
    { name: "ABC Energy Workspace", industry: "Energy & Utilities", plan: "Enterprise Trial", owner: "Shola Oyewole", status: "Active", health: "98% (Healthy)", renewal: "Dec 15, 2026", mrr: "$4,200", type: "Enterprise" },
    { name: "VoltPower Ltd", industry: "Power Generation", plan: "Standard Pro", owner: "Sarah Jenkins", status: "Active", health: "92% (Healthy)", renewal: "Nov 30, 2026", mrr: "$1,850", type: "Training" },
    { name: "Lagos State Education Board", industry: "Government", plan: "Premium Enterprise", owner: "Femi Adebayo", status: "Active", health: "96% (Healthy)", renewal: "Jan 10, 2027", mrr: "$8,500", type: "Institution" },
    { name: "MTN Academy West Africa", industry: "Telecommunications", plan: "Premium+", owner: "Kofi Annan", status: "Active", health: "95% (Healthy)", renewal: "Oct 20, 2026", mrr: "$6,400", type: "Enterprise" },
    { name: "Global Tech Academy", industry: "EdTech Bootcamp", plan: "Standard", owner: "Amara Chukwu", status: "At Risk", health: "42% (Needs Attention)", renewal: "Sep 12, 2026", mrr: "$950", type: "Bootcamp" },
    { name: "University of Ghana Hub", industry: "Higher Education", plan: "Institution Tier", owner: "Kwame Nkrumah", status: "Lead / Trial", health: "88% (Healthy)", renewal: "Trial (12 days left)", mrr: "$3,200", type: "Institution" }
  ];

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || c.status === filterStatus || c.type === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Customers <span style={{ color: "#D9A928" }}>/</span> CRM
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Customer Relationship Management (CRM)
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage commercial customer relationships before, during, and after subscription across all stages of the customer lifecycle.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Exporting CRM Customers CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Export Customers
            </button>
            <button
              onClick={() => alert("Create Customer Opportunity Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Create Customer
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (8 Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Leads", val: "48", color: "#111111" },
          { label: "Qualified Orgs", val: "32", color: "#111111" },
          { label: "Active Trials", val: "18", color: "#2563EB" },
          { label: "Active Customers", val: "247", color: "#18B67A" },
          { label: "Renewals This Month", val: "14", color: "#D9A928" },
          { label: "Churn Risk Orgs", val: "3", color: "#EF4444" },
          { label: "Enterprise Accounts", val: "38", color: "#7C3AED" },
          { label: "Average Deal Size", val: "$2,450", color: "#111111" }
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
            placeholder="Search customers by org name, industry, or account owner..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", flex: 1, fontSize: "0.82rem", color: "#111111" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={15} color="#707070" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: "#111111", outline: "none", fontWeight: 600 }}
          >
            <option value="All">All Statuses & Types</option>
            <option value="Active">Active Customers</option>
            <option value="Lead / Trial">Trial Accounts</option>
            <option value="At Risk">At Risk</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Training">Training</option>
            <option value="Institution">Institution</option>
            <option value="Bootcamp">Bootcamp</option>
          </select>
        </div>
      </section>

      {/* CUSTOMER DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>INDUSTRY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PLAN TIER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ACCOUNT OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>HEALTH SCORE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>RENEWAL DATE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>MRR</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{c.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.industry}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{c.plan}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.owner}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: c.status === "Active" ? "#E6F8F0" : c.status === "At Risk" ? "#FEF2F2" : "#FFF7E4", color: c.status === "Active" ? "#18B67A" : c.status === "At Risk" ? "#EF4444" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 600, color: c.health.includes("Healthy") ? "#18B67A" : "#EF4444" }}>{c.health}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.renewal}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 800, color: "#111111" }}>{c.mrr}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Viewing workspace CRM timeline for ${c.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Manage →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK ACTIONS & PIPELINE HIGHLIGHTS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          CRM Quick Actions Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create New Customer Account",
            "Invite Customer Organization",
            "Assign Dedicated Account Manager",
            "Log Opportunity & Sales Notes",
            "Export Customer Pipeline Report"
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
