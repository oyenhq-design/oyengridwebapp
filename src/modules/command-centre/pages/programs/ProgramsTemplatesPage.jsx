import React from "react";
import { BookOpen, Plus, Download, Copy, Eye, Archive, CheckCircle2, Layers } from "lucide-react";

export default function ProgramsTemplatesPage() {
  const templates = [
    { name: "Executive Corporate Leadership Blueprint", category: "Leadership", solution: "Corporate Academy", modules: 12, assessments: 4, cert: "Yes (Gold Seal)", updated: "Aug 02, 2026", usedBy: "14 Orgs", status: "Published" },
    { name: "12-Week Intensive Software Engineering Bootcamp", category: "Technology", solution: "Bootcamp Host", modules: 24, assessments: 8, cert: "Yes (Verified)", updated: "Jul 28, 2026", usedBy: "32 Orgs", status: "Published" },
    { name: "Higher Education Accreditation Template", category: "Academic", solution: "Institution Portal", modules: 18, assessments: 6, cert: "Yes (Degree Equivalent)", updated: "Jul 15, 2026", usedBy: "8 Orgs", status: "Published" },
    { name: "Global Webinar Series Master Layout", category: "Webinar", solution: "Webinar Host", modules: 4, assessments: 1, cert: "Participation Certificate", updated: "Aug 05, 2026", usedBy: "44 Orgs", status: "Draft" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Programs <span style={{ color: "#D9A928" }}>/</span> Templates
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Program Template Library
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Central repository of reusable program templates, curriculum module structures, assessment packs, and certification schemes.
            </p>
          </div>

          <button
            onClick={() => alert("Create New Program Template Modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Create Template
          </button>
        </div>
      </div>

      {/* TEMPLATE DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>TEMPLATE NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CATEGORY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>SOLUTION TYPE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>MODULES / ASSESSMENTS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CERTIFICATE TYPE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>LAST UPDATED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>USED BY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{t.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.category}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#D9A928", fontWeight: 600 }}>{t.solution}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#111111", fontWeight: 600 }}>{t.modules} Modules / {t.assessments} Tests</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.cert}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.updated}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#18B67A", fontWeight: 700 }}>{t.usedBy}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: t.status === "Published" ? "#E6F8F0" : "#FFF7E4", color: t.status === "Published" ? "#18B67A" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Previewing template: ${t.name}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Preview →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* QUICK TEMPLATE ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Template Console Actions
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Create New Curriculum Template",
            "Duplicate Template Structure",
            "Publish Template to Organization Library",
            "Archive Legacy Template Version",
            "Preview Full Program Structure"
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
