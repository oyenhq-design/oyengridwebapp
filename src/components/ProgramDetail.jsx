import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Users, Calendar, FileText, ClipboardList,
  CheckCircle2, Circle, Activity, Plus, X, ChevronDown, FolderUp, File, AlertTriangle, Trash2, ArrowRight
} from 'lucide-react';
import SessionsTab from './SessionsTab';
import LearnersTab from './LearnersTab';

/* ── shared styles ── */
const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem',
  backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};
const modalOverlay = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)',
  backdropFilter: 'blur(6px)', zIndex: 1400,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
};
const modalBox = {
  backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px',
  boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0.00 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function ProgramDetail({ program, setPrograms, programLearners = [], setLearners, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview' | 'Learners' | 'Sessions' | 'Resources' | 'Assessments'
  const [showUploadModal, setShowUploadModal] = useState(false);

  /* Resource form states */
  const [resourceForm, setResourceForm] = useState({ name: '', type: 'PDF', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  /* Assessment form states */
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({ name: '', type: 'Quiz', passingScore: '' });

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · ' + today;

  /* ── helpers ── */
  const updateProgram = (updater) =>
    setPrograms(prev => prev.map(p => p.id === program.id ? updater(p) : p));

  const pushActivity = (text, prog) => ({
    ...prog,
    activity: [{ id: Date.now(), text, time: now }, ...(prog.activity || [])],
  });

  /* ── Resource selection ── */
  const handleFileChange = (file) => {
    if (!file) return;
    setFileError('');
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'docx', 'pptx', 'xlsx', 'mp4'];
    if (!allowed.includes(ext)) {
      setFileError('Unsupported file format. Please upload PDF, DOCX, PPTX, XLSX, or MP4.');
      return;
    }
    setSelectedFile({
      name: file.name,
      size: file.size,
      raw: file
    });
    if (!resourceForm.name) {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setResourceForm(prev => ({ ...prev, name: baseName }));
    }
    let autoType = 'PDF';
    if (ext === 'docx') autoType = 'Document';
    else if (ext === 'pptx') autoType = 'Presentation';
    else if (ext === 'xlsx') autoType = 'Spreadsheet';
    else if (ext === 'mp4') autoType = 'Video';
    setResourceForm(prev => ({ ...prev, type: autoType }));
  };

  /* ── Upload Resource ── */
  const handleUploadResource = (e) => {
    e.preventDefault();
    if (!selectedFile || !resourceForm.name.trim()) return;

    const resource = {
      id: Date.now(),
      name: resourceForm.name.trim(),
      type: resourceForm.type,
      description: resourceForm.description.trim(),
      fileName: selectedFile.name,
      fileSize: formatBytes(selectedFile.size),
      sizeInBytes: selectedFile.size
    };

    updateProgram(p => pushActivity(`Resource "${resource.name}" uploaded (${resource.fileName})`, {
      ...p, resources: [...(p.resources || []), resource],
    }));

    setResourceForm({ name: '', type: 'PDF', description: '' });
    setSelectedFile(null);
    setFileError('');
    setShowUploadModal(false);
  };

  /* ── Delete Resource ── */
  const handleDeleteResource = (resourceId, resourceName) => {
    if (window.confirm(`Are you sure you want to delete "${resourceName}"?`)) {
      updateProgram(p => pushActivity(`Resource "${resourceName}" deleted`, {
        ...p, resources: (p.resources || []).filter(r => r.id !== resourceId)
      }));
    }
  };

  /* ── Create Assessment ── */
  const handleCreateAssessment = (e) => {
    e.preventDefault();
    if (!assessmentForm.name.trim()) return;

    const assessment = {
      id: Date.now(),
      name: assessmentForm.name.trim(),
      type: assessmentForm.type,
      passingScore: assessmentForm.passingScore.trim()
    };

    updateProgram(p => pushActivity(`Assessment "${assessment.name}" created`, {
      ...p, assessments: [...(p.assessments || []), assessment],
    }));

    setAssessmentForm({ name: '', type: 'Quiz', passingScore: '' });
    setShowAssessmentModal(false);
  };

  /* ── Delete Assessment ── */
  const handleDeleteAssessment = (assessmentId, assessmentName) => {
    if (window.confirm(`Are you sure you want to delete "${assessmentName}"?`)) {
      updateProgram(p => pushActivity(`Assessment "${assessmentName}" deleted`, {
        ...p, assessments: (p.assessments || []).filter(a => a.id !== assessmentId)
      }));
    }
  };

  /* ── derived counts ── */
  const sessionCount    = (program.sessions    || []).length;
  const resourceCount   = (program.resources   || []).length;
  const assessmentCount = (program.assessments || []).length;
  const learnerCount    = programLearners.length;
  const activityLog     = program.activity || [];

  const hasLearners     = learnerCount > 0;
  const hasSession      = sessionCount > 0;
  const hasResource     = resourceCount > 0;
  const hasAssessment   = assessmentCount > 0;

  const checklist = [
    { label: 'Program created',      done: true },
    { label: 'Learners added',       done: hasLearners },
    { label: 'Session scheduled',    done: hasSession,   optional: true },
    { label: 'Resources uploaded',   done: hasResource,  optional: true },
    { label: 'Assessment created',   done: hasAssessment,optional: true },
  ];

  const statusColor = program.status === 'Active' ? { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' }
                    : program.status === 'Draft'   ? { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' }
                    : { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

      {/* ── Back nav ── */}
      <button onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, width: 'fit-content', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
      >
        <ArrowLeft size={15} /> Programs
      </button>

      {/* ── Program header ── */}
      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{program.name}</h1>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor.color, backgroundColor: statusColor.bg, padding: '0.22rem 0.6rem', borderRadius: '5px', flexShrink: 0 }}>
                {program.status}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0, lineHeight: 1.55, maxWidth: '600px' }}>
              {program.desc || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Tabs inside the Program */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '1.5rem', marginTop: '-0.5rem' }}>
        {['Overview', 'Learners', 'Sessions', 'Resources', 'Assessments'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', padding: '0.65rem 0.2rem',
                color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.45)',
                fontWeight: isActive ? 700 : 500, fontSize: '0.85rem',
                borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* ── TAB: Overview ── */}
        {activeTab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Learners',    value: learnerCount,    icon: <Users size={20} />,         color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
                { label: 'Sessions',    value: sessionCount,    icon: <Calendar size={20} />,      color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
                { label: 'Resources',   value: resourceCount,   icon: <FileText size={20} />,      color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
                { label: 'Assessments', value: assessmentCount, icon: <ClipboardList size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
              ].map(card => (
                <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.05rem' }}>{card.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Program Status & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'start' }}>
              {/* Program Status */}
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {checklist.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {item.done
                          ? <CheckCircle2 size={18} color="#22c55e" />
                          : <Circle size={18} color="rgba(255,255,255,0.2)" />
                        }
                        <div>
                          <span style={{ fontSize: '0.82rem', color: item.done ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                          {item.optional && !item.done && (
                            <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>optional</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
                  <Activity size={16} color="#D4AF37" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h3>
                </div>
                {activityLog.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {activityLog.slice(0, 10).map((entry, i) => (
                      <div key={entry.id} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: i < Math.min(activityLog.length, 10) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37', marginTop: '0.35rem', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{entry.text}</span>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>{entry.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                    <Activity size={28} color="rgba(255,255,255,0.1)" />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', margin: 0 }}>No activity yet</p>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', margin: 0 }}>Activity will appear here as the program records are updated in your workspace.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Learners ── */}
        {activeTab === 'Learners' && (
          <LearnersTab
            programs={[program]}
            setPrograms={setPrograms}
            learners={programLearners}
            setLearners={setLearners}
            onNavigateToPrograms={() => {}}
          />
        )}

        {/* ── TAB: Sessions ── */}
        {activeTab === 'Sessions' && (
          <SessionsTab
            programs={[program]}
            setPrograms={setPrograms}
            learners={programLearners}
            onNavigateToPrograms={() => {}}
          />
        )}

        {/* ── TAB: Resources ── */}
        {activeTab === 'Resources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Resources</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.2rem' }}>Instructional materials and files uploaded for this program.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setFileError('');
                  setResourceForm({ name: '', type: 'PDF', description: '' });
                  setShowUploadModal(true);
                }}
                style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.25)' }}
              >
                <Plus size={15} /> Upload Resource
              </button>
            </div>

            {program.resources && program.resources.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
                {program.resources.map(res => (
                  <div key={res.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                    <button
                      onClick={() => handleDeleteResource(res.id, res.name)}
                      style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                    >
                      <Trash2 size={15} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingRight: '2rem' }}>
                      <FileText size={20} color="#D4AF37" />
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: 0 }}>{res.name}</h4>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem' }}>
                          {res.type}
                        </span>
                      </div>
                    </div>
                    {res.description && (
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>{res.description}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                      <span>{res.fileName}</span>
                      <span>{res.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#0e0f14', border: '1px dotted rgba(255,255,255,0.15)', borderRadius: '12px', padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <FileText size={24} color="#D4AF37" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>No resources uploaded yet</h4>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem', maxWidth: '340px', margin: '0.3rem auto 0 auto', lineHeight: 1.5 }}>
                    Upload slides, syllabi, safety documents, or manuals for learners.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.55rem 1.25rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' }}
                >
                  Upload Resource
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Assessments ── */}
        {activeTab === 'Assessments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Assessments</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.2rem' }}>Quizzes, exams, and projects designed for this program.</p>
              </div>
              <button
                onClick={() => {
                  setAssessmentForm({ name: '', type: 'Quiz', passingScore: '' });
                  setShowAssessmentModal(true);
                }}
                style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.25)' }}
              >
                <Plus size={15} /> Create Assessment
              </button>
            </div>

            {program.assessments && program.assessments.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {program.assessments.map(ass => (
                  <div key={ass.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                    <button
                      onClick={() => handleDeleteAssessment(ass.id, ass.name)}
                      style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                    >
                      <Trash2 size={15} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <ClipboardList size={20} color="#D4AF37" />
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: 0 }}>{ass.name}</h4>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem' }}>
                          {ass.type}
                        </span>
                      </div>
                    </div>
                    {ass.passingScore && (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>
                        Passing Score: <strong style={{ color: '#fff' }}>{ass.passingScore}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#0e0f14', border: '1px dotted rgba(255,255,255,0.15)', borderRadius: '12px', padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <ClipboardList size={24} color="#D4AF37" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>No assessments created yet</h4>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem', maxWidth: '340px', margin: '0.3rem auto 0 auto', lineHeight: 1.5 }}>
                    Create quizzes, surveys, and knowledge checks to evaluate your learners.
                  </p>
                </div>
                <button
                  onClick={() => setShowAssessmentModal(true)}
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.55rem 1.25rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' }}
                >
                  Create Assessment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          UPLOAD RESOURCE MODAL
      ════════════════════════════════════════ */}
      {showUploadModal && (
        <div style={modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Upload Resource</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Add a program resource file to {program.name}</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleUploadResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Resource File</label>
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed rgba(212,175,55,0.25)', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.01)', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,.docx,.pptx,.xlsx,.mp4" style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                  {selectedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <File size={26} color="#D4AF37" />
                      <div style={{ textAlign: 'left', maxWidth: '280px', overflow: 'hidden' }}>
                        <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectedFile.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{formatBytes(selectedFile.size)}</div>
                      </div>
                      <button type="button" onClick={e => { e.stopPropagation(); setSelectedFile(null); setFileError(''); }}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.7rem', fontWeight: 700, borderRadius: '5px', padding: '0.2rem 0.5rem', cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FolderUp size={24} color="#D4AF37" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>Drag & drop file here or <span style={{ color: '#D4AF37', textDecoration: 'underline' }}>Browse Files</span></div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Supported formats: .PDF, .DOCX, .PPTX, .XLSX, .MP4</div>
                    </div>
                  )}
                </div>
                {fileError && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontSize: '0.75rem' }}>
                    <AlertTriangle size={12} /> {fileError}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Resource Name</label>
                <input required type="text" placeholder="e.g. Syllabus Guide" value={resourceForm.name}
                  onChange={e => setResourceForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Resource Type</label>
                <div style={{ position: 'relative' }}>
                  <select value={resourceForm.type} onChange={e => setResourceForm(p => ({ ...p, type: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}>
                    {['PDF', 'Document', 'Presentation', 'Spreadsheet', 'Video', 'Other'].map(t => <option key={t} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <textarea rows={3} placeholder="Brief summary of document content..." value={resourceForm.description}
                  onChange={e => setResourceForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={!selectedFile || !resourceForm.name.trim()}
                  style={{ flex: 2, padding: '0.75rem', background: (!selectedFile || !resourceForm.name.trim()) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: (!selectedFile || !resourceForm.name.trim()) ? 'rgba(255,255,255,0.3)' : '#000', borderRadius: '8px', cursor: (!selectedFile || !resourceForm.name.trim()) ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          CREATE ASSESSMENT MODAL
      ════════════════════════════════════════ */}
      {showAssessmentModal && (
        <div style={modalOverlay} onClick={() => setShowAssessmentModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create Assessment</h3>
              <button onClick={() => setShowAssessmentModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Assessment Name</label>
                <input required type="text" placeholder="e.g. Module 1 Knowledge Check" value={assessmentForm.name}
                  onChange={e => setAssessmentForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Assessment Type</label>
                <div style={{ position: 'relative' }}>
                  <select value={assessmentForm.type} onChange={e => setAssessmentForm(p => ({ ...p, type: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}>
                    {['Quiz', 'Assignment', 'Project', 'Practical', 'Written Exam', 'Peer Review'].map(t => <option key={t} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Passing Score <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <input type="text" placeholder="e.g. 70%" value={assessmentForm.passingScore}
                  onChange={e => setAssessmentForm(p => ({ ...p, passingScore: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAssessmentModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Create Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
