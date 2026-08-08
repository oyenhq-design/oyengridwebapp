import React from 'react';
import Dashboard from './pages/Dashboard';
import Programme from './pages/Programme';
import Modules from './pages/Modules';
import LiveSessions from './pages/LiveSessions';
import Assignments from './pages/Assignments';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import Messages from './pages/Messages';
import Community from './pages/Community';
import AI from './pages/AI';
import Achievements from './pages/Achievements';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export const NAV_GROUPS = [
  {
    group: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', component: Dashboard }
    ]
  },
  {
    group: 'Programme',
    items: [
      { id: 'programme', label: 'My Programme', icon: 'BookOpen', component: Programme },
      { id: 'modules', label: 'Learning Modules', icon: 'Layers', component: Modules },
      { id: 'sessions', label: 'Live Sessions', icon: 'Video', component: LiveSessions },
      { id: 'assignments', label: 'Assignments', icon: 'FileText', component: Assignments },
      { id: 'assessments', label: 'Assessments', icon: 'CheckSquare', component: Assessments },
      { id: 'resources', label: 'Resources', icon: 'Folder', component: Resources }
    ]
  },
  {
    group: 'Communication',
    items: [
      { id: 'messages', label: 'Messages', icon: 'MessageSquare', component: Messages },
      { id: 'community', label: 'Community', icon: 'Users', component: Community },
      { id: 'ai', label: 'OYEN AI', icon: 'Sparkles', component: AI }
    ]
  },
  {
    group: 'Personal',
    items: [
      { id: 'achievements', label: 'Achievements', icon: 'Trophy', component: Achievements },
      { id: 'certificates', label: 'Certificates', icon: 'Award', component: Certificates },
      { id: 'profile', label: 'Profile', icon: 'User', component: Profile },
      { id: 'settings', label: 'Settings', icon: 'Settings', component: Settings }
    ]
  }
];

export const ROUTE_MAP = NAV_GROUPS.reduce((acc, group) => {
  group.items.forEach(item => {
    acc[item.id] = item;
  });
  return acc;
}, {});
