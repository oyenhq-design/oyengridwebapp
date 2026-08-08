// src/modules/participant/services/participantDataService.js

export const getLearnerProgrammeData = (user, wsPrograms, wsLearners = []) => {
  // Try to find matching learner record from workspace state
  const userEmail = (user || '').trim().toLowerCase();
  const matchedLearner = (wsLearners || []).find(l => l.email && l.email.trim().toLowerCase() === userEmail);
  
  // Try to match program assigned to learner
  let matchedProgram = null;
  if (matchedLearner && matchedLearner.program && Array.isArray(wsPrograms)) {
    matchedProgram = wsPrograms.find(p => p.name && p.name.toLowerCase() === matchedLearner.program.toLowerCase());
  }

  const baseProgram = matchedProgram || (wsPrograms && wsPrograms.length > 0 ? wsPrograms[0] : null);

  const defaultProg = {
    id: baseProgram?.id || 'prog-bootcamp',
    name: baseProgram?.name || 'Product Design Bootcamp',
    description: baseProgram?.description || baseProgram?.desc || 'Master UI/UX design, design systems, user research, and interactive prototyping over an intensive 8-week program.',
    duration: baseProgram?.duration || '8 Weeks',
    currentWeek: baseProgram?.currentWeek || 4,
    totalWeeks: baseProgram?.totalWeeks || 8,
    progress: matchedLearner?.progress !== undefined ? matchedLearner.progress : 65,
    learnerName: matchedLearner?.name || (user ? user.split('@')[0].replace('.', ' ') : 'Shola Alabi'),
    facilitators: baseProgram?.facilitators || [
      { name: 'Sarah Ahmed', role: 'Lead Instructor', email: 'sarah.ahmed@abcenergy.com' },
      { name: 'Michael Ibrahim', role: 'Design Mentor', email: 'michael.ibrahim@abcenergy.com' }
    ],
    modules: baseProgram?.modules || [
      {
        id: 'm1',
        title: 'Week 1: Fundamentals of UI/UX',
        lessons: [
          { id: 'l1', title: 'Introduction to User Experience', type: 'video', duration: '25 mins', status: 'Completed' },
          { id: 'l2', title: 'Design Principles & Wireframing', type: 'reading', duration: '15 mins', status: 'Completed' },
          { id: 'l3', title: 'Figma Basics Exercise', type: 'exercise', duration: '45 mins', status: 'Completed' }
        ]
      },
      {
        id: 'm2',
        title: 'Week 2: User Research & Personas',
        lessons: [
          { id: 'l4', title: 'Conducting User Interviews', type: 'video', duration: '30 mins', status: 'Completed' },
          { id: 'l5', title: 'Synthesizing Research Insights', type: 'reading', duration: '20 mins', status: 'Completed' }
        ]
      },
      {
        id: 'm3',
        title: 'Week 3: Interaction & Prototyping',
        lessons: [
          { id: 'l6', title: 'Interactive Micro-interactions', type: 'video', duration: '35 mins', status: 'Completed' },
          { id: 'l7', title: 'Building Clickable Prototypes', type: 'exercise', duration: '50 mins', status: 'Completed' }
        ]
      },
      {
        id: 'm4',
        title: 'Week 4: Design Systems',
        lessons: [
          { id: 'l8', title: 'Component Libraries & Tokens', type: 'video', duration: '40 mins', status: 'In Progress' },
          { id: 'l9', title: 'Typography & Color Scales', type: 'reading', duration: '25 mins', status: 'In Progress' },
          { id: 'l10', title: 'Design System Challenge', type: 'exercise', duration: '60 mins', status: 'Locked' }
        ]
      }
    ]
  };

  return defaultProg;
};

export const getLearnerAssignments = () => [
  {
    id: 'asg-1',
    title: 'UI Design Challenge — Design System Components',
    module: 'Week 4: Design Systems',
    dueDate: 'Tomorrow, 11:59 PM',
    status: 'Pending',
    score: null,
    maxScore: 100,
    instructions: 'Create a reusable Figma component library including Primary Buttons, Input Fields, and Card containers adhering to accessibility contrast guidelines.',
    rubric: [
      { criteria: 'Component Variants & Auto-layout', points: 40 },
      { criteria: 'Color System & Contrast Accessibility', points: 30 },
      { criteria: 'Documentation & Naming Conventions', points: 30 }
    ]
  },
  {
    id: 'asg-2',
    title: 'User Persona & Journey Map',
    module: 'Week 2: User Research',
    dueDate: '3 days ago',
    status: 'Graded',
    score: 92,
    maxScore: 100,
    instructions: 'Submit a comprehensive user journey map based on 3 user interview transcripts.',
    feedback: 'Excellent synthesis of user pain points! Your journey map clearly highlights the onboarding friction area.'
  }
];

export const getLearnerAchievements = () => [
  { id: 'ach-1', title: 'Perfect Attendance', desc: 'Attended 100% of live workshop sessions in Weeks 1-3.', icon: 'Award', unlocked: true, date: 'Aug 2, 2026' },
  { id: 'ach-2', title: 'Assignment Streak', desc: 'Submitted 5 consecutive assignments ahead of the deadline.', icon: 'Zap', unlocked: true, date: 'Aug 5, 2026' },
  { id: 'ach-3', title: 'Quiz Master', desc: 'Scored 90%+ on all weekly knowledge checks.', icon: 'CheckCircle2', unlocked: true, date: 'Jul 28, 2026' },
  { id: 'ach-4', title: 'Top Contributor', desc: 'Active participation in community Q&A and peer discussions.', icon: 'Users', unlocked: false, date: null }
];
