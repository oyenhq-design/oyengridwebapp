import React, { useState } from 'react';
import { 
  Menu, Search, Bell, Home, BookOpen, UserCheck, 
  Calendar, FileText, BarChart3, Users,
  Settings, LogOut 
} from 'lucide-react';

export default function ProgramManagerLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  user, 
  workspaceName, 
  onLogout 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'Programmes', label: 'Programmes', icon: <BookOpen size={18} /> },
    { id: 'Participants', label: 'Participants', icon: <UserCheck size={18} /> },
    { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
    { id: 'Resources', label: 'Resources', icon: <FileText size={18} /> },
    { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
    { id: 'Team', label: 'Team', icon: <Users size={18} /> },
    { id: 'Settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#F8F5EF', // Warm ivory background for the content area
      color: '#111111',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        height: '70px',
        backgroundColor: '#0D0D0D', // Black header
        borderBottom: '1px solid #1F1F1F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a0aec0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #D4AF37',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '1.5px', color: '#fff' }}>
              OYEN <span style={{ color: '#D4AF37' }}>GRID</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1A1A1A',
            border: '1px solid #2D2D2D',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            width: '280px'
          }}>
            <Search size={16} color="#6b7280" />
            <input 
              type="text"
              placeholder="Search anything..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.9rem',
                marginLeft: '0.75rem',
                outline: 'none',
                width: '100%'
              }}
            />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backgroundColor: '#2D2D2D',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              color: '#9ca3af',
              fontWeight: 600
            }}>
              <span>⌘</span><span>K</span>
            </div>
          </div>

          <button style={{ background: 'transparent', border: 'none', color: '#a0aec0', position: 'relative', cursor: 'pointer' }}>
            <Bell size={20} />
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              backgroundColor: '#F4C542',
              borderRadius: '50%'
            }}></div>
          </button>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#F4C542',
            color: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}>
            {user ? user.substring(0, 2).toUpperCase() : 'PM'}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar */}
        <aside style={{
          width: isSidebarOpen ? '250px' : '0px',
          backgroundColor: '#090a0f', // Black sidebar
          borderRight: '1px solid #1F1F1F',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 90
        }}>
          <div style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.5rem',
                  width: '100%',
                  backgroundColor: activeTab === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: activeTab === item.id ? '#D4AF37' : '#9ca3af',
                  border: 'none',
                  borderRight: activeTab === item.id ? '3px solid #D4AF37' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === item.id ? 600 : 500,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.5rem', borderTop: '1px solid #1F1F1F' }}>
            <div style={{
              backgroundColor: '#111',
              border: '1px solid #1F1F1F',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Workspace</span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{workspaceName || 'ABC Energy'}</span>
              </div>
            </div>

            <button 
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.5rem',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          maxWidth: isSidebarOpen ? 'calc(100vw - 250px)' : '100vw',
          overflowY: 'auto',
          position: 'relative'
        }}>
          {children}
        </main>
      </div>
      
    </div>
  );
}
