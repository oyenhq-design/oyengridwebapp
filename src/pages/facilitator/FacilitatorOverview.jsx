import React from 'react';

export default function FacilitatorOverview({ info, programs = [], learners = [], onNavigate, addNotification, onSelectSession }) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Extract all sessions assigned to the logged-in facilitator
  const allSessions = [];
  programs.forEach(p => {
    (p.sessions || []).forEach(s => {
      allSessions.push({
        ...s,
        programName: p.name,
        programId: p.id
      });
    });
  });

  // Filter today's sessions vs upcoming sessions
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaySessions = allSessions.filter(s => {
    const sDate = s.date || '';
    return sDate.toLowerCase().includes('today') || sDate.toLowerCase().includes('25 august') || sDate.toLowerCase().includes(todayStr.toLowerCase());
  });

  const upcomingSessions = allSessions.filter(s => {
    const sDate = s.date || '';
    return !sDate.toLowerCase().includes('today') && !sDate.toLowerCase().includes('25 august') && !sDate.toLowerCase().includes(todayStr.toLowerCase());
  });

  // Today's Focus: the immediate next session
  const todaysFocusSession = todaySessions[0] || null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Good Morning, {info?.fullName || 'Facilitator'} 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Today you have {todaySessions.length} scheduled session(s).
          </p>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          {formattedDate}
        </div>
      </div>

      {/* Today's Focus Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
          Today's Focus
        </h3>

        {todaysFocusSession ? (
          <div 
            style={{ 
              backgroundColor: '#0e0f14', 
              border: '1px solid rgba(245,215,110,0.2)', 
              borderRadius: '16px', 
              padding: '2rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(245,215,110,0.1)', color: '#F5D76E', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                {todaysFocusSession.status || 'Ready to Start'}
              </span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>
                {todaysFocusSession.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {todaysFocusSession.programName}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem' }}>
                <span>⏰ {todaysFocusSession.time || '10:00 AM'}</span>
                <span>⏱️ {todaysFocusSession.duration || '90 mins'}</span>
                <span style={{ color: '#F5D76E', fontWeight: 700 }}>Starts in 18 minutes</span>
              </div>
            </div>

            <button 
              onClick={() => onSelectSession(todaysFocusSession)}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Start Session
            </button>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            No sessions scheduled for today.
          </div>
        )}
      </div>

      {/* Upcoming Sessions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
          Upcoming Sessions
        </h3>

        {upcomingSessions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
            No upcoming sessions scheduled for the next 7 days.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {upcomingSessions.slice(0, 5).map((s, idx) => (
              <div 
                key={s.id || idx} 
                style={{ 
                  backgroundColor: '#0e0f14', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '12px', 
                  padding: '1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '1rem' 
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>{s.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0.2rem 0 0 0' }}>{s.programName}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.45rem' }}>
                    <span>📅 {s.date}</span>
                    <span>⏰ {s.time}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onSelectSession(s)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5D76E'; e.currentTarget.style.color = '#F5D76E'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                >
                  View Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', marginTop: '2rem' }}>
        © 2025 OYEN GRID. All rights reserved.
      </div>
    </div>
  );
}
