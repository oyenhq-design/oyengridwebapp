import React, { useState } from 'react';
import { 
  BarChart3, Users, BookOpen, Calendar, Percent, ArrowLeft, ArrowUpRight, 
  Download, FileSpreadsheet, Search, CheckCircle2, AlertTriangle, ShieldAlert
} from 'lucide-react';

export default function ReportsTab({ programs = [], learners = [] }) {
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Calculations & Metrics
  const activeProgramsCount = programs.length;
  const totalLearnersCount = learners.length;

  // Find completed sessions across all programs
  const today = new Date().setHours(0, 0, 0, 0);
  let totalCompletedSessions = 0;
  let totalAttendanceOpportunities = 0;
  let totalPresentCount = 0;

  programs.forEach(p => {
    (p.sessions || []).forEach(s => {
      const isCompleted = s.date && new Date(s.date) < today;
      if (isCompleted) {
        totalCompletedSessions++;
        const programLearners = learners.filter(l => l.program === p.name);
        programLearners.forEach(l => {
          totalAttendanceOpportunities++;
          const status = s.attendance?.[l.id] || 'Present';
          if (status === 'Present') {
            totalPresentCount++;
          }
        });
      }
    });
  });

  const averageAttendance = totalAttendanceOpportunities > 0
    ? `${Math.round((totalPresentCount / totalAttendanceOpportunities) * 100)}%`
    : '—';

  // 2. Engagement statistics
  let activeLearners = 0;
  let inactiveLearners = 0;
  let atRiskLearners = 0;

  learners.forEach(l => {
    const hasProgram = l.program && l.program !== 'None';
    if (!hasProgram) {
      inactiveLearners++;
      return;
    }
    activeLearners++;

    // Calculate individual attendance for at-risk (if there are completed sessions in their program)
    const prog = programs.find(p => p.name === l.program);
    if (prog) {
      let completedInProg = 0;
      let presentInProg = 0;
      (prog.sessions || []).forEach(s => {
        const isCompleted = s.date && new Date(s.date) < today;
        if (isCompleted) {
          completedInProg++;
          if ((s.attendance?.[l.id] || 'Present') === 'Present') {
            presentInProg++;
          }
        }
      });
      if (completedInProg > 0) {
        const rate = presentInProg / completedInProg;
        if (rate < 0.75) {
          atRiskLearners++;
        }
      }
    }
  });

  // Export functions (CSV Generation)
  const exportCSV = (type, dataList) => {
    let headers = [];
    let rows = [];
    let filename = 'report.csv';

    if (type === 'Workspace Overview') {
      filename = 'workspace_overview_report.csv';
      headers = ['Metric', 'Value'];
      rows = [
        ['Total Learners', totalLearnersCount],
        ['Active Programs', activeProgramsCount],
        ['Sessions Completed', totalCompletedSessions],
        ['Average Attendance', averageAttendance]
      ];
    } else if (type === 'Program Performance') {
      filename = 'program_performance_report.csv';
      headers = ['Program Name', 'Learners Count', 'Total Sessions', 'Completed Sessions', 'Attendance Rate'];
      programs.forEach(p => {
        const pLearners = learners.filter(l => l.program === p.name);
        const pSessions = p.sessions || [];
        const pCompleted = pSessions.filter(s => s.date && new Date(s.date) < today);
        let opps = 0;
        let pres = 0;
        pCompleted.forEach(s => {
          pLearners.forEach(l => {
            opps++;
            if ((s.attendance?.[l.id] || 'Present') === 'Present') pres++;
          });
        });
        const rate = opps > 0 ? `${Math.round((pres / opps) * 100)}%` : '—';
        rows.push([p.name, pLearners.length, pSessions.length, pCompleted.length, rate]);
      });
    } else if (type === 'Learner Engagement') {
      filename = 'learner_engagement_report.csv';
      headers = ['Name', 'Email', 'Program', 'Completed Sessions', 'Attended', 'Attendance Rate', 'Engagement Status'];
      learners.forEach(l => {
        const prog = programs.find(p => p.name === l.program);
        let completed = 0;
        let present = 0;
        if (prog) {
          (prog.sessions || []).forEach(s => {
            if (s.date && new Date(s.date) < today) {
              completed++;
              if ((s.attendance?.[l.id] || 'Present') === 'Present') present++;
            }
          });
        }
        const rate = completed > 0 ? (present / completed) : 1;
        const rateText = completed > 0 ? `${Math.round(rate * 100)}%` : '—';
        let status = 'Active';
        if (!l.program || l.program === 'None') status = 'Inactive';
        else if (completed > 0 && rate < 0.75) status = 'At Risk';

        rows.push([l.name, l.email, l.program || 'None', completed, present, rateText, status]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If a program details report is selected
  const selectedProgram = programs.find(p => p.id === selectedProgramId);
  const selectedProgramLearners = selectedProgram ? learners.filter(l => l.program === selectedProgram.name) : [];
  const selectedProgramSessions = selectedProgram ? (selectedProgram.sessions || []) : [];
  const completedSessionsInProg = selectedProgramSessions.filter(s => s.date && new Date(s.date) < today);

  let progOpps = 0;
  let progPres = 0;
  completedSessionsInProg.forEach(s => {
    selectedProgramLearners.forEach(l => {
      progOpps++;
      if ((s.attendance?.[l.id] || 'Present') === 'Present') progPres++;
    });
  });
  const progAttendanceRate = progOpps > 0 ? `${Math.round((progPres / progOpps) * 100)}%` : '—';

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      {/* Header title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Reports</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Understand program performance, learner engagement, and operational activity across your workspace.
          </p>
        </div>
        {selectedProgram && (
          <button 
            onClick={() => setSelectedProgramId(null)}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.82rem',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' 
            }}
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        )}
      </div>

      {!selectedProgram ? (
        <>
          {/* Workspace Overview Section */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>Workspace Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              {[
                { label: 'Total Learners', value: totalLearnersCount, icon: <Users size={20} />, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
                { label: 'Active Programs', value: activeProgramsCount, icon: <BookOpen size={20} />, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
                { label: 'Sessions Completed', value: totalCompletedSessions, icon: <Calendar size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
                { label: 'Average Attendance', value: averageAttendance, icon: <Percent size={20} />, color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
              ].map(card => (
                <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Performance & Learner Engagement side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Program Performance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Performance</h3>
              
              {programs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {programs.map(p => {
                    const pLearners = learners.filter(l => l.program === p.name);
                    const pSessions = p.sessions || [];
                    const pCompleted = pSessions.filter(s => s.date && new Date(s.date) < today);
                    let opps = 0;
                    let pres = 0;
                    pCompleted.forEach(s => {
                      pLearners.forEach(l => {
                        opps++;
                        if ((s.attendance?.[l.id] || 'Present') === 'Present') pres++;
                      });
                    });
                    const rate = opps > 0 ? `${Math.round((pres / opps) * 100)}%` : '—';

                    return (
                      <div key={p.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: 0 }}>{p.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', display: 'block', marginTop: '0.2rem' }}>
                              {pLearners.length} Participants · {pSessions.length} Sessions ({pCompleted.length} Completed)
                            </span>
                          </div>
                          <button 
                            onClick={() => setSelectedProgramId(p.id)}
                            style={{ 
                              backgroundColor: 'transparent', border: 'none', color: '#D4AF37', 
                              fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', 
                              gap: '0.2rem', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '4px' 
                            }}
                          >
                            View Report <ArrowUpRight size={13} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.85rem' }}>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Attendance</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>{rate}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Engagement</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>
                              {opps > 0 ? (pres / opps >= 0.85 ? 'High' : 'Medium') : '—'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Progress</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>
                              {pSessions.length > 0 ? `${Math.round((pCompleted.length / pSessions.length) * 100)}%` : '—'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>No programs scheduled yet.</p>
                </div>
              )}
            </div>

            {/* Learner Engagement Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Learner Engagement</h3>
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Engagement Overview</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>Active Learners</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#22c55e' }}>{activeLearners}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>At Risk (Low Attendance)</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#eab308' }}>{atRiskLearners}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>Inactive Learners</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>{inactiveLearners}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                  At-risk status triggers when a participant's attendance drops below 75% across all completed classes.
                </div>
              </div>
            </div>

          </div>

          {/* Attendance Overview & Reports Export */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Attendance Analytics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Attendance Overview</h3>
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {totalCompletedSessions > 0 ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>Average attendance rate</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{averageAttendance}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>Average Attendance per Program</div>
                      {programs.map(p => {
                        const pLearners = learners.filter(l => l.program === p.name);
                        const pCompleted = (p.sessions || []).filter(s => s.date && new Date(s.date) < today);
                        let opps = 0;
                        let pres = 0;
                        pCompleted.forEach(s => {
                          pLearners.forEach(l => {
                            opps++;
                            if ((s.attendance?.[l.id] || 'Present') === 'Present') pres++;
                          });
                        });
                        const rate = opps > 0 ? Math.round((pres / opps) * 100) : 0;
                        const rateText = opps > 0 ? `${rate}%` : '—';
                        return (
                          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{p.name}</span>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{rateText}</span>
                            </div>
                            {opps > 0 && (
                              <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${rate}%`, backgroundColor: '#3b82f6', borderRadius: '99px' }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                    <Percent size={28} color="rgba(255,255,255,0.15)" />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0 }}>Attendance data will appear after sessions are completed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reports and Export */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Reports & Exports</h3>
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>
                  Download verified tabular data from your workspace modules to generate custom compliance charts.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Workspace Overview Report', type: 'Workspace Overview' },
                    { label: 'Program Performance Report', type: 'Program Performance' },
                    { label: 'Learner Engagement & Status', type: 'Learner Engagement' }
                  ].map(rep => (
                    <button 
                      key={rep.label}
                      onClick={() => exportCSV(rep.type)}
                      style={{ 
                        width: '100%', padding: '0.7rem 0.95rem', backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff',
                        fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', cursor: 'pointer', transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileSpreadsheet size={15} color="#22c55e" /> {rep.label}
                      </span>
                      <Download size={14} color="rgba(255,255,255,0.4)" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* Detailed Program Specific Performance Report View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{selectedProgram.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Program Details: <strong>{selectedProgram.status || 'Active'}</strong> · Created on {selectedProgram.createdAt ? new Date(selectedProgram.createdAt).toLocaleDateString() : 'N/A'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enrolled Participants</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{selectedProgramLearners.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sessions</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{selectedProgramSessions.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed Sessions</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{completedSessionsInProg.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Attendance</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginTop: '0.15rem' }}>{progAttendanceRate}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Participants list & individual attendance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Participants Attendance Roll</h4>
              
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  <span>Participant</span>
                  <span>Joined Date</span>
                  <span style={{ textAlign: 'right' }}>Attended</span>
                </div>

                {selectedProgramLearners.length > 0 ? (
                  selectedProgramLearners.map(l => {
                    let present = 0;
                    completedSessionsInProg.forEach(s => {
                      if ((s.attendance?.[l.id] || 'Present') === 'Present') present++;
                    });
                    const rate = completedSessionsInProg.length > 0 ? `${Math.round((present / completedSessionsInProg.length) * 100)}%` : '—';
                    return (
                      <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{l.name}</span>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{l.email}</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{l.joinedDate || '—'}</span>
                        <span style={{ textAlign: 'right', fontWeight: 700, color: completedSessionsInProg.length === 0 ? 'rgba(255,255,255,0.3)' : (present / completedSessionsInProg.length >= 0.75 ? '#22c55e' : '#eab308') }}>
                          {completedSessionsInProg.length > 0 ? `${present}/${completedSessionsInProg.length} (${rate})` : '—'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    No participants enrolled in this program.
                  </div>
                )}
              </div>
            </div>

            {/* Sessions list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Sessions List</h4>
              
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  <span>Session Title</span>
                  <span>Schedule</span>
                  <span style={{ textAlign: 'right' }}>Status</span>
                </div>

                {selectedProgramSessions.length > 0 ? (
                  selectedProgramSessions.map(s => {
                    const isCompleted = s.date && new Date(s.date) < today;
                    let present = 0;
                    if (isCompleted) {
                      selectedProgramLearners.forEach(l => {
                        if ((s.attendance?.[l.id] || 'Present') === 'Present') present++;
                      });
                    }
                    const dayText = s.date ? new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—';
                    return (
                      <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{s.title}</span>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.type || 'Live'}</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{dayText} {s.startTime ? `@ ${s.startTime}` : ''}</span>
                        <span style={{ textAlign: 'right', fontWeight: 600, color: isCompleted ? '#22c55e' : '#3b82f6' }}>
                          {isCompleted ? `Completed (${present}/${selectedProgramLearners.length})` : 'Upcoming'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    No sessions scheduled for this program.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
