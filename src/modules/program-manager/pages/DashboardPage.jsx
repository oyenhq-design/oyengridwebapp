import React from 'react';
import { 
  Calendar, FileText, Activity, ChevronRight, User, 
  CheckCircle2, MessageSquare, BookOpen, Clock, Users, 
  ArrowRight, Bell, AlertTriangle, UserCheck, BarChart3,
  Sparkles, Check, TrendingDown, ClipboardList
} from 'lucide-react';

const theme = {
  bg: '#F8F5EF',          
  bgSecondary: '#E8E2D8',
  card: '#FFFFFF',        
  cardHover: '#FAFAFA',
  border: '#EBE5D9',
  gold: '#F4C542',        
  goldHover: '#E3B532',
  goldLight: 'rgba(244, 197, 66, 0.15)',
  textMilk: '#111111', 
  textBody: '#2D2D2D',
  textMuted: '#6B7280',   
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  danger: '#EF4444',
  info: '#3B82F6',        
  infoLight: 'rgba(59, 130, 246, 0.1)',
  font: "'Inter', sans-serif"
};

export default function DashboardPage({ 
  user, 
  wsPrograms = [], 
  wsLearners = [], 
  wsSessions = [], 
  wsTeam = [], 
  notifications = [],
  recentUpdates = [],
  setActiveTab 
}) {
  const safePrograms = wsPrograms || [];
  const safeLearners = wsLearners || [];
  const safeSessions = wsSessions || [];
  const safeTeam = wsTeam || [];
  const safeNotifs = notifications || [];
  const safeUpdates = recentUpdates || [];

  const firstName = (typeof user === 'string' && user) ? user.split('@')[0] : 'Mayo';

  const activePrograms = safePrograms.filter(p => p?.status === 'Active' || p?.status === 'Published').length || 1;
  
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  const allSessions = safeSessions.length > 0 ? safeSessions : safePrograms.reduce((acc, p) => [...acc, ...(p?.sessions || [])], []);
  const todaySessions = allSessions.filter(s => s?.date === 'Today' || s?.date === todayStr);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getIconForActivity = (type) => {
    switch(type) {
      case 'upload': return <FileText size={16} color="#3B82F6" />;
      case 'enrollment': return <User size={16} color="#EF4444" />;
      case 'session': return <Calendar size={16} color="#3B82F6" />;
      case 'creation': return <BookOpen size={16} color="#F4C542" />;
      case 'attendance': return <CheckCircle2 size={16} color="#10B981" />;
      default: return <Activity size={16} color={theme.textMuted} />;
    }
  };
  
  const getBgForActivity = (type) => {
    switch(type) {
      case 'upload': return 'rgba(59, 130, 246, 0.1)';
      case 'enrollment': return 'rgba(239, 68, 68, 0.1)';
      case 'session': return 'rgba(59, 130, 246, 0.1)';
      case 'creation': return 'rgba(244, 197, 66, 0.1)';
      case 'attendance': return 'rgba(16, 185, 129, 0.1)';
      default: return theme.bgSecondary;
    }
  };

  const WorkCard = ({ title, count, subtitle, icon, tabId, urgent }) => (
    <div 
      onClick={() => setActiveTab(tabId)}
      style={{
        backgroundColor: theme.card,
        border: `1px solid ${urgent ? 'rgba(239, 68, 68, 0.3)' : theme.border}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.05)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.02)'; }}
    >
      {urgent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: theme.danger }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.textMuted, fontSize: '0.85rem', fontWeight: 600 }}>
          {icon} {title}
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem', fontWeight: 700, color: theme.textMilk }}>
          {count}
        </h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: urgent ? theme.danger : theme.textMuted, fontWeight: urgent ? 600 : 400 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem 3rem', fontFamily: theme.font }}>
      
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.8rem', color: theme.textMuted, fontWeight: 600, letterSpacing: '0.5px', marginBottom: '1rem', textTransform: 'uppercase' }}>
        Workspace / ABC Energy / Program Manager
      </div>

      {/* Hero Section */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(244,197,66,0.08) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: theme.textMilk, margin: '0 0 0.75rem 0' }}>
            {getGreeting()}, {firstName} <span style={{ display: 'inline-block', animation: 'wave 2s infinite', transformOrigin: '70% 70%' }}>👋</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.textMuted, margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
            Today you have <span style={{ color: theme.textMilk, fontWeight: 600 }}>2 sessions</span>, <span style={{ color: theme.textMilk, fontWeight: 600 }}>1 learner submission</span> waiting for review, and <span style={{ color: theme.textMilk, fontWeight: 600 }}>1 resource</span> pending publication.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('Sessions')}
              style={{
                padding: '0.75rem 1.5rem', backgroundColor: theme.gold, color: '#111', border: 'none',
                borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(244, 197, 66, 0.2)'
              }}
            >
              Continue Today's Work <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => setActiveTab('Learners')}
              style={{
                padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: theme.textMilk, border: `1px solid ${theme.border}`,
                borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              Review Pending Items <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('Programmes')}
              style={{
                padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.textMuted, border: 'none',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              Open Programme <BookOpen size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tiny KPI Strip */}
      <div style={{ display: 'flex', gap: '2rem', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, padding: '1.25rem 0', marginBottom: '2.5rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Programmes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{activePrograms}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: theme.border }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Learners</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{safeLearners.length || 4}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: theme.border }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Sessions This Week</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>6</div>
        </div>
        <div style={{ width: '1px', backgroundColor: theme.border }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Resources</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>12</div>
        </div>
      </div>

      {/* Today's Work */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk, marginBottom: '1.25rem' }}>Today's Work</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.25rem',
        marginBottom: '3rem' 
      }}>
        <WorkCard 
          title="Today's Sessions" count="2" subtitle="scheduled"
          icon={<Calendar size={16} color="#D8A325" />} tabId="Sessions"
        />
        <WorkCard 
          title="Learner Reviews" count="4" subtitle="awaiting review" urgent
          icon={<UserCheck size={16} color="#D8A325" />} tabId="Learners"
        />
        <WorkCard 
          title="Resources" count="1" subtitle="draft pending"
          icon={<FileText size={16} color="#D8A325" />} tabId="Resources"
        />
        <WorkCard 
          title="Announcements" count="0" subtitle="scheduled"
          icon={<Bell size={16} color="#D8A325" />} tabId="Messages"
        />
        <WorkCard 
          title="Reports" count="1" subtitle="Weekly report ready"
          icon={<BarChart3 size={16} color="#D8A325" />} tabId="Reports"
        />
        <WorkCard 
          title="Facilitators" count="2" subtitle="awaiting confirmation"
          icon={<Users size={16} color="#D8A325" />} tabId="Team"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Upcoming Sessions */}
          <div style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Upcoming Sessions</h3>
              <span onClick={() => setActiveTab('Sessions')} style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all →</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Mock detailed sessions based on prompt */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: `1px solid ${theme.border}` }}>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>Battery Storage Systems</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Today, 10:00–11:30</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> John David</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> 24 Learners</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Ongoing
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: `1px solid ${theme.border}` }}>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>Introduction to Photovoltaic Microgrids</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Today, 13:00–14:30</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Sarah Jenkins</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> 18 Learners</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(244, 197, 66, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#D8A325', fontWeight: 600 }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D8A325' }} /> Starts in 2h
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>Energy Policy & Regulation</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Tomorrow, 09:00–11:00</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Dr. Michael Chen</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> 30 Learners</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: theme.bgSecondary, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: theme.textMuted, fontWeight: 600 }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.textMuted }} /> Ready
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Recent Activity</h3>
              <span style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all →</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {safeUpdates.length > 0 ? (
                safeUpdates.slice(0, 5).map((update, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '8px', backgroundColor: getBgForActivity(update.type), 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                    }}>
                      {getIconForActivity(update.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: theme.textBody }}>
                        <span style={{ fontWeight: 600 }}>{update.user || 'Administrator'}</span> {update.action}
                      </p>
                      <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>{update.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Activity size={24} color={theme.textMuted} />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>No activity yet.</h4>
                  <p style={{ margin: 0, color: theme.textMuted, fontSize: '0.9rem', textAlign: 'center', maxWidth: '250px' }}>
                    Activity from your workspace will appear here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Workspace Health */}
          <div style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Workspace Health</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: theme.textBody }}>
                <Check size={16} color="#10B981" /> Programmes Active
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: theme.textBody }}>
                <Check size={16} color="#10B981" /> Sessions Scheduled
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: theme.danger }}>
                <AlertTriangle size={16} color="#EF4444" /> Attendance Missing
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: theme.textBody }}>
                <Check size={16} color="#10B981" /> Resources Updated
              </div>
            </div>

            <div style={{ backgroundColor: theme.bg, padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMilk }}>
                <span>Overall Progress</span>
                <span>83%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: theme.border, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '83%', height: '100%', backgroundColor: theme.gold }} />
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#8B5CF6', fontWeight: 700, fontSize: '0.9rem' }}>
              <Sparkles size={16} /> OYEN AI
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <TrendingDown size={16} color={theme.danger} style={{ marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: theme.textBody, lineHeight: 1.4 }}>This week's attendance dropped by 12%.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Users size={16} color={theme.textMuted} style={{ marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: theme.textBody, lineHeight: 1.4 }}>2 learners haven't joined any session.</span>
              </div>
            </div>
            
            <button style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textMilk, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Review Insights <ArrowRight size={14} />
            </button>
          </div>

          {/* Notifications */}
          <div style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Notifications</h3>
              <span style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {safeNotifs.length > 0 ? (
                safeNotifs.slice(0, 3).map((notif, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: idx < 2 ? `1px solid ${theme.border}` : 'none' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', 
                      backgroundColor: notif.type === 'alert' ? 'rgba(239,68,68,0.1)' : 'rgba(244,197,66,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {notif.type === 'alert' ? <AlertTriangle size={16} color="#EF4444" /> : <Bell size={16} color="#D8A325" />}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMilk }}>{notif.title}</h4>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: theme.textMuted }}>{notif.description}</p>
                      <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>{notif.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem 0', textAlign: 'center', color: theme.textMuted, fontSize: '0.9rem' }}>
                  You're all caught up!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
