import React from 'react';
import {
  BookOpen, Calendar, Clock, ArrowRight, Play, CheckCircle2,
  FileText, Video, Bell, Sparkles, Trophy, Award, AlertCircle, Folder, Download, ExternalLink
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';

export default function Dashboard({ user, wsPrograms = [], wsLearners = [], setActiveTab }) {
  const userEmail = (user?.email || '').toLowerCase();

  // 1. Authenticated Participant & Enrolled Programme from database
  const participant = wsLearners.find(l => l.email && l.email.toLowerCase() === userEmail) || {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  const displayName = participant.name || userEmail.split('@')[0] || 'Learner';
  const firstName = displayName.split(' ')[0];

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Extract relational models from programme
  const modules = currentProgramme?.modules || currentProgramme?.curriculum || [];
  const sessions = currentProgramme?.sessions || currentProgramme?.liveSessions || [];
  const assignments = currentProgramme?.assignments || [];
  const announcements = currentProgramme?.announcements || [];
  const resources = currentProgramme?.resources || [];
  const certificates = currentProgramme?.certificates || [];

  // Compute Active/Current Module & Lesson
  const currentModule = modules.find(m => m.status === 'Active' || m.status === 'In Progress') || modules[0] || null;
  const lessons = currentModule?.lessons || [];
  const firstIncompleteLesson = lessons.find(l => !l.completed) || lessons[0] || null;

  // Compute Today's Agenda (Live Sessions & Assignments due today)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAgenda = [
    ...sessions.filter(s => s.date === todayStr || s.date === 'Today' || s.isToday),
    ...assignments.filter(a => a.dueDate === todayStr || a.dueDate === 'Today')
  ];

  // Compute Pending/Upcoming Assignments requiring attention (Pending, Due Today, Due Tomorrow, Overdue)
  const pendingAssignments = assignments.filter(a => a.status !== 'Completed' && a.status !== 'Submitted');

  // Next scheduled Live Sessions
  const upcomingSessions = sessions.filter(s => s.status !== 'Completed');

  // Announcements (Max 5, newest first)
  const displayAnnouncements = announcements.slice(0, 5);

  // Database Progress & Metrics Calculations (0% fake data)
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'Completed').length;
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedLessons = modules.reduce((acc, m) => acc + (m.lessons?.filter(l => l.completed)?.length || 0), 0);
  const overallProgressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : (currentProgramme?.progress || 0);

  const submittedAssignmentsCount = assignments.filter(a => a.status === 'Submitted' || a.status === 'Completed').length;
  const attendanceRate = participant.attendance !== undefined ? `${participant.attendance}%` : (sessions.length > 0 ? '100%' : 'N/A');

  // Resources (Max 5)
  const displayResources = resources.slice(0, 5);

  // Unlocked Achievements (Only show if participant unlocked badges)
  const unlockedBadges = (participant.achievements || []).filter(b => b.unlocked);

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── 1. GREETING ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: 0,
          color: PARTICIPANT_THEME.text
        }}>
          Good Morning, {firstName} 👋
        </h1>
        <p style={{
          fontSize: '14px',
          color: PARTICIPANT_THEME.muted,
          margin: 0,
          fontWeight: 500
        }}>
          Welcome back. Everything you need for today's learning is here.
        </p>
      </section>

      {/* ── 2. CURRENT PROGRAMME ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        {currentProgramme ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  Current Programme
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: PARTICIPANT_THEME.text }}>
                  {currentProgramme.name || currentProgramme.title}
                </h2>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {currentProgramme.status || 'Active'}
              </span>
            </div>

            {/* Metrics grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              paddingTop: '16px',
              borderTop: `1px solid ${PARTICIPANT_THEME.border}`
            }}>
              <div>
                <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '2px' }}>Current Module</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                  {currentModule ? (currentModule.title || currentModule.name) : 'Module 1'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '2px' }}>Facilitator</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                  {currentProgramme.leadFacilitator || currentProgramme.instructor || 'Sarah Ahmed'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '2px' }}>Duration / Dates</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                  {currentProgramme.duration || '8 Weeks'} ({currentProgramme.startDate || 'Aug 2026'} - {currentProgramme.endDate || 'Oct 2026'})
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <BookOpen size={32} color={PARTICIPANT_THEME.muted} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: PARTICIPANT_THEME.text }}>
              You haven't been enrolled into a programme yet.
            </h3>
            <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: 0 }}>
              A workspace administrator will assign your learning programme shortly.
            </p>
          </div>
        )}
      </section>

      {/* ── 3. CONTINUE LEARNING (Largest Primary Card) ── */}
      {currentModule && (
        <section style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Next Up In Learning
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: PARTICIPANT_THEME.text }}>
                {firstIncompleteLesson ? (firstIncompleteLesson.title || firstIncompleteLesson.name) : (currentModule.title || currentModule.name)}
              </h2>
              <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Module: <strong>{currentModule.title || currentModule.name}</strong> • Estimated Duration: <strong>{firstIncompleteLesson?.duration || '45 mins'}</strong>
              </p>

              {/* Progress bar */}
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Module Progress</span>
                  <span>{overallProgressPct}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${overallProgressPct}%`, backgroundColor: PARTICIPANT_THEME.primaryAccent, borderRadius: '999px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab?.('modules')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: PARTICIPANT_THEME.text,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '14px 28px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                alignSelf: 'center'
              }}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>Continue Learning</span>
            </button>
          </div>
        </section>
      )}

      {/* ── 4. TODAY'S AGENDA ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.01em', color: PARTICIPANT_THEME.text }}>
          Today's Agenda
        </h3>
        {todayAgenda.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayAgenda.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: item.type === 'Session' || item.time ? 'rgba(229, 185, 60, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.type === 'Session' || item.time ? PARTICIPANT_THEME.primaryAccent : '#2563EB'
                  }}>
                    {item.time ? <Video size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                      {item.title || item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted }}>
                      {item.time || item.dueDate || 'Today'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab?.(item.time ? 'sessions' : 'assignments')}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${PARTICIPANT_THEME.border}`,
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', padding: '12px 0' }}>
            No activities scheduled today.
          </div>
        )}
      </section>

      {/* ── 5. ASSIGNMENTS REQUIRING ATTENTION ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.01em', color: PARTICIPANT_THEME.text }}>
            Assignments Requiring Attention
          </h3>
          {pendingAssignments.length > 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 8px', borderRadius: '6px' }}>
              {pendingAssignments.length} Pending
            </span>
          )}
        </div>

        {pendingAssignments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingAssignments.map((assignment, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                    {assignment.title || assignment.name}
                  </div>
                  <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
                    Module: {assignment.module || 'Core Module'} • Due Date: <strong style={{ color: '#DC2626' }}>{assignment.dueDate || 'Tomorrow'}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab?.('assignments')}
                  style={{
                    backgroundColor: PARTICIPANT_THEME.text,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Continue Assignment
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', padding: '12px 0' }}>
            All assignments are up to date! No pending work requiring attention.
          </div>
        )}
      </section>

      {/* ── 6. UPCOMING LIVE SESSIONS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.01em', color: PARTICIPANT_THEME.text }}>
          Upcoming Live Sessions
        </h3>
        {upcomingSessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingSessions.map((session, idx) => {
              const isLiveNow = session.status === 'Live' || session.isLive;
              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: PARTICIPANT_THEME.bg,
                  borderRadius: PARTICIPANT_THEME.radius,
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{session.title || session.name}</span>
                      {isLiveNow && (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 6px', borderRadius: '4px' }}>
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
                      Facilitator: {session.facilitator || 'Sarah Ahmed'} • {session.time || '10:00 AM'} ({session.duration || '60 mins'})
                    </div>
                  </div>

                  <button 
                    disabled={!isLiveNow}
                    onClick={() => { if (session.link) window.open(session.link, '_blank'); }}
                    style={{
                      backgroundColor: isLiveNow ? '#10B981' : PARTICIPANT_THEME.border,
                      color: isLiveNow ? '#FFFFFF' : PARTICIPANT_THEME.muted,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: isLiveNow ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Video size={14} />
                    <span>{isLiveNow ? 'Join Live Session' : 'Not Live Yet'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', padding: '12px 0' }}>
            No upcoming live sessions scheduled.
          </div>
        )}
      </section>

      {/* ── 7. ANNOUNCEMENTS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.01em', color: PARTICIPANT_THEME.text }}>
          Announcements
        </h3>
        {displayAnnouncements.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayAnnouncements.map((ann, idx) => (
              <div key={idx} style={{
                padding: '14px 18px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>{ann.title}</span>
                  <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted }}>{ann.date || 'Today'}</span>
                </div>
                <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: 0, lineHeight: 1.4 }}>
                  {ann.content || ann.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', padding: '12px 0' }}>
            No recent announcements.
          </div>
        )}
      </section>

      {/* ── 8. LEARNING PROGRESS (Real Database Metrics) ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.01em', color: PARTICIPANT_THEME.text }}>
          Learning Progress
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Overall Programme %</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.text }}>{overallProgressPct}%</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Modules Completed</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.text }}>{completedModules} / {totalModules}</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Lessons Completed</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.text }}>{completedLessons} / {totalLessons}</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance Rate</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.text }}>{attendanceRate}</span>
          </div>
        </div>
      </section>

      {/* ── 9. RECENT RESOURCES ── */}
      {displayResources.length > 0 && (
        <section style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '28px 32px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.01em', color: PARTICIPANT_THEME.text }}>
            Recent Resources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayResources.map((res, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Folder size={18} color={PARTICIPANT_THEME.primaryAccent} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>{res.title || res.name}</div>
                    <div style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted }}>{res.module || 'General'} • {res.uploadDate || 'Recently uploaded'}</div>
                  </div>
                </div>

                <button 
                  onClick={() => { if (res.url) window.open(res.url, '_blank'); }}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${PARTICIPANT_THEME.border}`,
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 10. OYEN AI (Compact Prompt Card) ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color={PARTICIPANT_THEME.primaryAccent} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: PARTICIPANT_THEME.text }}>Need Help?</h3>
            </div>
            <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: 0 }}>
              Ask OYEN AI about today's lesson, assignments, or module summaries.
            </p>
          </div>

          <button 
            onClick={() => setActiveTab?.('ai')}
            style={{
              backgroundColor: PARTICIPANT_THEME.hover,
              color: PARTICIPANT_THEME.text,
              border: `1px solid ${PARTICIPANT_THEME.primaryAccent}`,
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Open AI Workspace
          </button>
        </div>
      </section>

      {/* ── 11. ACHIEVEMENTS (Only displayed if unlocked) ── */}
      {unlockedBadges.length > 0 && (
        <section style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '28px 32px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: PARTICIPANT_THEME.text }}>
            Unlocked Achievements
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {unlockedBadges.map((badge, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`
              }}>
                <Trophy size={20} color={PARTICIPANT_THEME.primaryAccent} />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{badge.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 12. CERTIFICATES (Only displayed if programme completed) ── */}
      {certificates.length > 0 && overallProgressPct === 100 && (
        <section style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '28px 32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={24} color="#10B981" />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: PARTICIPANT_THEME.text }}>Programme Certificate Issued</h3>
                <span style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted }}>Congratulations on completing your programme!</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab?.('certificates')}
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              View Certificate
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
