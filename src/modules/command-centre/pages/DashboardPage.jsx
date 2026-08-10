import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, BookOpen, Calendar, HelpCircle, HardDrive, Cpu, Terminal, 
  ArrowUpRight, DollarSign, Activity, AlertTriangle, CheckCircle2, TrendingUp, 
  Building2, Award, Clock, Globe, Zap, ArrowRight, RefreshCw, FileText
} from "lucide-react";

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    ownerName: "Shola",
    orgCount: 247,
    activeLearners: 18942,
    liveSessions: 463,
    platformUptime: "99.97%",
  });

  const [auditLogs, setAuditLogs] = useState([
    { time: "09:30", text: "Payment Successful", detail: "$12,450 received via Enterprise Wire", badge: "Payment" },
    { time: "09:27", text: "Certificate Generated", detail: "Leadership Program — 250 Certificates issued", badge: "Certificates" },
    { time: "09:25", text: "Institution Added", detail: "Lagos State University provisioned", badge: "Org" },
    { time: "09:20", text: "250 Learners Joined Session", detail: "ABC Energy Safety Bootcamp Live Stream", badge: "Live" },
    { time: "09:16", text: "Program Created", detail: "Executive Management Workshop v3", badge: "Program" },
    { time: "09:13", text: "ABC Energy upgraded to Premium+", detail: "Annual Contract renewed ($48,000/yr)", badge: "Upgrade" },
  ]);

  const [alerts, setAlerts] = useState([
    { type: "warning", title: "Payment Failed", detail: "Acme Corp — Attempt 2 failed. Automatic retry in 24h." },
    { type: "warning", title: "Storage Near Limit", detail: "VoltPower Ltd reached 92% allocated media quota." },
    { type: "info", title: "Subscription Expiring", detail: "Apex Tech enterprise trial expires in 3 days." },
    { type: "error", title: "Organization Suspended", detail: "Mock Demo Org suspended for compliance verification." },
  ]);

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── 1. EXECUTIVE SUMMARY HERO ── */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.25rem" }}>
              OYEN GROUP Enterprise Operations Overview
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.5px" }}>
              Good Morning, {telemetry.ownerName} 👋
            </h1>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.92rem", color: "#18B67A", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#18B67A", display: "inline-block" }}></span>
              The OYEN ecosystem is operating normally today.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.6rem 1rem", borderRadius: "8px" }}>
            <ShieldCheck size={22} color="#18B67A" />
            <div style={{ fontSize: "0.75rem" }}>
              <div style={{ fontWeight: 800, color: "#111111" }}>Overall Platform Uptime</div>
              <div style={{ color: "#18B67A", fontWeight: 700 }}>{telemetry.platformUptime} SLA Compliant</div>
            </div>
          </div>
        </div>

        {/* 4 Hero KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.25rem", marginTop: "1.75rem" }}>
          {[
            { label: "Active Organizations", val: telemetry.orgCount, sub: "+24 this month", icon: <Building2 size={20} color="#D9A928" /> },
            { label: "Active Learners", val: telemetry.activeLearners.toLocaleString(), sub: "+2,840 this week", icon: <Users size={20} color="#2563EB" /> },
            { label: "Live Sessions Today", val: telemetry.liveSessions, sub: "463 streaming now", icon: <Activity size={20} color="#18B67A" /> },
            { label: "Platform Uptime SLA", val: telemetry.platformUptime, sub: "99.99% Target", icon: <Zap size={20} color="#7C3AED" /> },
          ].map((card, i) => (
            <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</div>
                <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif", margin: "0.2rem 0 0.1rem" }}>{card.val}</div>
                <div style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 600 }}>{card.sub}</div>
              </div>
              <div style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. SIMPLIFIED EXECUTIVE PLATFORM HEALTH ── */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Platform Health</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Core executive service status monitoring</span>
          </div>
          <span style={{ fontSize: "0.72rem", backgroundColor: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 700 }}>All Systems Green</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem" }}>
          {[
            { name: "Authentication", status: "Operational" },
            { name: "Database Core", status: "Operational" },
            { name: "AI Engine", status: "Operational" },
            { name: "Live Sessions", status: "Operational" },
            { name: "Notifications", status: "Operational" },
            { name: "Payments", status: "Operational" },
            { name: "File Storage", status: "Operational" },
            { name: "Background Jobs", status: "Operational" },
          ].map((svc, idx) => (
            <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <span style={{ fontWeight: 600, color: "#111111" }}>{svc.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.72rem", color: "#18B67A", fontWeight: 700 }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#18B67A" }}></span>
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPLIT GRID: REVENUE SNAPSHOT & SUBSCRIPTION DISTRIBUTION ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* ── 3. REVENUE SNAPSHOT ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Revenue Snapshot</h3>
                <span style={{ fontSize: "0.75rem", color: "#707070" }}>Monthly & Annual Recurring Revenue metrics</span>
              </div>
              <DollarSign size={20} color="#D9A928" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", padding: "1.1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.7rem", color: "#92400E", fontWeight: 700, textTransform: "uppercase" }}>Monthly Recurring Revenue (MRR)</span>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#B45309", fontFamily: "'Outfit', sans-serif", marginTop: "0.2rem" }}>$148,250</div>
                <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 600 }}>+18.4% vs last month</span>
              </div>
              <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "1.1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.7rem", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>Annual Run Rate (ARR)</span>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#15803D", fontFamily: "'Outfit', sans-serif", marginTop: "0.2rem" }}>$1,779,000</div>
                <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 600 }}>+24.1% YoY Growth</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", fontSize: "0.78rem" }}>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px" }}>
                <span style={{ color: "#707070", fontSize: "0.7rem" }}>Today's Revenue</span>
                <strong style={{ display: "block", color: "#111111", fontSize: "1.05rem", marginTop: "0.15rem" }}>$12,450</strong>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px" }}>
                <span style={{ color: "#707070", fontSize: "0.7rem" }}>Pending Renewals</span>
                <strong style={{ display: "block", color: "#D9A928", fontSize: "1.05rem", marginTop: "0.15rem" }}>14 Orgs</strong>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px" }}>
                <span style={{ color: "#707070", fontSize: "0.7rem" }}>New Customers</span>
                <strong style={{ display: "block", color: "#18B67A", fontSize: "1.05rem", marginTop: "0.15rem" }}>+18 Orgs</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SUBSCRIPTION DISTRIBUTION ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Subscription Distribution</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Active client subscription plan breakdown</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { plan: "Basic Tier", count: 42, color: "#94A3B8", pct: "17%" },
              { plan: "Standard Tier", count: 84, color: "#3B82F6", pct: "35%" },
              { plan: "Premium Tier", count: 68, color: "#8B5CF6", pct: "28%" },
              { plan: "Premium+ Enterprise", count: 21, color: "#D9A928", pct: "9%" },
              { plan: "Trial Accounts", count: 32, color: "#10B981", pct: "11%" },
            ].map((p, idx) => (
              <div key={idx} style={{ fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{p.plan}</span>
                  <span style={{ fontWeight: 700, color: "#707070" }}>{p.count} Orgs ({p.pct})</span>
                </div>
                <div style={{ height: "6px", width: "100%", backgroundColor: "#F7F4ED", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: p.pct, backgroundColor: p.color, borderRadius: "99px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 4. ORGANIZATION OVERVIEW & 6. ACTIVE PROGRAM STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* ── 4. ORGANIZATION OVERVIEW ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Organization Overview</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>237 Total Customer Accounts</span>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#D9A928", backgroundColor: "#FFF7E4", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>+24 this month</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {[
              { type: "Enterprise", count: 38 },
              { type: "Training", count: 102 },
              { type: "Institutions", count: 21 },
              { type: "Webinars", count: 44 },
              { type: "Bootcamps", count: 32 },
              { type: "Total", count: 237 },
            ].map((cat, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 600, textTransform: "uppercase" }}>{cat.type}</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111111", marginTop: "0.15rem" }}>{cat.count}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#707070", borderTop: "1px solid #E6DED0", paddingTop: "0.85rem" }}>
            <span>Active: <strong style={{ color: "#18B67A" }}>228</strong></span>
            <span>Paused: <strong style={{ color: "#D9A928" }}>6</strong></span>
            <span>Suspended: <strong style={{ color: "#E15D5D" }}>3</strong></span>
          </div>
        </section>

        {/* ── 6. ACTIVE PROGRAM STATISTICS ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Program Statistics</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>559 Total Ecosystem Programs</span>
            </div>
            <BookOpen size={20} color="#2563EB" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {[
              { status: "Running", count: 142, color: "#18B67A" },
              { status: "Scheduled", count: 68, color: "#2563EB" },
              { status: "Completed", count: 310, color: "#7C3AED" },
              { status: "Draft", count: 24, color: "#D9A928" },
              { status: "Archived", count: 12, color: "#707070" },
              { status: "Cancelled", count: 3, color: "#E15D5D" },
            ].map((p, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 600, textTransform: "uppercase" }}>{p.status}</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: p.color, marginTop: "0.15rem" }}>{p.count}</div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 7. USER STATISTICS & 8. OYEN AI USAGE ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* ── 7. USER STATISTICS BREAKDOWN ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>User Statistics</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Role-based user allocation across ecosystem</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", fontSize: "0.8rem" }}>
            {[
              { role: "Org Owners", count: 247 },
              { role: "Program Managers", count: 512 },
              { role: "Facilitators", count: 1240 },
              { role: "Learners", count: 18942 },
              { role: "Viewers", count: 380 },
              { role: "OYEN Staff", count: 48 },
            ].map((u, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#707070", fontWeight: 500 }}>{u.role}</span>
                <strong style={{ color: "#111111", fontWeight: 800 }}>{u.count.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. OYEN AI USAGE TELEMETRY ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>OYEN AI Intelligence</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>Real-time AI engine activity & costs</span>
            </div>
            <Cpu size={20} color="#7C3AED" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem", fontSize: "0.8rem" }}>
            <div style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE", padding: "0.85rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#6D28D9", fontWeight: 700 }}>QUESTIONS TODAY</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#5B21B6", marginTop: "0.2rem" }}>4,820</div>
            </div>
            <div style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE", padding: "0.85rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#6D28D9", fontWeight: 700 }}>SUMMARIES GENERATED</span>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#5B21B6", marginTop: "0.2rem" }}>1,140</div>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070" }}>Avg Response Time</span>
              <strong style={{ display: "block", color: "#18B67A", marginTop: "0.15rem" }}>420 ms</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070" }}>Success Rate</span>
              <strong style={{ display: "block", color: "#18B67A", marginTop: "0.15rem" }}>99.8%</strong>
            </div>
          </div>
        </section>

      </div>

      {/* ── 9. LIVE ACTIVITY FEED & 10. ALERTS & ATTENTION ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* ── 9. LIVE ACTIVITY FEED ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Live Operational Activity</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>Real-time ecosystem events</span>
            </div>
            <Clock size={18} color="#707070" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {auditLogs.map((log, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center", fontSize: "0.8rem", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.75rem" }}>
                <span style={{ color: "#707070", fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700 }}>{log.time}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "#111111" }}>{log.text}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070" }}>{log.detail}</div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                  {log.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. ALERTS & ATTENTION ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Alerts & Attention</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>Business priority notifications</span>
            </div>
            <AlertTriangle size={20} color="#E15D5D" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {alerts.map((al, idx) => (
              <div key={idx} style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", padding: "0.85rem 1rem", borderRadius: "8px", fontSize: "0.78rem" }}>
                <div style={{ fontWeight: 800, color: "#DC2626" }}>⚠ {al.title}</div>
                <div style={{ fontSize: "0.72rem", color: "#991B1B", marginTop: "0.15rem" }}>{al.detail}</div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 11. PENDING APPROVALS & 12. CUSTOMER SUCCESS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* ── 11. PENDING APPROVALS ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Pending Approvals</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Actions requiring executive review</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8rem" }}>
            {[
              { item: "Organization Verification", count: 3 },
              { item: "Custom Domain Approvals", count: 5 },
              { item: "Enterprise Upgrade Requests", count: 2 },
              { item: "Custom Pricing Approvals", count: 2 },
            ].map((p, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#111111", fontWeight: 500 }}>{p.item}</span>
                <span style={{ backgroundColor: "#D9A928", color: "#FFFFFF", padding: "0.15rem 0.5rem", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 800 }}>{p.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 12. CUSTOMER SUCCESS & HEALTH ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Customer Success</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Client satisfaction & support performance</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem", fontSize: "0.8rem" }}>
            <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070" }}>Healthy Organizations</span>
              <strong style={{ display: "block", color: "#18B67A", fontSize: "1.3rem", marginTop: "0.15rem" }}>228 Orgs</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070" }}>At-Risk Accounts</span>
              <strong style={{ display: "block", color: "#E15D5D", fontSize: "1.3rem", marginTop: "0.15rem" }}>3 Orgs</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070" }}>Net Promoter Score (NPS)</span>
              <strong style={{ display: "block", color: "#D9A928", fontSize: "1.3rem", marginTop: "0.15rem" }}>+72</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070" }}>CSAT Rating</span>
              <strong style={{ display: "block", color: "#18B67A", fontSize: "1.3rem", marginTop: "0.15rem" }}>96.4%</strong>
            </div>
          </div>
        </section>

      </div>

      {/* ── 13. GROWTH ANALYTICS & 14. SYSTEM UTILIZATION ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* ── 13. GROWTH ANALYTICS ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Monthly Growth Analytics</h3>
              <span style={{ fontSize: "0.75rem", color: "#707070" }}>Key performance expansion indicators</span>
            </div>
            <TrendingUp size={20} color="#18B67A" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", textAlign: "center" }}>
            {[
              { label: "New Orgs", val: "+24" },
              { label: "New Learners", val: "+2,840" },
              { label: "Programs Created", val: "+78" },
              { label: "Certs Issued", val: "+1,920" },
              { label: "Sessions Held", val: "+840" },
              { label: "Retention Rate", val: "96.8%" },
            ].map((g, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 600, textTransform: "uppercase" }}>{g.label}</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#18B67A", marginTop: "0.15rem" }}>{g.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 14. SYSTEM UTILIZATION ── */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Capacity Utilization</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>High-level resource consumption</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            {[
              { res: "File Storage", val: "1.2 TB / 5 TB (24%)" },
              { res: "Bandwidth", val: "14.2 TB / Month" },
              { res: "Live Session Minutes", val: "184,000 mins" },
              { res: "Certificates Generated", val: "8,420 PDFs" },
            ].map((r, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#707070" }}>{r.res}</span>
                <strong style={{ color: "#111111" }}>{r.val}</strong>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 16. REGIONAL DISTRIBUTION ── */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111111" }}>Regional Customer Distribution</h3>
            <span style={{ fontSize: "0.75rem", color: "#707070" }}>Global presence of subscribed organizations</span>
          </div>
          <Globe size={20} color="#D9A928" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
          {[
            { country: "Nigeria 🇳🇬", count: "112 Orgs", pct: "48%" },
            { country: "Ghana 🇬🇭", count: "42 Orgs", pct: "18%" },
            { country: "Kenya 🇰🇪", count: "34 Orgs", pct: "14%" },
            { country: "South Africa 🇿🇦", count: "24 Orgs", pct: "10%" },
            { country: "United Kingdom 🇬🇧", count: "15 Orgs", pct: "6%" },
            { country: "United States 🇺🇸", count: "10 Orgs", pct: "4%" },
          ].map((reg, i) => (
            <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111111" }}>{reg.country}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#D9A928", marginTop: "0.25rem" }}>{reg.count}</div>
              <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600 }}>{reg.pct} share</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 15. QUICK ACTIONS SHORTCUTS ── */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Quick Actions Shortcuts</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create Organization", "Invite Internal Staff", "View Revenue Reports", 
            "Open Billing Portal", "Launch OYEN AI", "Platform Settings", "Audit Logs"
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
              {act} →
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
