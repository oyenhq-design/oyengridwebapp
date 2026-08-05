import { getSessionsForUser } from '../domain/workspace/selectors';

export const sessionService = {
  getSessions: (user, role, programs = []) => {
    return getSessionsForUser(user, role, programs);
  },

  updateSessionStatus: (programs, programId, sessionId, newStatus) => {
    return programs.map(p => {
      if (p.id !== programId) return p;
      const updatedSessions = (p.sessions || []).map(s => {
        if (s.id !== sessionId) return s;
        return { ...s, status: newStatus };
      });
      return { ...p, sessions: updatedSessions };
    });
  }
};
