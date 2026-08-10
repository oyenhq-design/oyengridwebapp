import React from "react";
import { Plus, Download, Copy, Trash2, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export default function SubscriptionsCouponsPage() {
  const coupons = [
    { code: "LAUNCH2026", discount: "20% OFF", type: "Recurring (6 Months)", usage: "48 / 100", expiry: "Dec 31, 2026", status: "Active" },
    { code: "ENTERPRISE500", discount: "$500 OFF", type: "First Invoice", usage: "12 / 20", expiry: "Oct 15, 2026", status: "Active" },
    { code: "AFRICAEDTECH", discount: "15% OFF", type: "Lifetime", usage: "34 / 50", expiry: "Nov 01, 2026", status: "Active" },
    { code: "Q1PROMO2026", discount: "10% OFF", type: "One-time", usage: "50 / 50", expiry: "Mar 31, 2026", status: "Expired" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Coupons
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Promotional Coupons & Discount Management
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Configure promotional coupon codes, percentage/fixed discounts, redemption caps, and expiration schedules for customer accounts.
            </p>
          </div>

          <button
            onClick={() => alert("Create Coupon Code Modal")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
              backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
            }}
          >
            <Plus size={14} /> Create Coupon
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Active Coupon Codes", val: "3 Coupons", color: "#18B67A" },
          { label: "Total Redemptions", val: "144 Times", color: "#111111" },
          { label: "Discount Savings Granted", val: "$18,420", color: "#D9A928" },
          { label: "Expired Coupons", val: "1 Expired", color: "#707070" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* COUPON DIRECTORY TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>COUPON CODE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DISCOUNT VALUE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DISCOUNT TYPE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>USAGE REDEMPTIONS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>EXPIRY DATE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 800, fontFamily: "monospace", color: "#D9A928" }}>{c.code}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 800, color: "#111111" }}>{c.discount}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.type}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{c.usage}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{c.expiry}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: c.status === "Active" ? "#E6F8F0" : "#F7F4ED", color: c.status === "Active" ? "#18B67A" : "#707070", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Duplicating coupon: ${c.code}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Duplicate →
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
