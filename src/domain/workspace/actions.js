/**
 * Workspace Actions
 * Pure functions that return new immutable state copies.
 * Never mutate arrays or objects directly.
 */

export function updateSessionStatus(programs, programId, sessionId, newStatus) {
  return programs.map(p => {
    if (p.id !== programId) return p;
    return {
      ...p,
      sessions: (p.sessions || []).map(s =>
        s.id === sessionId ? { ...s, status: newStatus } : s
      )
    };
  });
}

export function assignFacilitator(programs, programId, facilitatorEmail) {
  return programs.map(p => {
    if (p.id !== programId) return p;
    const existing = p.assignedFacilitators || [];
    if (existing.includes(facilitatorEmail)) return p;
    return { ...p, assignedFacilitators: [...existing, facilitatorEmail] };
  });
}

export function removeTeamMember(teamMembers, programs, memberEmail) {
  const email = memberEmail.toLowerCase();
  return {
    teamMembers: teamMembers.filter(m => (m.email || '').toLowerCase() !== email),
    programs: programs.map(p => ({
      ...p,
      assignedFacilitators: (p.assignedFacilitators || []).filter(e => (e || '').toLowerCase() !== email)
    }))
  };
}

export function createProgram(programs, newProgram) {
  return [
    ...programs,
    {
      sessions: [],
      resources: [],
      announcements: [],
      assignedFacilitators: [],
      ...newProgram,
      id: newProgram.id || Date.now()
    }
  ];
}

export function updateProgram(programs, programId, updatedFields) {
  return programs.map(p => (p.id === programId ? { ...p, ...updatedFields } : p));
}

export function createSession(programs, programId, newSession) {
  return programs.map(p => {
    if (p.id !== programId) return p;
    return {
      ...p,
      sessions: [
        ...(p.sessions || []),
        { status: 'Scheduled', resources: [], ...newSession, id: newSession.id || Date.now() }
      ]
    };
  });
}

export function deleteSession(programs, programId, sessionId) {
  return programs.map(p => {
    if (p.id !== programId) return p;
    return { ...p, sessions: (p.sessions || []).filter(s => s.id !== sessionId) };
  });
}

export function uploadResource(programs, programId, newResource) {
  return programs.map(p => {
    if (p.id !== programId) return p;
    return {
      ...p,
      resources: [...(p.resources || []), { ...newResource, id: newResource.id || Date.now() }]
    };
  });
}
