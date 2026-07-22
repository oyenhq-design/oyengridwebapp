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
    <div className="animate-fade-in" style={{ backgroundColor: theme.bg, minHeight: '100%', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '3rem', textAlign: 'left', fontFamily: theme.font, position: 'relative', overflow: 'hidden' }}>
      
      {/* Abstract Background SVG (Fixed, extremely low opacity grid) */}
      <svg style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '100%', opacity: 0.02, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
        </pattern>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
      
      {/* Focus Area: Hero + Next Session Combined */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Dynamic Hero Text above the card */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 700, color: theme.textMilk, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {greeting()}, {info.name || info.fullName || 'John'} 👋
          </h2>
          <div style={{ color: theme.textMuted, fontSize: '18px', marginTop: '0.5rem', fontWeight: 400 }}>
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
          <div style={{ position: 'relative', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '0', display: 'flex', flexDirection: 'column', boxShadow: '0 0 80px rgba(212,175,55,0.08), 0 10px 40px rgba(0,0,0,0.30)', overflow: 'hidden' }}>

            <div style={{ display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {/* Left Side: Session Details */}
              <div style={{ flex: 2, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '12px', color: nextSession.status === 'Live' || nextSessionDiff <= 0 ? theme.danger : theme.gold, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {nextSession.status === 'Live' || nextSessionDiff <= 0 ? 'Live Now' : 'Upcoming Session'}
                  </span>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, color: theme.textMilk, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    {nextSession.title}
                  </h3>
                  <div style={{ fontSize: '15px', color: theme.textMuted, marginTop: '0.5rem', fontWeight: 400 }}>
                    {nextSession.programName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar size={18} strokeWidth={1.8} color={theme.textMuted} />
                    <span style={{ fontSize: '15px', color: theme.textBody, fontWeight: 400 }}>{nextSession.date === 'Today' ? 'Today' : nextSession.date} • {nextSession.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Users size={18} strokeWidth={1.8} color={theme.textMuted} />
                    <span style={{ fontSize: '15px', color: theme.textBody, fontWeight: 400 }}>{getSessionLearnersCount(nextSession)} Learners</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={18} strokeWidth={1.8} color={hasSessionResources(nextSession) ? theme.info : theme.textMuted} />
                    <span style={{ fontSize: '15px', color: hasSessionResources(nextSession) ? theme.textBody : theme.textMuted, fontWeight: 400 }}>{hasSessionResources(nextSession) ? 'Resources Ready' : 'No Resources'}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Live Countdown Strip & CTA */}
              <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', borderLeft: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem', gap: '1.5rem', minWidth: '250px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    {nextSessionDiff > 0 ? 'Starts In' : 'Started'}
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: 700, color: theme.gold, letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {nextSessionDate ? getCountdownString(nextSessionDate) : '00 : 00 : 00'}
                  </div>
                </div>
                
                <button 
                  onClick={() => onSelectSession && onSelectSession(nextSession)}
                  style={{ width: '100%', height: '48px', backgroundColor: theme.gold, border: 'none', color: '#111111', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: 'all 200ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.goldHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.gold; e.currentTarget.style.transform = 'none'; }}
                >
                  Enter Classroom <ArrowRight size={18} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.30)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={32} strokeWidth={1.8} color={theme.textMuted} />
            </div>
            <div>
              <div style={{ fontSize: '24px', color: theme.textMilk, fontWeight: 600, marginBottom: '0.5rem' }}>No Upcoming Sessions</div>
              <div style={{ fontSize: '15px', color: theme.textMuted }}>You're all caught up. Enjoy your day!</div>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Grid for the rest of the Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        
        {/* Left Column (Schedule & Activity) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Today's Schedule */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 600, color: theme.textMilk, margin: 0 }}>Today's Schedule</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {todaySessions.length === 0 ? (
                <div style={{ fontSize: '15px', color: theme.textMuted, padding: '2rem', backgroundColor: theme.card, border: `1px dashed ${theme.border}`, borderRadius: '20px', textAlign: 'center' }}>
                  Nothing scheduled for today.
                </div>
              ) : (
                todaySessions.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', gap: '1.5rem', transition: 'all 200ms ease', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.cardHover; e.currentTarget.style.transform = 'translateY(-2px)'}} onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.card; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ width: '85px', fontSize: '15px', fontWeight: 600, color: theme.textMilk }}>
                      {(s.time || '').replace(/ AM| PM/g, '')} <span style={{ fontSize: '12px', color: theme.textMuted }}>{(s.time || '').slice(-2)}</span>
                    </div>
                    
                    <div style={{ width: '4px', height: '40px', borderRadius: '4px', backgroundColor: s.status === 'Live' ? theme.success : theme.textMuted }}></div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontSize: '18px', color: theme.textMilk, fontWeight: 600 }}>{s.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '15px', color: theme.textMuted }}>
                        <span>{s.programName}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} strokeWidth={1.8} /> {getSessionLearnersCount(s)} Learners</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onSelectSession && onSelectSession(s)}
                      style={{ height: '40px', padding: '0 1.5rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.textBody, borderRadius: '8px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 200ms ease' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bgSecondary}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Open <ArrowRight size={16} strokeWidth={1.8} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions (List style) */}
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, color: theme.textMilk, margin: '0 0 1.5rem 0' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div 
                onClick={() => nextSession ? (onSelectSession && onSelectSession(nextSession)) : addNotification("No session scheduled.")}
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 200ms ease', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.cardHover; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.card; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={20} strokeWidth={1.8} color={theme.textBody} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: theme.textMilk }}>Open Classroom</div>
                  <div style={{ fontSize: '15px', color: theme.textMuted, marginTop: '0.2rem' }}>Go to your next live class</div>
                </div>
                <ArrowRight size={18} strokeWidth={1.8} color={theme.textMuted} />
              </div>

              <div 
                onClick={() => onNavigate('Resources')}
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 200ms ease', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.cardHover; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.card; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} strokeWidth={1.8} color={theme.info} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: theme.textMilk }}>Resources</div>
                  <div style={{ fontSize: '15px', color: theme.textMuted, marginTop: '0.2rem' }}>View teaching materials</div>
                </div>
                <ArrowRight size={18} strokeWidth={1.8} color={theme.textMuted} />
              </div>

              <div 
                onClick={() => onNavigate('Announcements')}
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 200ms ease', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.cardHover; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.card; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={20} strokeWidth={1.8} color={theme.purple} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: theme.textMilk }}>Updates</div>
                  <div style={{ fontSize: '15px', color: theme.textMuted, marginTop: '0.2rem' }}>See organization updates</div>
                </div>
                <ArrowRight size={18} strokeWidth={1.8} color={theme.textMuted} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Snapshot KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
              <Calendar size={20} strokeWidth={1.8} color={theme.textMuted} />
              <div>
                <div style={{ fontSize: '24px', color: theme.textMilk, fontWeight: 600 }}>{todaySessions.length}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Today's Sessions</div>
              </div>
            </div>
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
              <Users size={20} strokeWidth={1.8} color={theme.textMuted} />
              <div>
                <div style={{ fontSize: '24px', color: theme.textMilk, fontWeight: 600 }}>{todaySessions.reduce((acc, s) => acc + getSessionLearnersCount(s), 0)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Learners</div>
              </div>
            </div>
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
              <FileText size={20} strokeWidth={1.8} color={theme.info} />
              <div>
                <div style={{ fontSize: '24px', color: theme.textMilk, fontWeight: 600 }}>{resourcesShared}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Resources</div>
              </div>
            </div>
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
              <AlertTriangle size={20} strokeWidth={1.8} color={theme.danger} />
              <div>
                <div style={{ fontSize: '24px', color: theme.textMilk, fontWeight: 600 }}>0</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Pending</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: theme.textMilk, margin: 0 }}>Recent Activity</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentUpdates.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '24px' }}>📬</div>
                  <div>
                    <div style={{ fontSize: '15px', color: theme.textBody, fontWeight: 400 }}>No new updates</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '0.25rem' }}>Everything is up to date.</div>
                  </div>
                </div>
              ) : (
                recentUpdates.map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.textMuted, marginTop: '0.35rem' }}></div>
                    <div style={{ flex: 1, fontSize: '15px', color: theme.textBody, lineHeight: 1.4 }}>
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

