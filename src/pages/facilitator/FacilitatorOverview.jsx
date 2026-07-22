import React, { useState, useEffect, useMemo } from 'react';
import { Play, Calendar, FileText, HelpCircle, Activity, ChevronRight, User, CheckCircle2, AlertTriangle, MessageSquare, BookOpen, Clock, AlertCircle } from 'lucide-react';

// Helper to parse date/time into a JS Date object
function parseSessionDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  
  let dStr = dateStr;
  const today = new Date();
  
  if (dStr.toLowerCase() === 'today') {
    dStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  } else if (dStr.toLowerCase() === 'tomorrow') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
  }

  const dateString = timeStr ? `${dStr} ${timeStr}` : dStr;
  const parsed = new Date(dateString);
  
  if (!isNaN(parsed.getTime())) return parsed;
  return null;
}

export default function FacilitatorOverview({ info, programs = [], learners = [], announcements = [], onNavigate, addNotification, onSelectSession }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const { allSessions, todaySessions, nextSession, recentUpdates, orgAnnouncements, resourcesShared } = useMemo(() => {
    const sessions = [];
    let resCount = 0;
    programs.forEach(p => {
      resCount += (p.resources || []).length;
      (p.sessions || []).forEach(s => {
        resCount += (s.resources || []).length;
        sessions.push({ ...s, programName: p.name, programId: p.id, programResources: p.resources || [] });
      });
    });

    sessions.sort((a, b) => {
      const da = parseSessionDateTime(a.date, a.time) || new Date(9999, 11, 31);
      const db = parseSessionDateTime(b.date, b.time) || new Date(9999, 11, 31);
      return da - db;
    });

    const todaySess = sessions.filter(s => {
      const sDate = parseSessionDateTime(s.date, s.time);
      if (!sDate) return false;
      return sDate.toDateString() === now.toDateString();
    });

    const upcoming = sessions.filter(s => s.status !== 'Completed' && s.status !== 'Processing');
    const focusSess = upcoming[0] || null;

    // Derived updates from announcements
    const updates = [];
    const orgs = [];
    (announcements || []).forEach(a => {
      const textLower = (a.title || a.text || '').toLowerCase();
      if (textLower.includes('organization') || (a.type || '').toLowerCase() === 'organization announcement') {
        orgs.push(a);
      } else {
        updates.push(a);
      }
    });

    return {
      allSessions: sessions,
      todaySessions: todaySess,
      nextSession: focusSess,
      recentUpdates: updates.slice(0, 6),
      orgAnnouncements: orgs,
      resourcesShared: resCount
    };
  }, [programs, announcements, now]);

  const getHeroStatusText = () => {
    if (!nextSession) return 'No sessions are scheduled today.';
    const sDate = parseSessionDateTime(nextSession.date, nextSession.time);
    if (!sDate) return 'Your next session is scheduled.';
    
    const diffMs = sDate - now;
    if (diffMs <= 0) return 'Your session is ready to start.';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) return `Your next session starts tomorrow at ${nextSession.time}.`;
    if (diffDays > 1) return `Your next session starts in ${diffDays} days.`;
    if (diffHours >= 1) return `Your next session starts in ${diffHours} hours.`;
    return `Your next session starts in ${diffMins} minutes.`;
  };

  const getSessionLearnersCount = (session) => {
    if (!session) return 0;
    return learners.filter(l => l.program === session.programName).length;
  };

  const hasSessionResources = (session) => {
    if (!session) return false;
    const progRes = session.programResources || [];
    const sessRes = session.resources || [];
    return progRes.length > 0 || sessRes.length > 0;
  };

  const isStartingSoon = (session) => {
    if (!session) return false;
    const sDate = parseSessionDateTime(session.date, session.time);
    if (!sDate) return false;
    const diffMins = Math.floor((sDate - now) / 60000);
    return diffMins >= 0 && diffMins <= 30;
  };

  // Styles based on Theme variables
  const theme = {
    bg: '#0B0B0F',
    card: '#121318',
    border: '#23242B',
    accent: '#F5C84C',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    font: "'Inter', sans-serif"
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: theme.bg, minHeight: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left', fontFamily: theme.font }}>
      
      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Column (Main Content) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Hero */}
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              {greeting()}, {info.name || info.fullName || 'John'} 👋
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 400 }}>
              {todaySessions.length > 0 ? `You're facilitating ${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} today. ` : ''}
              {getHeroStatusText()}
            </div>
          </div>

          {/* Primary Card: Next Session */}
          {nextSession ? (
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: nextSession.status === 'Live' ? 'rgba(239,68,68,0.1)' : 'rgba(245,200,76,0.1)', color: nextSession.status === 'Live' ? theme.danger : theme.accent, padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {nextSession.status === 'Live' ? 'Live Now' : 'Next Session'}
                </span>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                  {nextSession.title}
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem', fontWeight: 500 }}>
                  {nextSession.programName}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Time</span>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} color={theme.accent}/> {nextSession.time}</span>
                </div>
                {nextSession.duration && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</span>
                    <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{nextSession.duration}</span>
                  </div>
                )}
                {nextSession.deliveryMode && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Mode</span>
                    <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{nextSession.deliveryMode}</span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Enrolled</span>
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={14}/> {getSessionLearnersCount(nextSession)} Learners</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => onSelectSession && onSelectSession(nextSession)}
                  style={{ flex: 1, padding: '0.85rem', backgroundColor: theme.accent, border: 'none', color: '#000', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Play size={18} fill="#000" /> Enter Classroom
                </button>
                <button 
                  onClick={() => {
                     onSelectSession && onSelectSession(nextSession);
                     addNotification("Opened Session Brief");
                  }}
                  style={{ flex: 1, padding: '0.85rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: '#fff', borderRadius: '8px', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  View Session Brief
                </button>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Calendar size={32} color="rgba(255,255,255,0.2)" />
              <div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>No Upcoming Sessions</div>
                <div style={{ fontSize: '0.9rem' }}>You're all caught up. Enjoy your day!</div>
              </div>
            </div>
          )}

          {/* Today's Schedule Timeline */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> Today's Schedule
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {todaySessions.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', padding: '1rem', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                  Nothing scheduled for today.
                </div>
              ) : (
                todaySessions.map((s, idx) => (
                  <div key={s.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: idx === todaySessions.length - 1 ? '0' : '1.5rem' }}>
                    {/* Timeline Line */}
                    {idx !== todaySessions.length - 1 && (
                      <div style={{ position: 'absolute', left: '60px', top: '24px', bottom: '-8px', width: '2px', backgroundColor: theme.border }}></div>
                    )}
                    
                    <div style={{ width: '50px', fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', paddingTop: '0.25rem', textAlign: 'right' }}>
                      {(s.time || '').replace(/ AM| PM/g, '')}
                    </div>
                    
                    <div style={{ flex: 1, backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{s.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{s.programName}</span>
                          {s.status === 'Live' && <span style={{ fontSize: '0.7rem', color: theme.danger, fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.danger }}></span> Live</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => onSelectSession && onSelectSession(s)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: '#fff', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} /> Recent Activity
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentUpdates.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', padding: '1rem', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                  No recent operational activity.
                </div>
              ) : (
                recentUpdates.map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                    <CheckCircle2 size={16} color={theme.success} />
                    <div style={{ flex: 1, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                      {u.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Today's Snapshot */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Today's Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Sessions Today</span>
                <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>{todaySessions.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Learners Today</span>
                <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>
                  {todaySessions.reduce((acc, s) => acc + getSessionLearnersCount(s), 0)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Resources Shared</span>
                <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>{resourcesShared}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Pending Tasks</span>
                <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>2</span>
              </div>
            </div>
          </div>

          {/* Session Readiness */}
          {nextSession && (
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Session Readiness</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: getSessionLearnersCount(nextSession) > 0 ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  <CheckCircle2 size={16} color={getSessionLearnersCount(nextSession) > 0 ? theme.success : 'rgba(255,255,255,0.2)'} /> 
                  Learners enrolled
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: hasSessionResources(nextSession) ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  <CheckCircle2 size={16} color={hasSessionResources(nextSession) ? theme.success : 'rgba(255,255,255,0.2)'} /> 
                  Resources available
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#fff' }}>
                  <CheckCircle2 size={16} color={theme.success} /> 
                  Session scheduled
                </div>
                {isStartingSoon(nextSession) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: theme.warning }}>
                    <AlertTriangle size={16} color={theme.warning} /> 
                    Session starts soon
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button onClick={() => onNavigate('Sessions')} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '1rem', color: '#fff', fontSize: '0.85rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
                <Calendar size={18} /> Open Sessions
              </button>
              <button onClick={() => onNavigate('Resources')} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '1rem', color: '#fff', fontSize: '0.85rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
                <BookOpen size={18} /> Resources
              </button>
              <button onClick={() => onNavigate('Announcements')} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '1rem', color: '#fff', fontSize: '0.85rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
                <MessageSquare size={18} /> Announcements
              </button>
              <button onClick={() => onNavigate('Profile')} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '1rem', color: '#fff', fontSize: '0.85rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
                <User size={18} /> Profile
              </button>
            </div>
          </div>

          {/* Organization Updates */}
          {orgAnnouncements.length > 0 && (
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Organization Updates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {orgAnnouncements.map((a, i) => (
                  <div key={i} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                    {a.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Need Help Footer */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.85rem' }}>
              <HelpCircle size={14} /> Need Help?
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Contact Admin</span>
              <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Report Issue</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
