import React, { useState } from "react";
import OrganizationsPage from "../OrganizationsPage";
import WorkspacesPage from "../WorkspacesPage";
import BillingPage from "../BillingPage";
import SupportPage from "../SupportPage";
import AnalyticsPage from "../AnalyticsPage";

export default function CustomersModule({ initialSubtab = "Organizations" }) {
  const [subTab, setSubTab] = useState(initialSubtab);

  const subtabs = [
    { id: "Organizations", label: "Organizations" },
    { id: "Subscriptions", label: "Subscriptions & Billing" },
    { id: "Trials", label: "Trials" },
    { id: "Workspaces", label: "Workspaces" },
    { id: "CustomerSuccess", label: "Customer Success" },
    { id: "Support", label: "Support Tickets" },
    { id: "CustomerHealth", label: "Health & Risk" },
    { id: "Analytics", label: "Usage Analytics" },
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", backgroundColor: "#F7F4ED", minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Subpage Header Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px" }}>
              External Customer Organizations
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.2rem 0 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Customer Management
            </h2>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #E6DED0", overflowX: "auto", paddingBottom: "0.1rem" }}>
          {subtabs.map(tab => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.6rem 1rem",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#111111" : "#707070",
                  cursor: "pointer",
                  borderBottom: isActive ? "2px solid #D9A928" : "2px solid transparent",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subpage Content */}
      <div>
        {subTab === "Organizations" && <OrganizationsPage />}
        {subTab === "Subscriptions" && <BillingPage />}
        {subTab === "Workspaces" && <WorkspacesPage />}
        {subTab === "Support" && <SupportPage />}
        {subTab === "Analytics" && <AnalyticsPage />}
        {subTab === "Trials" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Active Customer Trials</h3>
            <p style={{ fontSize: "0.85rem", color: "#707070" }}>Track 14-day free trials, activation milestones, and conversion pipelines for prospective customer organizations.</p>
          </div>
        )}
        {subTab === "CustomerSuccess" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Customer Success & Account Management</h3>
            <p style={{ fontSize: "0.85rem", color: "#707070" }}>Assigned CSM accounts, onboarding status checklists, and renewal risk monitoring.</p>
          </div>
        )}
        {subTab === "CustomerHealth" && (
          <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "12px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#111111" }}>Customer Health & Churn Risk Index</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "1.25rem", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 700 }}>HIGH HEALTH SCORE</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#15803D", marginTop: "0.25rem" }}>86% Orgs</div>
              </div>
              <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", padding: "1.25rem", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.72rem", color: "#92400E", fontWeight: 700 }}>NEEDS ATTENTION</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#B45309", marginTop: "0.25rem" }}>11% Orgs</div>
              </div>
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", padding: "1.25rem", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.72rem", color: "#991B1B", fontWeight: 700 }}>HIGH CHURN RISK</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#DC2626", marginTop: "0.25rem" }}>3% Orgs</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
