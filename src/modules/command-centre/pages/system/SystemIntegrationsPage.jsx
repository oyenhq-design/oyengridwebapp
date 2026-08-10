import React from "react";
import { Link2, RefreshCw, Key, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

export default function SystemIntegrationsPage() {
  const integrations = [
    { name: "Paystack Payment Gateway", category: "Payments", status: "Connected", health: "100% OK", lastWebhook: "2 mins ago" },
    { name: "Stripe Global Payments", category: "Payments", status: "Connected", health: "100% OK", lastWebhook: "5 mins ago" },
    { name: "Flutterwave Merchant Services", category: "Payments", status: "Connected", health: "100% OK", lastWebhook: "12 mins ago" },
    { name: "Google Workspace & OAuth SSO", category: "Authentication", status: "Connected", health: "100% OK", lastWebhook: "Active Sync" },
    { name: "Microsoft 365 Enterprise SSO", category: "Authentication", status: "Connected", health: "100% OK", lastWebhook: "Active Sync" },
    { name: "Zoom Video Communications", category: "Live Streaming", status: "Connected", health: "100% OK", lastWebhook: "1 hour ago" },
    { name: "Microsoft Teams Education", category: "Live Streaming", status: "Connected", health: "100% OK", lastWebhook: "2 hours ago" },
    { name: "SendGrid SMTP Dispatcher", category: "Email Infrastructure", status: "Connected", health: "100% OK", lastWebhook: "Active" },
    { name: "Twilio SMS & WhatsApp Gateway", category: "Messaging", status: "Connected", health: "100% OK", lastWebhook: "Active" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          System <span style={{ color: "#D9A928" }}>/</span> Integrations
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              External Platform Integrations & API Keys
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Configure payment gateways (Paystack, Stripe), SSO identity providers, Zoom/Teams webhooks, SMTP, and Twilio SMS.
            </p>
          </div>

          <button
            onClick={() => alert("Generate New Master API Key Modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Key size={14} /> Generate Master API Key
          </button>
        </div>
      </div>

      {/* INTEGRATIONS DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>INTEGRATION SERVICE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CATEGORY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>HEALTH STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LAST WEBHOOK EVENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CONNECTION STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((i, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{i.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{i.category}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#18B67A", fontWeight: 700 }}>{i.health}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{i.lastWebhook}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#E6F8F0", color: "#18B67A", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    ● {i.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Rotating webhook secret for ${i.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Rotate Secret →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
