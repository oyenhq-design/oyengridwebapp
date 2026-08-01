import React, { useState, useMemo } from 'react';
import { 
  Play, BookOpen, MessageSquare, Bell, User, Calendar, CheckCircle2, 
  AlertCircle, ArrowRight, RefreshCw, Clock, ExternalLink, ChevronRight
} from 'lucide-react';

export default function FacilitatorDashboard({ 
  assignedSessions = [], 
  assignedResources = [],
  programs = [], 
  currentUserEmail, 
  userInfo, 
  onNavigate, 
  onSelectSession 
}) {

  const facilitatorName = userInfo?.fullName || currentUserEmail?.split('@')[0] || 'Facilitator';

  // Get dynamic greeting based on time of day
  const timeGreeting = useMemo(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Format today's date nicely: e.g. "Thursday, 30 July"
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }, []);

  // Format today's date in YYYY-MM-DD
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

  // Find today's session
  const todaySession = useMemo(() => {
    return sortedSessions.find(s => s.date === todayStr) || null;
  }, [sortedSessions, todayStr]);

  // Find next session (either today's session or the closest future one)
  const nextSession = useMemo(() => {
    if (todaySession) return todaySession;
    return sortedSessions.find(s => s.date > todayStr) || null;
  }, [sortedSessions, todaySession, todayStr]);

  // Determine dynamic schedule message
  const dynamicScheduleMsg = useMemo(() => {
    if (todaySession) {
      return `Your next session starts at ${todaySession.time || '10:00 AM'}.`;
    }
    if (nextSession) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const isTomorrow = nextSession.date === tomorrowStr;
      return `Your next session starts ${isTomorrow ? 'tomorrow' : 'soon'} at ${nextSession.time || '10:00 AM'}.`;
    }
    return 'You have a free day today.';
  }, [todaySession, nextSession]);

  // Upcoming sessions for timeline cards
  const upcomingSessions = useMemo(() => {
    return sortedSessions.filter(s => {
      if (s.status === 'Completed') return false;
      if (todaySession && s.id === todaySession.id) return false;
      return s.date >= todayStr;
    });
  }, [sortedSessions, todayStr, todaySession]);

  // Dynamically build Recent Activity Feed based on real assignments
  const recentActivities = useMemo(() => {
    const list = [];
    sortedSessions.forEach((s, idx) => {
      if (s.status === 'Completed') {
        list.push({
          id: `act-comp-${s.id}-${idx}`,
          text: `Session "${s.title}" completed successfully.`,
          time: 'Yesterday'
        });
      } else {
        list.push({
          id: `act-assign-${s.id}-${idx}`,
          text: `You were assigned as facilitator for "${s.title}".`,
          time: '5 days ago'
        });
      }
    });
    return list.slice(0, 3);
  }, [sortedSessions]);

  // Today's Focus Action Item
  const todaysFocus = useMemo(() => {
    if (assignedSessions.length === 0) {
      return {
        title: 'No assignments yet',
        desc: "You'll see your upcoming focus items here once sessions are assigned."
      };
    }
    if (todaySession) {
      return {
        title: 'Prepare Session Materials',
        desc: `Review outline and slides for "${todaySession.title}" before starts.`
      };
    }
    if (assignedResources.length > 0) {
      return {
        title: 'Review Shared Resources',
        desc: 'Review newly uploaded slide decks and facilitator guides.'
      };
    }
    return {
      title: 'Everything looks good.',
      desc: 'You are all set for today.'
    };
  }, [assignedSessions, todaySession, assignedResources]);

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F8F5EF', 
      minHeight: '100vh', 
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#151515',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem'
    }}>
      
      {/* 1. Personalized Greeting Banner */}
      <div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          color: '#151515', 
          margin: 0, 
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.8px'
        }}>
          {timeGreeting}, {facilitatorName} 👋
        </h1>
        <p style={{ 
          color: '#D4AF37', 
          fontSize: '1.1rem', 
          fontWeight: 600, 
          marginTop: '0.4rem',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {formattedDate} • <span style={{ color: '#2D6CDF' }}>{dynamicScheduleMsg}</span>
        </p>
      </div>

      {/* Grid Layout containing Main Column and Insights Panel */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(12, 1fr)', 
        gap: '2.5rem', 
        alignItems: 'start' 
      }}>
        
        {/* Left Side (8 Columns): Today's Status & 3 Info Cards */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* 2. Today's Status Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.015)',
            border: '1px solid rgba(212, 175, 55, 0.25)', // Premium gold soft border
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Soft decorative background glow */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: 'rgba(214, 175, 55, 0.04)',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              margin: '0 0 1.5rem'
            }}>
              Today's Status
            </h3>

            {todaySession ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      color: '#2D6CDF', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {todaySession.programName || 'Programme'}
                    </span>
                    <h4 style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 800, 
                      color: '#151515', 
                      margin: '0.35rem 0 0', 
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: '-0.3px'
                    }}>
                      {todaySession.title}
                    </h4>
                  </div>
                  <span style={{ 
                    backgroundColor: 'rgba(45, 108, 223, 0.08)',
                    color: '#2D6CDF',
                    padding: '0.45rem 1rem', 
                    borderRadius: '30px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: '1px solid rgba(45, 108, 223, 0.15)'
                  }}>
                    {todaySession.status || 'Live Class'}
                  </span>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '1.5rem', 
                  borderTop: '1px solid rgba(0,0,0,0.03)', 
                  borderBottom: '1px solid rgba(0,0,0,0.03)',
                  padding: '1.5rem 0'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>DATE & TIME</span>
                    <span style={{ color: '#151515', fontSize: '0.95rem', fontWeight: 700 }}>
                      Today • {todaySession.time || '10:00 AM — 12:00 PM'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>LEARNERS</span>
                    <span style={{ color: '#151515', fontSize: '0.95rem', fontWeight: 700 }}>
                      {todaySession.learnersCount || '24 learners'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>SESSION TYPE</span>
                    <span style={{ color: '#151515', fontSize: '0.95rem', fontWeight: 700 }}>
                      {todaySession.type || 'Webinar'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    onClick={() => onSelectSession(todaySession)}
                    style={{ 
                      backgroundColor: '#D4AF37', 
                      border: 'none', 
                      color: '#FFFFFF', 
                      padding: '0.85rem 1.85rem', 
                      borderRadius: '10px', 
                      fontSize: '0.95rem', 
                      fontWeight: 700, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      transition: 'background-color 0.2s',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5942D'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
                  >
                    Prepare Session
                  </button>

                  <button 
                    onClick={() => onSelectSession(todaySession)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: '1px solid rgba(0,0,0,0.08)', 
                      color: '#2D6CDF', 
                      padding: '0.85rem 1.5rem', 
                      borderRadius: '10px', 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D6CDF'; e.currentTarget.style.backgroundColor = 'rgba(45, 108, 223, 0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  color: '#2D6CDF', 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  ✓ No sessions today
                </h4>
                <p style={{ color: '#666666', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, maxWidth: '520px' }}>
                  You have a free schedule. Take time to prepare your upcoming sessions, review learner submissions, or update your teaching resources.
                </p>
                <button 
                  onClick={() => onNavigate('Resources')}
                  style={{ 
                    alignSelf: 'flex-start',
                    backgroundColor: '#D4AF37', 
                    border: 'none', 
                    color: '#FFFFFF', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5942D'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
                >
                  Review Resources
                </button>
              </div>
            )}
          </div>

          {/* 3. Three Info Metric Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem' 
          }}>
            
            {/* Card A: Next Session */}
            <div style={{ 
              backgroundColor: '#FFFDF9', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.005)',
              border: '1px solid rgba(0,0,0,0.015)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '150px'
            }}>
              <div>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}>📅</span>
                <span style={{ fontSize: '0.8rem', color: '#888888', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Next Session</span>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 800, 
                  color: '#151515', 
                  margin: '0.25rem 0 0', 
                  lineHeight: '1.3',
                  fontFamily: "'Outfit', sans-serif",
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {nextSession ? nextSession.title : 'No upcoming session'}
                </h4>
              </div>
              <button 
                onClick={() => onNavigate('Sessions')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2D6CDF', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  marginTop: '1rem',
                  padding: 0
                }}
              >
                <span>View Schedule</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Card B: Resources */}
            <div style={{ 
              backgroundColor: '#FFFDF9', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.005)',
              border: '1px solid rgba(0,0,0,0.015)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '150px'
            }}>
              <div>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}>📚</span>
                <span style={{ fontSize: '0.8rem', color: '#888888', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Resources</span>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 800, 
                  color: '#151515', 
                  margin: '0.25rem 0 0',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  {assignedResources.length} Files Available
                </h4>
              </div>
              <button 
                onClick={() => onNavigate('Resources')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2D6CDF', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  marginTop: '1rem',
                  padding: 0
                }}
              >
                <span>Open Library</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Card C: Messages */}
            <div style={{ 
              backgroundColor: '#FFFDF9', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.005)',
              border: '1px solid rgba(0,0,0,0.015)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '150px'
            }}>
              <div>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}>💬</span>
                <span style={{ fontSize: '0.8rem', color: '#888888', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Messages</span>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 800, 
                  color: '#151515', 
                  margin: '0.25rem 0 0',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  2 unread messages
                </h4>
              </div>
              <button 
                onClick={() => onNavigate('Inbox')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2D6CDF', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  marginTop: '1rem',
                  padding: 0
                }}
              >
                <span>Open Inbox</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* 4. Upcoming Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: 0
            }}>
              Upcoming Timeline
            </h3>

            {upcomingSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingSessions.map(session => (
                  <div 
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    style={{ 
                      backgroundColor: '#FFFDF9',
                      borderRadius: '16px',
                      padding: '1.25rem 2rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.005)',
                      border: '1px solid rgba(0,0,0,0.015)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
                  >
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>DATE</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151515' }}>{session.date}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>TITLE</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151515' }}>{session.title}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>TIME</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666666' }}>{session.time || '10:00 AM'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>LEARNERS</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666666' }}>{session.learnersCount || '24 learners'}</span>
                      </div>
                    </div>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#D4AF37', 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.15rem'
                      }}
                    >
                      <span>Prepare</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: '#FFFDF9',
                borderRadius: '16px',
                border: '1px dashed rgba(0,0,0,0.06)'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111', display: 'block', marginBottom: '0.25rem' }}>Upcoming</span>
                <p style={{ fontSize: '0.8rem', color: '#666666', margin: 0 }}>
                  No sessions assigned. When an administrator assigns a session, it will appear here automatically.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side (4 Columns): Today's Focus & Recent Activity */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Today's Focus Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2rem 2.25rem', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.015)'
          }}>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              margin: '0 0 1.25rem'
            }}>
              Today's Focus
            </h3>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#151515', margin: 0 }}>
              {todaysFocus.title}
            </h4>
            <p style={{ color: '#666666', fontSize: '0.85rem', lineHeight: '1.5', margin: '0.4rem 0 0' }}>
              {todaysFocus.desc}
            </p>
          </div>

          {/* Recent Activity Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2rem 2.25rem', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.015)'
          }}>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              margin: '0 0 1.5rem'
            }}>
              Recent Activity
            </h3>

            {recentActivities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recentActivities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {act.time}
                    </span>
                    <p style={{ color: '#151515', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>
                      {act.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666666', fontSize: '0.85rem', margin: 0 }}>
                No recent activity.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
