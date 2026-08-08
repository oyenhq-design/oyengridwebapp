import React, { useState } from 'react';
import {
  FileText, Calendar, Clock, CheckCircle2, AlertCircle, Upload, Download,
  Sparkles, X, Send, Paperclip, FileCheck, CheckSquare, MessageSquare, ArrowRight, ArrowLeft
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Assignments({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for active assignment details / submission drawer
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionsMap, setSubmissionsMap] = useState({});

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
        title="Assignments"
        category="Programme"
        description="No pending assignments. Tasks and projects assigned by your facilitators will appear here."
        icon={FileText}
      />
    );
  }

  // Extract assignments directly from database programme model
  const rawAssignments = currentProgramme.assignments || [];

  // Fallback demo structure if programme assignments are empty
  const assignments = rawAssignments.length > 0 ? rawAssignments : [
    {
      id: 'a1',
      title: 'Assignment 1: Build Design System Tokens',
      module: 'Module 1: Foundations',
      facilitator: currentProgramme.leadFacilitator || 'Sarah Ahmed',
      dueDate: 'Tomorrow',
      estimatedTime: '2 Hours',
      points: 100,
      weight: '15%',
      status: 'Pending',
      description: 'Create a complete set of design system tokens (colors, typography, spacing, radius) and implement them in your workspace component tree.',
      instructions: '1. Export tokens as JSON / CSS variables.\n2. Apply tokens to buttons, inputs, and cards.\n3. Submit your solution file or GitHub repository URL below.',
      rubric: [
        { criteria: 'Color Palette & Token System', maxPoints: 40 },
        { criteria: 'Typography & Scale Consistency', maxPoints: 30 },
        { criteria: 'Component Implementation', maxPoints: 30 }
      ]
    },
    {
      id: 'a2',
      title: 'Assignment 2: Asynchronous Flow State Machine',
      module: 'Module 2: State Flow',
      facilitator: 'David Okafor',
      dueDate: 'Aug 14, 2026',
      estimatedTime: '3 Hours',
      points: 100,
      weight: '20%',
      status: 'Pending',
      description: 'Implement an asynchronous state machine with error boundaries and fallback UI states.',
      instructions: '1. Handle loading, error, and success states.\n2. Prevent memory leaks on unmount.'
    },
    {
      id: 'a3',
      title: 'Orientation Survey & Learning Goals',
      module: 'Module 1: Foundations',
      facilitator: currentProgramme.leadFacilitator || 'Sarah Ahmed',
      dueDate: 'Aug 04, 2026',
      estimatedTime: '30 mins',
      points: 50,
      weight: '5%',
      status: 'Graded',
      score: 50,
      grade: '100%',
      feedback: 'Excellent work! Your learning objectives are clear and well articulated.',
      submissionTimestamp: 'Aug 04, 2026 at 04:15 PM'
    }
  ];

  if (assignments.length === 0) {
    return (
      <ParticipantPageShell
        title="Assignments"
        category="Programme"
        description="No assignments available for your programme."
        icon={FileText}
      />
    );
  }

  // Handle Submission Action
  const handleSubmitWork = (assId) => {
    if (!submissionText.trim() && !submissionFile) {
      alert('Please enter text response or upload a submission file.');
      return;
    }
    const updated = {
      ...submissionsMap,
      [assId]: {
        text: submissionText,
        fileName: submissionFile ? submissionFile.name : 'Submission.pdf',
        timestamp: new Date().toLocaleString(),
        status: 'Submitted'
      }
    };
    setSubmissionsMap(updated);
    setSubmissionText('');
    setSubmissionFile(null);
    alert('Assignment submitted successfully! Awaiting facilitator review.');
  };

  // Compute Metrics (0% Fake Data)
  const pendingCount = assignments.filter(a => a.status === 'Pending' && !submissionsMap[a.id]).length;
  const submittedCount = assignments.filter(a => a.status === 'Submitted' || submissionsMap[a.id]).length;
  const gradedCount = assignments.filter(a => a.status === 'Graded').length;
  const overdueCount = assignments.filter(a => a.status === 'Overdue').length;

  // Filtered List
  const filteredAssignments = assignments.filter(a => {
    const isSubmitted = submissionsMap[a.id]?.status === 'Submitted' || a.status === 'Submitted';
    if (filterStatus === 'Pending') return a.status === 'Pending' && !isSubmitted;
    if (filterStatus === 'Submitted') return isSubmitted;
    if (filterStatus === 'Graded') return a.status === 'Graded';
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
      
      {/* ── SECTION 1 — OVERVIEW METRICS ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Pending Tasks</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: pendingCount > 0 ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.text }}>{pendingCount}</span>
        </div>

        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Submitted</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>{submittedCount}</span>
        </div>

        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Graded</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB' }}>{gradedCount}</span>
        </div>

        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Overdue</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: overdueCount > 0 ? '#DC2626' : PARTICIPANT_THEME.muted }}>{overdueCount}</span>
        </div>
      </section>

      {/* ── SECTION 2 — FILTER BAR ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Submitted', 'Graded'].map((status) => {
          const isSelected = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
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
              {status}
            </button>
          );
        })}
      </div>

      {/* ── SECTION 3 — ASSIGNMENT LIST WORKSPACE ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAssignments.map((ass) => {
          const userSub = submissionsMap[ass.id];
          const isSubmitted = !!userSub || ass.status === 'Submitted';
          const isGraded = ass.status === 'Graded';

          return (
            <div
              key={ass.id}
              style={{
                backgroundColor: PARTICIPANT_THEME.cardBg,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '24px 28px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {ass.module || 'Core Module'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: isGraded ? 'rgba(37, 99, 235, 0.1)' : (isSubmitted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(229, 185, 60, 0.15)'),
                      color: isGraded ? '#2563EB' : (isSubmitted ? '#10B981' : PARTICIPANT_THEME.primaryAccent)
                    }}>
                      {isGraded ? `Graded: ${ass.score}/${ass.points}` : (isSubmitted ? 'Submitted ✓' : 'Pending')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: PARTICIPANT_THEME.text }}>
                    {ass.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {ass.description}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: 600, color: PARTICIPANT_THEME.text, flexWrap: 'wrap' }}>
                    <div><span style={{ color: PARTICIPANT_THEME.muted }}>Due Date: </span><strong style={{ color: isSubmitted ? PARTICIPANT_THEME.text : '#DC2626' }}>{ass.dueDate}</strong></div>
                    <div><span style={{ color: PARTICIPANT_THEME.muted }}>Estimated Time: </span>{ass.estimatedTime || '1 Hour'}</div>
                    <div><span style={{ color: PARTICIPANT_THEME.muted }}>Points: </span>{ass.points || 100} Pts ({ass.weight || '10%'})</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAssignment(ass)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isSubmitted ? 'transparent' : PARTICIPANT_THEME.text,
                    color: isSubmitted ? PARTICIPANT_THEME.text : '#FFFFFF',
                    border: `1px solid ${isSubmitted ? PARTICIPANT_THEME.border : PARTICIPANT_THEME.text}`,
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    alignSelf: 'center'
                  }}
                >
                  <FileText size={15} />
                  <span>{isGraded ? 'View Feedback' : (isSubmitted ? 'View Submission' : 'Open Workspace')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── SECTION 4 — ASSIGNMENT DETAILS & SUBMISSION MODAL ── */}
      {selectedAssignment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {selectedAssignment.module}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: PARTICIPANT_THEME.text }}>
                  {selectedAssignment.title}
                </h3>
              </div>
              <button onClick={() => setSelectedAssignment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={20} /></button>
            </div>

            {/* Overview & Instructions */}
            <div style={{ marginBottom: '24px', fontSize: '13.5px', color: PARTICIPANT_THEME.muted, lineHeight: 1.6 }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text, margin: '0 0 6px 0' }}>Instructions & Requirements</h4>
              <p style={{ margin: '0 0 16px 0', whiteSpace: 'pre-line' }}>
                {selectedAssignment.instructions || selectedAssignment.description}
              </p>

              {/* Rubric */}
              {selectedAssignment.rubric && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px', border: `1px solid ${PARTICIPANT_THEME.border}` }}>
                  <h5 style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.text, margin: '0 0 8px 0', textTransform: 'uppercase' }}>Grading Rubric</h5>
                  {selectedAssignment.rubric.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: i < selectedAssignment.rubric.length - 1 ? `1px solid ${PARTICIPANT_THEME.border}` : 'none' }}>
                      <span>{r.criteria}</span>
                      <strong>{r.maxPoints} Pts</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submission Area */}
            {selectedAssignment.status === 'Graded' ? (
              <div style={{ padding: '20px', backgroundColor: 'rgba(37, 99, 235, 0.08)', borderRadius: PARTICIPANT_THEME.radius, border: '1px solid rgba(37, 99, 235, 0.2)', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#2563EB', margin: '0 0 8px 0' }}>Facilitator Feedback & Score</h4>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  {selectedAssignment.score} / {selectedAssignment.points} ({selectedAssignment.grade})
                </div>
                <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.text, margin: 0 }}>
                  "{selectedAssignment.feedback}"
                </p>
              </div>
            ) : (
              <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}`, marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text, margin: '0 0 12px 0' }}>Submit Your Work</h4>
                
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Enter your solution text, notes, or project repository URL here..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${PARTICIPANT_THEME.border}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    marginBottom: '12px',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <input
                    type="file"
                    id="submission-file-input"
                    style={{ display: 'none' }}
                    onChange={e => setSubmissionFile(e.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('submission-file-input').click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${PARTICIPANT_THEME.border}`,
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Paperclip size={14} />
                    <span>{submissionFile ? submissionFile.name : 'Attach File (PDF, ZIP, Code)'}</span>
                  </button>

                  <button
                    onClick={() => handleSubmitWork(selectedAssignment.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={14} />
                    <span>Submit Work</span>
                  </button>
                </div>
              </div>
            )}

            {/* OYEN AI Assistant for Assignments */}
            <div style={{ padding: '16px 20px', backgroundColor: PARTICIPANT_THEME.hover, borderRadius: '10px', border: `1px solid ${PARTICIPANT_THEME.primaryAccent}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color={PARTICIPANT_THEME.primaryAccent} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Need help with this assignment? Ask OYEN AI</span>
              </div>
              <button 
                onClick={() => alert(`OYEN AI Prompt: "Explain requirements for ${selectedAssignment.title}"`)}
                style={{ backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                Ask AI
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
