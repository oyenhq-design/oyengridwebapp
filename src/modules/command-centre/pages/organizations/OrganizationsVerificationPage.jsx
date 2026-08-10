import React, { useState } from "react";
import { ShieldCheck, FileCheck, CheckCircle2, XCircle, Clock, Download, Eye, UserCheck, AlertTriangle } from "lucide-react";

export default function OrganizationsVerificationPage() {
  const [selectedVerif, setSelectedVerif] = useState(null);

  const verificationQueue = [
    { id: "VER-901", org: "UNICEF West Africa", regNo: "RC-891042", busName: "UNICEF Regional Office", country: "Nigeria 🇳🇬", submittedBy: "Dr. Amina Bello", docs: ["CAC Certificate", "Tax ID (TIN)", "Official Email Domain"], status: "Pending Review", officer: "Femi Legal Officer", submittedDate: "Today @ 09:15 AM" },
    { id: "VER-902", org: "Sunrise Consulting Ltd", regNo: "RC-441029", busName: "Sunrise Consulting Nigeria Ltd", country: "Nigeria 🇳🇬", submittedBy: "Tunde Bakare", docs: ["Business Registration", "Tax ID"], status: "Pending Review", officer: "Unassigned", submittedDate: "Today @ 10:40 AM" },
    { id: "VER-903", org: "Nairobi Tech Institute", regNo: "KE-99201", busName: "Nairobi Institute of Tech", country: "Kenya 🇰🇪", submittedBy: "Grace Ochieng", docs: ["Certificate of Incorporation", "Domain Proof"], status: "More Info Requested", officer: "Amina Compliance", submittedDate: "Yesterday" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Organizations <span style={{ color: "#D9A928" }}>/</span> Verification
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Organization Verification & Legal Compliance
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Verify organization identity, CAC certificates, tax registrations, and domain ownership before unlocking full platform features.
            </p>
          </div>

          <button
            onClick={() => alert("Bulk Approving Verified Submissions...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <CheckCircle2 size={14} /> Bulk Approve Qualified
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS (7 Verification Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Pending Verification", val: "6 Orgs", color: "#D9A928" },
          { label: "Approved Orgs", val: "234 Approved", color: "#18B67A" },
          { label: "Rejected Submissions", val: "4 Rejected", color: "#EF4444" },
          { label: "Expired Certs", val: "1 Expired", color: "#707070" },
          { label: "Active Queue", val: "6 Requests", color: "#111111" },
          { label: "Documents Pending", val: "9 Docs", color: "#2563EB" },
          { label: "Requests Today", val: "3 Today", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* VERIFICATION QUEUE TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E6DED0", fontSize: "0.85rem", fontWeight: 800, color: "#111111" }}>
          Active Organization Verification Submissions
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>REGISTRATION NUMBER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>BUSINESS NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>SUBMITTED BY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ATTACHED DOCUMENTS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>REVIEW OFFICER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {verificationQueue.map((v, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{v.org}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontFamily: "monospace", color: "#111111" }}>{v.regNo}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{v.busName}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111" }}>{v.submittedBy}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {v.docs.map((doc, dIdx) => (
                      <span key={dIdx} style={{ fontSize: "0.65rem", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "0.15rem 0.4rem", borderRadius: "3px" }}>
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{v.officer}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", color: "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Reviewing submission for ${v.org}`)} style={{ backgroundColor: "#D9A928", border: "none", color: "#FFFFFF", padding: "0.35rem 0.75rem", borderRadius: "4px", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>
                    Review Submission
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK VERIFICATION ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Verification Actions & Document Review
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Approve Selected Submissions",
            "Reject Submission & Provide Reason",
            "Request Additional Business Information",
            "Assign Compliance Officer",
            "Download Attached Corporate CAC Files"
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
