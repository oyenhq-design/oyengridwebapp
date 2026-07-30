import React, { useState, useMemo } from 'react';
import {
  Calendar, Plus, X, ChevronDown, Video, FileText, CheckCircle,
  ArrowRight, ArrowLeft, MoreVertical, Edit, Download, Clock, ExternalLink, Play, Trash2, Search, Users, Book,
  Sparkles, Check, List, ShieldAlert, Award, FileSpreadsheet, Share2, Copy
} from 'lucide-react';

export default function SessionsTab({ 
  programs = [], 
  setPrograms, 
  learners = [], 
  addNotification, 
  onNavigateToPrograms, 
  userRole 
}) {
  // Navigation State
  const [selectedProgId, setSelectedProgId] = useState(() => {
    return programs.length > 0 ? programs[0].id : null;
  });
  
  // View states
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facilitatorFilter, setFacilitatorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  
  // Drawer states
  const [selectedSession, setSelectedSession] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'resources' | 'assessments'
  const [activeMenuId, setActiveMenuId] = useState(null);

  // New session modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    type: 'Live Session',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    facilitatorName: '',
    facilitatorEmail: '',
    enableOyenLive: true,
    externalMeetingLink: '',
    location: 'Virtual'
  });

  const currentProgram = useMemo(() => {
    return programs.find(p => p.id === selectedProgId) || programs[0] || null;
  }, [programs, selectedProgId]);

  const sessions = useMemo(() => {
    if (!currentProgram) return [];
    return currentProgram.sessions || [];
  }, [currentProgram]);

  // Derived metrics
  const upcomingCount = sessions.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled').length;
  const liveCount = sessions.filter(s => s.status === 'Live').length;
  const completedCount = sessions.filter(s => s.status === 'Completed').length;

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (s.facilitatorName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesFacilitator = facilitatorFilter === 'All' || s.facilitatorName === facilitatorFilter;
      const matchesDate = !dateFilter || s.date === dateFilter;
      return matchesSearch && matchesStatus && matchesFacilitator && matchesDate;
    }).sort((a, b) => {
      if (sortField === 'title') return a.title.localeCompare(b.title);
      return new Date(a.date || '') - new Date(b.date || '');
    });
  }, [sessions, searchQuery, statusFilter, facilitatorFilter, dateFilter, sortField]);

  const uniqueFacilitators = useMemo(() => {
    const set = new Set();
    sessions.forEach(s => {
      if (s.facilitatorName) set.add(s.facilitatorName);
    });
    return Array.from(set);
  }, [sessions]);

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
      facilitatorName: sessionForm.facilitatorName.trim() || 'Sarah Ahmed',
      facilitatorEmail: sessionForm.facilitatorEmail.trim(),
      enableOyenLive: sessionForm.enableOyenLive,
      externalMeetingLink: sessionForm.externalMeetingLink.trim(),
      location: sessionForm.location,
      status: 'Upcoming',
      resources: [],
      notes: '',
      attendance: {}
    };

    setPrograms(prev => prev.map(p => {
      if (p.id === selectedProgId) {
        return {
          ...p,
          sessions: [...(p.sessions || []), newSession]
        };
      }
      return p;
    }));

    addNotification?.(`Session "${newSession.title}" scheduled successfully!`);
    setShowScheduleModal(false);
    setSessionForm({
      title: '',
      type: 'Live Session',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      facilitatorName: '',
      facilitatorEmail: '',
      enableOyenLive: true,
      externalMeetingLink: '',
      location: 'Virtual'
    });
  };

  const handleDeleteSession = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this session?')) {
      setPrograms(prev => prev.map(p => {
        if (p.id === selectedProgId) {
          return {
            ...p,
            sessions: (p.sessions || []).filter(s => s.id !== id)
          };
        }
        return p;
      }));
      addNotification?.('Session deleted successfully');
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === selectedProgId) {
        return {
          ...p,
          sessions: (p.sessions || []).map(s => s.id === id ? { ...s, status: newStatus } : s)
        };
      }
      return p;
    }));
    addNotification?.(`Session status updated to ${newStatus}`);
    if (selectedSession?.id === id) {
      setSelectedSession(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDuplicateSession = (session) => {
    const duplicated = {
      ...session,
      id: Date.now(),
      title: `${session.title} (Copy)`,
      status: 'Upcoming'
    };
    setPrograms(prev => prev.map(p => {
      if (p.id === selectedProgId) {
        return {
          ...p,
          sessions: [...(p.sessions || []), duplicated]
        };
      }
      return p;
    }));
    addNotification?.('Session duplicated successfully');
  };

  // If no program selected, show program selector screen
  if (!selectedProgId || !currentProgram) {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Sessions Tab</h2>
          <p style={{ color: '#5C5C5C', fontSize: '0.85rem', marginTop: '0.3rem' }}>Select a training program to manage its Command Center and scheduling.</p>
        </div>

        {programs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {programs.map((p) => {
              const count = (p.sessions || []).length;
              return (
                <div key={p.id}
                  style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{p.name}</h4>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, height: '36px', overflow: 'hidden' }}>{p.desc}</p>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid #1F2937', paddingTop: '0.75rem' }}>
                    <span>{count} Scheduled Session{count !== 1 ? 's' : ''}</span>
                  </div>
                  <button
                    onClick={() => setSelectedProgId(p.id)}
                    style={{ marginTop: '0.5rem', width: '100%', padding: '0.6rem', backgroundColor: 'rgba(245,200,76,0.1)', border: '1px solid rgba(245,200,76,0.25)', borderRadius: '8px', color: '#F5C84C', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Open Session Dashboard
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Calendar size={42} color="#F5C84C" />
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Create a training program first</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.4rem', maxWidth: '340px' }}>Schedule sessions under program layers to track attendance.</p>
            </div>
            <button onClick={onNavigateToPrograms} style={{ background: '#F5C84C', border: 'none', color: '#111111', fontWeight: 700, borderRadius: '8px', padding: '0.65rem 1.35rem', cursor: 'pointer' }}>Go to Programs Tab</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* ── STICKY FLOATING ANALYTICS BAR ── */}
      <div style={{ position: 'sticky', top: '0', zIndex: 999, backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
          <div>Total: <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{sessions.length} Sessions</span></div>
          <div style={{ color: 'rgba(255,255,255,0.1)' }}>|</div>
          <div>Attendance: <span style={{ color: '#F5C84C', fontWeight: 800 }}>94% Avg</span></div>
          <div>Live: <span style={{ color: '#10B981', fontWeight: 800 }}>{liveCount} Active Now</span></div>
          <div style={{ color: 'rgba(255,255,255,0.1)' }}>|</div>
          <div>Audience: <span style={{ color: '#3B82F6', fontWeight: 800 }}>{learners.length} Active Participants</span></div>

        </div>
        
        <button 
          onClick={() => setSelectedProgId(null)}
          style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Programs
        </button>
      </div>

      {/* ── BREADCRUMB & HEADER LAYER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Programs</span>
            <span>/</span>
            <span>{currentProgram.name}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>Sessions</h1>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '5px', textTransform: 'uppercase' }}>
              Active
            </span>
          </div>
          <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem', margin: 0 }}>
            Manage every training session, webinar, and live class for this program.
          </p>
        </div>

        <button 
          onClick={() => setShowScheduleModal(true)}
          style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5C84C', border: '1px solid #F5C84C', borderRadius: '10px', fontSize: '0.82rem', color: '#111111', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,200,76,0.15)' }}
        >
          <Plus size={15} /> Schedule Session
        </button>
      </div>

      {/* ── KPI SECTION ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Total Sessions', value: sessions.length, sub: 'All items', color: '#3B82F6' },
          { label: 'Upcoming', value: upcomingCount, sub: 'Planned classes', color: '#F5C84C' },
          { label: 'Live Now', value: liveCount, sub: 'Active sessions', color: '#10B981' },
          { label: 'Completed', value: completedCount, sub: 'Archive logs', color: '#94A3B8' },
          { label: 'Attendance Rate', value: '94%', sub: 'Target 90%+', color: '#8b5cf6' },
          { label: 'Avg Duration', value: '1h 48m', sub: 'Standard length', color: '#0891B2' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>{kpi.value}</span>
            <span style={{ fontSize: '0.7rem', color: kpi.color, fontWeight: 600 }}>{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* ── SESSION TIMELINE & QUICK ACTIONS COLUMN ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left timeline layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Timeline header */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Timeline</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid #1F2937', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
              {[
                { time: '09:00 AM', title: 'Leadership Kickoff', platform: 'Zoom-like Live Session', fac: 'Sarah Ahmed', learners: '38 Learners', day: 'Today', status: 'Live', badgeColor: '#10B981' },
                { time: '10:00 AM', title: 'Module 2: Problem Solving', platform: 'Oyen Live Virtual Room', fac: 'Sarah Ahmed', learners: '42 Learners', day: 'Tomorrow', status: 'Upcoming', badgeColor: '#3B82F6' },
                { time: '02:00 PM', title: 'Cohort Retrospective', platform: 'Oyen Live Room', fac: 'John Doe', learners: '35 Learners', day: '02 Aug', status: 'Completed', badgeColor: '#94A3B8' }
              ].map((timeItem, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{ position: 'absolute', left: '-2.05rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: timeItem.badgeColor, border: '3px solid #111111' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>{timeItem.day} · {timeItem.time}</div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', margin: '0.15rem 0' }}>{timeItem.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0 }}>{timeItem.platform} · Facilitator: <strong style={{ color: '#FFFFFF' }}>{timeItem.fac}</strong></p>
                      <span style={{ fontSize: '0.75rem', color: '#F5C84C', fontWeight: 600, display: 'inline-block', marginTop: '0.25rem' }}>{timeItem.learners}</span>
                    </div>
                    
                    {timeItem.status === 'Live' ? (
                      <button 
                        onClick={() => addNotification?.('Launching live virtual classroom environment...')}
                        style={{ padding: '0.45rem 1rem', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Start Session
                      </button>
                    ) : (
                      <button 
                        onClick={() => addNotification?.('Opening session information panel...')}
                        style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions Filter, Table & Options */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Scheduled Sessions List</h3>
              
              <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => setViewMode('list')} style={{ backgroundColor: viewMode === 'list' ? '#F5C84C' : 'transparent', color: viewMode === 'list' ? '#111111' : '#94A3B8', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <List size={12} /> List View
                </button>
                <button onClick={() => setViewMode('calendar')} style={{ backgroundColor: viewMode === 'calendar' ? '#F5C84C' : 'transparent', color: viewMode === 'calendar' ? '#111111' : '#94A3B8', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={12} /> Calendar View
                </button>
              </div>
            </div>

            {/* Filters row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #1F2937', paddingBottom: '1.25rem' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                <Search size={14} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search sessions..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem 0.45rem 2rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                />
              </div>
              
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.45rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>

              <select value={facilitatorFilter} onChange={e => setFacilitatorFilter(e.target.value)} style={{ padding: '0.45rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
                <option value="All">All Facilitators</option>
                {uniqueFacilitators.map(fac => <option key={fac} value={fac}>{fac}</option>)}
              </select>
            </div>

            {/* List / Calendar Graphic Render */}
            {viewMode === 'calendar' ? (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed #1F2937', borderRadius: '12px', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Interactive Calendar Workspace</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', maxWidth: '420px', margin: '0 auto' }}>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: (i===11 || i===15) ? 'rgba(245,200,76,0.1)' : 'rgba(255,255,255,0.02)', border: (i===11 || i===15) ? '1px solid #F5C84C' : '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: (i===11 || i===15) ? '#F5C84C' : '#94A3B8', cursor: 'pointer' }} onClick={() => addNotification?.(`Quick-checking calendar events for August ${i+1}`)}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>Click highlights to view scheduled sessions on that day.</span>
              </div>
            ) : filteredSessions.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1F2937', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Session</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Facilitator</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Attendance</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Duration</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((s, idx) => (
                      <tr 
                        key={s.id || idx} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', color: '#E2E8F0', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedSession(s);
                          setActiveTab('overview');
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{s.title}</td>
                        <td style={{ padding: '1rem' }}>{s.facilitatorName || 'Sarah Ahmed'}</td>
                        <td style={{ padding: '1rem' }}>{s.date || '12 Aug'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>42/50</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>2 hrs</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{ 
                            fontSize: '0.68rem', fontWeight: 700, 
                            color: s.status === 'Completed' ? '#94A3B8' : (s.status === 'Live' ? '#10B981' : '#3B82F6'),
                            backgroundColor: s.status === 'Completed' ? 'rgba(148,163,184,0.1)' : (s.status === 'Live' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)'),
                            padding: '0.2rem 0.5rem', borderRadius: '5px' 
                          }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === s.id ? null : s.id)}
                              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeMenuId === s.id && (
                              <div style={{ position: 'absolute', right: 0, marginTop: '0.35rem', backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '8px', zIndex: 100, width: '160px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                                <button onClick={() => { setSelectedSession(s); setActiveMenuId(null); }} style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: 'transparent', border: 'none', color: '#FFFFFF', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}><Eye size={12} /> View</button>
                                <button onClick={() => { handleDuplicateSession(s); setActiveMenuId(null); }} style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: 'transparent', border: 'none', color: '#FFFFFF', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}><Copy size={12} /> Duplicate</button>
                                <button onClick={() => { handleDeleteSession(s.id); setActiveMenuId(null); }} style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: 'transparent', border: 'none', color: '#EF4444', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', borderTop: '1px solid #1F2937' }}><Trash2 size={12} /> Delete</button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ backgroundColor: '#111111', border: '1px dashed #1F2937', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Calendar size={38} color="#F5C84C" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>No sessions match your filter</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '0.3rem' }}>Try modifying search parameters to view items.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right side widgets column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Actions Widget */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Quick Actions</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button onClick={() => setShowScheduleModal(true)} style={{ width: '100%', padding: '0.55rem', backgroundColor: '#F5C84C', border: 'none', color: '#111111', fontWeight: 700, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>+ Schedule Session</button>
              <button onClick={() => addNotification?.('Importing schedule file...')} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Import Sessions</button>
              <button onClick={() => addNotification?.('Redirecting to teams assigner...')} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Assign Facilitator</button>
              <button onClick={() => addNotification?.('Generating blank attendance log sheet...')} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Generate Attendance Sheet</button>
            </div>
          </div>

          {/* Attendance Overview Widget */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Attendance Overview</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.78rem', color: '#94A3B8' }}>
              <div>Average: <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '1rem' }}>94%</strong></div>
              <div>Highest: <strong style={{ color: '#10B981', display: 'block', fontSize: '1rem' }}>100%</strong></div>
              <div>Lowest: <strong style={{ color: '#EF4444', display: 'block', fontSize: '1rem' }}>72%</strong></div>
              <div>Late Joiners: <strong style={{ color: '#F5C84C', display: 'block', fontSize: '1rem' }}>18</strong></div>
            </div>
            
            {/* Sparkline */}
            <svg viewBox="0 0 100 20" style={{ width: '100%', height: '20px' }}>
              <path d="M 0 15 Q 25 5 50 12 T 100 2" fill="none" stroke="#F5C84C" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Facilitator Workload Widget */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Facilitator Workload</h4>
            
            {[
              { name: 'Sarah Ahmed', count: 8, pct: 80 },
              { name: 'John Doe', count: 6, pct: 60 },
              { name: 'Blessing Kalu', count: 4, pct: 40 }
            ].map((wk, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{wk.name}</span>
                  <span>{wk.count} Sessions</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${wk.pct}%`, backgroundColor: '#F5C84C' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Widget */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem', color: '#94A3B8' }}>
              <div><strong style={{ color: '#FFFFFF' }}>Sarah</strong> started Leadership Kickoff <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>10 mins ago</span></div>
              <div>Attendance finalized <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Yesterday</span></div>
              <div>Recording uploaded <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Yesterday</span></div>
              <div>Assessment linked <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>2 days ago</span></div>
            </div>
          </div>

          {/* AI Insights Widget */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#F5C84C" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>OYEN AI Insights</h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}><span style={{ color: '#F5C84C' }}>•</span> Attendance increased 14% this month.</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}><span style={{ color: '#F5C84C' }}>•</span> Tuesday sessions have the highest participation.</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}><span style={{ color: '#F5C84C' }}>•</span> Average participant joins 6 minutes early.</div>
              <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245,200,76,0.05)', border: '1px solid rgba(245,200,76,0.15)', borderRadius: '6px', color: '#F5C84C', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.25rem' }}>
                Recommendation: Schedule more sessions between 9AM–11AM.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── GENERATE SESSION REPORTS SECTION ── */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Reports Generator</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Export Attendance', action: 'attendance' },
            { label: 'Export Session History', action: 'history' },
            { label: 'Export Facilitator Report', action: 'facilitator' },
            { label: 'Export Engagement Report', action: 'engagement' }
          ].map((rep, idx) => (
            <button 
              key={idx} 
              onClick={() => addNotification?.(`Generating session ${rep.action} report...`)}
              style={{ padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#F5C84C'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1F2937'}
            >
              {rep.label}
            </button>
          ))}
          <button 
            onClick={() => addNotification?.('Generating OYEN AI Session Synthesis...')}
            style={{ padding: '0.65rem 1rem', backgroundColor: '#F5C84C', border: 'none', borderRadius: '8px', color: '#111111', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <Sparkles size={13} /> Generate AI Summary
          </button>
        </div>
      </div>

      {/* ── SESSION SCHEDULER MODAL ── */}
      {showScheduleModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowScheduleModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '18px', width: '100%', maxWidth: '460px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Schedule Session</h3>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem', margin: 0 }}>Configure details to schedule a live training session.</p>
              </div>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#94A3B8', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Session Title</label>
                <input required type="text" value={sessionForm.title} onChange={e => setSessionForm(prev => ({ ...prev, title: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }} placeholder="e.g. Kickoff & Orientation" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Type</label>
                <select value={sessionForm.type} onChange={e => setSessionForm(prev => ({ ...prev, type: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                  <option style={{ backgroundColor: '#111111' }}>Live Session</option>
                  <option style={{ backgroundColor: '#111111' }}>Webinar</option>
                  <option style={{ backgroundColor: '#111111' }}>Workshop</option>
                  <option style={{ backgroundColor: '#111111' }}>Assessment</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Facilitator Name</label>
                <input type="text" value={sessionForm.facilitatorName} onChange={e => setSessionForm(prev => ({ ...prev, facilitatorName: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }} placeholder="e.g. Sarah Ahmed" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Date</label>
                  <input required type="date" value={sessionForm.date} onChange={e => setSessionForm(prev => ({ ...prev, date: e.target.value }))} style={{ width: '100%', padding: '0.55rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Start Time</label>
                  <input required type="time" value={sessionForm.startTime} onChange={e => setSessionForm(prev => ({ ...prev, startTime: e.target.value }))} style={{ width: '100%', padding: '0.55rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', colorScheme: 'dark' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} style={{ flex: 1, padding: '0.65rem', backgroundColor: 'transparent', border: '1px solid #1F2937', color: '#94A3B8', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.65rem', backgroundColor: '#F5C84C', border: 'none', color: '#111111', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>Schedule</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── SESSION DETAIL DRAWERS ── */}
      {selectedSession && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelectedSession(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', height: '100vh', backgroundColor: '#111111', borderLeft: '1px solid #1F2937', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '-10px 0 30px rgba(0,0,0,0.25)', textAlign: 'left', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#F5C84C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session Workspace</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: '0.2rem 0 0 0', fontFamily: "'Outfit', sans-serif" }}>{selectedSession.title}</h3>
              </div>
              
              <button onClick={() => setSelectedSession(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#94A3B8', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            {/* Tabs selection */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1F2937', gap: '1rem', fontSize: '0.8rem' }}>
              {['overview', 'attendance', 'resources'].map(tb => (
                <span 
                  key={tb} 
                  onClick={() => setActiveTab(tb)}
                  style={{ paddingBottom: '0.5rem', color: activeTab === tb ? '#F5C84C' : '#94A3B8', fontWeight: activeTab === tb ? 700 : 400, borderBottom: activeTab === tb ? '2px solid #F5C84C' : 'none', cursor: 'pointer', textTransform: 'capitalize' }}
                >
                  {tb}
                </span>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.82rem', color: '#94A3B8' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Facilitator</span>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>{selectedSession.facilitatorName || 'Sarah Ahmed'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Timeline</span>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>{selectedSession.date || '12 Aug'} · {selectedSession.startTime || '10:00 AM'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Status</span>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>{selectedSession.status}</strong>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem', marginTop: '1rem' }}>
                  <button onClick={() => { handleStatusChange(selectedSession.id, 'Live'); }} style={{ width: '100%', padding: '0.6rem', backgroundColor: '#10B981', border: 'none', color: '#FFFFFF', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Start Session</button>
                  <button onClick={() => { handleStatusChange(selectedSession.id, 'Completed'); }} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>Mark Completed</button>
                  <button onClick={() => { handleStatusChange(selectedSession.id, 'Cancelled'); }} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'transparent', border: '1px solid #EF4444', color: '#EF4444', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>Cancel Session</button>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Quick attendance logger:</span>
                <div style={{ border: '1px solid #1F2937', borderRadius: '10px', overflow: 'hidden' }}>
                  {learners.slice(0, 8).map(l => (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{l.name}</span>
                      <button onClick={() => addNotification?.(`Updated attendance for ${l.name}`)} style={{ padding: '0.2rem 0.5rem', backgroundColor: 'rgba(34,197,94,0.1)', border: 'none', borderRadius: '5px', color: '#10B981', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>Present</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Materials linked to session:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.78rem', color: '#FFFFFF' }}>
                    <FileText size={14} color="#F5C84C" /> Orientation_Handout.pdf
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.78rem', color: '#FFFFFF' }}>
                    <FileText size={14} color="#F5C84C" /> Curriculum_Syllabus.docx
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
