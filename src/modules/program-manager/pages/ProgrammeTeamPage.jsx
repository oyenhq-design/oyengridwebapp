import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, X, ChevronDown, Check, Sparkles, Mail, Phone, Calendar, 
  UserPlus, UserCheck, AlertTriangle, BarChart3, CheckCircle2, User, 
  MapPin, Clock, Edit2, Download, RefreshCw
} from 'lucide-react';

export default function ProgrammeTeamPage({ user, wsPrograms = [], wsTeam = [], setWsPrograms }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Interaction states
  const [selectedMember, setSelectedMember] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  // Invite form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Facilitator');
  const [inviteProgram, setInviteProgram] = useState('');

  // Floating AI Recommendation Notification State
  const [aiRecommendation, setAiRecommendation] = useState({
    id: 'assign_team',
    text: 'Solar Grid Integration has no facilitator for tomorrow\'s session.',
    actionLabel: 'Assign One Now',
    action: () => {
      alert('Facilitator Sarah Jenkins assigned to Solar Grid Integration.');
      setAiRecommendation(null);
    }
  });

  // Calculate delivery team membership dynamically based on wsPrograms
  const deliveryTeam = useMemo(() => {
    // Collect active facilitators and coordinators assigned to programs
    const assignedEmails = new Set();
    const list = [];

    // Check programs for facilitators
    wsPrograms.forEach(p => {
      const sess = p.sessions || [];
      sess.forEach(s => {
        if (s.facilitatorName) {
          const email = s.facilitatorEmail || `${s.facilitatorName.toLowerCase().replace(/\s/g, '')}@oyengrid.com`;
          if (!assignedEmails.has(email)) {
            assignedEmails.add(email);
            list.push({
              name: s.facilitatorName,
              role: 'Facilitator',
              email,
              phone: '+1 (555) 019-2834',
              programs: [p.name || p.title],
              status: 'Available',
              nextSession: s.date ? `${s.date} ${s.startTime}` : 'Today • 2:00 PM',
              workload: 1, // session count
              attendanceRate: '98%',
              rating: '4.9',
              lastActive: '10 minutes ago'
            });
          } else {
            // increment workload count
            const existing = list.find(item => item.email === email);
            if (existing) {
              existing.workload += 1;
              if (!existing.programs.includes(p.name || p.title)) {
                existing.programs.push(p.name || p.title);
              }
            }
          }
        }
      });
    });

    // Merge with any program managers or coordinators listed in the workspace staff
    wsTeam.forEach(member => {
      const email = member.email;
      if (member.role === 'Facilitator' || member.role === 'Programme Coordinator' || member.role === 'Coordinator') {
        if (!assignedEmails.has(email)) {
          assignedEmails.add(email);
          list.push({
            name: member.name,
            role: member.role === 'Coordinator' ? 'Programme Coordinator' : member.role,
            email,
            phone: member.phone || '+1 (555) 012-3456',
            programs: [wsPrograms[0]?.name || 'Battery Storage Bootcamp'],
            status: 'Available',
            nextSession: 'Tomorrow 10:00',
            workload: 0,
            attendanceRate: '95%',
            rating: '4.8',
            lastActive: member.lastActive || '2 hours ago'
          });
        }
      }
    });

    // Provide default fallback delivery team if database starts empty
    if (list.length === 0) {
      list.push(
        {
          name: 'Sarah Jenkins',
          role: 'Facilitator',
          email: 'sarah.j@oyengrid.com',
          phone: '+1 (555) 432-1098',
          programs: ['Solar Technology Fellowship'],
          status: 'Available',
          nextSession: 'Today • 2:00 PM',
          workload: 4,
          attendanceRate: '99%',
          rating: '4.9',
          lastActive: '5 mins ago'
        },
        {
          name: 'Michael Brown',
          role: 'Programme Coordinator',
          email: 'michael.b@oyengrid.com',
          phone: '+1 (555) 789-0123',
          programs: ['Battery Storage Bootcamp'],
          status: 'Available',
          nextSession: 'Tomorrow • 10:00 AM',
          workload: 1,
          attendanceRate: '95%',
          rating: '4.7',
          lastActive: '1 hour ago'
        },
        {
          name: 'David John',
          role: 'Facilitator',
          email: 'david.j@oyengrid.com',
          phone: '+1 (555) 654-3210',
          programs: ['Smart Grid Fellowship'],
          status: 'Available',
          nextSession: 'Monday • 09:00 AM',
          workload: 1,
          attendanceRate: '96%',
          rating: '4.8',
          lastActive: 'Yesterday'
        }
      );
    }

    return list;
  }, [wsPrograms, wsTeam]);

  // Top metric counters
  const metrics = useMemo(() => {
    const facilitators = deliveryTeam.filter(t => t.role === 'Facilitator').length;
    const coordinators = deliveryTeam.filter(t => t.role === 'Programme Coordinator').length;
    const available = deliveryTeam.filter(t => t.status === 'Available').length;
    return { facilitators, coordinators, available, pending: 1 };
  }, [deliveryTeam]);

  // Inviting / Creating team member logic
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    setSuccessToast('✓ Invitation sent successfully.');
    setTimeout(() => setSuccessToast(null), 3000);

    // AI recommendation simulation on invitation accepted
    setTimeout(() => {
      setAiRecommendation({
        id: 'invite_accepted',
        text: `${inviteName} accepted your invitation. Assign her to a programme?`,
        actionLabel: 'Assign Programme',
        action: () => {
          alert(`Assigned ${inviteName} to ${inviteProgram || 'Battery Storage Bootcamp'}`);
          setAiRecommendation(null);
        }
      });
    }, 2000);

    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
  };

  // Searching and Filtering
  const filteredTeam = useMemo(() => {
    let list = [...deliveryTeam];

    if (activeFilter !== 'All') {
      if (activeFilter === 'Facilitators') list = list.filter(t => t.role === 'Facilitator');
      else if (activeFilter === 'Programme Coordinators') list = list.filter(t => t.role === 'Programme Coordinator');
      else if (activeFilter === 'Available Today') list = list.filter(t => t.status === 'Available');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.programs.some(p => p.toLowerCase().includes(q))
      );
    }

    return list;
  }, [deliveryTeam, activeFilter, searchQuery]);

  return (
    <div style={{ padding: '2.5rem 3rem', fontFamily: "'Inter', sans-serif", minHeight: '100%', position: 'relative' }}>
      
      {/* Toast Alert */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideInRight 0.25s ease'
        }}>
          <CheckCircle2 size={16} color="#10B981" />
          {successToast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111111', fontFamily: "'Outfit', sans-serif" }}>Programme Team</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.95rem' }}>
            Manage facilitators and delivery staff assigned to your learning programmes.
          </p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          style={{ padding: '0.65rem 1.4rem', backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <UserPlus size={16} /> Invite Facilitator
        </button>
      </div>

      {/* Single Integrated AI Suggestion banner */}
      {aiRecommendation && (
        <div style={{
          backgroundColor: '#FFFBEA',
          border: '1px solid #F4C542',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#2D2D2D' }}>
            <Sparkles size={16} color="#D8A325" />
            <strong>⚡ OYEN AI:</strong>
            <span>{aiRecommendation.text}</span>
          </div>
          <button 
            onClick={aiRecommendation.action}
            style={{ padding: '0.45rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', color: '#111111', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {aiRecommendation.actionLabel}
          </button>
        </div>
      )}

      {/* Team Overview Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Facilitators Assigned', value: metrics.facilitators },
          { label: 'Programme Coordinators', value: metrics.coordinators },
          { label: 'Pending Invitations', value: metrics.pending },
          { label: 'Available Today', value: metrics.available }
        ].map((card, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111111', marginTop: '0.25rem' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Layout Split: Left Main List | Right Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2.5rem' }}>
        
        {/* Left Column: Team Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Filters and search */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input 
                type="text" 
                placeholder="Search staff by name, role, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.2rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <select
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="All">All Staff Roles</option>
              <option value="Facilitators">Facilitators</option>
              <option value="Programme Coordinators">Coordinators</option>
              <option value="Available Today">Available Today</option>
            </select>
          </div>

          {/* Main list rendering */}
          {filteredTeam.length > 0 ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EBE5D9', backgroundColor: '#FAFAF8' }}>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Role</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Assigned Programmes</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Next Session</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeam.map(member => (
                    <tr 
                      key={member.email}
                      onClick={() => setSelectedMember(member)}
                      style={{ borderBottom: '1px solid #EBE5D9', cursor: 'pointer', transition: 'background-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#111111' }}>{member.name}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#2D2D2D' }}>{member.role}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#2D2D2D' }}>{member.programs.join(', ')}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: member.status === 'Available' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                          color: member.status === 'Available' ? '#10B981' : '#EF4444'
                        }}>
                          {member.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#6B7280' }}>{member.nextSession}</td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          style={{ padding: '0.35rem 0.65rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280', border: '2px dashed #EBE5D9', borderRadius: '16px' }}>
              No team members assigned. Invite or request a facilitator.
            </div>
          )}

        </div>

        {/* Right Column: Workloads & Availabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Workload Balancer */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Team Workload</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {deliveryTeam.map(member => (
                <div key={member.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F5F2ED' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111111' }}>{member.name}</div>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{member.role}</span>
                  </div>
                  <span style={{
                    fontWeight: 700, 
                    color: member.workload >= 3 ? '#EF4444' : member.workload > 0 ? '#D8A325' : '#6B7280'
                  }}>
                    {member.workload === 0 ? 'No sessions assigned' : `${member.workload} session${member.workload > 1 ? 's' : ''} this week`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Available today list */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Availability Today</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {deliveryTeam.map(member => (
                <div key={member.email} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <span style={{ color: member.status === 'Available' ? '#10B981' : '#EF4444' }}>
                    {member.status === 'Available' ? '✔' : '✖'}
                  </span>
                  <span style={{ fontWeight: 600, color: '#2D2D2D' }}>{member.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* TEAM PROFILE SIDE DRAWER (Linear/Notion Style) */}
      {selectedMember && (
        <>
          <div 
            onClick={() => setSelectedMember(null)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)', zIndex: 3000 }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '440px',
            backgroundColor: '#ffffff',
            borderLeft: '1px solid #EBE5D9',
            boxShadow: '-10px 0 35px rgba(0,0,0,0.1)',
            zIndex: 3001,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.25s ease'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #EBE5D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedMember.name}</h2>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{selectedMember.role} Profile Details</span>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Profile Card Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  backgroundColor: '#F4C542', color: '#111111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.25rem'
                }}>
                  {selectedMember.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{selectedMember.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Last active {selectedMember.lastActive}</span>
                </div>
              </div>

              {/* Attributes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Email</span>
                  <span style={{ fontWeight: 600 }}>{selectedMember.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Phone</span>
                  <span style={{ fontWeight: 600 }}>{selectedMember.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Assigned Programmes</span>
                  <span style={{ fontWeight: 600 }}>{selectedMember.programs.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Next Session</span>
                  <span style={{ fontWeight: 600 }}>{selectedMember.nextSession}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Attendance Rate</span>
                  <span style={{ fontWeight: 600, color: '#10B981' }}>{selectedMember.attendanceRate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Average Participant Rating</span>
                  <span style={{ fontWeight: 600, color: '#D8A325' }}>★ {selectedMember.rating}</span>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid #EBE5D9' }} />

              {/* Quick Actions Drawer Footer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 800 }}>Staff Actions</h4>
                <button 
                  onClick={() => alert(`Email connection opened for ${selectedMember.email}`)}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Contact Staff
                </button>
                <button 
                  onClick={() => alert(`Reassigning programs for ${selectedMember.name}`)}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reassign Programme
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* INVITE TEAM MEMBER MODAL */}
      {showInviteModal && (
        <>
          <div 
            onClick={() => setShowInviteModal(false)}
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
            maxWidth: '440px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            zIndex: 3001,
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Invite Facilitator</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Email Address *</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. sarah@oyengrid.com"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Programme Assignment</label>
                <select 
                  value={inviteProgram}
                  onChange={e => setInviteProgram(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="">Select Programme...</option>
                  {wsPrograms.map(p => (
                    <option key={p.id} value={p.name || p.title}>{p.name || p.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
                  style={{ padding: '0.55rem 1.1rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.55rem 1.25rem', backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
