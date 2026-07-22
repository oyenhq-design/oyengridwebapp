import React, { useState, useEffect, useMemo } from 'react';
import { Play, Calendar, FileText, HelpCircle, Activity, ChevronRight, User, CheckCircle2, AlertTriangle, MessageSquare, BookOpen, Clock, Users, ArrowRight, Bell, Video } from 'lucide-react';

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
    // Update every second for the live countdown
    const timer = setInterval(() => setNow(new Date()), 1000);
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
  }, [programs, announcements, now.getMinutes()]); // Update memos once a minute

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

  // Live Countdown logic
  const getCountdownString = (targetDate) => {
    const diff = targetDate - now;
    if (diff <= 0) return "00 : 00 : 00";
    
    const h = Math.floor((diff / (1000 * 60 * 60)));
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  let nextSessionDate = null;
  let nextSessionDiff = 0;
  if (nextSession) {
    nextSessionDate = parseSessionDateTime(nextSession.date, nextSession.time);
    nextSessionDiff = nextSessionDate ? nextSessionDate - now : 0;
  }

  // Styles based on Theme variables
  const theme = {
    bg: '#0B0B0F',
    card: '#121318',
    cardLighter: '#1A1B23',
    border: '#23242B',
    accent: '#F5C84C',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#a855f7',
    teal: '#14b8a6',
    font: "'Inter', sans-serif"
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: theme.bg, minHeight: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left', fontFamily: theme.font, position: 'relative', overflow: 'hidden' }}>
      
      {/* Abstract Background SVG (Fixed, extremely low opacity) */}
      <svg style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '100%', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
        </pattern>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
      
      {/* Focus Area: Hero + Next Session Combined */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Dynamic Hero Text above the card */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            {greeting()}, {info.name || info.fullName || 'John'} 👋
          </h2>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', marginTop: '0.25rem', fontWeight: 400 }}>
            {nextSession && nextSessionDiff > 0 
              ? `Your next session starts in ${Math.floor(nextSessionDiff/60000)} minutes.`
              : todaySessions.length > 0 
                ? `You have ${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} today.`
                : 'Your schedule is clear for today.'
            }
          </div>
        </div>

        {/* Massive Premium Next Session Card */}
        {nextSession ? (
          <div style={{ position: 'relative', background: 'linear-gradient(145deg, #111114 0%, #0B0B0F 100%)', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${theme.accent}`, borderRadius: '16px', padding: '0', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            
            {/* Gold Glow behind card content */}
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '50%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(245,200,76,0.04) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }}></div>

            <div style={{ display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {/* Left Side: Session Details */}
              <div style={{ flex: 2, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: nextSession.status === 'Live' || nextSessionDiff <= 0 ? 'rgba(239,68,68,0.1)' : 'rgba(245,200,76,0.1)', color: nextSession.status === 'Live' || nextSessionDiff <= 0 ? theme.danger : theme.accent, padding: '0.35rem 0.85rem', borderRadius: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {nextSession.status === 'Live' || nextSessionDiff <= 0 ? 'Live Now' : 'Next Session'}
                  </span>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {nextSession.title}
                  </h3>
                  <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontWeight: 500 }}>
                    {nextSession.programName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar size={18} color={theme.accent} />
                    <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{nextSession.date === 'Today' ? 'Today' : nextSession.date} • {nextSession.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Users size={18} color={theme.success} />
                    <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{getSessionLearnersCount(nextSession)} Learners</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={18} color={hasSessionResources(nextSession) ? theme.info : 'rgba(255,255,255,0.3)'} />
                    <span style={{ fontSize: '0.95rem', color: hasSessionResources(nextSession) ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{hasSessionResources(nextSession) ? 'Resources Ready' : 'No Resources'}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Live Countdown Strip & CTA */}
              <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderLeft: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2.5rem', gap: '1.5rem', minWidth: '250px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    {nextSessionDiff > 0 ? 'Starts In' : 'Started'}
                  </div>
                  <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums' }}>
                    {nextSessionDate ? getCountdownString(nextSessionDate) : '00 : 00 : 00'}
                  </div>
                </div>
                
                <button 
                  onClick={() => onSelectSession && onSelectSession(nextSession)}
                  style={{ width: '100%', padding: '1.1rem', backgroundColor: '#fff', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,255,255,0.1)'; }}
                >
                  Enter Classroom <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(145deg, #111114 0%, #0B0B0F 100%)', border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={32} color="rgba(255,255,255,0.3)" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>No Upcoming Sessions</div>
              <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' }}>You're all caught up. Enjoy your day!</div>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Grid for the rest of the Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        
        {/* Left Column (Schedule & Activity) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Today's Schedule */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Today's Schedule</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todaySessions.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', padding: '1.5rem', backgroundColor: theme.card, border: `1px dashed ${theme.border}`, borderRadius: '12px', textAlign: 'center' }}>
                  Nothing scheduled for today.
                </div>
              ) : (
                todaySessions.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem 1.5rem', gap: '1.5rem', transition: 'border-color 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}>
                    <div style={{ width: '85px', fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
                      {(s.time || '').replace(/ AM| PM/g, '')} <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{(s.time || '').slice(-2)}</span>
                    </div>
                    
                    <div style={{ width: '4px', height: '40px', borderRadius: '4px', backgroundColor: s.status === 'Live' ? theme.danger : theme.accent }}></div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600 }}>{s.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        <span>{s.programName}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {getSessionLearnersCount(s)} Learners</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onSelectSession && onSelectSession(s)}
                      style={{ padding: '0.6rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.04)', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                    >
                      Open <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions (List style) */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 1.25rem 0' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div 
                onClick={() => nextSession ? (onSelectSession && onSelectSession(nextSession)) : addNotification("No session scheduled.")}
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.cardLighter} onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.card}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={20} color={theme.danger} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>Open Classroom</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>Go to your next live class</div>
                </div>
                <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
              </div>

              <div 
                onClick={() => onNavigate('Resources')}
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.cardLighter} onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.card}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} color={theme.info} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>Resources</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>View teaching materials</div>
                </div>
                <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
              </div>

              <div 
                onClick={() => onNavigate('Announcements')}
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.cardLighter} onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.card}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={20} color={theme.purple} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>Updates</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>See organization updates</div>
                </div>
                <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Snapshot KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: theme.cardLighter, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Calendar size={16} color={theme.accent} />
              <div>
                <div style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>{todaySessions.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Today's Sessions</div>
              </div>
            </div>
            <div style={{ backgroundColor: theme.cardLighter, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Users size={16} color={theme.success} />
              <div>
                <div style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>{todaySessions.reduce((acc, s) => acc + getSessionLearnersCount(s), 0)}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Learners</div>
              </div>
            </div>
            <div style={{ backgroundColor: theme.cardLighter, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <FileText size={16} color={theme.info} />
              <div>
                <div style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>{resourcesShared}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Resources</div>
              </div>
            </div>
            <div style={{ backgroundColor: theme.cardLighter, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <AlertTriangle size={16} color={theme.warning} />
              <div>
                <div style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>0</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Pending</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Recent Activity</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentUpdates.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2rem' }}>📬</div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>No new updates</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>Everything is up to date.</div>
                  </div>
                </div>
              ) : (
                recentUpdates.map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.info, marginTop: '0.35rem' }}></div>
                    <div style={{ flex: 1, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                      {u.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
