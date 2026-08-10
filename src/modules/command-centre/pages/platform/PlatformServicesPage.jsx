import React from "react";
import { Layers, ShieldCheck, Activity, RefreshCw, AlertTriangle, CheckCircle2, Cpu, HardDrive } from "lucide-react";

export default function PlatformServicesPage() {
  const services = [
    { name: "Authentication (Auth0 / OAuth2 / SSO)", status: "Operational", latency: "14ms", uptime: "99.99%", errors: "0%" },
    { name: "API Gateway Dispatcher", status: "Operational", latency: "18ms", uptime: "99.98%", errors: "0.01%" },
    { name: "Primary PostgreSQL Database Cluster", status: "Operational", latency: "4ms", uptime: "99.99%", errors: "0%" },
    { name: "Redis Memory Cache & Sessions", status: "Operational", latency: "1ms", uptime: "100%", errors: "0%" },
    { name: "Background Queue Workers (Celery / Bull)", status: "Operational", latency: "32ms", uptime: "99.95%", errors: "0%" },
    { name: "Live Session WebSockets", status: "Operational", latency: "22ms", uptime: "99.97%", errors: "0%" },
    { name: "Media Processing Engine", status: "Operational", latency: "110ms", uptime: "99.90%", errors: "0%" },
    { name: "Certificate Signing Service", status: "Operational", latency: "45ms", uptime: "100%", errors: "0%" },
    { name: "Email SMTP Dispatchers", status: "Operational", latency: "85ms", uptime: "99.96%", errors: "0%" },
    { name: "Search Indexer (Elasticsearch)", status: "Operational", latency: "12ms", uptime: "99.99%", errors: "0%" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Platform <span style={{ color: "#D9A928" }}>/</span> Services
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Core Infrastructure Services Health
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Monitor system health, latency, uptime SLAs, error rates, and service restart controls for OYEN GRID infrastructure.
            </p>
          </div>

          <button
            onClick={() => alert("Rechecking Platform Microservices Health...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <RefreshCw size={14} /> Recheck Services Health
          </button>
        </div>
      </div>

      {/* SERVICE HEALTH DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>MICROSERVICE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>RESPONSE LATENCY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>30-DAY UPTIME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ERROR RATE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{s.name}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#E6F8F0", color: "#18B67A", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    ● {s.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", fontFamily: "monospace", color: "#111111", fontWeight: 600 }}>{s.latency}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#18B67A", fontWeight: 700 }}>{s.uptime}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{s.errors}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Restarting microservice: ${s.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Restart →
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
