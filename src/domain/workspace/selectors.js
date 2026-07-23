/**
 * Workspace Selectors
 * Pure functions. No side effects. No hooks. No mutations.
 * Derive data from master workspace state.
 */

export function getProgramsForUser(user, role, programs = []) {
  if (!user) return [];
  const currentEmail = user.trim().toLowerCase();
  const safePrograms = programs || [];

  if (role === 'Admin' || role === 'Viewer') {
    return safePrograms;
  }

  if (role === 'Facilitator' || role === 'Team Member') {
    return safePrograms.filter(p =>
      p.assignedFacilitators &&
      p.assignedFacilitators.some(e => e && e.trim().toLowerCase() === currentEmail)
    );
  }

  return [];
}

export function getSessionsForUser(user, role, programs = []) {
  const userPrograms = getProgramsForUser(user, role, programs);
  const allSessions = [];
  userPrograms.forEach(p => {
    (p.sessions || []).forEach(s => {
      allSessions.push({ ...s, programName: p.name, programId: p.id });
    });
  });
  return allSessions;
}

export function getLearnersForUser(user, role, learners = [], programs = []) {
  const userPrograms = getProgramsForUser(user, role, programs);
  const programNames = userPrograms.map(p => (p.name || '').toLowerCase());
  return (learners || []).filter(l => l.program && programNames.includes(l.program.toLowerCase()));
}

export function getInboxForUser(user, role, programs = []) {
  const userPrograms = getProgramsForUser(user, role, programs);
  const programNames = userPrograms.map(p => (p.name || '').toLowerCase());
  const allAnnouncements = [];
  (programs || []).forEach(p => {
    if (p.name && programNames.includes(p.name.toLowerCase())) {
      (p.announcements || []).forEach(a => {
        allAnnouncements.push({ ...a, programName: p.name });
      });
    }
  });
  return allAnnouncements;
}

export function getResourcesForUser(user, role, programs = []) {
  const userPrograms = getProgramsForUser(user, role, programs);
  const allResources = [];
  userPrograms.forEach(p => {
    (p.resources || []).forEach(r => {
      allResources.push({ ...r, programName: p.name, programId: p.id });
    });
  });
  return allResources;
}
