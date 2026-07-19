import React, { useState } from 'react';
import {
  BookOpen, Users, Calendar, Plus, X, ChevronDown, Video, FileText, CheckCircle2,
  Circle, ArrowRight, ArrowLeft, MoreHorizontal, MoreVertical, Edit, Download, Clock, Info, ExternalLink, Play, Trash2
} from 'lucide-react';

/* ── Shared styles ── */
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
  borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px',
  boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
};

export default function SessionsTab({ programs = [], setPrograms, learners = [], addNotification, onNavigateToPrograms }) {
  const [selectedProgId, setSelectedProgId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeMenuSessionId, setActiveMenuSessionId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: 'Live Training',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    enableOyenLive: false,
    externalMeetingLink: '',
    location: 'Virtual',
    trainer: 'Lead Instructor',
    facilitatorName: '',
    facilitatorEmail: ''
  });

  /* Form states */
  const [sessionForm, setSessionForm] = useState({
    title: '',
    type: 'Live Training',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    enableOyenLive: false,
    externalMeetingLink: '',
    location: 'Virtual',
    trainer: 'Lead Instructor',
    facilitatorName: '',
    facilitatorEmail: ''
  });

  /* Session detail tabs state */
  const [activeSessionTab, setActiveSessionTab] = useState('Overview'); // 'Overview' | 'Attendance' | 'Resources' | 'Notes' | 'Announcements'

  /* Temp/Local States for Session Detail actions */
  const [announcementText, setAnnouncementText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState('PDF');
  const [newResourceFile, setNewResourceFile] = useState(null);

  /* Find Selected Program and Session */
  const currentProgram = programs.find(p => p.id === selectedProgId);
  const programLearners = currentProgram ? learners.filter(l => l.program === currentProgram.name) : [];
  const currentSession = currentProgram?.sessions?.find(s => s.id === selectedSessionId);

  const getLearnerCount = (progName) => learners.filter(l => l.program === progName).length;

  /* Helper to update currently open program */
  const updateCurrentProgram = (updater) => {
    setPrograms(prev => prev.map(p => p.id === selectedProgId ? updater(p) : p));
  };

  /* Helper to append activity log */
  const logActivity = (text, p) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · ' + today;
    return {
      ...p,
      activity: [{ id: Date.now(), text, time: nowTime }, ...(p.activity || [])]
    };
  };

  /* Schedule Session Submit */
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!sessionForm.title.trim()) return;

    const newSession = {
      id: Date.now(),
      title: sessionForm.title.trim(),
      type: sessionForm.type,
      date: sessionForm.date,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      description: sessionForm.description.trim(),
      enableOyenLive: sessionForm.enableOyenLive,
      externalMeetingLink: sessionForm.externalMeetingLink.trim(),
      location: sessionForm.location,
      trainer: sessionForm.trainer,
      facilitatorName: sessionForm.facilitatorName.trim(),
      facilitatorEmail: sessionForm.facilitatorEmail.trim(),
      resources: [],
      notes: '',
      announcements: [],
      attendance: programLearners.reduce((acc, curr) => {
        acc[curr.id] = 'Present'; // default to Present
        return acc;
      }, {})
    };

    updateCurrentProgram(p => {
      const updated = {
        ...p,
        sessions: [...(p.sessions || []), newSession]
      };
      return logActivity(`Session "${newSession.title}" scheduled for ${newSession.date}`, updated);
    });
    addNotification?.(`Session "${newSession.title}" scheduled for ${newSession.date} in ${currentProgram.name}`);

    setSessionForm({
      title: '',
      type: 'Live Training',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      enableOyenLive: false,
      externalMeetingLink: '',
      location: 'Virtual',
      trainer: 'Lead Instructor',
      facilitatorName: '',
      facilitatorEmail: ''
    });
    setShowScheduleModal(false);
  };

  /* Edit Session Details Submit */
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editingSessionId) return;

    updateCurrentProgram(p => {
      const updatedSessions = (p.sessions || []).map(s => {
        if (s.id === editingSessionId) {
          return {
            ...s,
            title: editForm.title.trim(),
            type: editForm.type,
            date: editForm.date,
            startTime: editForm.startTime,
            endTime: editForm.endTime,
            description: editForm.description.trim(),
            enableOyenLive: editForm.enableOyenLive,
            externalMeetingLink: editForm.externalMeetingLink.trim(),
            location: editForm.location,
            trainer: editForm.trainer,
            facilitatorName: editForm.facilitatorName.trim(),
            facilitatorEmail: editForm.facilitatorEmail.trim()
          };
        }
        return s;
      });
      const updatedProg = { ...p, sessions: updatedSessions };
      return logActivity(`Session "${editForm.title.trim()}" details updated`, updatedProg);
    });

    addNotification?.(`Session "${editForm.title.trim()}" details updated`);
    setShowEditModal(false);
    setEditingSessionId(null);
  };

  /* Delete Session */
  const handleDeleteSession = (sessionId, sessionTitle) => {
    if (window.confirm(`Are you sure you want to permanently delete session "${sessionTitle}"?`)) {
      updateCurrentProgram(p => {
        const updatedSessions = (p.sessions || []).filter(s => s.id !== sessionId);
        const updatedProg = { ...p, sessions: updatedSessions };
        return logActivity(`Session "${sessionTitle}" deleted`, updatedProg);
      });
      addNotification?.(`Session "${sessionTitle}" deleted`);
    }
  };

  /* Toggle Attendance status */
  const toggleAttendance = (learnerId) => {
    if (!currentSession) return;
    updateCurrentProgram(p => {
      const updatedSessions = p.sessions.map(s => {
        if (s.id === selectedSessionId) {
          const currentStatus = s.attendance?.[learnerId] || 'Present';
          const nextStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
          return {
            ...s,
            attendance: {
              ...(s.attendance || {}),
              [learnerId]: nextStatus
            }
          };
        }
        return s;
      });
      return { ...p, sessions: updatedSessions };
    });
  };

  /* Add Announcement */
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim() || !currentSession) return;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · ' + today;

    updateCurrentProgram(p => {
      const updatedSessions = p.sessions.map(s => {
        if (s.id === selectedSessionId) {
          return {
            ...s,
            announcements: [
              { id: Date.now(), text: announcementText.trim(), time: nowTime },
              ...(s.announcements || [])
            ]
          };
        }
        return s;
      });
      const updatedProg = { ...p, sessions: updatedSessions };
      return logActivity(`Announcement posted in session "${currentSession.title}"`, updatedProg);
    });

    setAnnouncementText('');
  };

  /* Update Session Notes */
  const handleSaveNotes = () => {
    if (!currentSession) return;
    updateCurrentProgram(p => {
      const updatedSessions = p.sessions.map(s => {
        if (s.id === selectedSessionId) {
          return { ...s, notes: newNoteText };
        }
        return s;
      });
      return { ...p, sessions: updatedSessions };
    });
    alert('Notes saved successfully.');
  };

  /* Add Session Resource */
  const handleAddSessionResource = (e) => {
    e.preventDefault();
    if (!newResourceName.trim() || !currentSession) return;

    const resource = {
      id: Date.now(),
      name: newResourceName.trim(),
      type: newResourceType,
      fileName: newResourceFile ? newResourceFile.name : `${newResourceName.trim()}.${newResourceType.toLowerCase()}`,
      fileSize: newResourceFile ? `${Math.round(newResourceFile.size / 1024)} KB` : '120 KB',
      sizeInBytes: newResourceFile ? newResourceFile.size : 120 * 1024
    };

    updateCurrentProgram(p => {
      const updatedSessions = p.sessions.map(s => {
        if (s.id === selectedSessionId) {
          return {
            ...s,
            resources: [...(s.resources || []), resource]
          };
        }
        return s;
      });
      const updatedProg = { ...p, sessions: updatedSessions };
      return logActivity(`Resource "${resource.name}" uploaded to session "${currentSession.title}"`, updatedProg);
    });
    addNotification?.(`Resource "${resource.name}" uploaded to session "${currentSession.title}"`);

    setNewResourceName('');
    setNewResourceFile(null);
  };

  /* Delete Session Resource */
  const handleDeleteSessionResource = (resId, resName) => {
    if (window.confirm(`Are you sure you want to delete "${resName}"?`)) {
      updateCurrentProgram(p => {
        const updatedSessions = p.sessions.map(s => {
          if (s.id === selectedSessionId) {
            return {
              ...s,
              resources: (s.resources || []).filter(r => r.id !== resId)
            };
          }
          return s;
        });
        const updatedProg = { ...p, sessions: updatedSessions };
        return logActivity(`Resource "${resName}" deleted from session "${currentSession.title}"`, updatedProg);
      });
      addNotification?.(`Resource "${resName}" deleted from session "${currentSession.title}"`);
    }
  };

  /* Download Attendance report */
  const downloadAttendanceReport = () => {
    if (!currentSession) return;
    const rows = [
      ['Participant Name', 'Email Address', 'Status', 'Session Date']
    ];
    programLearners.forEach(l => {
      const status = currentSession.attendance?.[l.id] || 'Present';
      rows.push([l.name, l.email, status, currentSession.date]);
    });
    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentSession.title.replace(/\s+/g, '_')}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ────────────────────────────────────────────────────────
     VIEW 1: List all created programs
     ──────────────────────────────────────────────────────── */
  if (selectedProgId === null) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Sessions</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Manage training sessions, live meetings, and scheduled activities across your programs.
          </p>
        </div>

        {programs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {programs.map((p) => {
              const learnersCount = getLearnerCount(p.name);
              const sessionsCount = (p.sessions || []).length;
              return (
                <div key={p.id}
                  style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>{p.name}</h4>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.5rem', borderRadius: '5px', flexShrink: 0 }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: '1.45', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.desc}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                    <span>{learnersCount} Participants</span>
                    <span>·</span>
                    <span>{sessionsCount} Session{sessionsCount !== 1 ? 's' : ''}</span>
                  </div>
                  <button
                    onClick={() => setSelectedProgId(p.id)}
                    style={{
                      marginTop: '0.5rem', width: '100%', padding: '0.6rem',
                      background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)',
                      borderRadius: '6px', color: '#D4AF37', fontWeight: 600,
                      fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.05)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; }}
                  >
                    Open Program Sessions <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#0e0f14', border: '1px dotted rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
              <Calendar size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Create a training program first</h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.4rem', maxWidth: '340px', margin: '0.4rem auto 0 auto', lineHeight: 1.5 }}>
                Training sessions must be linked to a program. Create your first program to start scheduling sessions.
              </p>
            </div>
            <button
              onClick={onNavigateToPrograms}
              style={{
                background: 'linear-gradient(135deg,#D4AF37,#C49A2A)',
                border: 'none', color: '#000', fontWeight: 700,
                fontSize: '0.82rem', borderRadius: '8px',
                padding: '0.65rem 1.35rem', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                marginTop: '0.5rem'
              }}
            >
              Go to Programs Tab
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────
     VIEW 2: List sessions for a specific program
     ──────────────────────────────────────────────────────── */
  if (selectedSessionId === null) {
    const sessions = currentProgram?.sessions || [];
    const upcomingCount = sessions.filter(s => {
      if (!s.date) return true;
      return new Date(s.date) >= new Date().setHours(0,0,0,0);
    }).length;
    const completedCount = sessions.length - upcomingCount;

    return (
      <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
        
        {/* Breadcrumb & Navigation Back */}
        <button onClick={() => setSelectedProgId(null)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, width: 'fit-content' }}>
          <ArrowLeft size={15} /> Back to Programs
        </button>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{currentProgram.name}</h2>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.5rem', borderRadius: '5px' }}>
                {currentProgram.status}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.4rem', maxWidth: '600px', lineHeight: '1.5' }}>
              {currentProgram.desc || 'Manage the sessions, training activities, and meetings for this program.'}
            </p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.25)' }}
          >
            <Plus size={15} /> Schedule Session
          </button>
        </div>

        {/* Summary counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total Sessions', value: sessions.length, icon: <Calendar size={18} />, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
            { label: 'Upcoming', value: upcomingCount, icon: <Clock size={18} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
            { label: 'Completed', value: completedCount, icon: <CheckCircle2 size={18} />, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          ].map(card => (
            <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{card.label}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sessions list */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>Program Sessions</h3>
          {sessions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
              {sessions.map((s) => {
                const isUpcoming = !s.date || new Date(s.date) >= new Date().setHours(0,0,0,0);
                const dayText = s.date ? new Date(s.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date not set';
                return (
                  <div key={s.id}
                    style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>{s.title}</h4>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isUpcoming ? '#3b82f6' : '#22c55e', backgroundColor: isUpcoming ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.35rem' }}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>

                      {/* Three dot action menu */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuSessionId(activeMenuSessionId === s.id ? null : s.id);
                          }}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuSessionId === s.id && (
                          <>
                            <div
                              onClick={() => setActiveMenuSessionId(null)}
                              style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                            />
                            <div style={{
                              position: 'absolute', right: 0, marginTop: '0.35rem',
                              backgroundColor: '#161822', border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                              width: '180px', zIndex: 100, overflow: 'hidden'
                            }}>
                              <button
                                onClick={() => {
                                  setActiveMenuSessionId(null);
                                  setSelectedSessionId(s.id);
                                  setNewNoteText(s.notes || '');
                                  setActiveSessionTab('Overview');
                                }}
                                style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <Play size={13} fill="#fff" /> Open Workspace
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuSessionId(null);
                                  setEditingSessionId(s.id);
                                  setEditForm({
                                    title: s.title,
                                    type: s.type || 'Live Training',
                                    date: s.date || '',
                                    startTime: s.startTime || '',
                                    endTime: s.endTime || '',
                                    description: s.description || '',
                                    enableOyenLive: s.enableOyenLive || false,
                                    externalMeetingLink: s.externalMeetingLink || '',
                                    location: s.location || 'Virtual',
                                    trainer: s.trainer || 'Lead Instructor',
                                    facilitatorName: s.facilitatorName || '',
                                    facilitatorEmail: s.facilitatorEmail || ''
                                  });
                                  setShowEditModal(true);
                                }}
                                style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <Edit size={13} color="#D4AF37" /> Edit Details
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuSessionId(null);
                                  handleDeleteSession(s.id, s.title);
                                }}
                                style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}
                              >
                                <Trash2 size={13} color="#ef4444" /> Delete Session
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Type</span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{s.type}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Schedule</span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{dayText}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Time</span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{s.startTime || '—'} {s.endTime ? ` - ${s.endTime}` : ''}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSessionId(s.id);
                        setNewNoteText(s.notes || '');
                        setActiveSessionTab('Overview');
                      }}
                      style={{
                        marginTop: '0.5rem', width: '100%', padding: '0.55rem',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px', color: '#D4AF37', fontWeight: 600,
                        fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      Open Session Workspace <ArrowRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#0e0f14', border: '1px dotted rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '3.5rem 2rem', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
                <Calendar size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>No sessions scheduled yet</h4>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem', maxWidth: '340px', margin: '0.3rem auto 0 auto', lineHeight: 1.5 }}>
                  Schedule a live training session, meeting, or activity for your learners.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                style={{
                  background: 'linear-gradient(135deg,#D4AF37,#C49A2A)',
                  border: 'none', color: '#000', fontWeight: 700,
                  fontSize: '0.8rem', borderRadius: '8px',
                  padding: '0.55rem 1.25rem', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                  marginTop: '0.25rem'
                }}
              >
                + Schedule Session
              </button>
            </div>
          )}
        </div>

        {/* Schedule Session Modal */}
        {showScheduleModal && (
          <div style={modalOverlay} onClick={() => setShowScheduleModal(false)}>
            <div style={modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Schedule Session</h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>Configure session properties for {currentProgram.name}</p>
                </div>
                <button onClick={() => setShowScheduleModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                <div>
                  <label style={labelStyle}>Session Title</label>
                  <input required autoFocus type="text" placeholder="e.g. Orientation & Onboarding" value={sessionForm.title}
                    onChange={e => setSessionForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Session Type</label>
                    <div style={{ position: 'relative' }}>
                      <select value={sessionForm.type} onChange={e => setSessionForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                        {['Live Training', 'Workshop', 'Webinar', 'Mentoring', 'Other'].map(t => <option key={t} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Trainer Name</label>
                    <input type="text" value={sessionForm.trainer} onChange={e => setSessionForm(p => ({ ...p, trainer: e.target.value }))} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Facilitator Name</label>
                    <input type="text" placeholder="e.g. Dr. Jane" value={sessionForm.facilitatorName} onChange={e => setSessionForm(p => ({ ...p, facilitatorName: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Facilitator Email</label>
                    <input type="email" placeholder="jane@domain.com" value={sessionForm.facilitatorEmail} onChange={e => setSessionForm(p => ({ ...p, facilitatorEmail: e.target.value }))} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input required type="date" value={sessionForm.date} onChange={e => setSessionForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Start</label>
                    <input required type="time" value={sessionForm.startTime} onChange={e => setSessionForm(p => ({ ...p, startTime: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>End</label>
                    <input required type="time" value={sessionForm.endTime} onChange={e => setSessionForm(p => ({ ...p, endTime: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Meeting Platform</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.2rem 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#fff', cursor: 'pointer' }}>
                      <input type="checkbox" checked={sessionForm.enableOyenLive} onChange={e => setSessionForm(p => ({ ...p, enableOyenLive: e.target.checked }))} style={{ accentColor: '#D4AF37' }} />
                      Enable OYEN Live
                    </label>
                  </div>
                  {!sessionForm.enableOyenLive && (
                    <input type="text" placeholder="e.g. https://zoom.us/j/123456" value={sessionForm.externalMeetingLink} onChange={e => setSessionForm(p => ({ ...p, externalMeetingLink: e.target.value }))} style={{ ...inputStyle, marginTop: '0.35rem' }} />
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Description <span style={{ textTransform: 'none', opacity: 0.6 }}>(optional)</span></label>
                  <textarea rows={2} placeholder="Brief summary of discussion topic..." value={sessionForm.description}
                    onChange={e => setSessionForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowScheduleModal(false)} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '0.7rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>Schedule Session</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Session Modal */}
        {showEditModal && (
          <div style={modalOverlay} onClick={() => { setShowEditModal(false); setEditingSessionId(null); }}>
            <div style={modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Edit Session Details</h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>Modify properties for this training meeting</p>
                </div>
                <button onClick={() => { setShowEditModal(false); setEditingSessionId(null); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                <div>
                  <label style={labelStyle}>Session Title</label>
                  <input required autoFocus type="text" placeholder="e.g. Orientation & Onboarding" value={editForm.title}
                    onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Session Type</label>
                    <div style={{ position: 'relative' }}>
                      <select value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                        {['Live Training', 'Workshop', 'Webinar', 'Mentoring', 'Other'].map(t => <option key={t} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Trainer Name</label>
                    <input type="text" value={editForm.trainer} onChange={e => setEditForm(p => ({ ...p, trainer: e.target.value }))} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Facilitator Name</label>
                    <input type="text" placeholder="e.g. Dr. Jane" value={editForm.facilitatorName} onChange={e => setEditForm(p => ({ ...p, facilitatorName: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Facilitator Email</label>
                    <input type="email" placeholder="jane@domain.com" value={editForm.facilitatorEmail} onChange={e => setEditForm(p => ({ ...p, facilitatorEmail: e.target.value }))} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input required type="date" value={editForm.date} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, padding: '0.65rem 0.5rem' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Starts</label>
                    <input required type="time" value={editForm.startTime} onChange={e => setEditForm(p => ({ ...p, startTime: e.target.value }))} style={{ ...inputStyle, padding: '0.65rem 0.5rem' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ends</label>
                    <input required type="time" value={editForm.endTime} onChange={e => setEditForm(p => ({ ...p, endTime: e.target.value }))} style={{ ...inputStyle, padding: '0.65rem 0.5rem' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Location Method</label>
                    <div style={{ position: 'relative' }}>
                      <select value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                        {['Virtual', 'On-site', 'Hybrid'].map(l => <option key={l} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{l}</option>)}
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Meeting Link / Room</label>
                    <input type="text" placeholder="e.g. Room 4B or Zoom link" value={editForm.externalMeetingLink}
                      onChange={e => setEditForm(p => ({ ...p, externalMeetingLink: e.target.value }))} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editForm.enableOyenLive} onChange={e => setEditForm(p => ({ ...p, enableOyenLive: e.target.checked }))} style={{ cursor: 'pointer' }} />
                    Enable OYEN LIVE digital session workspace
                  </label>
                </div>

                <div>
                  <label style={labelStyle}>Short Description</label>
                  <textarea placeholder="Topics, pre-reads, instructions..." value={editForm.description}
                    onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                    style={{ ...inputStyle, height: '70px', resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingSessionId(null); }} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────
     VIEW 3: Individual Session Operational Workspace
     ──────────────────────────────────────────────────────── */
  const sessionResources = currentSession.resources || [];
  const announcements    = currentSession.announcements || [];
  const attendeesCount   = programLearners.length;
  const presentCount     = Object.values(currentSession.attendance || {}).filter(v => v === 'Present').length;
  const absentCount      = attendeesCount - presentCount;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      {/* Navigation breadcrumb back */}
      <button onClick={() => setSelectedSessionId(null)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, width: 'fit-content' }}>
        <ArrowLeft size={15} /> Back to Sessions
      </button>

      {/* Header Info */}
      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem 2rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.3rem' }}>
              {currentProgram.name} / Session Workspace
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{currentSession.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.4rem', lineHeight: '1.5' }}>
              {currentSession.description || 'Dedicated workspace to manage live training, files, notes, and attendance for this class.'}
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem 0.85rem', flexShrink: 0 }}>
            <div style={{ fontWeight: 600, color: '#fff' }}>Trainer: {currentSession.trainer || 'Lead Instructor'}</div>
            <div style={{ marginTop: '0.15rem' }}>{currentSession.date} · {currentSession.startTime}</div>
          </div>
        </div>
      </div>

      {/* Session Workspace Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '1.5rem' }}>
        {['Overview', 'Attendance', 'Resources', 'Notes', 'Announcements'].map(tab => {
          const isActive = activeSessionTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSessionTab(tab)}
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

      {/* Tab Panel Contents */}
      <div>
        
        {/* ── TAB: Overview ── */}
        {activeSessionTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Live Meeting Panel */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Live Meeting Integration</h3>
              </div>

              {currentSession.enableOyenLive ? (
                <div style={{ backgroundColor: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '10px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>OYEN Live Enabled</span>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginTop: '0.45rem', lineHeight: '1.4' }}>
                      Secure high-performance video training portal is provisioned automatically for this meeting.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Launching OYEN Live session interface...')}
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '6px', padding: '0.55rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    Start OYEN Live Meeting <ExternalLink size={12} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                    <div>Meeting Link:</div>
                    <a href={currentSession.externalMeetingLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', wordBreak: 'break-all', textDecoration: 'underline', marginTop: '0.2rem', display: 'block' }}>
                      {currentSession.externalMeetingLink || 'No meeting link configured.'}
                    </a>
                  </div>
                  {currentSession.externalMeetingLink && (
                    <a
                      href={currentSession.externalMeetingLink} target="_blank" rel="noopener noreferrer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600, fontSize: '0.78rem', borderRadius: '6px', padding: '0.55rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textDecoration: 'none' }}
                    >
                      Join Meeting Room <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Summary / Pre-session materials */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Attendance Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Present</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e', marginTop: '0.15rem' }}>{presentCount}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Absent</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', marginTop: '0.15rem' }}>{absentCount}</div>
                </div>
              </div>
              <button onClick={() => setActiveSessionTab('Attendance')} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                Manage full attendance roll →
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: Attendance ── */}
        {activeSessionTab === 'Attendance' && (
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Attendance Roll</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.15rem' }}>{presentCount} Present · {absentCount} Absent</p>
              </div>
              <button
                onClick={downloadAttendanceReport}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#D4AF37', fontWeight: 600, fontSize: '0.75rem', borderRadius: '6px', padding: '0.45rem 0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={13} /> Download Report
              </button>
            </div>

            {programLearners.length > 0 ? (
              <div style={{ border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
                {programLearners.map(l => {
                  const isPresent = (currentSession.attendance?.[l.id] || 'Present') === 'Present';
                  return (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem' }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{l.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: '0.05rem' }}>{l.email}</div>
                      </div>
                      <button
                        onClick={() => toggleAttendance(l.id)}
                        style={{
                          border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem',
                          padding: '0.35rem 0.75rem', cursor: 'pointer',
                          backgroundColor: isPresent ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: isPresent ? '#22c55e' : '#f87171',
                          width: '80px', textAlign: 'center'
                        }}
                      >
                        {isPresent ? 'Present' : 'Absent'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                No participants enrolled in this program yet. Participants added to this program will appear here.
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Resources ── */}
        {activeSessionTab === 'Resources' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Resources list */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Session Materials</h3>
              {sessionResources.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {sessionResources.map((res) => (
                    <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <FileText size={16} color="#D4AF37" />
                        <div>
                          <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{res.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{res.fileName} · {res.fileSize}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff', backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          {res.type}
                        </span>
                        <button
                          onClick={() => handleDeleteSessionResource(res.id, res.name)}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', padding: '0.2rem', transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                  No materials uploaded for this session yet.
                </div>
              )}
            </div>

            {/* Upload form */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem' }}>Upload Material</h3>
              <form onSubmit={handleAddSessionResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Material Name</label>
                  <input required type="text" placeholder="e.g. Safety Policy Slides" value={newResourceName}
                    onChange={e => setNewResourceName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Material Type</label>
                  <div style={{ position: 'relative' }}>
                    <select value={newResourceType} onChange={e => setNewResourceType(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      {['PDF', 'Document', 'Presentation', 'Spreadsheet', 'Video', 'ZIP', 'Other'].map(t => <option key={t} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Select File</label>
                  <div
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.onchange = (e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewResourceFile(e.target.files[0]);
                          if (!newResourceName) {
                            setNewResourceName(e.target.files[0].name.split('.').slice(0, -1).join('.'));
                          }
                        }
                      };
                      input.click();
                    }}
                    style={{ border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.01)', fontSize: '0.78rem', color: '#D4AF37' }}
                  >
                    {newResourceFile ? `File selected: ${newResourceFile.name}` : 'Browse Files'}
                  </div>
                </div>
                <button type="submit" style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.55rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                  Upload Material
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB: Notes ── */}
        {activeSessionTab === 'Notes' && (
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Trainer Notes</h3>
              <button
                onClick={handleSaveNotes}
                style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.78rem', borderRadius: '6px', padding: '0.45rem 1rem', cursor: 'pointer' }}
              >
                Save Notes
              </button>
            </div>
            <textarea
              rows={12}
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              placeholder="Record attendance observations, key points discussed, homework assignments, or feedback..."
              style={{ ...inputStyle, resize: 'none', height: '300px', lineHeight: '1.5' }}
            />
          </div>
        )}

        {/* ── TAB: Announcements ── */}
        {activeSessionTab === 'Announcements' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Announcements log */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Session Announcements</h3>
              {announcements.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {announcements.map((ann) => (
                    <div key={ann.id} style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.82rem', color: '#fff', margin: 0, lineHeight: 1.45 }}>{ann.text}</p>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.4rem' }}>{ann.time}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                  No announcements posted yet.
                </div>
              )}
            </div>

            {/* Post new announcement */}
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem' }}>Post Announcement</h3>
              <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  required rows={4}
                  placeholder="e.g. Today's session starts in 10 minutes. Bring your training manuals..."
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  style={{ ...inputStyle, resize: 'none' }}
                />
                <button type="submit" style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.55rem', cursor: 'pointer' }}>
                  Post Announcement
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
