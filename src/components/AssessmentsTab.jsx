import React, { useState } from 'react';
import { Award, Plus, Calendar, Check, AlertCircle } from 'lucide-react';

export default function AssessmentsTab({ programs = [], addNotification }) {
  const [selectedProgId, setSelectedProgId] = useState(programs[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentType, setAssessmentType] = useState('quiz'); // quiz | assignment | exam
  const [deadline, setDeadline] = useState('');

  const program = programs.find(p => p.id === Number(selectedProgId));
  const assessments = program?.assessments || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!assessmentName.trim() || !selectedProgId) return;

    if (program) {
      const newAssessment = {
        id: Date.now(),
        name: assessmentName.trim(),
        type: assessmentType,
        deadline,
        submissionsCount: 0,
        pendingGrading: 0,
        avgScore: 0,
        published: false
      };
      program.assessments = [...(program.assessments || []), newAssessment];
      addNotification?.(`Created assessment "${assessmentName}" for ${program.name}`);
      setAssessmentName('');
      setDeadline('');
      setShowCreateModal(false);
    }
  };

  const togglePublish = (id) => {
    if (program) {
      program.assessments = program.assessments.map(a => 
        a.id === id ? { ...a, published: !a.published } : a
      );
      const ass = program.assessments.find(a => a.id === id);
      addNotification?.(`${ass.published ? 'Published' : 'Unpublished'} assessment "${ass.name}"`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Assessments</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Publish quizzes, assignments, and exams. Grade submissions and track metrics.
          </p>
        </div>
        {selectedProgId && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.2rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={15} /> Create Assessment
          </button>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Program</label>
        <select
          value={selectedProgId}
          onChange={e => setSelectedProgId(e.target.value)}
          style={{ width: '100%', maxWidth: '300px', padding: '0.65rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
        >
          <option value="">Select a Program</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedProgId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {assessments.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)' }}>
              No assessments created yet. Click "Create Assessment" to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {assessments.map(a => (
                <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F5D76E', backgroundColor: 'rgba(245,215,110,0.08)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {a.type}
                    </span>
                    <button
                      onClick={() => togglePublish(a.id)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        backgroundColor: a.published ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid',
                        borderColor: a.published ? '#22c55e' : 'rgba(255,255,255,0.1)',
                        color: a.published ? '#22c55e' : 'rgba(255,255,255,0.5)',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {a.published ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>{a.name}</h4>
                    {a.deadline && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.35rem' }}>
                        <Calendar size={11} /> Due: {a.deadline}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Submissions</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.15rem' }}>{a.submissionsCount || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Pending</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: a.pendingGrading > 0 ? '#ef4444' : '#fff', marginTop: '0.15rem' }}>{a.pendingGrading || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Avg Score</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.15rem' }}>{a.avgScore ? `${a.avgScore}%` : '-'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Creation Modal */}
      {showCreateModal && (
        <div onClick={() => setShowCreateModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create Assessment</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Assessment Title</label>
                <input
                  required autoFocus type="text"
                  placeholder="e.g. Midterm Quiz"
                  value={assessmentName}
                  onChange={e => setAssessmentName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Assessment Type</label>
                <select
                  value={assessmentType}
                  onChange={e => setAssessmentType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Due Date / Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}
              >
                Create Assessment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
