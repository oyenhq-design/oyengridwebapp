/**
 * Workspace Selectors
 * Pure functions. No side effects. No hooks. No mutations.
 * Derive data from master workspace state.
 */

export function isRoleAdmin(role) {
  const r = (role || '').trim().toLowerCase();
  return ['admin', 'workspace super admin', 'administrator', 'owner', 'organization admin', 'org admin'].includes(r);
}

export function isRoleFacilitator(role) {
  const r = (role || '').trim().toLowerCase();
  return ['facilitator', 'workspace facilitator', 'trainer'].includes(r);
}

export function isRoleProgramManager(role) {
  const r = (role || '').trim().toLowerCase();
  return ['program manager', 'programme manager', 'programmanager', 'manager'].includes(r);
}

export function isRoleTeamMember(role) {
  const r = (role || '').trim().toLowerCase();
  return ['team member', 'employee'].includes(r);
}

export function isRoleViewer(role) {
  const r = (role || '').trim().toLowerCase();
  return ['viewer'].includes(r);
}

export function getProgramsForUser(user, role, programs = []) {
  const safePrograms = Array.isArray(programs) ? programs : [];
  if (!user) return safePrograms;
  const currentEmail = user.trim().toLowerCase();

  if (isRoleAdmin(role) || isRoleViewer(role) || isRoleProgramManager(role)) {
    return safePrograms;
  }

  if (isRoleFacilitator(role) || isRoleTeamMember(role)) {
    const matched = safePrograms.filter(p =>
      p.assignedFacilitators &&
      Array.isArray(p.assignedFacilitators) &&
      p.assignedFacilitators.some(e => {
        const email = typeof e === 'string' ? e : (e?.email || e?.name || '');
        return email.trim().toLowerCase() === currentEmail;
      })
    );
    return matched.length > 0 ? matched : safePrograms;
  }

  return safePrograms;
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

