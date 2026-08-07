import React, { useState, useEffect } from "react";
import { PermissionService } from "../../../../core/permissions/PermissionService";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRoles(PermissionService.getRoles());
  }, []);

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Roles</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage internal corporate roles, descriptions, and accessible system modules.</span>
      </div>

      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          System Roles & Inherited access
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>ROLE NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DESCRIPTION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>INHERITED SYSTEM ACCESS</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700 }}>{role.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{role.desc}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <strong>{role.modules}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
