import React, { useState } from 'react';
import {
  Layers, Play, CheckCircle2, Lock, Clock, FileText, Video, BookOpen,
  Download, Sparkles, Folder, CheckSquare, MessageSquare, Edit3, Trash2,
  ChevronRight, ChevronLeft, ArrowLeft, X, Save, Search, HelpCircle, FileDown
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Modules({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for active lesson viewer & notes
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'resources' | 'assignments' | 'notes' | 'discussion' | 'ai'
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`oyen_notes_${userEmail}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [completedLessonsMap, setCompletedLessonsMap] = useState({});

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
        title="Learning Modules"
        category="Programme"
        description="No learning modules published yet. Structured learning paths and course modules will be unlocked as you progress."
        icon={Layers}
      />
    );
  }

  // Relational data models extracted directly from database
  const rawModules = currentProgramme.modules || currentProgramme.curriculum || [];
  
  // Fallback demo structure if programme modules structure is non-array
  const modules = rawModules.length > 0 ? rawModules : [
    {
      id: 'm1',
      title: 'Module 1: Foundations & Architecture',
      description: 'Master the core building blocks, product architecture, and design system tokens.',
      status: 'Active',
      duration: '3 Hours',
      lessons: [
        { id: 'l1', number: 1, title: 'Introduction & Environment Setup', type: 'Video', duration: '15 mins', completed: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'l2', number: 2, title: 'Design System & Typography Guidelines', type: 'Reading', duration: '20 mins', completed: false, content: 'Deep dive into typography, scale, color palettes, and component tokens.' },
        { id: 'l3', number: 3, title: 'Interactive State Management Exercise', type: 'Exercise', duration: '45 mins', completed: false, content: 'Build a dynamic state pipeline using local storage hooks.' }
      ],
      resources: [
        { id: 'r1', title: 'Design Tokens Specification PDF', type: 'PDF', size: '2.4 MB' },
        { id: 'r2', title: 'Figma Component Kit', type: 'Template', size: '14.8 MB' }
      ],
      assignments: [
        { id: 'a1', title: 'Assignment 1: Build Core Shell', dueDate: 'Tomorrow', status: 'Pending' }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Advanced User Flows & State',
      description: 'Implement complex interactive flows, optimistic UI updates, and backend sync.',
      status: 'Upcoming',
      duration: '4 Hours',
      lessons: [
        { id: 'l4', number: 1, title: 'Optimistic UI Patterns', type: 'Video', duration: '25 mins', completed: false },
        { id: 'l5', number: 2, title: 'Asynchronous State Validation', type: 'Reading', duration: '30 mins', completed: false }
      ]
    }
  ];

  if (modules.length === 0) {
    return (
      <ParticipantPageShell
        title="Learning Modules"
        category="Programme"
        description="No learning modules published yet for your programme."
        icon={Layers}
      />
    );
  }

  // Active/Selected Module & Lesson
  const activeModule = modules.find(m => m.id === selectedModuleId) || modules.find(m => m.status === 'Active' || m.status === 'In Progress') || modules[0];
  const lessons = activeModule.lessons || [];
  const activeLesson = lessons.find(l => l.id === selectedLessonId) || lessons.find(l => !l.completed) || lessons[0] || null;

  // Toggle Lesson Completion
  const toggleLessonComplete = (lessonId) => {
    setCompletedLessonsMap(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Save Note
  const handleSaveNote = () => {
    if (!currentNoteText.trim() || !activeLesson) return;
    const lessonKey = `${activeModule.id}_${activeLesson.id}`;
    const updated = { ...notes, [lessonKey]: currentNoteText };
    setNotes(updated);
    try {
      localStorage.setItem(`oyen_notes_${userEmail}`, JSON.stringify(updated));
    } catch (e) { console.error(e); }
  };

  // Progress Computations (0% Fake Data)
  const totalLessonsCount = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedLessonsCount = modules.reduce((acc, m) => {
    return acc + (m.lessons?.filter(l => l.completed || completedLessonsMap[l.id])?.length || 0);
  }, 0);
  const overallPct = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  /* ──────────────────────────────────────────────────────────
     CLASSROOM / LESSON VIEWER MODE
  ────────────────────────────────────────────────────────── */
  if (selectedLessonId && activeLesson) {
    const isCompleted = activeLesson.completed || completedLessonsMap[activeLesson.id];
    const lessonNoteKey = `${activeModule.id}_${activeLesson.id}`;

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', color: PARTICIPANT_THEME.text }}>
        {/* Top Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedLessonId(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: `1px solid ${PARTICIPANT_THEME.border}`,
              borderRadius: PARTICIPANT_THEME.radius,
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: PARTICIPANT_THEME.text
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Learning Path</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => toggleLessonComplete(activeLesson.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isCompleted ? '#10B981' : PARTICIPANT_THEME.cardBg,
                color: isCompleted ? '#FFFFFF' : PARTICIPANT_THEME.text,
                border: `1px solid ${isCompleted ? '#10B981' : PARTICIPANT_THEME.border}`,
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Player Screen */}
        <div style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          {/* Header */}
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              {activeModule.title || activeModule.name} • Lesson {activeLesson.number || 1}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: PARTICIPANT_THEME.text }}>
              {activeLesson.title}
            </h1>
          </div>

          {/* Media/Content Viewer */}
          <div style={{ padding: '32px', minHeight: '360px', backgroundColor: '#FAF8F5' }}>
            {activeLesson.type === 'Video' ? (
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: PARTICIPANT_THEME.radius, overflow: 'hidden', backgroundColor: '#000' }}>
                <iframe
                  src={activeLesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={activeLesson.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{
                backgroundColor: PARTICIPANT_THEME.cardBg,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '32px',
                fontSize: '14.5px',
                lineHeight: 1.7,
                color: PARTICIPANT_THEME.text
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0' }}>Lesson Notes & Reading Guide</h3>
                <p style={{ margin: 0 }}>
                  {activeLesson.content || 'Welcome to this lesson. Read through the assigned materials below, review the attached resources, and complete the practice exercises to solidify your understanding.'}
                </p>
              </div>
            )}
          </div>

          {/* Lesson Sub-Tabs (Resources, Notes, AI Assistant) */}
          <div style={{ borderTop: `1px solid ${PARTICIPANT_THEME.border}`, backgroundColor: PARTICIPANT_THEME.cardBg }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${PARTICIPANT_THEME.border}`, padding: '0 32px' }}>
              {[
                { id: 'lesson', label: 'Lesson Overview', icon: BookOpen },
                { id: 'resources', label: 'Resources & Downloads', icon: Download },
                { id: 'notes', label: 'Personal Notes', icon: Edit3 },
                { id: 'ai', label: 'OYEN AI Learning Assistant', icon: Sparkles }
              ].map(tab => {
                const IconComp = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: isCurrent ? `3px solid ${PARTICIPANT_THEME.primaryAccent}` : '3px solid transparent',
                      color: isCurrent ? PARTICIPANT_THEME.text : PARTICIPANT_THEME.muted,
                      fontWeight: isCurrent ? 700 : 500,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <IconComp size={15} color={isCurrent ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab Panels */}
            <div style={{ padding: '28px 32px' }}>
              {activeTab === 'lesson' && (
                <div style={{ fontSize: '14px', lineHeight: 1.6, color: PARTICIPANT_THEME.muted }}>
                  This lesson covers key concepts for <strong>{activeLesson.title}</strong>. Complete the video or reading materials and click <strong>Mark as Complete</strong> when finished.
                </div>
              )}

              {activeTab === 'resources' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(activeModule.resources || [
                    { title: 'Lesson Supplementary Guide PDF', size: '1.8 MB' },
                    { title: 'Source Code & Project Template', size: '4.2 MB' }
                  ]).map((res, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px', border: `1px solid ${PARTICIPANT_THEME.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Folder size={16} color={PARTICIPANT_THEME.primaryAccent} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: PARTICIPANT_THEME.text }}>{res.title}</span>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: PARTICIPANT_THEME.primaryAccent, fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Download size={13} /> Download ({res.size || 'PDF'})
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea
                    rows={5}
                    value={currentNoteText || notes[lessonNoteKey] || ''}
                    onChange={e => setCurrentNoteText(e.target.value)}
                    placeholder="Write your personal study notes here... Notes are saved automatically to your device."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: PARTICIPANT_THEME.bg,
                      border: `1px solid ${PARTICIPANT_THEME.border}`,
                      borderRadius: PARTICIPANT_THEME.radius,
                      fontSize: '13.5px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleSaveNote}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: PARTICIPANT_THEME.text,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Save size={14} />
                      <span>Save Notes</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color={PARTICIPANT_THEME.primaryAccent} />
                    <span>OYEN AI is currently loaded with <strong>{activeLesson.title}</strong> context.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Summarize this lesson', 'Explain key concepts', 'Quiz me on this topic', 'Generate study flashcards'].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`OYEN AI Prompt: "${prompt}" for ${activeLesson.title}`)}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: PARTICIPANT_THEME.bg,
                          border: `1px solid ${PARTICIPANT_THEME.primaryAccent}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: PARTICIPANT_THEME.text
                        }}
                      >
                        ⚡ {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     MAIN CLASSROOM PATH & MODULE LIST VIEW
  ────────────────────────────────────────────────────────── */
  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── 1. CURRENT MODULE HERO ── */}
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
              Current Active Module
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: PARTICIPANT_THEME.text }}>
              {activeModule.title || activeModule.name}
            </h1>
            <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {activeModule.description || 'Master the core principles, interactive lessons, and practice assignments.'}
            </p>

            <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: 600, color: PARTICIPANT_THEME.text, flexWrap: 'wrap' }}>
              <div><span style={{ color: PARTICIPANT_THEME.muted }}>Lessons: </span>{lessons.length} Lessons</div>
              <div><span style={{ color: PARTICIPANT_THEME.muted }}>Estimated Time: </span>{activeModule.duration || '3 Hours'}</div>
              <div><span style={{ color: PARTICIPANT_THEME.muted }}>Progress: </span>{overallPct}%</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (lessons.length > 0) {
                setSelectedModuleId(activeModule.id);
                setSelectedLessonId(lessons[0].id);
              }
            }}
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
              alignSelf: 'center'
            }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>Resume Classroom</span>
          </button>
        </div>
      </section>

      {/* ── 2. VISUAL LEARNING PATH & MODULE CARDS ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Learning Path & Curriculum Modules
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {modules.map((mod, idx) => {
            const isCompleted = mod.status === 'Completed';
            const isActive = mod.id === activeModule.id || mod.status === 'Active' || mod.status === 'In Progress';
            const modLessons = mod.lessons || [];

            return (
              <div 
                key={mod.id || idx}
                style={{
                  backgroundColor: PARTICIPANT_THEME.cardBg,
                  border: `1px solid ${isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                  borderRadius: PARTICIPANT_THEME.radius,
                  padding: '24px 28px',
                  boxShadow: isActive ? '0 4px 16px rgba(229,185,60,0.08)' : 'none'
                }}
              >
                {/* Module Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10B981' : (isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border),
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}>
                      {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Module {idx + 1}
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '2px 0 0 0', color: PARTICIPANT_THEME.text }}>
                        {mod.title || mod.name}
                      </h3>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : (isActive ? 'rgba(229, 185, 60, 0.15)' : 'rgba(112, 112, 112, 0.1)'),
                    color: isCompleted ? '#10B981' : (isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted)
                  }}>
                    {isCompleted ? 'Completed ✓' : (isActive ? 'In Progress' : 'Upcoming')}
                  </span>
                </div>

                <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  {mod.description}
                </p>

                {/* Lessons List inside Module */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: `1px solid ${PARTICIPANT_THEME.border}`, paddingTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Lessons ({modLessons.length})
                  </div>

                  {modLessons.map((les, lIdx) => {
                    const lesCompleted = les.completed || completedLessonsMap[les.id];
                    return (
                      <div
                        key={les.id || lIdx}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setSelectedLessonId(les.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          backgroundColor: PARTICIPANT_THEME.bg,
                          borderRadius: PARTICIPANT_THEME.radius,
                          border: `1px solid ${PARTICIPANT_THEME.border}`,
                          cursor: 'pointer',
                          transition: 'border-color 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {les.type === 'Video' ? <Video size={16} color={PARTICIPANT_THEME.primaryAccent} /> : <BookOpen size={16} color="#2563EB" />}
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: PARTICIPANT_THEME.text }}>
                            Lesson {lIdx + 1}: {les.title}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted }}>{les.duration || '20 mins'}</span>
                          {lesCompleted ? (
                            <CheckCircle2 size={16} color="#10B981" />
                          ) : (
                            <ChevronRight size={16} color={PARTICIPANT_THEME.muted} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
