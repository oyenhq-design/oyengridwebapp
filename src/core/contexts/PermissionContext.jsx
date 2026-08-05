import React, { createContext, useContext } from 'react';
import { isRoleAdmin, isRoleFacilitator, isRoleProgramManager } from '../../domain/workspace/selectors';

const PermissionContext = createContext(null);

export function PermissionProvider({ children, role }) {
  const canManageWorkspace = isRoleAdmin(role);
  const canManageProgrammes = isRoleAdmin(role) || isRoleProgramManager(role);
  const canManageSessions = isRoleAdmin(role) || isRoleProgramManager(role) || isRoleFacilitator(role);

  return (
    <PermissionContext.Provider value={{
      canManageWorkspace,
      canManageProgrammes,
      canManageSessions,
      role
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext) || {
    canManageWorkspace: false,
    canManageProgrammes: false,
    canManageSessions: false
  };
}
