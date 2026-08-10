import React from "react";
import { Building2, ShieldCheck, Activity, Calendar, FileText, CheckCircle2, TrendingUp, DollarSign, Plus, ArrowUpRight, Globe, Layers, Award } from "lucide-react";

export default function HeadquartersPage() {
  const kpis = [
    { title: "Internal Employees", val: "48 Staff", color: "#111111" },
    { title: "Active Departments", val: "12 Depts", color: "#2563EB" },
    { title: "Registered Offices", val: "4 Global HQ", color: "#111111" },
    { title: "Active Internal Projects", val: "8 Projects", color: "#D9A928" },
    { title: "Vendor Relationships", val: "14 Vendors", color: "#707070" },
    { title: "Company Assets", val: "142 Assets", color: "#111111" },
    { title: "Corporate Policies", val: "18 Policies", color: "#18B67A" },
    { title: "Internal Core Systems", val: "9 Systems", color: "#18B67A" },
    { title: "Annualized Revenue", val: "$1.78M", color: "#18B67A" },
    { title: "Monthly Expenses", val: "$42.5k", color: "#707070" },
    { title: "Company Health Score", val: "98.4 / 100", color: "#18B67A" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Executive Control Room Hero Card */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.2rem" }}>
              Founder & C-Suite Command Room
            </div>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              OYEN GROUP Corporate Headquarters
            </h2>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#707070", fontWeight: 500 }}>
              Global internal operations overview, corporate governance, registered offices, and strategic executive decisions.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "0.6rem 1rem", borderRadius: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16A34A" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#15803D" }}>Corporate Health Score: 98.4 (Optimal)</span>
          </div>
        </div>

        {/* 11 Corporate KPI Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
          {kpis.map((kpi, idx) => (
            <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "10px", padding: "1rem 1.15rem" }}>
              <div style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{kpi.title}</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: kpi.color, marginTop: "0.25rem", fontFamily: "'Outfit', sans-serif" }}>{kpi.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Activity Feed & Corporate Calendar */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* Headquarters Activity Feed */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Headquarters Activity Stream
            </h3>
            <span style={{ fontSize: "0.72rem", color: "#707070" }}>Corporate decisions & milestones</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { time: "10:15", title: "Executive Meeting Scheduled", detail: "Q3 Corporate Strategy Sync with Founder & C-Suite", cat: "Governance", color: "#D9A928" },
              { time: "09:40", title: "Finance Approved Budget", detail: "Q3 AI Infrastructure Allocation ($120,000)", cat: "Finance", color: "#18B67A" },
              { time: "09:12", title: "Engineering Sprint Started", detail: "Sprint 42 — Zero-Trust Security Hardening", cat: "Engineering", color: "#2563EB" },
              { time: "08:50", title: "Vendor Contract Signed", detail: "AWS Enterprise Cloud Services Agreement", cat: "Legal", color: "#7C3AED" },
              { time: "Yesterday", title: "New Office Registered", detail: "London Office (Canary Wharf Hub)", cat: "Operations", color: "#111111" },
              { time: "Yesterday", title: "Policy Updated", detail: "OYEN GROUP Internal Security & Compliance Policy v3.2", cat: "Policy", color: "#18B67A" },
              { time: "July 28", title: "Company Announcement Published", detail: "Annual Employee Stock Options (ESOP) Grant Pool", cat: "Executive", color: "#D9A928" },
            ].map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.8rem", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.6rem" }}>
                <span style={{ color: "#707070", fontFamily: "monospace", width: "55px", flexShrink: 0 }}>{act.time}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "#111111" }}>{act.title}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.1rem" }}>{act.detail}</div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: act.color, backgroundColor: "#F7F4ED", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid #E6DED0" }}>
                  {act.cat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Calendar & Strategic Objectives */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Corporate Calendar */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Corporate Calendar & Syncs
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem" }}>
              {[
                { date: "AUG 12", title: "Board of Directors Q3 Sync", time: "14:00 WAT", type: "Board" },
                { date: "AUG 18", title: "All-Hands Company Townhall", time: "16:00 WAT", type: "Company" },
                { date: "SEP 01", title: "Annual Audit & Compliance Review", time: "10:00 WAT", type: "Audit" },
              ].map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 900, color: "#D9A928", width: "45px" }}>{ev.date}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#111111" }}>{ev.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "#707070" }}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Objectives */}
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Strategic Objectives (OKRs)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.78rem" }}>
              {[
                { name: "Expand Enterprise Sales in East Africa", target: "Q3 2026", progress: 75 },
                { name: "Achieve SOC2 Type II Certification", target: "Q4 2026", progress: 88 },
                { name: "Launch OYEN AI Voice Co-Pilot v1", target: "Q4 2026", progress: 40 },
              ].map((obj, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, color: "#111111" }}>{obj.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "#707070" }}>{obj.progress}%</span>
                  </div>
                  <div style={{ width: "100%", height: "5px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${obj.progress}%`, height: "100%", backgroundColor: "#D9A928", borderRadius: "3px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Grid: Registered Offices, Vendors & Policies Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.75rem" }}>
        
        {/* Registered Offices */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Registered Corporate Offices</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.85rem", fontSize: "0.78rem" }}>
            {[
              { city: "Lagos HQ 🇳🇬", role: "Global Executive Headquarters" },
              { city: "London 🇬🇧", role: "European Operations Hub" },
              { city: "Nairobi 🇰🇪", role: "East Africa Growth Center" },
              { city: "San Francisco 🇺🇸", role: "AI Research Lab" },
            ].map((off, i) => (
              <div key={i} style={{ borderBottom: "1px solid #F7F4ED", paddingBottom: "0.4rem" }}>
                <strong style={{ color: "#111111" }}>{off.city}</strong>
                <div style={{ fontSize: "0.72rem", color: "#707070" }}>{off.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendors Summary */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Vendor Relationships Summary</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.85rem", fontSize: "0.78rem" }}>
            {[
              { vendor: "Amazon Web Services (AWS)", status: "Active Contract", type: "Cloud Host" },
              { vendor: "OpenAI Enterprise API", status: "Active SLA", type: "AI Infrastructure" },
              { vendor: "Stripe Enterprise", status: "Active Merchant", type: "Payment Processor" },
              { vendor: "PwC Nigeria", status: "Retained Auditor", type: "Compliance Audit" },
            ].map((v, i) => (
              <div key={i} style={{ borderBottom: "1px solid #F7F4ED", paddingBottom: "0.4rem" }}>
                <strong style={{ color: "#111111" }}>{v.vendor}</strong>
                <div style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 600 }}>{v.status} • {v.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Policies */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Company Policies Summary</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.85rem", fontSize: "0.78rem" }}>
            {[
              { policy: "Zero-Trust Security Policy", v: "v3.2 Approved" },
              { policy: "Data Protection & NDPR Compliance", v: "v2.1 Certified" },
              { policy: "Code of Conduct & Ethics", v: "v1.4 Published" },
              { policy: "Executive Compensation & Equity", v: "v2.0 Enforced" },
            ].map((pol, i) => (
              <div key={i} style={{ borderBottom: "1px solid #F7F4ED", paddingBottom: "0.4rem" }}>
                <strong style={{ color: "#111111" }}>{pol.policy}</strong>
                <div style={{ fontSize: "0.72rem", color: "#D9A928", fontWeight: 600 }}>{pol.v}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Executive Actions */}
      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Quick Executive Actions
        </span>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create Department", "Launch Internal Project", "Register Global Office", 
            "Publish Policy Document", "Schedule Executive Sync", "Approve Department Budget"
          ].map((act, i) => (
            <button
              key={i}
              onClick={() => alert(`Executing Executive Action: ${act}`)}
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
      </div>

    </div>
  );
}
