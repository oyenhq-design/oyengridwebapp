import React, { useState, useEffect } from "react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);

  const loadDatabase = () => {
    try {
      const ownerFirstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
      const ownerLastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";

      setDepartments([
        { name: "Leadership", manager: `${ownerFirstName} ${ownerLastName}`, count: 1 },
        { name: "Engineering", manager: "Temi Alao", count: 1 },
        { name: "Product", manager: "None Assigned", count: 0 },
        { name: "Operations", manager: "None Assigned", count: 0 },
        { name: "Support", manager: "None Assigned", count: 0 },
        { name: "Finance", manager: "None Assigned", count: 0 },
        { name: "AI", manager: "None Assigned", count: 0 },
        { name: "Marketing", manager: "None Assigned", count: 0 },
        { name: "Legal", manager: "None Assigned", count: 0 },
        { name: "HR", manager: "None Assigned", count: 0 }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Company Departments</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage internal corporate departments, managers, and member counts.</span>
      </div>

      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Company Department Index
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DEPARTMENT NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>DEPARTMENT HEAD</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280" }}>ASSIGNED MEMBERS</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700 }}>{dept.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{dept.manager}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  {dept.count > 0 ? (
                    <strong>{dept.count} Members</strong>
                  ) : (
                    <span style={{ color: "#6B7280", fontSize: "0.72rem" }}>No employees assigned.</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
