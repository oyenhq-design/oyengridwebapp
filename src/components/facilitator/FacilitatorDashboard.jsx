import React, { useState, useMemo } from 'react';
import { 
  Calendar, BookOpen, Clock, CheckCircle2, ChevronRight, Play, 
  BookOpen as BookOpenIcon, Bell, User as UserIcon, Activity, AlertCircle 
} from 'lucide-react';

export default function FacilitatorDashboard({ 
  assignedSessions = [], 
  programs = [], 
  currentUserEmail, 
  userInfo, 
  onNavigate, 
  onSelectSession 
}) {
  const [filter, setFilter] = useState('Upcoming');

  const facilitatorName = userInfo?.fullName || currentUserEmail || 'Facilitator';

  // Sort and categorize sessions
  const sortedSessions = useMemo(() => {
    return [...assignedSessions].sort((a, b) => {
      const dateA = new Date(a.date || '');
      const dateB = new Date(b.date || '');
      return dateA - dateB;
    });
  }, [assignedSessions]);

  const upcomingSessions = useMemo(() => {
    return sortedSessions.filter(s => s.status === 'Upcoming' || s.status === 'Live');
  }, [sortedSessions]);

  const completedSessions = useMemo(() => {
    return sortedSessions.filter(s => s.status === 'Completed');
  }, [sortedSessions]);

  // Determine "Next Session"
  const nextSession = useMemo(() => {
    return upcomingSessions[0] || null;
  }, [upcomingSessions]);

  // Filtered list for "My Sessions" section
  const filteredSessionsList = useMemo(() => {
    if (filter === 'Upcoming') return upcomingSessions;
    if (filter === 'Completed') return completedSessions;
    return sortedSessions;
  }, [filter, upcomingSessions, completedSessions, sortedSessions]);

  // Check if a session starts tomorrow or today for upcoming reminder
  const nextSessionReminder = useMemo(() => {
    if (!nextSession || !nextSession.date) return null;
    const sessionDate = new Date(nextSession.date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday = sessionDate.toDateString() === today.toDateString();
    const isTomorrow = sessionDate.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return { text: `Your next session "${nextSession.title}" starts today at ${nextSession.time || '10:00 AM'}.`, session: nextSession };
    }
    if (isTomorrow) {
      return { text: `Your next session starts tomorrow at ${nextSession.time || '10:00 AM'}.`, session: nextSession };
    }
    return null;
  }, [nextSession]);

  // Dynamic Recent Activity list based on actual session data
  const recentActivities = useMemo(() => {
    const activities = [];
    sortedSessions.forEach(s => {
      if (s.status === 'Completed') {
        activities.push({
          id: `act-comp-${s.id}`,
          text: `Session "${s.title}" was completed`,
          time: 'Completed',
          icon: <CheckCircle2 size={14} color="#10B981" />
        });
      } else if (s.status === 'Live') {
        activities.push({
          id: `act-live-${s.id}`,
          text: `Session "${s.title}" is currently live`,
          time: 'Active Now',
          icon: <Play size={14} color="#F5C84C" />
        });
      } else if (s.status === 'Upcoming') {
        activities.push({
          id: `act-up-${s.id}`,
          text: `Session "${s.title}" assigned to you`,
          time: 'Scheduled',
          icon: <Calendar size={14} color="#3B82F6" />
        });
      }
    });
    return activities.slice(0, 4);
  }, [sortedSessions]);

  // Handle Full Empty State (If facilitator has NO sessions assigned at all)
  if (assignedSessions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: '520px', textAlign: 'center', backgroundColor: '#111111', padding: '3rem', borderRadius: '16px', border: '1px solid #1F2937', color: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(245, 200, 76, 0.08)', marginBottom: '1.5rem', border: '1px solid rgba(245, 200, 76, 0.2)' }}>
            <Calendar size={32} color="#F5C84C" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.75rem', fontFamily: "'Outfit', sans-serif" }}>No sessions assigned yet</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
            Your assigned sessions will appear here once a programme administrator schedules and assigns them to you.
          </p>
          <div style={{ padding: '0.85rem 1.15rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.65rem', justifyContent: 'center' }}>
            <AlertCircle size={16} color="#6B7280" />
            <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>
              You don’t need to create or schedule sessions from this account.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: "'Inter', sans-serif", color: '#151515' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px' }}>
            Welcome back, {facilitatorName}
          </h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Here's what's coming up in your assigned sessions.
          </p>
        </div>
      </div>

      {/* Subtle Approach Reminder Banner */}
      {nextSessionReminder && (
        <div style={{ backgroundColor: '#111111', border: '1px solid #F5C84C', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(245, 200, 76, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={18} color="#F5C84C" />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{nextSessionReminder.text}</span>
          </div>
          <button 
            onClick={() => onSelectSession(nextSessionReminder.session)}
            style={{ backgroundColor: '#F5C84C', border: 'none', color: '#111111', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s' }}
          >
            View Session <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Top summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F5C84C', marginBottom: '0.5rem' }}>
            <Calendar size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upcoming Sessions</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>{upcomingSessions.length}</span>
        </div>
        
        <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3B82F6', marginBottom: '0.5rem' }}>
            <BookOpenIcon size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sessions Assigned</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>{assignedSessions.length}</span>
        </div>

        <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sessions Completed</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>{completedSessions.length}</span>
        </div>

        <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A855F7', marginBottom: '0.5rem' }}>
            <Clock size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Session</span>
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextSession ? `${nextSession.date} • ${nextSession.time || '10:00 AM'}` : 'No Upcoming'}
          </span>
        </div>
      </div>

      {/* Main split grid: Next Session + Quick Actions & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Next Session card */}
        <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '2rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Next Scheduled Session</h3>
            {nextSession && (
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '0.25rem 0.6rem', 
                borderRadius: '4px', 
                backgroundColor: nextSession.status === 'Live' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 200, 76, 0.1)',
                color: nextSession.status === 'Live' ? '#10B981' : '#F5C84C',
                border: nextSession.status === 'Live' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 200, 76, 0.2)'
              }}>
                {nextSession.status}
              </span>
            )}
          </div>

          {nextSession ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>{nextSession.programName || 'Programme'}</span>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0 0', fontFamily: "'Outfit', sans-serif" }}>{nextSession.title}</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>DATE & TIME</span>
                  <div style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.15rem' }}>
                    {nextSession.date} at {nextSession.time || '10:00 AM'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>SESSION TYPE</span>
                  <div style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.15rem' }}>
                    {nextSession.type || 'Live Class'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>PARTICIPANTS</span>
                  <div style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.15rem' }}>
                    {nextSession.learnersCount || nextSession.learners?.length || '24 Registered'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>FACILITATOR</span>
                  <div style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.15rem' }}>
                    {facilitatorName}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button 
                  onClick={() => onSelectSession(nextSession)}
                  style={{
                    backgroundColor: '#F5C84C',
                    border: 'none',
                    color: '#111111',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {nextSession.status === 'Live' ? 'Join Session Workspace' : 'View Session details'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94A3B8' }}>
              <Calendar size={32} color="#4B5563" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600 }}>You have no upcoming sessions.</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.25rem' }}>Assigned sessions will appear here when they are scheduled.</div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick Actions List */}
          <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 1rem', fontFamily: "'Outfit', sans-serif" }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button 
                onClick={() => onNavigate('Sessions')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5C84C'; e.currentTarget.style.backgroundColor = 'rgba(245, 200, 76, 0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              >
                <Calendar size={16} color="#F5C84C" />
                <span>View My Sessions</span>
              </button>
              <button 
                onClick={() => onNavigate('Resources')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5C84C'; e.currentTarget.style.backgroundColor = 'rgba(245, 200, 76, 0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              >
                <BookOpenIcon size={16} color="#3B82F6" />
                <span>View Resources Library</span>
              </button>
              <button 
                onClick={() => onNavigate('Notifications')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5C84C'; e.currentTarget.style.backgroundColor = 'rgba(245, 200, 76, 0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              >
                <Bell size={16} color="#10B981" />
                <span>View Notifications</span>
              </button>
            </div>
          </div>

          {/* Recent Activity List */}
          <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Activity size={16} color="#A855F7" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h3>
            </div>
            {recentActivities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {recentActivities.map(act => (
                  <div key={act.id} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ marginTop: '0.2rem' }}>{act.icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.8rem', color: '#E2E8F0' }}>{act.text}</span>
                      <span style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '0.15rem' }}>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#6B7280', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>
                No recent activity yet.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom section: My Sessions Filterable Table/List */}
      <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '2rem', border: '1px solid #1F2937', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>My Sessions</h3>
          
          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {['Upcoming', 'Completed', 'All'].map(tabName => {
              const isSelected = filter === tabName;
              return (
                <button
                  key={tabName}
                  onClick={() => setFilter(tabName)}
                  style={{
                    backgroundColor: isSelected ? '#F5C84C' : 'transparent',
                    border: 'none',
                    color: isSelected ? '#111111' : '#94A3B8',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sessions list */}
        {filteredSessionsList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Session Title</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Programme</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessionsList.map(session => (
                  <tr key={session.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>{session.title}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>{session.programName || 'Programme'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#E2E8F0' }}>{session.date} • {session.time || '10:00 AM'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>{session.type || 'Live Class'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: session.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 200, 76, 0.1)',
                        color: session.status === 'Completed' ? '#10B981' : '#F5C84C'
                      }}>
                        {session.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => onSelectSession(session)}
                        style={{ background: 'none', border: 'none', color: '#F5C84C', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        View <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94A3B8' }}>
            No sessions matching this filter.
          </div>
        )}
      </div>

    </div>
  );
}
