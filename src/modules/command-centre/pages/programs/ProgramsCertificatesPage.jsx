import React from "react";
import { Award, Download, CheckCircle2, XCircle, ShieldCheck, Search, Plus } from "lucide-react";

export default function ProgramsCertificatesPage() {
  const certificates = [
    { id: "CERT-2026-8801", program: "Cloud Architecture Masterclass", org: "ABC Energy Workspace", learner: "Emeka Okafor", issued: "Aug 05, 2026", status: "Verified & Immutable" },
    { id: "CERT-2026-8802", program: "Grid Operations & Safety", org: "VoltPower Ltd", learner: "Bisi Akande", issued: "Aug 01, 2026", status: "Verified & Immutable" },
    { id: "CERT-2026-8803", program: "STEM Education Leaders", org: "Lagos State Education Board", learner: "Chidi Nnamdi", issued: "Jul 25, 2026", status: "Verified & Immutable" },
    { id: "CERT-2026-8804", program: "Executive Leadership Acceleration", org: "MTN Academy West Africa", learner: "Fatima Santos", issued: "Jul 10, 2026", status: "Revoked (Duplicate)" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Programs <span style={{ color: "#D9A928" }}>/</span> Certificates
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Global Certificate Issuance & Verification
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage digital certificate issuance, cryptographic verification links, template designs, and revocation registries across all ecosystem programs.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Exporting Certificates CSV...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Export Certificates
            </button>
            <button
              onClick={() => alert("Issue Certificate Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Issue Certificate
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (5 Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Issued Certificates", val: "14,890", color: "#18B67A" },
          { label: "Pending Issuance", val: "42", color: "#D9A928" },
          { label: "Certificate Templates", val: "16 Templates", color: "#111111" },
          { label: "Verification Requests", val: "1,240 Today", color: "#2563EB" },
          { label: "Revoked Certificates", val: "3 Revoked", color: "#EF4444" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* CERTIFICATE DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CERTIFICATE ID</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PROGRAM NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LEARNER RECIPIENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ISSUED DATE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>VERIFICATION STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, fontFamily: "monospace", color: "#111111" }}>{c.id}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{c.program}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.org}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{c.learner}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.issued}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: c.status.includes("Verified") ? "#E6F8F0" : "#FEF2F2", color: c.status.includes("Verified") ? "#18B67A" : "#EF4444", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Verifying certificate hash for ${c.id}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Verify Link →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK CERTIFICATE ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Certificate Governance Actions
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Issue Single or Bulk Certificates",
            "Revoke Invalidated Certificate ID",
            "Verify Cryptographic Signature",
            "Download PDF High-Res Credential",
            "Export Global Certificate Ledger"
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
