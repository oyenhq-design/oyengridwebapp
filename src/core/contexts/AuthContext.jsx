import React, { createContext, useContext, useState, useEffect } from 'react';
import { isRoleAdmin, isRoleFacilitator, isRoleProgramManager, isRoleTeamMember, isRoleViewer } from '../../domain/workspace/selectors';

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null, initialRole = null }) {
  const [user, setUser] = useState(initialUser);
  const [userRole, setUserRole] = useState(initialRole);

  const login = (email, role) => {
    setUser(email);
    setUserRole(role);
    sessionStorage.setItem('oyen_session_token', `oyen_token_${Date.now()}`);
    sessionStorage.setItem('oyen_session_user', JSON.stringify({ email, role }));
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    sessionStorage.removeItem('oyen_session_token');
    sessionStorage.removeItem('oyen_session_user');
    localStorage.removeItem('oyen_logged_in_user');
    localStorage.removeItem('oyen_user_role');
  };

  const isAdmin = isRoleAdmin(userRole);
  const isFacilitator = isRoleFacilitator(userRole);
  const isProgramManager = isRoleProgramManager(userRole);
  const isTeamMember = isRoleTeamMember(userRole);
  const isViewer = isRoleViewer(userRole);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      userRole,
      setUserRole,
      login,
      logout,
      isAdmin,
      isFacilitator,
      isProgramManager,
      isTeamMember,
      isViewer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      userRole: null,
      isAdmin: false,
      isFacilitator: false,
      isProgramManager: false,
      isTeamMember: false,
      isViewer: false
    };
  }
  return context;
}
