import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Download, UserPlus, 
  ChevronRight, MoreVertical, Mail, X, FileText, Activity, AlertTriangle, BookOpen, Clock, Calendar, ShieldAlert
} from 'lucide-react';

const theme = {
  bg: '#F8F5EF',          
  bgSecondary: '#E8E2D8',
  card: '#FFFFFF',        
  cardHover: '#FAFAFA',
  border: '#EBE5D9',
  gold: '#F4C542',        
  goldHover: '#E3B532',
  goldLight: 'rgba(244, 197, 66, 0.15)',
  textMilk: '#111111', 
  textBody: '#2D2D2D',
  textMuted: '#6B7280',   
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  info: '#3B82F6',        
  infoLight: 'rgba(59, 130, 246, 0.1)',
  font: "'Inter', sans-serif"
};

export default function LearnersPage({ 
  user, 
  wsPrograms = [], 
  wsLearners = [], 
  wsTeam = [] 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [learnerTab, setLearnerTab] = useState('Overview');

  // Derive assigned programs
  const assignedPrograms = wsPrograms || [];
  const hasAssignedPrograms = assignedPrograms.length > 0;
  
  // Filter learners to only those in assigned programs
  const eligibleLearners = (wsLearners || []).filter(learner => {
    const learnerProgramId = learner.programId || learner.program || learner.programme;
    return assignedPrograms.some(p => p.title === learnerProgramId || p.name === learnerProgramId || p.id === learnerProgramId);
  });

  const filteredLearners = eligibleLearners.filter(learner => {
    const matchesSearch = (learner.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (learner.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const learnerProgramId = learner.programId || learner.program || learner.programme;
    const matchesProgram = selectedProgram === 'All' || learnerProgramId === selectedProgram;
    const matchesStatus = selectedStatus === 'All' || learner.status === selectedStatus;

    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Derived Summary Metrics
  const totalLearners = eligibleLearners.length;
  const activeLearners = eligibleLearners.filter(l => l.status === 'Active').length;
  const pendingLearners = eligibleLearners.filter(l => l.status === 'Pending').length;
  const inactiveLearners = eligibleLearners.filter(l => l.status === 'Inactive' || l.status === 'Suspended').length;

  // Alerts logic (Insight Panel)
  const alerts = [];
  eligibleLearners.forEach(l => {
    if (l.attendance !== undefined && l.attendance < 75) {
      alerts.push({ type: 'danger', message: `${l.name} is below 75% attendance (${l.attendance}%)`, learner: l });
    }
    if (l.progress !== undefined && l.progress < 50 && l.status === 'Active') {
      alerts.push({ type: 'warning', message: `${l.name} is falling behind (Progress: ${l.progress}%)`, learner: l });
    }
    if (l.status === 'Pending') {
      alerts.push({ type: 'info', message: `${l.name} is awaiting approval`, learner: l });
    }
  });

  const uniquePrograms = Array.from(new Set(assignedPrograms.map(p => p.title || p.name))).filter(Boolean);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return { bg: theme.successLight, color: theme.success };
      case 'Pending': return { bg: theme.warningLight, color: theme.warning };
      case 'Inactive': 
      case 'Suspended': return { bg: theme.dangerLight, color: theme.danger };
      case 'Completed': return { bg: theme.infoLight, color: theme.info };
      default: return { bg: theme.bgSecondary, color: theme.textMuted };
    }
  };

  const getAvatarFallback = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!hasAssignedPrograms) {
    return (
      <div style={{ padding: '3rem', fontFamily: theme.font, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <BookOpen size={40} color={theme.textMuted} />
        </div>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: 700, color: theme.textMilk }}>No programmes assigned</h2>
        <p style={{ margin: 0, fontSize: '1.1rem', color: theme.textMuted, maxWidth: '500px', textAlign: 'center', lineHeight: 1.6 }}>
          A Workspace Administrator has not assigned you to any programmes yet.
          Once programmes are assigned, learner information will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem', fontFamily: theme.font, display: 'flex', gap: '2rem', position: 'relative' }}>
      
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: theme.textMilk, margin: '0 0 0.5rem 0' }}>Learners</h1>
            <p style={{ fontSize: '1.1rem', color: theme.textMuted, margin: 0 }}>
              Manage everyone enrolled across your assigned programmes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              padding: '0.85rem 1.5rem', backgroundColor: 'transparent', color: theme.textMilk, border: `1px solid ${theme.border}`,
              borderRadius: '10px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Download size={18} /> Export
            </button>
            <button style={{
              padding: '0.85rem 1.5rem', backgroundColor: theme.gold, color: '#111', border: 'none',
              borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <UserPlus size={18} strokeWidth={2.5} /> Invite Learner
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { label: 'Total Learners', value: totalLearners, icon: <Users size={20} color={theme.info} />, bg: theme.infoLight },
            { label: 'Active Learners', value: activeLearners, icon: <Activity size={20} color={theme.success} />, bg: theme.successLight },
            { label: 'Awaiting Approval', value: pendingLearners, icon: <Clock size={20} color={theme.warning} />, bg: theme.warningLight },
            { label: 'Inactive Learners', value: inactiveLearners, icon: <AlertTriangle size={20} color={theme.danger} />, bg: theme.dangerLight }
          ].map((stat, idx) => (
            <div key={idx} style={{
              backgroundColor: theme.card, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${theme.border}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)', display: 'flex', alignItems: 'center', gap: '1.25rem'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: theme.textMuted, fontWeight: 600, marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textMilk }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          backgroundColor: theme.card, borderRadius: '16px', padding: '1.25rem', border: `1px solid ${theme.border}`,
          display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search size={18} color={theme.textMuted} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search learners..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '10px',
                border: `1px solid ${theme.border}`, backgroundColor: theme.bg, fontSize: '0.95rem',
                fontFamily: theme.font, outline: 'none', color: theme.textMilk, boxSizing: 'border-box'
              }}
            />
          </div>
          <select 
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, fontSize: '0.95rem', fontFamily: theme.font, outline: 'none', cursor: 'pointer' }}
          >
            <option value="All">All Programmes</option>
            {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '0.85rem 1rem', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, fontSize: '0.95rem', fontFamily: theme.font, outline: 'none', cursor: 'pointer' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button style={{
            padding: '0.85rem', backgroundColor: theme.bg, color: theme.textMuted, border: `1px solid ${theme.border}`,
            borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Filter size={18} />
          </button>
        </div>

        {/* Main Learners Table */}
        <div style={{ backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
          {eligibleLearners.length === 0 ? (
            <div style={{ padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Users size={32} color={theme.textMuted} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: theme.textMilk }}>No learners yet</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: theme.textMuted, textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
                Once learners are invited or enrolled into your assigned programmes, they'll appear here automatically.
              </p>
              <button style={{
                padding: '0.85rem 1.5rem', backgroundColor: theme.gold, color: '#111', border: 'none',
                borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <UserPlus size={18} strokeWidth={2.5} /> Invite Learners
              </button>
            </div>
          ) : filteredLearners.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: theme.textMuted }}>
              No learners match your current filters.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bgSecondary }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMuted }}>Learner</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMuted }}>Programme & Cohort</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMuted }}>Facilitator</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMuted }}>Performance</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMuted }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: theme.textMuted, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLearners.map((learner, idx) => {
                    const statusStyle = getStatusStyle(learner.status || 'Pending');
                    return (
                      <tr 
                        key={learner.id || idx} 
                        style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background 0.2s', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.cardHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setSelectedLearner(learner)}
                      >
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {learner.avatar ? (
                              <img src={learner.avatar} alt={learner.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: theme.goldLight, color: '#C29F32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                                {getAvatarFallback(learner.name)}
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 600, color: theme.textMilk, fontSize: '0.95rem' }}>{learner.name || 'Unnamed Learner'}</div>
                              <div style={{ fontSize: '0.85rem', color: theme.textMuted }}>{learner.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: 600, color: theme.textBody, fontSize: '0.9rem' }}>{learner.program || learner.programme || learner.programId || 'No Programme'}</div>
                          <div style={{ fontSize: '0.85rem', color: theme.textMuted }}>{learner.cohort || 'No Cohort'}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: theme.textBody }}>
                          {learner.assignedFacilitator || learner.facilitator || 'Unassigned'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                              <span style={{ color: theme.textMuted }}>Progress</span>
                              <span style={{ fontWeight: 600, color: theme.textMilk }}>{learner.progress !== undefined ? `${learner.progress}%` : '--'}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: theme.bgSecondary, borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${learner.progress || 0}%`, height: '100%', backgroundColor: theme.gold }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                              <span style={{ color: theme.textMuted }}>Attendance</span>
                              <span style={{ fontWeight: 600, color: theme.textMilk }}>{learner.attendance !== undefined ? `${learner.attendance}%` : '--'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                            backgroundColor: statusStyle.bg, color: statusStyle.color, display: 'inline-block'
                          }}>
                            {learner.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <button style={{ background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }}>
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar (Insight Panel) */}
      <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ backgroundColor: theme.card, borderRadius: '24px', padding: '1.5rem', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color={theme.warning} /> Need Attention
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.length > 0 ? alerts.slice(0, 5).map((alert, idx) => (
              <div key={idx} style={{ 
                padding: '1rem', borderRadius: '12px', fontSize: '0.9rem',
                backgroundColor: alert.type === 'danger' ? theme.dangerLight : alert.type === 'warning' ? theme.warningLight : theme.infoLight,
                border: `1px solid ${alert.type === 'danger' ? 'rgba(239, 68, 68, 0.2)' : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
              }}>
                <div style={{ fontWeight: 600, color: theme.textMilk, marginBottom: '0.25rem' }}>{alert.learner.name}</div>
                <div style={{ color: theme.textBody, fontSize: '0.85rem' }}>{alert.message}</div>
              </div>
            )) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: theme.bgSecondary, borderRadius: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: theme.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
                  <Activity size={20} color={theme.success} />
                </div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 600, color: theme.textMilk }}>Everything looks good.</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: theme.textMuted }}>No learner issues require your attention today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learner Details Drawer Overlay */}
      {selectedLearner && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            width: '100%', maxWidth: '800px', backgroundColor: theme.card, height: '100%',
            boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column',
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '2rem 2.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {selectedLearner.avatar ? (
                  <img src={selectedLearner.avatar} alt={selectedLearner.name} style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: theme.goldLight, color: '#C29F32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '2rem' }}>
                    {getAvatarFallback(selectedLearner.name)}
                  </div>
                )}
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem', fontWeight: 700, color: theme.textMilk }}>{selectedLearner.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', color: theme.textMuted }}>
                    <span>{selectedLearner.email}</span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: theme.border }} />
                    <span style={{ fontWeight: 600, color: theme.textBody }}>{selectedLearner.program || selectedLearner.programme || 'No Programme'}</span>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: getStatusStyle(selectedLearner.status || 'Pending').bg, color: getStatusStyle(selectedLearner.status || 'Pending').color }}>
                      {selectedLearner.status || 'Pending'}
                    </span>
                    <button style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '100px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: theme.textMilk, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Mail size={12} /> Message
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLearner(null)}
                style={{ background: theme.bgSecondary, border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.textMilk }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', padding: '0 2.5rem', borderBottom: `1px solid ${theme.border}`, overflowX: 'auto' }}>
              {['Overview', 'Attendance', 'Sessions', 'Resources', 'Assessments', 'Certificates', 'Messages', 'Activity Timeline'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setLearnerTab(tab)}
                  style={{
                    padding: '1rem 0', margin: '0 1rem 0 0', background: 'transparent', border: 'none',
                    borderBottom: `2px solid ${learnerTab === tab ? theme.gold : 'transparent'}`,
                    color: learnerTab === tab ? theme.textMilk : theme.textMuted,
                    fontWeight: learnerTab === tab ? 700 : 500, fontSize: '0.95rem', cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Content */}
            <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto', backgroundColor: theme.bg }}>
              {learnerTab === 'Overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: '0.85rem', color: theme.textMuted, marginBottom: '0.5rem', fontWeight: 600 }}>Overall Progress</div>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.textMilk, marginBottom: '1rem' }}>{selectedLearner.progress !== undefined ? `${selectedLearner.progress}%` : '--'}</div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: theme.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${selectedLearner.progress || 0}%`, height: '100%', backgroundColor: theme.gold }} />
                      </div>
                    </div>
                    <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: '0.85rem', color: theme.textMuted, marginBottom: '0.5rem', fontWeight: 600 }}>Attendance Rate</div>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.textMilk, marginBottom: '1rem' }}>{selectedLearner.attendance !== undefined ? `${selectedLearner.attendance}%` : '--'}</div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: theme.bgSecondary, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${selectedLearner.attendance || 0}%`, height: '100%', backgroundColor: (selectedLearner.attendance || 0) >= 75 ? theme.success : theme.warning }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>Enrollment Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.25rem' }}>Programme</div>
                        <div style={{ fontWeight: 600, color: theme.textBody }}>{selectedLearner.program || selectedLearner.programme || '--'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.25rem' }}>Cohort</div>
                        <div style={{ fontWeight: 600, color: theme.textBody }}>{selectedLearner.cohort || '--'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.25rem' }}>Assigned Facilitator</div>
                        <div style={{ fontWeight: 600, color: theme.textBody }}>{selectedLearner.assignedFacilitator || selectedLearner.facilitator || '--'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginBottom: '0.25rem' }}>Last Active</div>
                        <div style={{ fontWeight: 600, color: theme.textBody }}>{selectedLearner.lastActive || 'Unknown'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {learnerTab !== 'Overview' && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: theme.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <FileText size={24} color={theme.textMuted} />
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: theme.textMilk }}>{learnerTab} data</h3>
                  <p style={{ color: theme.textMuted, fontSize: '0.95rem' }}>Detailed {learnerTab.toLowerCase()} information for {selectedLearner.name} will appear here based on workspace records.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
