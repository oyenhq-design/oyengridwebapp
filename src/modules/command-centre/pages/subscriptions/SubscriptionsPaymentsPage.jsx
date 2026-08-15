import React, { useState, useEffect, useMemo } from "react";
import { 
  CreditCard, RefreshCw, Download, 
  Search, X, AlertCircle, Printer, Info, ShieldAlert, Wifi 
} from "lucide-react";

// Robust high-fidelity mock data aligned with OYEN GRID ecosystem
const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-88201",
    org: "Lagos State Education Board",
    orgId: "ORG-4402",
    amount: 8500,
    currency: "USD",
    method: "Card",
    methodDetail: "Mastercard •••• 4812",
    gateway: "Paystack",
    gatewayRef: "pstk_live_99201a88b",
    date: "Today @ 09:30 AM",
    rawDate: new Date(),
    status: "Successful",
    customerName: "Adebayo Shola",
    customerEmail: "shola@lagos.edu.ng",
    planName: "Bootcamp Enterprise",
    timeline: [
      { step: "Payment initiated", time: "09:28 AM", status: "completed" },
      { step: "Gateway processing", time: "09:29 AM", status: "completed" },
      { step: "Payment successful", time: "09:30 AM", status: "completed" },
      { step: "Subscription activated", time: "09:30 AM", status: "completed" }
    ]
  },
  {
    id: "TXN-88200",
    org: "MTN Academy West Africa",
    orgId: "ORG-0812",
    amount: 6400,
    currency: "USD",
    method: "Bank Transfer",
    methodDetail: "Standard Chartered",
    gateway: "Stripe",
    gatewayRef: "ch_stripe_88200xyz",
    date: "Today @ 08:14 AM",
    rawDate: new Date(),
    status: "Successful",
    customerName: "Amadi Nwachukwu",
    customerEmail: "billing@mtnacademy.wa",
    planName: "LMS Pro Subscription",
    timeline: [
      { step: "Payment initiated", time: "08:10 AM", status: "completed" },
      { step: "Gateway processing", time: "08:12 AM", status: "completed" },
      { step: "Payment successful", time: "08:14 AM", status: "completed" },
      { step: "Subscription activated", time: "08:14 AM", status: "completed" }
    ]
  },
  {
    id: "TXN-88199",
    org: "Global Tech Academy",
    orgId: "ORG-9021",
    amount: 950,
    currency: "USD",
    method: "Card",
    methodDetail: "Visa •••• 9021",
    gateway: "Stripe",
    gatewayRef: "ch_stripe_88199failed",
    date: "Yesterday",
    rawDate: new Date(Date.now() - 86400000),
    status: "Failed",
    failureReason: "Insufficient Funds",
    customerName: "Sarah Jenkins",
    customerEmail: "finance@globaltech.edu",
    planName: "Developer Sandbox Multi-Seat",
    timeline: [
      { step: "Payment initiated", time: "03:43 PM", status: "completed" },
      { step: "Gateway processing", time: "03:44 PM", status: "completed" },
      { step: "Payment failed", time: "03:45 PM", status: "failed", note: "Insufficient Funds" },
      { step: "Subscription activated", time: "—", status: "pending" }
    ]
  },
  {
    id: "TXN-88198",
    org: "Eko Innovate Hub",
    orgId: "ORG-3312",
    amount: 3200,
    currency: "USD",
    method: "Card",
    methodDetail: "Visa •••• 1044",
    gateway: "Paystack",
    gatewayRef: "pstk_live_88198a2",
    date: "2 days ago",
    rawDate: new Date(Date.now() - 172800000),
    status: "Refunded",
    customerName: "Victor Cole",
    customerEmail: "vcole@ekoinnovate.com",
    planName: "Accelerator Growth Plan",
    timeline: [
      { step: "Payment initiated", time: "11:15 AM", status: "completed" },
      { step: "Gateway processing", time: "11:18 AM", status: "completed" },
      { step: "Payment successful", time: "11:20 AM", status: "completed" },
      { step: "Subscription activated", time: "11:20 AM", status: "completed" },
      { step: "Refund requested & processed", time: "Aug 14 @ 02:00 PM", status: "refunded" }
    ]
  },
  {
    id: "TXN-88197",
    org: "Ventures Platform",
    orgId: "ORG-0941",
    amount: 12000,
    currency: "USD",
    method: "Bank Transfer",
    methodDetail: "Zenith Bank Wire",
    gateway: "Paystack",
    gatewayRef: "pstk_live_88197c3",
    date: "3 days ago",
    rawDate: new Date(Date.now() - 259200000),
    status: "Chargeback",
    customerName: "Kola Aina",
    customerEmail: "ka@venturesplatform.co",
    planName: "Enterprise Cloud Suite",
    timeline: [
      { step: "Payment initiated", time: "04:00 PM", status: "completed" },
      { step: "Gateway processing", time: "04:05 PM", status: "completed" },
      { step: "Payment successful", time: "04:10 PM", status: "completed" },
      { step: "Subscription activated", time: "04:10 PM", status: "completed" },
      { step: "Chargeback dispute initiated", time: "Aug 14 @ 09:00 AM", status: "disputed", note: "Unrecognized transaction claim" }
    ]
  },
  {
    id: "TXN-88196",
    org: "CcHub Creative",
    orgId: "ORG-1020",
    amount: 450,
    currency: "USD",
    method: "Card",
    methodDetail: "Mastercard •••• 9922",
    gateway: "Stripe",
    gatewayRef: "ch_stripe_88196pending",
    date: "4 days ago",
    rawDate: new Date(Date.now() - 345600000),
    status: "Pending",
    customerName: "Bosun Tijani",
    customerEmail: "bosun@cchub.org",
    planName: "Individual Creator Tier",
    timeline: [
      { step: "Payment initiated", time: "11:40 AM", status: "completed" },
      { step: "Gateway processing", time: "11:45 AM", status: "active" },
      { step: "Payment status check", time: "Pending", status: "pending" },
      { step: "Subscription activated", time: "—", status: "pending" }
    ]
  }
];

export default function SubscriptionsPaymentsPage() {
  // --- Data & Loading/Error States ---
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // --- Filter states ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedGateway, setSelectedGateway] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState("All");

  // --- Modal & Drawer States ---
  const [activeDrawerTx, setActiveDrawerTx] = useState(null);
  const [activeReceiptTx, setActiveReceiptTx] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'refund' | 'chargeback', tx: object }

  // --- Export states ---
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // --- Simulated initial loading ---
  const loadData = (simulateError = false) => {
    setLoading(true);
    setHasError(false);
    setTimeout(() => {
      if (simulateError) {
        setHasError(true);
        setLoading(false);
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
        setLoading(false);
      }
    }, 750);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Filter Logic ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search text match (id, organization name, organization ID, plan, or email)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        t.id.toLowerCase().includes(q) ||
        t.org.toLowerCase().includes(q) ||
        t.orgId.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        t.planName.toLowerCase().includes(q);

      // Dropdown matches
      const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;
      const matchesGateway = selectedGateway === "All" || t.gateway === selectedGateway;
      const matchesMethod = selectedMethod === "All" || t.method === selectedMethod;
      
      // Date range mock filtering
      let matchesDate = true;
      if (selectedDateRange === "Today") {
        matchesDate = t.date.includes("Today");
      } else if (selectedDateRange === "Yesterday") {
        matchesDate = t.date.includes("Yesterday") || t.date.includes("Today");
      } else if (selectedDateRange === "7days") {
        matchesDate = true; // All mock items fit inside last 7 days
      }

      return matchesSearch && matchesStatus && matchesGateway && matchesMethod && matchesDate;
    });
  }, [transactions, searchQuery, selectedStatus, selectedGateway, selectedMethod, selectedDateRange]);

  const areFiltersActive = useMemo(() => {
    return searchQuery !== "" || 
      selectedStatus !== "All" || 
      selectedGateway !== "All" || 
      selectedMethod !== "All" || 
      selectedDateRange !== "All";
  }, [searchQuery, selectedStatus, selectedGateway, selectedMethod, selectedDateRange]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedGateway("All");
    setSelectedMethod("All");
    setSelectedDateRange("All");
  };

  // --- Summary values computed from current filtered transactions ---
  // (Or from full dataset for top metric card stability, let's derive it to prove Supabase integration design)
  const stats = useMemo(() => {
    const successfulCount = filteredTransactions.filter(t => t.status === "Successful").length;
    const failedCount = filteredTransactions.filter(t => t.status === "Failed").length;
    const pendingCount = filteredTransactions.filter(t => t.status === "Pending").length;
    const refundedCount = filteredTransactions.filter(t => t.status === "Refunded").length;
    const chargebackCount = filteredTransactions.filter(t => t.status === "Chargeback").length;

    return {
      successful: successfulCount,
      failed: failedCount,
      pending: pendingCount,
      refunded: refundedCount,
      chargeback: chargebackCount
    };
  }, [filteredTransactions]);

  // --- Exporter ---
  const handleExport = (type) => {
    setIsExporting(true);
    setShowExportDropdown(false);
    setTimeout(() => {
      const dataToExport = type === "filtered" ? filteredTransactions : transactions;
      
      // Construct CSV
      const headers = ["Transaction ID", "Organization", "Org ID", "Amount", "Currency", "Method", "Gateway", "Gateway Ref", "Date", "Status"];
      const rows = dataToExport.map(t => [
        t.id, t.org, t.orgId, t.amount, t.currency, `${t.method} (${t.methodDetail})`, t.gateway, t.gatewayRef, t.date, t.status
      ]);
      
      const csvContent = [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `OYEN_Transactions_Export_${type === "filtered" ? "Filtered" : "All"}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1000);
  };

  // --- Destructive actions confirmation ---
  const triggerRefund = (tx) => {
    setConfirmModal({ type: 'refund', tx });
  };

  const executeRefund = () => {
    if (!confirmModal) return;
    const targetId = confirmModal.tx.id;
    setTransactions(prev => prev.map(t => {
      if (t.id === targetId) {
        return {
          ...t,
          status: "Refunded",
          timeline: [
            ...t.timeline,
            { step: "Refund requested & processed", time: "Just Now", status: "refunded" }
          ]
        };
      }
      return t;
    }));
    // Keep drawer active if open
    if (activeDrawerTx && activeDrawerTx.id === targetId) {
      setActiveDrawerTx(prev => ({
        ...prev,
        status: "Refunded",
        timeline: [
          ...prev.timeline,
          { step: "Refund requested & processed", time: "Just Now", status: "refunded" }
        ]
      }));
    }
    setConfirmModal(null);
  };

  return (
    <div style={{ padding: "2rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Page Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ fontSize: "0.72rem", color: "#707070", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Subscriptions <span style={{ color: "#D9A928" }}>/</span> Payments
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, color: "#111111", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
              Payment Processing &amp; Transaction Monitoring
            </h1>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#606060", lineHeight: "1.4" }}>
              Monitor payment activity, transaction status, refunds, chargebacks, and payment gateway performance across the OYEN GRID ecosystem.
            </p>
          </div>

          {/* Export Transaction Polished Button */}
          <div style={{ position: "relative" }}>
            <button
              disabled={isExporting}
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              style={{
                display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 0.95rem",
                backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                fontSize: "0.78rem", fontWeight: 700, cursor: isExporting ? "not-allowed" : "pointer", 
                color: "#111111", transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
              }}
              onMouseEnter={e => { if(!isExporting) e.currentTarget.style.backgroundColor = "#F3EFE6"; }}
              onMouseLeave={e => { if(!isExporting) e.currentTarget.style.backgroundColor = "#FCFBF8"; }}
            >
              {isExporting ? <RefreshCw size={14} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
              {isExporting ? "Exporting..." : "Export Transactions"}
            </button>

            {showExportDropdown && (
              <>
                <div onClick={() => setShowExportDropdown(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} />
                <div style={{
                  position: "absolute", right: 0, marginTop: "0.35rem", width: "220px", 
                  backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
                  zIndex: 101, display: "flex", flexDirection: "column", padding: "0.35rem 0", overflow: "hidden"
                }}>
                  <button 
                    onClick={() => handleExport("filtered")}
                    style={{ background: "none", border: "none", width: "100%", textAlign: "left", padding: "0.55rem 0.95rem", fontSize: "0.76rem", color: "#111111", cursor: "pointer", fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Export Filtered Ledger (CSV)
                  </button>
                  <button 
                    onClick={() => handleExport("all")}
                    style={{ background: "none", border: "none", width: "100%", textAlign: "left", padding: "0.55rem 0.95rem", fontSize: "0.76rem", color: "#111111", cursor: "pointer", fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Export All Transactions (CSV)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Debug state triggers for reviewers */}
      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem", color: "#707070", alignItems: "center" }}>
        <span>Simulate:</span>
        <button onClick={() => loadData(false)} style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", padding: 0, fontWeight: 700 }}>[ Successful Load ]</button>
        <span>|</span>
        <button onClick={() => loadData(true)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: 0, fontWeight: 700 }}>[ Error State ]</button>
        <span>|</span>
        <button onClick={() => { setLoading(true); }} style={{ background: "none", border: "none", color: "#707070", cursor: "pointer", padding: 0, fontWeight: 700 }}>[ Loading Skeleton ]</button>
      </div>

      {hasError ? (
        /* Error State UI */
        <div style={{
          backgroundColor: "#FCFBF8", border: "1px solid #FCA5A5", borderRadius: "12px",
          padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem", maxWidth: "600px", margin: "2rem auto"
        }}>
          <AlertCircle size={44} color="#EF4444" />
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111111" }}>
            Unable to load payment transactions
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#707070", margin: 0, maxWidth: "400px" }}>
            We couldn't retrieve payment information from the OYEN GRID API right now. Please check your network connection and try again.
          </p>
          <button
            onClick={() => loadData()}
            style={{
              padding: "0.55rem 1.25rem", backgroundColor: "#D9A928", border: "none",
              borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.8rem",
              cursor: "pointer", transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#C4951E"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D9A928"}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* 2. Top Summary Metrics */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem" }}>
            {loading ? (
              // Loading cards
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ height: "0.7rem", width: "60%", backgroundColor: "#EAE6DB", borderRadius: "3px" }} />
                  <div style={{ height: "1.6rem", width: "40%", backgroundColor: "#EAE6DB", borderRadius: "4px" }} />
                  <div style={{ height: "0.7rem", width: "50%", backgroundColor: "#EAE6DB", borderRadius: "3px" }} />
                </div>
              ))
            ) : (
              [
                { label: "Successful Payments", val: stats.successful, ind: "Today", diff: "↑ 12.4%", color: "#18B67A" },
                { label: "Failed Payments", val: stats.failed, ind: "Today", diff: "↓ 3.1%", color: "#EF4444" },
                { label: "Pending Payments", val: stats.pending, ind: "Awaiting processing", diff: "", color: "#D9A928" },
                { label: "Refunds Processed", val: stats.refunded, ind: "This month", diff: "", color: "#3B82F6" },
                { label: "Chargebacks", val: stats.chargeback, ind: "Active cases", diff: "", color: "#F97316" }
              ].map((stat, idx) => (
                <div key={idx} style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>{stat.label}</span>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111111", marginTop: "0.15rem", fontFamily: "'Outfit', sans-serif" }}>
                      {stat.val}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.4rem", fontSize: "0.7rem", color: "#707070" }}>
                    <span>{stat.ind}</span>
                    {stat.diff && (
                      <span style={{ color: stat.color, fontWeight: 700 }}>
                        {stat.diff}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>

          {/* 3. Payment Gateway Health Section */}
          <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "10px", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
              <Wifi size={14} color="#D9A928" />
              <h2 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111111", margin: 0 }}>
                Payment Gateway Status
              </h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} style={{ border: "1px solid #EAE6DB", borderRadius: "6px", padding: "0.75rem 1rem", backgroundColor: "#FCFBF8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
                      <div style={{ height: "0.8rem", width: "30%", backgroundColor: "#EAE6DB", borderRadius: "3px" }} />
                      <div style={{ height: "0.6rem", width: "50%", backgroundColor: "#EAE6DB", borderRadius: "2px" }} />
                    </div>
                  </div>
                ))
              ) : (
                [
                  { name: "Paystack", status: "Operational", txs: 128, rate: "98.4%" },
                  { name: "Stripe", status: "Operational", txs: 114, rate: "97.8%" }
                ].map((g, i) => (
                  <div key={i} style={{ 
                    border: "1px solid #EAE6DB", borderRadius: "6px", padding: "0.75rem 1rem", 
                    backgroundColor: "#FCFBF8", display: "flex", justifyContent: "space-between", 
                    alignItems: "center", transition: "border-color 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#D9A928"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#EAE6DB"}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#111111" }}>{g.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#18B67A" }}></span>
                          <span style={{ fontSize: "0.66rem", color: "#18B67A", fontWeight: 700 }}>{g.status}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#707070", marginTop: "0.15rem" }}>
                        {g.txs} transactions processed
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#18B67A" }}>{g.rate}</div>
                      <div style={{ fontSize: "0.62rem", color: "#707070", textTransform: "uppercase", fontWeight: 600 }}>Success Rate</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 4. Filter Toolbar & 5. Transaction Table Container */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            
            {/* Filter Toolbar */}
            <div style={{ 
              display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", 
              gap: "0.75rem", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", 
              borderRadius: "8px", padding: "0.65rem 1rem" 
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: "300px" }}>
                
                {/* Search input */}
                <div style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "340px" }}>
                  <Search size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                  <input
                    type="text"
                    placeholder="Search transaction, organization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%", padding: "0.45rem 0.65rem 0.45rem 1.8rem", borderRadius: "6px",
                      border: "1px solid #E6DED0", backgroundColor: "#F7F4ED", fontSize: "0.78rem",
                      boxSizing: "border-box", color: "#111111", outline: "none"
                    }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      style={{ background: "none", border: "none", position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#707070" }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Status Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    padding: "0.45rem 1.5rem 0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #E6DED0",
                    backgroundColor: "#F7F4ED", fontSize: "0.78rem", color: "#111111", cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Successful">Successful</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Chargeback">Chargeback</option>
                </select>

                {/* Gateway Dropdown */}
                <select
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  style={{
                    padding: "0.45rem 1.5rem 0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #E6DED0",
                    backgroundColor: "#F7F4ED", fontSize: "0.78rem", color: "#111111", cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="All">All Gateways</option>
                  <option value="Paystack">Paystack</option>
                  <option value="Stripe">Stripe</option>
                </select>

                {/* Method Dropdown */}
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  style={{
                    padding: "0.45rem 1.5rem 0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #E6DED0",
                    backgroundColor: "#F7F4ED", fontSize: "0.78rem", color: "#111111", cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="All">All Methods</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>

                {/* Date range dropdown */}
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  style={{
                    padding: "0.45rem 1.5rem 0.45rem 0.65rem", borderRadius: "6px", border: "1px solid #E6DED0",
                    backgroundColor: "#F7F4ED", fontSize: "0.78rem", color: "#111111", cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday &amp; Today</option>
                  <option value="7days">Last 7 Days</option>
                </select>
              </div>

              {/* Clear Filters Link */}
              {areFiltersActive && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem",
                    fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem",
                    padding: "0.2rem 0.4rem"
                  }}
                >
                  <X size={13} /> Clear Filters
                </button>
              )}
            </div>

            {/* Table Container */}
            <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem", width: "10%" }}>TRANSACTION ID</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem" }}>ORGANIZATION</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem", textAlign: "right" }}>AMOUNT</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem" }}>PAYMENT METHOD</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem", textAlign: "center" }}>GATEWAY</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem" }}>DATE / TIME</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem", textAlign: "center" }}>STATUS</th>
                      <th style={{ padding: "0.85rem 1.25rem", color: "#707070", fontWeight: 700, fontSize: "0.68rem", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                          <td style={{ padding: "1.1rem 1.25rem" }}><div style={{ height: "0.8rem", width: "70px", backgroundColor: "#EAE6DB", borderRadius: "3px" }} /></td>
                          <td style={{ padding: "1.1rem 1.25rem" }}>
                            <div style={{ height: "0.8rem", width: "140px", backgroundColor: "#EAE6DB", borderRadius: "3px", marginBottom: "0.3rem" }} />
                            <div style={{ height: "0.6rem", width: "60px", backgroundColor: "#EAE6DB", borderRadius: "2px" }} />
                          </td>
                          <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}><div style={{ height: "0.8rem", width: "50px", backgroundColor: "#EAE6DB", borderRadius: "3px", marginLeft: "auto" }} /></td>
                          <td style={{ padding: "1.1rem 1.25rem" }}><div style={{ height: "0.8rem", width: "100px", backgroundColor: "#EAE6DB", borderRadius: "3px" }} /></td>
                          <td style={{ padding: "1.1rem 1.25rem", textAlign: "center" }}><div style={{ height: "0.8rem", width: "60px", backgroundColor: "#EAE6DB", borderRadius: "3px", margin: "0 auto" }} /></td>
                          <td style={{ padding: "1.1rem 1.25rem" }}><div style={{ height: "0.8rem", width: "100px", backgroundColor: "#EAE6DB", borderRadius: "3px" }} /></td>
                          <td style={{ padding: "1.1rem 1.25rem", textAlign: "center" }}><div style={{ height: "1.2rem", width: "70px", backgroundColor: "#EAE6DB", borderRadius: "4px", margin: "0 auto" }} /></td>
                          <td style={{ padding: "1.1rem 1.25rem" }}><div style={{ height: "0.8rem", width: "80px", backgroundColor: "#EAE6DB", borderRadius: "3px", marginLeft: "auto" }} /></td>
                        </tr>
                      ))
                    ) : filteredTransactions.length === 0 ? (
                      /* 11. Empty State UI */
                      <tr>
                        <td colSpan={8} style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.65rem", justifyContent: "center" }}>
                            <Info size={32} color="#D9A928" />
                            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>No transactions found</span>
                            <span style={{ fontSize: "0.8rem", color: "#707070", maxWidth: "340px" }}>
                              There are no payment transactions matching your current filter configuration.
                            </span>
                            {areFiltersActive && (
                              <button
                                onClick={handleClearFilters}
                                style={{
                                  marginTop: "0.5rem", padding: "0.45rem 1rem", backgroundColor: "#F7F4ED",
                                  border: "1px solid #E6DED0", borderRadius: "6px", fontSize: "0.78rem",
                                  fontWeight: 700, color: "#111111", cursor: "pointer", transition: "all 0.2s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E6DED0"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F7F4ED"}
                              >
                                Clear Filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((t) => {
                        // Badge status colors helper
                        const getStatusStyles = (status) => {
                          switch (status) {
                            case "Successful":
                              return { bg: "#E6F8F0", text: "#18B67A" };
                            case "Failed":
                              return { bg: "#FEE2E2", text: "#EF4444" };
                            case "Pending":
                              return { bg: "#FFFBEB", text: "#D9A928" };
                            case "Refunded":
                              return { bg: "#EFF6FF", text: "#3B82F6" };
                            case "Chargeback":
                              return { bg: "#FFF7ED", text: "#F97316" };
                            default:
                              return { bg: "#F3F4F6", text: "#374151" };
                          }
                        };
                        const statusColor = getStatusStyles(t.status);

                        return (
                          <tr 
                            key={t.id} 
                            style={{ borderBottom: "1px solid #E6DED0", cursor: "pointer" }} 
                            onClick={() => setActiveDrawerTx(t)}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFFDF9"} 
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            {/* TXN ID */}
                            <td style={{ padding: "0.95rem 1.25rem", fontWeight: 700, fontFamily: "monospace", color: "#111111", fontSize: "0.78rem" }}>
                              {t.id}
                            </td>
                            
                            {/* Organization name and subtext */}
                            <td style={{ padding: "0.95rem 1.25rem" }}>
                              <div style={{ fontWeight: 700, color: "#111111" }}>{t.org}</div>
                              <div style={{ fontSize: "0.68rem", color: "#707070", marginTop: "0.1rem" }}>{t.orgId}</div>
                            </td>

                            {/* Strong Amount */}
                            <td style={{ padding: "0.95rem 1.25rem", fontWeight: 800, color: "#111111", textAlign: "right", fontSize: "0.85rem" }}>
                              ${t.amount.toLocaleString()}
                            </td>

                            {/* Method detail */}
                            <td style={{ padding: "0.95rem 1.25rem", color: "#111111" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                <CreditCard size={13} color="#707070" />
                                <span>{t.methodDetail}</span>
                              </div>
                            </td>

                            {/* Gateway Badge */}
                            <td style={{ padding: "0.95rem 1.25rem", textAlign: "center" }}>
                              <span style={{ 
                                fontSize: "0.68rem", fontWeight: 700, color: t.gateway === "Paystack" ? "#D9A928" : "#6366F1",
                                border: `1px solid ${t.gateway === "Paystack" ? "#F5E0A9" : "#C7D2FE"}`,
                                padding: "0.15rem 0.45rem", borderRadius: "4px", backgroundColor: "#FCFBF8"
                              }}>
                                {t.gateway}
                              </span>
                            </td>

                            {/* Date Time */}
                            <td style={{ padding: "0.95rem 1.25rem", color: "#555" }}>
                              {t.date}
                            </td>

                            {/* Status badge pill */}
                            <td style={{ padding: "0.95rem 1.25rem", textAlign: "center" }}>
                              <span style={{ 
                                fontSize: "0.66rem", fontWeight: 800, 
                                backgroundColor: statusColor.bg, color: statusColor.text, 
                                padding: "0.22rem 0.55rem", borderRadius: "100px",
                                display: "inline-block"
                              }}>
                                {t.status}
                              </span>
                            </td>

                            {/* Clean Actions */}
                            <td style={{ padding: "0.95rem 1.25rem", textAlign: "right" }} onClick={e => e.stopPropagation()}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.85rem" }}>
                                <button 
                                  onClick={() => setActiveDrawerTx(t)} 
                                  style={{ background: "none", border: "none", color: "#111111", cursor: "pointer", fontWeight: 700, fontSize: "0.76rem", padding: 0 }}
                                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => setActiveReceiptTx(t)} 
                                  style={{ background: "none", border: "none", color: "#D9A928", cursor: "pointer", fontWeight: 700, fontSize: "0.76rem", padding: 0 }}
                                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                                >
                                  Receipt
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 7. Right-side Transaction Details Drawer */}
      {activeDrawerTx && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setActiveDrawerTx(null)} 
            style={{ 
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)", zIndex: 1000 
            }} 
          />
          
          {/* Drawer container */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, 
            width: "100%", maxWidth: "460px", backgroundColor: "#FCFBF8",
            boxShadow: "-10px 0 30px rgba(0,0,0,0.08)", zIndex: 1001,
            display: "flex", flexDirection: "column", boxSizing: "border-box",
            borderLeft: "1px solid #E6DED0", animation: "slideIn 0.25s ease-out"
          }}>
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #E6DED0" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
                  Transaction Details
                </h3>
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#707070" }}>{activeDrawerTx.id}</span>
              </div>
              <button 
                onClick={() => setActiveDrawerTx(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", padding: "0.3rem" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Primary Amount / Status Card */}
              <div style={{ backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase" }}>Amount Paid</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111111", marginTop: "0.15rem", fontFamily: "'Outfit', sans-serif" }}>
                    ${activeDrawerTx.amount.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.68rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>Status</div>
                  <span style={{ 
                    fontSize: "0.7rem", fontWeight: 800, 
                    backgroundColor: activeDrawerTx.status === "Successful" ? "#E6F8F0" : activeDrawerTx.status === "Failed" ? "#FEE2E2" : "#FFFBEB",
                    color: activeDrawerTx.status === "Successful" ? "#18B67A" : activeDrawerTx.status === "Failed" ? "#EF4444" : "#D9A928",
                    padding: "0.22rem 0.6rem", borderRadius: "100px", display: "inline-block"
                  }}>
                    {activeDrawerTx.status}
                  </span>
                </div>
              </div>

              {/* Transaction Metadata Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.72rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Metadata Details</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", fontSize: "0.8rem", border: "1px solid #EAE6DB", borderRadius: "8px", padding: "0.95rem", backgroundColor: "#FCFBF8" }}>
                  
                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", display: "block" }}>Organization</span>
                    <span style={{ fontWeight: 700, color: "#111111" }}>{activeDrawerTx.org}</span>
                    <span style={{ fontSize: "0.68rem", color: "#707070", display: "block" }}>{activeDrawerTx.orgId}</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", display: "block" }}>Customer Admin</span>
                    <span style={{ fontWeight: 700, color: "#111111", display: "block" }}>{activeDrawerTx.customerName}</span>
                    <span style={{ fontSize: "0.68rem", color: "#707070" }}>{activeDrawerTx.customerEmail}</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", display: "block" }}>Payment Method</span>
                    <span style={{ fontWeight: 700, color: "#111111" }}>{activeDrawerTx.methodDetail}</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", display: "block" }}>Payment Gateway</span>
                    <span style={{ fontWeight: 700, color: "#111111" }}>{activeDrawerTx.gateway}</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", display: "block" }}>Gateway Reference</span>
                    <span style={{ fontWeight: 700, color: "#111111", fontFamily: "monospace", fontSize: "0.72rem" }}>{activeDrawerTx.gatewayRef}</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.66rem", color: "#707070", display: "block" }}>Subscription Plan</span>
                    <span style={{ fontWeight: 700, color: "#111111" }}>{activeDrawerTx.planName}</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT TIMELINE */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.72rem", color: "#707070", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Payment Timeline</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem", paddingLeft: "0.5rem" }}>
                  {activeDrawerTx.timeline.map((step, idx) => {
                    const isLast = idx === activeDrawerTx.timeline.length - 1;
                    
                    // Determine step indicator color
                    let dotBg = "#D9A928";
                    let textStyle = { color: "#111111", fontWeight: 500 };
                    if (step.status === "completed") {
                      dotBg = "#18B67A";
                    } else if (step.status === "failed") {
                      dotBg = "#EF4444";
                      textStyle = { color: "#EF4444", fontWeight: 700 };
                    } else if (step.status === "refunded") {
                      dotBg = "#3B82F6";
                      textStyle = { color: "#3B82F6", fontWeight: 700 };
                    } else if (step.status === "disputed") {
                      dotBg = "#F97316";
                      textStyle = { color: "#F97316", fontWeight: 700 };
                    }

                    return (
                      <div key={idx} style={{ display: "flex", gap: "1rem", position: "relative" }}>
                        {/* Connecting Line */}
                        {!isLast && (
                          <div style={{
                            position: "absolute", left: "6px", top: "14px", bottom: "-14px", 
                            width: "2px", backgroundColor: "#E6DED0"
                          }} />
                        )}
                        
                        {/* Indicator Circle */}
                        <div style={{ 
                          width: "14px", height: "14px", borderRadius: "50%", 
                          backgroundColor: dotBg, marginTop: "0.2rem", flexShrink: 0,
                          border: "3px solid #FCFBF8", boxShadow: "0 0 0 1px rgba(0,0,0,0.05)"
                        }} />

                        {/* Step Description */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                          <span style={{ fontSize: "0.78rem", ...textStyle }}>
                            {step.step}
                          </span>
                          <span style={{ fontSize: "0.68rem", color: "#707070" }}>
                            {step.time}
                          </span>
                          {step.note && (
                            <span style={{ fontSize: "0.68rem", backgroundColor: "#FFF7E4", padding: "0.1rem 0.4rem", borderRadius: "4px", color: "#C4951E", border: "1px solid #F5E0A9", alignSelf: "flex-start", marginTop: "0.2rem" }}>
                              {step.note}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #E6DED0", backgroundColor: "#F7F4ED", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setActiveReceiptTx(activeDrawerTx)}
                style={{
                  padding: "0.5rem 1rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  fontSize: "0.78rem", fontWeight: 700, color: "#111111", cursor: "pointer",
                  backgroundColor: "#FCFBF8"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F3EFE6"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FCFBF8"}
              >
                View Receipt
              </button>

              {/* Destructive Actions Request Refund / View disputes */}
              {activeDrawerTx.status === "Successful" && (
                <button 
                  onClick={() => triggerRefund(activeDrawerTx)}
                  style={{
                    padding: "0.5rem 1rem", border: "none", borderRadius: "6px",
                    fontSize: "0.78rem", fontWeight: 700, color: "#FFFFFF", cursor: "pointer",
                    backgroundColor: "#EF4444"
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2626"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EF4444"}
                >
                  Request Refund
                </button>
              )}

              {activeDrawerTx.status === "Refunded" && (
                <button 
                  disabled
                  style={{
                    padding: "0.5rem 1rem", border: "1px solid #F5E0A9", borderRadius: "6px",
                    fontSize: "0.78rem", fontWeight: 700, color: "#3B82F6",
                    backgroundColor: "#EFF6FF", cursor: "not-allowed"
                  }}
                >
                  Refund Processed
                </button>
              )}

              {activeDrawerTx.status === "Chargeback" && (
                <button 
                  onClick={() => alert(`Opening Dispute case file for chargeback ${activeDrawerTx.id}`)}
                  style={{
                    padding: "0.5rem 1rem", border: "none", borderRadius: "6px",
                    fontSize: "0.78rem", fontWeight: 700, color: "#FFFFFF", cursor: "pointer",
                    backgroundColor: "#F97316"
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#EA580C"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F97316"}
                >
                  View Chargeback
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* 8. Receipt Modal */}
      {activeReceiptTx && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setActiveReceiptTx(null)} 
            style={{ 
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)", zIndex: 2000 
            }} 
          />
          
          {/* Modal Container */}
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "90%", maxWidth: "560px", backgroundColor: "#FCFBF8",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", 
            zIndex: 2001, borderRadius: "12px", border: "1px solid #E6DED0",
            display: "flex", flexDirection: "column", boxSizing: "border-box",
            overflow: "hidden"
          }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 1.5rem", borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "#111111", letterSpacing: "0.03em" }}>
                Payment Receipt
              </h3>
              <button 
                onClick={() => setActiveReceiptTx(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#111111" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Receipt Printable Slip Area */}
            <div id="oyen-receipt-slip" style={{ padding: "2rem", backgroundColor: "#FCFBF8", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Slip Top Brand */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px dashed #E6DED0", paddingBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em" }}>
                    OYEN GRID
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#707070" }}>Enterprise Executive Headquarters</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ 
                    fontSize: "0.68rem", fontWeight: 800, 
                    backgroundColor: activeReceiptTx.status === "Successful" ? "#E6F8F0" : "#FFF7E4", 
                    color: activeReceiptTx.status === "Successful" ? "#18B67A" : "#D9A928", 
                    padding: "0.2rem 0.5rem", borderRadius: "4px" 
                  }}>
                    {activeReceiptTx.status}
                  </span>
                  <div style={{ fontSize: "0.68rem", color: "#707070", marginTop: "0.35rem" }}>
                    {activeReceiptTx.date}
                  </div>
                </div>
              </div>

              {/* Core Ledger breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.82rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#707070" }}>Receipt / Transaction ID:</span>
                  <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{activeReceiptTx.id}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#707070" }}>Organization:</span>
                  <span style={{ fontWeight: 700 }}>{activeReceiptTx.org}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#707070" }}>Customer Billing Email:</span>
                  <span style={{ fontWeight: 700 }}>{activeReceiptTx.customerEmail}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#707070" }}>Subscription Plan:</span>
                  <span style={{ fontWeight: 700 }}>{activeReceiptTx.planName}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#707070" }}>Payment Gateway:</span>
                  <span style={{ fontWeight: 700 }}>{activeReceiptTx.gateway} ({activeReceiptTx.gatewayRef})</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#707070" }}>Payment Method:</span>
                  <span style={{ fontWeight: 700 }}>{activeReceiptTx.methodDetail}</span>
                </div>
              </div>

              {/* Total amount summary card */}
              <div style={{ 
                backgroundColor: "#F7F4ED", border: "1px solid #E6DED0", 
                borderRadius: "8px", padding: "1rem", display: "flex", 
                justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" 
              }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#707070", textTransform: "uppercase" }}>Amount Paid</span>
                <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
                  ${activeReceiptTx.amount.toLocaleString()} {activeReceiptTx.currency}
                </span>
              </div>
            </div>

            {/* Receipt Modal Footer Actions */}
            <div style={{ padding: "1.1rem 1.5rem", borderTop: "1px solid #E6DED0", backgroundColor: "#F7F4ED", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button 
                onClick={() => {
                  alert(`Receipt document compilation starting for transaction: ${activeReceiptTx.id}. Simulated local PDF build generated successfully.`);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 0.95rem",
                  backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                  fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#111111"
                }}
              >
                <Download size={13} /> Download Receipt
              </button>
              
              <button 
                onClick={() => window.print()}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 0.95rem",
                  backgroundColor: "#D9A928", border: "none", borderRadius: "6px",
                  fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: "#FFFFFF"
                }}
              >
                <Printer size={13} /> Print Receipt
              </button>
            </div>
          </div>
        </>
      )}

      {/* 9. Destruction Confirmation Dialog */}
      {confirmModal && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setConfirmModal(null)} 
            style={{ 
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)", zIndex: 3000 
            }} 
          />
          
          {/* Confirmation Box */}
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "90%", maxWidth: "420px", backgroundColor: "#FCFBF8",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)", zIndex: 3001,
            borderRadius: "10px", border: "1px solid #FCA5A5", padding: "1.5rem",
            display: "flex", flexDirection: "column", gap: "1rem", boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <ShieldAlert size={28} color="#EF4444" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
                  Confirm Refund Request
                </h4>
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: "#707070", lineHeight: "1.4" }}>
                  Are you sure you want to process a full refund of <strong style={{ color: "#111111" }}>${confirmModal.tx.amount.toLocaleString()}</strong> to <strong style={{ color: "#111111" }}>{confirmModal.tx.org}</strong>? This action will reverse the transaction and update the billing ledger.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: "0.45rem 0.9rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  fontSize: "0.78rem", fontWeight: 700, color: "#111111", cursor: "pointer",
                  backgroundColor: "#FCFBF8"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={executeRefund}
                style={{
                  padding: "0.45rem 0.9rem", border: "none", borderRadius: "6px",
                  fontSize: "0.78rem", fontWeight: 700, color: "#FFFFFF", cursor: "pointer",
                  backgroundColor: "#EF4444"
                }}
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
