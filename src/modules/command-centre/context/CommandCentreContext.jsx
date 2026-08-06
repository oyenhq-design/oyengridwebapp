import React, { createContext, useContext, useState } from "react";

const CommandCentreContext = createContext(null);

export function CommandCentreProvider({ children }) {
  const [staffProfile, setStaffProfile] = useState({
    name: "Staff Member",
    role: "OPERATIONS",
    email: "ops@oyen.group",
  });
  const [platformSettings, setPlatformSettings] = useState({});

  return (
    <CommandCentreContext.Provider value={{ staffProfile, setStaffProfile, platformSettings, setPlatformSettings }}>
      {children}
    </CommandCentreContext.Provider>
  );
}

export function useCommandCentre() {
  const context = useContext(CommandCentreContext);
  if (!context) {
    throw new Error("useCommandCentre must be used within a CommandCentreProvider");
  }
  return context;
}
