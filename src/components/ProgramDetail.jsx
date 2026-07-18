import React, { useState } from 'react';
import {
  ArrowLeft, Users, Calendar, FileText, ClipboardList,
  Plus, CheckCircle2, Circle, Clock, BookOpen,
  X, ChevronDown, Upload, BarChart3, Activity,
  UserPlus, CalendarPlus, FolderUp, ClipboardPlus
} from 'lucide-react';

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

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <X size={15} />
      </button>
    </div>
  );
}

function FormActions({ onCancel, submitLabel }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
      <button type="button" onClick={onCancel} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
      <button type="submit" style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>{submitLabel}</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PROGRAM DETAIL COMPONENT
   Props:
     program             – the full program object
     setPrograms         – workspace setter
     programLearners     – learners already in this program (filtered)
     setLearners         – workspace learners setter
     onBack              – () => void  navigate back to Programs list
════════════════════════════════════════════════════════════ */
export default function ProgramDetail({ program, setPrograms, programLearners = [], setLearners, onBack }) {

  /* modal visibility */
  const [modal, setModal] = useState(null); // null | 'learner' | 'session' | 'resource' | 'assessment'

  /* form state */
  const [learnerForm, setLearnerForm]         = useState({ firstName: '', lastName: '', email: '' });
  const [sessionForm, setSessionForm]         = useState({ name: '', date: '', time: '', duration: '' });
  const [resourceForm, setResourceForm]       = useState({ name: '', type: 'Document', description: '' });
  const [assessmentForm, setAssessmentForm]   = useState({ name: '', type: 'Quiz', passingScore: '' });

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const now   = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · ' + today;

  /* ── helpers ── */
  const updateProgram = (updater) =>
    setPrograms(prev => prev.map(p => p.id === program.id ? updater(p) : p));

  const pushActivity = (text, prog) => ({
    ...prog,
    activity: [{ id: Date.now(), text, time: now }, ...(prog.activity || [])],
  });

  /* ── Add Learner ── */
  const handleAddLearner = (e) => {
    e.preventDefault();
    const name = `${learnerForm.firstName.trim()} ${learnerForm.lastName.trim()}`.trim();
    setLearners(prev => [...prev, {
      id: Date.now(), name, email: learnerForm.email.trim(),
      program: program.name, status: 'Active', joined: today,
    }]);
    updateProgram(p => pushActivity(`${name} added as a learner`, p));
    setLearnerForm({ firstName: '', lastName: '', email: '' });
    setModal(null);
  };

  /* ── Schedule Session ── */
  const handleAddSession = (e) => {
    e.preventDefault();
    const session = { id: Date.now(), ...sessionForm };
    updateProgram(p => pushActivity(`Session "${session.name}" scheduled for ${session.date}`, {
      ...p, sessions: [...(p.sessions || []), session],
    }));
    setSessionForm({ name: '', date: '', time: '', duration: '' });
    setModal(null);
  };

  /* ── Upload Resource ── */
  const handleAddResource = (e) => {
    e.preventDefault();
    const resource = { id: Date.now(), ...resourceForm };
    updateProgram(p => pushActivity(`Resource "${resource.name}" uploaded`, {
      ...p, resources: [...(p.resources || []), resource],
    }));
    setResourceForm({ name: '', type: 'Document', description: '' });
    setModal(null);
  };

  /* ── Create Assessment ── */
  const handleAddAssessment = (e) => {
    e.preventDefault();
    const assessment = { id: Date.now(), ...assessmentForm };
    updateProgram(p => pushActivity(`Assessment "${assessment.name}" created`, {
      ...p, assessments: [...(p.assessments || []), assessment],
    }));
    setAssessmentForm({ name: '', type: 'Quiz', passingScore: '' });
    setModal(null);
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

  /* ── setup checklist ── */
  const checklist = [
    { label: 'Program created',      done: true,         alwaysDone: true },
    { label: 'Learners added',       done: hasLearners,  action: () => setModal('learner'),   actionLabel: 'Add Learners' },
    { label: 'Session scheduled',    done: hasSession,   action: () => setModal('session'),   actionLabel: 'Schedule Session',  optional: true },
    { label: 'Resources uploaded',   done: hasResource,  action: () => setModal('resource'),  actionLabel: 'Upload Resource',   optional: true },
    { label: 'Assessment created',   done: hasAssessment,action: () => setModal('assessment'),actionLabel: 'Create Assessment', optional: true },
  ];

  /* ── quick actions ── */
  const quickActions = [
    { icon: <UserPlus size={20} />,     label: 'Add Learner',       color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    action: () => setModal('learner') },
    { icon: <CalendarPlus size={20} />, label: 'Schedule Session',  color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  action: () => setModal('session') },
    { icon: <FolderUp size={20} />,     label: 'Upload Resource',   color: '#a855f7', bg: 'rgba(168,85,247,0.08)',  action: () => setModal('resource') },
    { icon: <ClipboardPlus size={20} />,label: 'Create Assessment', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  action: () => setModal('assessment') },
  ];

  const statusColor = program.status === 'Active' ? { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' }
                    : program.status === 'Draft'   ? { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' }
                    : { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' };

  const closeModal = () => setModal(null);

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
          <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
            <button onClick={() => setModal('learner')}
              style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.6rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(212,175,55,0.25)' }}>
              <Plus size={14} /> Add Learner
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
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

      {/* ── Two-column lower section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* ── Program Setup ── */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Setup</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                {!item.done && item.action && (
                  <button onClick={item.action}
                    style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    {item.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {quickActions.map((action, i) => (
              <button key={i} onClick={action.action}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', padding: '1rem', backgroundColor: action.bg, border: `1px solid ${action.color}22`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = action.bg.replace('0.08', '0.14'); e.currentTarget.style.borderColor = action.color + '55'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = action.bg; e.currentTarget.style.borderColor = action.color + '22'; }}
              >
                <span style={{ color: action.color }}>{action.icon}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
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
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', margin: 0 }}>Activity will appear here as you add learners, sessions, resources, and assessments.</p>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          ADD LEARNER MODAL
      ════════════════════════════════════════ */}
      {modal === 'learner' && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <ModalHeader title="Add Learner" subtitle={`Add a learner to ${program.name}`} onClose={closeModal} />
            <form onSubmit={handleAddLearner} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input required type="text" placeholder="John" value={learnerForm.firstName}
                    onChange={e => setLearnerForm(p => ({ ...p, firstName: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input required type="text" placeholder="Doe" value={learnerForm.lastName}
                    onChange={e => setLearnerForm(p => ({ ...p, lastName: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input required type="email" placeholder="john@company.com" value={learnerForm.email}
                  onChange={e => setLearnerForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </div>
              <FormActions onCancel={closeModal} submitLabel="Add Learner" />
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          SCHEDULE SESSION MODAL
      ════════════════════════════════════════ */}
      {modal === 'session' && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <ModalHeader title="Schedule Session" subtitle={`Add a training session to ${program.name}`} onClose={closeModal} />
            <form onSubmit={handleAddSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Session Name</label>
                <input required type="text" placeholder="e.g. Introduction to Leadership" value={sessionForm.name}
                  onChange={e => setSessionForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input required type="date" value={sessionForm.date}
                    onChange={e => setSessionForm(p => ({ ...p, date: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={labelStyle}>Time</label>
                  <input type="time" value={sessionForm.time}
                    onChange={e => setSessionForm(p => ({ ...p, time: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input type="text" placeholder="e.g. 2 hours" value={sessionForm.duration}
                  onChange={e => setSessionForm(p => ({ ...p, duration: e.target.value }))} style={inputStyle} />
              </div>
              <FormActions onCancel={closeModal} submitLabel="Schedule Session" />
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          UPLOAD RESOURCE MODAL
      ════════════════════════════════════════ */}
      {modal === 'resource' && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <ModalHeader title="Upload Resource" subtitle={`Add a resource to ${program.name}`} onClose={closeModal} />
            <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Resource Name</label>
                <input required type="text" placeholder="e.g. Module 1 Slides" value={resourceForm.name}
                  onChange={e => setResourceForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Resource Type</label>
                <div style={{ position: 'relative' }}>
                  <select value={resourceForm.type} onChange={e => setResourceForm(p => ({ ...p, type: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}>
                    {['Document', 'Video', 'Presentation', 'Spreadsheet', 'PDF', 'Link', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <textarea rows={3} placeholder="Brief description of this resource..." value={resourceForm.description}
                  onChange={e => setResourceForm(p => ({ ...p, description: e.target.value }))}
                  style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <FormActions onCancel={closeModal} submitLabel="Add Resource" />
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          CREATE ASSESSMENT MODAL
      ════════════════════════════════════════ */}
      {modal === 'assessment' && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <ModalHeader title="Create Assessment" subtitle={`Add an assessment to ${program.name}`} onClose={closeModal} />
            <form onSubmit={handleAddAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    {['Quiz', 'Assignment', 'Project', 'Practical', 'Written Exam', 'Peer Review'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Passing Score <span style={{ textTransform: 'none', fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <input type="text" placeholder="e.g. 70%" value={assessmentForm.passingScore}
                  onChange={e => setAssessmentForm(p => ({ ...p, passingScore: e.target.value }))} style={inputStyle} />
              </div>
              <FormActions onCancel={closeModal} submitLabel="Create Assessment" />
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
