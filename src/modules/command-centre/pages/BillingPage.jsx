import React, { useState, useEffect } from "react";
import { Search, CreditCard, RefreshCw, AlertTriangle, Cpu, TrendingUp, Download } from "lucide-react";

export default function BillingPage() {
  const [dateRange, setDateRange] = useState("30 Days");
  
  const [billingStats, setBillingStats] = useState({
    mrr: "₦0K",
    arr: "₦0K",
    activeSubs: 0,
    trialOrgs: 0,
    subscriptions: [],
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];

      const primaryPlan = localStorage.getItem(`oyen_plan_${orgSlug}`) || "Enterprise Trial";
      const primarySuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";

      const voltPowerSuspended = localStorage.getItem("oyen_suspended_voltpower-ltd") === "true";
      const voltPowerPlan = localStorage.getItem("oyen_plan_voltpower-ltd") || "Pro";

      // Calculate MRR: Enterprise is ₦500k, Pro is ₦250k
      const primaryActive = !primarySuspended;
      const voltActive = !voltPowerSuspended;

      const primaryRev = primaryActive ? (primaryPlan.includes("Enterprise") ? 500000 : 250000) : 0;
      const voltRev = voltActive ? (voltPowerPlan.includes("Enterprise") ? 500000 : 250000) : 0;

      const totalMrr = primaryRev + voltRev;
      const totalArr = totalMrr * 12;

      const activeSubs = (primaryActive ? 1 : 0) + (voltActive ? 1 : 0);
      const trialOrgs = primaryPlan.toLowerCase().includes("trial") ? 1 : 0;

      const primarySub = {
        name: orgName,
        slug: orgSlug,
        plan: primaryPlan,
        status: primarySuspended ? "Suspended" : (primaryPlan.toLowerCase().includes("trial") ? "Trial" : "Active"),
        renewal: "Aug 14, 2026",
        cycle: "Monthly",
        seats: team.length + learners.length,
        amount: `₦${(primaryRev / 1000).toFixed(0)}K`,
        provider: "Paystack"
      };

      const secondarySub = {
        name: "VoltPower Ltd",
        slug: "voltpower-ltd",
        plan: voltPowerPlan,
        status: voltPowerSuspended ? "Suspended" : "Active",
        renewal: "Sept 12, 2026",
        cycle: "Monthly",
        seats: 52,
        amount: `₦${(voltRev / 1000).toFixed(0)}K`,
        provider: "Paystack"
      };

      setBillingStats({
        mrr: `₦${(totalMrr / 1000).toFixed(0)}K`,
        arr: `₦${(totalArr / 1000).toFixed(0)}K`,
        activeSubs,
        trialOrgs,
        subscriptions: [primarySub, secondarySub]
      });

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Billing & Finance</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Monitor subscriptions, invoices, payments, and financial operations across OYEN.</span>
        </div>
        
        {/* Date Filters */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <select 
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none", cursor: "pointer" }}
          >
            <option>Today</option>
            <option>7 Days</option>
            <option>30 Days</option>
            <option>1 Year</option>
          </select>
          <button onClick={() => alert("Generating finance report...")} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            Generate Report
          </button>
        </div>
      </div>

      {/* SECTION 1 — Financial Summary */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Financial Summary
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>MRR</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0", color: "#D9A928" }}>{billingStats.mrr}</h4>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>ARR</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{billingStats.arr}</h4>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Active Subscriptions</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{billingStats.activeSubs}</h4>
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Trial Organizations</span>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>{billingStats.trialOrgs}</h4>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Subscriptions */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Active Workspace Subscriptions
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>ORGANIZATION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>PLAN</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>STATUS</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>RENEWAL</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>SEATS</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {billingStats.subscriptions.map((sub, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>{sub.name}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sub.plan}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: sub.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(229, 185, 60, 0.12)",
                    color: sub.status === "Active" ? "#18B67A" : "#E5B93C"
                  }}>
                    {sub.status}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sub.renewal}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{sub.seats}</td>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700 }}>{sub.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SECTION 3 — Invoices */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#6B7280" }}>
        <p style={{ margin: 0, fontSize: "0.8rem" }}>No invoices have been generated.</p>
      </section>

      {/* Grid: Transactions & Payment Methods */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 4 — Transactions */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Transactions History
          </span>
          <div style={{ color: "#6B7280", fontSize: "0.78rem", textAlign: "center", padding: "1.5rem" }}>
            No payment transaction history discovered.
          </div>
        </div>

        {/* SECTION 5 — Payment Methods */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Connected Gateways
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Paystack Integration</span>
              <strong style={{ color: "#18B67A" }}>● Enabled</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Stripe Integration</span>
              <strong style={{ color: "#6B7280" }}>Inactive</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Failed Payments & Refunds */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 6 — Failed Payments */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
            Failed Payments Queue
          </span>
          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
            No payment failures logged today.
          </div>
        </div>

        {/* SECTION 7 — Refunds */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
            Refund Requests
          </span>
          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
            No refund requests pending.
          </div>
        </div>

      </div>

      {/* SECTION 8 — Trials */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Active Trial Workspace Accounts
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
          {billingStats.subscriptions.filter(s => s.status === "Trial").map((trial, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", border: "1px solid #E6DED0", padding: "0.6rem 0.85rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <span>{trial.name} (Plan: {trial.plan})</span>
              <strong style={{ color: "#D9A928" }}>Expires in 15 days</strong>
            </div>
          ))}
          {billingStats.subscriptions.filter(s => s.status === "Trial").length === 0 && (
            <div style={{ color: "#6B7280", textAlign: "center" }}>No active trial environments.</div>
          )}
        </div>
      </section>

      {/* SECTION 9 — Usage Billing */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1.5rem" }}>
          Storage Usage Audits
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Total Storage quota</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>{billingStats.subscriptions.reduce((sum, s) => sum + (s.plan.includes("Enterprise") ? 50 : 10), 0)}GB</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Active storage used</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>34MB</strong>
          </div>
          <div>
            <span>Surcharges logged</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>₦0</strong>
          </div>
        </div>
      </section>

      {/* SECTION 10 — Revenue Analytics */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
          Revenue Metrics Over Time
        </span>
        <div style={{ padding: "2.5rem", color: "#6B7280", fontSize: "0.78rem" }}>
          <TrendingUp size={24} style={{ margin: "0 auto 0.5rem auto", display: "block" }} />
          Not enough billing history to generate charts.
        </div>
      </section>

      {/* SECTION 11 — Financial Reports */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Export Financial Invoices
        </span>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {["Revenue Report", "Subscription Report", "Invoice Report", "Refund Report"].map(rep => (
            <button key={rep} onClick={() => alert(`Exporting ${rep} logs...`)} style={{ padding: "0.55rem 1rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
              {rep}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 12 — Alerts */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.75rem" }}>
          Active Alerts
        </span>
        <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
          No active financial alerts or overdue invoices.
        </div>
      </section>

      {/* SECTION 13 — Finance Insights */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Financial Insights
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8rem" }}>
          <div>● Enterprise subscriptions account for <strong>72%</strong> of recurring revenue.</div>
          <div>● All active subscriptions are configured on Paystack.</div>
        </div>
      </section>

    </div>
  );
}
