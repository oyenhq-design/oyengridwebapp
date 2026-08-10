import React, { useState } from "react";
import { DollarSign, CreditCard, Download, FileText, RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight, Plus, ShieldCheck } from "lucide-react";

export default function CustomerBillingPage() {
  const [activeTab, setActiveTab] = useState("Invoices");

  const invoices = [
    { id: "INV-2026-089", org: "Lagos State Education Board", amount: "$8,500", date: "Aug 01, 2026", due: "Aug 15, 2026", status: "Paid", provider: "Paystack" },
    { id: "INV-2026-088", org: "MTN Academy West Africa", amount: "$6,400", date: "Aug 01, 2026", due: "Aug 15, 2026", status: "Paid", provider: "Stripe" },
    { id: "INV-2026-087", org: "ABC Energy Workspace", amount: "$4,200", date: "Aug 05, 2026", due: "Aug 19, 2026", status: "Due", provider: "Stripe" },
    { id: "INV-2026-086", org: "VoltPower Ltd", amount: "$1,850", date: "Aug 08, 2026", due: "Aug 22, 2026", status: "Due", provider: "Paystack" },
    { id: "INV-2026-085", org: "Global Tech Academy", amount: "$950", date: "Jul 28, 2026", due: "Aug 11, 2026", status: "Failed", provider: "Stripe" }
  ];

  const refunds = [
    { id: "REF-2026-012", org: "Sunrise Education Ltd", amount: "$450", date: "Aug 04, 2026", reason: "Downgrade Pro-rata", status: "Approved" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Customers <span style={{ color: "#D9A928" }}>/</span> Billing
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Customer Financial & Billing Management
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Manage customer financial accounts, invoice generation, payment gateway dispatches, refund processing, and SaaS tax statements.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => alert("Downloading Tax Report PDF...")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
              }}
            >
              <Download size={14} /> Download Tax Report
            </button>
            <button
              onClick={() => alert("Generate Invoice Modal")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem",
                backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
              }}
            >
              <Plus size={14} /> Generate Invoice
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (6 Financial Metrics) */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Monthly Recurring (MRR)", val: "$48,250", color: "#111111" },
          { label: "Annual Run Rate (ARR)", val: "$579,000", color: "#D9A928" },
          { label: "Invoices Due", val: "14 Invoices", color: "#111111" },
          { label: "Failed Payments", val: "2 Failed", color: "#EF4444" },
          { label: "Refund Requests", val: "1 Request", color: "#2563EB" },
          { label: "Revenue Today", val: "$3,420", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* FINANCIAL TABLES TAB CONTROLLER */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #E6DED0", flex: 1, paddingBottom: "0.5rem" }}>
            {["Invoices", "Payments", "Refunds", "Transactions"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem",
                  fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? "#111111" : "#707070",
                  borderBottom: activeTab === tab ? "2px solid #D9A928" : "none", paddingBottom: "0.4rem"
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Invoices" && (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>INVOICE ID</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>CUSTOMER ORGANIZATION</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>AMOUNT</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ISSUED DATE</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DUE DATE</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PROVIDER</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
                <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, fontFamily: "monospace", color: "#111111" }}>{inv.id}</td>
                  <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{inv.org}</td>
                  <td style={{ padding: "1.1rem 1.25rem", fontWeight: 800, color: "#111111" }}>{inv.amount}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{inv.date}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{inv.due}</td>
                  <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{inv.provider}</td>
                  <td style={{ padding: "1.1rem 1.25rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: inv.status === "Paid" ? "#E6F8F0" : inv.status === "Failed" ? "#FEF2F2" : "#FFF7E4", color: inv.status === "Paid" ? "#18B67A" : inv.status === "Failed" ? "#EF4444" : "#D9A928", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                    <button onClick={() => alert(`Downloading Invoice PDF: ${inv.id}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                      PDF ↓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "Refunds" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.82rem" }}>
            {refunds.map((ref, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", padding: "1rem 1.25rem", borderRadius: "8px" }}>
                <div>
                  <strong style={{ color: "#111111" }}>{ref.org} ({ref.id})</strong>
                  <div style={{ fontSize: "0.72rem", color: "#707070" }}>Reason: {ref.reason} • Date: {ref.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: "1.1rem", color: "#EF4444" }}>-{ref.amount}</strong>
                  <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, color: "#18B67A" }}>{ref.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {(activeTab === "Payments" || activeTab === "Transactions") && (
          <p style={{ fontSize: "0.85rem", color: "#707070" }}>Real-time payment logs and gateway webhooks from Stripe & Paystack.</p>
        )}
      </section>

      {/* QUICK FINANCIAL ACTIONS */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "1.75rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
          Billing & Monetization Console
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            "Generate Custom Customer Invoice",
            "Issue Refund to Organization",
            "Retry Failed Payment Webhook",
            "Export Revenue Ledger",
            "Download Annual Tax Statements"
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
