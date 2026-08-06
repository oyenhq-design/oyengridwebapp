import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Calendar, Play, CheckCircle2, AlertCircle, Clock, 
  ArrowRight, MoreHorizontal, User, FileText, Check, X,
  ExternalLink, Download, Copy, Share2, Award, Users, Trash
} from 'lucide-react';

export default function SessionsPage({ wsPrograms = [], setWsPrograms }) {
  // Extract all sessions from programs to get full mock list
  const initialSessions = useMemo(() => {
    const list = [];
    wsPrograms.forEach(p => {
      const sess = p.sessions || [];
      sess.forEach(s => {
        // Calculate a readiness score mock
        let readinessScore = 100;
        const checks = [
          { label: 'Facilitator assigned', status: true },
          { label: 'Resources uploaded', status: true },
          { label: 'Participants notified', status: true },
          { label: 'Attendance ready', status: true }
        ];

        if (s.title.includes('Solar')) {
          readinessScore = 72;
          checks[1] = { label: 'Resources missing', status: false };
          checks[2] = { label: 'Reminder not sent', status: false };
        } else if (s.title.includes('Wind')) {
          readinessScore = 50;
          checks[0] = { label: 'Facilitator not confirmed', status: false };
          checks[3] = { label: 'Attendance not prepared', status: false };
        }

        list.push({
          id: s.id || Math.random().toString(),
          title: s.title,
          programName: p.name || p.title,
          programId: p.id,
          facilitatorName: s.facilitatorName || 'John David',
          participantsCount: p.learners?.length || p.enrolledLearners?.length || 24,
          time: s.startTime ? `${s.date} ${s.startTime}` : 'Today 10:00',
          rawDate: s.date || new Date().toISOString().split('T')[0],
          status: s.status === 'Completed' ? 'Completed' : s.status === 'Live' ? 'Live' : 'Scheduled',
          readinessScore,
          checks,
          presentCount: Math.max(10, Math.floor(Math.random() * 24)),
          absentCount: Math.floor(Math.random() * 5),
          resources: p.resources || []
        });
      });
    });

    // Add high quality defaults if none exist
    if (list.length === 0) {
      list.push(
        {
          id: '1',
          title: 'Battery Storage Systems',
          programName: 'Battery Storage Bootcamp',
          facilitatorName: 'John David',
          participantsCount: 24,
          time: 'Today 10:00',
          rawDate: new Date().toISOString().split('T')[0],
          status: 'Live',
          readinessScore: 100,
          checks: [
            { label: 'Facilitator assigned', status: true },
            { label: 'Resources uploaded', status: true },
            { label: 'Participants notified', status: true },
            { label: 'Attendance ready', status: true }
          ],
          presentCount: 21,
          absentCount: 3,
          resources: [{ name: 'Week 3 Slides' }]
        },
        {
          id: '2',
          title: 'Solar Grid Integration Design',
          programName: 'Solar Tech Fellowship',
          facilitatorName: 'Sarah Jenkins',
          participantsCount: 18,
          time: 'Tomorrow 14:00',
          rawDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          status: 'Scheduled',
          readinessScore: 72,
          checks: [
            { label: 'Facilitator assigned', status: true },
            { label: 'Resources missing', status: false },
            { label: 'Reminder not sent', status: false },
            { label: 'Attendance ready', status: true }
          ],
          presentCount: 0,
          absentCount: 0,
          resources: []
        },
        {
          id: '3',
          title: 'Week 4 Operational Review',
          programName: 'Smart Grid Fellowship',
          facilitatorName: 'Michael Brown',
          participantsCount: 32,
          time: 'Yesterday 09:00',
          rawDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          status: 'Completed',
          readinessScore: 100,
          checks: [
            { label: 'Facilitator assigned', status: true },
            { label: 'Resources uploaded', status: true },
            { label: 'Participants notified', status: true },
            { label: 'Attendance ready', status: true }
          ],
          presentCount: 30,
          absentCount: 2,
          resources: [{ name: 'Week 4 Review slides' }]
        }
      );
    }
    return list;
  }, [wsPrograms]);

  const [sessions, setSessions] = useState(initialSessions);
  const [activeMainTab, setActiveMainTab] = useState('All');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // OYEN AI dynamic toast banner recommendations
  const [aiBannerTasks, setAiBannerTasks] = useState([
    { id: 1, text: 'Solar Grid Integration Design begins in 45 minutes.', actionText: 'Check Readiness' },
    { id: 2, text: 'Attendance has not been marked for yesterday\'s session.', actionText: 'Mark Attendance' },
    { id: 3, text: 'Upload Week 3 presentation slides before 2 PM.', actionText: 'Upload Slide' }
  ]);

  // Bottom right floating Oyen AI notification state
  const [floatingOyenAi, setFloatingOyenAi] = useState(null);

  // Form states for new session
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionProgram, setNewSessionProgram] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('');
  const [newSessionFacilitator, setNewSessionFacilitator] = useState('');

  // Handle new session scheduling
  const handleScheduleSession = (e) => {
    e.preventDefault();
    if (!newSessionTitle || !newSessionProgram) return;

    const newSess = {
      id: Date.now().toString(),
      title: newSessionTitle,
      programName: newSessionProgram,
      facilitatorName: newSessionFacilitator || 'Sarah Jenkins',
      participantsCount: 20,
      time: `${newSessionDate || 'Tomorrow'} ${newSessionTime || '10:00'}`,
      rawDate: newSessionDate || new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      readinessScore: 72,
      checks: [
        { label: 'Facilitator assigned', status: true },
        { label: 'Resources missing', status: false },
        { label: 'Reminder not sent', status: false },
        { label: 'Attendance ready', status: true }
      ],
      presentCount: 0,
      absentCount: 0,
      resources: []
    };

    setSessions([newSess, ...sessions]);
    setShowScheduleModal(false);
    
    // Show success toast
    setToastMessage('✓ Session scheduled successfully.');
    setTimeout(() => setToastMessage(null), 3500);

    // Trigger OYEN AI Toast after 2 seconds
    setTimeout(() => {
      setFloatingOyenAi({
        title: 'Your session is ready.',
        message: 'Upload learning materials before notifying participants.',
        actionLabel: 'Upload Resources',
        action: () => {
          setFloatingOyenAi(null);
          setToastMessage('Redirected to upload resources.');
          setTimeout(() => setToastMessage(null), 2500);
        }
      });
    }, 2000);

    // Reset fields
    setNewSessionTitle('');
    setNewSessionProgram('');
    setNewSessionDate('');
    setNewSessionTime('');
    setNewSessionFacilitator('');
  };

  // Tab Filtering
  const filteredSessions = useMemo(() => {
    if (activeMainTab === 'All') return sessions;
    return sessions.filter(s => s.status.toLowerCase() === activeMainTab.toLowerCase());
  }, [sessions, activeMainTab]);

  // Counters computation
  const stats = useMemo(() => {
    return {
      upcoming: sessions.filter(s => s.status === 'Scheduled').length,
      live: sessions.filter(s => s.status === 'Live').length,
      completed: sessions.filter(s => s.status === 'Completed').length,
      attendanceDue: sessions.filter(s => s.status === 'Completed' && s.presentCount === 0).length + 1,
      pendingRecording: sessions.filter(s => s.status === 'Completed').length ? 1 : 0
    };
  }, [sessions]);

  return (
    <div style={{ padding: '2.5rem 3rem', minHeight: '100%', position: 'relative', display: 'flex', gap: '2.5rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          backgroundColor: '#10B981',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          borderRadius: '10px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          animation: 'slideInRight 0.25s ease'
        }}>
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* Floating OYEN AI Toast Banner */}
      {floatingOyenAi && (
        <div style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          width: '350px',
          backgroundColor: '#090a0f',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '18px',
          padding: '1.25rem 1.5rem',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          backdropFilter: 'blur(16px)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Clock size={13} /> ✨ OYEN AI
            </span>
            <button 
              onClick={() => setFloatingOyenAi(null)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 700 }}>{floatingOyenAi.title}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{floatingOyenAi.message}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            <button 
              onClick={floatingOyenAi.action}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#D4AF37', border: 'none', borderRadius: '6px', color: '#000000', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {floatingOyenAi.actionLabel}
            </button>
            <button 
              onClick={() => setFloatingOyenAi(null)}
              style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* Left Operations Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Sessions</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.95rem' }}>
              Manage all scheduled, live, and completed sessions for your assigned programmes.
            </p>
          </div>
          <button 
            onClick={() => setShowScheduleModal(true)}
            style={{
              padding: '0.7rem 1.4rem',
              backgroundColor: '#F4C542',
              color: '#111111',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(244,197,66,0.3)'
            }}
          >
            <Plus size={16} /> Schedule Session
          </button>
        </div>

        {/* AI Operational Banner */}
        <div style={{
          backgroundColor: '#FFFBEA',
          border: '1px solid #F4C542',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D8A325', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>✨ OYEN AI</span> • <span style={{ color: '#6B7280' }}>Today's Priorities</span>
          </div>

          {aiBannerTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {aiBannerTasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#2D2D2D' }}>
                  <span style={{ color: '#F4C542' }}>•</span>
                  <span>{task.text}</span>
                </div>
              ))}
              <button 
                onClick={() => {
                  setToastMessage('Opened AI Task Operations Review.');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#D8A325',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0
                }}
              >
                Review Tasks <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.88rem', color: '#16a34a', fontWeight: 600 }}>
              Everything looks good. No immediate action required.
            </div>
          )}
        </div>

        {/* Session Summary Block */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { label: 'Upcoming', value: stats.upcoming, color: '#D8A325' },
            { label: 'Live', value: stats.live, color: '#10B981' },
            { label: 'Completed', value: stats.completed, color: '#3B82F6' },
            { label: 'Attendance Due', value: stats.attendanceDue, color: '#EF4444' },
            { label: 'Pending Recording', value: stats.pendingRecording, color: '#6B7280' }
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #EBE5D9',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</span>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Main Tab Controls */}
        <div style={{ display: 'flex', borderBottom: '1px solid #EBE5D9', paddingBottom: '0.25rem' }}>
          {['All', 'Upcoming', 'Live', 'Completed', 'Draft', 'Cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.6rem 1.1rem',
                fontSize: '0.88rem',
                fontWeight: activeMainTab === tab ? 700 : 500,
                color: activeMainTab === tab ? '#111111' : '#6B7280',
                borderBottom: activeMainTab === tab ? '2px solid #F4C542' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table & Empty State */}
        {filteredSessions.length > 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #EBE5D9',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EBE5D9', backgroundColor: '#FAFAF8' }}>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Session</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Programme</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Facilitator</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Participants</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(session => (
                  <tr 
                    key={session.id} 
                    onClick={() => setSelectedSession(session)}
                    style={{ borderBottom: '1px solid #EBE5D9', cursor: 'pointer', transition: 'background-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: '#111111' }}>{session.title}</div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: session.readinessScore >= 80 ? '#10B981' : '#D8A325',
                        marginTop: '0.25rem'
                      }}>
                        <span>{session.readinessScore >= 80 ? '🟢' : '🟡'}</span>
                        <span>{session.readinessScore}% Ready</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.programName}</td>
                    <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.facilitatorName}</td>
                    <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.participantsCount}</td>
                    <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.time}</td>
                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        backgroundColor: session.status === 'Live' ? 'rgba(16,185,129,0.1)' : session.status === 'Completed' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                        color: session.status === 'Live' ? '#10B981' : session.status === 'Completed' ? '#3B82F6' : '#F59E0B'
                      }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          backgroundColor: session.status === 'Live' ? '#10B981' : session.status === 'Completed' ? '#3B82F6' : '#F59E0B'
                        }} />
                        {session.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                      <button 
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: session.status === 'Live' ? '#10B981' : '#F5F2ED',
                          color: session.status === 'Live' ? '#ffffff' : '#111111',
                          border: session.status === 'Live' ? 'none' : '1px solid #EBE5D9',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {session.status === 'Live' ? 'Open' : session.status === 'Completed' ? 'Report' : 'Manage'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #EBE5D9',
            borderRadius: '16px'
          }}>
            <span style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>📅</span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 700 }}>No sessions have been scheduled.</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6B7280', fontSize: '0.88rem', maxWidth: '350px' }}>
              Create your first learning session to begin delivering your programme.
            </p>
            <button 
              onClick={() => setShowScheduleModal(true)}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#F4C542',
                color: '#111111',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Schedule First Session
            </button>
          </div>
        )}

      </div>

      {/* Right Sidebar Block */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '2rem', flexShrink: 0 }}>
        
        {/* Today's Timeline */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #EBE5D9',
          borderRadius: '16px',
          padding: '1.25rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Today's Timeline</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', width: '50px' }}>09:00</span>
              <div style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111' }}>Battery Storage</div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981' }}>LIVE</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', width: '50px' }}>11:30</span>
              <div style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#6B7280' }}>Break</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', width: '50px' }}>13:00</span>
              <div style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111' }}>Solar Design</div>
                <span style={{ fontSize: '0.65rem', color: '#D8A325', fontWeight: 600 }}>Starts in 2h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks Panel */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #EBE5D9',
          borderRadius: '16px',
          padding: '1.25rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Pending Tasks</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Attendance', detail: '2 sessions', action: 'Review' },
              { label: 'Recording', detail: '1 recording', action: 'Upload' },
              { label: 'Resources', detail: 'Week 4 slides missing', action: 'Upload' }
            ].map(task => (
              <div key={task.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#FAFAF8',
                border: '1px solid #EBE5D9',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111111' }}>{task.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.1rem' }}>{task.detail}</div>
                </div>
                <button 
                  onClick={() => {
                    setToastMessage(`Navigated to ${task.label} Operations Center.`);
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#D8A325',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.15rem'
                  }}
                >
                  {task.action} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #EBE5D9',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Quick Actions</h3>
          {[
            { label: 'Schedule Session', action: () => setShowScheduleModal(true) },
            { label: 'Duplicate Session', action: () => {
              if (sessions.length) {
                setSessions([{ ...sessions[0], id: Date.now().toString(), title: `${sessions[0].title} Copy` }, ...sessions]);
                setToastMessage('✓ Session duplicated successfully.');
                setTimeout(() => setToastMessage(null), 2500);
              }
            }},
            { label: 'Import Calendar', action: () => alert('Calendar synced successfully.') },
            { label: 'Generate Attendance Report', action: () => alert('Attendance report generated & downloaded.') },
            { label: 'Export Session List', action: () => alert('Export completed successfully.') }
          ].map((act, i) => (
            <button
              key={i}
              onClick={act.action}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                backgroundColor: '#FAFAF8',
                border: '1px solid #EBE5D9',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#2D2D2D',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F4C542'; e.currentTarget.style.color = '#111111'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FAFAF8'; e.currentTarget.style.color = '#2D2D2D'; }}
            >
              {act.label}
            </button>
          ))}
        </div>

      </div>

      {/* Notion/Linear Style Session Detail Right Drawer */}
      {selectedSession && (
        <>
          <div 
            onClick={() => setSelectedSession(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(3px)',
              zIndex: 900
            }}
          />
          <aside style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '450px',
            backgroundColor: '#ffffff',
            borderLeft: '1px solid #EBE5D9',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.08)',
            zIndex: 901,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.25s ease'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #EBE5D9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedSession.title}</h2>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Session Setup Dashboard</span>
              </div>
              <button 
                onClick={() => setSelectedSession(null)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Score / Setup completeness indicator */}
              <div style={{
                backgroundColor: selectedSession.readinessScore >= 80 ? '#ECFDF5' : '#FFFBEA',
                border: `1px solid ${selectedSession.readinessScore >= 80 ? '#A7F3D0' : '#FDE68A'}`,
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Setup Checklist</span>
                  <span style={{ fontWeight: 800, color: selectedSession.readinessScore >= 80 ? '#059669' : '#D97706' }}>{selectedSession.readinessScore}% Ready</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {selectedSession.checks.map((chk, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                      <span style={{ color: chk.status ? '#10B981' : '#F59E0B' }}>{chk.status ? '✓' : '⚠'}</span>
                      <span style={{ color: chk.status ? '#2D2D2D' : '#6B7280', textDecoration: chk.status ? 'none' : 'line-through' }}>{chk.label}</span>
                    </div>
                  ))}
                </div>
                {selectedSession.readinessScore < 100 && (
                  <button 
                    onClick={() => {
                      const updated = sessions.map(s => {
                        if (s.id === selectedSession.id) {
                          return {
                            ...s,
                            readinessScore: 100,
                            checks: s.checks.map(c => ({ ...c, status: true }))
                          };
                        }
                        return s;
                      });
                      setSessions(updated);
                      setSelectedSession({
                        ...selectedSession,
                        readinessScore: 100,
                        checks: selectedSession.checks.map(c => ({ ...c, status: true }))
                      });
                      setToastMessage('✓ Session setup completed successfully.');
                      setTimeout(() => setToastMessage(null), 2500);
                    }}
                    style={{
                      marginTop: '0.75rem',
                      width: '100%',
                      padding: '0.45rem',
                      backgroundColor: '#F4C542',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    Complete Setup
                  </button>
                )}
              </div>

              {/* Attributes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Status</span>
                  <span style={{ fontWeight: 700, color: selectedSession.status === 'Live' ? '#10B981' : '#3B82F6' }}>{selectedSession.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Programme</span>
                  <span style={{ fontWeight: 600 }}>{selectedSession.programName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Facilitator</span>
                  <span style={{ fontWeight: 600 }}>{selectedSession.facilitatorName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Participants</span>
                  <span style={{ fontWeight: 600 }}>{selectedSession.participantsCount} enrolled</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Attendance</span>
                  <span style={{ fontWeight: 600 }}>{selectedSession.presentCount} Present, {selectedSession.absentCount} Absent</span>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid #EBE5D9' }} />

              {/* Resources Checklist */}
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', fontWeight: 800 }}>Learning Resources</h4>
                {selectedSession.resources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selectedSession.resources.map((res, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#2D2D2D' }}>
                        <FileText size={14} color="#6B7280" />
                        <span>{res.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#6B7280', fontStyle: 'italic' }}>No slides or materials uploaded yet.</span>
                )}
              </div>

              {/* Recording status */}
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', fontWeight: 800 }}>Meeting Recording</h4>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  {selectedSession.status === 'Completed' ? '✓ Recording saved and synced to workspace.' : 'Recording... (will begin when host opens room)'}
                </span>
              </div>
            </div>

            {/* Drawer Actions Footer */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid #EBE5D9',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              backgroundColor: '#FAFAF8'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button 
                  onClick={() => {
                    const updated = sessions.map(s => {
                      if (s.id === selectedSession.id) {
                        return {
                          ...s,
                          status: 'Completed',
                          presentCount: s.participantsCount - 1,
                          absentCount: 1
                        };
                      }
                      return s;
                    });
                    setSessions(updated);
                    setSelectedSession(null);
                    setToastMessage('✓ Attendance sheet saved successfully.');
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  style={{ padding: '0.65rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '8px', color: '#000000', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Mark Attendance
                </button>
                <button 
                  onClick={() => alert('Calendar notification reminder sent to participants.')}
                  style={{ padding: '0.65rem', backgroundColor: '#FFFFFF', border: '1px solid #EBE5D9', borderRadius: '8px', color: '#111111', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Notify Participants
                </button>
              </div>
              <button 
                onClick={() => {
                  const updated = sessions.map(s => s.id === selectedSession.id ? { ...s, status: s.status === 'Live' ? 'Completed' : 'Live' } : s);
                  setSessions(updated);
                  setSelectedSession(null);
                  setToastMessage('✓ Session status updated successfully.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                style={{ padding: '0.65rem', backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                {selectedSession.status === 'Live' ? 'End Session' : 'Open Live Room'}
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <>
          <div 
            onClick={() => setShowScheduleModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(3px)',
              zIndex: 990
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            zIndex: 991,
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Schedule Session</h2>
                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Configure a new session operations workflow.</span>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleScheduleSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Session Title *
                </label>
                <input 
                  type="text" 
                  value={newSessionTitle} 
                  onChange={e => setNewSessionTitle(e.target.value)} 
                  placeholder="e.g. Battery Chemistry deep-dive" 
                  required 
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #EBE5D9', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Assigned Programme *
                </label>
                <select 
                  value={newSessionProgram} 
                  onChange={e => setNewSessionProgram(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #EBE5D9', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#ffffff' }}
                >
                  <option value="">Select Programme...</option>
                  <option value="Battery Storage Bootcamp">Battery Storage Bootcamp</option>
                  <option value="Solar Tech Fellowship">Solar Tech Fellowship</option>
                  <option value="Smart Grid Fellowship">Smart Grid Fellowship</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                    Date
                  </label>
                  <input 
                    type="date" 
                    value={newSessionDate} 
                    onChange={e => setNewSessionDate(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #EBE5D9', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                    Time
                  </label>
                  <input 
                    type="time" 
                    value={newSessionTime} 
                    onChange={e => setNewSessionTime(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #EBE5D9', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Assigned Facilitator
                </label>
                <input 
                  type="text" 
                  value={newSessionFacilitator} 
                  onChange={e => setNewSessionFacilitator(e.target.value)} 
                  placeholder="e.g. Sarah Jenkins" 
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #EBE5D9', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)} 
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '0.75rem 1.75rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '10px', color: '#111111', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
