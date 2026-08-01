import React, { useState, useMemo, useEffect } from 'react';
import { 
  Play, BookOpen, MessageSquare, Bell, HelpCircle, User, 
  CheckSquare, Square, Calendar, Eye, RefreshCw
} from 'lucide-react';

export default function FacilitatorDashboard({ 
  assignedSessions = [], 
  programs = [], 
  currentUserEmail, 
  userInfo, 
  onNavigate, 
  onSelectSession 
}) {
  
  // Tasks state synced with localStorage
  const localStorageKey = `oyen_tasks_${currentUserEmail || 'default'}`;
  const [tasks, setTasks] = useState(() => {
    const defaultTasks = [
      { id: 'review-materials', label: 'Review session materials', completed: false },
      { id: 'upload-slides', label: 'Upload presentation slides', completed: false },
      { id: 'mark-attendance', label: 'Mark attendance', completed: false },
      { id: 'grade-assessments', label: 'Grade submitted assessment', completed: false },
      { id: 'reply-questions', label: 'Reply learner questions', completed: false }
    ];
    try {
      const saved = localStorage.getItem(localStorageKey);
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch (e) {
      return defaultTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(tasks));
  }, [tasks, localStorageKey]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const facilitatorName = userInfo?.fullName || currentUserEmail?.split('@')[0] || 'Facilitator';

  // Get today's date in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    return localToday.toISOString().split('T')[0];
  }, []);

  // Sort sessions chronologically
  const sortedSessions = useMemo(() => {
    return [...assignedSessions].sort((a, b) => {
      const dateA = new Date(a.date || '');
      const dateB = new Date(b.date || '');
      return dateA - dateB;
    });
  }, [assignedSessions]);

  // Determine Today's Session
  const todaySession = useMemo(() => {
    return sortedSessions.find(s => s.date === todayStr) || null;
  }, [sortedSessions, todayStr]);

  // Determine Upcoming Sessions (sessions scheduled after today, or today's sessions if no todaySession is active)
  const upcomingSessions = useMemo(() => {
    return sortedSessions.filter(s => {
      if (s.status === 'Completed') return false;
      if (todaySession && s.id === todaySession.id) return false;
      return s.date >= todayStr;
    });
  }, [sortedSessions, todayStr, todaySession]);

  // Full Empty State (If facilitator has NO sessions assigned at all)
  if (assignedSessions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ 
        backgroundColor: '#F8F6F1', 
        minHeight: '100vh', 
        padding: '3rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontFamily: "'Inter', sans-serif" 
      }}>
        <div style={{ 
          maxWidth: '500px', 
          textAlign: 'center', 
          backgroundColor: '#FFFFFF', 
          padding: '4rem 3rem', 
          borderRadius: '16px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.03)',
          color: '#1A1A1A'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#F8F6F1', 
            marginBottom: '2rem'
          }}>
            <Calendar size={36} color="#D6A428" />
          </div>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 800, 
            color: '#1A1A1A', 
            margin: '0 0 1rem', 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.3px'
          }}>
            You're all caught up.
          </h2>
          <p style={{ 
            color: '#666666', 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            margin: '0 0 2rem' 
          }}>
            You don't have any assigned sessions yet. Once an administrator assigns a session, it will appear here automatically.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              backgroundColor: '#D6A428', 
              border: 'none', 
              color: '#FFFFFF', 
              padding: '0.85rem 2rem', 
              borderRadius: '8px', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.65rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 12px rgba(214, 164, 40, 0.2)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5841D'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D6A428'}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F8F6F1', 
      minHeight: '100vh', 
      padding: '3rem 4rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* Header */}
      <div>
        <h1 style={{ 
          fontSize: '2.4rem', 
          fontWeight: 800, 
          color: '#1A1A1A', 
          margin: 0, 
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.5px' 
        }}>
          Welcome back, {facilitatorName}
        </h1>
        <p style={{ 
          color: '#666666', 
          fontSize: '1.05rem', 
          marginTop: '0.35rem' 
        }}>
          Here’s what’s coming up in your assigned sessions.
        </p>
      </div>

      {/* Main Grid Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.6fr 1fr', 
        gap: '2.5rem', 
        alignItems: 'start' 
      }}>
        
        {/* Left Column: Today's Session & Upcoming Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* 1. TODAY'S SESSION */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              Today's Session
            </h2>

            {todaySession ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: '#D6A428', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {todaySession.programName || 'Programme'}
                  </span>
                  <h3 style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 800, 
                    color: '#1A1A1A', 
                    margin: '0.35rem 0 0', 
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.3px'
                  }}>
                    {todaySession.title}
                  </h3>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: '1.5rem', 
                  borderTop: '1px solid #F1ECE4', 
                  borderBottom: '1px solid #F1ECE4',
                  padding: '1.5rem 0'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>DATE & TIME</span>
                    <div style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {todaySession.date} at {todaySession.time || '10:00 AM'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>SESSION TYPE</span>
                    <div style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {todaySession.type || 'Live Class'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>LEARNERS</span>
                    <div style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {todaySession.learnersCount || todaySession.learners?.length || '24 Registered'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => onSelectSession(todaySession)}
                    style={{ 
                      backgroundColor: '#D6A428', 
                      border: 'none', 
                      color: '#FFFFFF', 
                      padding: '0.9rem 2rem', 
                      borderRadius: '8px', 
                      fontSize: '0.95rem', 
                      fontWeight: 700, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      transition: 'background-color 0.2s',
                      boxShadow: '0 4px 12px rgba(214, 164, 40, 0.25)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5841D'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D6A428'}
                  >
                    <Play size={16} fill="#FFFFFF" />
                    Start Session
                  </button>

                  <button 
                    onClick={() => onSelectSession(todaySession)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: '1px solid #E2DCD0', 
                      color: '#1A1A1A', 
                      padding: '0.9rem 1.5rem', 
                      borderRadius: '8px', 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DCD0'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    View Details
                  </button>

                  <button 
                    onClick={() => onNavigate('Resources')}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: '1px solid #E2DCD0', 
                      color: '#1A1A1A', 
                      padding: '0.9rem 1.5rem', 
                      borderRadius: '8px', 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DCD0'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    Open Resources
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '1.05rem', color: '#666666', fontWeight: 500 }}>
                  No session scheduled today.
                </span>
                <button 
                  onClick={() => onNavigate('Sessions')}
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: '1px solid #E2DCD0', 
                    color: '#1A1A1A', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DCD0'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  View Upcoming Sessions
                </button>
              </div>
            )}
          </div>

          {/* 2. UPCOMING SESSIONS */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              Upcoming Sessions
            </h2>

            {upcomingSessions.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F1ECE4' }}>
                      <th style={{ padding: '0.85rem 0.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '0.85rem 0.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Time</th>
                      <th style={{ padding: '0.85rem 0.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Programme</th>
                      <th style={{ padding: '0.85rem 0.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Session</th>
                      <th style={{ padding: '0.85rem 0.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Type</th>
                      <th style={{ padding: '0.85rem 0.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingSessions.map(session => (
                      <tr key={session.id} style={{ borderBottom: '1px solid #F8F6F1', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1.1rem 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{session.date}</td>
                        <td style={{ padding: '1.1rem 0.5rem', color: '#666666', fontSize: '0.875rem' }}>{session.time || '10:00 AM'}</td>
                        <td style={{ padding: '1.1rem 0.5rem', color: '#666666', fontSize: '0.875rem' }}>{session.programName || 'Programme'}</td>
                        <td style={{ padding: '1.1rem 0.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A' }}>{session.title}</td>
                        <td style={{ padding: '1.1rem 0.5rem', color: '#666666', fontSize: '0.875rem' }}>{session.type || 'Live Class'}</td>
                        <td style={{ padding: '1.1rem 0.5rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => onSelectSession(session)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#D6A428', 
                              fontWeight: 700, 
                              fontSize: '0.85rem', 
                              cursor: 'pointer', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.2rem' 
                            }}
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: '#888888', fontSize: '0.9rem', padding: '1rem 0' }}>
                No upcoming sessions scheduled.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: My Tasks & Quick Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* 3. MY TASKS */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              My Tasks
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem', 
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ marginTop: '0.1rem', color: task.completed ? '#D6A428' : '#888888' }}>
                    {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <span style={{ 
                    fontSize: '0.925rem', 
                    fontWeight: 500,
                    color: task.completed ? '#888888' : '#1A1A1A',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    transition: 'color 0.2s, text-decoration 0.2s'
                  }}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. QUICK ACCESS */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              Quick Access
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '0.75rem' 
            }}>
              <button 
                onClick={() => onNavigate('Resources')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  width: '100%', 
                  padding: '0.9rem 1.25rem', 
                  backgroundColor: '#F8F6F1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#1A1A1A', 
                  fontSize: '0.925rem', 
                  fontWeight: 600, 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEEBE3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
              >
                <BookOpen size={16} color="#D6A428" />
                <span>Resources</span>
              </button>

              <button 
                onClick={() => onNavigate('Inbox')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  width: '100%', 
                  padding: '0.9rem 1.25rem', 
                  backgroundColor: '#F8F6F1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#1A1A1A', 
                  fontSize: '0.925rem', 
                  fontWeight: 600, 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEEBE3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
              >
                <MessageSquare size={16} color="#D6A428" />
                <span>Messages</span>
              </button>

              <button 
                onClick={() => onNavigate('Notifications')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  width: '100%', 
                  padding: '0.9rem 1.25rem', 
                  backgroundColor: '#F8F6F1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#1A1A1A', 
                  fontSize: '0.925rem', 
                  fontWeight: 600, 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEEBE3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
              >
                <Bell size={16} color="#D6A428" />
                <span>Announcements</span>
              </button>

              <button 
                onClick={() => alert('Support portal simulation: contact support@oyengrid.com')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  width: '100%', 
                  padding: '0.9rem 1.25rem', 
                  backgroundColor: '#F8F6F1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#1A1A1A', 
                  fontSize: '0.925rem', 
                  fontWeight: 600, 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEEBE3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
              >
                <HelpCircle size={16} color="#D6A428" />
                <span>Support</span>
              </button>

              <button 
                onClick={() => onNavigate('Profile')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  width: '100%', 
                  padding: '0.9rem 1.25rem', 
                  backgroundColor: '#F8F6F1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#1A1A1A', 
                  fontSize: '0.925rem', 
                  fontWeight: 600, 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s' 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEEBE3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
              >
                <User size={16} color="#D6A428" />
                <span>My Profile</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
