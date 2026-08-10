import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, BookOpen, Calendar, HelpCircle, HardDrive, 
  Cpu, Activity, DollarSign, TrendingUp, AlertTriangle, CheckCircle, 
  ArrowUpRight, ArrowDownRight, Globe, Layers, Award, Sparkles, Plus, 
  FileText, Clock, Server, Zap
} from "lucide-react";

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    ownerName: "Shola",
    mrr: 148250,
    arr: 1779000,
    todayRevenue: 4850,
    activeOrgsCount: 247,
    activeLearnersCount: 18942,
    liveSessionsCount: 463,
    uptime: "99.97%",
  });

  useEffect(() => {
    try {
      const firstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
      setTelemetry(prev => ({ ...prev, ownerName: firstName }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. EXECUTIVE SUMMARY (HERO HEADER) */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.2rem" }}>
              OYEN GROUP Headquarters
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.4rem 0", color: "#111111", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.5px" }}>
              Good Morning, {telemetry.ownerName} 👋
            </h1>
            <p style={{ margin: 0, fontSize: "0.92rem", color: "#707070", fontWeight: 500 }}>
              The OYEN enterprise ecosystem is operating normally today across all customer organizations and services.
            </p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "0.6rem 1rem", borderRadius: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16A34A" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#15803D" }}>Ecosystem Healthy • {telemetry.uptime} Uptime</span>
          </div>
        </div>

        {/* Hero KPIs Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginTop: "2rem" }}>
          {[
            { label: "Active Organizations", val: telemetry.activeOrgsCount.toLocaleString(), change: "+18 this month", icon: <Building2Icon /> },
            { label: "Active Learners", val: telemetry.activeLearnersCount.toLocaleString(), change: "+2,400 this month", icon: <Users size={18} /> },
            { label: "Live Sessions Today", val: telemetry.liveSessionsCount.toLocaleString(), change: "+42 created today", icon: <Calendar size={18} /> },
            { label: "Monthly Recurring (MRR)", val: `$${telemetry.mrr.toLocaleString()}`, change: "+18.4% YoY", icon: <DollarSign size={18} /> },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "10px", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
              <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#111111", margin: "0.3rem 0 0.15rem 0", fontFamily: "'Outfit', sans-serif" }}>{item.val}</div>
              <div style={{ fontSize: "0.75rem", color: "#18B67A", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <TrendingUp size={13} /> {item.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SIMPLIFIED EXECUTIVE PLATFORM HEALTH */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
            Platform Health Status
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#707070" }}>8 core executive services monitored</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Authentication", status: "Healthy" },
            { label: "Database", status: "Healthy" },
            { label: "AI Engine", status: "Healthy" },
            { label: "Live Sessions", status: "Healthy" },
            { label: "Notifications", status: "Healthy" },
            { label: "Payments", status: "Healthy" },
            { label: "File Storage", status: "Healthy" },
            { label: "Background Jobs", status: "Healthy" },
          ].map((svc, i) => (
            <div key={i} style={{ border: "1px solid #E6DED0", padding: "0.85rem 1rem", borderRadius: "8px", backgroundColor: "#F7F4ED", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#111111", fontSize: "0.82rem", fontWeight: 600 }}>{svc.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#18B67A" }} />
                <span style={{ color: "#18B67A", fontSize: "0.75rem", fontWeight: 700 }}>{svc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 & 4. REVENUE SNAPSHOT & ORGANIZATION OVERVIEW GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
        
        {/* Revenue Snapshot Card */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>Revenue Snapshot</h3>
            <span style={{ fontSize: "0.72rem", color: "#D9A928", fontWeight: 700, backgroundColor: "#FFF7E4", padding: "0.2rem 0.55rem", borderRadius: "4px" }}>SaaS ARR Focus</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>Monthly Revenue (MRR)</span>
              <strong style={{ display: "block", fontSize: "1.35rem", color: "#111111", marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>${telemetry.mrr.toLocaleString()}</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>Annualized (ARR)</span>
              <strong style={{ display: "block", fontSize: "1.35rem", color: "#D9A928", marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>${telemetry.arr.toLocaleString()}</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ fontSize: "0.7rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>Today's Revenue</span>
              <strong style={{ display: "block", fontSize: "1.35rem", color: "#18B67A", marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>+${telemetry.todayRevenue.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", fontSize: "0.78rem" }}>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#FCFBF8" }}>
              <span style={{ color: "#707070", display: "block" }}>Pending Renewals</span>
              <strong style={{ color: "#111111", fontSize: "1rem", marginTop: "0.1rem", display: "block" }}>12 Orgs</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#FCFBF8" }}>
              <span style={{ color: "#707070", display: "block" }}>Trial Accounts</span>
              <strong style={{ color: "#D9A928", fontSize: "1rem", marginTop: "0.1rem", display: "block" }}>34 Active</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#FCFBF8" }}>
              <span style={{ color: "#707070", display: "block" }}>New Customers</span>
              <strong style={{ color: "#18B67A", fontSize: "1rem", marginTop: "0.1rem", display: "block" }}>+8 this wk</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#FCFBF8" }}>
              <span style={{ color: "#707070", display: "block" }}>Cancelled</span>
              <strong style={{ color: "#DC2626", fontSize: "1rem", marginTop: "0.1rem", display: "block" }}>1 Org</strong>
            </div>
          </div>
        </div>

        {/* Organization Overview by Category Card */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>Organization Breakdown</h3>
            <span style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700 }}>Total: 237 Orgs</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { type: "Enterprise", count: 38, pct: 16 },
              { type: "Training Companies", count: 102, pct: 43 },
              { type: "Institutions & Unis", count: 21, pct: 9 },
              { type: "Webinars & Workshops", count: 44, pct: 18 },
              { type: "Bootcamps", count: 32, pct: 14 },
            ].map((cat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span style={{ fontWeight: 600, color: "#111111" }}>{cat.type}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "100px", height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${cat.pct * 2}%`, height: "100%", backgroundColor: "#D9A928", borderRadius: "3px" }} />
                  </div>
                  <strong style={{ width: "30px", textAlign: "right", color: "#111111" }}>{cat.count}</strong>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", borderTop: "1px solid #E6DED0", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#707070" }}>
            <span>Growth this month: <strong style={{ color: "#18B67A" }}>+18 Orgs (+8.2%)</strong></span>
            <span>Active: <strong style={{ color: "#111111" }}>231</strong> | Paused: <strong>6</strong></span>
          </div>
        </div>

      </div>

      {/* 5, 6, 7. SUBSCRIPTION DISTRIBUTION, PROGRAMS & USERS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.75rem" }}>
        
        {/* Subscription Distribution */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Subscription Distribution</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", fontSize: "0.8rem" }}>
            {[
              { plan: "Basic", count: 45, color: "#707070" },
              { plan: "Standard", count: 98, color: "#2563EB" },
              { plan: "Premium", count: 64, color: "#D9A928" },
              { plan: "Premium+", count: 22, color: "#7C3AED" },
              { plan: "Trial", count: 34, color: "#18B67A" },
              { plan: "Expired", count: 4, color: "#DC2626" },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.4rem" }}>
                <span style={{ color: "#111111", fontWeight: 600 }}>{p.plan}</span>
                <strong style={{ color: p.color }}>{p.count} Orgs</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Active Program Statistics */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Active Program Stats</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", fontSize: "0.8rem" }}>
            {[
              { status: "Running", count: 142, color: "#18B67A" },
              { status: "Scheduled", count: 38, color: "#2563EB" },
              { status: "Completed", count: 310, color: "#707070" },
              { status: "Draft", count: 19, color: "#D9A928" },
              { status: "Archived", count: 8, color: "#9CA3AF" },
              { status: "Cancelled", count: 2, color: "#DC2626" },
            ].map((st, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.4rem" }}>
                <span style={{ color: "#111111", fontWeight: 600 }}>{st.status}</span>
                <strong style={{ color: st.color }}>{st.count} Programs</strong>
              </div>
            ))}
          </div>
        </div>

        {/* User Breakdown */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Ecosystem Users</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", fontSize: "0.8rem" }}>
            {[
              { role: "Organization Owners", count: 247 },
              { role: "Program Managers", count: 582 },
              { role: "Facilitators", count: 1420 },
              { role: "Learners", count: 18942 },
              { role: "Viewers / Guests", count: 310 },
              { role: "OYEN Group Staff", count: 48 },
            ].map((u, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.4rem" }}>
                <span style={{ color: "#707070" }}>{u.role}</span>
                <strong style={{ color: "#111111" }}>{u.count.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 8 & 9. OYEN AI METRICS & LIVE ACTIVITY FEED */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
        
        {/* OYEN AI Metrics */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Cpu size={18} color="#D9A928" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>OYEN AI Operations</h3>
            </div>
            <span style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700, backgroundColor: "#F0FDF4", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>99.8% Success Rate</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.8rem" }}>
            <div style={{ border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#707070", fontSize: "0.72rem", display: "block" }}>Questions Asked Today</span>
              <strong style={{ fontSize: "1.25rem", color: "#111111", marginTop: "0.2rem", display: "block" }}>8,420</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#707070", fontSize: "0.72rem", display: "block" }}>Summaries Generated</span>
              <strong style={{ fontSize: "1.25rem", color: "#111111", marginTop: "0.2rem", display: "block" }}>1,240</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#707070", fontSize: "0.72rem", display: "block" }}>AI Credits Used</span>
              <strong style={{ fontSize: "1.25rem", color: "#D9A928", marginTop: "0.2rem", display: "block" }}>482k / 1M</strong>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.85rem", borderRadius: "8px", backgroundColor: "#F7F4ED" }}>
              <span style={{ color: "#707070", fontSize: "0.72rem", display: "block" }}>Avg Response Time</span>
              <strong style={{ fontSize: "1.25rem", color: "#18B67A", marginTop: "0.2rem", display: "block" }}>1.2s</strong>
            </div>
          </div>
        </div>

        {/* Live Operational Activity Feed */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>Live Activity Stream</h3>
            <span style={{ fontSize: "0.72rem", color: "#707070" }}>Real-time updates</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { time: "09:30", text: "Payment Successful", detail: "ABC Energy ($12,500 via Invoice #INV-2026-904)", tag: "Payment", color: "#18B67A" },
              { time: "09:27", text: "Certificate Generated", detail: "Certificate #8920 for Senior Leadership Bootcamp", tag: "Certificate", color: "#2563EB" },
              { time: "09:25", text: "Institution Workspace Added", detail: "Covenant University Workspace Provisioned", tag: "Organization", color: "#7C3AED" },
              { time: "09:20", text: "250 Learners Joined Session", detail: "Artificial Intelligence in Finance Live Workshop", tag: "Session", color: "#D9A928" },
              { time: "09:16", text: "Program Created", detail: "Executive Product Management Cohort 3", tag: "Program", color: "#111111" },
              { time: "09:13", text: "ABC Energy Upgraded Plan", detail: "Upgraded from Standard to Premium+", tag: "Upgrade", color: "#18B67A" },
            ].map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.8rem", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.6rem" }}>
                <span style={{ color: "#707070", fontFamily: "monospace", width: "42px", flexShrink: 0 }}>{act.time}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "#111111" }}>{act.text}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.1rem" }}>{act.detail}</div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: act.color, backgroundColor: "#F7F4ED", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid #E6DED0" }}>
                  {act.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 10, 11, 12. ALERTS, APPROVALS & CUSTOMER SUCCESS HEALTH */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.75rem" }}>
        
        {/* Actionable Alerts */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#DC2626", textTransform: "uppercase", letterSpacing: "1px" }}>⚠ Alerts & Attention</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem" }}>
            {[
              { text: "Payment Failed", detail: "Invoice #INV-2026-891 (Apex Global)", color: "#DC2626" },
              { text: "Storage Near Limit", detail: "VoltPower Ltd at 88% quota capacity", color: "#D9A928" },
              { text: "Subscription Expiring", detail: "Apex Global — 3 days remaining", color: "#D9A928" },
              { text: "Domain Verification Pending", detail: "lagos.gov.ng pending DNS record check", color: "#2563EB" },
            ].map((al, i) => (
              <div key={i} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
                <strong style={{ color: al.color }}>{al.text}</strong>
                <div style={{ color: "#707070", fontSize: "0.72rem", marginTop: "0.15rem" }}>{al.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px" }}>Pending Approvals</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem" }}>
            {[
              { type: "Organization Verification", detail: "2 pending customer verifications", count: "2" },
              { type: "Domain Verification", detail: "3 custom domain DNS checks", count: "3" },
              { type: "Enterprise Custom Request", detail: "1 custom SLA agreement pending review", count: "1" },
            ].map((appr, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.5rem" }}>
                <div>
                  <strong style={{ color: "#111111" }}>{appr.type}</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070" }}>{appr.detail}</div>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{appr.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Success Health */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#18B67A", textTransform: "uppercase", letterSpacing: "1px" }}>Customer Success & Health</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", fontSize: "0.78rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Healthy Organizations:</span> <strong style={{ color: "#18B67A" }}>220 Orgs (93%)</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>At Risk Organizations:</span> <strong style={{ color: "#DC2626" }}>3 Orgs</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Customer NPS:</span> <strong style={{ color: "#111111" }}>78 (Excellent)</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Support Satisfaction:</span> <strong style={{ color: "#18B67A" }}>98.4%</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Avg Support Response:</span> <strong style={{ color: "#111111" }}>14 minutes</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Open Support Tickets:</span> <strong style={{ color: "#2563EB" }}>4 Tickets</strong></div>
          </div>
        </div>

      </div>

      {/* 13, 14, 16. GROWTH ANALYTICS, UTILIZATION & REGIONAL DISTRIBUTION */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.75rem" }}>
        
        {/* Growth Analytics */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Growth Metrics (This Month)</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.85rem", fontSize: "0.78rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>New Organizations:</span> <strong style={{ color: "#18B67A" }}>+18 Orgs</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>New Learners:</span> <strong style={{ color: "#18B67A" }}>+2,400 Learners</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Programs Created:</span> <strong style={{ color: "#111111" }}>+42 Programs</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Certificates Issued:</span> <strong style={{ color: "#D9A928" }}>+1,150</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Customer Retention Rate:</span> <strong style={{ color: "#18B67A" }}>96.2%</strong></div>
          </div>
        </div>

        {/* System Utilization (Executive Capacity) */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>System Capacity Utilization</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.85rem", fontSize: "0.78rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Storage Used:</span> <strong style={{ color: "#111111" }}>1.2 TB / 5 TB (24%)</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Bandwidth Consumed:</span> <strong style={{ color: "#111111" }}>14.2 TB</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>AI Tokens Allocated:</span> <strong style={{ color: "#D9A928" }}>48.2% Used</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Emails Dispatched:</span> <strong style={{ color: "#111111" }}>124,000 emails</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Live Session Minutes:</span> <strong style={{ color: "#18B67A" }}>45,200 mins</strong></div>
          </div>
        </div>

        {/* Regional Customer Distribution */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>Regional Customer Reach</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.85rem", fontSize: "0.78rem" }}>
            {[
              { country: "Nigeria 🇳🇬", count: 104 },
              { country: "Ghana 🇬🇭", count: 38 },
              { country: "Kenya 🇰🇪", count: 32 },
              { country: "South Africa 🇿🇦", count: 28 },
              { country: "United Kingdom 🇬🇧", count: 22 },
              { country: "United States 🇺🇸", count: 13 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#111111", fontWeight: 500 }}>{r.country}</span>
                <strong>{r.count} Orgs</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 15. EXECUTIVE QUICK ACTIONS SHORTCUTS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Executive Quick Actions
        </span>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create Customer Organization", "Invite OYEN Group Staff", "View Executive Reports", 
            "Open Financial Billing", "Launch OYEN AI Assistant", "Platform Configuration", "View Security Audit Logs"
          ].map((act, i) => (
            <button
              key={i}
              onClick={() => alert(`Executing: ${act}`)}
              style={{
                padding: "0.6rem 1.1rem", border: "1px solid #E6DED0", borderRadius: "8px",
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

function Building2Icon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}
