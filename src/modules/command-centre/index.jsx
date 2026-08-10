import React, { useState } from "react";
import { CommandCentreProvider } from "./context/CommandCentreContext";
import CommandCentreGuard from "./routes/CommandCentreGuard";
import CommandCentreLayout from "./layouts/CommandCentreLayout";

// Core Module imports
import DashboardPage from "./pages/DashboardPage";
import HeadquartersPage from "./pages/company/HeadquartersPage";
import StaffDirectoryPage from "./pages/company/StaffDirectoryPage";
import RolesStructurePage from "./pages/company/RolesStructurePage";
import ViewersAuditPage from "./pages/company/ViewersAuditPage";

import CustomerCRMPage from "./pages/customers/CustomerCRMPage";
import CustomerBillingPage from "./pages/customers/CustomerBillingPage";
import CustomerSupportPage from "./pages/customers/CustomerSupportPage";

import OrganizationsMasterPage from "./pages/organizations/OrganizationsMasterPage";
import OrganizationsVerificationPage from "./pages/organizations/OrganizationsVerificationPage";
import OrganizationsDomainsPage from "./pages/organizations/OrganizationsDomainsPage";

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
import WorkspacesPage from "./pages/WorkspacesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function CommandCentreModule() {
  const [currentTab, setCurrentTab] = useState("Overview");

  const renderTabContent = () => {
    // Route matching for Executive Navigation
    if (currentTab === "Overview" || currentTab === "Dashboard") {
      return <DashboardPage />;
    }

    // Independent Company Child Pages
    if (currentTab === "Company_Headquarters") {
      return <HeadquartersPage />;
    }
    if (currentTab === "Company_Staff" || currentTab === "Team") {
      return <StaffDirectoryPage />;
    }
    if (currentTab === "Company_Roles") {
      return <RolesStructurePage />;
    }
    if (currentTab === "Company_Viewers") {
      return <ViewersAuditPage />;
    }

    // Independent Customers Child Pages
    if (currentTab === "Customers_CRM") {
      return <CustomerCRMPage />;
    }
    if (currentTab === "Customers_Billing") {
      return <CustomerBillingPage />;
    }
    if (currentTab === "Customers_Support") {
      return <CustomerSupportPage />;
    }

    // Independent Organizations Child Pages
    if (currentTab === "Organizations_List" || currentTab === "Organizations") {
      return <OrganizationsMasterPage />;
    }
    if (currentTab === "Organizations_Verification") {
      return <OrganizationsVerificationPage />;
    }
    if (currentTab === "Organizations_Domains") {
      return <OrganizationsDomainsPage />;
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
