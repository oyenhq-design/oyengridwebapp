import React from 'react';
import { Home, Calendar, BookOpen, Bell, User } from 'lucide-react';

export default function FacilitatorSidebar({ activeTab, onTabSelect, isWelcome }) {
  const sidebarItems = [
    { id: 'Overview', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
    { id: 'Resources', label: 'Resources', icon: <BookOpen size={18} /> },
    { id: 'Notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
  ];

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {sidebarItems.map((item) => {
        const isActive = (item.id === 'Overview' && isWelcome) || (item.id === activeTab);
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
