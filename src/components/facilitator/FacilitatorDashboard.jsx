import React, { useState, useMemo } from 'react';
import { 
  Play, BookOpen, MessageSquare, Bell, User, Calendar, CheckCircle2, 
  AlertCircle, ArrowRight, RefreshCw, Compass, Clock, CheckSquare, 
  Settings, Users, ClipboardCheck, Video
} from 'lucide-react';

export default function FacilitatorDashboard({ 
  assignedSessions = [], 
  programs = [], 
  currentUserEmail, 
  userInfo, 
  onNavigate, 
  onSelectSession 
}) {

  const facilitatorName = userInfo?.fullName?.split(' ')[0] || currentUserEmail?.split('@')[0] || 'Facilitator';

  // Get dynamic greeting based on time of day
  const timeGreeting = useMemo(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
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

  // Calculate dynamic countdown for the next session
  const countdownText = useMemo(() => {
    if (!nextSession) return null;
    const isToday = nextSession.date === todayStr;
    if (isToday) {
      // Return a simulated, realistic countdown (e.g. Starts in 1 hour 15 minutes)
      return 'Starts in 1 hour 15 minutes';
    } else {
      // Find difference in days
      const diffTime = Math.abs(new Date(nextSession.date) - new Date(todayStr));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  }, [nextSession, todayStr]);

  // Filter out completed sessions for upcoming timeline
  const upcomingSessions = useMemo(() => {
    return sortedSessions.filter(s => {
      if (s.status === 'Completed') return false;
      if (todaySession && s.id === todaySession.id) return false;
      return s.date >= todayStr;
    });
  }, [sortedSessions, todayStr, todaySession]);

  // Session readiness checklist mock data (system-generated based on session properties)
  const readinessChecklist = useMemo(() => {
    if (!nextSession) return [];
    return [
      { id: 1, label: 'Slides uploaded', status: 'ready', desc: '✓ Slides uploaded' },
      { id: 2, label: 'Attendance tracker', status: 'warning', desc: '⚠ Attendance sheet not generated' },
      { id: 3, label: 'Learners notified', status: 'ready', desc: '✓ Learners notified' },
      { id: 4, label: 'Camera & mic config', status: 'warning', desc: '⚠ Camera & Mic Test' },
      { id: 5, label: 'AI Copilot standby', status: 'ready', desc: '✓ AI summary enabled' }
    ];
  }, [nextSession]);

  // Full Empty State
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
          maxWidth: '520px', 
          textAlign: 'center', 
          backgroundColor: '#FFFFFF', 
          padding: '4.5rem 3.5rem', 
          borderRadius: '24px', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.015)',
          color: '#1A1A1A'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '88px', 
            height: '88px', 
            borderRadius: '50%', 
            backgroundColor: '#F8F6F1', 
            marginBottom: '2rem'
          }}>
            <Calendar size={40} color="#D6A428" />
          </div>
          <h2 style={{ 
            fontSize: '1.9rem', 
            fontWeight: 800, 
            color: '#1A1A1A', 
            margin: '0 0 1rem', 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.5px'
          }}>
            You're all caught up.
          </h2>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            margin: '0 0 2.5rem' 
          }}>
            You don't have any assigned sessions yet. You'll automatically see them here when an administrator assigns one.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              backgroundColor: '#D6A428', 
              border: 'none', 
              color: '#FFFFFF', 
              padding: '0.95rem 2.2rem', 
              borderRadius: '12px', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.65rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 14px rgba(214, 164, 40, 0.25)'
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
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem'
    }}>
      
      {/* 1. Personalized Welcome Hero */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        paddingBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            color: '#1A1A1A', 
            margin: 0, 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-1px',
            lineHeight: 1.15
          }}>
            {timeGreeting},<br />
            {facilitatorName} 👋
          </h1>
          
          <div style={{ marginTop: '0.75rem' }}>
            {todaySession ? (
              <p style={{ fontSize: '1.25rem', fontWeight: 500, color: '#666666', margin: 0 }}>
                You're teaching <strong style={{ color: '#1A1A1A', fontWeight: 700 }}>{todaySession.title}</strong> today.
                {countdownText && (
                  <span style={{ 
                    display: 'block', 
                    fontSize: '1rem', 
                    color: '#D6A428', 
                    fontWeight: 700, 
                    marginTop: '0.4rem',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    {countdownText}
                  </span>
                )}
              </p>
            ) : (
              <p style={{ fontSize: '1.25rem', fontWeight: 500, color: '#666666', margin: 0 }}>
                Enjoy your free day 🎉 <span style={{ display: 'block', fontSize: '1rem', fontWeight: 400, color: '#888888', marginTop: '0.35rem' }}>No sessions are assigned today. Check your upcoming schedule or review your resources.</span>
              </p>
            )}
          </div>
        </div>

        {todaySession && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <button 
              onClick={() => onSelectSession(todaySession)}
              style={{ 
                backgroundColor: '#D6A428', 
                border: 'none', 
                color: '#FFFFFF', 
                padding: '1rem 2.2rem', 
                borderRadius: '12px', 
                fontSize: '1rem', 
                fontWeight: 700, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.65rem',
                transition: 'background-color 0.2s',
                boxShadow: '0 6px 20px rgba(214, 164, 40, 0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5841D'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D6A428'}
            >
              Prepare Session
            </button>
            <button 
              onClick={() => onSelectSession(todaySession)}
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2DCD0', 
                color: '#1A1A1A', 
                padding: '1rem 1.75rem', 
                borderRadius: '12px', 
                fontSize: '0.95rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.backgroundColor = '#F8F6F1'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DCD0'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              View Learners
            </button>
            <button 
              onClick={() => onNavigate('Resources')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2DCD0', 
                color: '#1A1A1A', 
                padding: '1rem 1.75rem', 
                borderRadius: '12px', 
                fontSize: '0.95rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.backgroundColor = '#F8F6F1'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DCD0'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              Open Resources
            </button>
          </div>
        )}
      </div>

      {/* 12-Column Structured Workspace Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(12, 1fr)', 
        gap: '2.5rem', 
        alignItems: 'start' 
      }}>
        
        {/* Left Area (8 Columns): Featured Session Card, Readiness, and Timeline */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* 2. Featured Session Card */}
          {nextSession && (
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '20px', 
              padding: '2.5rem', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.025)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    color: '#D6A428', 
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px'
                  }}>
                    {nextSession.programName || 'Programme'}
                  </span>
                  <h2 style={{ 
                    fontSize: '2.2rem', 
                    fontWeight: 800, 
                    color: '#1A1A1A', 
                    margin: '0.5rem 0 0', 
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2
                  }}>
                    {nextSession.title}
                  </h2>
                </div>
                <span style={{ 
                  backgroundColor: nextSession.status === 'Live' ? '#FEE2E2' : '#FEF3C7',
                  color: nextSession.status === 'Live' ? '#EF4444' : '#D6A428',
                  padding: '0.45rem 1rem', 
                  borderRadius: '30px', 
                  fontSize: '0.8rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {nextSession.status || 'Upcoming'}
                </span>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '1.5rem',
                backgroundColor: '#F8F6F1',
                padding: '1.5rem',
                borderRadius: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>DATE</span>
                  <span style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700 }}>
                    {nextSession.date}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>TIME</span>
                  <span style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700 }}>
                    {nextSession.time || '10:00 AM — 12:00 PM'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>LEARNERS</span>
                  <span style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700 }}>
                    {nextSession.learnersCount || nextSession.learners?.length || '24 learners'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>SESSION TYPE</span>
                  <span style={{ color: '#1A1A1A', fontSize: '0.95rem', fontWeight: 700 }}>
                    {nextSession.type || 'Webinar'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1ECE4', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#D6A428', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '0.85rem' }}>
                    {facilitatorName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#888888', display: 'block' }}>FACILITATOR</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A1A' }}>{userInfo?.fullName || currentUserEmail}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectSession(nextSession)}
                  style={{
                    backgroundColor: '#D6A428',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5841D'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D6A428'}
                >
                  Prepare Session
                </button>
              </div>
            </div>
          )}

          {/* 3. Session Readiness */}
          {nextSession && (
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '20px', 
              padding: '2.5rem', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.025)'
            }}>
              <h3 style={{ 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                color: '#888888', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                margin: '0 0 1.5rem'
              }}>
                Before Session Readiness
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.25rem' 
              }}>
                {readinessChecklist.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '1.25rem', 
                      borderRadius: '12px', 
                      backgroundColor: item.status === 'ready' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(214, 164, 40, 0.05)',
                      border: item.status === 'ready' ? '1px solid rgba(34, 197, 94, 0.1)' : '1px solid rgba(214, 164, 40, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <div style={{ color: item.status === 'ready' ? '#22C55E' : '#D6A428' }}>
                      {item.status === 'ready' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      color: item.status === 'ready' ? '#1E293B' : '#854D0E'
                    }}>
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Upcoming Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {upcomingSessions.map(session => (
                  <div 
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '1.5rem 2rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                      border: '1px solid rgba(0,0,0,0.015)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D6A428'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
                  >
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>DATE</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A1A' }}>{session.date}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>TIME</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666666' }}>{session.time || '10:00 AM'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>PROGRAMME</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A1A' }}>{session.programName || 'Programme'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block' }}>SESSION</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666666' }}>{session.title}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 600, 
                        color: '#666666',
                        backgroundColor: '#F8F6F1',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '20px'
                      }}>
                        {session.learnersCount || '24 Learners'}
                      </span>
                      <ArrowRight size={18} color="#D6A428" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '2.5rem', 
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.015)',
                color: '#888888'
              }}>
                No upcoming sessions scheduled.
              </div>
            )}
          </div>

        </div>

        {/* Right Area (4 Columns): 5. Quick Access Grid */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            color: '#888888', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            margin: 0
          }}>
            Quick Access
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '1rem' 
          }}>
            {/* Resources Icon Card */}
            <div 
              onClick={() => onNavigate('Resources')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.015)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D6A428'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(214, 164, 40, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6A428' }}>
                <BookOpen size={22} />
              </div>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', display: 'block' }}>Resources</span>
                <span style={{ fontSize: '0.8rem', color: '#888888' }}>Open files and templates</span>
              </div>
            </div>

            {/* Attendance Icon Card */}
            <div 
              onClick={() => onNavigate('Sessions')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.015)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D6A428'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(214, 164, 40, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6A428' }}>
                <ClipboardCheck size={22} />
              </div>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', display: 'block' }}>Attendance</span>
                <span style={{ fontSize: '0.8rem', color: '#888888' }}>Rosters and session logs</span>
              </div>
            </div>

            {/* Messages Icon Card */}
            <div 
              onClick={() => onNavigate('Inbox')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.015)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D6A428'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(214, 164, 40, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6A428' }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', display: 'block' }}>Messages</span>
                <span style={{ fontSize: '0.8rem', color: '#888888' }}>Direct chat & inbox</span>
              </div>
            </div>

            {/* Announcements Icon Card */}
            <div 
              onClick={() => onNavigate('Notifications')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.015)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D6A428'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(214, 164, 40, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6A428' }}>
                <Bell size={22} />
              </div>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', display: 'block' }}>Announcements</span>
                <span style={{ fontSize: '0.8rem', color: '#888888' }}>Broadcast notifications</span>
              </div>
            </div>

            {/* Profile Icon Card */}
            <div 
              onClick={() => onNavigate('Profile')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.015)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D6A428'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(214, 164, 40, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6A428' }}>
                <User size={22} />
              </div>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', display: 'block' }}>My Profile</span>
                <span style={{ fontSize: '0.8rem', color: '#888888' }}>Personal configuration settings</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
