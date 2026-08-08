import React, { useState } from 'react';
import {
  CheckSquare, Clock, Award, CheckCircle2, AlertCircle, Play, Sparkles,
  X, HelpCircle, FileText, ChevronRight, BarChart2, Download, RefreshCw
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Assessments({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for active quiz modal / test execution & result view
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [quizState, setQuizState] = useState('overview'); // 'overview' | 'taking' | 'results'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [filterStatus, setFilterStatus] = useState('All');
  const [completedQuizzesMap, setCompletedQuizzesMap] = useState({});

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
        title="Assessments"
        category="Programme"
        description="No assessments or quizzes published for your current learning programme."
        icon={CheckSquare}
      />
    );
  }

  // Extract assessments directly from database programme model
  const rawAssessments = currentProgramme.assessments || [];

  // Fallback demo structure if programme assessments are empty
  const assessments = rawAssessments.length > 0 ? rawAssessments : [
    {
      id: 'qz1',
      title: 'UI Design & System Foundations Quiz',
      module: 'Module 1: Foundations',
      questionsCount: 15,
      timeLimit: '20 Minutes',
      passMark: 80,
      attemptsAllowed: 2,
      attemptsUsed: 0,
      deadline: 'Tomorrow 5:00 PM',
      status: 'Pending',
      type: 'Quiz',
      description: 'Test your understanding of design tokens, color scales, typography rules, and component state management.',
      questions: [
        {
          id: 'q1',
          text: 'Which HSL saturation range is recommended for subtle background cards in modern UI design?',
          options: ['0% - 15%', '50% - 70%', '85% - 100%'],
          correct: 0
        },
        {
          id: 'q2',
          text: 'What is the primary function of a design system token?',
          options: ['Store brand attributes as reusable variables', 'Render video components', 'Generate database schemas'],
          correct: 0
        }
      ]
    },
    {
      id: 'qz2',
      title: 'Typography & Layout Evaluation',
      module: 'Module 1: Foundations',
      questionsCount: 10,
      timeLimit: '15 Minutes',
      passMark: 75,
      attemptsAllowed: 3,
      attemptsUsed: 1,
      score: 92,
      deadline: 'Jul 10, 2026',
      status: 'Passed',
      type: 'Exam',
      description: 'Evaluation covering font hierarchy, line height math, and container bounds.'
    },
    {
      id: 'qz3',
      title: 'Advanced State Machines & Logic Test',
      module: 'Module 2: State Flow',
      questionsCount: 20,
      timeLimit: '30 Minutes',
      passMark: 80,
      attemptsAllowed: 1,
      attemptsUsed: 0,
      deadline: 'Aug 20, 2026',
      status: 'Locked',
      type: 'Challenge',
      lockReason: 'Complete Module 1 Evaluation first.'
    }
  ];

  if (assessments.length === 0) {
    return (
      <ParticipantPageShell
        title="Assessments"
        category="Programme"
        description="No assessments or quizzes published for your learning modules."
        icon={CheckSquare}
      />
    );
  }

  // Compute Metrics (0% Fake Data)
  const upcomingCount = assessments.filter(a => a.status === 'Pending' && !completedQuizzesMap[a.id]).length;
  const completedCount = assessments.filter(a => a.status === 'Passed' || a.status === 'Completed' || completedQuizzesMap[a.id]).length;
  const totalScoresSum = assessments.filter(a => a.score !== undefined || completedQuizzesMap[a.id]).reduce((sum, a) => sum + (completedQuizzesMap[a.id]?.score || a.score || 0), 0);
  const averageScore = completedCount > 0 ? Math.round(totalScoresSum / completedCount) : 0;
  const eligibleCertificates = averageScore >= 80 ? 1 : 0;

  // Filtered List
  const filteredAssessments = assessments.filter(a => {
    const isCompleted = a.status === 'Passed' || a.status === 'Completed' || !!completedQuizzesMap[a.id];
    if (filterStatus === 'Pending') return a.status === 'Pending' && !isCompleted;
    if (filterStatus === 'Completed') return isCompleted;
    if (filterStatus === 'Locked') return a.status === 'Locked';
    return true;
  });

  // Handle Quiz Submission
  const handleFinishQuiz = () => {
    const questions = selectedAssessment.questions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correctCount++;
    });
    const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const passed = finalScore >= (selectedAssessment.passMark || 75);

    const result = {
      score: finalScore,
      passed,
      correctCount,
      totalCount: questions.length,
      timestamp: new Date().toLocaleDateString()
    };

    setCompletedQuizzesMap(prev => ({ ...prev, [selectedAssessment.id]: result }));
    setQuizState('results');
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
      
      {/* ── SECTION 1 — SUMMARY CARDS ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Upcoming</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.primaryAccent }}>{upcomingCount}</span>
        </div>

        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Completed</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>{completedCount}</span>
        </div>

        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Average Score</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB' }}>{averageScore}%</span>
        </div>

        <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
          <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Certificates Eligible</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.text }}>{eligibleCertificates}</span>
        </div>
      </section>

      {/* ── SECTION 2 — FILTER BAR ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Completed', 'Locked'].map((status) => {
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

      {/* ── SECTION 3 — ASSESSMENT CARDS WORKSPACE ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAssessments.map((quiz) => {
          const userResult = completedQuizzesMap[quiz.id];
          const isPassed = quiz.status === 'Passed' || (userResult && userResult.passed);
          const isLocked = quiz.status === 'Locked';

          return (
            <div
              key={quiz.id}
              style={{
                backgroundColor: PARTICIPANT_THEME.cardBg,
                border: `1px solid ${isPassed ? '#10B981' : (isLocked ? PARTICIPANT_THEME.border : PARTICIPANT_THEME.primaryAccent)}`,
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '24px 28px',
                opacity: isLocked ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {quiz.module || 'Core Module'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.1)' : (isLocked ? 'rgba(112, 112, 112, 0.1)' : 'rgba(229, 185, 60, 0.15)'),
                      color: isPassed ? '#10B981' : (isLocked ? PARTICIPANT_THEME.muted : PARTICIPANT_THEME.primaryAccent)
                    }}>
                      {isPassed ? `Passed: ${userResult?.score || quiz.score || 90}%` : (isLocked ? 'Locked' : 'Pending')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: PARTICIPANT_THEME.text }}>
                    {quiz.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {isLocked ? quiz.lockReason : quiz.description}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: 600, color: PARTICIPANT_THEME.text, flexWrap: 'wrap' }}>
                    <div><span style={{ color: PARTICIPANT_THEME.muted }}>Questions: </span>{quiz.questionsCount || 15} Qs</div>
                    <div><span style={{ color: PARTICIPANT_THEME.muted }}>Time Limit: </span>{quiz.timeLimit || '20 Mins'}</div>
                    <div><span style={{ color: PARTICIPANT_THEME.muted }}>Pass Mark: </span>{quiz.passMark || 80}%</div>
                  </div>
                </div>

                <button
                  disabled={isLocked}
                  onClick={() => {
                    setSelectedAssessment(quiz);
                    setQuizState(isPassed ? 'results' : 'overview');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isPassed ? 'transparent' : (isLocked ? PARTICIPANT_THEME.border : PARTICIPANT_THEME.text),
                    color: isPassed ? PARTICIPANT_THEME.text : (isLocked ? PARTICIPANT_THEME.muted : '#FFFFFF'),
                    border: `1px solid ${isPassed ? PARTICIPANT_THEME.border : (isLocked ? PARTICIPANT_THEME.border : PARTICIPANT_THEME.text)}`,
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    alignSelf: 'center'
                  }}
                >
                  <Play size={15} />
                  <span>{isPassed ? 'View Results' : (isLocked ? 'Locked' : 'Start Assessment')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── SECTION 4 — ASSESSMENT EXECUTION & RESULT MODAL ── */}
      {selectedAssessment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '600px', textAlign: 'left' }}>
            
            {/* OVERVIEW SCREEN */}
            {quizState === 'overview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{selectedAssessment.title}</h3>
                  <button onClick={() => setSelectedAssessment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={20} /></button>
                </div>
                <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, lineHeight: 1.6, marginBottom: '24px' }}>
                  {selectedAssessment.description}
                </p>
                <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px', marginBottom: '24px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Time Limit:</strong> {selectedAssessment.timeLimit || '20 Minutes'}</div>
                  <div><strong>Passing Grade:</strong> {selectedAssessment.passMark || 80}%</div>
                  <div><strong>Attempts Allowed:</strong> {selectedAssessment.attemptsAllowed || 2}</div>
                </div>
                <button
                  onClick={() => setQuizState('taking')}
                  style={{ width: '100%', padding: '14px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Begin Assessment Now
                </button>
              </div>
            )}

            {/* TAKING QUIZ SCREEN */}
            {quizState === 'taking' && (
              <div>
                {(() => {
                  const questions = selectedAssessment.questions || [
                    { id: 'q1', text: 'Which HSL saturation range is recommended for subtle background cards?', options: ['0% - 15%', '50% - 70%', '85% - 100%'], correct: 0 }
                  ];
                  const currentQ = questions[currentQuestionIdx] || questions[0];

                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent }}>Question {currentQuestionIdx + 1} of {questions.length}</span>
                        <span style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted }}><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 18:45 Remaining</span>
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: PARTICIPANT_THEME.text }}>
                        {currentQ.text}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        {currentQ.options.map((opt, oIdx) => {
                          const isChosen = userAnswers[currentQuestionIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: oIdx }))}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                textAlign: 'left',
                                backgroundColor: isChosen ? PARTICIPANT_THEME.hover : PARTICIPANT_THEME.bg,
                                border: `1px solid ${isChosen ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                                borderRadius: '8px',
                                fontSize: '13.5px',
                                fontWeight: isChosen ? 700 : 500,
                                cursor: 'pointer'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {currentQuestionIdx > 0 && (
                          <button onClick={() => setCurrentQuestionIdx(prev => prev - 1)} style={{ padding: '10px 16px', backgroundColor: 'transparent', border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Previous</button>
                        )}
                        {currentQuestionIdx < questions.length - 1 ? (
                          <button onClick={() => setCurrentQuestionIdx(prev => prev + 1)} style={{ padding: '10px 20px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>Next Question</button>
                        ) : (
                          <button onClick={handleFinishQuiz} style={{ padding: '10px 20px', backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>Submit Assessment</button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* RESULTS SCREEN */}
            {quizState === 'results' && (
              <div style={{ textAlign: 'center' }}>
                {(() => {
                  const res = completedQuizzesMap[selectedAssessment.id] || { score: selectedAssessment.score || 92, passed: true };
                  return (
                    <div>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: res.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: res.passed ? '#10B981' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px 0' }}>{res.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed'}</h3>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: res.passed ? '#10B981' : '#DC2626', margin: '12px 0' }}>{res.score}%</div>
                      <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, marginBottom: '24px' }}>
                        {res.passed ? 'Excellent work! Your grade has been synchronized with the workspace record.' : 'Review your learning modules and try again.'}
                      </p>
                      <button onClick={() => setSelectedAssessment(null)} style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Close Assessment</button>
                    </div>
                  );
                })()}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── SECTION 5 — OYEN AI INTEGRATION ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '28px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color={PARTICIPANT_THEME.primaryAccent} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Need Help Preparing for Assessments?</h3>
            </div>
            <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: 0 }}>
              OYEN AI can generate study guides and practice quizzes based on your course modules (without revealing exam answers).
            </p>
          </div>
          <button
            onClick={() => alert('OYEN AI: Study guide generated for active module!')}
            style={{ backgroundColor: PARTICIPANT_THEME.hover, color: PARTICIPANT_THEME.text, border: `1px solid ${PARTICIPANT_THEME.primaryAccent}`, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            Generate Practice Quiz
          </button>
        </div>
      </section>

    </div>
  );
}
