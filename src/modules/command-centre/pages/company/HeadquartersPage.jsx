import React from "react";
import { Building2, Activity, Calendar, FileText, CheckCircle2, TrendingUp, Globe, Briefcase, ChevronRight, ShieldCheck, Clock } from "lucide-react";

export default function HeadquartersPage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Company <span style={{ color: "#D9A928" }}>/</span> Headquarters
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
          OYEN GROUP Headquarters
        </h1>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
          Executive operations cockpit managing corporate health, strategic objectives, and global enterprise headquarters.
        </p>
      </div>

      {/* 1. EXECUTIVE SUMMARY & CORPORATE KPIS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Executive Summary & Corporate KPIs
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Corporate Operational Health", val: "Optimal (99.98%)", color: "#18B67A", sub: "All 12 departments active" },
            { label: "Active Internal Projects", val: "14 Initiatives", color: "#111111", sub: "3 Q3 strategic launches" },
            { label: "Registered Global Offices", val: "6 Regional HQ", color: "#111111", sub: "Lagos, Accra, Nairobi, London" },
            { label: "Vendor Compliance", val: "100% Verified", color: "#18B67A", sub: "SOC2 & ISO 27001 active" }
          ].map((kpi, idx) => (
            <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem 1.25rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{kpi.label}</span>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: kpi.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{kpi.val}</div>
              <span style={{ fontSize: "0.7rem", color: "#707070", marginTop: "0.15rem", display: "block" }}>{kpi.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. STRATEGIC OBJECTIVES & INTERNAL PROJECTS OVERVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* Internal Projects Overview */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Internal Strategic Initiatives & Projects
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { name: "Command Centre v2 Enterprise Expansion", lead: "Engineering & Product", status: "On Track", progress: "92%" },
              { name: "Global SOC2 Type II Certification", lead: "Security & Legal", status: "Audit Phase", progress: "85%" },
              { name: "West African Data Residency Architecture", lead: "Infrastructure", status: "Active", progress: "68%" },
              { name: "OYEN AI Multi-lingual Speech Engine", lead: "AI Research Lab", status: "Beta Testing", progress: "45%" }
            ].map((proj, idx) => (
              <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{proj.name}</strong>
                    <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.15rem" }}>Lead: {proj.lead}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {proj.status}
                  </span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: proj.progress, backgroundColor: "#D9A928", borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Objectives */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            2026 Strategic Objectives (OKRs)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { okr: "Expand Enterprise Customer Base to 300 Orgs", pct: "82%" },
              { okr: "Achieve $1M ARR milestone by Q4 2026", pct: "58%" },
              { okr: "Maintain 99.98% Zero-Downtime Platform SLA", pct: "99%" },
              { okr: "Launch OYEN AI Voice & Interactive Proctoring", pct: "40%" }
            ].map((obj, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #F7F4ED", paddingBottom: "0.65rem", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{obj.okr}</span>
                  <span style={{ fontWeight: 700, color: "#18B67A" }}>{obj.pct}</span>
                </div>
                <div style={{ height: "5px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: obj.pct, backgroundColor: "#18B67A" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 3. REGISTERED OFFICES & VENDOR SUMMARY */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Registered Offices */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Globe size={15} color="#D9A928" /> Registered Global HQ & Offices
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            {[
              { location: "Lagos Headquarters", address: "Victoria Island, Lagos, Nigeria", status: "Primary HQ" },
              { location: "Accra Regional Hub", address: "Airport Residential Area, Accra, Ghana", status: "Regional" },
              { location: "London Innovation Office", address: "Tech City, Shoreditch, London, UK", status: "International" }
            ].map((off, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem 1rem", borderRadius: "6px" }}>
                <div>
                  <strong style={{ color: "#111111" }}>{off.location}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.15rem" }}>{off.address}</div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  {off.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor Summary */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Core Vendors & Infrastructure Partners
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.78rem" }}>
            {[
              { vendor: "AWS Africa (Cape Town)", type: "Cloud Infrastructure", status: "Active" },
              { vendor: "OpenAI Enterprise", type: "LLM Intelligence", status: "Active" },
              { vendor: "Paystack / Stripe", type: "Payment Gateway", status: "Active" },
              { vendor: "SendGrid / Postmark", type: "Transactional Email", status: "Active" }
            ].map((v, idx) => (
              <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px" }}>
                <strong style={{ color: "#111111", display: "block" }}>{v.vendor}</strong>
                <span style={{ fontSize: "0.68rem", color: "#707070" }}>{v.type}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 4. COMPANY CALENDAR & HEADQUARTERS ACTIVITY */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Company Calendar */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Calendar size={15} color="#D9A928" /> Executive Company Calendar
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            {[
              { date: "Aug 15, 2026", event: "Q3 Executive Leadership Review", chair: "CEO & Co-Founders" },
              { date: "Aug 22, 2026", event: "Board of Directors Quarter Sync", chair: "Board Members" },
              { date: "Sep 01, 2026", event: "Annual Security Audit Inspection", chair: "Head of Legal & Compliance" }
            ].map((ev, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.65rem" }}>
                <div>
                  <strong style={{ color: "#111111" }}>{ev.event}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070" }}>Chair: {ev.chair}</div>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#D9A928" }}>{ev.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Quick Actions */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Executive Headquarters Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              "Publish Executive Announcement",
              "Schedule Board of Directors Sync",
              "Review Strategic OKR Alignment",
              "Generate Corporate Performance Brief"
            ].map((act, idx) => (
              <button
                key={idx}
                onClick={() => alert(`Triggered: ${act}`)}
                style={{
                  textAlign: "left", padding: "0.75rem 1rem", border: "1px solid #E6DED0",
                  borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#111111",
                  fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <span>{act}</span>
                <ChevronRight size={14} color="#D9A928" />
              </button>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
