import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Plus, Play, X, ArrowRight, MoreVertical, Edit2, Trash2, 
  Search, Calendar, FolderOpen, ChevronDown, Users, Layers, Award, Clock
} from 'lucide-react';
import ProgramDetail from './ProgramDetail';

const PROGRAM_LIMIT = 12; // Increased limit for enterprise-scale feel

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

  // Search & Filter Toolbar state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Active' | 'Completed' | 'Archived'
  const [activeSort, setActiveSort] = useState('Newest'); // 'Newest' | 'Oldest' | 'Recently Updated' | 'Alphabetical'
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Card action menu / modals state
  const [activeMenuProgramId, setActiveMenuProgramId] = useState(null);
  const [renameProgramId, setRenameProgramId]         = useState(null);
  const [renameName, setRenameName]                   = useState('');
  const [deleteProgramId, setDeleteProgramId]         = useState(null);

  // Local feedback toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProgName.trim()) return;
    if (programs.length >= PROGRAM_LIMIT) {
      showToast('Program limit reached for standard workspace.');
      return;
    }
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

  // Filter & Search & Sort Pipeline
  const filteredAndSortedPrograms = useMemo(() => {
    let result = [...programs];

    // Filter by Status
    if (activeFilter !== 'All') {
      result = result.filter(p => p.status === activeFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q));
    }

    // Sorting
    if (activeSort === 'Newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (activeSort === 'Oldest') {
      result.sort((a, b) => a.id - b.id);
    } else if (activeSort === 'Alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'Recently Updated') {
      // Just keep default custom sort or simulation
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
      padding: '3rem', 
      backgroundColor: '#0B0B0F', 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2.5rem', 
      textAlign: 'left',
      color: '#F8F6F1'
    }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          backgroundColor: '#15161B', border: '1px solid #D4AF37',
          color: '#F8F6F1', padding: '0.8rem 1.25rem', borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 2000,
          fontSize: '13px', fontWeight: 600, animation: 'slideIn 0.2s ease'
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#F8F6F1', margin: 0, fontFamily: "'Outfit', sans-serif" }}>My Programs</h2>
          <p style={{ color: '#B6B1A7', fontSize: '15px', marginTop: '0.4rem' }}>
            Manage all training programs from one centralized workspace.
          </p>
        </div>
        {userRole === 'Admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
              border: 'none', color: '#000', fontWeight: 700,
              fontSize: '13px', borderRadius: '12px',
              padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center',
              gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={16} /> Create Program
          </button>
        )}
      </div>

      {/* Workspace Summary Panel */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '2rem'
      }}>
        <div style={{ backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '10px', color: '#D4AF37' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F8F6F1' }}>{programs.length}</div>
            <div style={{ fontSize: '13px', color: '#7A7A82', fontWeight: 600 }}>Programs</div>
          </div>
        </div>
        <div style={{ backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(22,163,74,0.08)', borderRadius: '10px', color: '#16A34A' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F8F6F1' }}>{programs.filter(p => p.status === 'Active').length}</div>
            <div style={{ fontSize: '13px', color: '#7A7A82', fontWeight: 600 }}>Active</div>
          </div>
        </div>
        <div style={{ backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(59,130,246,0.08)', borderRadius: '10px', color: '#3B82F6' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F8F6F1' }}>{learners.length}</div>
            <div style={{ fontSize: '13px', color: '#7A7A82', fontWeight: 600 }}>Learners</div>
          </div>
        </div>
        <div style={{ backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: '10px', color: '#F59E0B' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F8F6F1' }}>{getSessionsTodayCount()}</div>
            <div style={{ fontSize: '13px', color: '#7A7A82', fontWeight: 600 }}>Sessions Today</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '380px', position: 'relative' }}>
          <Search size={16} color="#7A7A82" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search programs..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ 
              width: '100%', 
              padding: '0.6rem 0.75rem 0.6rem 2.4rem', 
              fontSize: '13px', 
              backgroundColor: '#15161B', 
              border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '10px', 
              color: '#F8F6F1', 
              outline: 'none', 
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#3B82F6'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Quick Filter Chips */}
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
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: isActive ? 'rgba(212,175,55,0.1)' : '#15161B',
                    color: isActive ? '#D4AF37' : '#B6B1A7',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#1B1D23'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#15161B'; }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.45rem 0.9rem', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#15161B',
                color: '#B6B1A7', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Sort: {activeSort} <ChevronDown size={14} />
            </button>
            {showSortDropdown && (
              <>
                <div onClick={() => setShowSortDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                <div style={{
                  position: 'absolute', right: 0, marginTop: '0.35rem',
                  backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', width: '160px', zIndex: 100, overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}>
                  {['Newest', 'Oldest', 'Recently Updated', 'Alphabetical'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setActiveSort(opt); setShowSortDropdown(false); }}
                      style={{
                        width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left',
                        background: 'none', border: 'none', color: activeSort === opt ? '#D4AF37' : '#B6B1A7',
                        fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                      }}
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

      {/* Main Grid Content */}
      {paginatedPrograms.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '24px'
        }}>
          {paginatedPrograms.map((p) => {
            const statusConfig = {
              'Active':    { icon: '🟢', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
              'Completed': { icon: '🔵', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
              'Archived':  { icon: '⚪', color: '#B6B1A7', bg: 'rgba(182,177,167,0.08)' },
              'Cancelled': { icon: '🔴', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' }
            };
            const currentStatus = statusConfig[p.status] || statusConfig['Active'];

            return (
              <div 
                key={p.id}
                style={{ 
                  backgroundColor: '#15161B', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '18px', 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem', 
                  transition: 'all 0.2s ease', 
                  position: 'relative',
                  maxWidth: '420px', // Operational design restriction
                  boxSizing: 'border-box'
                }}
                className="program-card"
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Actions Menu */}
                {userRole === 'Admin' && (
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuProgramId(activeMenuProgramId === p.id ? null : p.id);
                      }}
                      style={{ 
                        background: 'none', border: 'none', color: '#7A7A82', 
                        cursor: 'pointer', padding: '0.2rem', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center' 
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuProgramId === p.id && (
                      <>
                        <div
                          onClick={() => setActiveMenuProgramId(null)}
                          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                        />
                        <div style={{
                          position: 'absolute', right: 0, marginTop: '0.35rem',
                          backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          width: '160px', zIndex: 100, overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setSelectedProgramId(p.id);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#F8F6F1', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Play size={13} fill="#F8F6F1" /> Open Program
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setRenameProgramId(p.id);
                              setRenameName(p.name);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#F8F6F1', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Edit2 size={13} /> Edit Program
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              handleDuplicate(p);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#F8F6F1', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Layers size={13} /> Duplicate
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              handleToggleArchive(p);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#F8F6F1', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Clock size={13} /> {p.status === 'Archived' ? 'Restore' : 'Archive'}
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setSelectedProgramId(p.id);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#F8F6F1', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Users size={13} /> Manage Team
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setSelectedProgramId(p.id);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#F8F6F1', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Award size={13} /> View Reports
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setDeleteProgramId(p.id);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Trash2 size={13} /> Delete Program
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Card Title & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '2rem' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#F8F6F1', margin: 0, flex: 1, paddingRight: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>{p.name}</h4>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    color: currentStatus.color, 
                    backgroundColor: currentStatus.bg, 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '6px', 
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{currentStatus.icon}</span> <span>{p.status}</span>
                  </span>
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: '13px', 
                  color: '#B6B1A7', 
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
                  gap: '8px', 
                  fontSize: '13px', 
                  borderTop: '1px solid rgba(255,255,255,0.06)', 
                  borderBottom: '1px solid rgba(255,255,255,0.06)', 
                  padding: '0.75rem 0',
                  color: '#B6B1A7',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ color: '#F8F6F1', fontWeight: 700 }}>{getLearnerCount(p.name)}</div>
                    <div style={{ fontSize: '11px', color: '#7A7A82' }}>Learners</div>
                  </div>
                  <div>
                    <div style={{ color: '#F8F6F1', fontWeight: 700 }}>{p.assignedFacilitators?.length || 2}</div>
                    <div style={{ fontSize: '11px', color: '#7A7A82' }}>Facs</div>
                  </div>
                  <div>
                    <div style={{ color: '#F8F6F1', fontWeight: 700 }}>{(p.sessions || []).length}</div>
                    <div style={{ fontSize: '11px', color: '#7A7A82' }}>Sessions</div>
                  </div>
                  <div>
                    <div style={{ color: '#F8F6F1', fontWeight: 700 }}>{(p.resources || []).length}</div>
                    <div style={{ fontSize: '11px', color: '#7A7A82' }}>Resources</div>
                  </div>
                </div>

                {/* Next Session & Last Updated */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#7A7A82' }}>Next Session</span>
                    <span style={{ color: '#D4AF37', fontWeight: 600 }}>{getNextSessionText(p)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#7A7A82' }}>Last Activity</span>
                    <span style={{ color: '#B6B1A7' }}>{getLastActivityText(p)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#7A7A82' }}>Updated</span>
                    <span style={{ color: '#B6B1A7' }}>{getLastUpdatedText(p)}</span>
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  onClick={() => setSelectedProgramId(p.id)}
                  style={{
                    marginTop: '0.5rem', width: '100%', padding: '0.65rem',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', color: '#D4AF37', fontWeight: 700,
                    fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {userRole === 'Viewer' ? 'View Program' : 'Open Program'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#15161B', border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '18px', padding: '4rem 2rem', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          maxWidth: '500px', margin: '2rem auto'
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
            <FolderOpen size={26} />
          </div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#F8F6F1', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              No Programs Yet
            </h4>
            <p style={{ color: '#B6B1A7', fontSize: '13px', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Create your first program to organize learners, facilitators, sessions, resources, and assessments.
            </p>
          </div>
          {userRole === 'Admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                border: 'none', color: '#000', fontWeight: 700,
                fontSize: '13px', borderRadius: '12px',
                padding: '0.65rem 1.5rem', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                marginTop: '0.5rem'
              }}
            >
              Create Program
            </button>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: '#15161B', color: currentPage === 1 ? '#7A7A82' : '#B6B1A7',
              fontSize: '13px', fontWeight: 600, cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ fontSize: '13px', color: '#7A7A82' }}>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: '#15161B', color: currentPage === totalPages ? '#7A7A82' : '#B6B1A7',
              fontSize: '13px', fontWeight: 600, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Creation Modal */}
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
              backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px', padding: '2rem', width: '100%', maxWidth: '460px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#F8F6F1', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create Training Program</h3>
                <p style={{ fontSize: '13px', color: '#7A7A82', marginTop: '0.25rem' }}>Add a new program to your workspace directory.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#B6B1A7', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#7A7A82', marginBottom: '0.4rem' }}>Program Name</label>
                <input
                  required autoFocus type="text"
                  placeholder="e.g. Leadership Development Program"
                  value={newProgName}
                  onChange={e => setNewProgName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', fontSize: '13px', backgroundColor: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F8F6F1', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#7A7A82', marginBottom: '0.4rem' }}>Description</label>
                <textarea
                  placeholder="Summarize program goals, curriculum, or tracks..."
                  value={newProgDesc}
                  onChange={e => setNewProgDesc(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', fontSize: '13px', backgroundColor: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F8F6F1', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#B6B1A7', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', border: 'none', color: '#000', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameProgramId !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#15161B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#F8F6F1', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Edit Program Name</h3>
              <button onClick={() => setRenameProgramId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#B6B1A7', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#7A7A82', marginBottom: '0.4rem' }}>Program Name</label>
                <input
                  required autoFocus type="text"
                  value={renameName}
                  onChange={e => setRenameName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', fontSize: '13px', backgroundColor: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F8F6F1', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setRenameProgramId(null)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#B6B1A7', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', border: 'none', color: '#000', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProgramId !== null && (() => {
        const prog = programs.find(p => p.id === deleteProgramId);
        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: '#15161B', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '18px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Delete Program</h3>
                <button onClick={() => setDeleteProgramId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#B6B1A7', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: '#F8F6F1', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete <strong style={{ color: '#D4AF37' }}>{prog?.name}</strong>?
                </p>
                <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '13px', color: '#fca5a5', lineHeight: '1.5' }}>
                  <strong>Warning:</strong> This will permanently delete the program and remove all program-related data, including all sessions, resources, assessments, and any assigned learners. This action cannot be undone.
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setDeleteProgramId(null)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#B6B1A7', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    style={{ flex: 1, padding: '0.75rem', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
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
