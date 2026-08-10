import React from "react";
import { CreditCard, CheckCircle2, XCircle, RefreshCw, Download, ArrowUpRight } from "lucide-react";

export default function SubscriptionsPaymentsPage() {
  const transactions = [
    { id: "TXN-88201", org: "Lagos State Education Board", amount: "$8,500", method: "Card (Mastercard ****4812)", gateway: "Paystack", date: "Today @ 09:30 AM", status: "Successful" },
    { id: "TXN-88200", org: "MTN Academy West Africa", amount: "$6,400", method: "Bank Wire (Standard Chartered)", gateway: "Stripe", date: "Today @ 08:14 AM", status: "Successful" },
    { id: "TXN-88199", org: "Global Tech Academy", amount: "$950", method: "Card (Visa ****9021)", gateway: "Stripe", date: "Yesterday", status: "Failed (Insufficient Funds)" }
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header & Breadcrumb */}
      <div>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, marginBottom: "0.35rem" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Payments
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Payment Processing & Transaction Monitoring
            </h1>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#707070" }}>
              Real-time transaction monitoring across credit cards, bank wire dispatches, Paystack, Stripe, and failed payment retries.
            </p>
          </div>

          <button
            onClick={() => alert("Exporting Transactions Ledger CSV...")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem",
              backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
            }}
          >
            <Download size={14} /> Export Transactions
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Successful Payments", val: "242 Today", color: "#18B67A" },
          { label: "Failed Payments", val: "2 Failed", color: "#EF4444" },
          { label: "Pending Dispatches", val: "4 Pending", color: "#D9A928" },
          { label: "Refunds Processed", val: "1 Refund", color: "#707070" },
          { label: "Chargebacks", val: "0 Active", color: "#18B67A" }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: stat.color, marginTop: "0.2rem", fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
          </div>
        ))}
      </section>

      {/* TRANSACTIONS TABLE */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>TRANSACTION ID</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>AMOUNT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>PAYMENT METHOD</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>GATEWAY</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>DATE / TIME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem" }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.7rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, fontFamily: "monospace", color: "#111111" }}>{t.id}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#111111" }}>{t.org}</td>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 800, color: "#111111" }}>{t.amount}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.method}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#D9A928", fontWeight: 600 }}>{t.gateway}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#707070" }}>{t.date}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: t.status === "Successful" ? "#E6F8F0" : "#FEF2F2", color: t.status === "Successful" ? "#18B67A" : "#EF4444", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button onClick={() => alert(`Downloading receipt: ${t.id}`)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}>
                    Receipt ↓
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
