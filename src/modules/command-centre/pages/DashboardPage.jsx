import React, { useState, useEffect } from "react";
import { 
  Building2, Users, DollarSign, Activity, ShieldCheck, Cpu, AlertTriangle, 
  TrendingUp, CheckCircle2, Clock, Globe, ArrowUpRight, FileText, Award, 
  Sparkles, CreditCard, ChevronRight, BarChart2, Layers, RefreshCw
} from "lucide-react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Shola");
  const [realtimeTime, setRealtimeTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setRealtimeTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const firstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
    setUserName(firstName);
  }, []);

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. EXECUTIVE SUMMARY (HERO) */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.25rem" }}>
              OYEN GROUP • Enterprise Operations Overview
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Good Morning, {userName} 👋
            </h1>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.9rem", color: "#18B67A", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#18B67A" }} />
              The OYEN ecosystem is operating normally.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#707070", fontWeight: 600, backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.4rem 0.75rem", borderRadius: "6px" }}>
              Live • {realtimeTime || "10:45 AM"} WAT
            </span>
          </div>
        </div>

        {/* Top-line KPI Pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.75rem" }}>
          {[
            { label: "Total Organizations", value: "247", sub: "+18 this month", color: "#111111", icon: <Building2 size={18} color="#D9A928" /> },
            { label: "Active Learners", value: "18,942", sub: "Across all workspaces", color: "#111111", icon: <Users size={18} color="#D9A928" /> },
            { label: "Live Sessions Today", value: "463", sub: "Currently active", color: "#111111", icon: <Activity size={18} color="#D9A928" /> },
            { label: "Platform Uptime", value: "99.97%", sub: "SLA compliance", color: "#18B67A", icon: <ShieldCheck size={18} color="#18B67A" /> }
          ].map((stat, idx) => (
            <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.1rem", fontFamily: "'Outfit', sans-serif" }}>{stat.value}</div>
                <div style={{ fontSize: "0.68rem", color: "#707070", marginTop: "0.1rem" }}>{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. PLATFORM HEALTH (EXECUTIVE LEVEL) */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Executive Service Health Status
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {[
            "Authentication", "Database", "AI Engine", "Live Sessions",
            "Notifications", "Payments", "File Storage", "Background Jobs"
          ].map((svc, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.65rem 0.85rem", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111111" }}>{svc}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#18B67A", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#18B67A" }} /> Healthy
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* GRID ROW 1: REVENUE SNAPSHOT + SUBSCRIPTION DISTRIBUTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
        
        {/* 3. REVENUE SNAPSHOT */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px" }}>
                Revenue Performance Snapshot
              </div>
              <span style={{ fontSize: "0.72rem", color: "#18B67A", fontWeight: 700, backgroundColor: "#E6F8F0", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                +18.4% MoM Growth
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>Monthly Recurring (MRR)</span>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111111", marginTop: "0.25rem", fontFamily: "'Outfit', sans-serif" }}>$48,250</div>
                <span style={{ fontSize: "0.7rem", color: "#18B67A", fontWeight: 600 }}>↑ +$4,120 vs last month</span>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>Annual Run Rate (ARR)</span>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#D9A928", marginTop: "0.25rem", fontFamily: "'Outfit', sans-serif" }}>$579,000</div>
                <span style={{ fontSize: "0.7rem", color: "#707070" }}>Projected annualized</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginTop: "1rem", fontSize: "0.78rem" }}>
              <div style={{ backgroundColor: "#F7F4ED", padding: "0.75rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
                <div style={{ color: "#707070", fontSize: "0.68rem" }}>Today's Revenue</div>
                <strong style={{ color: "#111111", fontSize: "0.95rem" }}>$3,420</strong>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", padding: "0.75rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
                <div style={{ color: "#707070", fontSize: "0.68rem" }}>Pending Renewals</div>
                <strong style={{ color: "#D9A928", fontSize: "0.95rem" }}>14 Orgs</strong>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", padding: "0.75rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
                <div style={{ color: "#707070", fontSize: "0.68rem" }}>Trial Accounts</div>
                <strong style={{ color: "#2563EB", fontSize: "0.95rem" }}>32 Orgs</strong>
              </div>
              <div style={{ backgroundColor: "#F7F4ED", padding: "0.75rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
                <div style={{ color: "#707070", fontSize: "0.68rem" }}>Churn Rate</div>
                <strong style={{ color: "#18B67A", fontSize: "0.95rem" }}>0.81%</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SUBSCRIPTION DISTRIBUTION */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Subscription Plan Distribution
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { plan: "Basic Tier", count: 42, pct: "18%", color: "#94A3B8" },
              { plan: "Standard Tier", count: 88, pct: "37%", color: "#2563EB" },
              { plan: "Premium Tier", count: 64, pct: "27%", color: "#D9A928" },
              { plan: "Premium+ Enterprise", count: 21, pct: "9%", color: "#7C3AED" },
              { plan: "Free Trial", count: 18, pct: "7%", color: "#16A34A" },
              { plan: "Expired", count: 4, pct: "2%", color: "#EF4444" }
            ].map((p, idx) => (
              <div key={idx} style={{ fontSize: "0.78rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "#111111" }}>{p.plan}</span>
                  <span style={{ color: "#707070", fontWeight: 700 }}>{p.count} orgs ({p.pct})</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E6DED0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: p.pct, backgroundColor: p.color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* GRID ROW 2: ORGANIZATIONS OVERVIEW + ACTIVE PROGRAMS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* 4. ORGANIZATION OVERVIEW */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Organizations Portfolio
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {[
              { type: "Enterprise", count: 38 },
              { type: "Training", count: 102 },
              { type: "Institutions", count: 21 },
              { type: "Webinars", count: 44 },
              { type: "Bootcamps", count: 32 },
              { type: "Total Portfolio", count: 237, highlight: true }
            ].map((item, idx) => (
              <div key={idx} style={{ backgroundColor: item.highlight ? "#FFF7E4" : "#F7F4ED", border: item.highlight ? "1px solid #D9A928" : "1px solid #E6DED0", borderRadius: "6px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.68rem", color: item.highlight ? "#D9A928" : "#707070", fontWeight: 700 }}>{item.type}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111111", marginTop: "0.15rem" }}>{item.count}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#707070", borderTop: "1px solid #E6DED0", paddingTop: "0.85rem" }}>
            <span>Active: <strong style={{ color: "#18B67A" }}>228 Orgs</strong></span>
            <span>Paused: <strong style={{ color: "#D9A928" }}>7 Orgs</strong></span>
            <span>Suspended: <strong style={{ color: "#EF4444" }}>2 Orgs</strong></span>
          </div>
        </section>

        {/* 6. ACTIVE PROGRAM STATISTICS */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Programs Overview across Ecosystem
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {[
              { label: "Running", count: 142, color: "#18B67A" },
              { label: "Scheduled", count: 38, color: "#2563EB" },
              { label: "Completed", count: 520, color: "#707070" },
              { label: "Draft", count: 19, color: "#D9A928" },
              { label: "Archived", count: 84, color: "#707070" },
              { label: "Cancelled", count: 3, color: "#EF4444" }
            ].map((p, idx) => (
              <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 600 }}>{p.label}</span>
                <strong style={{ display: "block", fontSize: "1.2rem", color: p.color, marginTop: "0.15rem" }}>{p.count}</strong>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* GRID ROW 3: USER STATISTICS + OYEN AI USAGE */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2rem" }}>
        
        {/* 7. USER STATISTICS */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Global User Census Breakdown
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {[
              { role: "Org Owners", count: "247" },
              { role: "Program Managers", count: "512" },
              { role: "Facilitators", count: "1,240" },
              { role: "Active Learners", count: "18,942" },
              { role: "Viewers", count: "310" },
              { role: "OYEN Staff", count: "45" },
              { role: "Invited Users", count: "89" },
              { role: "Total Identities", count: "21,385", bold: true }
            ].map((u, idx) => (
              <div key={idx} style={{ backgroundColor: u.bold ? "#FFF7E4" : "#F7F4ED", border: u.bold ? "1px solid #D9A928" : "1px solid #E6DED0", padding: "0.7rem 0.75rem", borderRadius: "6px" }}>
                <div style={{ fontSize: "0.65rem", color: "#707070", fontWeight: 600 }}>{u.role}</div>
                <strong style={{ fontSize: "1.1rem", color: "#111111", marginTop: "0.15rem", display: "block" }}>{u.count}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* 8. AI USAGE */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={14} color="#D9A928" /> OYEN AI Command Engine
            </div>
            <span style={{ fontSize: "0.7rem", color: "#18B67A", fontWeight: 700 }}>GPT-4o & Claude 3.5 Operational</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", fontSize: "0.78rem" }}>
            <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
              <span style={{ color: "#707070", fontSize: "0.68rem" }}>Questions Asked Today</span>
              <strong style={{ display: "block", fontSize: "1.25rem", color: "#111111", marginTop: "0.15rem" }}>12,450</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
              <span style={{ color: "#707070", fontSize: "0.68rem" }}>Summaries Generated</span>
              <strong style={{ display: "block", fontSize: "1.25rem", color: "#111111", marginTop: "0.15rem" }}>1,840</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
              <span style={{ color: "#707070", fontSize: "0.68rem" }}>AI Token Credits Used</span>
              <strong style={{ display: "block", fontSize: "1.25rem", color: "#D9A928", marginTop: "0.15rem" }}>485,000</strong>
            </div>
            <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
              <span style={{ color: "#707070", fontSize: "0.68rem" }}>Avg Latency & Accuracy</span>
              <strong style={{ display: "block", fontSize: "1.25rem", color: "#18B67A", marginTop: "0.15rem" }}>0.42s (99.8%)</strong>
            </div>
          </div>
        </section>

      </div>

      {/* GRID ROW 4: LIVE ACTIVITY FEED + ALERTS & PENDING APPROVALS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem" }}>
        
        {/* 9. LIVE ACTIVITY FEED */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.25rem" }}>
            Real-Time Operational Activity Stream
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { time: "09:30", text: "Payment Successful", detail: "Annual invoice $12,400 paid by Lagos State Gov", badge: "Payment", badgeBg: "#E6F8F0", badgeColor: "#18B67A" },
              { time: "09:27", text: "Certificate Generated", detail: "85 certificates issued for Data Analytics Bootcamp", badge: "Certificate", badgeBg: "#FFF7E4", badgeColor: "#D9A928" },
              { time: "09:25", text: "Institution Added", detail: "University of Ghana workspace provisioned", badge: "Onboarding", badgeBg: "#EFF6FF", badgeColor: "#2563EB" },
              { time: "09:20", text: "250 Learners Joined Session", detail: "Live Workshop 'Cloud Architecture Masterclass'", badge: "Session", badgeBg: "#F5F3FF", badgeColor: "#7C3AED" },
              { time: "09:16", text: "Program Created", detail: "MTN Leadership Acceleration Program 2026", badge: "Program", badgeBg: "#F7F4ED", badgeColor: "#111111" },
              { time: "09:13", text: "ABC Energy upgraded to Premium+", detail: "Expanded quota to 5,000 seats", badge: "Upgrade", badgeBg: "#E6F8F0", badgeColor: "#18B67A" }
            ].map((act, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F7F4ED", paddingBottom: "0.65rem", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#707070", width: "42px" }}>{act.time}</span>
                  <div>
                    <strong style={{ color: "#111111" }}>{act.text}</strong>
                    <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.1rem" }}>{act.detail}</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, backgroundColor: act.badgeBg, color: act.badgeColor, padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                  {act.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 10 & 11. ALERTS & PENDING APPROVALS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* 10. Alerts & Attention */}
          <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#EF4444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <AlertTriangle size={15} color="#EF4444" /> Action Required & Risk Alerts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "⚠ Payment Failed: Global Tech Academy ($1,200)",
                "⚠ Storage Near Limit: Lagos Edu Hub (92% used)",
                "⚠ Subscription Expiring: VoltPower Ltd (3 days left)",
                "⚠ AI Credits Low: MTN Enterprise Workspace"
              ].map((al, idx) => (
                <div key={idx} style={{ fontSize: "0.78rem", color: "#991B1B", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", padding: "0.5rem 0.75rem", borderRadius: "6px", fontWeight: 600 }}>
                  {al}
                </div>
              ))}
            </div>
          </section>

          {/* 11. Pending Approvals */}
          <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.85rem" }}>
              Pending Approvals Queue
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.78rem" }}>
              {[
                { title: "Organization Verification", detail: "UNICEF West Africa", date: "Today" },
                { title: "Domain Verification", detail: "custom.abcenergy.com", date: "Today" },
                { title: "Custom Enterprise Plan Request", detail: "10k seat custom quote", date: "Yesterday" }
              ].map((app, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF7E4", border: "1px solid #FDE68A", padding: "0.55rem 0.75rem", borderRadius: "6px" }}>
                  <div>
                    <strong style={{ color: "#111111" }}>{app.title}</strong>
                    <div style={{ fontSize: "0.7rem", color: "#707070" }}>{app.detail}</div>
                  </div>
                  <button style={{ backgroundColor: "#D9A928", border: "none", color: "#FFFFFF", fontWeight: 700, fontSize: "0.68rem", padding: "0.3rem 0.6rem", borderRadius: "4px", cursor: "pointer" }}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

      {/* GRID ROW 5: CUSTOMER SUCCESS + REGIONAL DISTRIBUTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* 12. CUSTOMER SUCCESS */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            Customer Success & Health Metrics
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "0.85rem", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.65rem", color: "#166534", fontWeight: 700 }}>Healthy Orgs</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#15803D", marginTop: "0.15rem" }}>234 Orgs</strong>
            </div>
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", padding: "0.85rem", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.65rem", color: "#991B1B", fontWeight: 700 }}>At Risk Orgs</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#DC2626", marginTop: "0.15rem" }}>3 Orgs</strong>
            </div>
            <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", padding: "0.85rem", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.65rem", color: "#92400E", fontWeight: 700 }}>NPS Score</span>
              <strong style={{ display: "block", fontSize: "1.2rem", color: "#B45309", marginTop: "0.15rem" }}>72 / 100</strong>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#707070", borderTop: "1px solid #E6DED0", paddingTop: "0.85rem" }}>
            <span>CSAT Rating: <strong style={{ color: "#111111" }}>98.4%</strong></span>
            <span>Avg Ticket Response: <strong style={{ color: "#111111" }}>12 mins</strong></span>
            <span>Open Tickets: <strong style={{ color: "#D9A928" }}>7 tickets</strong></span>
          </div>
        </section>

        {/* 16. REGIONAL DISTRIBUTION */}
        <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Globe size={15} color="#D9A928" /> Regional Enterprise Footprint
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {[
              { country: "Nigeria 🇳🇬", orgs: "112 Orgs" },
              { country: "Ghana 🇬🇭", orgs: "45 Orgs" },
              { country: "Kenya 🇰🇪", orgs: "38 Orgs" },
              { country: "South Africa 🇿🇦", orgs: "24 Orgs" },
              { country: "United Kingdom 🇬🇧", orgs: "16 Orgs" },
              { country: "United States 🇺🇸", orgs: "12 Orgs" }
            ].map((reg, idx) => (
              <div key={idx} style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.75rem", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#111111" }}>{reg.country}</span>
                <strong style={{ display: "block", fontSize: "0.95rem", color: "#D9A928", marginTop: "0.15rem" }}>{reg.orgs}</strong>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 14. SYSTEM UTILIZATION (CAPACITY) */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Global Capacity Utilization
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem", fontSize: "0.78rem" }}>
          <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
            <span style={{ color: "#707070", fontSize: "0.68rem" }}>Storage Allocation</span>
            <strong style={{ display: "block", fontSize: "1.1rem", color: "#111111", marginTop: "0.15rem" }}>4.2 TB / 10 TB</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
            <span style={{ color: "#707070", fontSize: "0.68rem" }}>Monthly Bandwidth</span>
            <strong style={{ display: "block", fontSize: "1.1rem", color: "#111111", marginTop: "0.15rem" }}>1.8 TB Used</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
            <span style={{ color: "#707070", fontSize: "0.68rem" }}>Emails Sent MTD</span>
            <strong style={{ display: "block", fontSize: "1.1rem", color: "#111111", marginTop: "0.15rem" }}>42,500 Emails</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
            <span style={{ color: "#707070", fontSize: "0.68rem" }}>Live Session Minutes</span>
            <strong style={{ display: "block", fontSize: "1.1rem", color: "#111111", marginTop: "0.15rem" }}>184,500 Mins</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", padding: "0.85rem", borderRadius: "6px", border: "1px solid #E6DED0" }}>
            <span style={{ color: "#707070", fontSize: "0.68rem" }}>Certificates Issued</span>
            <strong style={{ display: "block", fontSize: "1.1rem", color: "#D9A928", marginTop: "0.15rem" }}>890 Certificates</strong>
          </div>
        </div>
      </section>

      {/* 15. EXECUTIVE QUICK ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Executive Actions Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "Create Organization", action: () => alert("Create Organization Modal") },
            { label: "Invite Internal Staff", action: () => alert("Invite Staff Modal") },
            { label: "View Financial Reports", action: () => alert("Financial Reports") },
            { label: "Open Billing Cockpit", action: () => alert("Billing Cockpit") },
            { label: "Launch OYEN AI Console", action: () => alert("AI Console") },
            { label: "Platform Settings", action: () => alert("Platform Settings") },
            { label: "Security Audit Logs", action: () => alert("Audit Logs") }
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={act.action}
              style={{
                padding: "0.65rem 1.15rem", border: "1px solid #E6DED0", borderRadius: "8px",
                backgroundColor: "#F7F4ED", color: "#111111", fontSize: "0.82rem",
                fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#D9A928"; e.currentTarget.style.backgroundColor = "#FFF7E4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E6DED0"; e.currentTarget.style.backgroundColor = "#F7F4ED"; }}
            >
              {act.label}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
