import React, { useState } from "react";
import HeadquartersPage from "./HeadquartersPage";
import StaffDirectoryPage from "./StaffDirectoryPage";
import RolesStructurePage from "./RolesStructurePage";
import ViewersAuditPage from "./ViewersAuditPage";

export default function CompanyModule({ initialSubtab = "Headquarters" }) {
  const [subTab, setSubTab] = useState(initialSubtab);

  const subtabs = [
    { id: "Headquarters", label: "Headquarters" },
    { id: "Staff", label: "Staff Directory" },
    { id: "Roles", label: "Roles & Structure" },
    { id: "Viewers", label: "Viewers & Audit" },
  ];

  return (
    <div style={{ padding: "2.5rem 3rem", backgroundColor: "#F7F4ED", minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Subpage Header Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D9A928", textTransform: "uppercase", letterSpacing: "1px" }}>
              OYEN GROUP Internal Operating System
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.2rem 0 0", color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
              Company Operations
            </h2>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #E6DED0", overflowX: "auto", paddingBottom: "0.1rem" }}>
          {subtabs.map(tab => {
            const isActive = subTab === tab.id || (subTab === "Team" && tab.id === "Staff") || (subTab === "Organization" && tab.id === "Headquarters");
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.6rem 1rem",
                  fontSize: "0.85rem",
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
        {(subTab === "Headquarters" || subTab === "Organization") && <HeadquartersPage />}
        {(subTab === "Staff" || subTab === "Team") && <StaffDirectoryPage />}
        {subTab === "Roles" && <RolesStructurePage />}
        {subTab === "Viewers" && <ViewersAuditPage />}
      </div>
    </div>
  );
}
