import React, { useState } from 'react';
import { Bell, Search, Check, ExternalLink, AlertOctagon, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsTab({ notifications = [], setNotifications, onSelectSession, programs = [] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkAsRead = (id) => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleMarkAllAsRead = () => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleAction = (n) => {
    handleMarkAsRead(n.id);
    if (n.actionType === 'view_session' && onSelectSession) {
      // Find session in programs
      let foundSession = null;
      programs.forEach(p => {
        (p.sessions || []).forEach(s => {
          if (s.title === n.program || p.name === n.program || n.description.includes(s.title)) {
            foundSession = { ...s, programName: p.name, programId: p.id };
          }
        });
      });
      if (foundSession) {
        onSelectSession(foundSession);
      } else {
        // Fallback: select first session of first program or search
        const firstSession = programs[0]?.sessions?.[0];
        if (firstSession) {
          onSelectSession({ ...firstSession, programName: programs[0].name, programId: programs[0].id });
        }
      }
    } else {
      alert(`Action: ${n.actionText}`);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'Unread' && n.read) return false;
    if (activeFilter === 'Critical' && n.priority !== 'Critical') return false;
    if (activeFilter === 'Important' && n.priority !== 'Important') return false;
    if (activeFilter === 'Information' && n.priority !== 'Information') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        (n.program && n.program.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const priorityOrder = { Critical: 1, Important: 2, Information: 3 };
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return '#EF4444';
    if (priority === 'Important') return '#F59E0B';
    return '#3B82F6';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'Critical') return <AlertOctagon size={14} color="#FFF" />;
    if (priority === 'Important') return <AlertTriangle size={14} color="#FFF" />;
    return <Info size={14} color="#FFF" />;
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F4F1EB', minHeight: '100vh', padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#111111', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Notifications</h2>
          <p style={{ color: '#222222', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Stay informed with updates from your organization and assigned programs.
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #E7E1D6', color: '#222222', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#111111'; e.currentTarget.style.color = '#111111'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E1D6'; e.currentTarget.style.color = '#222222'; }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6' }}></div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Unread', 'Critical', 'Important', 'Information'].map(f => {
            const count = f === 'All' ? notifications.length : 
                          f === 'Unread' ? unreadCount : 
                          notifications.filter(n => n.priority === f).length;
            const isActive = activeFilter === f;

            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #E7E1D6',
                  backgroundColor: isActive ? '#C89A2B' : '#FAF8F4',
                  color: isActive ? '#FFF' : '#222222',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.borderColor = '#C89A2B'; }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.borderColor = '#E7E1D6'; }}
              >
                {f}
                <span style={{ fontSize: '12px', opacity: 0.8, backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="#8D887E" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '14px', backgroundColor: '#FAF8F4', border: '1px solid #E7E1D6', borderRadius: '8px', color: '#161616', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            onFocus={e => e.currentTarget.style.borderColor = '#C89A2B'}
            onBlur={e => e.currentTarget.style.borderColor = '#E7E1D6'}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {sortedNotifications.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#FAF8F4', border: '1px dashed #E7E1D6', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '32px' }}>✔</div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#161616', margin: '0 0 0.25rem 0' }}>You're all caught up</h4>
              <p style={{ color: '#6D6D6D', fontSize: '15px', margin: 0 }}>
                No new updates from your organization.
              </p>
            </div>
          </div>
        ) : (
          sortedNotifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => handleMarkAsRead(n.id)}
              style={{
                backgroundColor: n.read ? '#FAF8F4' : '#FFF',
                border: '1px solid #E7E1D6',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: n.read ? 0.8 : 1,
                boxShadow: n.read ? 'none' : '0 4px 12px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C89A2B'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E1D6'; }}
            >
              {/* Priority Indicator Dot/Icon */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: getPriorityColor(n.priority),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '0.1rem'
              }}>
                {getPriorityIcon(n.priority)}
              </div>

              {/* Text content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {n.title}
                    {!n.read && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C89A2B' }}></span>
                    )}
                  </span>
                  <span style={{ fontSize: '14px', color: '#333333', fontWeight: 600 }}>{n.time}</span>
                </div>

                {n.program && (
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#C89A2B' }}>{n.program}</span>
                )}

                <p style={{ fontSize: '15px', color: '#222222', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
                  {n.description}
                </p>
              </div>

              {/* Action Button */}
              {n.actionText && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleAction(n); }}
                  style={{
                    alignSelf: 'center',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #E7E1D6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#111111',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C89A2B'; e.currentTarget.style.borderColor = '#C89A2B'; e.currentTarget.style.color = '#FFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#E7E1D6'; e.currentTarget.style.color = '#111111'; }}
                >
                  {n.actionText} <ExternalLink size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
