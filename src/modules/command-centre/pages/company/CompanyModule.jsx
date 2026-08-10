import React, { useState } from "react";
import TeamPage from "./TeamPage";
import OrganizationPage from "./OrganizationPage";
import { 
  Building, Users, Shield, Cpu, Terminal, DollarSign, Activity, Layers, 
  Settings, Calendar, FileText, CheckCircle2, Clock, Briefcase, ChevronRight, 
  Globe, Lock, AlertTriangle, ExternalLink
} from "lucide-react";

export default function CompanyModule({ initialSubtab = "Headquarters" }) {
  const [subTab, setSubTab] = useState(initialSubtab);
  const [activeDept, setActiveDept] = useState(null);

  const subtabs = [
    { id: "Headquarters", label: "Headquarters" },
    { id: "People", label: "People" },
    { id: "Departments", label: "Departments" },
    { id: "Leadership", label: "Leadership" },
    { id: "Projects", label: "Internal Projects" },
    { id: "Meetings", label: "Meetings" },
    { id: "Calendar", label: "Company Calendar" },
    { id: "Assets", label: "Assets" },
    { id: "Documents", label: "Documents" },
    { id: "Policies", label: "Policies" },
    { id: "Vendors", label: "Vendors" },
    { id: "Finance", label: "Finance" },
    { id: "Settings", label: "Company Settings" },
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", backgroundColor: "#F7F4ED", minHeight: "100vh", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── MODULE HEADER & SUBTABS ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px" }}>
              OYEN GROUP Digital Headquarters Operating System
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.2rem 0 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Company Operations
            </h2>
          </div>
        </div>

        {/* Subtabs Navigation Bar */}
        <div style={{ display: "flex", gap: "0.35rem", borderBottom: "1px solid #E6DED0", overflowX: "auto", paddingBottom: "0.1rem" }}>
          {subtabs.map(tab => {
            const isActive = subTab === tab.id || (subTab === "Team" && tab.id === "People");
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  background: "none", border: "none", padding: "0.6rem 0.95rem", fontSize: "0.8rem",
                  fontWeight: isActive ? 700 : 500, color: isActive ? "#111111" : "#707070",
                  cursor: "pointer", borderBottom: isActive ? "2px solid #D9A928" : "2px solid transparent",
                  transition: "all 0.15s ease", whiteSpace: "nowrap"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUBPAGE MODULE VIEWS ── */}
      <div>
        
        {/* ── 1. HEADQUARTERS SUBPAGE ── */}
        {subTab === "Headquarters" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px" }}>Official Company Record</span>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0.2rem 0 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>OYEN GROUP INC.</h3>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", padding: "0.3rem 0.75rem", borderRadius: "6px" }}>
                  ● Active & Compliant
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", fontSize: "0.82rem" }}>
                <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ color: "#707070", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>Head Office Address</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.25rem" }}>Plot 14, Commercial Avenue, Victoria Island, Lagos</div>
                </div>
                <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ color: "#707070", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>Company Registration</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.25rem", fontFamily: "monospace" }}>RC-1849204</div>
                </div>
                <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ color: "#707070", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>Tax ID (TIN)</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.25rem", fontFamily: "monospace" }}>29402910-0001</div>
                </div>
                <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ color: "#707070", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>Primary Contact</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.25rem" }}>hq@oyengroup.com</div>
                </div>
                <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ color: "#707070", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>Website & Domain</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.25rem" }}>oyengrid.com</div>
                </div>
                <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ color: "#707070", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>Countries Operating</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.25rem" }}>Nigeria, Ghana, Kenya, UK</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. PEOPLE SUBPAGE (Refactored TeamPage) ── */}
        {(subTab === "People" || subTab === "Team") && <TeamPage />}

        {/* ── 3. DEPARTMENTS SUBPAGE ── */}
        {subTab === "Departments" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Company Departments</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {[
                { name: "Leadership", head: "Shola Oyewole (CEO)", count: 2, budget: "$450,000/yr", kpi: "Growth & Retention" },
                { name: "Engineering", head: "VP Engineering", count: 18, budget: "$1.2M/yr", kpi: "99.99% Platform Uptime" },
                { name: "Operations", head: "Head of Operations", count: 8, budget: "$320,000/yr", kpi: "100% SLA Fulfillment" },
                { name: "Finance", head: "CFO", count: 4, budget: "$280,000/yr", kpi: "Zero Audit Variance" },
                { name: "Customer Success", head: "CS Director", count: 6, budget: "$240,000/yr", kpi: "96.4% CSAT" },
                { name: "Marketing", head: "CMO", count: 5, budget: "$380,000/yr", kpi: "+28% Inbound Leads" },
                { name: "Sales", head: "VP Sales", count: 7, budget: "$420,000/yr", kpi: "$148K MRR Target" },
                { name: "HR & Talent", head: "Head of HR", count: 3, budget: "$180,000/yr", kpi: "< 24 Days Hiring Cycle" },
                { name: "Legal & Compliance", head: "General Counsel", count: 2, budget: "$220,000/yr", kpi: "100% Regulatory Pass" },
                { name: "Design & UX", head: "Head of Product Design", count: 4, budget: "$210,000/yr", kpi: "OYEN Design Tokens v2" },
                { name: "AI Research", head: "Lead AI Engineer", count: 5, budget: "$650,000/yr", kpi: "OYEN AI Voice Engine" },
              ].map((d, i) => (
                <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "10px", padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "1rem", color: "#111111" }}>{d.name}</strong>
                      <span style={{ fontSize: "0.72rem", color: "#D9A928", fontWeight: 700 }}>{d.count} Staff</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#707070", marginTop: "0.35rem" }}>Lead: <strong>{d.head}</strong></div>
                    <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.15rem" }}>Budget: <strong>{d.budget}</strong></div>
                    <div style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 600, marginTop: "0.35rem" }}>KPI: {d.kpi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. LEADERSHIP SUBPAGE ── */}
        {subTab === "Leadership" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Leadership & Governance</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                { name: "Shola Oyewole", title: "Founder & CEO", dept: "Leadership", focus: "Strategy & Platform Vision" },
                { name: "Co-Founder", title: "Co-Founder & COO", dept: "Operations", focus: "Ecosystem Growth & Ops" },
                { name: "Executive VP", title: "Chief Technology Officer", dept: "Engineering", focus: "Infrastructure & Security" },
              ].map((ldr, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "10px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase" }}>{ldr.title}</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111", marginTop: "0.2rem" }}>{ldr.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "#707070", marginTop: "0.25rem" }}>Focus: {ldr.focus}</div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "1.5rem 0 0.75rem", color: "#111111" }}>Executive Board Notes & Decisions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem", color: "#707070" }}>
              <div style={{ padding: "0.75rem 1rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px" }}>
                ● <strong>Q3 Expansion Decision:</strong> Approved regional node deployment in Nairobi, Kenya.
              </div>
              <div style={{ padding: "0.75rem 1rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "6px" }}>
                ● <strong>Command Centre v2 Upgrade:</strong> Finalized transition to internal company OS architecture.
              </div>
            </div>
          </div>
        )}

        {/* ── 5. INTERNAL PROJECTS SUBPAGE ── */}
        {subTab === "Projects" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Internal Projects Roadmap</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                { name: "Command Centre v2 Operating System", owner: "Product & Eng", dept: "Engineering", status: "Active", progress: "95%", budget: "$35,000" },
                { name: "Participant Portal v3 Refactor", owner: "Frontend Team", dept: "Engineering", status: "In Progress", progress: "70%", budget: "$42,000" },
                { name: "OYEN AI Voice Engine", owner: "AI Research", dept: "AI Lab", status: "Active", progress: "45%", budget: "$85,000" },
                { name: "Enterprise Billing Engine", owner: "Core Team", dept: "Finance", status: "Testing", progress: "90%", budget: "$28,000" },
                { name: "Institution Suite v1", owner: "Product Team", dept: "Product", status: "Planning", progress: "20%", budget: "$50,000" },
              ].map((proj, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <strong style={{ fontSize: "0.95rem", color: "#111111" }}>{proj.name}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.2rem" }}>Owner: {proj.owner} • Dept: {proj.dept} • Budget: {proj.budget}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <div style={{ width: "120px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#707070", marginBottom: "0.2rem" }}>
                        <span>Progress</span>
                        <strong>{proj.progress}</strong>
                      </div>
                      <div style={{ height: "5px", backgroundColor: "#E6DED0", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: proj.progress, backgroundColor: "#D9A928" }}></div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 6. MEETINGS SUBPAGE ── */}
        {subTab === "Meetings" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Internal Meetings & Syncs</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                { title: "Weekly Executive Leadership Sync", time: "Mondays @ 09:00 AM WAT", type: "Board & C-Suite", lead: "CEO" },
                { title: "Engineering All-Hands Sync", time: "Wednesdays @ 03:00 PM WAT", type: "Technical", lead: "VP Eng" },
                { title: "Product & Design Review", time: "Fridays @ 04:00 PM WAT", type: "Product Roadmap", lead: "Head of Product" },
                { title: "Monthly Financial Audit Sync", time: "Last Friday @ 11:00 AM WAT", type: "Finance", lead: "CFO" },
              ].map((m, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem 1.25rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{m.title}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.15rem" }}>Lead: {m.lead} • Scope: {m.type}</div>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#D9A928" }}>{m.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 7. COMPANY CALENDAR SUBPAGE ── */}
        {subTab === "Calendar" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Company Calendar</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { event: "Command Centre v2 Rollout", date: "August 12, 2026", type: "Release" },
                { event: "Q3 Board of Directors Sync", date: "August 20, 2026", type: "Board" },
                { event: "Monthly Staff Payroll Run", date: "August 25, 2026", type: "Payroll" },
                { event: "Public Holiday (Office Closed)", date: "September 1, 2026", type: "Holiday" },
              ].map((ev, i) => (
                <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase" }}>{ev.type}</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.2rem" }}>{ev.event}</div>
                  <div style={{ fontSize: "0.75rem", color: "#707070", marginTop: "0.2rem" }}>{ev.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 8. ASSETS SUBPAGE ── */}
        {subTab === "Assets" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Company Assets Inventory</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { item: "MacBook Pro M3 Max Laptops", count: "14 Units", type: "Hardware" },
                { item: "Primary Domains (oyengrid.com)", count: "6 Domains", type: "Digital" },
                { item: "AWS Cloud Server Nodes", count: "12 Clusters", type: "Infrastructure" },
                { item: "Office Equipment & Furniture", count: "VI Campus", type: "Physical" },
                { item: "Brand Media Assets Kit", count: "v2.4 Package", type: "Brand" },
              ].map((ast, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase" }}>{ast.type}</span>
                  <div style={{ fontWeight: 700, color: "#111111", marginTop: "0.2rem" }}>{ast.item}</div>
                  <div style={{ fontSize: "0.75rem", color: "#18B67A", fontWeight: 700, marginTop: "0.2rem" }}>{ast.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 9. DOCUMENTS SUBPAGE ── */}
        {subTab === "Documents" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Internal Documents & SOPs</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.82rem" }}>
              {[
                { name: "OYEN GROUP Employee Handbook 2026", type: "Handbook", updated: "July 2026" },
                { name: "Standard Operating Procedures (SOPs) v3", type: "Operations", updated: "August 2026" },
                { name: "Enterprise Customer Master Contract Template", type: "Legal", updated: "June 2026" },
                { name: "Product Roadmap & Architecture Specifications", type: "Product", updated: "August 2026" },
              ].map((doc, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem 1.25rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "#111111" }}>{doc.name}</strong>
                    <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.15rem" }}>Category: {doc.type} • Last Updated: {doc.updated}</div>
                  </div>
                  <button onClick={() => alert(`Opening document: ${doc.name}`)} style={{ background: "none", border: "1px solid #E6DED0", borderRadius: "6px", color: "#D9A928", padding: "0.3rem 0.75rem", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem" }}>
                    View Doc
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 10. POLICIES SUBPAGE ── */}
        {subTab === "Policies" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Company Governance & Policies</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { title: "Leave & Absence Policy", status: "Enforced" },
                { title: "Remote Work & Distributed Policy", status: "Enforced" },
                { title: "Information Security Policy", status: "ISO Compliant" },
                { title: "Travel & Expense Reimbursement", status: "Enforced" },
                { title: "Hiring & Equal Opportunity", status: "Enforced" },
                { title: "Code of Conduct & Ethics", status: "Enforced" },
              ].map((pol, idx) => (
                <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                  <div style={{ fontWeight: 700, color: "#111111" }}>{pol.title}</div>
                  <span style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700, marginTop: "0.35rem", display: "inline-block" }}>● {pol.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 11. VENDORS SUBPAGE ── */}
        {subTab === "Vendors" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Third-Party Vendors & Infrastructure Services</h3>
            
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                  <th style={{ padding: "0.85rem 1rem", color: "#707070" }}>VENDOR</th>
                  <th style={{ padding: "0.85rem 1rem", color: "#707070" }}>SERVICE</th>
                  <th style={{ padding: "0.85rem 1rem", color: "#707070" }}>MONTHLY COST</th>
                  <th style={{ padding: "0.85rem 1rem", color: "#707070" }}>RENEWAL DATE</th>
                  <th style={{ padding: "0.85rem 1rem", color: "#707070" }}>OWNER</th>
                  <th style={{ padding: "0.85rem 1rem", color: "#707070" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { vendor: "Amazon Web Services (AWS)", svc: "Cloud Hosting", cost: "$4,250", renewal: "Monthly (Auto)", owner: "CTO", status: "Active" },
                  { vendor: "OpenAI API", svc: "AI Intelligence", cost: "$1,840", renewal: "Monthly (Auto)", owner: "AI Lab", status: "Active" },
                  { vendor: "Cloudflare", svc: "DNS & WAF Security", cost: "$450", renewal: "Annual (Dec 2026)", owner: "DevOps", status: "Active" },
                  { vendor: "Paystack / Flutterwave", svc: "Payment Gateway", cost: "1.5% Transaction Fee", renewal: "Ongoing Contract", owner: "CFO", status: "Active" },
                  { vendor: "Resend", svc: "Transactional Email", cost: "$180", renewal: "Monthly (Auto)", owner: "Engineering", status: "Active" },
                  { vendor: "Notion Enterprise", svc: "Internal Docs", cost: "$240", renewal: "Annual (Nov 2026)", owner: "Operations", status: "Active" },
                ].map((v, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#111111" }}>{v.vendor}</td>
                    <td style={{ padding: "1rem", color: "#707070" }}>{v.svc}</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#111111" }}>{v.cost}</td>
                    <td style={{ padding: "1rem", color: "#707070" }}>{v.renewal}</td>
                    <td style={{ padding: "1rem", color: "#707070" }}>{v.owner}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#F0FDF4", color: "#166534", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── 12. FINANCE SUBPAGE ── */}
        {subTab === "Finance" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Internal Company Finance</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 700 }}>Monthly Operating Costs</span>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", marginTop: "0.2rem" }}>$32,450</div>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 700 }}>Monthly Payroll</span>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", marginTop: "0.2rem" }}>$18,500</div>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 700 }}>Vendor Services</span>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111111", marginTop: "0.2rem" }}>$6,960</div>
              </div>
            </div>
          </div>
        )}

        {/* ── 13. COMPANY SETTINGS SUBPAGE ── */}
        {subTab === "Settings" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1.25rem", color: "#111111" }}>Company Settings</h3>
            <OrganizationPage />
          </div>
        )}

      </div>
    </div>
  );
}
