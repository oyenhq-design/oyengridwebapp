import React, { useState } from 'react';
import {
  BookOpen, Play, Calendar, Clock, User, Mail, Award, CheckCircle2,
  FileText, Video, Folder, Download, Sparkles, AlertCircle, MessageSquare,
  ChevronRight, Layers, Trophy, CheckSquare, ExternalLink, ArrowRight
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Programme({ user, wsPrograms = [], wsLearners = [], setActiveTab }) {
  const userEmail = (user?.email || '').toLowerCase();
  const [activeSubTab, setActiveSubTab] = useState('Overview');

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

  // Render empty state if not enrolled in any programme
  if (!currentProgramme) {
    return (
      <ParticipantPageShell
        title="My Programme"
        category="Programme"
        description="You are currently not assigned to any active learning programme. Your programme outline, handbook, and roadmap will appear here when assigned by your administrator."
        icon={BookOpen}
      />
    );
  }

  // Relational data models extracted directly from database
  const modules = currentProgramme.modules || currentProgramme.curriculum || [];
  const sessions = currentProgramme.sessions || currentProgramme.liveSessions || [];
  const assignments = currentProgramme.assignments || [];
  const assessments = currentProgramme.assessments || [];
  const announcements = currentProgramme.announcements || [];
  const resources = currentProgramme.resources || [];
  const facilitators = currentProgramme.facilitators || [
    {
      name: currentProgramme.leadFacilitator || currentProgramme.instructor || 'Sarah Ahmed',
      role: 'Lead Facilitator',
      bio: 'Senior Technical Lead & Educator with over 10 years of industry experience.',
      email: 'sarah.ahmed@abcenergy.com'
    }
  ];
  const certificates = currentProgramme.certificates || [];
  const discussions = currentProgramme.discussions || [];

  // Database Progress & Calculations
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'Completed').length;
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedLessons = modules.reduce((acc, m) => acc + (m.lessons?.filter(l => l.completed)?.length || 0), 0);
  const overallProgressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : (currentProgramme.progress || 0);

  const submittedAssignmentsCount = assignments.filter(a => a.status === 'Submitted' || a.status === 'Completed').length;
  const passedAssessmentsCount = assessments.filter(a => a.status === 'Passed' || a.status === 'Completed').length;
  const attendanceRate = participant.attendance !== undefined ? `${participant.attendance}%` : (sessions.length > 0 ? '100%' : 'N/A');

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── SECTION 1 — PROGRAMME HERO ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Enrolled Programme
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {currentProgramme.status || 'Active'}
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
              {currentProgramme.name || currentProgramme.title}
            </h1>
            <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {currentProgramme.description || 'Comprehensive training curriculum engineered to build mastery through hands-on modules and live expert guidance.'}
            </p>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: PARTICIPANT_THEME.text, fontWeight: 600 }}>
              <div><span style={{ color: PARTICIPANT_THEME.muted, fontWeight: 500 }}>Duration: </span>{currentProgramme.duration || '8 Weeks'}</div>
              <div><span style={{ color: PARTICIPANT_THEME.muted, fontWeight: 500 }}>Timeline: </span>{currentProgramme.startDate || 'Aug 2026'} - {currentProgramme.endDate || 'Oct 2026'}</div>
              <div><span style={{ color: PARTICIPANT_THEME.muted, fontWeight: 500 }}>Current Progress: </span>{overallProgressPct}%</div>
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
              cursor: 'pointer'
            }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>Continue Learning</span>
          </button>
        </div>
      </section>

      {/* ── SECTION 2 — PROGRAMME OVERVIEW & DESCRIPTION ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
          Programme Handbook & Objectives
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Overview & Outcomes
            </h3>
            <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, lineHeight: 1.6, margin: 0 }}>
              {currentProgramme.overview || 'This programme equips participants with actionable technical skills, real-world case study experience, and guided mentorship.'}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Skills Learner Will Gain
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(currentProgramme.skills || ['Problem Solving', 'Strategic Design', 'Industry Workflows', 'Collaboration']).map((skill, idx) => (
                <span key={idx} style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '6px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — FACILITATORS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
          Programme Facilitators
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {facilitators.map((fac, idx) => (
            <div key={idx} style={{
              padding: '20px',
              backgroundColor: PARTICIPANT_THEME.bg,
              borderRadius: PARTICIPANT_THEME.radius,
              border: `1px solid ${PARTICIPANT_THEME.border}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: PARTICIPANT_THEME.primaryAccent,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px'
                }}>
                  {(fac.name?.[0] || 'F').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>{fac.name}</div>
                  <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, fontWeight: 500 }}>{fac.role || 'Facilitator'}</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: 0, lineHeight: 1.4 }}>
                {fac.bio}
              </p>
              <button
                onClick={() => setActiveTab?.('messages')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Mail size={14} />
                <span>Send Message</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4 — MODULES OVERVIEW ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Programme Modules & Roadmap
          </h2>
          <button onClick={() => setActiveTab?.('modules')} style={{ background: 'none', border: 'none', color: PARTICIPANT_THEME.primaryAccent, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            View Full Course Player →
          </button>
        </div>

        {modules.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {modules.map((mod, idx) => {
              const isCompleted = mod.status === 'Completed';
              const isActive = mod.status === 'Active' || mod.status === 'In Progress';
              return (
                <div 
                  key={idx} 
                  onClick={() => setActiveTab?.('modules')}
                  style={{
                    padding: '18px 20px',
                    backgroundColor: PARTICIPANT_THEME.bg,
                    borderRadius: PARTICIPANT_THEME.radius,
                    border: `1px solid ${isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10B981' : (isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border),
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                        {mod.title || mod.name}
                      </div>
                      <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
                        {mod.description || `${mod.lessons?.length || 4} Lessons`} • {mod.duration || '2 Hours'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isCompleted ? '#10B981' : (isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted)
                    }}>
                      {isCompleted ? 'Completed' : (isActive ? 'In Progress' : 'Upcoming')}
                    </span>
                    <ChevronRight size={16} color={PARTICIPANT_THEME.muted} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', padding: '12px 0' }}>
            No modules have been published yet by your programme manager.
          </div>
        )}
      </section>

      {/* ── SECTION 5 — LIVE SESSIONS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
          Programme Live Sessions
        </h2>
        {sessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((sess, idx) => (
              <div key={idx} style={{
                padding: '16px',
                backgroundColor: PARTICIPANT_THEME.bg,
                borderRadius: PARTICIPANT_THEME.radius,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                    {sess.title || sess.name}
                  </div>
                  <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
                    Facilitator: {sess.facilitator || 'Sarah Ahmed'} • {sess.date || 'Upcoming'} ({sess.time || '10:00 AM'})
                  </div>
                </div>

                <button
                  disabled={sess.status !== 'Live'}
                  onClick={() => { if (sess.link) window.open(sess.link, '_blank'); }}
                  style={{
                    backgroundColor: sess.status === 'Live' ? '#10B981' : PARTICIPANT_THEME.border,
                    color: sess.status === 'Live' ? '#FFFFFF' : PARTICIPANT_THEME.muted,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: sess.status === 'Live' ? 'pointer' : 'not-allowed'
                  }}
                >
                  {sess.status === 'Live' ? 'Join Live Meeting' : 'Not Live Yet'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', padding: '12px 0' }}>
            No live sessions scheduled.
          </div>
        )}
      </section>

      {/* ── SECTION 6 — ASSIGNMENTS & ASSESSMENTS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Assignments */}
        <section style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '28px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
            Assignments
          </h3>
          {assignments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {assignments.map((ass, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  backgroundColor: PARTICIPANT_THEME.bg,
                  borderRadius: PARTICIPANT_THEME.radius,
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{ass.title || ass.name}</div>
                    <div style={{ fontSize: '11.5px', color: PARTICIPANT_THEME.muted }}>Due: {ass.dueDate || 'Next week'}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: ass.status === 'Submitted' ? '#10B981' : '#F59E0B' }}>
                    {ass.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic' }}>
              No assignments available.
            </div>
          )}
        </section>

        {/* Assessments */}
        <section style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '28px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
            Assessments & Quizzes
          </h3>
          {assessments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {assessments.map((quiz, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  backgroundColor: PARTICIPANT_THEME.bg,
                  borderRadius: PARTICIPANT_THEME.radius,
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{quiz.title || quiz.name}</div>
                    <div style={{ fontSize: '11.5px', color: PARTICIPANT_THEME.muted }}>Pass Mark: {quiz.passMark || '80%'}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: quiz.status === 'Passed' ? '#10B981' : PARTICIPANT_THEME.primaryAccent }}>
                    {quiz.status || 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic' }}>
              No assessments published yet.
            </div>
          )}
        </section>

      </div>

      {/* ── SECTION 7 — PROGRESS SUMMARY ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
          Real-Time Progress Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Completion Rate</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{overallProgressPct}%</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Modules Completed</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{completedModules} / {totalModules}</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Assignments Submitted</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{submittedAssignmentsCount} / {assignments.length}</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{attendanceRate}</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 8 — CONTEXT-AWARE OYEN AI ── */}
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
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Context-Aware OYEN AI</h3>
            </div>
            <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: 0 }}>
              AI is currently loaded with <strong>{currentProgramme.name || currentProgramme.title}</strong> context.
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

    </div>
  );
}
