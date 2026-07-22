import React from 'react';

export default function TeamMemberOverview({ info, programs = [], learners = [], onNavigate, addNotification }) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const mockTasks = [
    { id: 1, label: 'Learners awaiting approval', count: 2, icon: '👥' },
    { id: 2, label: 'Resources awaiting upload', count: 3, icon: '📄' },
    { id: 3, label: 'Upcoming sessions scheduled', count: 1, icon: '📅' },
    { id: 4, label: 'Certificates pending generation', count: 4, icon: '🎓' },
    { id: 5, label: 'Attendance records awaiting verification', count: 2, icon: '✓' }
  ];

  const mockActivity = [
    { id: 1, text: 'Learner registered: John Doe for Leadership Development', time: '10m ago' },
    { id: 2, text: 'Resource uploaded: Project_Milestones.pdf to Project Management', time: '1h ago' },
    { id: 3, text: 'Attendance verified for Emotional Intelligence Session 1', time: '2h ago' },
    { id: 4, text: 'Certificate generated for Sarah Smith (Vite Bootcamp)', time: 'Yesterday' },
    { id: 5, text: 'Announcement published: Deadline extension for final exam', time: 'Yesterday' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Good morning, {info?.fullName || 'Team Member'} 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Support your organization's daily program operations from one place.
          </p>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          {formattedDate}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: '2rem' }}>
        
        {/* Left Column: Assigned Programs & Today's Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Assigned Programs Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Assigned Programs
            </h3>

            {programs.length === 0 ? (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: '#0e0f14',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  No programs assigned yet.
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0, maxWidth: '400px', lineHeight: 1.5 }}>
                  Programs assigned by your Organization Owner or Program Manager will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {programs.map((p, idx) => {
                  const programLearnersCount = learners.filter(l => l.program === p.name).length;
                  const sessionsCount = p.sessions ? p.sessions.length : 0;
                  const resourcesCount = p.resources ? p.resources.length : 0;

                  return (
                    <div 
                      key={p.id || idx} 
                      style={{ 
                        backgroundColor: '#0e0f14', 
                        border: '1px solid rgba(255,255,255,0.06)', 
                        borderRadius: '14px', 
                        padding: '1.25rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,215,110,0.25)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                          {p.name}
                        </h4>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          Active
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>👥</span> <strong>{programLearnersCount}</strong> Learners
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>📅</span> <strong>{sessionsCount}</strong> Sessions
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>📄</span> <strong>{resourcesCount}</strong> Resources
                        </div>
                      </div>

                      <button 
                        onClick={() => onNavigate('Assigned Programs')}
                        style={{ 
                          marginTop: 'auto', 
                          width: '100%', 
                          padding: '0.55rem', 
                          backgroundColor: 'transparent', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          borderRadius: '8px', 
                          fontSize: '0.78rem', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5D76E'; e.currentTarget.style.color = '#F5D76E'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                      >
                        Open Program →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Today's Tasks
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {mockTasks.map(t => (
                <div key={t.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>{t.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{t.label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F5D76E', marginTop: '0.15rem' }}>{t.count} pending</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Recent Activity
          </h3>
          
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mockActivity.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚙️</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{a.text}</p>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem', display: 'block' }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', marginTop: '2rem' }}>
        © 2025 OYEN GRID. All rights reserved.
      </div>
    </div>
  );
}
