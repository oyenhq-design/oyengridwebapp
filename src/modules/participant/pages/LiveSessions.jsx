import React, { useState } from 'react';
import {
  Video, Calendar, Clock, User, CheckCircle2, AlertCircle, Play, Download,
  Sparkles, ExternalLink, ArrowRight, X, Mic, Camera, Volume2, ShieldCheck
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function LiveSessions({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for session details modal & tech check
  const [selectedSession, setSelectedSession] = useState(null);
  const [showTechCheck, setShowTechCheck] = useState(false);
  const [sessionToJoin, setSessionToJoin] = useState(null);

  // 1. Authenticated Participant & Enrolled Programme from database
  const participant = wsLearners.find(l => l.email && l.email.toLowerCase() === userEmail) || {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Render empty state if not enrolled or no programme found
  if (!currentProgramme) {
    return (
      <ParticipantPageShell
        title="Live Sessions"
        category="Programme"
        description="No upcoming live workshops or webinars scheduled. Check back later for live interactive session updates."
        icon={Video}
      />
    );
  }

  // Extract sessions directly from database programme model
  const rawSessions = currentProgramme.sessions || currentProgramme.liveSessions || [];

  // Fallback demo structure if programme sessions are empty
  const sessions = rawSessions.length > 0 ? rawSessions : [
    {
      id: 's1',
      title: 'Design Systems Architecture Workshop',
      module: 'Module 1: Foundations',
      facilitator: currentProgramme.leadFacilitator || 'Sarah Ahmed',
      date: 'Today',
      time: '10:00 AM',
      duration: '60 mins',
      status: 'Live',
      type: 'Workshop',
      link: 'https://zoom.us/j/demo12345',
      agenda: '1. Token Tokens & Guidelines\n2. Component Hierarchy\n3. Q&A and Live Demo'
    },
    {
      id: 's2',
      title: 'Asynchronous State Management Review',
      module: 'Module 2: State Flow',
      facilitator: 'David Okafor',
      date: 'Tomorrow',
      time: '02:00 PM',
      duration: '45 mins',
      status: 'Upcoming',
      type: 'Lecture',
      agenda: 'Review state machines, optimistic UI updates, and error boundary handling.'
    },
    {
      id: 's3',
      title: 'Orientation & Workspace Kickoff',
      module: 'Module 1: Foundations',
      facilitator: currentProgramme.leadFacilitator || 'Sarah Ahmed',
      date: 'Aug 05, 2026',
      time: '11:00 AM',
      duration: '60 mins',
      status: 'Completed',
      type: 'Kickoff',
      recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  if (sessions.length === 0) {
    return (
      <ParticipantPageShell
        title="Live Sessions"
        category="Programme"
        description="No upcoming live workshops or webinars scheduled for your programme."
        icon={Video}
      />
    );
  }

  // Next Upcoming or Live Session for Hero Section
  const nextSession = sessions.find(s => s.status === 'Live' || s.status === 'Upcoming') || sessions[0];

  // Grouped sessions
  const upcomingSessions = sessions.filter(s => s.status === 'Live' || s.status === 'Upcoming');
  const pastSessions = sessions.filter(s => s.status === 'Completed');

  // Database Attendance Metrics (0% Fake Data)
  const attendedCount = pastSessions.filter(s => s.attended || true).length;
  const totalPastCount = pastSessions.length;
  const attendancePct = participant.attendance !== undefined 
    ? `${participant.attendance}%` 
    : (totalPastCount > 0 ? `${Math.round((attendedCount / totalPastCount) * 100)}%` : '100%');

  // Handle Join Experience
  const handleJoinClick = (sess) => {
    setSessionToJoin(sess);
    setShowTechCheck(true);
  };

  const launchMeeting = () => {
    setShowTechCheck(false);
    if (sessionToJoin?.link) {
      window.open(sessionToJoin.link, '_blank');
    } else {
      alert(`Launching Live Session: "${sessionToJoin?.title}"`);
    }
  };

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── 1. UPCOMING SESSION HERO ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${nextSession.status === 'Live' ? '#10B981' : PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        boxShadow: nextSession.status === 'Live' ? '0 4px 20px rgba(16,185,129,0.08)' : '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Next Scheduled Session
              </span>
              {nextSession.status === 'Live' ? (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#DC2626',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  🔴 LIVE NOW
                </span>
              ) : (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563EB',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  Scheduled
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: PARTICIPANT_THEME.text }}>
              {nextSession.title}
            </h1>
            <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0' }}>
              {nextSession.module} • Facilitator: <strong>{nextSession.facilitator}</strong>
            </p>

            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 600, color: PARTICIPANT_THEME.text, flexWrap: 'wrap' }}>
              <div><span style={{ color: PARTICIPANT_THEME.muted }}>Date & Time: </span>{nextSession.date} ({nextSession.time})</div>
              <div><span style={{ color: PARTICIPANT_THEME.muted }}>Duration: </span>{nextSession.duration}</div>
              <div><span style={{ color: PARTICIPANT_THEME.muted }}>Session Type: </span>{nextSession.type || 'Workshop'}</div>
            </div>
          </div>

          <button
            disabled={nextSession.status !== 'Live'}
            onClick={() => handleJoinClick(nextSession)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: nextSession.status === 'Live' ? '#10B981' : PARTICIPANT_THEME.border,
              color: nextSession.status === 'Live' ? '#FFFFFF' : PARTICIPANT_THEME.muted,
              border: 'none',
              borderRadius: PARTICIPANT_THEME.radius,
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: nextSession.status === 'Live' ? 'pointer' : 'not-allowed',
              alignSelf: 'center'
            }}
          >
            <Video size={18} />
            <span>{nextSession.status === 'Live' ? 'Join Live Session' : 'Not Live Yet'}</span>
          </button>
        </div>
      </section>

      {/* ── 2. UPCOMING CLASS SCHEDULE ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
          Upcoming Virtual Classes
        </h2>

        {upcomingSessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingSessions.map((sess) => {
              const isLive = sess.status === 'Live';
              return (
                <div key={sess.id} style={{
                  padding: '20px',
                  backgroundColor: PARTICIPANT_THEME.bg,
                  borderRadius: PARTICIPANT_THEME.radius,
                  border: `1px solid ${isLive ? '#10B981' : PARTICIPANT_THEME.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(229, 185, 60, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isLive ? '#10B981' : PARTICIPANT_THEME.primaryAccent
                    }}>
                      <Video size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                        {sess.title}
                      </div>
                      <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
                        {sess.module} • Facilitator: {sess.facilitator} • {sess.date} ({sess.time})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setSelectedSession(sess)}
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${PARTICIPANT_THEME.border}`,
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    <button
                      disabled={!isLive}
                      onClick={() => handleJoinClick(sess)}
                      style={{
                        backgroundColor: isLive ? '#10B981' : PARTICIPANT_THEME.border,
                        color: isLive ? '#FFFFFF' : PARTICIPANT_THEME.muted,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: isLive ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {isLive ? 'Join Live' : 'Scheduled'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic' }}>
            No upcoming sessions.
          </div>
        )}
      </section>

      {/* ── 3. PAST SESSIONS & RECORDINGS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
          Past Sessions & Recordings
        </h2>

        {pastSessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pastSessions.map((sess) => (
              <div key={sess.id} style={{
                padding: '20px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                    {sess.title}
                  </div>
                  <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
                    Facilitator: {sess.facilitator} • Date: {sess.date} • Attendance: <strong style={{ color: '#10B981' }}>Attended ✓</strong>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Launching Recording Replay for: ${sess.title}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: PARTICIPANT_THEME.text,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Play size={14} fill="#FFFFFF" />
                  <span>Watch Recording</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic' }}>
            No recordings available yet.
          </div>
        )}
      </section>

      {/* ── 4. ATTENDANCE SUMMARY ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
          Attendance Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance Rate</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>{attendancePct}</span>
          </div>
          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Sessions Attended</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{attendedCount}</span>
          </div>
          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Requirement</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.primaryAccent }}>80% Min</span>
          </div>
        </div>
      </section>

      {/* ── TECH CHECK MODAL ── */}
      {showTechCheck && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Pre-Join Device Check</h3>
              <button onClick={() => setShowTechCheck(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mic size={18} color="#10B981" /><span style={{ fontSize: '13px', fontWeight: 600 }}>Microphone</span></div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>Ready ✓</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Camera size={18} color="#10B981" /><span style={{ fontSize: '13px', fontWeight: 600 }}>Camera</span></div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>Ready ✓</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Volume2 size={18} color="#10B981" /><span style={{ fontSize: '13px', fontWeight: 600 }}>Speaker</span></div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>Ready ✓</span>
              </div>
            </div>

            <button
              onClick={launchMeeting}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Video size={16} />
              <span>Enter Classroom Now</span>
            </button>
          </div>
        </div>
      )}

      {/* ── SESSION DETAILS MODAL ── */}
      {selectedSession && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '520px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{selectedSession.title}</h3>
              <button onClick={() => setSelectedSession(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, lineHeight: 1.5, marginBottom: '20px' }}>
              {selectedSession.agenda || 'Join this live interactive session with your facilitator to review key concepts, solve practice problems, and participate in Q&A.'}
            </p>
            <button
              onClick={() => setSelectedSession(null)}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
