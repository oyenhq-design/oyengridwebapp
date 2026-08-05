import React, { createContext, useContext } from 'react';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ 
  children, 
  wsPrograms = [], 
  setWsPrograms, 
  wsLearners = [], 
  setWsLearners, 
  wsTeam = [], 
  setWsTeam,
  orgName = 'ABC Energy Solutions'
}) {
  return (
    <WorkspaceContext.Provider value={{
      wsPrograms,
      setWsPrograms,
      wsLearners,
      setWsLearners,
      wsTeam,
      setWsTeam,
      orgName
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    return {
      wsPrograms: [],
      wsLearners: [],
      wsTeam: [],
      orgName: 'OYEN GRID Workspace'
    };
  }
  return context;
}
