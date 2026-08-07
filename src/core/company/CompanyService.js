export const CompanyService = {
  getCompanyInfo: () => {
    return {
      name: localStorage.getItem("oyen_company_name") || "OYEN Group",
      legalName: localStorage.getItem("oyen_legal_name") || "OYEN Technologies Ltd",
      primaryDomain: "oyengrid.com",
      appDomain: "app.oyengrid.com",
      ccDomain: "admin.oyengrid.com",
      supportEmail: "support@oyengrid.com",
      timezone: "Africa/Lagos",
      country: "Nigeria"
    };
  },

  getEmployees: () => {
    const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
    const ownerFirstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
    const ownerLastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";

    return [
      {
        id: "emp_01",
        name: `${ownerFirstName} ${ownerLastName}`,
        email: ownerEmail,
        title: "Founder & CEO",
        dept: "Leadership",
        role: "Platform Founder",
        manager: "Board of Directors",
        type: "Full-time",
        joined: "June 12, 2026",
        status: "Active",
        phone: "+234 809 123 4567",
        ownership: ["Platform", "Security", "Deployments", "Releases"],
        activity: ["Created Organization", "Approved Deployment v2.1.0"],
        device: { browser: "Chrome v120", os: "macOS", location: "Lagos, Nigeria", ip: "197.210.64.12" },
        security: { mfa: "Enabled", recovery: "recovery@oyengrid.com" }
      },
      {
        id: "emp_02",
        name: "Temi Alao",
        email: "temi@oyengrid.com",
        title: "Co-Founder & CTO",
        dept: "Engineering",
        role: "Engineering Lead",
        manager: `${ownerFirstName} ${ownerLastName}`,
        type: "Full-time",
        joined: "June 15, 2026",
        status: "Active",
        phone: "+234 809 987 6543",
        ownership: ["AI Command", "FeatureFlags", "Infrastructure"],
        activity: ["Approved Deployment v2.0.0"],
        device: { browser: "Firefox v119", os: "Linux", location: "Remote, Nigeria", ip: "192.168.1.1" },
        security: { mfa: "Enabled", recovery: "recovery-temi@oyengrid.com" }
      }
    ];
  },

  getDepartments: (employees) => {
    const ceo = employees[0] ? employees[0].name : "Founder";
    const cto = employees[1] ? employees[1].name : "Co-Founder";

    return [
      { name: "Leadership", manager: ceo, count: 1 },
      { name: "Engineering", manager: cto, count: 1 },
      { name: "Product", manager: "None Assigned", count: 0 },
      { name: "Operations", manager: "None Assigned", count: 0 },
      { name: "Support", manager: "None Assigned", count: 0 },
      { name: "Finance", manager: "None Assigned", count: 0 },
      { name: "AI", manager: "None Assigned", count: 0 },
      { name: "Marketing", manager: "None Assigned", count: 0 },
      { name: "Legal", manager: "None Assigned", count: 0 },
      { name: "HR", manager: "None Assigned", count: 0 }
    ];
  }
};
