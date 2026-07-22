import React, { useState, useEffect, useMemo } from 'react';
import { Play, Calendar, FileText, HelpCircle, Activity, ChevronRight, User, CircleDot } from 'lucide-react';

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

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const greeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const { allSessions, todaySessions, nextSession, recentUpdates, orgAnnouncements } = useMemo(() => {
    const sessions = [];
    programs.forEach(p => {
      (p.sessions || []).forEach(s => {
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
      recentUpdates: updates.slice(0, 4),
      orgAnnouncements: orgs
    };
  }, [programs, announcements, now]);

  const getHeroStatusText = () => {
    if (!nextSession) return 'No sessions are scheduled today.';
    
    if (nextSession.status === 'Live') return 'Your session is Live right now.';
    
    const sDate = parseSessionDateTime(nextSession.date, nextSession.time);
    if (!sDate) return 'Your next session is scheduled.';
    
    const diffMs = sDate - now;
    if (diffMs <= 0) return 'Your session is ready to start.';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) return `Your next session starts Tomorrow at ${nextSession.time}.`;
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

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {formattedDate}
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              {greeting()}, {info.name || 'Facilitator'} 👋
            </h2>
            <p style={{ color: '#F5D76E', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {todaySessions.length > 1 && nextSession ? `You have ${todaySessions.length} sessions scheduled today. ` : ''}
              {getHeroStatusText()}
            </p>
          </div>
        </div>

        {nextSession ? (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.68rem', backgroundColor: nextSession.status === 'Live' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: nextSession.status === 'Live' ? '#ef4444' : '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {nextSession.status === 'Live' && <CircleDot size={10} className="animate-pulse" />} 
                  {nextSession.status || 'Scheduled'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{nextSession.programName}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {nextSession.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>
                <span>{nextSession.date} • {nextSession.time}</span>
                {nextSession.duration && <span>{nextSession.duration}</span>}
                {nextSession.deliveryMode && <span>{nextSession.deliveryMode}</span>}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} /> {getSessionLearnersCount(nextSession)} Learners
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasSessionResources(nextSession) ? '#22c55e' : 'inherit' }}>
                  <FileText size={14} /> {hasSessionResources(nextSession) ? 'Resources Ready' : 'No Resources'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => onSelectSession && onSelectSession(nextSession)}
              style={{ padding: '0.8rem 2rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(245,215,110,0.15)' }}
            >
              <Play size={16} fill="#000" /> Enter Classroom
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            No sessions are currently scheduled. Enjoy your day!
          </div>
        )}
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Today's Schedule */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#F5D76E" /> Today's Schedule
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {todaySessions.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', textAlign: 'center' }}>
                  No sessions scheduled today.
                </div>
              ) : (
                todaySessions.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `3px solid ${s.status === 'Live' ? '#ef4444' : s.status === 'Completed' ? '#22c55e' : 'rgba(255,255,255,0.1)'}` }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', width: '70px' }}>
                      {s.time}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{s.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{s.programName}</div>
                    </div>
                    <button 
                      onClick={() => onSelectSession && onSelectSession(s)}
                      style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Open
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Operational Updates */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} color="#3b82f6" /> Recent Operational Updates
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentUpdates.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', textAlign: 'center' }}>
                  You're all caught up.
                </div>
              ) : (
                recentUpdates.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                    <div style={{ flex: 1, fontSize: '0.85rem', color: '#fff', lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginRight: '0.4rem' }}>{u.type || 'Update'}:</span>
                      {u.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Actions */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => nextSession ? (onSelectSession && onSelectSession(nextSession)) : addNotification("No session scheduled to open.")}
                style={{ width: '100%', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                Open Next Session <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
              </button>
              <button 
                onClick={() => onNavigate('Resources')}
                style={{ width: '100%', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                View Resources <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
              </button>
              <button 
                onClick={() => onNavigate('Sessions')}
                style={{ width: '100%', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                View All Sessions <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
              </button>
            </div>
          </div>

          {/* Organization Announcements (Hidden if Empty) */}
          {orgAnnouncements.length > 0 && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Organization Updates
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orgAnnouncements.map(a => (
                  <div key={a.id} style={{ padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.82rem', color: '#fff', lineHeight: 1.4 }}>
                    <div style={{ fontSize: '0.7rem', color: '#F5D76E', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      {a.date || 'Update'}
                    </div>
                    {a.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Footer */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.85rem' }}>
              <HelpCircle size={14} /> Need help?
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              Contact your Organization Administrator.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
