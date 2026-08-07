import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { CompanyService } from "../../../../core/company/CompanyService";

export default function OrganizationPage() {
  const [info, setInfo] = useState({
    name: "OYEN Group",
    legalName: "OYEN Technologies Ltd",
    primaryDomain: "oyengrid.com",
    appDomain: "app.oyengrid.com",
    ccDomain: "admin.oyengrid.com",
    supportEmail: "support@oyengrid.com",
    timezone: "Africa/Lagos",
    country: "Nigeria"
  });

  useEffect(() => {
    setInfo(CompanyService.getCompanyInfo());
  }, []);

  const handleSaveCompany = () => {
    alert("Company configuration details saved successfully.");
  };

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Organization</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage OYEN Group corporate branding parameters, app domains, and support emails.</span>
      </div>

      <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px" }}>
          Corporate Configuration
        </span>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Company Name</label>
            <input type="text" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Legal Name</label>
            <input type="text" value={info.legalName} onChange={e => setInfo({ ...info, legalName: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Primary Domain</label>
            <input type="text" value={info.primaryDomain} onChange={e => setInfo({ ...info, primaryDomain: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>App Domain</label>
            <input type="text" value={info.appDomain} onChange={e => setInfo({ ...info, appDomain: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Command Centre Domain</label>
            <input type="text" value={info.ccDomain} onChange={e => setInfo({ ...info, ccDomain: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Support Email Address</label>
            <input type="text" value={info.supportEmail} onChange={e => setInfo({ ...info, supportEmail: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Time Zone</label>
            <input type="text" value={info.timezone} onChange={e => setInfo({ ...info, timezone: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.35rem", color: "#6B7280" }}>Country</label>
            <input type="text" value={info.country} onChange={e => setInfo({ ...info, country: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", color: "#1B1B1B" }} />
          </div>
        </div>

        <button onClick={handleSaveCompany} style={{ width: "max-content", alignSelf: "flex-end", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Save size={14} />
          <span>Save Details</span>
        </button>
      </div>
    </div>
  );
}
