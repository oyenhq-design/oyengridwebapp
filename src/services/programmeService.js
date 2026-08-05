import { getProgramsForUser } from '../domain/workspace/selectors';

export const programmeService = {
  getProgrammes: (user, role, programs = []) => {
    return getProgramsForUser(user, role, programs);
  },

  createProgramme: (newProgramme, currentPrograms = []) => {
    const programme = {
      id: `prog-${Date.now()}`,
      name: newProgramme.name || 'Untitled Programme',
      description: newProgramme.description || '',
      status: 'Active',
      sessions: [],
      resources: [],
      assignedFacilitators: newProgramme.assignedFacilitators || [],
      createdAt: new Date().toISOString()
    };
    return [programme, ...currentPrograms];
  },

  updateProgramme: (programmeId, updates, currentPrograms = []) => {
    return currentPrograms.map(p => p.id === programmeId ? { ...p, ...updates } : p);
  },

  deleteProgramme: (programmeId, currentPrograms = []) => {
    return currentPrograms.filter(p => p.id !== programmeId);
  }
};
