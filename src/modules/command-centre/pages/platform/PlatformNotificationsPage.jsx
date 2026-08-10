import React from "react";
import { Mail, MessageSquare, Bell, Plus, Download, RefreshCw, Send, ShieldCheck } from "lucide-react";

export default function PlatformNotificationsPage() {
  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Platform <span style={{ color: "#D9A928" }}>/</span> Notifications
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Notification Infrastructure & Multi-Channel Broadcast
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage transactional email dispatchers (SendGrid/Postmark), SMS gateways, mobile push notifications, and in-app alert queues.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Create Notification Template Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Plus size={14} /> Create Template
            </button>
            <button
              onClick={() => alert("Broadcast Announcement Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Send size={14} /> Broadcast Announcement
            </button>
          </div>
        </div>
      </div>

      {/* TOP NOTIFICATION KPIS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Delivery Success Rate", val: "99.8%", color: "#18B67A" },
          { label: "Emails Sent MTD", val: "42,500 Emails", color: "#111111" },
          { label: "SMS Messages Sent", val: "8,900 SMS", color: "#111111" },
          { label: "Push Notifications", val: "14,200 Push", color: "#2563EB" },
          { label: "Queue Latency", val: "1.2 Seconds", color: "#18B67A" },
          { label: "Failed Dispatches", val: "12 Failed", color: "#EF4444" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* NOTIFICATION ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Notification Infrastructure Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Broadcast Global System Announcement",
            "Retry Failed Email/SMS Deliveries",
            "Create New Notification Template",
            "Export Dispatch Delivery Logs"
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
