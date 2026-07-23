import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Users, Calendar, FileText, ClipboardList,
  CheckCircle2, Circle, Search, X, UserPlus, Play, Check, Plus, Send, BarChart3, Award, Upload, Download, RotateCcw, ShieldCheck
} from 'lucide-react';

export default function ProgramDetail({ program, programLearners = [], teamMembers = [], setPrograms, setLearners, userRole, onBack }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacs, setSelectedFacs] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  // Input states for operational sub-tabs
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60 mins');
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);

  // Resource uploads
  const [resourceName, setResourceName] = useState('');
  const [resourceSize, setResourceSize] = useState('2.4 MB');

  // Assessments
  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentType, setAssessmentType] = useState('quiz');
  const [assessmentDeadline, setAssessmentDeadline] = useState('');

  // Announcements
  const [annText, setAnnText] = useState('');

  // Attendance marking
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [attendanceState, setAttendanceState] = useState({});

  // Team Member Register Learner
  const [newLearnerName, setNewLearnerName] = useState('');
  const [newLearnerEmail, setNewLearnerEmail] = useState('');

  // Certificates list
  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_certificates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveCerts = (newCerts) => {
    setCertificates(newCerts);
    localStorage.setItem('oyen_ws_certificates', JSON.stringify(newCerts));
  };

  useEffect(() => {
    setSelectedFacs(program.assignedFacilitators || []);
  }, [program.assignedFacilitators, showAssignModal]);

  /* ── derived counts ── */
  const sessionCount    = (program.sessions    || []).length;
  const programResourceCount = (program.resources || []).length;
  const sessionResourceCount = (program.sessions || []).reduce((acc, s) => acc + (s.resources || []).length, 0);
  const resourceCount   = programResourceCount + sessionResourceCount;
  const assessmentCount = (program.assessments || []).length;
  const learnerCount    = programLearners.length;

  const hasLearners     = learnerCount > 0;
  const hasSession      = sessionCount > 0;
  const hasResource     = resourceCount > 0;
  const hasAssessment   = assessmentCount > 0;

  const checklist = [
    { label: 'Program created',      done: true },
    { label: 'Participants added',   done: hasLearners },
    { label: 'Session scheduled',    done: hasSession,   optional: true },
    { label: 'Resources uploaded',   done: hasResource,  optional: true },
    { label: 'Assessment created',   done: hasAssessment,optional: true },
  ];

  const statusColor = program.status === 'Active' ? { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' }
                    : program.status === 'Draft'   ? { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' }
                    : { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' };

  // Fetch assigned facilitators
  const assignedEmails = program.assignedFacilitators || [];
  const assignedFacs = teamMembers.filter(m => assignedEmails.includes(m.email));

  // Find all active assignable staff in workspace
  const activeFacilitators = teamMembers.filter(m => m.status === 'Active' && m.role !== 'Admin');
  const filteredFacilitators = activeFacilitators.filter(m => 
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (email) => {
    if (selectedFacs.includes(email)) {
      setSelectedFacs(prev => prev.filter(e => e !== email));
    } else {
      setSelectedFacs(prev => [...prev, email]);
    }
  };

  const handleSaveFacilitator = () => {
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, assignedFacilitators: selectedFacs } 
          : p
      ));
    }
    setShowAssignModal(false);
  };

  // Create Session
  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;
    const newSession = {
      id: Date.now(),
      title: sessionTitle.trim(),
      date: sessionDate || 'TBD',
      time: sessionTime || '10:00 AM',
      duration: sessionDuration,
      status: 'Upcoming',
      attendance: {},
      resources: [],
      notes: ''
    };
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, sessions: [...(p.sessions || []), newSession] } 
          : p
      ));
    }
    setSessionTitle('');
    setSessionDate('');
    setSessionTime('');
    setShowCreateSessionModal(false);
  };

  // Upload Resource
  const handleUploadResource = (e) => {
    e.preventDefault();
    if (!resourceName.trim()) return;
    const newResource = {
      id: Date.now(),
      name: resourceName.trim(),
      type: resourceName.split('.').pop()?.toUpperCase() || 'PDF',
      date: new Date().toLocaleDateString('en-GB'),
      size: resourceSize,
      uploadedBy: 'Team Member Operations'
    };
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, resources: [...(p.resources || []), newResource] } 
          : p
      ));
    }
    setResourceName('');
  };

  // Create Assessment
  const handleCreateAssessment = (e) => {
    e.preventDefault();
    if (!assessmentName.trim()) return;
    const newAssessment = {
      id: Date.now(),
      name: assessmentName.trim(),
      type: assessmentType,
      deadline: assessmentDeadline || 'TBD',
      submissionsCount: 0,
      pendingGrading: 0,
      avgScore: 0,
      published: false
    };
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, assessments: [...(p.assessments || []), newAssessment] } 
          : p
      ));
    }
    setAssessmentName('');
    setAssessmentDeadline('');
  };

  // Create Announcement
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!annText.trim()) return;
    const newAnn = {
      id: Date.now(),
      text: annText.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Sent',
      by: userRole === 'Team Member' ? 'Operations Staff' : 'Lead Facilitator'
    };
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, announcements: [...(p.announcements || []), newAnn] } 
          : p
      ));
    }
    setAnnText('');
  };

  // Save Attendance Roll Call
  const handleSaveAttendance = () => {
    if (!selectedSessionId) return;
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? {
              ...p,
              sessions: (p.sessions || []).map(s => 
                s.id === Number(selectedSessionId) 
                  ? { ...s, attendance: attendanceState } 
                  : s
              )
            }
          : p
      ));
      alert('Attendance saved successfully.');
    }
  };

  // Register Learner (Team Member specific)
  const handleRegisterLearner = (e) => {
    e.preventDefault();
    if (!newLearnerName.trim() || !newLearnerEmail.trim()) return;
    const newL = {
      id: Date.now(),
      name: newLearnerName.trim(),
      email: newLearnerEmail.trim(),
      program: program.name,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-GB')
    };
    if (setLearners) {
      setLearners(prev => [...prev, newL]);
      alert(`Successfully registered ${newLearnerName}!`);
    }
    setNewLearnerName('');
    setNewLearnerEmail('');
  };

  // Generate Certificate
  const handleGenerateCert = (email, name) => {
    const newCert = {
      id: Date.now(),
      name,
      email,
      programId: program.id,
      programName: program.name,
      status: 'Issued',
      date: new Date().toLocaleDateString('en-GB')
    };
    saveCerts([newCert, ...certificates]);
    alert(`Certificate generated for ${name}!`);
  };

  const handleReissueCert = (id) => {
    const updated = certificates.map(c => 
      c.id === id 
        ? { ...c, date: new Date().toLocaleDateString('en-GB'), status: 'Reissued' } 
        : c
    );
    saveCerts(updated);
    alert('Certificate reissued!');
  };

  const isAdmin = userRole === 'Admin';
  
  const subTabs = userRole === 'Viewer'
    ? ['Overview', 'Learners', 'Sessions', 'Resources', 'Assessments', 'Reports', 'Announcements']
    : (userRole === 'Team Member'
        ? ['Overview', 'Learners', 'Sessions', 'Resources', 'Announcements', 'Certificates', 'Reports']
        : ['Overview', 'Sessions', 'Learners', 'Attendance', 'Resources', 'Assessments', 'Announcements', 'Reports']);

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
            <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem', margin: 0, lineHeight: 1.55, maxWidth: '600px' }}>
              {program.desc || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Operational Workspace Sub-Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '0.5rem', overflowX: 'auto' }}>
        {subTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: '0.6rem 1.1rem',
              backgroundColor: activeSubTab === tab ? 'rgba(245,215,110,0.08)' : 'transparent',
              border: 'none',
              color: activeSubTab === tab ? '#F5D76E' : 'rgba(255,255,255,0.5)',
              borderBottom: activeSubTab === tab ? '2px solid #F5D76E' : 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-Tab Rendering */}
      {activeSubTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Participants', value: learnerCount,    icon: <Users size={20} />,         color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Program Status Checklist */}
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

            {/* Facilitators List */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Facilitators</h3>
                <button onClick={() => setShowAssignModal(true)} style={{ backgroundColor: '#D4AF37', color: '#000', border: 'none', borderRadius: '4px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  Assign
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {assignedFacs.length === 0 ? (
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                    No facilitators assigned yet.
                  </span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {assignedFacs.map((fac, idx) => (
                      <div key={fac.email} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: fac.color || '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                          {fac.initials || 'F'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: idx === 0 ? '#D4AF37' : 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {idx === 0 ? 'Lead Facilitator' : 'Facilitator'}
                          </div>
                          <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{fac.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Program Sessions</h3>
          </div>

          {(program.sessions || []).length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)' }}>
              No sessions scheduled for this program yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {(program.sessions || []).map(s => (
                <div key={s.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>{s.title}</h4>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.45rem' }}>
                      <span>📅 Date: {s.date}</span>
                      <span>⏰ Time: {s.time}</span>
                      <span>⏱️ Duration: {s.duration || '60 mins'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {userRole === 'Viewer' ? (
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Read Only View</span>
                    ) : userRole === 'Team Member' ? (
                      <>
                        <button onClick={() => alert(`Logistics checklist prepared!`)} style={{ padding: '0.45rem 0.85rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Prepare Logistics</button>
                        <button onClick={() => alert(`Attendance sheet uploaded!`)} style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>Upload Attendance</button>
                        <button onClick={() => alert(`Session recording uploaded!`)} style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>Upload Recording</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => alert(`Starting Live training...`)} style={{ padding: '0.45rem 0.85rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Start OYEN Live</button>
                        <button onClick={() => alert(`Recording attendance...`)} style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>Record Attendance</button>
                        <button onClick={() => alert(`Presentation dialog triggered...`)} style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>Upload Presentation</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'Learners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {userRole === 'Team Member' && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Register New Learner</h3>
              <form onSubmit={handleRegisterLearner} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input required type="text" placeholder="Full Name" value={newLearnerName} onChange={e => setNewLearnerName(e.target.value)} style={{ flex: 1, padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                <input required type="email" placeholder="Email Address" value={newLearnerEmail} onChange={e => setNewLearnerEmail(e.target.value)} style={{ flex: 1, padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                <button type="submit" style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Register</button>
              </form>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => alert('Mocking import from CSV file!')} style={{ padding: '0.45rem 0.9rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Upload size={12} /> Import list (CSV)</button>
                <button onClick={() => alert('Mocking export list!')} style={{ padding: '0.45rem 0.9rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Download size={12} /> Export list</button>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Learners Directory</h3>
          
          {programLearners.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)' }}>
              No learners enrolled in this program yet.
            </div>
          ) : (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Name</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Email</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Attendance %</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Progress %</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Assessment Score</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {programLearners.map((l, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#fff' }}>
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>{l.name}</td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.5)' }}>{l.email}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>92%</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>65%</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>88/100</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <button onClick={() => alert(`Viewing profile for ${l.name}...`)} style={{ padding: '0.25rem 0.55rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}>View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'Attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Mark Attendance</h3>
            <button
              onClick={handleSaveAttendance}
              disabled={!selectedSessionId}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', opacity: selectedSessionId ? 1 : 0.5 }}
            >
              Save Attendance
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Select Session</label>
            <select
              value={selectedSessionId}
              onChange={e => {
                setSelectedSessionId(e.target.value);
                const sess = (program.sessions || []).find(s => s.id === Number(e.target.value));
                setAttendanceState(sess?.attendance || {});
              }}
              style={{ width: '100%', maxWidth: '300px', padding: '0.65rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            >
              <option value="">Select a Session</option>
              {(program.sessions || []).map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.date})</option>
              ))}
            </select>
          </div>

          {selectedSessionId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {programLearners.map(l => {
                const status = attendanceState[l.email] || 'Unmarked';
                return (
                  <div key={l.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{l.name}</span>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{l.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Present', 'Late', 'Absent'].map(st => (
                        <button
                          key={st}
                          onClick={() => setAttendanceState(prev => ({ ...prev, [l.email]: st }))}
                          style={{
                            padding: '0.35rem 0.6rem',
                            backgroundColor: status === st ? 'rgba(245,215,110,0.15)' : 'transparent',
                            border: '1px solid',
                            borderColor: status === st ? '#F5D76E' : 'rgba(255,255,255,0.1)',
                            color: status === st ? '#F5D76E' : 'rgba(255,255,255,0.5)',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'Resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {userRole !== 'Viewer' && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Upload Resource File</h3>
              <form onSubmit={handleUploadResource} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lesson_Slides.pdf"
                  value={resourceName}
                  onChange={e => setResourceName(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Upload File
                </button>
              </form>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                <span>Storage Used</span>
                <strong>2.4 GB / 10 GB</strong>
              </div>
              <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden', marginTop: '0.4rem' }}>
                <div style={{ height: '100%', width: '24%', backgroundColor: '#F5D76E', borderRadius: '99px' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>Materials List</h4>
            {(program.resources || []).length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                No resources uploaded yet.
              </div>
            ) : (
              (program.resources || []).map(r => (
                <div key={r.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase', marginRight: '0.5rem' }}>
                      {r.type}
                    </span>
                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{r.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginLeft: '0.75rem' }}>({r.size})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => alert(`Downloading ${r.name}...`)} style={{ padding: '0.3rem 0.6rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}>Download</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'Assessments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {userRole !== 'Viewer' && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Create Assessment</h3>
              <form onSubmit={handleCreateAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  required
                  type="text"
                  placeholder="Assessment Title..."
                  value={assessmentName}
                  onChange={e => setAssessmentName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select
                    value={assessmentType}
                    onChange={e => setAssessmentType(e.target.value)}
                    style={{ flex: 1, padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  >
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                  </select>
                  <input
                    type="date"
                    value={assessmentDeadline}
                    onChange={e => setAssessmentDeadline(e.target.value)}
                    style={{ flex: 1, padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{ padding: '0.65rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Publish Assessment
                </button>
              </form>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {(program.assessments || []).map(a => (
              <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {a.type}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Due: {a.deadline}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>{a.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'Announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {userRole !== 'Viewer' && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Post Announcement</h3>
              <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  required
                  placeholder="Broadcast to all learners in this program..."
                  value={annText}
                  onChange={e => setAnnText(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                  Post Message
                </button>
              </form>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>History</h4>
            {(program.announcements || []).map(a => (
              <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>Posted on {a.date} by {a.by || 'Staff'}</div>
                <p style={{ color: '#fff', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'Certificates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Program Certificates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: '0 0 1rem 0' }}>Enrolled Learners</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {programLearners.map(l => {
                  const hasCert = certificates.some(c => c.email === l.email && c.programId === program.id);
                  return (
                    <div key={l.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{l.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{l.email}</div>
                      </div>
                      <button
                        onClick={() => handleGenerateCert(l.email, l.name)}
                        disabled={hasCert}
                        style={{ padding: '0.35rem 0.75rem', backgroundColor: hasCert ? 'rgba(255,255,255,0.05)' : '#F5D76E', border: 'none', color: hasCert ? 'rgba(255,255,255,0.3)' : '#000', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: hasCert ? 'not-allowed' : 'pointer' }}
                      >
                        {hasCert ? 'Generated' : 'Generate'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '#0.92rem', color: '#fff', margin: '0 0 1rem 0' }}>Issued Log</h4>
              {certificates.filter(c => c.programId === program.id).length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>No certificates issued for this program.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {certificates.filter(c => c.programId === program.id).map(c => (
                    <div key={c.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{c.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                          <ShieldCheck size={11} color="#22c55e" /> {c.status} · {c.date}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => alert('Certificate PDF downloaded!')} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}><Download size={11} /></button>
                        <button onClick={() => handleReissueCert(c.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}><RotateCcw size={11} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'Reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Operational Analytics</h3>
            {userRole === 'Viewer' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => alert('Exporting PDF...')} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}><Download size={12} style={{ marginRight: '0.3rem', display: 'inline' }} /> Export PDF</button>
                <button onClick={() => alert('Exporting Excel...')} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}><Download size={12} style={{ marginRight: '0.3rem', display: 'inline' }} /> Export Excel</button>
                <button onClick={() => window.print()} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Print Report</button>
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Attendance Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginTop: '0.25rem' }}>92.4%</div>
            </div>
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Progress Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5D76E', marginTop: '0.25rem' }}>65.0%</div>
            </div>
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Completion Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.25rem' }}>85.7%</div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div onClick={() => setShowAssignModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Assign Facilitator</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', fontSize: '0.82rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredFacilitators.map(fac => {
                const isChecked = selectedFacs.includes(fac.email);
                return (
                  <div key={fac.email} onClick={() => handleToggleSelect(fac.email)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.8rem', backgroundColor: isChecked ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)', border: '1px solid', borderColor: isChecked ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', cursor: 'pointer' }}>
                    <span style={{ color: '#fff', fontSize: '0.8rem' }}>{fac.name} ({fac.email})</span>
                    <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ accentColor: '#D4AF37' }} />
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowAssignModal(false)} style={{ flex: 1, padding: '0.65rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={handleSaveFacilitator} style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateSessionModal && (
        <div onClick={() => setShowCreateSessionModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Schedule Program Session</h3>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" placeholder="Session Title..." value={sessionTitle} onChange={e => setSessionTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              <input required type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              <input required type="time" value={sessionTime} onChange={e => setSessionTime(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              <button type="submit" style={{ padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Schedule</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
