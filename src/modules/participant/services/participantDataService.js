// src/modules/participant/services/participantDataService.js

export const getLearnerProgrammeData = (user, wsPrograms, wsLearners = []) => {
  const userEmail = (user || '').trim().toLowerCase();
  const matchedLearner = (wsLearners || []).find(l => l.email && l.email.trim().toLowerCase() === userEmail);
  
  let matchedProgram = null;
  if (matchedLearner && matchedLearner.program && Array.isArray(wsPrograms)) {
    matchedProgram = wsPrograms.find(p => p.name && p.name.toLowerCase() === matchedLearner.program.toLowerCase());
  }

  const baseProgram = matchedProgram || (wsPrograms && wsPrograms.length > 0 ? wsPrograms[0] : null);

  return {
    id: baseProgram?.id || 'prog-bootcamp',
    name: baseProgram?.name || 'Product Design Bootcamp',
    description: baseProgram?.description || baseProgram?.desc || 'Master UI/UX design, design systems, user research, and interactive prototyping over an intensive 8-week program.',
    duration: baseProgram?.duration || '8 Weeks',
    currentWeek: baseProgram?.currentWeek || 4,
    totalWeeks: baseProgram?.totalWeeks || 8,
    progress: matchedLearner?.progress !== undefined ? matchedLearner.progress : 65,
    learnerName: matchedLearner?.name || (user ? user.split('@')[0].replace('.', ' ') : 'Blessing'),
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
          { id: 'l2', title: 'Design Principles & Wireframing', type: 'reading', duration: '15 mins', status: 'Completed' }
        ]
      },
      {
        id: 'm4',
        title: 'Week 4: Design Systems',
        lessons: [
          { id: 'l8', title: 'Component Libraries & Tokens', type: 'video', duration: '40 mins', status: 'In Progress' },
          { id: 'l9', title: 'Typography & Color Scales', type: 'reading', duration: '25 mins', status: 'In Progress' }
        ]
      }
    ]
  };
};

export const getLearnerTodayGoals = () => ({
  estimatedTime: '45 mins',
  tasks: [
    { id: 't1', title: 'Watch Lesson: Component Libraries & Tokens', completed: true, type: 'lesson' },
    { id: 't2', title: 'Submit UI Design Challenge Deliverable', completed: false, type: 'assignment' },
    { id: 't3', title: 'Attend Live Session: Design Systems & Tokens', completed: false, type: 'session' }
  ]
});

export const getLearnerAnnouncements = () => [
  { id: 'a1', icon: '📢', title: 'Live Workshop Moved to 11:00 AM', detail: 'Facilitator Sarah Ahmed rescheduled today\'s Figma masterclass by 1 hour.', time: '2 hours ago' },
  { id: 'a2', icon: '🎨', title: 'New Resources Added: Week 4 UI Kit', detail: 'Download the official auto-layout component library from the Resources tab.', time: '5 hours ago' },
  { id: 'a3', icon: '✅', title: 'Assignment 3 Grading Complete', detail: 'Scores and feedback for User Research Personas have been posted.', time: '1 day ago' }
];

export const getLearnerRecentActivity = () => [
  { id: 'act1', title: 'Completed Lesson: Micro-interactions & Motion', category: 'Lesson', date: 'Yesterday' },
  { id: 'act2', title: 'Joined Live Workshop: User Personas Synthesis', category: 'Session', date: 'Yesterday' },
  { id: 'act3', title: 'Downloaded Resource: Color Contrast Guide PDF', category: 'Resource', date: '2 days ago' },
  { id: 'act4', title: 'Submitted Assignment: User Persona & Journey Map', category: 'Assignment', date: '3 days ago' }
];

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
  }
];

export const getLearnerAchievements = () => [
  { id: 'ach-1', title: 'Perfect Attendance', desc: 'Attended 100% of live workshop sessions in Weeks 1-3.', icon: 'Award', unlocked: true, date: 'Aug 2, 2026' },
  { id: 'ach-2', title: 'Assignment Streak', desc: 'Submitted 5 consecutive assignments ahead of the deadline.', icon: 'Zap', unlocked: true, date: 'Aug 5, 2026' },
  { id: 'ach-3', title: 'Quiz Master', desc: 'Scored 90%+ on all weekly knowledge checks.', icon: 'CheckCircle2', unlocked: true, date: 'Jul 28, 2026' }
];
