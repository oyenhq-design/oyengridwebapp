import React, { useState, useMemo } from 'react';
import {
  Calendar, RefreshCw, Clock, Edit, FileText, CheckCircle, ArrowRight,
  MoreVertical, Download, Search, Sparkles, CheckSquare, MessageSquare, ClipboardList, Upload, File, List, Eye, Video
} from 'lucide-react';

export default function FacilitatorSessions({ 
  programs = [], 
  setPrograms, 
  learners = [], 
  addNotification, 
  currentUserEmail
}) {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [privateNotes, setPrivateNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const assignedSessions = useMemo(() => {
    let allSessions = [];
    programs.forEach(p => {
      if (p.sessions) {
        const sessionsWithProgram = p.sessions.map(s => ({...s, programName: p.name, programId: p.id}));
        allSessions = [...allSessions, ...sessionsWithProgram];
      }
    });
    return allSessions.filter(s => s.facilitatorEmail === currentUserEmail);
  }, [programs, currentUserEmail]);

  const upcomingCount = assignedSessions.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled').length;
  const liveCount = assignedSessions.filter(s => s.status === 'Live').length;
  const completedCount = assignedSessions.filter(s => s.status === 'Completed').length;

  const filteredSessions = useMemo(() => {
    return assignedSessions.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesDate = !dateFilter || s.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(a.date || '') - new Date(b.date || ''));
  }, [assignedSessions, searchQuery, statusFilter, dateFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addNotification?.('Sessions refreshed successfully.');
    }, 1000);
  };

  const handleNotifyAdmin = () => {
    addNotification?.('Administrator notified.');
  };

  if (assignedSessions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ 
        backgroundColor: '#F8F6F1', 
        minHeight: '100vh', 
        padding: '3.5rem 4.5rem', 
        fontFamily: "'Inter', sans-serif",
        color: '#111111',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        {/* Page Header */}
        <div>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            color: '#111111', 
            margin: 0, 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.8px'
          }}>
            Sessions Workspace
          </h1>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            marginTop: '0.35rem' 
          }}>
            Manage your assigned teaching sessions and classroom records.
          </p>
        </div>

        {/* Naturally Positioned Content Area Empty Card */}
        <div style={{ 
          backgroundColor: '#FFFDF9', 
          borderRadius: '24px', 
          padding: '4.5rem 3rem', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
          border: '1px solid #E8E2D8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gold radial background glow */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(214, 166, 42, 0.04)',
            filter: 'blur(50px)',
            top: '10%',
            zIndex: 1
          }} />

          {/* Premium gold badge icon */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '84px', 
            height: '84px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(214, 166, 42, 0.08)', 
            boxShadow: '0 4px 15px rgba(214, 166, 42, 0.08)',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 2
          }}>
            <Calendar size={36} color="#D6A62A" />
          </div>

          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: '#111111', 
            margin: '0 0 1rem', 
            fontFamily: "'Outfit', sans-serif",
            position: 'relative',
            zIndex: 2
          }}>
            No sessions assigned yet
          </h2>
          
          <p style={{ 
            color: '#666666', 
            fontSize: '0.95rem', 
            lineHeight: '1.6', 
            margin: '0 0 2.25rem',
            maxWidth: '480px',
            position: 'relative',
            zIndex: 2
          }}>
            Your administrator hasn't assigned any sessions to you yet. As soon as a session is assigned, it will automatically appear here.
          </p>

          <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{ 
                backgroundColor: '#D6A62A', 
                border: 'none', 
                color: '#FFFFFF', 
                fontWeight: 700, 
                borderRadius: '10px', 
                padding: '0.75rem 2rem', 
                cursor: isRefreshing ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(214, 166, 42, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if(!isRefreshing) e.currentTarget.style.backgroundColor = '#B58C1F'; }}
              onMouseLeave={e => { if(!isRefreshing) e.currentTarget.style.backgroundColor = '#D6A62A'; }}
            >
              {isRefreshing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>My Sessions Workspace</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem', margin: 0 }}>
            Manage your assigned training sessions, virtual classes, and webinars.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5C84C', border: '1px solid #F5C84C', borderRadius: '10px', fontSize: '0.82rem', color: '#111111', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: isRefreshing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(245,200,76,0.15)', opacity: isRefreshing ? 0.7 : 1 }}
        >
          {isRefreshing ? <RefreshCw size={15} className="animate-spin" /> : <RefreshCw size={15} />} 
          Sync Sessions
        </button>
      </div>

      {/* ── KPI SECTION ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Total Assigned', value: assignedSessions.length, sub: 'All items', color: '#3B82F6' },
          { label: 'Upcoming', value: upcomingCount, sub: 'Planned classes', color: '#F5C84C' },
          { label: 'Live Now', value: liveCount, sub: 'Active sessions', color: '#10B981' },
          { label: 'Completed', value: completedCount, sub: 'Archive logs', color: '#94A3B8' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{kpi.value}</span>
            <span style={{ fontSize: '0.75rem', color: kpi.color, fontWeight: 600 }}>{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: TIMELINE & TABLE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Timeline header */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Timeline</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid #1F2937', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
              {assignedSessions.slice(0, 3).map((session, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-2.05rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: session.status === 'Live' ? '#10B981' : session.status === 'Completed' ? '#94A3B8' : '#3B82F6', border: '3px solid #111111' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>{session.date || 'Pending'} · {session.startTime || 'TBD'}</div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', margin: '0.15rem 0' }}>{session.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0 }}>Program: <strong style={{ color: '#FFFFFF' }}>{session.programName}</strong></p>
                    </div>
                    
                    {session.status === 'Live' ? (
                      <button 
                        onClick={() => addNotification?.('Launching live virtual classroom environment...')}
                        style={{ padding: '0.45rem 1rem', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Video size={14} /> Join
                      </button>
                    ) : (
                      <button 
                        onClick={() => addNotification?.('Opening session information panel...')}
                        style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions Filter & Table */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Scheduled Sessions List</h3>
              
              <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => setViewMode('list')} style={{ backgroundColor: viewMode === 'list' ? '#F5C84C' : 'transparent', color: viewMode === 'list' ? '#111111' : '#94A3B8', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <List size={12} /> List
                </button>
                <button onClick={() => setViewMode('calendar')} style={{ backgroundColor: viewMode === 'calendar' ? '#F5C84C' : 'transparent', color: viewMode === 'calendar' ? '#111111' : '#94A3B8', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={12} /> Calendar
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #1F2937', paddingBottom: '1.25rem' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                <Search size={14} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search your sessions..." 
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
            </div>

            {viewMode === 'calendar' ? (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed #1F2937', borderRadius: '12px', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Calendar View</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', maxWidth: '420px', margin: '0 auto' }}>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: (i===11 || i===15) ? 'rgba(245,200,76,0.1)' : 'rgba(255,255,255,0.02)', border: (i===11 || i===15) ? '1px solid #F5C84C' : '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: (i===11 || i===15) ? '#F5C84C' : '#94A3B8', cursor: 'pointer' }} onClick={() => addNotification?.(`Quick-checking calendar events for day ${i+1}`)}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredSessions.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1F2937', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Program</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((s, idx) => (
                      <tr 
                        key={s.id || idx} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', color: '#E2E8F0', cursor: 'pointer' }}
                        onClick={() => setSelectedSession(s)}
                      >
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{s.title}</td>
                        <td style={{ padding: '1rem' }}>{s.programName}</td>
                        <td style={{ padding: '1rem' }}>{s.date || 'TBD'}</td>
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
                              <div style={{ position: 'absolute', right: 0, marginTop: '0.35rem', backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '8px', zIndex: 100, width: '120px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                                <button onClick={() => { setSelectedSession(s); setActiveMenuId(null); }} style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: 'transparent', border: 'none', color: '#FFFFFF', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}><Eye size={12} /> View Details</button>
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
                <Search size={38} color="#F5C84C" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>No sessions match</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '0.3rem' }}>Adjust your filters to see more.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* My Tasks */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={16} color="#F5C84C" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>My Tasks</h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { task: 'Prepare presentation slides', session: 'Next Upcoming Session', due: 'Today', priority: 'High' },
                { task: 'Review participant roster', session: 'Next Upcoming Session', due: 'Tomorrow', priority: 'Medium' }
              ].map((task, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{task.task}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: task.priority === 'High' ? '#EF4444' : '#F5C84C', padding: '0.15rem 0.4rem', backgroundColor: task.priority === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(245,200,76,0.1)', borderRadius: '4px' }}>
                      {task.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{task.session} · Due {task.due}</div>
                  <button onClick={() => addNotification?.(`Marking task "${task.task}" as complete`)} style={{ marginTop: '0.25rem', alignSelf: 'flex-start', padding: '0.35rem 0.65rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #1F2937', color: '#E2E8F0', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={12} /> Mark Complete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Session Resources */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <File size={16} color="#F5C84C" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Resources</h4>
              </div>
              <button onClick={() => addNotification?.('Opening file upload dialog...')} style={{ background: 'none', border: 'none', color: '#F5C84C', cursor: 'pointer' }}>
                <Upload size={14} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'Facilitator_Guide.pdf', date: 'Recent' },
                { name: 'Activity_Handouts.docx', date: 'Recent' }
              ].map((res, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={14} color="#94A3B8" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 600 }}>{res.name}</span>
                      <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>{res.date}</span>
                    </div>
                  </div>
                  <button onClick={() => addNotification?.(`Downloading ${res.name}...`)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Session Checklist */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={16} color="#F5C84C" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Checklist</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
                <CheckCircle size={14} /> Assigned
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
                <CheckCircle size={14} /> Materials Reviewed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '14px', height: '14px', border: '1px solid #94A3B8', borderRadius: '4px' }} /> Join Link Tested
              </div>
            </div>
          </div>

          {/* Private Notes */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} color="#F5C84C" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Private Notes</h4>
              </div>
              <button onClick={() => {
                if (isEditingNotes) addNotification?.('Private notes saved.');
                setIsEditingNotes(!isEditingNotes);
              }} style={{ background: 'none', border: 'none', color: '#F5C84C', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                {isEditingNotes ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditingNotes ? (
              <textarea 
                value={privateNotes} 
                onChange={e => setPrivateNotes(e.target.value)} 
                placeholder="Write private reminders..."
                style={{ width: '100%', minHeight: '80px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', padding: '0.75rem', color: '#E2E8F0', fontSize: '0.82rem', resize: 'vertical', outline: 'none' }}
              />
            ) : (
              <div style={{ fontSize: '0.82rem', color: privateNotes ? '#E2E8F0' : '#6B7280', minHeight: '40px', whiteSpace: 'pre-wrap' }}>
                {privateNotes || 'No notes added yet.'}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="#F5C84C" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Edit size={14} color="#3B82F6" style={{ marginTop: '0.1rem' }} />
                <div><span style={{ color: '#E2E8F0' }}>Session assigned</span><div style={{ fontSize: '0.65rem', color: '#6B7280' }}>Recently</div></div>
              </div>
            </div>
          </div>

          {/* OYEN AI Assistant */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#F5C84C" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>OYEN AI Assistant</h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>Need help preparing for your session?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Generate Session Agenda', 'Generate Icebreaker', 'Create Quiz'].map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => addNotification?.(`AI is generating: ${action}...`)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(245,200,76,0.05)'; e.currentTarget.style.borderColor = 'rgba(245,200,76,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                >
                  {action}
                  <ArrowRight size={14} color="#6B7280" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
