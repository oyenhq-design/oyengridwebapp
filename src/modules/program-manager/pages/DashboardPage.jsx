import React, { useState, useMemo } from 'react';
import { 
  Calendar, FileText, Activity, ChevronRight, User, 
  CheckCircle2, MessageSquare, BookOpen, Clock, Users, 
  ArrowRight, Bell, AlertTriangle, UserCheck, BarChart3, Check, Sparkles, X
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
  wsTeam = [], 
  setActiveTab 
}) {
  const safePrograms = wsPrograms || [];
  const safeLearners = wsLearners || [];
  const safeTeam = wsTeam || [];

  // Parse PM display name from email
  const displayPMName = useMemo(() => {
    if (!user) return 'Mayo';
    const firstPart = user.split('@')[0];
    const parts = firstPart.split(/[._-]/);
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }, [user]);

  // Compute live statistics based on shared database
  const activeProgramsList = useMemo(() => {
    return safePrograms.filter(p => p.status === 'Active' || p.status === 'Published');
  }, [safePrograms]);

  const activeProgram = activeProgramsList[0] || null;

  const allSessions = useMemo(() => {
    const list = [];
    safePrograms.forEach(p => {
      const sess = p.sessions || [];
      sess.forEach(s => {
        list.push({ ...s, programName: p.name || p.title, programId: p.id });
      });
    });
    return list;
  }, [safePrograms]);

  const upcomingSessions = useMemo(() => {
    return allSessions.filter(s => s.status !== 'Completed').slice(0, 3);
  }, [allSessions]);

  // Live Metric Counts Sourced Directly from State
  const metrics = useMemo(() => {
    const uniqueFacilitators = new Set();
    allSessions.forEach(s => {
      if (s.facilitatorName) uniqueFacilitators.add(s.facilitatorName);
    });
    safeTeam.forEach(t => {
      if (t.role === 'Facilitator') uniqueFacilitators.add(t.name);
    });

    return {
      activeProgramsCount: activeProgramsList.length,
      participantsCount: safeLearners.length,
      upcomingSessionsCount: allSessions.filter(s => s.status === 'Scheduled' || s.status === 'Live').length,
      facilitatorsCount: uniqueFacilitators.size
    };
  }, [activeProgramsList, safeLearners, allSessions, safeTeam]);

  // Today's Priorities list (State-controlled so users can complete/dismiss them)
  const [priorities, setPriorities] = useState([
    { id: 1, text: 'Review participant submissions', completed: false },
    { id: 2, text: 'Upload Week 3 learning resources', completed: false },
    { id: 3, text: 'Confirm facilitator attendance for tomorrow\'s session', completed: false },
    { id: 4, text: 'Publish yesterday\'s attendance sheet', completed: false },
    { id: 5, text: 'Schedule next programme review session', completed: false }
  ]);

  const handleTogglePriority = (id) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const activePrioritiesCount = priorities.filter(p => !p.completed).length;

  // Integrated AI contextual suggestion
  const [aiSuggestion, setAiSuggestion] = useState({
    id: 'upload_slides',
    text: 'Tomorrow\'s session has no published slides. Upload resources to notify participants.',
    actionLabel: 'Upload Resources',
    action: () => setActiveTab('Resources')
  });

  // Health Milestone Metrics
  const healthMilestones = useMemo(() => {
    // Planning, Participants, Sessions, Resources, Delivery, Completion
    const hasPlanning = safePrograms.length > 0;
    const hasParticipants = safeLearners.length > 0;
    const hasSessions = allSessions.length > 0;
    const hasResources = safePrograms.some(p => (p.resources || []).length > 0);
    const hasDelivery = allSessions.some(s => s.status === 'Live');
    const hasCompletion = allSessions.some(s => s.status === 'Completed');

    const list = [
      { label: 'Planning', status: hasPlanning },
      { label: 'Participants', status: hasParticipants },
      { label: 'Sessions', status: hasSessions },
      { label: 'Resources', status: hasResources },
      { label: 'Delivery', status: hasDelivery },
      { label: 'Completion', status: hasCompletion }
    ];

    const completedCount = list.filter(m => m.status).length;
    const completionPercent = Math.round((completedCount / list.length) * 100);

    return { list, percent: completionPercent };
  }, [safePrograms, safeLearners, allSessions]);

  // Timeline events logs computed dynamically
  const activityTimeline = useMemo(() => {
    const events = [];
    if (activeProgram) {
      events.push({ id: 1, text: `${activeProgram.title || activeProgram.name} created`, date: 'Today' });
    }
    if (safeLearners.length > 0) {
      events.push({ id: 2, text: `${safeLearners.length} participants enrolled in programme`, date: 'Yesterday' });
    }
    const assignedFacilitator = allSessions.find(s => s.facilitatorName);
    if (assignedFacilitator) {
      events.push({ id: 3, text: `Facilitator ${assignedFacilitator.facilitatorName} assigned to session`, date: 'Yesterday' });
    }
    events.push({ id: 4, text: 'Learning programme published to workspace', date: '2 days ago' });
    return events;
  }, [activeProgram, safeLearners, allSessions]);

  return (
    <div style={{ padding: '3rem', fontFamily: theme.font }}>
      
      {/* Greetings Block */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: theme.textMilk, margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>
          Good afternoon, {displayPMName} 👋
        </h1>
        <p style={{ fontSize: '1rem', color: theme.textMuted, margin: 0 }}>
          Here is your operational delivery checklist for today.
        </p>
      </div>

      {/* Dynamic OYEN AI warning banner */}
      {aiSuggestion && (
        <div style={{
          backgroundColor: '#FFFBEA',
          border: '1px solid #F4C542',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2D2D2D' }}>
            <Sparkles size={16} color="#D8A325" />
            <strong>⚡ OYEN AI:</strong>
            <span>{aiSuggestion.text}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={aiSuggestion.action}
              style={{ padding: '0.45rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', color: '#111111', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {aiSuggestion.actionLabel}
            </button>
            <button 
              onClick={() => setAiSuggestion(null)}
              style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Today's Focus Card */}
      {activeProgram ? (
        <div style={{
          backgroundColor: theme.card,
          borderRadius: '20px',
          padding: '2rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: theme.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Focus</span>
            <h2 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800, color: theme.textMilk }}>
              {activeProgram.title || activeProgram.name}
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: theme.textMuted, display: 'block' }}>Current Phase</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>Week 2</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: theme.textMuted, display: 'block' }}>Next Session</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>Tomorrow • 10:00 AM</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: theme.textMuted, display: 'block' }}>Participants</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>{safeLearners.length}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: theme.textMuted, display: 'block' }}>Facilitators</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>{metrics.facilitatorsCount}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: theme.textMuted, display: 'block' }}>Pending Tasks</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.danger }}>{activePrioritiesCount}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('Programmes')}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            Open Programme <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div style={{
          padding: '2.5rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          border: `1px solid ${theme.border}`,
          borderRadius: '20px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>No programmes are currently active.</h3>
          <p style={{ margin: '0 0 1rem 0', color: theme.textMuted, fontSize: '0.88rem' }}>Create or publish a learning programme to start tracking milestones.</p>
          <button 
            onClick={() => setActiveTab('Programmes')}
            style={{ padding: '0.6rem 1.25rem', backgroundColor: theme.gold, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Go to Programmes
          </button>
        </div>
      )}

      {/* Operational Summary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Active Programmes', value: metrics.activeProgramsCount },
          { label: 'Participants', value: metrics.participantsCount },
          { label: 'Upcoming Sessions', value: metrics.upcomingSessionsCount },
          { label: 'Facilitators', value: metrics.facilitatorsCount }
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: theme.textMilk, marginTop: '0.25rem' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Priorities, Timeline, Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2.5rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Today's Priorities Checklist */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 800 }}>Today's Priorities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {priorities.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id={`priority_${p.id}`}
                    checked={p.completed}
                    onChange={() => handleTogglePriority(p.id)}
                  />
                  <label 
                    htmlFor={`priority_${p.id}`} 
                    style={{ 
                      fontSize: '0.88rem', 
                      color: p.completed ? theme.textMuted : theme.textBody,
                      textDecoration: p.completed ? 'line-through' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {p.text}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions List */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Upcoming Sessions</h3>
              {upcomingSessions.length > 0 && (
                <button 
                  onClick={() => setActiveTab('Sessions')}
                  style={{ background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  View all →
                </button>
              )}
            </div>

            {upcomingSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {upcomingSessions.map(session => (
                  <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: `1px solid ${theme.border}` }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '0.9rem', fontWeight: 700, color: theme.textMilk }}>{session.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>{session.programName} • {session.date} • {session.startTime}</span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: session.status === 'Live' ? theme.success : '#F59E0B',
                      backgroundColor: session.status === 'Live' ? theme.successLight : 'rgba(245,158,11,0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>{session.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📅</span>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>No sessions scheduled.</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: theme.textMuted }}>The programme is active but has no upcoming sessions.</p>
                <button 
                  onClick={() => setActiveTab('Sessions')}
                  style={{ padding: '0.5rem 1rem', backgroundColor: theme.gold, border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Schedule Session
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Recent Activity Timeline */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', fontWeight: 800 }}>Programme Timeline</h3>
            
            {activityTimeline.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                {activityTimeline.map(evt => (
                  <div key={evt.id} style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
                    <span style={{ color: theme.textMuted, width: '70px', fontWeight: 600, flexShrink: 0 }}>{evt.date}</span>
                    <span style={{ color: theme.textBody }}>{evt.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: theme.textMuted, fontStyle: 'italic' }}>No recent activity logged.</span>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Programme Health Card */}
          <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', fontWeight: 800 }}>Programme Health</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {healthMilestones.list.map(mile => (
                <div key={mile.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: theme.textBody }}>
                  {mile.status ? <Check size={16} color="#10B981" /> : <X size={16} color={theme.danger} />}
                  <span>{mile.label} {mile.status ? 'Completed' : 'Pending'}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: theme.bg, padding: '1rem', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem', fontWeight: 700, color: theme.textMilk }}>
                <span>Programme Completion</span>
                <span>{healthMilestones.percent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: theme.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${healthMilestones.percent}%`, height: '100%', backgroundColor: theme.gold }} />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
