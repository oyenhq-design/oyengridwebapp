import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, Calendar, BookOpen, ClipboardCheck, Volume2, 
  AlertTriangle, ChevronRight, Check, CheckCircle2, Clock
} from 'lucide-react';

export default function FacilitatorNotifications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Stateful notifications list to allow "Mark as read" interaction
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Session Reminder',
      description: 'Battery Storage Systems Simulation starts tomorrow at 10:00 AM.',
      time: '2 hours ago',
      category: 'Sessions',
      unread: true,
      iconType: 'session',
      actionText: 'View Session'
    },
    {
      id: 'notif-2',
      title: 'New Resources Available',
      description: 'Presentation slides and Facilitator Guide have been uploaded.',
      time: 'Yesterday',
      category: 'Resources',
      unread: true,
      iconType: 'resources',
      actionText: 'Open Resources'
    },
    {
      id: 'notif-3',
      title: 'Programme Update',
      description: 'The administrator updated the Renewable Power Architecture session schedule.',
      time: '2 days ago',
      category: 'Announcements',
      unread: false,
      iconType: 'announcements',
      actionText: 'View Details'
    },
    {
      id: 'notif-4',
      title: 'Attendance Completed',
      description: 'The participant roster sheet has been processed and compiled.',
      time: '3 days ago',
      category: 'Attendance',
      unread: false,
      iconType: 'attendance',
      actionText: 'View Roster'
    },
    {
      id: 'notif-5',
      title: 'Session Rescheduled',
      description: 'Grid Simulation Lab was moved to next week due to maintenance.',
      time: '5 days ago',
      category: 'Sessions',
      unread: false,
      iconType: 'cancelled',
      actionText: 'View Schedule'
    }
  ]);

  // Handle Mark All as Read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Toggle single notification status
  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  // File icons selector
  const getIcon = (type) => {
    switch (type) {
      case 'session':
        return {
          icon: <Calendar size={20} />,
          bgColor: 'rgba(212, 175, 55, 0.08)',
          color: '#D4AF37'
        };
      case 'resources':
        return {
          icon: <BookOpen size={20} />,
          bgColor: 'rgba(45, 108, 223, 0.08)',
          color: '#2D6CDF'
        };
      case 'attendance':
        return {
          icon: <ClipboardCheck size={20} />,
          bgColor: 'rgba(16, 185, 129, 0.08)',
          color: '#10B981'
        };
      case 'announcements':
        return {
          icon: <Volume2 size={20} />,
          bgColor: 'rgba(139, 92, 246, 0.08)',
          color: '#8B5CF6'
        };
      case 'cancelled':
        return {
          icon: <AlertTriangle size={20} />,
          bgColor: 'rgba(239, 68, 68, 0.08)',
          color: '#EF4444'
        };
      default:
        return {
          icon: <Bell size={20} />,
          bgColor: 'rgba(0, 0, 0, 0.04)',
          color: '#151515'
        };
    }
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeFilter === 'Unread') {
        matchesFilter = n.unread;
      } else if (activeFilter !== 'All') {
        matchesFilter = n.category === activeFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchQuery, activeFilter]);

  // Check if any notification is unread
  const hasUnread = useMemo(() => {
    return notifications.some(n => n.unread);
  }, [notifications]);

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F8F5EF', 
      minHeight: '100vh', 
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#151515',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            color: '#151515', 
            margin: 0, 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.8px'
          }}>
            Activity Feed
          </h1>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            marginTop: '0.35rem' 
          }}>
            Stay updated with your assigned sessions and programme activities.
          </p>
        </div>

        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            style={{
              backgroundColor: '#FFFDF9',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '10px',
              padding: '0.65rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#2D6CDF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.005)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F5EF'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFDF9'}
          >
            <Check size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Search and Filters panel */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1.5rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        paddingBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Unread', 'Sessions', 'Resources', 'Announcements'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '30px',
                border: '1px solid',
                borderColor: activeFilter === filter ? '#D4AF37' : 'rgba(0,0,0,0.06)',
                backgroundColor: activeFilter === filter ? '#D4AF37' : '#FFFDF9',
                color: activeFilter === filter ? '#FFFFFF' : '#151515',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#888888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.65rem 1rem 0.65rem 2.5rem', 
              backgroundColor: '#FFFDF9', 
              border: '1px solid rgba(0,0,0,0.06)', 
              borderRadius: '12px', 
              color: '#151515', 
              outline: 'none', 
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.005)'
            }}
          />
        </div>
      </div>

      {/* Notifications feed content area */}
      {filteredNotifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
          {filteredNotifications.map(notif => {
            const styleIcon = getIcon(notif.iconType);
            return (
              <div 
                key={notif.id}
                onClick={() => handleToggleRead(notif.id)}
                style={{ 
                  backgroundColor: '#FFFDF9',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                  border: notif.unread ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0,0,0,0.015)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2D6CDF'}
                onMouseLeave={e => e.currentTarget.style.borderColor = notif.unread ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.015)'}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {/* Left Column: Category Icon */}
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    backgroundColor: styleIcon.bgColor, 
                    color: styleIcon.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {styleIcon.icon}
                  </div>

                  {/* Center Column: Text contents */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#151515', margin: 0 }}>
                        {notif.title}
                      </h4>
                      {notif.unread && (
                        <span style={{ 
                          backgroundColor: 'rgba(212, 175, 55, 0.08)',
                          color: '#D4AF37',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          ● New
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#666666', fontSize: '0.9rem', margin: '0.35rem 0 0.5rem', lineHeight: '1.4' }}>
                      {notif.description}
                    </p>
                    <span style={{ color: '#888888', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} />
                      {notif.time}
                    </span>
                  </div>
                </div>

                {/* Right Column: Inline Action button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); alert(`Navigating to action: ${notif.actionText}`); }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#2D6CDF',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    marginTop: '0.2rem'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(45, 108, 223, 0.04)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>{notif.actionText}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Card wrapper */
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: '#FFFDF9', 
          padding: '4.5rem 2.5rem', 
          borderRadius: '24px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
          border: '1px solid rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '560px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#F8F5EF', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            marginBottom: '0.5rem'
          }}>
            <Bell size={36} color="#D4AF37" />
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: '#151515', 
            margin: 0, 
            fontFamily: "'Outfit', sans-serif" 
          }}>
            You're all caught up.
          </h3>
          <p style={{ 
            color: '#666666', 
            fontSize: '0.95rem', 
            lineHeight: '1.6', 
            margin: 0,
            maxWidth: '420px'
          }}>
            When something requires your attention, notifications about assigned sessions, resources, announcements, and reminders will appear here automatically.
          </p>
        </div>
      )}

    </div>
  );
}
