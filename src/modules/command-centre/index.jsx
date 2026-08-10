import React, { useState } from "react";
import { CommandCentreProvider } from "./context/CommandCentreContext";
import CommandCentreGuard from "./routes/CommandCentreGuard";
import CommandCentreLayout from "./layouts/CommandCentreLayout";

// Core Module imports
import DashboardPage from "./pages/DashboardPage";
import CompanyModule from "./pages/company/CompanyModule";
import CustomersModule from "./pages/customers/CustomersModule";
import UsersPage from "./pages/UsersPage";
import FeatureFlagsPage from "./pages/FeatureFlagsPage";
import BillingPage from "./pages/BillingPage";
import SupportPage from "./pages/SupportPage";
import MaintenancePage from "./pages/MaintenancePage";
import AIPage from "./pages/AIPage";
import ReleasesPage from "./pages/ReleasesPage";
import DeploymentsPage from "./pages/DeploymentsPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import SecurityPage from "./pages/SecurityPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";

// Legacy page support imports
import OrganizationsPage from "./pages/OrganizationsPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TeamPage from "./pages/company/TeamPage";
import DepartmentsPage from "./pages/company/DepartmentsPage";

export default function CommandCentreModule() {
  const [currentTab, setCurrentTab] = useState("Overview");

  const renderTabContent = () => {
    switch (currentTab) {
      case "Overview":
      case "Dashboard":
        return <DashboardPage />;

      case "Company":
      case "Team":
      case "Departments":
      case "Organization":
        return <CompanyModule initialSubtab={currentTab === "Company" ? "Team" : currentTab} />;

      case "Customers":
      case "Organizations":
      case "Workspaces":
        return <CustomersModule initialSubtab={currentTab === "Customers" ? "Organizations" : currentTab} />;

      case "Platform":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <UsersPage />
            <FeatureFlagsPage />
          </div>
        );

      case "Revenue":
        return <BillingPage />;

      case "Operations":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <SupportPage />
            <MaintenancePage />
          </div>
        );

      case "AI":
        return <AIPage />;

      case "Engineering":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ReleasesPage />
            <DeploymentsPage />
            <ExperimentsPage />
          </div>
        );

      case "Security":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <SecurityPage />
            <AuditLogsPage />
          </div>
        );

      case "System":
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
