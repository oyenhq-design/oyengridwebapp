import React, { useState } from 'react';
import { BookOpen, Users, HardDrive, Plus, Play, X } from 'lucide-react';

const PROGRAM_LIMIT = 3;

export default function ProgramsTab({ programs, setPrograms, learners = [] }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProgName, setNewProgName]         = useState('');
  const [newProgDesc, setNewProgDesc]         = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProgName.trim() || programs.length >= PROGRAM_LIMIT) return;
    setPrograms(prev => [
      ...prev,
      {
        id:        Date.now(),
        name:      newProgName.trim(),
        desc:      newProgDesc.trim() || 'No description provided.',
        status:    'Active',
        learners:  0,
        sessions:  0,
        resources: 0,
      }
    ]);
    setNewProgName('');
    setNewProgDesc('');
    setShowCreateModal(false);
  };

  /* Derive learner count per program from shared learners list */
  const getLearnerCount = (progName) =>
    learners.filter(l => l.program === progName).length;

  const totalLearners = learners.length;

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
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programs</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.15rem' }}>{programs.length} / 3</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Learners</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.15rem' }}>{totalLearners} / 50</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            <HardDrive size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Storage</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.15rem' }}>0 GB / 10 GB</div>
          </div>
        </div>
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
                style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>{p.name}</h4>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.5rem', borderRadius: '5px' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: '1.45', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {p.desc}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                  <span>{getLearnerCount(p.name)} Learners</span>
                  <span>·</span>
                  <span>{p.sessions} Sessions</span>
                  <span>·</span>
                  <span>{p.resources} Resources</span>
                </div>
                <button
                  onClick={() => alert(`Opening workspace for: ${p.name}`)}
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
                  Open Program <Play size={10} fill="#D4AF37" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
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
    </div>
  );
}
