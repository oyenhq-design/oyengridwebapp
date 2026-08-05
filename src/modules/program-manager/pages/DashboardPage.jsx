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
  setActiveTab 
}) {
  const safePrograms = wsPrograms || [];
  const safeLearners = wsLearners || [];
  const safeSessions = wsSessions || [];
  const safeTeam = wsTeam || [];

  const firstName = (typeof user === 'string' && user) ? user.split('@')[0] : 'Program Manager';

  // Compute live statistics based on shared workspace state
  const activeProgramsList = safePrograms.filter(p => p?.status === 'Active' || p?.status === 'Published');
  const activePrograms = activeProgramsList.length;
  const programName = activePrograms > 0 ? activeProgramsList[0]?.title || activeProgramsList[0]?.name : null;
  
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  const allSessions = safeSessions.length > 0 ? safeSessions : safePrograms.reduce((acc, p) => [...acc, ...(p?.sessions || [])], []);
  const todaySessions = allSessions.filter(s => s?.date === 'Today' || s?.date === todayStr);

  // Compute live workload elements
  const pendingReviews = safePrograms.reduce((acc, p) => acc + (p?.assessments?.filter(a => a?.status === 'Pending')?.length || 0), 0);
  const draftResources = safePrograms.reduce((acc, p) => acc + (p?.resources?.filter(r => r?.status === 'Draft' || r?.status === 'Pending')?.length || 0), 0);
  const allResourcesCount = safePrograms.reduce((acc, p) => acc + (p?.resources?.length || 0), 0);
  const allReportsCount = safePrograms.reduce((acc, p) => acc + (p?.reports?.length || 0), 0);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPrimaryAction = () => {
    if (pendingReviews > 0) return { label: 'Open Reviews', tab: 'Participants' }; // Can be mapped to specific sub-tab if needed
    if (todaySessions.length > 0) return { label: 'Open Session', tab: 'Sessions' };
    if (draftResources > 0) return { label: 'Continue Editing Resource', tab: 'Resources' };
    return { label: 'Open Programmes', tab: 'Programmes' };
  };

  const primaryAction = getPrimaryAction();

  // Sort upcoming sessions (Assuming naive future check by looking for 'Tomorrow' or dates not equal to past dates)
  // For simplicity, we just filter out explicitly "Past" or take the first 3
  const upcomingSessions = allSessions.filter(s => s?.status !== 'Completed').slice(0, 3);

  // Workspace Health Checks
  const hasActivePrograms = activePrograms > 0;
  const hasSessions = allSessions.length > 0;
  const hasResources = allResourcesCount > 0;
  
  let healthScore = 0;
  if (hasActivePrograms) healthScore += 33;
  if (hasSessions) healthScore += 34;
  if (hasResources) healthScore += 33;

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
            {activePrograms > 0 ? (
              <>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk }}>
                  You're managing {activePrograms} active programme{activePrograms > 1 ? 's' : ''}.
                </h2>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: theme.textBody }}>
                  <span style={{ fontWeight: 600 }}>{programName}</span> is currently active.
                </p>
                <div style={{ fontSize: '0.95rem', color: theme.textMuted, lineHeight: 1.6 }}>
                  Today's overview:
                  <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.5rem' }}>
                    <li><strong style={{ color: theme.textMilk }}>{todaySessions.length}</strong> session{todaySessions.length !== 1 ? 's' : ''} scheduled</li>
                    <li><strong style={{ color: theme.textMilk }}>{pendingReviews}</strong> participant submission{pendingReviews !== 1 ? 's' : ''} awaiting review</li>
                    <li><strong style={{ color: theme.textMilk }}>{draftResources}</strong> resource{draftResources !== 1 ? 's' : ''} awaiting publication</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk }}>
                  No programmes have been created yet.
                </h2>
                <p style={{ margin: '0', fontSize: '1rem', color: theme.textMuted }}>
                  Create a programme to start managing learners, sessions, and resources.
                </p>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab(primaryAction.tab)}
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
            {primaryAction.label} <ArrowRight size={18} strokeWidth={2.5} />
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
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{safePrograms.length}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: theme.border }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Participants</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{safeLearners.length}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: theme.border }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Sessions This Week</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{allSessions.length}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: theme.border }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Team Members</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk, marginTop: '0.25rem' }}>{safeTeam.length}</div>
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
          description={activePrograms > 0 ? `${activePrograms} Active Programme${activePrograms !== 1 ? 's' : ''}` : 'No programmes'}
          tabId="Programmes"
          actionText="Open"
        />
        <QuickAccessCard 
          title="Participants" 
          icon={<UserCheck size={20} color="#D8A325" />} 
          description={safeLearners.length > 0 ? `${safeLearners.length} Enrolled` : 'No participants'}
          tabId="Participants"
          actionText="Manage"
        />
        <QuickAccessCard 
          title="Sessions" 
          icon={<Calendar size={20} color="#D8A325" />} 
          description={todaySessions.length > 0 ? `${todaySessions.length} Scheduled Today` : (allSessions.length > 0 ? `${allSessions.length} Total Sessions` : 'No sessions')}
          tabId="Sessions"
          actionText="View"
        />
        <QuickAccessCard 
          title="Resources" 
          icon={<FileText size={20} color="#D8A325" />} 
          description={allResourcesCount > 0 ? `${allResourcesCount} File${allResourcesCount !== 1 ? 's' : ''}` : 'No resources'}
          tabId="Resources"
          actionText="Open"
        />
        <QuickAccessCard 
          title="Reports" 
          icon={<BarChart3 size={20} color="#D8A325" />} 
          description={allReportsCount > 0 ? `${allReportsCount} Report${allReportsCount !== 1 ? 's' : ''} Ready` : 'No reports'}
          tabId="Reports"
          actionText="View"
        />
        <QuickAccessCard 
          title="Team" 
          icon={<Users size={20} color="#D8A325" />} 
          description={safeTeam.length > 0 ? `${safeTeam.length} Member${safeTeam.length !== 1 ? 's' : ''}` : 'No team members'}
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
              {allSessions.length > 0 && <span onClick={() => setActiveTab('Sessions')} style={{ fontSize: '0.85rem', color: theme.info, cursor: 'pointer', fontWeight: 600 }}>View all →</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session, idx) => (
                  <div key={session.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: idx < upcomingSessions.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>{session.title || 'Untitled Session'}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: theme.textMuted }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BookOpen size={12} /> {session.programName || 'Programme'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {session.date || 'TBD'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {session.time || 'TBD'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {session.facilitatorEmail || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ 
                        backgroundColor: session.status === 'Ongoing' ? theme.successLight : theme.bgSecondary, 
                        color: session.status === 'Ongoing' ? theme.success : theme.textMuted, 
                        padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                      }}>{session.status || 'Scheduled'}</span>
                      <button style={{ background: 'transparent', border: 'none', color: theme.textMilk, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Open <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Calendar size={24} color={theme.textMuted} />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>No upcoming sessions.</h4>
                  <p style={{ margin: 0, color: theme.textMuted, fontSize: '0.9rem', textAlign: 'center' }}>
                    Create your first session to begin.
                  </p>
                </div>
              )}
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
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Activity size={24} color={theme.textMuted} />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600, color: theme.textMilk }}>No activity yet.</h4>
                <p style={{ margin: 0, color: theme.textMuted, fontSize: '0.9rem', textAlign: 'center', maxWidth: '250px' }}>
                  Activity will appear here automatically.
                </p>
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
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Bell size={20} color={theme.textMuted} />
                </div>
                <h4 style={{ margin: '0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMilk }}>You're all caught up.</h4>
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
                {hasActivePrograms ? <Check size={18} color="#10B981" /> : <AlertTriangle size={18} color={theme.danger} />}
                {hasActivePrograms ? 'Programme Active' : 'No Active Programmes'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.textBody }}>
                {hasSessions ? <Check size={18} color="#10B981" /> : <AlertTriangle size={18} color={theme.danger} />}
                {hasSessions ? 'Sessions Scheduled' : 'No Sessions Scheduled'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.textBody }}>
                {hasResources ? <Check size={18} color="#10B981" /> : <AlertTriangle size={18} color={theme.danger} />}
                {hasResources ? 'Resources Published' : 'No Resources Published'}
              </div>
              {pendingReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: theme.danger }}>
                  <AlertTriangle size={18} color="#EF4444" /> {pendingReviews} Pending Review{pendingReviews !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: theme.bg, padding: '1.25rem', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>
                <span>Workspace Progress</span>
                <span>{healthScore}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: theme.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${healthScore}%`, height: '100%', backgroundColor: theme.gold }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
