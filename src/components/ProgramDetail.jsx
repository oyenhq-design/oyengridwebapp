import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Users, Calendar, FileText, ClipboardList,
  CheckCircle2, Circle, Search, X, UserPlus
} from 'lucide-react';

export default function ProgramDetail({ program, programLearners = [], teamMembers = [], setPrograms, userRole, onBack }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacs, setSelectedFacs] = useState([]);

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

  // Find all active assignable staff (Facilitators, Team Members, Program Managers) in workspace
  const activeFacilitators = teamMembers.filter(m => m.status === 'Active' && m.role !== 'Organization Owner' && m.role !== 'Admin');
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

  const handleSave = () => {
    if (setPrograms) {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, assignedFacilitators: selectedFacs } 
          : p
      ));
    }
    setShowAssignModal(false);
  };

  const isOwnerOrAdmin = userRole === 'Organization Owner' || userRole === 'Admin';

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

      {/* ── Back nav ── */}
      <button onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, width: 'fit-content', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
      >
        <ArrowLeft size={15} /> Programs
      </button>

      {/* ── Program header ── */}
      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{program.name}</h1>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor.color, backgroundColor: statusColor.bg, padding: '0.22rem 0.6rem', borderRadius: '5px', flexShrink: 0 }}>
                {program.status}
              </span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem', margin: 0, lineHeight: 1.55, maxWidth: '600px' }}>
              {program.desc || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Participants', value: learnerCount,    icon: <Users size={20} />,         color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'Sessions',    value: sessionCount,    icon: <Calendar size={20} />,      color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
          { label: 'Resources',   value: resourceCount,   icon: <FileText size={20} />,      color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
          { label: 'Assessments', value: assessmentCount, icon: <ClipboardList size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.05rem' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Program Status Checklist */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {checklist.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {item.done
                    ? <CheckCircle2 size={18} color="#22c55e" />
                    : <Circle size={18} color="rgba(255,255,255,0.2)" />
                  }
                  <div>
                    <span style={{ fontSize: '0.82rem', color: item.done ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                    {item.optional && !item.done && (
                      <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>optional</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilitators Tab / Section */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Facilitators</h3>
            {isOwnerOrAdmin && (
              <button
                onClick={() => setShowAssignModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: '#D4AF37',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.18)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'}
              >
                <UserPlus size={13} /> Assign Facilitator
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Assigned Facilitators
            </span>

            {assignedFacs.length === 0 ? (
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                No facilitators assigned yet.
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {assignedFacs.map((fac, idx) => {
                  const roleLabel = idx === 0 ? 'Lead Facilitator' : 'Facilitator';
                  return (
                    <div key={fac.email} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: fac.color || '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                        {fac.initials || fac.name?.[0]?.toUpperCase() || 'F'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: idx === 0 ? '#D4AF37' : 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {roleLabel}
                        </div>
                        <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                          {fac.name}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
                          {fac.email}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div
          onClick={() => setShowAssignModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#0e0f14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '2rem',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Assign Facilitator</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Select facilitators to assign to this training program.</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search facilitators..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                  fontSize: '0.82rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Facilitators List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {filteredFacilitators.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '1rem 0', textAlign: 'center' }}>
                  No active facilitators found.
                </div>
              ) : (
                filteredFacilitators.map(fac => {
                  const isChecked = selectedFacs.includes(fac.email);
                  return (
                    <div
                      key={fac.email}
                      onClick={() => handleToggleSelect(fac.email)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.8rem',
                        backgroundColor: isChecked ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid',
                        borderColor: isChecked ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={e => {
                        if (!isChecked) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={e => {
                        if (!isChecked) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: fac.color || '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                          {fac.initials || fac.name?.[0]?.toUpperCase() || 'F'}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{fac.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{fac.email}</div>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by click on parent div
                        style={{
                          accentColor: '#D4AF37',
                          cursor: 'pointer',
                          width: '15px',
                          height: '15px'
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  background: 'linear-gradient(135deg,#D4AF37,#C49A2A)',
                  border: 'none',
                  color: '#000',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
