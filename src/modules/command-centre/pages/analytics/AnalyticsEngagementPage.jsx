import React from "react";
import { Activity, Users, Clock, Award, Video, Download } from "lucide-react";

export default function AnalyticsEngagementPage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Analytics <span style={{ color: "#D9A928" }}>/</span> Engagement
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Platform Activity & Learner Engagement
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Read-only telemetry tracking active users, live session attendance, program completion rates, and AI interaction frequency.
            </p>
          </div>

          <button
            onClick={() => alert("Exporting Engagement Telemetry...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <Download size={14} /> Export Engagement Logs
          </button>
        </div>
      </div>

      {/* ENGAGEMENT KPIS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Daily Active (DAU)", val: "4,850 Users", color: "#18B67A" },
          { label: "Monthly Active (MAU)", val: "18,942 Users", color: "#111111" },
          { label: "Avg Session Duration", val: "48 Minutes", color: "#2563EB" },
          { label: "Completion Rate", val: "88.4%", color: "#18B67A" },
          { label: "Attendance Rate", val: "94.2%", color: "#18B67A" },
          { label: "Live Sessions Today", val: "463 Sessions", color: "#D9A928" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* ENGAGEMENT HEATMAP SUMMARY */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Peak Platform Activity & Engagement Times
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", fontSize: "0.8rem" }}>
          <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ color: "#707070", fontSize: "0.72rem" }}>Peak Learning Hours</div>
            <strong style={{ fontSize: "1.1rem", color: "#111111", display: "block", marginTop: "0.2rem" }}>10:00 AM – 02:00 PM WAT</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ color: "#707070", fontSize: "0.72rem" }}>Most Active Day</div>
            <strong style={{ fontSize: "1.1rem", color: "#111111", display: "block", marginTop: "0.2rem" }}>Wednesday</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ color: "#707070", fontSize: "0.72rem" }}>Live Session Attendance</div>
            <strong style={{ fontSize: "1.1rem", color: "#18B67A", display: "block", marginTop: "0.2rem" }}>94.2% Verified</strong>
          </div>
          <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ color: "#707070", fontSize: "0.72rem" }}>AI Assistant Queries</div>
            <strong style={{ fontSize: "1.1rem", color: "#D9A928", display: "block", marginTop: "0.2rem" }}>12.4k / day</strong>
          </div>
        </div>
      </section>

    </div>
  );
}
