import React, { useState, useMemo } from 'react';
import { 
  Menu, Search, Bell, Home, BookOpen, UserCheck, 
  Calendar, FileText, BarChart3, Users,
  Settings, LogOut, ArrowRight, ChevronDown
} from 'lucide-react';

export default function ProgramManagerLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  user, 
  workspaceName, 
  onLogout,
  wsPrograms = [],
  wsLearners = [],
  wsTeam = []
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to your workspace as a Program Manager!', time: 'Just now', read: false },
    { id: 2, text: 'New participant enrolled in Battery Storage Systems programme.', time: '2 hours ago', read: false },
    { id: 3, text: 'Session scheduled: Advanced Battery Chemistry next Monday.', time: '1 day ago', read: true }
  ]);

  // Profile dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  // Dynamic search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const items = [];
    wsPrograms.forEach(p => {
      items.push({ name: p.name || p.title, type: 'Program', detail: p.category || 'Programme', tab: 'Programmes' });
      const sess = p.sessions || [];
      sess.forEach(s => {
        items.push({ name: s.title, type: 'Session', detail: `In program: ${p.name || p.title}`, tab: 'Sessions' });
        const res = s.resources || [];
        res.forEach(sr => {
          items.push({ name: sr.name, type: 'Resource', detail: `Session file: ${sr.fileName}`, tab: 'Sessions' });
        });
      });
    });

    wsLearners.forEach(l => {
      items.push({ name: l.name, type: 'Participant', detail: l.email, tab: 'Participants' });
    });

    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, wsPrograms, wsLearners]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const getPMName = () => {
    if (!user) return 'Program Manager';
    const parts = user.split('@')[0].split(/[._-]/);
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  };

  const getPMInitials = () => {
    if (!user) return 'PM';
    const parts = user.split('@')[0].split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#F8F5EF', // Warm ivory background for the content area
      color: '#111111',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}
      onClick={() => {
        setShowNotifications(false);
        setShowProfileDropdown(false);
      }}
    >
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          {/* Persistent Search Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${searchQuery ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '10px', padding: '0.42rem 0.75rem', width: '240px', gap: '0.5rem',
                transition: 'border-color 0.2s ease', cursor: 'text',
                boxShadow: searchQuery ? '0 0 0 3px rgba(212,175,55,0.07)' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('pm-search-input').focus();
              }}
            >
              <Search size={14} color="rgba(255,255,255,0.35)" style={{ flexShrink: 0 }} />
              <input
                id="pm-search-input"
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchExpanded(true)}
                onBlur={() => setTimeout(() => { setSearchExpanded(false); }, 150)}
                onKeyDown={(e) => { if (e.key === 'Escape') { setSearchQuery(''); setSearchExpanded(false); } }}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.82rem', outline: 'none', width: '100%', padding: 0, caretColor: '#D4AF37' }}
              />
              {searchQuery ? (
                <button
                  onMouseDown={(e) => { e.preventDefault(); setSearchQuery(''); setSearchExpanded(false); }}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', fontSize: '0.85rem', lineHeight: 1 }}
                >✕</button>
              ) : (
                <kbd style={{ display: 'flex', alignItems: 'center', padding: '0.1rem 0.4rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.38)', fontFamily: 'inherit', flexShrink: 0 }}>⌘K</kbd>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchExpanded && searchQuery.trim() && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '320px', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', boxShadow: '0 16px 48px rgba(0,0,0,0.65)', zIndex: 1200, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', padding: '0.65rem 1rem 0.45rem 1rem', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  Results
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {searchResults.length > 0 ? (
                    searchResults.slice(0, 8).map((item, idx) => (
                      <div
                        key={idx}
                        onMouseDown={() => {
                          if (item.tab) setActiveTab(item.tab);
                          setSearchQuery(''); setSearchExpanded(false);
                        }}
                        style={{ padding: '0.65rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.025)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Search size={12} color="#D4AF37" />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
                        </div>
                        <span style={{ fontSize: '0.63rem', fontWeight: 700, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', padding: '0.13rem 0.45rem', borderRadius: '4px', flexShrink: 0 }}>{item.type}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                      No results for "{searchQuery}"
                    </div>
                  )}
                </div>
                {searchResults.length > 8 && (
                  <div style={{ padding: '0.55rem 1rem', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    +{searchResults.length - 8} more results
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              style={{ background: 'transparent', border: 'none', color: showNotifications ? '#fff' : '#a0aec0', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <Bell size={20} />
              {unreadNotificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{unreadNotificationCount}</span>
              )}
            </button>

            {showNotifications && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '1.2rem', width: '340px', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', boxShadow: '0 15px 45px rgba(0,0,0,0.6)', zIndex: 1200, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
                        }}
                        style={{
                          padding: '1rem 1.25rem',
                          borderBottom: '1px solid rgba(255,255,255,0.02)',
                          backgroundColor: n.read ? 'transparent' : 'rgba(212,175,55,0.02)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          transition: 'background 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(212,175,55,0.02)'}
                      >
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37', marginTop: '0.35rem', flexShrink: 0 }} />}
                          <span style={{ fontSize: '0.8rem', color: n.read ? 'rgba(255,255,255,0.65)' : '#fff', fontWeight: n.read ? 500 : 600, lineHeight: 1.4 }}>
                            {n.text}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginLeft: n.read ? 0 : '0.8rem' }}>{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with dropdown */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              paddingLeft: '1.5rem',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
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
              {getPMInitials()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{getPMName()}</span>
              <span style={{ fontSize: '0.7rem', color: '#F4C542' }}>Program Manager</span>
            </div>
            <ChevronDown size={14} color="#718096" />

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '220px',
                  backgroundColor: '#111111',
                  border: '1px solid #1F1F1F',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  padding: '0.75rem 0',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left'
                }}
              >
                <div style={{ padding: '0.5rem 1rem 0.75rem 1rem', borderBottom: '1px solid #1F1F1F' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getPMName()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user}</div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setActiveTab('Settings');
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                    padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Settings
                </button>

                <div style={{ height: '1px', backgroundColor: '#1F1F1F', margin: '0.4rem 0' }} />

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  style={{
                    background: 'none', border: 'none', color: '#ef4444',
                    padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
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
