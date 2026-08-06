import React from "react";

export default function CommandCentreGuard({ children }) {
  // Placeholder Guard: allows access in dev mode or local environment
  const isAuthorizedStaff = true; 

  if (!isAuthorizedStaff) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#0C0C0C", color: "#EF4444" }}>
        <h3>Access Denied: Authorized OYEN Staff Only</h3>
      </div>
    );
  }

  return <>{children}</>;
}
