export const aiService = {
  getInsight: (role, programs = [], learners = []) => {
    const roleLower = (role || '').toLowerCase();
    
    if (roleLower.includes('admin') || roleLower.includes('owner')) {
      const emptyProg = programs.find(p => p && !(p.learners || p.enrolledLearners || p.participants || []).length && (p.status === 'Active' || p.status === 'Published'));
      if (emptyProg) {
        return {
          title: emptyProg.name || emptyProg.title || 'Programme',
          msg: 'has no participants enrolled. Consider adding participants before the next session.'
        };
      }
      return {
        title: 'Workspace Health',
        msg: 'All active programmes have enrolled participants and scheduled sessions.'
      };
    }

    if (roleLower.includes('facilitator')) {
      return {
        title: 'Upcoming Session Prep',
        msg: 'Review your upcoming session materials and learner attendance list.'
      };
    }

    return {
      title: 'OYEN AI Insights',
      msg: 'Welcome to your workspace dashboard.'
    };
  }
};
