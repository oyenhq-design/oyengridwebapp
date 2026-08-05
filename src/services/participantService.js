import { getLearnersForUser } from '../domain/workspace/selectors';

export const participantService = {
  getParticipants: (user, role, learners = [], programs = []) => {
    return getLearnersForUser(user, role, learners, programs);
  },

  addParticipant: (participantData, currentLearners = []) => {
    const newParticipant = {
      id: `part-${Date.now()}`,
      name: participantData.name || 'New Participant',
      email: participantData.email || '',
      program: participantData.program || '',
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    return [newParticipant, ...currentLearners];
  },

  removeParticipant: (participantId, currentLearners = []) => {
    return currentLearners.filter(l => l.id !== participantId);
  }
};
