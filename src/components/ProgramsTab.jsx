import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Plus, Play, X, ArrowRight, MoreVertical, Edit2, Trash2, 
  Search, Calendar, FolderOpen, ChevronDown, Users, Layers, Award, Clock
} from 'lucide-react';
import ProgramDetail from './ProgramDetail';

export default function ProgramsTab({ 
  programs = [], 
  setPrograms, 
  learners = [], 
  setLearners, 
  teamMembers = [], 
  addNotification, 
  userRole 
}) {
  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [newProgName, setNewProgName]           = useState('');
  const [newProgDesc, setNewProgDesc]           = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Active' | 'Completed' | 'Archived'
  const [activeSort, setActiveSort] = useState('Newest'); // 'Newest' | 'Oldest' | 'Recently Updated' | 'Alphabetical'
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Card actions dropdown state
  const [activeMenuProgramId, setActiveMenuProgramId] = useState(null);
  const [renameProgramId, setRenameProgramId]         = useState(null);
  const [renameName, setRenameName]                   = useState('');
  const [deleteProgramId, setDeleteProgramId]         = useState(null);

  // local feedback toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProgName.trim()) return;
    const cleanName = newProgName.trim();
    setPrograms(prev => [
      {
        id:          Date.now(),
        name:        cleanName,
        desc:      newProgDesc.trim() || 'No description provided.',
        status:      'Active',
        sessions:    [],
        resources:   [],
        assessments: [],
        activity:    [],
        assignedFacilitators: [],
        updatedAt:   'Just now'
      },
      ...prev
    ]);
    addNotification?.(`New program "${cleanName}" created`);
    showToast(`Program "${cleanName}" created successfully`);
    setNewProgName('');
    setNewProgDesc('');
    setShowCreateModal(false);
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (!renameName.trim()) return;
    const oldProg = programs.find(p => p.id === renameProgramId);
    if (oldProg) {
      const cleanNewName = renameName.trim();
      setPrograms(prev => prev.map(p => p.id === renameProgramId ? { ...p, name: cleanNewName, updatedAt: 'Just now' } : p));
      setLearners(prev => prev.map(l => l.program === oldProg.name ? { ...l, program: cleanNewName } : l));
      addNotification?.(`Program "${oldProg.name}" renamed to "${cleanNewName}"`);
      showToast(`Renamed to "${cleanNewName}"`);
    }
    setRenameProgramId(null);
    setRenameName('');
  };

  const handleDeleteConfirm = () => {
    const progToDelete = programs.find(p => p.id === deleteProgramId);
    if (progToDelete) {
      setPrograms(prev => prev.filter(p => p.id !== deleteProgramId));
      setLearners(prev => prev.filter(l => l.program !== progToDelete.name));
      addNotification?.(`Program "${progToDelete.name}" deleted permanently`);
      showToast(`Program deleted`);
    }
    setDeleteProgramId(null);
  };

  const handleDuplicate = (p) => {
    const newName = `${p.name} - Copy`;
    setPrograms(prev => [
      {
        ...p,
        id: Date.now(),
        name: newName,
        updatedAt: 'Just now'
      },
      ...prev
    ]);
    addNotification?.(`Program "${p.name}" duplicated`);
    showToast(`Duplicated program`);
  };

  const handleToggleArchive = (p) => {
    const newStatus = p.status === 'Archived' ? 'Active' : 'Archived';
    setPrograms(prev => prev.map(item => item.id === p.id ? { ...item, status: newStatus, updatedAt: 'Just now' } : item));
    addNotification?.(`Program "${p.name}" status updated to ${newStatus}`);
    showToast(`Program status set to ${newStatus}`);
  };

  /* Live counts & derivations */
  const getLearnerCount = (progName) =>
    learners.filter(l => l.program === progName).length;

  const getSessionsTodayCount = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayStrAlt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return programs.reduce((total, p) => {
      const todaySessions = (p.sessions || []).filter(s => {
        if (!s.date) return false;
        const d = s.date.trim();
        return d === todayStr || d === todayStrAlt || d.toLowerCase() === 'today';
      });
      return total + todaySessions.length;
    }, 0);
  };

  const getNextSessionText = (p) => {
    if (!p.sessions || p.sessions.length === 0) return 'No upcoming session';
    const upcoming = p.sessions.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled');
    if (upcoming.length === 0) return 'No upcoming session';
    const next = upcoming[0];
    return `${next.date} • ${next.time || next.startTime || 'TBD'}`;
  };

  const getLastUpdatedText = (p) => {
    if (p.updatedAt) return p.updatedAt;
    const diffMin = Math.floor((Date.now() - (p.id || Date.now())) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} mins ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hours ago`;
    return `${Math.floor(diffHr / 24)} days ago`;
  };

  const getLastActivityText = (p) => {
    if (!p.id) return 'Never';
    const diffMin = Math.floor((Date.now() - (p.id || Date.now())) / 60000) % 60;
    if (diffMin < 5) return '5 mins ago';
    if (diffMin < 60) return `${diffMin} mins ago`;
    return 'Yesterday';
  };

  // Pipeline filter / sort
  const filteredAndSortedPrograms = useMemo(() => {
    let result = [...programs];
    if (activeFilter !== 'All') {
      result = result.filter(p => p.status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q));
    }
    if (activeSort === 'Newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (activeSort === 'Oldest') {
      result.sort((a, b) => a.id - b.id);
    } else if (activeSort === 'Alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'Recently Updated') {
      result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [programs, activeFilter, searchQuery, activeSort]);

  // Paginated display
  const totalItems = filteredAndSortedPrograms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPrograms = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPrograms.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedPrograms, currentPage]);

  const selectedProgram = programs.find(p => p.id === selectedProgramId);
  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        setPrograms={setPrograms}
        programLearners={learners.filter(l => l.program === selectedProgram.name)}
        setLearners={setLearners}
        teamMembers={teamMembers}
        userRole={userRole}
        onBack={() => setSelectedProgramId(null)}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ 
      padding: '2.5rem 3rem', 
      backgroundColor: '#F8F5EF', 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem', 
      textAlign: 'left',
      color: '#151515'
    }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          backgroundColor: '#FFFFFF', border: '1px solid #D4A017',
          color: '#151515', padding: '0.8rem 1.25rem', borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)', zIndex: 2000,
          fontSize: '13px', fontWeight: 600
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Programs</h1>
          <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.4rem' }}>
            Manage every training program from one centralized workspace.
          </p>
        </div>
        {userRole === 'Admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#D4A017',
              border: 'none', color: '#151515', fontWeight: 700,
              fontSize: '13px', borderRadius: '8px',
              padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center',
              gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(212, 160, 23, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} /> Create Program
          </button>
        )}
      </div>

      {/* StatisticsSummary Panel */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1.25rem'
      }}>
        {[
          { value: programs.length, label: 'Programs', sub: '+3 created this month', icon: <BookOpen size={20} color="#D4A017" /> },
          { value: programs.filter(p => p.status === 'Active').length, label: 'Active Programs', sub: 'All systems operational', icon: <Layers size={20} color="#D4A017" /> },
          { value: learners.length, label: 'Learners', sub: '+12 active today', icon: <Users size={20} color="#D4A017" /> },
          { value: getSessionsTodayCount(), label: 'Sessions Today', sub: 'Interactive live syncs', icon: <Calendar size={20} color="#D4A017" /> }
        ].map((card, idx) => (
          <div 
            key={idx}
            style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E8E2D8', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem',
              boxShadow: '0 2px 10px rgba(100,90,75,0.04)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 90, 75, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(100,90,75,0.04)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6B7280' }}>{card.label}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(212, 160, 23, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#151515' }}>{card.value}</div>
            <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E8E2D8', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '380px', position: 'relative' }}>
          <Search size={16} color="#6B7280" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search programs..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ 
              width: '100%', 
              padding: '0.6rem 0.75rem 0.6rem 2.4rem', 
              fontSize: '13px', 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E8E2D8', 
              borderRadius: '10px', 
              color: '#151515', 
              outline: 'none', 
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#D4A017'}
            onBlur={e => e.currentTarget.style.borderColor = '#E8E2D8'}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Active', 'Completed', 'Archived'].map(f => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? '#D4A017' : '#E8E2D8',
                    backgroundColor: isActive ? '#D4A017' : '#FFFFFF',
                    color: isActive ? '#151515' : '#6B7280',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.45rem 0.9rem', borderRadius: '8px',
                border: '1px solid #E8E2D8', backgroundColor: '#FFFFFF',
                color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sort: {activeSort} <ChevronDown size={14} />
            </button>
            {showSortDropdown && (
              <>
                <div onClick={() => setShowSortDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                <div style={{
                  position: 'absolute', right: 0, marginTop: '0.35rem',
                  backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8',
                  borderRadius: '10px', width: '160px', zIndex: 100, overflow: 'hidden',
                  boxShadow: '0 6px 16px rgba(100, 90, 75, 0.08)'
                }}>
                  {['Newest', 'Oldest', 'Recently Updated', 'Alphabetical'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setActiveSort(opt); setShowSortDropdown(false); }}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left',
                        background: 'none', border: 'none', color: activeSort === opt ? '#D4A017' : '#6B7280',
                        fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F2ED'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content Layout */}
      {paginatedPrograms.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {paginatedPrograms.map((p) => {
              const statusConfig = {
                'Active':    { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
                'Completed': { color: '#D4A017', bg: 'rgba(212,160,23,0.08)' },
                'Archived':  { color: '#6B7280', bg: 'rgba(168,175,185,0.08)' },
                'Cancelled': { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' }
              };
              const currentStatus = statusConfig[p.status] || statusConfig['Active'];

              return (
                <div 
                  key={p.id}
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E8E2D8', 
                    borderRadius: '16px', 
                    padding: '1.5rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1.25rem', 
                    transition: 'all 0.2s ease', 
                    position: 'relative',
                    boxShadow: '0 2px 10px rgba(100,90,75,0.02)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 90, 75, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(100,90,75,0.02)';
                  }}
                >
                  {/* Actions Menu */}
                  {userRole === 'Admin' && (
                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuProgramId(activeMenuProgramId === p.id ? null : p.id);
                        }}
                        style={{ 
                          background: 'none', border: 'none', color: '#6B7280', 
                          cursor: 'pointer', padding: '0.2rem', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center' 
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuProgramId === p.id && (
                        <>
                          <div onClick={() => setActiveMenuProgramId(null)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                          <div style={{
                            position: 'absolute', right: 0, marginTop: '0.35rem',
                            backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8',
                            borderRadius: '10px', boxShadow: '0 6px 16px rgba(100, 90, 75, 0.08)',
                            width: '160px', zIndex: 100, overflow: 'hidden'
                          }}>
                            <button onClick={() => { setActiveMenuProgramId(null); setSelectedProgramId(p.id); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#151515', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Play size={13} fill="#151515" /> Open Program</button>
                            <button onClick={() => { setActiveMenuProgramId(null); setRenameProgramId(p.id); setRenameName(p.name); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#151515', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Edit2 size={13} /> Edit Program</button>
                            <button onClick={() => { setActiveMenuProgramId(null); handleDuplicate(p); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#151515', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Layers size={13} /> Duplicate</button>
                            <button onClick={() => { setActiveMenuProgramId(null); handleToggleArchive(p); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#151515', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Clock size={13} /> {p.status === 'Archived' ? 'Restore' : 'Archive'}</button>
                            <button onClick={() => { setActiveMenuProgramId(null); setSelectedProgramId(p.id); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#151515', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Users size={13} /> Manage Team</button>
                            <button onClick={() => { setActiveMenuProgramId(null); setSelectedProgramId(p.id); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#151515', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Award size={13} /> View Reports</button>
                            <button onClick={() => { setActiveMenuProgramId(null); setDeleteProgramId(p.id); }} style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Trash2 size={13} /> Delete Program</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '2rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, flex: 1, fontFamily: "'Inter', sans-serif" }}>{p.name}</h4>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: 'flex' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      color: currentStatus.color, 
                      backgroundColor: currentStatus.bg, 
                      padding: '0.2rem 0.45rem', 
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {p.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ 
                    fontSize: '0.82rem', 
                    color: '#6B7280', 
                    margin: 0, 
                    lineHeight: '1.45', 
                    height: '36px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical' 
                  }}>
                    {p.desc}
                  </p>

                  {/* Metrics row */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '4px', 
                    fontSize: '0.8rem', 
                    borderTop: '1px solid #E8E2D8', 
                    borderBottom: '1px solid #E8E2D8', 
                    padding: '0.75rem 0',
                    color: '#6B7280',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ color: '#151515', fontWeight: 700 }}>{getLearnerCount(p.name)}</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Learners</div>
                    </div>
                    <div>
                      <div style={{ color: '#151515', fontWeight: 700 }}>{p.assignedFacilitators?.length || 2}</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Facilitators</div>
                    </div>
                    <div>
                      <div style={{ color: '#151515', fontWeight: 700 }}>{(p.sessions || []).length}</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Sessions</div>
                    </div>
                    <div>
                      <div style={{ color: '#151515', fontWeight: 700 }}>{(p.resources || []).length}</div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Resources</div>
                    </div>
                  </div>

                  {/* Next Session & Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#6B7280' }}>Next Session</span>
                      <span style={{ color: '#D4A017', fontWeight: 600 }}>{getNextSessionText(p)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#6B7280' }}>Last Activity</span>
                      <span style={{ color: '#6B7280' }}>{getLastActivityText(p)}</span>
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <button
                    onClick={() => setSelectedProgramId(p.id)}
                    style={{
                      marginTop: '0.25rem', width: '100%', padding: '0.65rem',
                      background: '#FFFFFF', border: '1px solid #E8E2D8',
                      borderRadius: '8px', color: '#D4A017', fontWeight: 700,
                      fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F2ED'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                  >
                    Open Program <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar Checklist Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(100,90,75,0.02)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif" }}>Getting Started</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { label: 'Create your first program.', done: programs.length > 0 },
                  { label: 'Add facilitators.', done: teamMembers.length > 0 },
                  { label: 'Invite learners.', done: learners.length > 0 },
                  { label: 'Schedule sessions.', done: getSessionsTodayCount() > 0 },
                  { label: 'Start tracking progress.', done: false }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: item.done ? 'rgba(22,163,74,0.12)' : 'rgba(212,160,23,0.12)', border: item.done ? '1.5px solid #16a34a' : '1.5px solid #D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.done ? <Check size={9} strokeWidth={3} color="#16a34a" /> : <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#D4A017', display: 'inline-block' }}></span>}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: item.done ? '#6B7280' : '#151515', textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress status */}
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid #E8E2D8', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6B7280' }}>Progress Status</span>
                  <span style={{ fontWeight: 600, color: '#D4A017' }}>
                    {(() => {
                      const done = [programs.length > 0, teamMembers.length > 0, learners.length > 0, getSessionsTodayCount() > 0, false].filter(Boolean).length;
                      return `${done} / 5 Completed`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Empty State */}
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px dashed #E6E0D5',
            borderRadius: '18px', padding: '4rem 2rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
            maxWidth: '500px', margin: '2rem auto', boxShadow: '0 2px 10px rgba(100,90,75,0.02)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212, 160, 23, 0.05)', border: '1px solid rgba(212, 160, 23, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4A017' }}>
              <FolderOpen size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                No Programs Yet
              </h4>
              <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Create your first program to organize learners, facilitators, sessions, assessments, and reporting.
              </p>
            </div>
            {userRole === 'Admin' && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: '#D4A017',
                  border: 'none', color: '#151515', fontWeight: 700,
                  fontSize: '13px', borderRadius: '8px',
                  padding: '0.65rem 1.5rem', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(212, 160, 23, 0.2)',
                  marginTop: '0.5rem'
                }}
              >
                Create First Program
              </button>
            )}
            <a href="#learn-more" style={{ color: '#D4A017', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Learn how programs work <ArrowRight size={13} />
            </a>
          </div>

          {/* What You'll Be Able To Manage */}
          <div style={{ borderTop: '1px solid #E8E2D8', paddingTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>What You'll Be Able To Manage</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              {[
                { title: '📅 Sessions', desc: 'Schedule live and virtual sessions.' },
                { title: '👥 Learners', desc: 'Manage enrolment and participation.' },
                { title: '📊 Analytics', desc: 'Track engagement and completion.' },
                { title: '📜 Certificates', desc: 'Issue certificates automatically.' }
              ].map((feature, idx) => (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '14px', padding: '1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.45rem', boxShadow: '0 2px 10px rgba(100,90,75,0.02)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151515' }}>{feature.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: '1.4' }}>{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #E8E2D8',
              backgroundColor: '#FFFFFF', color: currentPage === 1 ? '#6B7280' : '#151515',
              fontSize: '13px', fontWeight: 600, cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #E8E2D8',
              backgroundColor: '#FFFFFF', color: currentPage === totalPages ? '#6B7280' : '#151515',
              fontSize: '13px', fontWeight: 600, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}


      {/* Creation Modal (Warm Milk Surface) */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)', zIndex: 1300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#F5F2EB', border: '1px solid #E7E1D7',
              borderRadius: '18px', padding: '2.5rem', width: '100%', maxWidth: '480px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              color: '#1E2A3B', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', borderBottom: '1px solid #E7E1D7', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1E2A3B', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create Training Program</h3>
                <p style={{ fontSize: '13px', color: '#5D6470', marginTop: '0.25rem' }}>Add a new program template slot to your workspace.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: '#FFFFFF', border: '1px solid #E7E1D7', color: '#5D6470', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E7E1D7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5D6470', marginBottom: '0.4rem' }}>Program Name</label>
                  <input
                    required autoFocus type="text"
                    placeholder="e.g. Leadership Development Program"
                    value={newProgName}
                    onChange={e => setNewProgName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 0.9rem', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid #E7E1D7', borderRadius: '10px', color: '#1E2A3B', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5D6470', marginBottom: '0.4rem' }}>Description</label>
                  <textarea
                    placeholder="Summarize program goals, curriculum, or tracks..."
                    value={newProgDesc}
                    onChange={e => setNewProgDesc(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '0.75rem 0.9rem', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid #E7E1D7', borderRadius: '10px', color: '#1E2A3B', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #DDD6CA', color: '#1E2A3B', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', background: '#C89A2B', border: 'none', color: '#FFFFFF', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D7A93A'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C89A2B'}
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Modal (Warm Milk Surface) */}
      {renameProgramId !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#F5F2EB', border: '1px solid #E7E1D7', borderRadius: '18px', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', color: '#1E2A3B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', borderBottom: '1px solid #E7E1D7', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1E2A3B', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Edit Program Name</h3>
              <button onClick={() => setRenameProgramId(null)} style={{ background: '#FFFFFF', border: '1px solid #E7E1D7', color: '#5D6470', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E7E1D7' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5D6470', marginBottom: '0.4rem' }}>Program Name</label>
                <input
                  required autoFocus type="text"
                  value={renameName}
                  onChange={e => setRenameName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid #E7E1D7', borderRadius: '10px', color: '#1E2A3B', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setRenameProgramId(null)} style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #DDD6CA', color: '#1E2A3B', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', background: '#C89A2B', border: 'none', color: '#FFFFFF', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D7A93A'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C89A2B'}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Warm Milk Surface) */}
      {deleteProgramId !== null && (() => {
        const prog = programs.find(p => p.id === deleteProgramId);
        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: '#F5F2EB', border: '1px solid #EF4444', borderRadius: '18px', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', color: '#1E2A3B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #E7E1D7', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Delete Program</h3>
                <button onClick={() => setDeleteProgramId(null)} style={{ background: '#FFFFFF', border: '1px solid #E7E1D7', color: '#5D6470', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: '#1E2A3B', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete <strong style={{ color: '#C89A2B' }}>{prog?.name}</strong>?
                </p>
                <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid #E7E1D7', borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '13px', color: '#EF4444', lineHeight: '1.5' }}>
                  <strong>Warning:</strong> This will permanently delete the program and remove all program-related data, including all sessions, resources, assessments, and any assigned learners. This action cannot be undone.
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setDeleteProgramId(null)} style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #DDD6CA', color: '#1E2A3B', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    style={{ flex: 1, padding: '0.75rem', background: '#EF4444', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                  >
                    Delete Program
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
