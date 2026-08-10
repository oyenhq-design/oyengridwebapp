import React, { useState } from "react";
import { LifeBuoy, Search, Filter, Plus, Download, MessageSquare, AlertTriangle, CheckCircle2, UserCheck, Clock } from "lucide-react";

export default function CustomerSupportPage() {
  const [filterCategory, setFilterCategory] = useState("All");

  const tickets = [
    { id: "TICK-9041", org: "Global Tech Academy", priority: "High", category: "Billing", agent: "Femi Support Lead", status: "Open", created: "Today @ 08:30 AM", reply: "15 mins ago" },
    { id: "TICK-9040", org: "ABC Energy Workspace", priority: "Medium", category: "Technical", agent: "Amina Tech Specialist", status: "Pending", created: "Today @ 07:15 AM", reply: "1 hour ago" },
    { id: "TICK-9039", org: "MTN Academy West Africa", priority: "Urgent", category: "Subscription", agent: "Kofi Ops Manager", status: "Escalated", created: "Yesterday", reply: "30 mins ago" },
    { id: "TICK-9038", org: "University of Ghana Hub", priority: "Low", category: "Training", agent: "Unassigned", status: "Open", created: "Yesterday", reply: "Never" },
    { id: "TICK-9037", org: "VoltPower Ltd", priority: "Low", category: "Feature Request", agent: "Amina Tech Specialist", status: "Resolved", created: "Aug 08, 2026", reply: "Aug 08, 2026" }
  ];

  const filteredTickets = tickets.filter(t => {
    return filterCategory === "All" || t.category === filterCategory;
  });

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Customers <span style={{ color: "#D9A928" }}>/</span> Support
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Customer Support & Ticket Desk
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage incoming support tickets, live conversations, SLA response times, support agent assignments, and knowledge base resolution.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Exporting Support Tickets CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Export Tickets
            </button>
            <button
              onClick={() => alert("Create Support Ticket Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Create Ticket
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (6 Support Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Open Tickets", val: "7 Open", color: "#D9A928" },
          { label: "Pending Tickets", val: "4 Pending", color: "#2563EB" },
          { label: "Resolved Today", val: "18 Tickets", color: "#18B67A" },
          { label: "Avg Response Time", val: "12 Mins", color: "#18B67A" },
          { label: "Customer Satisfaction", val: "98.4%", color: "#18B67A" },
          { label: "Escalated Issues", val: "1 Escalated", color: "#EF4444" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* TICKET CATEGORY FILTER BAR */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={15} color="#707070" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111111" }}>Filter Category:</span>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {["All", "Technical", "Billing", "Training", "Feature Request", "Bug", "Account", "Subscription"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: "0.35rem 0.65rem", borderRadius: "4px", border: "1px solid #E6DED0",
                  backgroundColor: filterCategory === cat ? "#FFF7E4" : "#F7F4ED",
                  color: filterCategory === cat ? "#D9A928" : "#707070",
                  fontSize: "0.75rem", fontWeight: filterCategory === cat ? 700 : 500, cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT TICKET TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>TICKET ID</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PRIORITY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CATEGORY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ASSIGNED AGENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CREATED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LAST REPLY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, fontFamily: "monospace", color: "#111111" }}>{t.id}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{t.org}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: t.priority === "Urgent" ? "#EF4444" : t.priority === "High" ? "#D9A928" : "#707070" }}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.category}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{t.agent}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: t.status === "Resolved" ? "#E6F8F0" : t.status === "Escalated" ? "#FEF2F2" : "#FFF7E4", color: t.status === "Resolved" ? "#18B67A" : t.status === "Escalated" ? "#EF4444" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.created}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.reply}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Opening ticket thread: ${t.id}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Reply →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK SUPPORT ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Support Desk Quick Actions
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create New Support Ticket",
            "Assign Agent to Unassigned Tickets",
            "Escalate Issue to Engineering Lead",
            "Mark Ticket as Resolved & Closed",
            "Export Support SLA Metrics"
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
