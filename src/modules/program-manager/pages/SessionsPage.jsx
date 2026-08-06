import React, { useState, useMemo } from 'react';
import { 
  Plus, Calendar, Play, CheckCircle2, AlertCircle, Clock, 
  ArrowRight, User, FileText, Check, X, ChevronDown,
  Sparkles, Trash, Eye, MessageSquare, BarChart3, ShieldCheck
} from 'lucide-react';

export default function SessionsPage({ wsPrograms = [], setWsPrograms }) {
  // Navigation inside the module: 'list' | 'detail'
  const [viewMode, setViewMode] = useState('list');
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedFacilitator, setSelectedFacilitator] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [sortKey, setSortKey] = useState('Newest');

  // Session tab state
  const [activeTab, setActiveTab] = useState('All');

  // Modals / AI recommendation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Form states for creating a session
  const [createForm, setCreateForm] = useState({
    title: '',
    programId: '',
    date: '',
    startTime: '',
    endTime: '',
    facilitatorName: '',
    facilitatorEmail: '',
    attendanceRequired: true,
    recordingEnabled: true,
    discussionEnabled: true
  });

  // Pull all sessions directly from the wsPrograms database
  const allSessions = useMemo(() => {
    const list = [];
    wsPrograms.forEach(p => {
      const sess = p.sessions || [];
      sess.forEach(s => {
        list.push({
          ...s,
          programId: p.id,
          programName: p.name || p.title,
          participants: p.participants || p.learners || p.enrolledLearners || []
        });
      });
    });
    return list;
  }, [wsPrograms]);

  // List of all facilitators for the filter dropdown
  const facilitatorsList = useMemo(() => {
    const set = new Set();
    allSessions.forEach(s => {
      if (s.facilitatorName) set.add(s.facilitatorName);
    });
    return Array.from(set);
  }, [allSessions]);

  // Handle clicking a session to view its details
  const handleViewSessionDetails = (id) => {
    setActiveSessionId(id);
    setViewMode('detail');
  };

  // Create Session action
  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.programId) return;

    const newSession = {
      id: 'session_' + Date.now(),
      title: createForm.title,
      date: createForm.date || new Date().toISOString().split('T')[0],
      startTime: createForm.startTime || '10:00',
      endTime: createForm.endTime || '11:30',
      facilitatorName: createForm.facilitatorName || '',
      facilitatorEmail: createForm.facilitatorEmail || '',
      status: 'Draft', // Default to Draft
      resources: [],
      attendance: {},
      attendanceRequired: createForm.attendanceRequired,
      recordingEnabled: createForm.recordingEnabled,
      discussionEnabled: createForm.discussionEnabled,
      discussionMessages: [],
      recordingStatus: 'Not Started'
    };

    // Update parent state
    setWsPrograms(prevPrograms => {
      const next = prevPrograms.map(p => {
        if (p.id.toString() === createForm.programId.toString()) {
          return {
            ...p,
            sessions: [...(p.sessions || []), newSession]
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setShowCreateModal(false);
    setSuccessToast('Session scheduled successfully.');
    setTimeout(() => setSuccessToast(null), 3000);

    // Trigger reactive OYEN AI recommendation
    setTimeout(() => {
      setAiRecommendation({
        id: 'assign_facilitator',
        sessionId: newSession.id,
        programId: createForm.programId,
        title: 'Session created successfully.',
        message: 'Recommended next step: Assign a facilitator to confirm delivery.',
        actionLabel: 'Assign Facilitator',
        action: () => triggerAssignFacilitatorFlow(newSession.id, createForm.programId)
      });
    }, 1500);

    // Reset Form
    setCreateForm({
      title: '',
      programId: '',
      date: '',
      startTime: '',
      endTime: '',
      facilitatorName: '',
      facilitatorEmail: '',
      attendanceRequired: true,
      recordingEnabled: true,
      discussionEnabled: true
    });
  };

  // Helper flows for reactive OYEN AI recommendations
  const triggerAssignFacilitatorFlow = (sessionId, programId) => {
    // Automatically assign a facilitator to show state progression
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id.toString() === programId.toString()) {
          return {
            ...p,
            sessions: (p.sessions || []).map(s => {
              if (s.id === sessionId) {
                return {
                  ...s,
                  facilitatorName: 'John David',
                  facilitatorEmail: 'john@oyengrid.com',
                  status: 'Scheduled'
                };
              }
              return s;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast('Facilitator assigned.');
    setTimeout(() => setSuccessToast(null), 2500);

    // Next AI Recommendation
    setAiRecommendation({
      id: 'upload_resources',
      sessionId,
      programId,
      title: 'Facilitator assigned.',
      message: 'Next recommendation: Upload learning resources for participants.',
      actionLabel: 'Upload Resources',
      action: () => triggerUploadResourcesFlow(sessionId, programId)
    });
  };

  const triggerUploadResourcesFlow = (sessionId, programId) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id.toString() === programId.toString()) {
          return {
            ...p,
            sessions: (p.sessions || []).map(s => {
              if (s.id === sessionId) {
                return {
                  ...s,
                  resources: [
                    ...(s.resources || []),
                    { name: 'Slides.pdf', size: '2.4 MB' },
                    { name: 'Week 4 Guide.docx', size: '1.1 MB' }
                  ]
                };
              }
              return s;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast('Resources uploaded.');
    setTimeout(() => setSuccessToast(null), 2500);

    // Next AI Recommendation
    setAiRecommendation({
      id: 'notify_participants',
      sessionId,
      programId,
      title: 'Resources uploaded.',
      message: 'Notify enrolled participants about the scheduled session?',
      actionLabel: 'Notify Participants',
      action: () => {
        setSuccessToast('Participants notified via email.');
        setTimeout(() => setSuccessToast(null), 2500);
        setAiRecommendation(null); // Finish flow
      }
    });
  };

  // Filtered and Sorted Sessions
  const filteredSessions = useMemo(() => {
    let list = [...allSessions];

    // Status Tab filtering
    if (activeTab !== 'All') {
      if (activeTab === 'Today') {
        const todayStr = new Date().toISOString().split('T')[0];
        list = list.filter(s => s.date === todayStr);
      } else {
        list = list.filter(s => s.status.toLowerCase() === activeTab.toLowerCase());
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        (s.title || '').toLowerCase().includes(q) ||
        (s.programName || '').toLowerCase().includes(q) ||
        (s.facilitatorName || '').toLowerCase().includes(q)
      );
    }

    // Dropdown filters
    if (selectedProgram !== 'All') {
      list = list.filter(s => s.programId.toString() === selectedProgram.toString());
    }
    if (selectedFacilitator !== 'All') {
      list = list.filter(s => s.facilitatorName === selectedFacilitator);
    }
    if (selectedStatus !== 'All') {
      list = list.filter(s => s.status === selectedStatus);
    }
    if (selectedDate !== 'All') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (selectedDate === 'Today') {
        list = list.filter(s => s.date === todayStr);
      } else if (selectedDate === 'Tomorrow') {
        const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        list = list.filter(s => s.date === tomorrowStr);
      }
    }

    // Sort
    if (sortKey === 'Newest') {
      list.sort((a, b) => new Date(b.date + 'T' + (b.startTime || '00:00')) - new Date(a.date + 'T' + (a.startTime || '00:00')));
    } else if (sortKey === 'Oldest') {
      list.sort((a, b) => new Date(a.date + 'T' + (a.startTime || '00:00')) - new Date(b.date + 'T' + (b.startTime || '00:00')));
    } else if (sortKey === 'Alphabetical') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }, [allSessions, activeTab, searchQuery, selectedProgram, selectedFacilitator, selectedStatus, selectedDate, sortKey]);

  // Selected session for detail page view
  const currentSessionDetail = useMemo(() => {
    return allSessions.find(s => s.id === activeSessionId) || null;
  }, [allSessions, activeSessionId]);

  return (
    <div style={{ padding: '2.5rem 3rem', fontFamily: "'Inter', sans-serif", minHeight: '100%', position: 'relative' }}>
      
      {/* Toast popup */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideInRight 0.2s ease'
        }}>
          <CheckCircle2 size={16} color="#10B981" />
          {successToast}
        </div>
      )}

      {/* Floating Global OYEN AI Assist Notification */}
      {aiRecommendation && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '340px',
          backgroundColor: '#090a0f',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          padding: '1.25rem',
          color: '#ffffff',
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          backdropFilter: 'blur(16px)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Sparkles size={12} /> OYEN AI Recommendation
            </span>
            <button 
              onClick={() => setAiRecommendation(null)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.88rem', fontWeight: 700 }}>{aiRecommendation.title}</h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{aiRecommendation.message}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
            <button 
              onClick={() => {
                aiRecommendation.action();
              }}
              style={{ padding: '0.45rem 0.85rem', backgroundColor: '#D4AF37', border: 'none', borderRadius: '6px', color: '#000000', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {aiRecommendation.actionLabel}
            </button>
            <button 
              onClick={() => setAiRecommendation(null)}
              style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: LISTING VIEW */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.5px' }}>Sessions</h1>
              <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.95rem' }}>
                Manage scheduled, live and completed learning sessions across your assigned programmes.
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '0.7rem 1.25rem',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
            >
              + Schedule Session
            </button>
          </div>

          {/* Search + Filter Strip */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '1rem',
            backgroundColor: '#ffffff',
            border: '1px solid #EBE5D9',
            borderRadius: '12px'
          }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  border: '1px solid #EBE5D9',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Program Dropdown Filter */}
            <select
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">All Programmes</option>
              {wsPrograms.map(p => (
                <option key={p.id} value={p.id}>{p.name || p.title}</option>
              ))}
            </select>

            {/* Facilitator Dropdown Filter */}
            <select
              value={selectedFacilitator}
              onChange={e => setSelectedFacilitator(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">All Facilitators</option>
              {facilitatorsList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Status Dropdown Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Date Dropdown Filter */}
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">Any Date</option>
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
            </select>

            {/* Sort Dropdown Filter */}
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Alphabetical">Alphabetical</option>
            </select>
          </div>

          {/* Session Tab strip */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EBE5D9', paddingBottom: '0.2rem' }}>
            {['All', 'Upcoming', 'Today', 'Live', 'Completed', 'Draft', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? '#111111' : '#6B7280',
                  borderBottom: activeTab === tab ? '2px solid #F4C542' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sessions List Rendering logic */}
          {filteredSessions.length > 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #EBE5D9',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EBE5D9', backgroundColor: '#FAFAF8' }}>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Session Name</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Programme</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Time</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Facilitator</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Participants</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map(session => (
                    <tr 
                      key={session.id}
                      onClick={() => handleViewSessionDetails(session.id)}
                      style={{ borderBottom: '1px solid #EBE5D9', cursor: 'pointer', transition: 'background-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, color: '#111111' }}>{session.title}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.programName}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.date}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.startTime} – {session.endTime}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.facilitatorName || <span style={{ color: '#B8891A', fontStyle: 'italic' }}>Unassigned</span>}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{session.participants.length} Participants</td>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          backgroundColor: 
                            session.status === 'Live' ? 'rgba(16,185,129,0.1)' : 
                            session.status === 'Completed' ? 'rgba(59,130,246,0.1)' : 
                            session.status === 'Draft' ? '#FAFAF8' :
                            session.status === 'Cancelled' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.1)',
                          color: 
                            session.status === 'Live' ? '#10B981' : 
                            session.status === 'Completed' ? '#3B82F6' : 
                            session.status === 'Draft' ? '#6B7280' :
                            session.status === 'Cancelled' ? '#EF4444' : '#F59E0B'
                        }}>
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: 
                              session.status === 'Live' ? '#10B981' : 
                              session.status === 'Completed' ? '#3B82F6' : 
                              session.status === 'Draft' ? '#6B7280' :
                              session.status === 'Cancelled' ? '#EF4444' : '#F59E0B'
                          }} />
                          {session.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSessionDetails(session.id);
                          }}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: session.status === 'Live' ? '#10B981' : '#F5F2ED',
                            color: session.status === 'Live' ? '#ffffff' : '#111111',
                            border: session.status === 'Live' ? 'none' : '1px solid #EBE5D9',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {session.status === 'Draft' ? 'Continue Setup' : 
                           session.status === 'Scheduled' ? 'Manage' :
                           session.status === 'Live' ? 'Open Session' :
                           session.status === 'Completed' ? 'View Report' :
                           session.status === 'Cancelled' ? 'View Details' : 'Open'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* EMPTY STATE */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 2rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #EBE5D9',
              borderRadius: '16px',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2.5rem' }}>📅</span>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>No sessions have been scheduled yet.</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '0.88rem', maxWidth: '380px', lineHeight: 1.5 }}>
                  Create your first learning session to begin organizing your programme.
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#F4C542',
                  color: '#111111',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Schedule Session
              </button>

              <div style={{
                textAlign: 'left',
                borderTop: '1px solid #EBE5D9',
                paddingTop: '1.25rem',
                width: '100%',
                maxWidth: '420px',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>After creating a session you'll be able to</span>
                {[
                  'Assign facilitators',
                  'Enroll participants',
                  'Upload resources',
                  'Track attendance',
                  'View engagement analytics'
                ].map(bullet => (
                  <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#2D2D2D' }}>
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW MODE 2: SESSION DETAILS PAGE VIEW */}
      {viewMode === 'detail' && currentSessionDetail && (
        <SessionDetailView 
          session={currentSessionDetail}
          onBack={() => setViewMode('list')}
          setWsPrograms={setWsPrograms}
          setSuccessToast={setSuccessToast}
          setAiRecommendation={setAiRecommendation}
        />
      )}

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <>
          <div 
            onClick={() => setShowCreateModal(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)', zIndex: 3000 }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            zIndex: 3001,
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Schedule Session</h2>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Configure a new programme learning session.</span>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Session Title *</label>
                <input 
                  type="text" 
                  value={createForm.title} 
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })} 
                  placeholder="e.g. Battery Chemistry deep-dive" 
                  required 
                  style={{ width: '100%', padding: '0.7rem 0.95rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Assigned Programme *</label>
                <select 
                  value={createForm.programId} 
                  onChange={e => setCreateForm({ ...createForm, programId: e.target.value })} 
                  required
                  style={{ width: '100%', padding: '0.7rem 0.95rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="">Select Programme...</option>
                  {wsPrograms.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Date</label>
                  <input 
                    type="date" 
                    value={createForm.date} 
                    onChange={e => setCreateForm({ ...createForm, date: e.target.value })} 
                    style={{ width: '100%', padding: '0.7rem 0.95rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Start</label>
                    <input 
                      type="time" 
                      value={createForm.startTime} 
                      onChange={e => setCreateForm({ ...createForm, startTime: e.target.value })} 
                      style={{ width: '100%', padding: '0.7rem 0.5rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>End</label>
                    <input 
                      type="time" 
                      value={createForm.endTime} 
                      onChange={e => setCreateForm({ ...createForm, endTime: e.target.value })} 
                      style={{ width: '100%', padding: '0.7rem 0.5rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Conditional configurations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #EBE5D9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operations Settings</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="chk_attendance" 
                    checked={createForm.attendanceRequired} 
                    onChange={e => setCreateForm({ ...createForm, attendanceRequired: e.target.checked })} 
                  />
                  <label htmlFor="chk_attendance" style={{ fontSize: '0.82rem', color: '#2D2D2D' }}>Require Attendance Tracking</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="chk_recording" 
                    checked={createForm.recordingEnabled} 
                    onChange={e => setCreateForm({ ...createForm, recordingEnabled: e.target.checked })} 
                  />
                  <label htmlFor="chk_recording" style={{ fontSize: '0.82rem', color: '#2D2D2D' }}>Enable Cloud Video Recording</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="chk_discussion" 
                    checked={createForm.discussionEnabled} 
                    onChange={e => setCreateForm({ ...createForm, discussionEnabled: e.target.checked })} 
                  />
                  <label htmlFor="chk_discussion" style={{ fontSize: '0.82rem', color: '#2D2D2D' }}>Enable Session Discussion Board</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  style={{ padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '0.65rem 1.5rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '8px', color: '#111111', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create & Continue
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

// ────────────────────────────────────────────────────────
// SUBCOMPONENT: SESSION OPERATIONS DETAIL VIEW
// ────────────────────────────────────────────────────────
function SessionDetailView({ 
  session, 
  onBack, 
  setWsPrograms, 
  setSuccessToast, 
  setAiRecommendation 
}) {
  const [detailTab, setDetailTab] = useState('Overview');

  // Input states inside Detail view
  const [resourceFile, setResourceFile] = useState('');
  const [discussionInput, setDiscussionInput] = useState('');

  // Attendance update handler
  const handleMarkAttendance = (participantEmail, status) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === session.programId) {
          return {
            ...p,
            sessions: (p.sessions || []).map(s => {
              if (s.id === session.id) {
                return {
                  ...s,
                  attendance: {
                    ...(s.attendance || {}),
                    [participantEmail]: status
                  }
                };
              }
              return s;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast(`Attendance status updated for ${participantEmail}`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Add learning Resource handler
  const handleUploadResource = (e) => {
    e.preventDefault();
    if (!resourceFile.trim()) return;

    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === session.programId) {
          return {
            ...p,
            sessions: (p.sessions || []).map(s => {
              if (s.id === session.id) {
                return {
                  ...s,
                  resources: [
                    ...(s.resources || []),
                    { name: resourceFile.trim(), size: '1.8 MB' }
                  ]
                };
              }
              return s;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast(`Resource "${resourceFile}" uploaded successfully.`);
    setTimeout(() => setSuccessToast(null), 2500);
    setResourceFile('');
  };

  // Status transition handlers
  const updateSessionStatusState = (newStatus) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === session.programId) {
          return {
            ...p,
            sessions: (p.sessions || []).map(s => {
              if (s.id === session.id) {
                const updates = { status: newStatus };
                if (newStatus === 'Live') {
                  updates.recordingStatus = 'Available';
                }
                return { ...s, ...updates };
              }
              return s;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast(`Session status updated to ${newStatus}`);
    setTimeout(() => setSuccessToast(null), 2500);

    // Contextual AI recommendations based on status transitions
    if (newStatus === 'Live') {
      setTimeout(() => {
        setAiRecommendation({
          id: 'prepare_attendance',
          sessionId: session.id,
          programId: session.programId,
          title: 'Session is currently Live.',
          message: 'Ensure facilitator is confirmed and prepare attendance sheet tracking.',
          actionLabel: 'Prepare Attendance',
          action: () => {
            setDetailTab('Participants');
            setAiRecommendation(null);
          }
        });
      }, 1500);
    } else if (newStatus === 'Completed') {
      setTimeout(() => {
        setAiRecommendation({
          id: 'completed_session_next',
          sessionId: session.id,
          programId: session.programId,
          title: 'Session completed successfully.',
          message: 'Review session, publish cloud recording, and mark attendance.',
          actionLabel: 'Mark Attendance Now',
          action: () => {
            setDetailTab('Participants');
            setAiRecommendation(null);
          }
        });
      }, 1500);
    }
  };

  // Add comment message to discussion thread
  const handlePostDiscussionMessage = (e) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'Program Manager',
      text: discussionInput.trim(),
      time: 'Just now'
    };

    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === session.programId) {
          return {
            ...p,
            sessions: (p.sessions || []).map(s => {
              if (s.id === session.id) {
                return {
                  ...s,
                  discussionMessages: [...(s.discussionMessages || []), newMsg]
                };
              }
              return s;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setDiscussionInput('');
  };

  // Readiness Setup completeness metrics
  const readiness = useMemo(() => {
    let score = 100;
    const checks = [
      { label: 'Facilitator assigned', status: !!session.facilitatorName },
      { label: 'Resources uploaded', status: (session.resources || []).length > 0 },
      { label: 'Attendance requirements ready', status: !session.attendanceRequired || Object.keys(session.attendance || {}).length > 0 }
    ];
    
    const passed = checks.filter(c => c.status).length;
    score = Math.round((passed / checks.length) * 100);

    return { score, checks };
  }, [session]);

  // Dynamic status-colored indicator
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Live':
        return { color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
      case 'Completed':
        return { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' };
      case 'Draft':
        return { color: '#6B7280', bg: '#FAFAF8' };
      case 'Cancelled':
        return { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' };
      default:
        return { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
    }
  };

  const statusStyles = getStatusBadgeStyles(session.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Detail view header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EBE5D9', paddingBottom: '1.5rem' }}>
        <div>
          <button 
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7280',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: 0,
              marginBottom: '0.75rem'
            }}
          >
            ← Back to Sessions
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#111111' }}>{session.title}</h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              backgroundColor: statusStyles.bg,
              color: statusStyles.color
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyles.color }} />
              {session.status}
            </span>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>
            Programme: <span style={{ fontWeight: 600, color: '#111111' }}>{session.programName}</span>
          </p>
        </div>

        {/* Dynamic status transitioning operations */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {session.status === 'Draft' && (
            <button 
              onClick={() => updateSessionStatusState('Scheduled')}
              style={{ padding: '0.55rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Confirm & Schedule
            </button>
          )}
          {session.status === 'Scheduled' && (
            <button 
              onClick={() => updateSessionStatusState('Live')}
              style={{ padding: '0.55rem 1rem', backgroundColor: '#10B981', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Open & Start Session
            </button>
          )}
          {session.status === 'Live' && (
            <button 
              onClick={() => updateSessionStatusState('Completed')}
              style={{ padding: '0.55rem 1rem', backgroundColor: '#3B82F6', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              End Session
            </button>
          )}
          {session.status !== 'Cancelled' && session.status !== 'Completed' && (
            <button 
              onClick={() => updateSessionStatusState('Cancelled')}
              style={{ padding: '0.55rem 1rem', backgroundColor: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Cancel Session
            </button>
          )}
        </div>
      </div>

      {/* Internal Tabs for Session Details page */}
      <div style={{ display: 'flex', borderBottom: '1px solid #EBE5D9', paddingBottom: '0.2rem' }}>
        {[
          { key: 'Overview', label: 'Overview', enabled: true },
          { key: 'Participants', label: 'Participants & Attendance', enabled: true },
          { key: 'Resources', label: 'Resources', enabled: true },
          { key: 'Recording', label: 'Recording', enabled: session.recordingEnabled },
          { key: 'Discussion', label: 'Discussion', enabled: session.discussionEnabled },
          { key: 'Analytics', label: 'Analytics', enabled: session.status === 'Completed' }
        ].filter(t => t.enabled).map(tab => (
          <button
            key={tab.key}
            onClick={() => setDetailTab(tab.key)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: detailTab === tab.key ? 700 : 500,
              color: detailTab === tab.key ? '#111111' : '#6B7280',
              borderBottom: detailTab === tab.key ? '2px solid #F4C542' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DETAILED CONTENT CONTAINER */}
      <div style={{ minHeight: '300px' }}>

        {/* TAB 1: OVERVIEW */}
        {detailTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
            
            {/* Overview Left Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>{session.date}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scheduled Duration</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>{session.startTime} – {session.endTime}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facilitator</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>
                    {session.facilitatorName || <span style={{ color: '#D8A325', fontStyle: 'italic' }}>No Facilitator Assigned</span>}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>{session.participants.length} Enrolled Participants</div>
                </div>
              </div>

              {/* Action Log / Operations Timeline mockup */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Session Operations Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>11:45 AM</span>
                    <span style={{ color: '#2D2D2D' }}>Session created by Program Manager.</span>
                  </div>
                  {session.facilitatorName && (
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                      <span style={{ color: '#6B7280', fontWeight: 600 }}>11:46 AM</span>
                      <span style={{ color: '#2D2D2D' }}>Facilitator <strong>{session.facilitatorName}</strong> assigned to session.</span>
                    </div>
                  )}
                  {session.resources.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                      <span style={{ color: '#6B7280', fontWeight: 600 }}>11:46 AM</span>
                      <span style={{ color: '#2D2D2D' }}>{session.resources.length} learning resources uploaded.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overview Right Setup Readiness Score */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Readiness Score</h3>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: readiness.score >= 80 ? '#10B981' : '#D8A325',
                    backgroundColor: readiness.score >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>{readiness.score}% Ready</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {readiness.checks.map(chk => (
                    <div key={chk.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                      <span style={{ color: chk.status ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                        {chk.status ? '✓' : '⚠'}
                      </span>
                      <span style={{ color: chk.status ? '#2D2D2D' : '#6B7280' }}>{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PARTICIPANTS & ATTENDANCE */}
        {detailTab === 'Participants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Participant Enrollment & Attendance</h3>
              <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                Total Enrolled: <strong>{session.participants.length}</strong>
              </span>
            </div>

            {/* Conditional Attendance Interface: Only if session starts / is active or completed */}
            {session.status !== 'Draft' && session.status !== 'Scheduled' ? (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #EBE5D9', backgroundColor: '#FAFAF8' }}>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280' }}>Participant</th>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280' }}>Email</th>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280' }}>Attendance Status</th>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.participants.map(part => {
                      const status = session.attendance?.[part.email] || 'Registered';
                      return (
                        <tr key={part.email} style={{ borderBottom: '1px solid #EBE5D9' }}>
                          <td style={{ padding: '0.95rem 1.25rem', fontWeight: 700, color: '#111111' }}>{part.name}</td>
                          <td style={{ padding: '0.95rem 1.25rem', color: '#6B7280' }}>{part.email}</td>
                          <td style={{ padding: '0.95rem 1.25rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              backgroundColor: 
                                status === 'Present' ? 'rgba(16,185,129,0.1)' :
                                status === 'Late' ? 'rgba(245,158,11,0.1)' :
                                status === 'Absent' ? 'rgba(239,68,68,0.08)' :
                                status === 'Excused' ? '#FAFAF8' : 'rgba(59,130,246,0.1)',
                              color: 
                                status === 'Present' ? '#10B981' :
                                status === 'Late' ? '#F59E0B' :
                                status === 'Absent' ? '#EF4444' :
                                status === 'Excused' ? '#6B7280' : '#3B82F6'
                            }}>
                              {status}
                            </span>
                          </td>
                          <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right' }}>
                            {['Present', 'Late', 'Absent', 'Excused'].map(option => (
                              <button
                                key={option}
                                onClick={() => handleMarkAttendance(part.email, option)}
                                style={{
                                  marginLeft: '0.35rem',
                                  padding: '0.3rem 0.55rem',
                                  border: '1px solid #EBE5D9',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  backgroundColor: status === option ? '#F4C542' : '#ffffff',
                                  cursor: 'pointer'
                                }}
                              >
                                {option}
                              </button>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* If session has not started, only display list of enrolled participants */
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #EBE5D9', backgroundColor: '#FAFAF8' }}>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280' }}>Participant</th>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280' }}>Email</th>
                      <th style={{ padding: '0.85rem 1.25rem', color: '#6B7280', textAlign: 'right' }}>Enrollment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.participants.map(part => (
                      <tr key={part.email} style={{ borderBottom: '1px solid #EBE5D9' }}>
                        <td style={{ padding: '0.95rem 1.25rem', fontWeight: 700, color: '#111111' }}>{part.name}</td>
                        <td style={{ padding: '0.95rem 1.25rem', color: '#6B7280' }}>{part.email}</td>
                        <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right', color: '#10B981', fontWeight: 700 }}>
                          ✓ Registered
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: RESOURCES */}
        {detailTab === 'Resources' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
            
            {/* Uploaded materials list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Uploaded Resources</h3>
              
              {session.resources && session.resources.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {session.resources.map(res => (
                    <div key={res.name} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #EBE5D9',
                      borderRadius: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={18} color="#6B7280" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{res.name}</div>
                          <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{res.size || '1.5 MB'}</span>
                        </div>
                      </div>
                      <button style={{ padding: '0.45rem 0.85rem', backgroundColor: '#F5F2ED', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280', border: '2px dashed #EBE5D9', borderRadius: '16px' }}>
                  No materials uploaded for this session yet.
                </div>
              )}
            </div>

            {/* Upload Form panel */}
            <div>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Upload New Resource</h3>
                <form onSubmit={handleUploadResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                      Resource Name / Link
                    </label>
                    <input 
                      type="text" 
                      value={resourceFile}
                      onChange={e => setResourceFile(e.target.value)}
                      placeholder="e.g. Slides.pdf or Assignment Brief"
                      required
                      style={{ width: '100%', padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button 
                    type="submit"
                    style={{ padding: '0.6rem', backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Upload File
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: RECORDING */}
        {detailTab === 'Recording' && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #EBE5D9',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Play size={36} color="#F4C542" />
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 800 }}>Cloud Video Recording</h3>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                Recording status: <strong>{session.recordingStatus || 'Not Started'}</strong>
              </span>
            </div>

            {session.recordingStatus === 'Available' && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => {
                    setWsPrograms(prev => {
                      const next = prev.map(p => {
                        if (p.id === session.programId) {
                          return {
                            ...p,
                            sessions: (p.sessions || []).map(s => {
                              if (s.id === session.id) {
                                return { ...s, recordingStatus: 'Published' };
                              }
                              return s;
                            })
                          };
                        }
                        return p;
                      });
                      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
                      return next;
                    });
                    setSuccessToast('Recording published successfully.');
                    setTimeout(() => setSuccessToast(null), 2500);
                  }}
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Publish Recording
                </button>
                <button 
                  onClick={() => alert('Opening recording preview link.')}
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #EBE5D9', borderRadius: '6px', color: '#111111', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Preview Recording
                </button>
              </div>
            )}

            {session.recordingStatus === 'Published' && (
              <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} /> Available for all enrolled participants.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DISCUSSION */}
        {detailTab === 'Discussion' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
            
            {/* Messages Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                padding: '1.5rem',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Session Board Thread</h3>

                {session.discussionMessages && session.discussionMessages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {session.discussionMessages.map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                          <span style={{ fontWeight: 700, color: '#111111' }}>{msg.sender}</span>
                          <span style={{ color: '#6B7280' }}>{msg.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#2D2D2D', lineHeight: 1.4 }}>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', fontStyle: 'italic', margin: 'auto' }}>No messages posted to this session board thread.</span>
                )}
              </div>
            </div>

            {/* Posting input Form */}
            <div>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #EBE5D9',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Post Announcement / Message</h3>
                <form onSubmit={handlePostDiscussionMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <textarea 
                      rows={4}
                      value={discussionInput}
                      onChange={e => setDiscussionInput(e.target.value)}
                      placeholder="Type your message here..."
                      required
                      style={{ width: '100%', padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button 
                    type="submit"
                    style={{ padding: '0.6rem', backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Post Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: ANALYTICS (ONLY ACCESSIBLE IF SESSION IS COMPLETED) */}
        {detailTab === 'Analytics' && session.status === 'Completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Session Analytics Dashboard</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem'
            }}>
              {[
                { label: 'Attendance Rate', value: '92%', detail: '22 present / 2 absent' },
                { label: 'Average Join Time', value: '09:58 AM', detail: '2 minutes before start' },
                { label: 'Average Leave Time', value: '11:31 AM', detail: '1 minute after end' },
                { label: 'Average Engagement Duration', value: '88 mins', detail: 'Out of 90 total minutes' },
                { label: 'Resource Downloads', value: '18 downloads', detail: 'Learning resources downloads count' },
                { label: 'Assessment Completion', value: '100%', detail: 'All present completed follow-up assignment' }
              ].map(analytic => (
                <div key={analytic.label} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #EBE5D9',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>{analytic.label}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111' }}>{analytic.value}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.25rem' }}>{analytic.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
