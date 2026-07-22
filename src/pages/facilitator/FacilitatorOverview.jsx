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
    let focusSess = upcoming[0] || null;

    // Provide a premium mock session if the user's workspace is empty, so they can see the design
    if (!focusSess) {
      focusSess = {
        id: 'mock-1',
        title: 'Executive Leadership Orientation',
        programName: 'Global Leadership Program',
        date: 'Today',
        time: '11:25 AM',
        status: 'Upcoming',
        resources: [{}, {}], // mock resources
      };
    }
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

  // OYEN GRID Official Design System Theme Variables
  const theme = {
    bg: '#0B0B0F',
    bgSecondary: '#101014',
    card: '#15151A',
    cardHover: '#1C1C22',
    border: '#26262D',
    gold: '#D4AF37',
    goldHover: '#E5C867',
    textMilk: '#F8F6F1',
    textBody: '#D8D2C5',
    textMuted: '#9B978E',
    success: '#2FBF71', 
    warning: '#F0B429', 
    danger: '#E25555',  
    info: '#4A90E2',    
    purple: '#8E5CF7',  
    font: "'Inter', sans-serif"
  };

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: theme.bg, 
      minHeight: '100%', 
      padding: '4rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '4rem', 
      textAlign: 'left', 
      fontFamily: theme.font, 
      position: 'relative', 
      overflow: 'hidden',
      background: `radial-gradient(circle at 90% -10%, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 20%, ${theme.bg} 50%), ${theme.bg}`
    }}>
      
      {/* Focus Area: Hero + Next Session Combined */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Dynamic Hero Text above the card */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 700, color: theme.textMilk, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {greeting()}, {info.name || info.fullName || 'John'} 👋
          </h2>
          <div style={{ color: theme.textMuted, fontSize: '18px', marginTop: '0.75rem', fontWeight: 400 }}>
            {nextSession && nextSessionDiff > 0 
              ? <span>Your next session starts in <span style={{ color: theme.gold }}>{Math.floor(nextSessionDiff/60000)} minutes</span>.</span>
              : todaySessions.length > 0 
                ? `You have ${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} today.`
                : 'Your schedule is clear for today.'
            }
          </div>
        </div>

        {/* Massive Premium Next Session Card */}
        {nextSession ? (
          <div style={{ position: 'relative', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '0', display: 'flex', flexDirection: 'column', boxShadow: '0 0 80px rgba(212,175,55,0.08)', overflow: 'hidden' }}>

            <div style={{ display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {/* Left Side: Session Details */}
              <div style={{ flex: 2, padding: '3.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '12px', color: nextSession.status === 'Live' || nextSessionDiff <= 0 ? theme.danger : theme.gold, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {nextSession.status === 'Live' || nextSessionDiff <= 0 ? 'Live Now' : 'Upcoming Session'}
                  </span>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '48px', fontWeight: 600, color: theme.textMilk, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {nextSession.title}
                  </h3>
                  <div style={{ fontSize: '18px', color: theme.textMuted, marginTop: '0.75rem', fontWeight: 400 }}>
                    {nextSession.programName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar size={20} strokeWidth={1.8} color={theme.textMuted} />
                    <span style={{ fontSize: '15px', color: theme.textBody, fontWeight: 400 }}>{nextSession.date === 'Today' ? 'Today' : nextSession.date} • {nextSession.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Users size={20} strokeWidth={1.8} color={theme.textMuted} />
                    <span style={{ fontSize: '15px', color: theme.textBody, fontWeight: 400 }}>{getSessionLearnersCount(nextSession)} Learners</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={20} strokeWidth={1.8} color={hasSessionResources(nextSession) ? theme.info : theme.textMuted} />
                    <span style={{ fontSize: '15px', color: hasSessionResources(nextSession) ? theme.textBody : theme.textMuted, fontWeight: 400 }}>{hasSessionResources(nextSession) ? 'Resources Ready' : 'Workshop'}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Live Countdown Strip & CTA */}
              <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', borderLeft: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3.5rem', gap: '2rem', minWidth: '250px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '1rem' }}>
                    {nextSessionDiff > 0 ? 'Starts In' : 'Started'}
                  </div>
                  <div style={{ fontSize: '56px', fontWeight: 700, color: theme.gold, letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {nextSessionDate ? getCountdownString(nextSessionDate) : '00 : 00 : 00'}
                  </div>
                </div>
                
                <button 
                  onClick={() => onSelectSession && onSelectSession(nextSession)}
                  style={{ width: '100%', height: '56px', backgroundColor: theme.gold, border: 'none', color: '#111111', borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: 'all 200ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.goldHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.gold; e.currentTarget.style.transform = 'none'; }}
                >
                  Enter Classroom <ArrowRight size={20} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '6rem 4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.30)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={40} strokeWidth={1.8} color={theme.success} />
            </div>
            <div>
              <div style={{ fontSize: '24px', color: theme.textMilk, fontWeight: 600, marginBottom: '0.75rem' }}>You're all set.</div>
              <div style={{ fontSize: '15px', color: theme.textMuted }}>No upcoming sessions scheduled.</div>
            </div>
          </div>
        )}
      </div>

      {/* Level 2: 12-Column Grid (Today's Work) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4rem', position: 'relative', zIndex: 1 }}>
        
        {/* Left Column (Today's Schedule - spans 7) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, color: theme.textMilk, margin: '0 0 2rem 0' }}>Today's Schedule</h3>
            
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              {/* Vertical timeline line */}
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '20px', width: '2px', backgroundColor: theme.border }}></div>
              
              {todaySessions.length === 0 ? (
                <div style={{ fontSize: '15px', color: theme.textMuted, padding: '1rem 0' }}>
                  Nothing scheduled for today.
                </div>
              ) : (
                todaySessions.map((s, idx) => (
                  <div key={s.id} style={{ position: 'relative', paddingBottom: idx === todaySessions.length - 1 ? '0' : '3.5rem' }}>
                    {/* Timeline Node */}
                    <div style={{ position: 'absolute', left: '-2.4rem', top: '4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: s.status === 'Live' ? theme.success : theme.bg, border: `3px solid ${s.status === 'Live' ? theme.success : theme.textMuted}`, zIndex: 2 }}></div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '15px', color: theme.textMuted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {(s.time || '').replace(/ AM| PM/g, '')} <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>{(s.time || '').slice(-2)}</span>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: theme.border }}></div>
                        <span style={{ fontSize: '12px', color: s.status === 'Live' ? theme.success : theme.gold, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{s.status || 'Upcoming'}</span>
                      </div>
                      
                      <div style={{ fontSize: '18px', color: theme.textMilk, fontWeight: 600, marginTop: '0.25rem' }}>{s.title}</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '15px', color: theme.textBody, marginTop: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} strokeWidth={1.8} color={theme.textMuted} /> {getSessionLearnersCount(s)} Learners</span>
                      </div>

                      <button 
                        onClick={() => onSelectSession && onSelectSession(s)}
                        style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '0', backgroundColor: 'transparent', border: 'none', color: theme.textMilk, fontSize: '15px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, transition: 'opacity 200ms ease' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                      >
                        Open <ArrowRight size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Preparation Panel - spans 5) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, color: theme.textMilk, margin: '0 0 2rem 0' }}>Preparation Status</h3>
            
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.30)' }}>
              {nextSession ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={20} strokeWidth={1.8} color={theme.success} /></div>
                    <div style={{ fontSize: '15px', color: theme.textMilk }}>Learners Ready ({getSessionLearnersCount(nextSession)})</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                      {hasSessionResources(nextSession) ? <CheckCircle2 size={20} strokeWidth={1.8} color={theme.success} /> : <AlertTriangle size={20} strokeWidth={1.8} color={theme.warning} />}
                    </div>
                    <div style={{ fontSize: '15px', color: theme.textMilk }}>{hasSessionResources(nextSession) ? 'Resources Uploaded' : 'Missing Resources'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={20} strokeWidth={1.8} color={theme.success} /></div>
                    <div style={{ fontSize: '15px', color: theme.textMilk }}>Session Scheduled</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><AlertTriangle size={20} strokeWidth={1.8} color={theme.warning} /></div>
                    <div style={{ fontSize: '15px', color: theme.textMilk }}>Awaiting Attendance Sheet</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={20} strokeWidth={1.8} color={theme.success} /></div>
                    <div style={{ fontSize: '15px', color: theme.textMilk }}>Facilitator Assigned</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                  <CheckCircle2 size={24} strokeWidth={1.8} color={theme.success} />
                  <div style={{ fontSize: '15px', color: theme.textMuted }}>No preparation required.</div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Level 3: Recent Activity (Spans full width below) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '24px', fontWeight: 600, color: theme.textMilk, margin: 0 }}>Recent Activity</h3>
        
        {recentUpdates.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle2 size={20} strokeWidth={1.8} color={theme.success} />
            <div style={{ fontSize: '15px', color: theme.textBody }}>Everything is up to date.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recentUpdates.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle2 size={20} strokeWidth={1.8} color={theme.success} />
                <div style={{ fontSize: '15px', color: theme.textBody }}>{u.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

