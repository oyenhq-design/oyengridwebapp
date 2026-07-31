import React, { useState, useMemo } from 'react';
import {
  Calendar, Plus, X, ChevronDown, Video, FileText, CheckCircle,
  ArrowRight, ArrowLeft, MoreVertical, Edit, Download, Clock, ExternalLink, Play, Trash2, Search, Users, Book,
  Sparkles, Check, List, ShieldAlert, Award, FileSpreadsheet, Share2, Copy, Eye
} from 'lucide-react';

export default function AdminSessions(props) {
  const { 
    programs = [], 
    setPrograms, 
    learners = [], 
    addNotification, 
    onNavigateToPrograms, 
    userRole,
    teamMembers = []
  } = props;

  const [selectedProgId, setSelectedProgId] = useState(() => {
    return programs.length > 0 ? programs[0].id : null;
  });
  
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facilitatorFilter, setFacilitatorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '', type: 'Live Session', date: '', startTime: '', endTime: '', description: '',
    facilitatorName: '', facilitatorEmail: '', enableOyenLive: true, externalMeetingLink: '', location: 'Virtual'
  });
  const [successScreen, setSuccessScreen] = useState(false);

  const currentProgram = useMemo(() => {
    return programs.find(p => p.id === selectedProgId) || programs[0] || null;
  }, [programs, selectedProgId]);

  const sessions = useMemo(() => {
    if (!currentProgram) return [];
    return currentProgram.sessions || [];
  }, [currentProgram]);

  const totalSessionsCount = sessions.length;
  const upcomingCount = sessions.filter(s => s.status === 'Upcoming' || !s.status).length;
  const liveCount = sessions.filter(s => s.status === 'Live').length;
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  const cancelledCount = sessions.filter(s => s.status === 'Cancelled').length;
  const completedCount = completedSessions.length;
  const totalLearners = learners.length;

  const getSessionAttendance = (session) => {
    if (!session.attendance) return { present: 0, total: totalLearners, percentage: 0 };
    let presentCount = 0;
    if (Array.isArray(session.attendance)) {
      presentCount = session.attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    } else {
      presentCount = Object.values(session.attendance).filter(status => status === 'Present' || status === 'Late').length;
    }
    const total = totalLearners > 0 ? totalLearners : (Object.keys(session.attendance || {}).length || 1);
    return {
      present: presentCount,
      total: total,
      percentage: total > 0 ? (presentCount / total) * 100 : 0
    };
  };

  const completedAttendanceStats = completedSessions.map(getSessionAttendance);
  const avgAttendance = completedCount > 0 
    ? (completedAttendanceStats.reduce((sum, stat) => sum + stat.percentage, 0) / completedCount)
    : null;
    
  const highestAttendance = completedCount > 0 ? Math.max(...completedAttendanceStats.map(s => s.percentage)) : null;
  const lowestAttendance = completedCount > 0 ? Math.min(...completedAttendanceStats.map(s => s.percentage)) : null;

  const calculateDurationStr = (start, end) => {
    if (!start || !end) return 'N/A';
    const s = new Date(`1970-01-01T${start}`);
    const e = new Date(`1970-01-01T${end}`);
    if(isNaN(s) || isNaN(e)) return 'N/A';
    let diff = (e - s) / 60000;
    if (diff < 0) diff += 24 * 60;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
  };

  const avgDuration = completedCount > 0 ? (() => {
    let totalMins = 0;
    let validCount = 0;
    completedSessions.forEach(s => {
      if (s.startTime && s.endTime) {
        const start = new Date(`1970-01-01T${s.startTime}`);
        const end = new Date(`1970-01-01T${s.endTime}`);
        if(!isNaN(start) && !isNaN(end)) {
          let diff = (end - start) / 60000;
          if (diff < 0) diff += 24 * 60;
          totalMins += diff;
          validCount++;
        }
      }
    });
    if (validCount === 0) return 'N/A';
    const avg = totalMins / validCount;
    const hrs = Math.floor(avg / 60);
    const mins = Math.round(avg % 60);
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
  })() : null;

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (s.facilitatorName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter || (!s.status && statusFilter === 'Upcoming');
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
    return Array.from(set).filter(Boolean);
  }, [sessions]);

  const facilitatorWorkload = useMemo(() => {
    const workload = {};
    sessions.forEach(s => {
      if (s.facilitatorName) {
        if (!workload[s.facilitatorName]) workload[s.facilitatorName] = { count: 0, completed: 0, attendanceSum: 0 };
        workload[s.facilitatorName].count += 1;
        if (s.status === 'Completed') {
          workload[s.facilitatorName].completed += 1;
          workload[s.facilitatorName].attendanceSum += getSessionAttendance(s).percentage;
        }
      }
    });
    return Object.entries(workload).map(([name, data]) => ({
      name,
      count: data.count,
      pct: totalSessionsCount > 0 ? (data.count / totalSessionsCount) * 100 : 0,
      avgAttendance: data.completed > 0 ? data.attendanceSum / data.completed : null
    }));
  }, [sessions, totalSessionsCount, totalLearners]);
  
  const recentActivity = useMemo(() => {
    const history = [];
    sessions.forEach(s => {
      if (s.status === 'Completed') {
        history.push({ msg: `Session "${s.title}" completed`, time: s.date || 'Recent' });
      } else if (s.status === 'Live') {
        history.push({ msg: `Session "${s.title}" is currently live`, time: 'Now' });
      } else if (s.status === 'Upcoming' || !s.status) {
        history.push({ msg: `Session "${s.title}" created`, time: s.date || 'Recent' });
      }
    });
    return history.sort((a,b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
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
      facilitatorName: sessionForm.facilitatorName.trim() || 'Unassigned',
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
    setSuccessScreen(true);
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

  const downloadCSV = (filename, rows) => {
    const csvContent = rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportAttendance = () => {
    const rows = [['Session Title', 'Date', 'Total Registered', 'Total Present', 'Attendance %']];
    completedSessions.forEach(s => {
      const stat = getSessionAttendance(s);
      rows.push([s.title, s.date || 'N/A', stat.total, stat.present, stat.percentage.toFixed(1) + '%']);
    });
    if (rows.length === 1) {
      addNotification?.('No completed sessions available to export attendance.');
      return;
    }
    downloadCSV('Attendance_Report.csv', rows);
    addNotification?.('Attendance Report downloaded.');
  };

  const exportSessionHistory = () => {
    const rows = [['Title', 'Facilitator', 'Date', 'Start Time', 'End Time', 'Status']];
    sessions.forEach(s => {
      rows.push([s.title, s.facilitatorName || 'Unassigned', s.date || 'N/A', s.startTime || 'N/A', s.endTime || 'N/A', s.status || 'Upcoming']);
    });
    downloadCSV('Session_History.csv', rows);
    addNotification?.('Session History downloaded.');
  };

  const exportFacilitatorReport = () => {
    const rows = [['Facilitator Name', 'Total Sessions Handled', 'Completed Sessions', 'Average Attendance %']];
    facilitatorWorkload.forEach(f => {
      rows.push([f.name, f.count, f.completed || 0, f.avgAttendance !== null ? f.avgAttendance.toFixed(1) + '%' : 'N/A']);
    });
    downloadCSV('Facilitator_Report.csv', rows);
    addNotification?.('Facilitator Report downloaded.');
  };

  const exportEngagementReport = () => {
    addNotification?.('Engagement Report generation is currently processing...');
    setTimeout(() => {
        downloadCSV('Engagement_Report.csv', [['Metric', 'Value'], ['Avg Join Delay', 'N/A'], ['Avg Session Duration', avgDuration || 'N/A'], ['Highest Attendance', highestAttendance !== null ? highestAttendance.toFixed(1) + '%' : 'N/A']]);
        addNotification?.('Engagement Report downloaded.');
    }, 1000);
  };

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
      
      <div style={{ position: 'sticky', top: '0', zIndex: 999, backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
          <div>Total: <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{totalSessionsCount} Sessions</span></div>
          <div style={{ color: 'rgba(255,255,255,0.1)' }}>|</div>
          <div>Attendance: <span style={{ color: '#F5C84C', fontWeight: 800 }}>{avgAttendance !== null ? `${avgAttendance.toFixed(1)}% Avg` : 'No data yet'}</span></div>
          <div>Live: <span style={{ color: '#10B981', fontWeight: 800 }}>{liveCount} Active Now</span></div>
          <div style={{ color: 'rgba(255,255,255,0.1)' }}>|</div>
          <div>Audience: <span style={{ color: '#3B82F6', fontWeight: 800 }}>{totalLearners} Active Participants</span></div>
        </div>
        
        <button 
          onClick={() => setSelectedProgId(null)}
          style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Programs
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Programs</span>
            <span>/</span>
            <span>{currentProgram.name}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>Sessions</h1>
            {liveCount > 0 && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '5px', textTransform: 'uppercase' }}>
                Live Active
              </span>
            )}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Total Sessions', value: totalSessionsCount, sub: 'All items', color: '#3B82F6' },
          { label: 'Upcoming', value: upcomingCount, sub: 'Planned classes', color: '#F5C84C' },
          { label: 'Live Now', value: liveCount, sub: 'Active sessions', color: '#10B981' },
          { label: 'Completed', value: completedCount, sub: 'Archive logs', color: '#94A3B8' },
          { label: 'Cancelled', value: cancelledCount, sub: 'Inactive logs', color: '#EF4444' },
          { label: 'Attendance Rate', value: avgAttendance !== null ? `${avgAttendance.toFixed(1)}%` : 'No data yet', sub: 'Completed Avg', color: '#8b5cf6' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Timeline</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid #1F2937', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
              {sessions.length === 0 ? (
                <div style={{ color: '#94A3B8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <Calendar size={20} color="#F5C84C" />
                  <div>
                    <h4 style={{ margin: 0, color: '#FFFFFF' }}>No sessions yet</h4>
                    <span style={{ fontSize: '0.75rem' }}>Get started by scheduling your first session.</span>
                  </div>
                  <button onClick={() => setShowScheduleModal(true)} style={{ marginLeft: 'auto', background: '#F5C84C', border: 'none', color: '#111111', fontWeight: 600, padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Schedule Session</button>
                </div>
              ) : (
                [...sessions].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 5).map((session, idx) => {
                  let badgeColor = '#94A3B8';
                  if (session.status === 'Live') badgeColor = '#10B981';
                  if (session.status === 'Upcoming' || !session.status) badgeColor = '#3B82F6';
                  
                  return (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-2.05rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: badgeColor, border: '3px solid #111111' }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>{session.date || 'TBD'} · {session.startTime || 'TBD'}</div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', margin: '0.15rem 0' }}>{session.title}</h4>
                          <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0 }}>{session.type || 'Session'} · Facilitator: <strong style={{ color: '#FFFFFF' }}>{session.facilitatorName || 'Unassigned'}</strong></p>
                          <span style={{ fontSize: '0.75rem', color: '#F5C84C', fontWeight: 600, display: 'inline-block', marginTop: '0.25rem' }}>{totalLearners} Learners Registered</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {session.status === 'Live' ? (
                            <button 
                              onClick={() => addNotification?.('Launching live virtual classroom environment...')}
                              style={{ padding: '0.45rem 1rem', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Join Session
                            </button>
                          ) : (
                            <button 
                              onClick={() => { setSelectedSession(session); setActiveTab('overview'); }}
                              style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              View Details
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              color: '#EF4444',
                              borderRadius: '8px',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                            title="Delete Session"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

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
                <option value="Cancelled">Cancelled</option>
              </select>

              <select value={facilitatorFilter} onChange={e => setFacilitatorFilter(e.target.value)} style={{ padding: '0.45rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
                <option value="All">All Facilitators</option>
                {uniqueFacilitators.map(fac => <option key={fac} value={fac}>{fac}</option>)}
              </select>
            </div>

            {viewMode === 'calendar' ? (
              (() => {
                const monthNames = [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

                const handlePrevMonth = () => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                };

                const handleNextMonth = () => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                };

                return (
                  <div style={{ backgroundColor: '#161616', border: '1px solid #1F2937', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button type="button" onClick={handlePrevMonth} style={{ background: 'transparent', border: 'none', color: '#F5C84C', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>&larr; Prev</button>
                      <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                        {monthNames[currentMonth]} {currentYear}
                      </h4>
                      <button type="button" onClick={handleNextMonth} style={{ background: 'transparent', border: 'none', color: '#F5C84C', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Next &rarr;</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', color: '#6B7280', borderBottom: '1px solid #1F2937', paddingBottom: '0.5rem' }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`blank-${i}`} style={{ height: '38px' }} />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const daySessions = sessions.filter(s => s.date === dateString);
                        const hasSessions = daySessions.length > 0;

                        return (
                          <div 
                            key={dayNum} 
                            onClick={() => {
                              if (hasSessions) {
                                setSelectedSession(daySessions[0]);
                                setActiveTab('overview');
                                addNotification?.(`Opened workspace for: ${daySessions[0].title}`);
                              } else {
                                addNotification?.(`No sessions scheduled on ${monthNames[currentMonth]} ${dayNum}, ${currentYear}`);
                              }
                            }}
                            style={{ 
                              height: '38px', borderRadius: '8px', 
                              backgroundColor: hasSessions ? 'rgba(245,200,76,0.1)' : 'rgba(255,255,255,0.02)', 
                              border: hasSessions ? '1.5px solid #F5C84C' : '1px solid #1F2937', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                              fontSize: '0.8rem', fontWeight: hasSessions ? 800 : 500,
                              color: hasSessions ? '#F5C84C' : '#94A3B8', cursor: 'pointer', position: 'relative', transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              if (!hasSessions) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'scale(1)';
                              if (!hasSessions) e.currentTarget.style.borderColor = '#1F2937';
                            }}
                          >
                            <span>{dayNum}</span>
                            {hasSessions && (
                              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#F5C84C', position: 'absolute', bottom: '3px' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
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
                    {filteredSessions.map((s, idx) => {
                      const att = getSessionAttendance(s);
                      return (
                        <tr 
                          key={s.id || idx} 
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', color: '#E2E8F0', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedSession(s);
                            setActiveTab('overview');
                          }}
                        >
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{s.title}</td>
                          <td style={{ padding: '1rem' }}>{s.facilitatorName || 'Unassigned'}</td>
                          <td style={{ padding: '1rem' }}>{s.date || 'TBD'}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{s.status === 'Completed' ? `${att.present}/${att.total}` : '-'}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{calculateDurationStr(s.startTime, s.endTime)}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{ 
                              fontSize: '0.68rem', fontWeight: 700, 
                              color: s.status === 'Completed' ? '#94A3B8' : (s.status === 'Live' ? '#10B981' : (s.status === 'Cancelled' ? '#EF4444' : '#3B82F6')),
                              backgroundColor: s.status === 'Completed' ? 'rgba(148,163,184,0.1)' : (s.status === 'Live' ? 'rgba(16,185,129,0.1)' : (s.status === 'Cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)')),
                              padding: '0.2rem 0.5rem', borderRadius: '5px' 
                            }}>
                              {s.status || 'Upcoming'}
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
                      );
                    })}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Quick Actions</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button onClick={() => setShowScheduleModal(true)} style={{ width: '100%', padding: '0.55rem', backgroundColor: '#F5C84C', border: 'none', color: '#111111', fontWeight: 700, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>+ Schedule Session</button>
              <button onClick={() => addNotification?.('Importing schedule file...')} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Import Sessions</button>
              <button onClick={() => addNotification?.('Redirecting to teams assigner...')} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Assign Facilitator</button>
              <button onClick={() => addNotification?.('Generating blank attendance log sheet...')} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Generate Attendance Sheet</button>
            </div>
          </div>

          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Attendance Overview</h4>
            
            {completedCount > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.78rem', color: '#94A3B8' }}>
                  <div>Average: <strong style={{ color: '#FFFFFF', display: 'block', fontSize: '1rem' }}>{avgAttendance !== null ? avgAttendance.toFixed(1) + '%' : 'N/A'}</strong></div>
                  <div>Highest: <strong style={{ color: '#10B981', display: 'block', fontSize: '1rem' }}>{highestAttendance !== null ? highestAttendance.toFixed(1) + '%' : 'N/A'}</strong></div>
                  <div>Lowest: <strong style={{ color: '#EF4444', display: 'block', fontSize: '1rem' }}>{lowestAttendance !== null ? lowestAttendance.toFixed(1) + '%' : 'N/A'}</strong></div>
                  <div>Avg Duration: <strong style={{ color: '#F5C84C', display: 'block', fontSize: '1rem' }}>{avgDuration || 'N/A'}</strong></div>
                </div>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '20px' }}>
                  <path d="M 0 15 Q 25 5 50 12 T 100 2" fill="none" stroke="#F5C84C" strokeWidth="1.5" />
                </svg>
              </>
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Attendance insights will appear after sessions are completed.</p>
            )}
          </div>

          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Facilitator Performance</h4>
            
            {facilitatorWorkload.length > 0 ? facilitatorWorkload.map((wk, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{wk.name}</span>
                  <span>{wk.count} Sessions {wk.avgAttendance !== null && `(${wk.avgAttendance.toFixed(0)}% Att.)`}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${wk.pct}%`, backgroundColor: '#F5C84C' }} />
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>No facilitator performance data available.</p>
            )}
          </div>

          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h4>
            
            {recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem', color: '#94A3B8' }}>
                {recentActivity.map((act, i) => (
                  <div key={i}><strong style={{ color: '#FFFFFF' }}>{act.msg}</strong> <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>{act.time}</span></div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>No recent activity to show.</p>
            )}
          </div>

          <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#F5C84C" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>OYEN AI Insights</h4>
            </div>
            
            {completedCount >= 3 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}><span style={{ color: '#F5C84C' }}>•</span> Attendance is tracking well overall at {avgAttendance?.toFixed(0)}%.</div>
                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245,200,76,0.05)', border: '1px solid rgba(245,200,76,0.15)', borderRadius: '6px', color: '#F5C84C', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  Recommendation: Review engagement strategies for upcoming sessions.
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>AI insights will become available after more session activity.</p>
            )}
          </div>

        </div>

      </div>

      <div style={{ backgroundColor: '#111111', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Reports Generator</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <button 
            onClick={exportAttendance}
            style={{ padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Export Attendance
          </button>
          <button 
            onClick={exportSessionHistory}
            style={{ padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Export Session History
          </button>
          <button 
            onClick={exportFacilitatorReport}
            style={{ padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Export Facilitator Report
          </button>
          <button 
            onClick={exportEngagementReport}
            style={{ padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Export Engagement Report
          </button>
        </div>
      </div>

      {showScheduleModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111111', border: '1px solid #1F1F1F', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
            
            {successScreen ? (
              <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <CheckCircle size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>✓ Session Scheduled Successfully</h2>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '2rem' }}>{sessionForm.title} • {sessionForm.date} at {sessionForm.startTime}</p>
                
                <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94A3B8' }}>Participants:</span>
                    <span style={{ fontWeight: 600 }}>All Registered</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94A3B8' }}>Facilitator:</span>
                    <span style={{ fontWeight: 600 }}>{sessionForm.facilitatorName || 'Unassigned'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => { setShowScheduleModal(false); setSuccessScreen(false); setSessionForm({ title: '', type: 'Live Session', date: '', startTime: '', endTime: '', description: '', facilitatorName: '', facilitatorEmail: '', enableOyenLive: true, externalMeetingLink: '', location: 'Virtual' }); }} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5C542', color: '#0A0A0A', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
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
                  <button onClick={() => setShowScheduleModal(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                  <div style={{ flex: 2, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#F5C542' }}>1. Session Info</h3>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Title</label>
                        <input type="text" value={sessionForm.title} onChange={e => setSessionForm({...sessionForm, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} placeholder="Session Title" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Description</label>
                        <textarea value={sessionForm.description} onChange={e => setSessionForm({...sessionForm, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', minHeight: '80px' }} placeholder="What is this session about?" />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Type</label>
                          <select value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }}>
                            <option value="Live Session">Live Session</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Workshop">Workshop</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Programme</label>
                          <input disabled value={currentProgram?.name || 'Default'} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#6B7280', fontSize: '0.85rem', outline: 'none' }} />
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
                          <input type="date" value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Start Time</label>
                          <input type="time" value={sessionForm.startTime} onChange={e => setSessionForm({...sessionForm, startTime: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>End Time</label>
                          <input type="time" value={sessionForm.endTime} onChange={e => setSessionForm({...sessionForm, endTime: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
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
                          <input type="text" value={sessionForm.facilitatorName} onChange={e => setSessionForm({...sessionForm, facilitatorName: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} placeholder="Facilitator Name" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Email</label>
                          <input type="email" value={sessionForm.facilitatorEmail} onChange={e => setSessionForm({...sessionForm, facilitatorEmail: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} placeholder="Email" />
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
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{currentProgram?.name || 'Default'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Type</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{sessionForm.type || 'Live Training'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Date & Duration</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{sessionForm.date || 'TBD'} • {sessionForm.startTime && sessionForm.endTime ? calculateDurationStr(sessionForm.startTime, sessionForm.endTime) : '0h 0m'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Facilitator</span>
                        <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 500, marginTop: '0.2rem' }}>{sessionForm.facilitatorName || 'Unassigned'}</div>
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
                    <button onClick={() => setShowScheduleModal(false)} style={{ padding: '0.75rem 1.25rem', backgroundColor: 'transparent', border: 'none', color: '#94A3B8', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ padding: '0.75rem 1.25rem', backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', color: '#FFF', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Preview</button>
                    <button onClick={handleScheduleSubmit} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5C542', border: 'none', color: '#0A0A0A', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Schedule Session</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
