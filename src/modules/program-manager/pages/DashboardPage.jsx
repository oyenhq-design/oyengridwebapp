import React, { useMemo } from 'react';
import { 
  Calendar, FileText, Activity, ChevronRight, User, 
  CheckCircle2, MessageSquare, BookOpen, Clock, Users, 
  ArrowRight, Bell, AlertTriangle 
} from 'lucide-react';

// OYEN GRID Official Design System Theme Variables (Program Manager Dashboard)
const theme = {
  bg: '#F8F5EF',          // Warm ivory
  bgSecondary: '#E8E2D8',
  card: '#FFFFFF',        // White cards
  cardHover: '#FAFAFA',
  border: '#EBE5D9',
  gold: '#F4C542',        // Gold primary
  goldHover: '#E3B532',
  goldLight: 'rgba(244, 197, 66, 0.15)',
  textMilk: '#111111', 
  textBody: '#2D2D2D',
  textMuted: '#6B7280',   // Gray for secondary text
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  danger: '#EF4444',
  info: '#3B82F6',        // Blue links
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
  const firstName = user ? user.split('@')[0] : 'Program Manager';

  // Calculate live statistics
  const activePrograms = wsPrograms.filter(p => p.status === 'Active' || p.status === 'Published').length;
  
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Flatten sessions from wsPrograms if wsSessions is empty
  const allSessions = wsSessions.length > 0 ? wsSessions : wsPrograms.reduce((acc, p) => [...acc, ...(p.sessions || [])], []);
  
  const todaySessions = allSessions.filter(s => s.date === 'Today' || s.date === todayStr);
  const nextSession = todaySessions.length > 0 ? todaySessions[0] : (allSessions[0] || null);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const dashboardStatus = () => {
    if (todaySessions.length > 0) return `${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} scheduled today`;
    if (activePrograms > 0) return `Managing ${activePrograms} active programme${activePrograms > 1 ? 's' : ''}`;
    return "Here's what's happening in your workspace today.";
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

  const QuickAccessCard = ({ title, icon, description, tabId }) => (
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
        <p style={{ margin: 0, fontSize: '0.85rem', color: theme.textMuted, lineHeight: 1.4 }}>{description}</p>
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
          {dashboardStatus()}
        </p>
      </div>

      {/* Hero Card - Today's Priority */}
      <div style={{
        backgroundColor: theme.card,
        borderRadius: '24px',
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: theme.goldLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={40} color="#C29F32" strokeWidth={1.5} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk }}>
              You're managing {activePrograms || wsPrograms.length} active programmes
            </h2>
            <p style={{ margin: 0, fontSize: '1rem', color: theme.textMuted }}>
              Across {wsLearners.length} learners and {wsTeam.length} team members.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('Programmes')}
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
              gap: '0.5rem'
            }}
          >
            Go to Programmes <ArrowRight size={18} strokeWidth={2.5} />
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
              gap: '0.5rem'
            }}
          >
            <BookOpen size={18} /> Create Programme
          </button>
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
          description="Manage and track your programmes"
          tabId="Programmes"
        />
        <QuickAccessCard 
          title="Learners" 
          icon={<UserCheck size={20} color="#D8A325" />} 
          description="View and manage learners"
          tabId="Learners"
        />
        <QuickAccessCard 
          title="Sessions" 
          icon={<Calendar size={20} color="#D8A325" />} 
          description="Create and manage sessions"
          tabId="Sessions"
        />
        <QuickAccessCard 
          title="Resources" 
          icon={<FileText size={20} color="#D8A325" />} 
          description="Upload and manage materials"
          tabId="Resources"
        />
        <QuickAccessCard 
          title="Reports" 
          icon={<BarChart3 size={20} color="#D8A325" />} 
          description="View analytics and insights"
          tabId="Reports"
        />
        <QuickAccessCard 
          title="Team" 
          icon={<Users size={20} color="#D8A325" />} 
          description="Manage facilitators and staff"
          tabId="Team"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
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
              {recentUpdates.length > 0 ? (
                recentUpdates.slice(0, 5).map((update, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.bgSecondary, 
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
                <div style={{ padding: '2rem 0', textAlign: 'center', color: theme.textMuted, fontSize: '0.95rem' }}>
                  No recent activity in the workspace.
                </div>
              )}
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
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notif, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px',
                    backgroundColor: theme.bg, border: `1px solid ${theme.border}`
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', 
                      backgroundColor: notif.type === 'alert' ? theme.danger : theme.goldLight,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {notif.type === 'alert' ? <AlertTriangle size={16} color="#fff" /> : <Bell size={16} color="#C29F32" />}
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
              {allSessions.slice(0, 3).map((session, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', 
                  borderBottom: idx < 2 ? `1px solid ${theme.border}` : 'none' 
                }}>
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    padding: '0.5rem 0.75rem', backgroundColor: theme.bgSecondary, borderRadius: '8px', minWidth: '55px' 
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase' }}>
                      {session.date === 'Today' ? 'MAY' : session.date.split('/')[0] === '5' ? 'MAY' : 'MON'}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: theme.textMilk }}>
                      {session.date === 'Today' ? '16' : session.date.split('/')[1] || '01'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 600, color: theme.textMilk }}>{session.title}</h4>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: theme.textMuted }}>{session.programName || 'Bootcamp'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: theme.textMuted }}>
                      <Clock size={12} /> {session.time}
                    </div>
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.goldLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="#C29F32" />
                  </div>
                </div>
              ))}
              {allSessions.length === 0 && (
                <div style={{ padding: '1.5rem 0', textAlign: 'center', color: theme.textMuted, fontSize: '0.9rem' }}>
                  No sessions scheduled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
