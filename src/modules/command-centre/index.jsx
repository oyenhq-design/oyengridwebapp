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

import ProgramsMasterPage from "./pages/programs/ProgramsMasterPage";
import ProgramsTemplatesPage from "./pages/programs/ProgramsTemplatesPage";
import ProgramsCertificatesPage from "./pages/programs/ProgramsCertificatesPage";

import SubscriptionsPlansPage from "./pages/subscriptions/SubscriptionsPlansPage";
import SubscriptionsRevenuePage from "./pages/subscriptions/SubscriptionsRevenuePage";
import SubscriptionsPaymentsPage from "./pages/subscriptions/SubscriptionsPaymentsPage";
import SubscriptionsCouponsPage from "./pages/subscriptions/SubscriptionsCouponsPage";

import PlatformServicesPage from "./pages/platform/PlatformServicesPage";
import PlatformAIEnginePage from "./pages/platform/PlatformAIEnginePage";
import PlatformStoragePage from "./pages/platform/PlatformStoragePage";
import PlatformNotificationsPage from "./pages/platform/PlatformNotificationsPage";

import AnalyticsPage from "./pages/AnalyticsPage";
import SecurityPage from "./pages/SecurityPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";

export default function CommandCentreModule() {
  const [currentTab, setCurrentTab] = useState("Overview");

  const renderTabContent = () => {
    // Executive Overview
    if (currentTab === "Overview" || currentTab === "Dashboard") {
      return <DashboardPage />;
    }

    // Company Child Pages
    if (currentTab === "Company_Headquarters") return <HeadquartersPage />;
    if (currentTab === "Company_Staff" || currentTab === "Team") return <StaffDirectoryPage />;
    if (currentTab === "Company_Roles") return <RolesStructurePage />;
    if (currentTab === "Company_Viewers") return <ViewersAuditPage />;

    // Customers Child Pages
    if (currentTab === "Customers_CRM") return <CustomerCRMPage />;
    if (currentTab === "Customers_Billing") return <CustomerBillingPage />;
    if (currentTab === "Customers_Support") return <CustomerSupportPage />;

    // Organizations Child Pages
    if (currentTab === "Organizations_List" || currentTab === "Organizations") return <OrganizationsMasterPage />;
    if (currentTab === "Organizations_Verification") return <OrganizationsVerificationPage />;
    if (currentTab === "Organizations_Domains") return <OrganizationsDomainsPage />;

    // Programs Child Pages
    if (currentTab === "Programs_List" || currentTab === "Programs") return <ProgramsMasterPage />;
    if (currentTab === "Programs_Templates") return <ProgramsTemplatesPage />;
    if (currentTab === "Programs_Certificates") return <ProgramsCertificatesPage />;

    // Subscriptions Child Pages
    if (currentTab === "Subscriptions_Plans") return <SubscriptionsPlansPage />;
    if (currentTab === "Subscriptions_Revenue") return <SubscriptionsRevenuePage />;
    if (currentTab === "Subscriptions_Payments") return <SubscriptionsPaymentsPage />;
    if (currentTab === "Subscriptions_Coupons") return <SubscriptionsCouponsPage />;

    // Platform Child Pages
    if (currentTab === "Platform_Services") return <PlatformServicesPage />;
    if (currentTab === "Platform_AI") return <PlatformAIEnginePage />;
    if (currentTab === "Platform_Storage") return <PlatformStoragePage />;
    if (currentTab === "Platform_Notifications") return <PlatformNotificationsPage />;

    if (currentTab.startsWith("Analytics")) return <AnalyticsPage />;

    if (currentTab.startsWith("Security")) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <SecurityPage />
          <AuditLogsPage />
        </div>
      );
    }

    if (currentTab.startsWith("System")) return <SettingsPage />;

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
