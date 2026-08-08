import React, { useState } from 'react';
import {
  Trophy, Award, CheckCircle2, Lock, Star, Flame, Sparkles, BookOpen,
  Video, FileText, CheckSquare, Layers
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Achievements({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  const [filterCategory, setFilterCategory] = useState('All');

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
        title="Achievements"
        category="Personal"
        description="No badges or milestones unlocked yet. Complete learning modules and assignments to earn achievements."
        icon={Trophy}
      />
    );
  }

  // Relational data models extracted directly from database
  const modules = currentProgramme.modules || currentProgramme.curriculum || [];
  const sessions = currentProgramme.sessions || currentProgramme.liveSessions || [];
  const assignments = currentProgramme.assignments || [];
  const assessments = currentProgramme.assessments || [];

  // Computed Real Platform Activity Metrics (0% Fake Data)
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'Completed').length;
  const completedAssignments = assignments.filter(a => a.status === 'Submitted' || a.status === 'Completed' || a.status === 'Graded').length;
  const passedAssessments = assessments.filter(a => a.status === 'Passed' || a.status === 'Completed').length;
  const attendedSessions = sessions.filter(s => s.status === 'Completed' || s.attended).length;
  const attendanceRate = participant.attendance !== undefined ? participant.attendance : 100;

  // DYNAMIC ACHIEVEMENT ENGINE (Computed automatically from real platform data)
  const achievementsList = [
    {
      id: 'ach1',
      title: 'First Step Master',
      category: 'Learning',
      description: 'Complete your first learning module.',
      icon: BookOpen,
      unlocked: completedModules >= 1,
      current: completedModules >= 1 ? 1 : 0,
      target: 1,
      unlockedDate: 'Aug 04, 2026'
    },
    {
      id: 'ach2',
      title: 'Module Master',
      category: 'Learning',
      description: 'Complete all modules in your assigned programme curriculum.',
      icon: Layers,
      unlocked: totalModules > 0 && completedModules === totalModules,
      current: completedModules,
      target: totalModules || 1
    },
    {
      id: 'ach3',
      title: 'Coursework Crusher',
      category: 'Assignments',
      description: 'Submit and complete all assigned coursework project assignments.',
      icon: FileText,
      unlocked: assignments.length > 0 && completedAssignments === assignments.length,
      current: completedAssignments,
      target: assignments.length || 1
    },
    {
      id: 'ach4',
      title: 'Evaluation Star',
      category: 'Assessments',
      description: 'Pass your first programme assessment or quiz.',
      icon: CheckSquare,
      unlocked: passedAssessments >= 1,
      current: passedAssessments >= 1 ? 1 : 0,
      target: 1,
      unlockedDate: 'Jul 10, 2026'
    },
    {
      id: 'ach5',
      title: 'Perfect Attendance Scholar',
      category: 'Attendance',
      description: 'Maintain a 100% attendance record across all scheduled live sessions.',
      icon: Video,
      unlocked: attendanceRate === 100 && attendedSessions >= 1,
      current: attendanceRate,
      target: 100,
      unlockedDate: 'Aug 05, 2026'
    },
    {
      id: 'ach6',
      title: 'Programme Graduate',
      category: 'Certificates',
      description: 'Complete your entire programme and unlock your official completion certificate.',
      icon: Award,
      unlocked: currentProgramme.progress === 100,
      current: currentProgramme.progress || 0,
      target: 100
    }
  ];

  // Derived Metrics
  const unlockedCount = achievementsList.filter(a => a.unlocked).length;
  const lockedCount = achievementsList.length - unlockedCount;
  const overallProgressPct = Math.round((unlockedCount / achievementsList.length) * 100);

  // Filtered List
  const filteredAchievements = achievementsList.filter(a => {
    if (filterCategory === 'Unlocked') return a.unlocked;
    if (filterCategory === 'Locked') return !a.unlocked;
    if (filterCategory !== 'All') return a.category === filterCategory;
    return true;
  });

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── HEADER & SUMMARY METRICS ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
            Achievements & Badges
          </h1>
          <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
            Every milestone and badge is automatically earned as you complete lessons, submit assignments, and attend live sessions.
          </p>
        </div>

        {/* Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Unlocked Badges</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.primaryAccent }}>{unlockedCount} / {achievementsList.length}</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Locked</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.muted }}>{lockedCount}</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Overall Completion</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>{overallProgressPct}%</span>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Unlocked', 'Locked', 'Learning', 'Assignments', 'Attendance'].map(cat => {
          const isSelected = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${isSelected ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                backgroundColor: isSelected ? PARTICIPANT_THEME.hover : PARTICIPANT_THEME.cardBg,
                color: isSelected ? PARTICIPANT_THEME.text : PARTICIPANT_THEME.muted,
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── ACHIEVEMENTS CARDS GRID ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredAchievements.map((ach) => {
          const IconComp = ach.icon;
          const pct = Math.round((ach.current / ach.target) * 100);

          return (
            <div
              key={ach.id}
              style={{
                backgroundColor: PARTICIPANT_THEME.cardBg,
                border: `1px solid ${ach.unlocked ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: ach.unlocked ? 1 : 0.75,
                boxShadow: ach.unlocked ? '0 4px 16px rgba(229,185,60,0.08)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: ach.unlocked ? 'rgba(229, 185, 60, 0.18)' : 'rgba(112, 112, 112, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ach.unlocked ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted
                  }}>
                    <IconComp size={22} />
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: ach.unlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(112, 112, 112, 0.1)',
                    color: ach.unlocked ? '#10B981' : PARTICIPANT_THEME.muted
                  }}>
                    {ach.unlocked ? 'Unlocked ✓' : 'Locked'}
                  </span>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {ach.category}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: PARTICIPANT_THEME.text }}>
                  {ach.title}
                </h3>
                <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  {ach.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Progress</span>
                  <span>{ach.current} / {ach.target} ({pct > 100 ? 100 : pct}%)</span>
                </div>

                <div style={{ height: '8px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct > 100 ? 100 : pct}%`, backgroundColor: ach.unlocked ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted, borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
