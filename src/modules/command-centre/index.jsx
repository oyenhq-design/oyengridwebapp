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
import OrganizationsPage from "./pages/OrganizationsPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function CommandCentreModule() {
  const [currentTab, setCurrentTab] = useState("Overview");

  const renderTabContent = () => {
    // Route matching for Executive Navigation
    if (currentTab === "Overview" || currentTab === "Dashboard") {
      return <DashboardPage />;
    }

    if (currentTab.startsWith("Company") || currentTab === "Team" || currentTab === "Departments") {
      let sub = "Team";
      if (currentTab === "Company_Staff") sub = "Team";
      else if (currentTab === "Company_Roles") sub = "Settings";
      else if (currentTab === "Company_Viewers") sub = "Executives";
      else if (currentTab === "Company_Headquarters") sub = "Team";
      return <CompanyModule initialSubtab={sub} />;
    }

    if (currentTab.startsWith("Organizations")) {
      return <CustomersModule initialSubtab="Organizations" />;
    }

    if (currentTab.startsWith("Customers")) {
      let sub = "Organizations";
      if (currentTab === "Customers_Billing") sub = "Subscriptions";
      else if (currentTab === "Customers_Support") sub = "Support";
      else if (currentTab === "Customers_CRM") sub = "CustomerSuccess";
      return <CustomersModule initialSubtab={sub} />;
    }

    if (currentTab.startsWith("Programs")) {
      return <WorkspacesPage />;
    }

    if (currentTab.startsWith("Subscriptions")) {
      return <BillingPage />;
    }

    if (currentTab.startsWith("Platform")) {
      if (currentTab === "Platform_AI") return <AIPage />;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <UsersPage />
          <FeatureFlagsPage />
        </div>
      );
    }

    if (currentTab.startsWith("Analytics")) {
      return <AnalyticsPage />;
    }

    if (currentTab.startsWith("Security")) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <SecurityPage />
          <AuditLogsPage />
        </div>
      );
    }

    if (currentTab.startsWith("System")) {
      return <SettingsPage />;
    }

    // Default fallback
    return <DashboardPage />;
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
