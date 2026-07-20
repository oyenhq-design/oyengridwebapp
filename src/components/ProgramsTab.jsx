import React, { useState } from 'react';
import { BookOpen, Users, HardDrive, Plus, Play, X, ArrowRight, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import ProgramDetail from './ProgramDetail';

const PROGRAM_LIMIT = 3;

export default function ProgramsTab({ programs, setPrograms, learners = [], setLearners, addNotification }) {
  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [newProgName, setNewProgName]           = useState('');
  const [newProgDesc, setNewProgDesc]           = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  // Card action menu / modals state
  const [activeMenuProgramId, setActiveMenuProgramId] = useState(null);
  const [renameProgramId, setRenameProgramId]         = useState(null);
  const [renameName, setRenameName]                   = useState('');
  const [deleteProgramId, setDeleteProgramId]         = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProgName.trim() || programs.length >= PROGRAM_LIMIT) return;
    const cleanName = newProgName.trim();
    setPrograms(prev => [
      ...prev,
      {
        id:          Date.now(),
        name:        cleanName,
        desc:      newProgDesc.trim() || 'No description provided.',
        status:      'Active',
        sessions:    [],
        resources:   [],
        assessments: [],
        activity:    [],
      }
    ]);
    addNotification?.(`New program "${cleanName}" created`);
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
      // Update program name
      setPrograms(prev => prev.map(p => p.id === renameProgramId ? { ...p, name: cleanNewName } : p));
      // Update all assigned learners to the new program name
      setLearners(prev => prev.map(l => l.program === oldProg.name ? { ...l, program: cleanNewName } : l));
      addNotification?.(`Program "${oldProg.name}" renamed to "${cleanNewName}"`);
    }
    setRenameProgramId(null);
    setRenameName('');
  };

  const handleDeleteConfirm = () => {
    const progToDelete = programs.find(p => p.id === deleteProgramId);
    if (progToDelete) {
      // Remove program
      setPrograms(prev => prev.filter(p => p.id !== deleteProgramId));
      // Permanently remove all assigned learners from this program
      setLearners(prev => prev.filter(l => l.program !== progToDelete.name));
      addNotification?.(`Program "${progToDelete.name}" deleted permanently`);
    }
    setDeleteProgramId(null);
  };

  /* Live learner count per program */
  const getLearnerCount = (progName) =>
    learners.filter(l => l.program === progName).length;

  const totalLearners = learners.length;

  /* Live workspace-wide storage calculation */
  const calculateTotalStorage = () => {
    let totalBytes = 0;
    programs.forEach(p => {
      // Sum program-wide resources
      (p.resources || []).forEach(r => {
        totalBytes += r.sizeInBytes || 0;
      });
      // Sum session-specific resources
      (p.sessions || []).forEach(s => {
        (s.resources || []).forEach(sr => {
          totalBytes += sr.sizeInBytes || 0;
        });
      });
    });

    if (totalBytes === 0) return '0.00 MB / 10 GB';
    const GB = 1024 * 1024 * 1024;
    const MB = 1024 * 1024;
    if (totalBytes >= GB) {
      return `${(totalBytes / GB).toFixed(2)} GB / 10 GB`;
    } else {
      return `${(totalBytes / MB).toFixed(2)} MB / 10 GB`;
    }
  };

  /* ── If a program is selected, show its detail view ── */
  const selectedProgram = programs.find(p => p.id === selectedProgramId);
  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        setPrograms={setPrograms}
        programLearners={learners.filter(l => l.program === selectedProgram.name)}
        setLearners={setLearners}
        onBack={() => setSelectedProgramId(null)}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Programs</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Manage your training programs and keep everything organized in one place.
          </p>
        </div>
        {userRole !== 'Facilitator' && (
          <button
            onClick={() => {
              if (programs.length >= PROGRAM_LIMIT) {
                alert('Program limit reached for Standard workspace plan (Max 3). Upgrade to add more.');
              } else {
                setShowCreateModal(true);
              }
            }}
            style={{
              background: 'linear-gradient(135deg,#D4AF37,#C49A2A)',
              border: 'none', color: '#000', fontWeight: 700,
              fontSize: '0.85rem', borderRadius: '8px',
              padding: '0.7rem 1.25rem', display: 'flex', alignItems: 'center',
              gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
              transition: 'opacity 0.2s'
            }}
          >
            <Plus size={16} /> Create Program
          </button>
        )}
      </div>



      {/* Your Programs Section */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', fontFamily: "'Outfit', sans-serif" }}>
          Your Programs
        </h3>

        {programs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {programs.map((p) => (
              <div key={p.id}
                style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'border-color 0.2s', position: 'relative' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                {/* Action Menu (Three Dots) */}
                {userRole !== 'Facilitator' && (
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuProgramId(activeMenuProgramId === p.id ? null : p.id);
                      }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                          backgroundColor: '#161822', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          width: '150px', zIndex: 100, overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setSelectedProgramId(p.id);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Play size={13} fill="#fff" /> Open Program
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setRenameProgramId(p.id);
                              setRenameName(p.name);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Edit2 size={13} /> Rename Program
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuProgramId(null);
                              setDeleteProgramId(p.id);
                            }}
                            style={{ width: '100%', padding: '0.65rem 0.9rem', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                          >
                            <Trash2 size={13} /> Delete Program
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, flex: 1, paddingRight: '0.5rem' }}>{p.name}</h4>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.5rem', borderRadius: '5px', flexShrink: 0 }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: '1.45', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {p.desc}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                  <span>{getLearnerCount(p.name)} Learners</span>
                  <span>·</span>
                  <span>{(p.sessions || []).length} Sessions</span>
                  <span>·</span>
                  <span>{(p.resources || []).length} Resources</span>
                </div>
                <button
                  onClick={() => setSelectedProgramId(p.id)}
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
                  Open Program <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#0e0f14', border: '1px dotted rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '3.5rem 2rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Create your first program</h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.4rem', maxWidth: '340px', margin: '0.4rem auto 0 auto', lineHeight: 1.5 }}>
                Set up a program, add learners, upload resources, and start running your training.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                background: 'linear-gradient(135deg,#D4AF37,#C49A2A)',
                border: 'none', color: '#000', fontWeight: 700,
                fontSize: '0.82rem', borderRadius: '8px',
                padding: '0.6rem 1.25rem', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                marginTop: '0.5rem'
              }}
            >
              Create Program
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)', zIndex: 1300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '440px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              animation: 'scaleUp 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create Training Program</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Add a new program slot to your standard workspace.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program Name</label>
                <input
                  required autoFocus type="text"
                  placeholder="e.g. Leadership Development Program"
                  value={newProgName}
                  onChange={e => setNewProgName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                <textarea
                  placeholder="Summarize program goals, curriculum or tracks..."
                  value={newProgDesc}
                  onChange={e => setNewProgDesc(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Rename Program</h3>
              <button onClick={() => setRenameProgramId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program Name</label>
                <input
                  required autoFocus type="text"
                  value={renameName}
                  onChange={e => setRenameName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setRenameProgramId(null)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  Rename Program
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
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(239,110,110,0.2)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ef4444', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Delete Program</h3>
                <button onClick={() => setDeleteProgramId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete <strong style={{ color: '#D4AF37' }}>{prog?.name}</strong>?
                </p>
                <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.9rem 1.1rem', fontSize: '0.82rem', color: '#fca5a5', lineHeight: '1.5' }}>
                  <strong>Warning:</strong> This will permanently delete the program and remove all program-related data, including all sessions, resources, assessments, and any assigned learners. This action cannot be undone.
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setDeleteProgramId(null)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    style={{ flex: 1, padding: '0.75rem', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
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
