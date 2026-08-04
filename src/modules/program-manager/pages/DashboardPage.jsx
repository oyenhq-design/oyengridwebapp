import React from 'react';
import { 
  Calendar, FileText, Activity, ChevronRight, User, 
  CheckCircle2, MessageSquare, BookOpen, Clock, Users, 
  ArrowRight, Bell, AlertTriangle, UserCheck, BarChart3, Check
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

  const firstName = (typeof user === 'string' && user) ? user.split('@')[0] : 'Mayo';

  const activePrograms = safePrograms.filter(p => p?.status === 'Active' || p?.status === 'Published').length || 1;
  const programName = safePrograms.length > 0 && safePrograms[0]?.title ? safePrograms[0].title : 'Battery Storage Systems Bootcamp';
  
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
      case 'upload': return <FileText size={16} color={theme.info} />;
      case 'enrollment': return <Users size={16} color={theme.gold} />;
      case 'session': return <Calendar size={16} color={theme.success} />;
      case 'announcement': return <Bell size={16} color={theme.danger} />;
      default: return <Activity size={16} color={theme.textMuted} />;
    }
  };

  const QuickAccessCard = ({ title, icon, description, tabId, actionText }) => (
    <div 
      onClick={() => setActiveTab(tabId)}
      style={{
        backgroundColor: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: theme.bgSecondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>{title}</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: theme.textMuted, lineHeight: 1.4 }}>{description}</p>
          <span style={{ fontSize: '0.85rem', color: theme.textMilk, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {actionText} <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '3rem', fontFamily: theme.font }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: theme.textMilk, margin: '0 0 0.5rem 0' }}>
          {getGreeting()}, {firstName} <span style={{ display: 'inline-block', animation: 'wave 2s infinite', transformOrigin: '70% 70%' }}>👋</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: theme.textMuted, margin: 0 }}>
          Here's what's happening across your programmes today.
        </p>
      </div>

      {/* Hero Card */}
      <div style={{
        backgroundColor: theme.card,
        borderRadius: '24px',
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: theme.goldLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Calendar size={40} color="#C29F32" strokeWidth={1.5} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk }}>
              You're managing {activePrograms} active programme{activePrograms > 1 ? 's' : ''}
            </h2>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: theme.textBody }}>
              <span style={{ fontWeight: 600 }}>{programName}</span> is currently active.
            </p>
            <div style={{ fontSize: '0.95rem', color: theme.textMuted, lineHeight: 1.6 }}>
              Today's overview:
              <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.5rem' }}>
                <li><strong style={{ color: theme.textMilk }}>2</strong> sessions scheduled</li>
                <li><strong style={{ color: theme.textMilk }}>4</strong> learner submissions awaiting review</li>
                <li><strong style={{ color: theme.textMilk }}>1</strong> resource awaiting publication</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('Sessions')}
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: theme.gold,
              color: '#111',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            Continue Today's Work <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setActiveTab('Programmes')}
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: 'transparent',
              color: theme.textMilk,
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <BookOpen size={18} /> Create Programme
          </button>
        </div>
      </div>

      {/* Compact Workspace Summary */}
      <div style={{ 
        display: 'flex', gap: '2rem', marginBottom: '3rem', padding: '1.5rem', 
        backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
      }}>
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
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Team Members</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{safeTeam.length || 3}</div>
        </div>
      </div>

      {/* Quick Access */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk, marginBottom: '1.25rem' }}>Quick Access</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem' 
      }}>
        <QuickAccessCard 
          title="Programmes" 
          icon={<BookOpen size={20} color="#D8A325" />} 
          description={`${activePrograms} Active Programme`}
          tabId="Programmes"
          actionText="Open"
        />
        <QuickAccessCard 
          title="Learners" 
          icon={<UserCheck size={20} color="#D8A325" />} 
          description={`${safeLearners.length || 4} Enrolled`}
          tabId="Learners"
          actionText="Manage"
        />
        <QuickAccessCard 
          title="Sessions" 
          icon={<Calendar size={20} color="#D8A325" />} 
          description="2 Scheduled Today"
          tabId="Sessions"
          actionText="View"
        />
        <QuickAccessCard 
          title="Resources" 
          icon={<FileText size={20} color="#D8A325" />} 
          description="12 Files"
          tabId="Resources"
          actionText="Open"
        />
        <QuickAccessCard 
          title="Reports" 
          icon={<BarChart3 size={20} color="#D8A325" />} 
          description="Weekly Report Ready"
          tabId="Reports"
          actionText="View"
        />
        <QuickAccessCard 
          title="Team" 
          icon={<Users size={20} color="#D8A325" />} 
          description={`${safeTeam.length || 3} Members`}
          tabId="Team"
          actionText="Manage"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Upcoming Sessions */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '24px',
            padding: '2rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Upcoming Sessions</h3>
              <span onClick={() => setActiveTab('Sessions')} style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all →</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>Battery Storage Systems</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> Today</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> 10:00 AM – 11:30 AM</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> John David</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> 24 Learners</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ backgroundColor: theme.successLight, color: theme.success, padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Ongoing</span>
                  <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>Introduction to Photovoltaic Microgrids</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> Today</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> 13:00 PM – 14:30 PM</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Sarah Jenkins</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> 18 Learners</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ backgroundColor: theme.goldLight, color: '#D8A325', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Starts in 2h</span>
                  <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>Energy Policy & Regulation</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> Tomorrow</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> 09:00 AM – 11:00 AM</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Dr. Michael Chen</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> 30 Learners</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ backgroundColor: theme.bgSecondary, color: theme.textMuted, padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Ready</span>
                  <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '24px',
            padding: '2rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Recent Activity</h3>
              <span style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all →</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.infoLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={14} color={theme.info} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: theme.textBody }}>
                    <span style={{ fontWeight: 600 }}>John</span> uploaded Week 3 resources
                  </p>
                  <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>2 hours ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} color={theme.success} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: theme.textBody }}>
                    <span style={{ fontWeight: 600 }}>Sarah</span> submitted Assignment 4
                  </p>
                  <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>5 hours ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.goldLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={14} color="#D8A325" />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: theme.textBody }}>
                    <span style={{ fontWeight: 600 }}>Battery Storage</span> session created
                  </p>
                  <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>Yesterday</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color={theme.danger} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: theme.textBody }}>
                    <span style={{ fontWeight: 600 }}>David</span> joined the workspace
                  </p>
                  <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>Yesterday</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.infoLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={14} color={theme.info} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: theme.textBody }}>
                    <span style={{ fontWeight: 600 }}>Programme updated:</span> Microgrids Phase 1
                  </p>
                  <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Notifications */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '24px',
            padding: '2rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Notifications</h3>
              <span style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: theme.infoLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} color={theme.info} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMilk }}>Attendance report available</h4>
                  <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>10 mins ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: theme.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={16} color={theme.success} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMilk }}>New learner enrolled</h4>
                  <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>1 hour ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: theme.goldLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color="#D8A325" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMilk }}>Facilitator accepted invitation</h4>
                  <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>3 hours ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={16} color="#8B5CF6" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMilk }}>Programme published</h4>
                  <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workspace Health */}
          <div style={{
            backgroundColor: theme.card,
            borderRadius: '24px',
            padding: '2rem',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Workspace Health</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.textBody }}>
                <Check size={18} color="#10B981" /> Programme Active
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.textBody }}>
                <Check size={18} color="#10B981" /> Sessions Scheduled
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.textBody }}>
                <Check size={18} color="#10B981" /> Resources Published
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.danger }}>
                <AlertTriangle size={18} color="#EF4444" /> 4 Learner submissions pending
              </div>
            </div>

            <div style={{ backgroundColor: theme.bg, padding: '1.25rem', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>
                <span>Workspace Progress</span>
                <span>83%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: theme.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '83%', height: '100%', backgroundColor: theme.gold }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
