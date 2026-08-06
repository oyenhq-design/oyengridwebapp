import React, { useState } from "react";
import { CommandCentreProvider } from "./context/CommandCentreContext";
import CommandCentreGuard from "./routes/CommandCentreGuard";
import CommandCentreLayout from "./layouts/CommandCentreLayout";

// Page component imports
import DashboardPage from "./pages/DashboardPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import UsersPage from "./pages/UsersPage";
import BillingPage from "./pages/BillingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SupportPage from "./pages/SupportPage";
import AIPage from "./pages/AIPage";
import SecurityPage from "./pages/SecurityPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import FeatureFlagsPage from "./pages/FeatureFlagsPage";
import MaintenancePage from "./pages/MaintenancePage";
import SettingsPage from "./pages/SettingsPage";

export default function CommandCentreModule() {
  const [currentTab, setCurrentTab] = useState("Dashboard");

  const renderTabContent = () => {
    switch (currentTab) {
      case "Dashboard":
        return <DashboardPage />;
      case "Organizations":
        return <OrganizationsPage />;
      case "Users":
        return <UsersPage />;
      case "Billing":
        return <BillingPage />;
      case "Analytics":
        return <AnalyticsPage />;
      case "Support":
        return <SupportPage />;
      case "AI":
        return <AIPage />;
      case "Security":
        return <SecurityPage />;
      case "AuditLogs":
        return <AuditLogsPage />;
      case "FeatureFlags":
        return <FeatureFlagsPage />;
      case "Maintenance":
        return <MaintenancePage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
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
