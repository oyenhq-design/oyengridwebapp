import React from 'react';
import { Home, Clock, Grid, Users, BookOpen, UserCheck, Calendar, BarChart3, Settings } from 'lucide-react';

export default function AdminSidebar({ activeTab, onTabSelect, isWelcome }) {
  const sidebarItems = [
    { id: 'Welcome', label: 'Welcome', icon: <Home size={18} /> },
    { id: 'Getting Started', label: 'Getting Started', icon: <Clock size={18} /> },
    { id: 'Your Workspace', label: 'Your Workspace', icon: <Grid size={18} /> },
    { id: 'Team', label: 'Team', icon: <Users size={18} /> },
    { id: 'Programmes', label: 'Programmes', icon: <BookOpen size={18} /> },
    { id: 'Learners', label: 'Participants', icon: <UserCheck size={18} /> },
    { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
    { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
    { id: 'Settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {sidebarItems.map((item) => {
        const isActive = (item.id === 'Welcome' && isWelcome) || (item.id === activeTab);
        return (
          <div 
            key={item.id}
            onClick={() => onTabSelect(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              margin: '0 0.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#151515' : '#a0aec0',
              background: isActive ? '#F5C84C' : 'transparent',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(245, 200, 76, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#a0aec0';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
