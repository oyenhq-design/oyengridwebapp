import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Users, Calendar, FileText, ClipboardList,
  CheckCircle2, Circle, Search, X, UserPlus, Play, Check, Plus, Send, BarChart3, Award, Upload, Download, RotateCcw, ShieldCheck, ChevronDown, Sparkles
} from 'lucide-react';

export default function ProgramDetail({ program, programLearners = [], teamMembers = [], setPrograms, setLearners, userRole, onBack, setActiveTab, triggerTransition }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacs, setSelectedFacs] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [showParticipantsGuide, setShowParticipantsGuide] = useState(false);
  const [faqOpen, setFaqOpen] = useState({});

  // Input states for operational sub-tabs

  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60 mins');
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);

  // Extra session form states (attached image 2 fields)
  const [sessionType, setSessionType] = useState('Live Training');
  const [facilitatorName, setFacilitatorName] = useState('');
  const [facilitatorEmail, setFacilitatorEmail] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState('');
  const [sessionEndTime, setSessionEndTime] = useState('');
  const [enableOyenLive, setEnableOyenLive] = useState(false);
  const [externalMeetingLink, setExternalMeetingLink] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');

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
  const [successScreen, setSuccessScreen] = useState(false);

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
      type: sessionType,
      facilitatorName: facilitatorName.trim(),
      facilitatorEmail: facilitatorEmail.trim(),
      date: sessionDate || 'TBD',
      time: sessionStartTime || '10:00 AM',
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      enableOyenLive,
      externalMeetingLink: externalMeetingLink.trim(),
      description: sessionDescription.trim(),
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
    setSuccessScreen(true);
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
    ? ['Overview', 'Participants', 'Sessions', 'Resources', 'Assessments', 'Reports', 'Announcements']
    : (userRole === 'Team Member'
        ? ['Overview', 'Participants', 'Sessions', 'Resources', 'Announcements', 'Certificates', 'Reports']
        : ['Overview', 'Sessions', 'Participants', 'Attendance', 'Resources', 'Assessments', 'Announcements', 'Reports']);

  const doneSteps = [
    true, // Program Created
    assignedFacs.length > 0,
    learnerCount > 0,
    hasSession,
    hasResource,
    hasAssessment
  ].filter(Boolean).length;
  const progressPct = Math.round((doneSteps / 6) * 100);

  // Determine current recommended action
  let nextActionTitle = 'Assign Facilitators';
  let nextActionDesc = 'Assign facilitators to this program before inviting participants. Facilitators help manage sessions, learners, attendance and assessments.';
  let nextActionBtnText = 'Assign Facilitators';
  let nextActionHandler = () => setShowAssignModal(true);

  if (assignedFacs.length === 0) {
    nextActionTitle = 'Assign Facilitators';
    nextActionDesc = 'Assign facilitators to this program before inviting participants. Facilitators help manage sessions, learners, attendance and assessments.';
    nextActionBtnText = 'Assign Facilitators';
    nextActionHandler = () => setShowAssignModal(true);

  } else if (learnerCount === 0) {
    nextActionTitle = 'Invite Participants';
    nextActionDesc = 'Invite participants to enroll in this program. You can add them manually or import a list via CSV.';
    nextActionBtnText = 'Invite Participants';
    nextActionHandler = () => {
      if (setActiveTab) {
        if (triggerTransition) {
          triggerTransition(() => setActiveTab('Participants'));
        } else {
          setActiveTab('Participants');
        }
      } else {
        setActiveSubTab('Participants');
      }
    };
  } else if (sessionCount === 0) {
    nextActionTitle = 'Schedule Session';
    nextActionDesc = 'Plan and schedule your first virtual or live session. This creates calendar invites and links for participants.';
    nextActionBtnText = 'Schedule Session';
    nextActionHandler = () => setShowCreateSessionModal(true);
  } else if (resourceCount === 0) {
    nextActionTitle = 'Upload Resources';
    nextActionDesc = 'Add study materials, guides, assignments, or documents for your participants.';
    nextActionBtnText = 'Upload Resources';
    nextActionHandler = () => setActiveSubTab('Resources');
  } else if (assessmentCount === 0) {
    nextActionTitle = 'Create Assessment';
    nextActionDesc = 'Create your first quiz, assignment, or project to evaluate participant performance.';
    nextActionBtnText = 'Create Assessment';
    nextActionHandler = () => setActiveSubTab('Assessments');
  } else {
    nextActionTitle = 'Publish Program';
    nextActionDesc = 'Your program setup is complete. Publish the program to make it live for everyone in the workspace.';
    nextActionBtnText = 'Publish Program';
    nextActionHandler = () => {
      if (setPrograms) {
        setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, status: 'Active' } : p));
      }
      alert('Program published successfully!');
    };
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', backgroundColor: '#F8F5EF', minHeight: '100%' }}>

      {/* ── Back nav ── */}
      <button onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#6B7280', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, width: 'fit-content', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#D4A017'}
        onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
      >
        <ArrowLeft size={15} /> Programs
      </button>

      {/* ── Program header ── */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>{program.name}</h1>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor.color, backgroundColor: statusColor.bg, padding: '0.22rem 0.6rem', borderRadius: '5px', flexShrink: 0 }}>
                {program.status}
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: '0 0 1.25rem 0', lineHeight: 1.55, maxWidth: '600px' }}>
              {program.desc || 'No description provided.'}
            </p>
            
            {/* Setup Progress Indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #E8E2D8', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#151515' }}>
                <span>Program Setup Progress</span>
                <span style={{ color: '#D4A017' }}>{doneSteps} of 6 completed ({progressPct}%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E8E2DA', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #F5C84C, #D4A017)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Operational Workspace Sub-Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E8E2D8', pb: '0.5rem', overflowX: 'auto' }}>
        {subTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: '0.6rem 1.1rem',
              backgroundColor: activeSubTab === tab ? 'rgba(212,160,23,0.06)' : 'transparent',
              border: 'none',
              color: activeSubTab === tab ? '#D4A017' : '#6B7280',
              borderBottom: activeSubTab === tab ? '2px solid #D4A017' : 'none',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Participants',    value: learnerCount,    icon: <Users size={20} />,         color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
              { label: 'Sessions',    value: sessionCount,    icon: <Calendar size={20} />,      color: '#D4A017', bg: 'rgba(212,160,23,0.08)' },
              { label: 'Resources',   value: resourceCount,   icon: <FileText size={20} />,      color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
              { label: 'Assessments', value: assessmentCount, icon: <ClipboardList size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
            ].map(card => (
              <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(100,90,75,0.02)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{card.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#151515', marginTop: '0.1rem' }}>{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Setup Checklist & Contextual Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left: Complete Your Program Setup Checklist */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 2px 10px rgba(100,90,75,0.02)' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Complete Your Program Setup</h3>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0.35rem 0 0 0' }}>Follow the recommended checklist order to launch your training initiative successfully.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Program Created', done: true, optional: false },
                  { label: 'Add Facilitators', done: assignedFacs.length > 0, optional: false, tab: 'Overview', handler: () => setShowAssignModal(true), btnText: 'Assign' },
                  { label: 'Invite Participants', done: learnerCount > 0, optional: false, tab: 'Participants', handler: () => {
                    if (setActiveTab) {
                      if (triggerTransition) {
                        triggerTransition(() => setActiveTab('Participants'));
                      } else {
                        setActiveTab('Participants');
                      }
                    } else {
                      setActiveSubTab('Participants');
                    }
                  }, btnText: 'Invite' },
                  { label: 'Schedule Your First Session', done: hasSession, optional: false, tab: 'Sessions', handler: () => setShowCreateSessionModal(true), btnText: 'Schedule' },
                  { label: 'Upload Learning Resources', done: hasResource, optional: false, tab: 'Resources', handler: () => setActiveSubTab('Resources'), btnText: 'Upload' },
                  { label: 'Create an Assessment', done: hasAssessment, optional: true, tab: 'Assessments', handler: () => setActiveSubTab('Assessments'), btnText: 'Create' },
                  { label: 'Publish Program', done: program.status === 'Active', optional: false, tab: 'Overview', handler: () => {
                    if (setPrograms) setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, status: 'Active' } : p));
                    alert('Program published successfully!');
                  }, btnText: 'Publish' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx < 6 ? '1px solid #F3EFE6' : 'none', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.done ? (
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1.5px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                        ) : (
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #DDD6CA', backgroundColor: '#FFFFFF' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.88rem', color: item.done ? '#6B7280' : '#151515', fontWeight: item.done ? 600 : 700, textDecoration: item.done ? 'line-through' : 'none' }}>
                          {item.label}
                        </span>
                        {item.optional && !item.done && (
                          <span style={{ fontSize: '0.68rem', color: '#A0AEC0', fontWeight: 600, textTransform: 'uppercase' }}>Optional</span>
                        )}
                      </div>
                    </div>

                    {!item.done && (
                      <button 
                        onClick={item.handler}
                        style={{
                          padding: '0.35rem 0.85rem',
                          background: 'transparent',
                          border: '1px solid #D4A017',
                          color: '#D4A017',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,160,23,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Next Recommended Action Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Next Step Onboarding Recommended Card */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 2px 10px rgba(100,90,75,0.02)' }}>
                <div style={{ alignSelf: 'flex-start', fontSize: '10px', fontWeight: 700, color: '#D4A017', backgroundColor: 'rgba(212,160,23,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Next Step
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                    {nextActionTitle}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.5rem', lineHeight: 1.55 }}>
                    {nextActionDesc}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    onClick={nextActionHandler}
                    style={{
                      width: '100%', padding: '0.7rem',
                      background: '#D4A017', border: 'none',
                      color: '#151515', borderRadius: '8px',
                      fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(212, 160, 23, 0.2)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5B128'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4A017'}
                  >
                    {nextActionBtnText}
                  </button>
                  <button 
                    onClick={() => {
                      if (nextActionTitle.includes('Participants')) {
                        setShowParticipantsGuide(true);
                      } else {
                        alert('Opening guide article...');
                      }
                    }}
                    style={{
                      background: 'none', border: 'none', color: '#6B7280',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Learn about {nextActionTitle.split(' ').pop()}
                  </button>
                </div>
              </div>

              {/* Facilitators Quick List status block */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 2px 10px rgba(100,90,75,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Facilitators</h4>
                  <button onClick={() => setShowAssignModal(true)} style={{ background: 'transparent', border: 'none', color: '#D4A017', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    {assignedFacs.length > 0 ? 'Edit' : 'Assign'}
                  </button>
                </div>
                
                <div style={{ borderTop: '1px solid #F3EFE6', paddingTop: '1rem' }}>
                  {assignedFacs.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#6B7280' }}>
                      <p style={{ margin: 0, lineHeight: 1.45 }}>No facilitators assigned yet.</p>
                      <span style={{ fontSize: '11px', color: '#A0AEC0' }}>Assign at least one facilitator before launching your first session.</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                      {assignedFacs.map((fac, idx) => (
                        <div key={fac.email} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: fac.color || '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                            {fac.initials || 'F'}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: idx === 0 ? '#D4A017' : '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                              {idx === 0 ? 'Lead Facilitator' : 'Facilitator'}
                            </div>
                            <div style={{ color: '#151515', fontSize: '0.85rem', fontWeight: 600 }}>{fac.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Section — Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #E8E2D8', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
              {[
                { title: 'Assign Facilitators', icon: <Users size={18} color="#D4A017" />, handler: () => setShowAssignModal(true) },
                { title: 'Invite Participants', icon: <UserPlus size={18} color="#D4A017" />, handler: () => {
                  if (setActiveTab) {
                    if (triggerTransition) {
                      triggerTransition(() => setActiveTab('Participants'));
                    } else {
                      setActiveTab('Participants');
                    }
                  } else {
                    setActiveSubTab('Participants');
                  }
                } },
                { title: 'Schedule Session', icon: <Calendar size={18} color="#D4A017" />, handler: () => setShowCreateSessionModal(true) },
                { title: 'Upload Resources', icon: <Upload size={18} color="#D4A017" />, handler: () => setActiveSubTab('Resources') },
                { title: 'Create Assessment', icon: <ClipboardList size={18} color="#D4A017" />, handler: () => setActiveSubTab('Assessments') },
                { title: 'Open Settings', icon: <ShieldCheck size={18} color="#D4A017" />, handler: () => alert('Opening settings panel...') }
              ].map((act, i) => (
                <div 
                  key={i} 
                  onClick={act.handler}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E2D8',
                    borderRadius: '12px',
                    padding: '1.25rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.65rem',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(100,90,75,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 14px rgba(100, 90, 75, 0.06)';
                    e.currentTarget.style.borderColor = '#D4A017';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(100,90,75,0.02)';
                    e.currentTarget.style.borderColor = '#E8E2D8';
                  }}
                >
                  <div style={{ backgroundColor: 'rgba(212,160,23,0.08)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {act.icon}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#151515' }}>{act.title}</span>
                </div>
              ))}
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

      {activeSubTab === 'Participants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {userRole === 'Team Member' && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Register New Participant</h3>
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

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Participants Directory</h3>
          
          {programLearners.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)' }}>
              No participants enrolled in this program yet.
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
                  placeholder="Broadcast to all participants in this program..."
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
              <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: '0 0 1rem 0' }}>Enrolled Participants</h4>
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
        <div onClick={() => setShowAssignModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21, 21, 21, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 12px 30px rgba(100, 90, 75, 0.15)', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Assign Facilitator</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: '#F5F2ED', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search facilitators..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.2rem', fontSize: '0.82rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '8px', color: '#151515', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredFacilitators.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#6B7280' }}>No facilitators found.</div>
              ) : (
                filteredFacilitators.map(fac => {
                  const isChecked = selectedFacs.includes(fac.email);
                  return (
                    <div key={fac.email} onClick={() => handleToggleSelect(fac.email)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.8rem', backgroundColor: isChecked ? 'rgba(212,160,23,0.06)' : '#FFFFFF', border: '1px solid', borderColor: isChecked ? '#D4A017' : '#E8E2D8', borderRadius: '8px', cursor: 'pointer' }}>
                      <span style={{ color: '#151515', fontSize: '0.8rem', fontWeight: 600 }}>{fac.name} ({fac.email})</span>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ accentColor: '#D4A017' }} />
                    </div>
                  );
                })
              )}
            </div>


            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowAssignModal(false)} style={{ flex: 1, padding: '0.65rem', background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="button" onClick={handleSaveFacilitator} style={{ flex: 1, padding: '0.65rem', background: '#D4A017', border: 'none', color: '#151515', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateSessionModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111111', border: '1px solid #1F1F1F', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
            
            {successScreen ? (
              <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>✓ Session Scheduled Successfully</h2>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '2rem' }}>{sessionTitle} • {sessionDate} at {sessionStartTime}</p>
                
                <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94A3B8' }}>Participants:</span>
                    <span style={{ fontWeight: 600 }}>All Registered</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94A3B8' }}>Facilitator:</span>
                    <span style={{ fontWeight: 600 }}>{facilitatorName || 'Unassigned'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => { setShowCreateSessionModal(false); setSuccessScreen(false); setSessionTitle(''); setSessionDate(''); setSessionStartTime(''); setSessionEndTime(''); setFacilitatorName(''); setSessionDescription(''); }} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5C542', color: '#0A0A0A', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                  <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1A1A1A', color: '#FFF', border: '1px solid #2A2A2A', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Open Session</button>
                  <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1A1A1A', color: '#FFF', border: '1px solid #2A2A2A', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Copy Join Link</button>
                  <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1A1A1A', color: '#FFF', border: '1px solid #2A2A2A', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>View Details</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Schedule Session</h2>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Plan and configure your next training session.</p>
                  </div>
                  <button onClick={() => setShowCreateSessionModal(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                  <div style={{ flex: 2, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>1. Session Info</h3>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Title</label>
                        <input type="text" value={sessionTitle} onChange={e => setSessionTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} placeholder="Session Title" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Description</label>
                        <textarea value={sessionDescription} onChange={e => setSessionDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', minHeight: '80px' }} placeholder="What is this session about?" />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Type</label>
                          <select value={sessionType} onChange={e => setSessionType(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }}>
                            <option value="Live Training">Live Training</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Workshop">Workshop</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Programme</label>
                          <input disabled value={program?.name || 'Default'} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#6B7280', fontSize: '0.85rem', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Status</label>
                          <select style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }}>
                            <option>Draft</option>
                            <option>Published</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>2. Date & Time</h3>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Date</label>
                          <input type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Start Time</label>
                          <input type="time" value={sessionStartTime} onChange={e => setSessionStartTime(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>End Time</label>
                          <input type="time" value={sessionEndTime} onChange={e => setSessionEndTime(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Timezone: Africa/Lagos (UTC+1)</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#FFF' }}>
                          <input type="checkbox" style={{ accentColor: '#F5C542' }} /> Recurring Session
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>3. Facilitator</h3>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Name</label>
                          <input type="text" value={facilitatorName} onChange={e => setFacilitatorName(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} placeholder="Facilitator Name" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Email</label>
                          <input type="email" value={facilitatorEmail} onChange={e => setFacilitatorEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} placeholder="Email" />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>4. Participants</h3>
                      <select style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }}>
                        <option>All Enrolled Learners</option>
                        <option>Specific Cohort</option>
                        <option>Select Manually</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>5. Live Settings</h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><input type="radio" name="platform" defaultChecked style={{ accentColor: '#F5C542' }} /> OYEN Live</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><input type="radio" name="platform" style={{ accentColor: '#F5C542' }} /> Zoom</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><input type="radio" name="platform" style={{ accentColor: '#F5C542' }} /> Google Meet</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><input type="radio" name="platform" style={{ accentColor: '#F5C542' }} /> Teams</label>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: '#1A1A1A', padding: '1rem', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB' }}><input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> Enable Waiting Room</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB' }}><input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> Auto-Record Session</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB' }}><input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> Mute Participants on Entry</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB' }}><input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> Allow Chat & Reactions</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB' }}><input type="checkbox" style={{ accentColor: '#F5C542' }} /> Enable Breakout Rooms</label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>6. Attendance</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1A1A1A', padding: '1rem', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#FFF' }}>
                          <input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> Auto-capture Attendance
                        </label>
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>|</span>
                        <span style={{ fontSize: '0.8rem', color: '#D1D5DB' }}>Grace Period: <input type="number" defaultValue={5} style={{ width: '40px', background: 'transparent', border: '1px solid #374151', color: '#FFF', padding: '0.2rem', borderRadius: '4px', textAlign: 'center' }} /> mins</span>
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>|</span>
                        <span style={{ fontSize: '0.8rem', color: '#D1D5DB' }}>Rule: <input type="number" defaultValue={75} style={{ width: '45px', background: 'transparent', border: '1px solid #374151', color: '#FFF', padding: '0.2rem', borderRadius: '4px', textAlign: 'center' }} /> %</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>7. Resources</h3>
                      <div style={{ border: '1px dashed #374151', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#1A1A1A' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#94A3B8' }}>Drag & drop files or click to upload</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>PDF, slides, homework, or links</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>8. Reminders</h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['Immediate', '24 hours', '1 hour', '15 minutes'].map(t => (
                          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB', backgroundColor: '#1A1A1A', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
                            <input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> {t}
                          </label>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}><input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> Email</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}><input type="checkbox" defaultChecked style={{ accentColor: '#F5C542' }} /> In-app</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}><input type="checkbox" style={{ accentColor: '#F5C542' }} /> SMS</label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60A5FA' }}>
                        <Sparkles size={16} />
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>AI Assistant Insights</h3>
                      </div>
                      <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#D1D5DB' }}>
                        💡 Tuesday mornings have the highest attendance for this cohort. Consider adjusting the time.
                      </div>
                    </div>
                    
                  </div>

                  <div style={{ flex: 1, backgroundColor: '#0A0A0A', borderLeft: '1px solid #1F1F1F', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#FFF' }}>Summary Preview</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Programme</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{program?.name || 'Default'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Type</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{sessionType || 'Live Training'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Date & Duration</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{sessionDate || 'TBD'} • {(sessionStartTime && sessionEndTime) ? `${sessionStartTime} - ${sessionEndTime}` : '0h 0m'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Facilitator</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{facilitatorName || 'Unassigned'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Platform</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>OYEN Live</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                        <span style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>Recording Enabled</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                        <span style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>Auto-Attendance</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F5C542' }} />
                        <span style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>Notifications Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ padding: '0.75rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #2A2A2A', color: '#FFF', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
                    <button onClick={() => setShowCreateSessionModal(false)} style={{ padding: '0.75rem 1.25rem', backgroundColor: 'transparent', border: 'none', color: '#94A3B8', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ padding: '0.75rem 1.25rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', color: '#FFF', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Preview</button>
                    <button onClick={handleCreateSession} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5C542', border: 'none', color: '#0A0A0A', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Schedule Session</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* ── PARTICIPANTS GUIDE MODAL ── */}
      {showParticipantsGuide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#000000',
            border: '1px solid #1F2937',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.25rem',
            position: 'relative',
            color: '#FFFFFF',
            boxSizing: 'border-box',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            textAlign: 'left'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowParticipantsGuide(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #1F2937',
                color: '#94A3B8',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >
              <X size={16} />
            </button>

            {/* Hero */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #1F2937', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F5C542', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
                <Sparkles size={13} /> Onboarding Guide
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Learn About Participants</h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.4rem', margin: 0, lineHeight: 1.45 }}>
                Understand how participants work, how to invite them, and how to manage them throughout your program.
              </p>
            </div>

            {/* Section 1: Who are Participants? */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F5C542', textTransform: 'uppercase', margin: '0 0 0.35rem 0', letterSpacing: '0.5px' }}>1. Who are Participants?</h3>
              <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0, lineHeight: 1.45 }}>
                Participants are the people enrolled in your programs. They can attend sessions, access resources, complete assessments, receive announcements, and track their learning progress.
              </p>
            </div>

            {/* Section 2: Ways to Add Participants */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.65rem 0', letterSpacing: '0.5px' }}>2. Ways to Add Participants</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '10px', padding: '0.85rem', fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>📧 Invite by Email</div>
                  Send direct invites to individual email addresses.
                </div>
                <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '10px', padding: '0.85rem', fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>📄 Import CSV</div>
                  Bulk enroll dozens of participants at once using spreadsheets.
                </div>
                <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '10px', padding: '0.85rem', fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>🔗 Registration Link</div>
                  Share a secure invite URL for self-registration.
                </div>
              </div>
            </div>

            {/* Section 3: What Participants Can Do */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.65rem 0', letterSpacing: '0.5px' }}>3. What Participants Can Do</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                {[
                  { label: 'Join Sessions', icon: <Video size={14} color="#F5C542" /> },
                  { label: 'Access Resources', icon: <FileText size={14} color="#F5C542" /> },
                  { label: 'Take Assessments', icon: <ClipboardList size={14} color="#F5C542" /> },
                  { label: 'View Announcements', icon: <Users size={14} color="#F5C542" /> },
                  { label: 'Track Progress', icon: <CheckCircle2 size={14} color="#F5C542" /> },
                  { label: 'Download Certificates', icon: <Award size={14} color="#F5C542" /> }
                ].map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.74rem', color: '#E2E8F0' }}>
                    {act.icon}
                    <span>{act.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Participant Status */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.65rem 0', letterSpacing: '0.5px' }}>4. Participant Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Active', bg: '#065F46', color: '#34D399', dot: '🟢', desc: 'Enrolled and actively participating in the workspace.' },
                  { label: 'Invited', bg: '#78350F', color: '#FBBF24', dot: '🟡', desc: 'Invitation sent but password configuration is pending.' },
                  { label: 'Pending', bg: '#1E3A8A', color: '#60A5FA', dot: '⏳', desc: 'Awaiting administrator confirmation to finalize access.' },
                  { label: 'Inactive', bg: '#374151', color: '#9CA3AF', dot: '⚪', desc: 'Access suspended or program enrollment finished.' }
                ].map((st, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                    <span style={{ minWidth: '70px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: st.bg, color: st.color, padding: '0.15rem 0.45rem', borderRadius: '5px', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                      {st.dot} {st.label}
                    </span>
                    <span style={{ color: '#94A3B8' }}>{st.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Best Practices */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.65rem 0', letterSpacing: '0.5px' }}>5. Best Practices</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.75rem', color: '#E2E8F0' }}>
                <div>✓ Keep participant emails accurate</div>
                <div>✓ Use CSV for large imports</div>
                <div>✓ Organize learners into the correct program</div>
                <div>✓ Monitor attendance regularly</div>
              </div>
            </div>

            {/* Section 6: Quick FAQ */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #1F2937', paddingBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.65rem 0', letterSpacing: '0.5px' }}>6. Quick FAQ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { q: 'Can participants join multiple programs?', a: 'Yes. A single participant record can be assigned to multiple active programs concurrently.' },
                  { q: 'Can I remove participants later?', a: 'Yes. You can revoke access or unenroll participants from individual programs at any time.' },
                  { q: 'What happens after sending an invitation?', a: 'Participants receive an automatic email containing a link to set up their password and log in.' },
                  { q: 'Can participants edit their own profile?', a: 'Participants can edit their names and profile pictures, but not their registered emails.' }
                ].map((faq, idx) => {
                  const isOpen = faqOpen[idx];
                  const toggleFaq = (i) => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }));
                  return (
                    <div key={idx} style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '8px', overflow: 'hidden' }}>
                      <button 
                        type="button" 
                        onClick={() => toggleFaq(idx)} 
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'transparent',
                          border: 'none',
                          color: '#FFFFFF',
                          textAlign: 'left',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: '#F5C542' }} />
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 0.85rem 0.65rem', fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Callout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '12px', padding: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>Need more help?</h4>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0, lineHeight: 1.45 }}>
                  If you're just getting started, invite a few participants first. You can always import larger groups later using CSV.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowParticipantsGuide(false);
                    if (setActiveTab) {
                      if (triggerTransition) {
                        triggerTransition(() => setActiveTab('Participants'));
                      } else {
                        setActiveTab('Participants');
                      }
                    }
                  }}
                  style={{
                    backgroundColor: '#F5C542',
                    border: 'none',
                    color: '#000000',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(245,197,66,0.15)'
                  }}
                >
                  Invite Participants
                </button>
                <button
                  type="button"
                  onClick={() => alert('CSV template download initiated...')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F5C542',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  View CSV Template
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
