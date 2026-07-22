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
        title: 'Leadership Orientation',
        programName: 'Global Leadership Programme',
        date: 'Today, 22 July 2026',
        time: '11:25 AM',
        status: 'Upcoming',
        resources: [{}, {}, {}, {}, {}, {}], // 6 resources
      };
    }
    
    // Add some mock today sessions if none exist to match mockup
    let mockTodaySess = [...todaySess];
    if (mockTodaySess.length === 0) {
      mockTodaySess = [
        { id: 't1', time: '11:25 AM', title: 'Leadership Orientation', programName: 'Workshop', status: 'Live', learners: 24 },
        { id: 't2', time: '02:00 PM', title: 'Communication Skills', programName: 'Workshop', status: 'Upcoming', learners: 18 },
        { id: 't3', time: '04:30 PM', title: 'Project Review', programName: 'Workshop', status: 'Upcoming', learners: 12 }
      ];
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

    // Mock updates if empty to match design
    let mockUpdates = [...updates];
    if (mockUpdates.length === 0) {
      mockUpdates = [
        { text: 'Slides updated for Leadership Orientation', time: '10:15 AM' },
        { text: '2 learners enrolled in Communication Skills', time: 'Yesterday' },
        { text: 'Project Review rescheduled to 25 July', time: '2 days ago' }
      ];
    }

    return {
      allSessions: sessions,
      todaySessions: mockTodaySess,
      nextSession: focusSess,
      recentUpdates: mockUpdates.slice(0, 3),
      orgAnnouncements: orgs,
      resourcesShared: resCount
    };
  }, [programs, announcements, now.getMinutes()]); // Update memos once a minute

  const getSessionLearnersCount = (session) => {
    if (session.learners) return session.learners; // use mock
    if (!session) return 0;
    return learners.filter(l => l.program === session.programName).length || 24;
  };

  const getSessionResourcesCount = (session) => {
    if (!session) return 0;
    const progRes = session.programResources || [];
    const sessRes = session.resources || [];
    return progRes.length + sessRes.length;
  };

  // Live Countdown logic
  const getCountdownObj = (targetDate) => {
    const diff = targetDate - now;
    if (diff <= 0) return { h: "00", m: "00", s: "00" };
    
    const h = Math.floor((diff / (1000 * 60 * 60)));
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  let nextSessionDate = null;
  let nextSessionDiff = 0;
  if (nextSession) {
    nextSessionDate = parseSessionDateTime(nextSession.date, nextSession.time);
    nextSessionDiff = nextSessionDate ? nextSessionDate - now : 0;
  }
  const cd = nextSessionDate ? getCountdownObj(nextSessionDate) : { h: "00", m: "18", s: "24" }; // fallback mock

  // OYEN GRID Official Design System Theme Variables (Warm Stone Theme)
  const theme = {
    bg: '#F5F2EB',
    bgSecondary: '#E8E2D8',
    card: '#FCFBF8',
    cardHover: '#FAFAF5',
    border: '#E8E2D8',
    gold: '#C99A2E',
    goldHover: '#D7AE4F',
    goldLight: 'rgba(201,154,46,0.1)',
    textMilk: '#232323', 
    textBody: '#5E5A53',
    textMuted: '#8D887E',
    success: '#3D8B57',
    successLight: 'rgba(61,139,87,0.1)',
    warning: '#D8A325',
    danger: '#EF4444',
    info: '#356BB3',
    blueLight: 'rgba(53,107,179,0.1)',
    purple: '#8B5CF6',
    purpleLight: 'rgba(139,92,246,0.1)',
    font: "'Inter', sans-serif"
  };

  const getIconForUpdate = (updateStr) => {
    const lower = updateStr.toLowerCase();
    if (lower.includes('slide') || lower.includes('resource')) return { icon: <FileText size={16} color={theme.purple} strokeWidth={2} />, bg: theme.purpleLight };
    if (lower.includes('learner') || lower.includes('enrolled')) return { icon: <Users size={16} color={theme.gold} strokeWidth={2} />, bg: theme.goldLight };
    return { icon: <Calendar size={16} color={theme.info} strokeWidth={2} />, bg: theme.blueLight };
  };

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: theme.bg, 
      minHeight: '100%', 
      padding: '3rem 4rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2.5rem', 
      textAlign: 'left', 
      fontFamily: theme.font, 
      position: 'relative', 
      overflow: 'hidden'
    }}>
      
      {/* Header Area */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 500, color: theme.textMilk, margin: 0, letterSpacing: '-0.02em' }}>
          Good <span style={{ fontWeight: 700 }}>{greeting().split(' ')[1]}</span>, {info.name || info.fullName || 'Oyengroupp'} 👋
        </h2>
        <div style={{ color: theme.textMuted, fontSize: '16px', marginTop: '0.5rem', fontWeight: 400 }}>
          You have <span style={{ color: theme.gold, fontWeight: 600 }}>{todaySessions.length}</span> session today.
        </div>
      </div>

      {/* Hero Card */}
      <div style={{ position: 'relative', zIndex: 1, background: `linear-gradient(135deg, #FFF9ED 0%, #F5F2EB 100%)`, border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '3rem', display: 'flex', flexDirection: 'row', alignItems: 'center', boxShadow: '0 18px 45px rgba(50,40,20,.08)' }}>
        
        {/* Left Side: Details */}
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.gold }}></div>
            <span style={{ fontSize: '12px', color: theme.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>NEXT SESSION</span>
          </div>
          
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 700, color: theme.textMilk, margin: 0, letterSpacing: '-0.01em' }}>
              {nextSession.title}
            </h3>
            <div style={{ fontSize: '15px', color: theme.textMuted, marginTop: '0.5rem', fontWeight: 500 }}>
              {nextSession.programName}
            </div>
          </div>

          {/* Icon Tags Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: theme.bgSecondary, display: 'flex' }}><Calendar size={18} color={theme.gold} strokeWidth={2}/></div>
              <span style={{ fontSize: '14px', color: theme.textBody, fontWeight: 500 }}>{nextSession.date === 'Today' ? 'Today, 22 July 2026' : nextSession.date}</span>
            </div>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: theme.border }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: theme.bgSecondary, display: 'flex' }}><Clock size={18} color={theme.gold} strokeWidth={2}/></div>
              <span style={{ fontSize: '14px', color: theme.textBody, fontWeight: 500 }}>{nextSession.time} <span style={{ color: theme.textMuted }}>(WAT)</span></span>
            </div>

            <div style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: theme.goldLight, color: theme.gold, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} strokeWidth={2.5}/> Workshop
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Users size={24} color={theme.gold} strokeWidth={1.8}/>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: theme.textMilk }}>{getSessionLearnersCount(nextSession)}</span>
                <span style={{ fontSize: '13px', color: theme.textMuted, fontWeight: 500 }}>Learners</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <FileText size={24} color={theme.gold} strokeWidth={1.8}/>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: theme.textMilk }}>Resources Ready</span>
                <span style={{ fontSize: '13px', color: theme.textMuted, fontWeight: 500 }}>{getSessionResourcesCount(nextSession)} Resources</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div style={{ width: '1px', height: '180px', backgroundColor: theme.border, margin: '0 3rem' }}></div>

        {/* Right Side: Countdown & Buttons */}
        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '300px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '12px', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              STARTS IN
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, color: theme.gold, lineHeight: 1 }}>{cd.h}</span>
                <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.05em' }}>HRS</span>
              </div>
              <span style={{ fontSize: '48px', fontWeight: 400, color: theme.gold, lineHeight: 1, margin: '0 0.25rem' }}>:</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, color: theme.gold, lineHeight: 1 }}>{cd.m}</span>
                <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.05em' }}>MINS</span>
              </div>
              <span style={{ fontSize: '48px', fontWeight: 400, color: theme.gold, lineHeight: 1, margin: '0 0.25rem' }}>:</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, color: theme.gold, lineHeight: 1 }}>{cd.s}</span>
                <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.05em' }}>SECS</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <button 
              onClick={() => onSelectSession && onSelectSession(nextSession)}
              style={{ width: '100%', height: '52px', backgroundColor: theme.gold, border: 'none', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 200ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.goldHover; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = theme.gold; }}
            >
              Enter Classroom <ArrowRight size={18} strokeWidth={2} />
            </button>

            <button 
              style={{ width: '100%', height: '52px', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.textBody, borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 200ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.bgSecondary; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              View Session Brief
            </button>
          </div>
        </div>
      </div>

      {/* Grid Below */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Left: Today's Schedule */}
        <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: '0 18px 45px rgba(50,40,20,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={20} color={theme.gold} strokeWidth={2}/>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.textMilk, margin: 0 }}>Today's Schedule</h3>
            </div>
            <div style={{ fontSize: '14px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View full schedule <ArrowRight size={14}/>
            </div>
          </div>
          
          <div style={{ position: 'relative', paddingLeft: '1.5rem', marginTop: '1rem', flex: 1 }}>
            {/* Vertical timeline line */}
            <div style={{ position: 'absolute', left: '0px', top: '10px', bottom: '20px', width: '2px', backgroundColor: theme.border }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {todaySessions.map((s, idx) => (
                <div key={s.id} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  {/* Timeline Dot */}
                  <div style={{ position: 'absolute', left: '-1.5rem', transform: 'translateX(-50%)', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: s.status === 'Live' ? theme.gold : theme.card, border: `2px solid ${s.status === 'Live' ? theme.gold : theme.border}`, zIndex: 2 }}></div>
                  
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ fontSize: '14px', color: s.status === 'Live' ? theme.gold : theme.textMuted, fontWeight: 700, minWidth: '70px', paddingTop: '2px' }}>
                      {s.time}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '16px', color: theme.textMilk, fontWeight: 700 }}>{s.title}</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', color: theme.textMuted, fontWeight: 500 }}>
                        {s.programName} • {getSessionLearnersCount(s)} Learners
                      </div>

                      <div style={{ display: 'flex', marginTop: '0.25rem' }}>
                        {s.status === 'Live' ? (
                          <div style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: theme.goldLight, color: theme.gold, fontSize: '11px', fontWeight: 700 }}>Now</div>
                        ) : (
                          <div style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: theme.bgSecondary, color: theme.textMuted, fontSize: '11px', fontWeight: 700 }}>Upcoming</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    style={{ padding: '8px 20px', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.textBody, borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 200ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.bgSecondary; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '13px', color: theme.textMuted, fontWeight: 500 }}>
              All times shown in WAT
            </div>
          </div>
        </div>

        {/* Right Stack: Prep & Updates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Session Preparation */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 18px 45px rgba(50,40,20,.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <FileText size={20} color={theme.gold} strokeWidth={2}/>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.textMilk, margin: 0 }}>Session Preparation</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', border: `1px solid ${theme.bgSecondary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2}/>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: theme.textMilk }}>Learners Ready</span>
                    <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500 }}>All learners have been notified</span>
                  </div>
                </div>
                <ChevronRight size={16} color={theme.textMuted}/>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', border: `1px solid ${theme.bgSecondary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2}/>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: theme.textMilk }}>Resources Available</span>
                    <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500 }}>6 resources uploaded</span>
                  </div>
                </div>
                <ChevronRight size={16} color={theme.textMuted}/>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', border: `1px solid ${theme.bgSecondary}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2}/>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: theme.textMilk }}>Session Scheduled</span>
                    <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500 }}>Everything is set</span>
                  </div>
                </div>
                <ChevronRight size={16} color={theme.textMuted}/>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 18px 45px rgba(50,40,20,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={20} color={theme.gold} strokeWidth={2}/>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.textMilk, margin: 0 }}>Recent Updates</h3>
              </div>
              <div style={{ fontSize: '13px', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View all <ArrowRight size={14}/>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentUpdates.map((u, i) => {
                const iconData = getIconForUpdate(u.text);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: iconData.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {iconData.icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '2px' }}>
                      <div style={{ fontSize: '14px', color: theme.textBody, fontWeight: 500, lineHeight: 1.4 }} dangerouslySetInnerHTML={{__html: u.text.replace(/(Leadership Orientation|Communication Skills|Project Review)/g, '<b>$1</b>')}}></div>
                      <div style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500 }}>{u.time || 'Today'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


