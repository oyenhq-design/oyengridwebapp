import React, { useState } from "react";
import { CommandCentreProvider } from "./context/CommandCentreContext";
import CommandCentreGuard from "./routes/CommandCentreGuard";
import CommandCentreLayout from "./layouts/CommandCentreLayout";

// Page component imports
import DashboardPage from "./pages/DashboardPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import UsersPage from "./pages/UsersPage";
import SupportPage from "./pages/SupportPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BillingPage from "./pages/BillingPage";
import AIPage from "./pages/AIPage";
import FeatureFlagsPage from "./pages/FeatureFlagsPage";
import SecurityPage from "./pages/SecurityPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";

// Dynamic placeholder for any unbuilt section
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: "3rem", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#1B1B1B" }}>{title}</h3>
    <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Platform Operations Cockpit</span>
    <div style={{
      border: "1px dashed #E6DED0", borderRadius: "8px", padding: "4rem 2rem",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", backgroundColor: "#FCFBF8", gap: "0.5rem", marginTop: "1.5rem"
    }}>
      <h4 style={{ margin: 0, color: "#1B1B1B", fontWeight: 700, fontSize: "0.9rem" }}>No entries discovered</h4>
      <p style={{ margin: 0, color: "#6B7280", fontSize: "0.78rem" }}>Database is currently empty. Initialize a setup record to populate the cockpit grid.</p>
    </div>
  </div>
);

export default function CommandCentreModule() {
  const [currentTab, setCurrentTab] = useState("Dashboard");

  const renderTabContent = () => {
    switch (currentTab) {
      case "Dashboard":
        return <DashboardPage />;
      case "Organizations":
        return <OrganizationsPage />;
      case "Workspaces":
        return <WorkspacesPage />;
      case "Users":
        return <UsersPage />;
      case "Support":
        return <SupportPage />;
      case "Analytics":
        return <AnalyticsPage />;
      case "Billing":
        return <BillingPage />;
      case "AI":
        return <AIPage />;
      case "FeatureFlags":
        return <FeatureFlagsPage />;
      case "Security":
        return <SecurityPage />;
      case "AuditLogs":
        return <AuditLogsPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <PlaceholderPage title={currentTab} />;
    }
  };

  return (
    <CommandCentreProvider>
      <CommandCentreGuard>
        <CommandCentreLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
          {renderTabContent()}
        </CommandCentreLayout>
      </CommandCentreGuard>
    </CommandCentreProvider>
  );
}
