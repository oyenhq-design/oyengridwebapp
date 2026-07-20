import React, { useState } from 'react';
import { 
  Users, BookOpen, Calendar, Percent, ArrowLeft, ArrowUpRight, 
  Download, AlertTriangle, FileText, X, TrendingUp
} from 'lucide-react';

export default function ReportsTab({ programs = [], learners = [] }) {
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Chart states
  const [chartMetric, setChartMetric] = useState('Attendance');
  const [chartDateRange, setChartDateRange] = useState('Last 30 Days');
  const [chartCustomStart, setChartCustomStart] = useState('');
  const [chartCustomEnd, setChartCustomEnd] = useState('');

  // Generator flow state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [reportType, setReportType] = useState('Program Performance');
  const [targetProgram, setTargetProgram] = useState('All Programs');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Generated reports state
  const [generatedReports, setGeneratedReports] = useState([]);

  // 1. Live Workspace Metrics Calculations
  const activeProgramsCount = programs.length;
  const totalLearnersCount = learners.length;
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

  // Learner engagement live calculation
  let activeLearners = 0;
  let inactiveLearners = 0;
  let atRiskLearners = 0;
  let hasEngagementData = false;

  learners.forEach(l => {
    const hasProgram = l.program && l.program !== 'None';
    if (!hasProgram) {
      inactiveLearners++;
      return;
    }
    activeLearners++;

    const prog = programs.find(p => p.name === l.program);
    if (prog) {
      let completedInProg = 0;
      let presentInProg = 0;
      (prog.sessions || []).forEach(s => {
        const isCompleted = s.date && new Date(s.date) < today;
        if (isCompleted) {
          completedInProg++;
          hasEngagementData = true;
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

  // Calculate dynamic chart data points
  const getChartData = () => {
    let startBoundary = null;
    let endBoundary = new Date();

    if (chartDateRange === 'Last 7 Days') {
      startBoundary = new Date();
      startBoundary.setDate(startBoundary.getDate() - 7);
    } else if (chartDateRange === 'Last 30 Days') {
      startBoundary = new Date();
      startBoundary.setDate(startBoundary.getDate() - 30);
    } else if (chartDateRange === 'Last 90 Days') {
      startBoundary = new Date();
      startBoundary.setDate(startBoundary.getDate() - 90);
    } else if (chartDateRange === 'Custom Range') {
      if (chartCustomStart) startBoundary = new Date(chartCustomStart);
      if (chartCustomEnd) endBoundary = new Date(chartCustomEnd);
    }

    const dataPoints = [];
    programs.forEach(p => {
      const pLearners = learners.filter(l => l.program === p.name);
      (p.sessions || []).forEach(s => {
        if (!s.date) return;
        const sDate = new Date(s.date);
        const isCompleted = sDate < today;
        if (!isCompleted) return;
        
        if (startBoundary && sDate < startBoundary) return;
        if (endBoundary && sDate > endBoundary) return;

        let attendanceRate = 0;
        let learnerCount = pLearners.length;
        let present = 0;
        
        if (learnerCount > 0) {
          pLearners.forEach(l => {
            if ((s.attendance?.[l.id] || 'Present') === 'Present') present++;
          });
          attendanceRate = Math.round((present / learnerCount) * 100);
        } else {
          attendanceRate = 100;
        }

        let engagementVal = attendanceRate;
        if (s.notes) engagementVal = Math.min(100, engagementVal + 10);
        if ((s.resources || []).length > 0) engagementVal = Math.min(100, engagementVal + 10);

        let assessmentVal = 0;
        const assessments = p.assessments || [];
        if (assessments.length > 0) {
          assessmentVal = 85; 
        } else {
          assessmentVal = 70;
        }

        dataPoints.push({
          date: sDate,
          dateString: sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          title: s.title,
          program: p.name,
          attendance: attendanceRate,
          engagement: engagementVal,
          sessions: 1,
          assessment: assessmentVal
        });
      });
    });

    dataPoints.sort((a, b) => a.date - b.date);

    if (chartMetric === 'Sessions') {
      let cumulative = 0;
      dataPoints.forEach(pt => {
        cumulative++;
        pt.sessionsCumulative = cumulative;
      });
    }

    return dataPoints;
  };

  const chartData = getChartData();
  const hasEnoughChartData = chartData.length >= 2;

  // 2. Report Generation Logic
  const handleGenerateSubmit = (e) => {
    e.preventDefault();

    let startBoundary = null;
    let endBoundary = new Date();

    if (dateRange === 'Last 7 Days') {
      startBoundary = new Date();
      startBoundary.setDate(startBoundary.getDate() - 7);
    } else if (dateRange === 'Last 30 Days') {
      startBoundary = new Date();
      startBoundary.setDate(startBoundary.getDate() - 30);
    } else if (dateRange === 'Last 90 Days') {
      startBoundary = new Date();
      startBoundary.setDate(startBoundary.getDate() - 90);
    } else if (dateRange === 'Custom Range') {
      if (customStartDate) startBoundary = new Date(customStartDate);
      if (customEndDate) endBoundary = new Date(customEndDate);
    }

    const filteredProgs = targetProgram === 'All Programs' 
      ? programs 
      : programs.filter(p => p.name === targetProgram);

    const reportResults = {
      generatedAt: new Date().toLocaleString(),
      totalProgramsScanned: filteredProgs.length,
      insufficientData: false,
      missingFields: [],
      programSummaries: [],
      learnerMetrics: [],
      attendanceRate: '—',
      healthScore: '—',
      healthStatus: 'Unknown',
      recommendations: []
    };

    let totalOpps = 0;
    let totalPres = 0;
    let totalSessionsScanned = 0;
    let completedSessionsScanned = 0;
    let totalResourcesCount = 0;
    let totalAssessmentsCount = 0;

    filteredProgs.forEach(p => {
      const pLearners = learners.filter(l => l.program === p.name);
      const pSessions = p.sessions || [];
      totalResourcesCount += (p.resources || []).length;
      totalAssessmentsCount += (p.assessments || []).length;

      const inRangeSessions = pSessions.filter(s => {
        if (!s.date) return false;
        const sDate = new Date(s.date);
        if (startBoundary && sDate < startBoundary) return false;
        if (endBoundary && sDate > endBoundary) return false;
        return true;
      });

      totalSessionsScanned += inRangeSessions.length;

      const completedSessions = inRangeSessions.filter(s => new Date(s.date) < today);
      completedSessionsScanned += completedSessions.length;

      let progOpps = 0;
      let progPres = 0;

      completedSessions.forEach(s => {
        pLearners.forEach(l => {
          progOpps++;
          totalOpps++;
          if ((s.attendance?.[l.id] || 'Present') === 'Present') {
            progPres++;
            totalPres++;
          }
        });
      });

      const progRate = progOpps > 0 ? `${Math.round((progPres / progOpps) * 100)}%` : '—';

      reportResults.programSummaries.push({
        name: p.name,
        learnersCount: pLearners.length,
        totalSessions: inRangeSessions.length,
        completedSessions: completedSessions.length,
        attendanceRate: progRate,
        resourcesCount: (p.resources || []).length,
        assessmentsCount: (p.assessments || []).length
      });
    });

    if (totalOpps > 0) {
      reportResults.attendanceRate = `${Math.round((totalPres / totalOpps) * 100)}%`;
    }

    if (reportType === 'Program Health' || reportType === 'Operational Insights') {
      if (completedSessionsScanned === 0) {
        reportResults.insufficientData = true;
        reportResults.missingFields.push('Completed session attendance history in the selected range');
      } else {
        const rateVal = totalPres / totalOpps;
        let score = Math.round(rateVal * 100);
        reportResults.healthScore = `${score}%`;
        if (score >= 85) {
          reportResults.healthStatus = 'Healthy';
          reportResults.recommendations.push('Keep up the strong engagement. Learner turnout is excellent.');
        } else if (score >= 70) {
          reportResults.healthStatus = 'Needs Attention';
          reportResults.recommendations.push('Consider sending session reminders to learners. Turnout is average.');
        } else {
          reportResults.healthStatus = 'Critical Risk';
          reportResults.recommendations.push('Urgent: Attendance is critically low. Review facilitator feedback and session timings.');
        }

        if (totalResourcesCount === 0) {
          reportResults.recommendations.push('Resource availability is zero. Upload course materials to enhance learner interaction.');
        }
      }
    }

    if (reportType === 'Attendance' && completedSessionsScanned === 0) {
      reportResults.insufficientData = true;
      reportResults.missingFields.push('Completed sessions');
    }

    if (reportType === 'Engagement' && totalLearnersCount === 0) {
      reportResults.insufficientData = true;
      reportResults.missingFields.push('Registered learners');
    }

    const newReport = {
      id: Date.now(),
      name: `${targetProgram === 'All Programs' ? 'Workspace' : targetProgram} ${reportType} Report`,
      type: reportType,
      program: targetProgram,
      dateRange: dateRange === 'Custom Range' ? `${customStartDate} to ${customEndDate}` : dateRange,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      results: reportResults
    };

    setGeneratedReports(p => [newReport, ...p]);
    setShowConfigModal(false);
    setSelectedReport(newReport);
  };

  const exportCSV = (type) => {
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

  const triggerGenerateWithProgram = (progName) => {
    setTargetProgram(progName);
    setReportType('Program Performance');
    setDateRange('Last 30 Days');
    setShowConfigModal(true);
  };

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
        {selectedReport && (
          <button 
            onClick={() => setSelectedReport(null)}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', fontSize: '0.82rem',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' 
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        )}
      </div>

      {!selectedReport ? (
        <>
          {/* 1. Live Workspace Overview */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>Workspace Overview</h3>
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

          {/* New Main Chart Component: Program Activity Trend */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Activity Trend</h3>
              </div>
              
              {/* Chart Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Metric Selector */}
                <div style={{ display: 'flex', backgroundColor: '#000', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Attendance', 'Engagement', 'Sessions', 'Assessment Performance'].map(m => {
                    const isSelected = chartMetric === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setChartMetric(m)}
                        style={{
                          backgroundColor: isSelected ? '#161822' : 'transparent',
                          color: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>

                {/* Date range selector */}
                <select 
                  value={chartDateRange} 
                  onChange={e => setChartDateRange(e.target.value)} 
                  style={{ 
                    backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '8px', color: '#fff', padding: '0.35rem 0.65rem', 
                    fontSize: '0.75rem', cursor: 'pointer', outline: 'none' 
                  }}
                >
                  {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Range'].map(d => (
                    <option key={d} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{d}</option>
                  ))}
                </select>

                {chartDateRange === 'Custom Range' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <input 
                      type="date" 
                      value={chartCustomStart} 
                      onChange={e => setChartCustomStart(e.target.value)} 
                      style={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', padding: '0.25rem 0.45rem', fontSize: '0.7rem' }} 
                    />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>to</span>
                    <input 
                      type="date" 
                      value={chartCustomEnd} 
                      onChange={e => setChartCustomEnd(e.target.value)} 
                      style={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', padding: '0.25rem 0.45rem', fontSize: '0.7rem' }} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Chart Graphic Area */}
            <div style={{ position: 'relative', width: '100%', height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {hasEnoughChartData ? (
                (() => {
                  const width = 750;
                  const height = 180;
                  const paddingLeft = 45;
                  const paddingRight = 20;
                  const paddingTop = 15;
                  const paddingBottom = 25;
                  const chartW = width - paddingLeft - paddingRight;
                  const chartH = height - paddingTop - paddingBottom;

                  // Get points matching current metric
                  const points = chartData.map((pt, i) => {
                    let val = 0;
                    if (chartMetric === 'Attendance') val = pt.attendance;
                    else if (chartMetric === 'Engagement') val = pt.engagement;
                    else if (chartMetric === 'Sessions') val = pt.sessionsCumulative;
                    else if (chartMetric === 'Assessment Performance') val = pt.assessment;
                    return { x: i, y: val, label: pt.dateString, tooltip: `${pt.program}: ${pt.title} (${val}${chartMetric !== 'Sessions' ? '%' : ''})` };
                  });

                  const maxVal = chartMetric === 'Sessions' ? Math.max(...points.map(p => p.y), 10) : 100;
                  const minVal = 0;

                  // Compute layout coordinates
                  const coordinates = points.map((p, idx) => {
                    const xCoord = paddingLeft + (idx / (points.length - 1)) * chartW;
                    const yRatio = (p.y - minVal) / (maxVal - minVal);
                    const yCoord = paddingTop + (1 - yRatio) * chartH;
                    return { ...p, cx: xCoord, cy: yCoord };
                  });

                  // Build path commands
                  let pathD = `M ${coordinates[0].cx} ${coordinates[0].cy}`;
                  for (let idx = 1; idx < coordinates.length; idx++) {
                    pathD += ` L ${coordinates[idx].cx} ${coordinates[idx].cy}`;
                  }

                  // Build filled area path
                  const fillD = `${pathD} L ${coordinates[coordinates.length - 1].cx} ${height - paddingBottom} L ${coordinates[0].cx} ${height - paddingBottom} Z`;

                  return (
                    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis gridlines & labels */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const yVal = Math.round(minVal + ratio * (maxVal - minVal));
                        const yCoord = paddingTop + (1 - ratio) * chartH;
                        return (
                          <g key={i}>
                            <line 
                              x1={paddingLeft} 
                              y1={yCoord} 
                              x2={width - paddingRight} 
                              y2={yCoord} 
                              stroke="rgba(255,255,255,0.04)" 
                              strokeWidth="1" 
                            />
                            <text 
                              x={paddingLeft - 8} 
                              y={yCoord + 4} 
                              fill="rgba(255,255,255,0.3)" 
                              fontSize="9" 
                              textAnchor="end"
                              fontFamily="sans-serif"
                            >
                              {yVal}{chartMetric !== 'Sessions' ? '%' : ''}
                            </text>
                          </g>
                        );
                      })}

                      {/* X-axis date labels */}
                      {coordinates.map((pt, idx) => {
                        // Display every point if few, or filter to avoid overlap
                        if (coordinates.length > 8 && idx % Math.ceil(coordinates.length / 8) !== 0) return null;
                        return (
                          <text 
                            key={idx}
                            x={pt.cx} 
                            y={height - 6} 
                            fill="rgba(255,255,255,0.35)" 
                            fontSize="9" 
                            textAnchor="middle"
                            fontFamily="sans-serif"
                          >
                            {pt.label}
                          </text>
                        );
                      })}

                      {/* Filled under area */}
                      <path d={fillD} fill="url(#chartGrad)" />

                      {/* Trend line */}
                      <path 
                        d={pathD} 
                        fill="none" 
                        stroke="#D4AF37" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      {/* Interaction dot highlights */}
                      {coordinates.map((pt, idx) => (
                        <g key={idx} className="chart-dot-group">
                          <circle 
                            cx={pt.cx} 
                            cy={pt.cy} 
                            r="4" 
                            fill="#D4AF37" 
                            stroke="#0c0d12" 
                            strokeWidth="1.5" 
                          />
                          <title>{pt.tooltip}</title>
                        </g>
                      ))}
                    </svg>
                  );
                })()
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Not enough data yet</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0, maxWidth: '280px' }}>
                    Complete sessions or add program activity to generate this insight.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. & 3. Program Performance & Learner Engagement side-by-side */}
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
                            onClick={() => triggerGenerateWithProgram(p.name)}
                            style={{ 
                              backgroundColor: 'transparent', border: 'none', color: '#D4AF37', 
                              fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', 
                              gap: '0.2rem', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '4px' 
                            }}
                          >
                            Generate Report <ArrowUpRight size={13} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.85rem' }}>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Attendance</div>
                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                              {pCompleted.length > 0 ? 'Data loaded' : 'No attendance data yet'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Engagement</div>
                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                              {pCompleted.length > 0 ? 'Data loaded' : 'No engagement data yet'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Performance</div>
                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                              {pCompleted.length > 0 ? 'Data loaded' : 'No performance data yet'}
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

            {/* Learner Engagement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Learner Engagement</h3>
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Engagement Overview</div>
                
                {hasEngagementData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>Active Learners</span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#22c55e' }}>{activeLearners}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>At Risk Learners</span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#eab308' }}>{atRiskLearners}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>Inactive Learners</span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>{inactiveLearners}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '1rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                    <AlertTriangle size={24} color="rgba(255,255,255,0.15)" />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0, textAlign: 'center' }}>
                      Engagement data will appear after program activity begins.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 4. & 5. Attendance Overview & Generate a Report */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Attendance Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Attendance Overview</h3>
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
                {totalCompletedSessions > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>Workspace turnout average</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{averageAttendance}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
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
                        return (
                          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{p.name}</span>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{opps > 0 ? `${rate}%` : 'No completed sessions'}</span>
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
                  </div>
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>No attendance data yet</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0 }}>
                      Attendance insights will appear after your first session is completed.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Generate a Report Config */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Generate a Report</h3>
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>
                  Analyse your actual program and workspace data.
                </p>
                <button 
                  onClick={() => setShowConfigModal(true)}
                  style={{ 
                    width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)',
                    border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '0.45rem'
                  }}
                >
                  <FileText size={16} /> Generate Report
                </button>
              </div>
            </div>

          </div>

          {/* 7. Recent Reports */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>Recent Reports</h3>
            {generatedReports.length > 0 ? (
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr auto', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                  <span>Report Name</span>
                  <span>Report Type</span>
                  <span>Target Program</span>
                  <span>Date Range</span>
                  <span></span>
                </div>
                {generatedReports.map(rep => (
                  <div key={rep.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr auto', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{rep.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Generated on {rep.date}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{rep.type}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{rep.program}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{rep.dateRange}</span>
                    <button 
                      onClick={() => setSelectedReport(rep)}
                      style={{ background: 'none', border: 'none', color: '#D4AF37', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>No reports generated yet</div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem', marginBottom: 0 }}>
                  Generate a report to analyse your workspace activity.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 6. Dynamic Generated Report Details View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{selectedReport.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Type: <strong>{selectedReport.type}</strong> · Date Range: <strong>{selectedReport.dateRange}</strong> · Generated on {selectedReport.date}
                </p>
              </div>
              <button 
                onClick={() => exportCSV(selectedReport.type)}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px', color: '#fff', padding: '0.45rem 0.85rem', fontSize: '0.78rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4' 
                }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            {selectedReport.results.insufficientData ? (
              <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)', borderRadius: '8px', padding: '1.1rem', display: 'flex', gap: '0.75rem' }}>
                <AlertTriangle size={18} color="#eab308" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>Insufficient Workspace Data</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem', margin: '0.3rem 0 0 0', lineHeight: 1.45 }}>
                    We could not generate full analysis metrics because the following data is missing for your selection:
                  </p>
                  <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                    {selectedReport.results.missingFields.map((field, i) => (
                      <li key={i}>{field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Programs Scanned</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{selectedReport.results.totalProgramsScanned}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Attendance Rate</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginTop: '0.15rem' }}>{selectedReport.results.attendanceRate}</div>
                </div>
                {(selectedReport.type === 'Program Health' || selectedReport.type === 'Operational Insights') && (
                  <>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Health Score</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7', marginTop: '0.15rem' }}>{selectedReport.results.healthScore}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Status</div>
                      <span style={{ 
                        display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, 
                        color: selectedReport.results.healthStatus === 'Healthy' ? '#22c55e' : '#eab308', 
                        backgroundColor: selectedReport.results.healthStatus === 'Healthy' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', 
                        padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.35rem' 
                      }}>
                        {selectedReport.results.healthStatus}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {!selectedReport.results.insufficientData && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              
              {/* Table details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Analysis Roll</h4>
                <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                    <span>Program</span>
                    <span style={{ textAlign: 'center' }}>Learners</span>
                    <span style={{ textAlign: 'center' }}>Sessions</span>
                    <span style={{ textAlign: 'right' }}>Attendance</span>
                  </div>
                  {selectedReport.results.programSummaries.map((p, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', alignItems: 'center' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{p.name}</span>
                      <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>{p.learnersCount}</span>
                      <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>{p.totalSessions} ({p.completedSessions} done)</span>
                      <span style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>{p.attendanceRate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Action Items */}
              {(selectedReport.type === 'Program Health' || selectedReport.type === 'Operational Insights') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Actionable Insights</h4>
                  <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {selectedReport.results.recommendations.map((rec, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37', marginTop: '0.45rem', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.45 }}>{rec}</span>
                      </div>
                    ))}
                    {selectedReport.results.recommendations.length === 0 && (
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>No recommendations needed at this time.</span>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 5. Generate Report Configuration Flow Modal */}
      {showConfigModal && (
        <div style={modalOverlay} onClick={() => setShowConfigModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Generate a Report</h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>Configure report type, data scopes, and parameters</p>
              </div>
              <button onClick={() => setShowConfigModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={labelStyle}>Report Type</label>
                <div style={{ position: 'relative' }}>
                  <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    {[
                      'Program Performance',
                      'Learner Performance',
                      'Attendance',
                      'Engagement',
                      'Program Health',
                      'Operational Insights'
                    ].map(t => <option key={t} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Program Scope</label>
                <div style={{ position: 'relative' }}>
                  <select value={targetProgram} onChange={e => setTargetProgram(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option style={{ backgroundColor: '#0e0f14', color: '#fff' }}>All Programs</option>
                    {programs.map(p => <option key={p.id} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Date Range</label>
                <div style={{ position: 'relative' }}>
                  <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Range'].map(d => <option key={d} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>{d}</option>)}
                  </select>
                </div>
              </div>

              {dateRange === 'Custom Range' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date</label>
                    <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} style={inputStyle} required />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowConfigModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Run Analysis</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Visual layout helper objects
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalBox = {
  backgroundColor: '#0c0d12',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '2rem',
  width: '100%',
  maxWidth: '460px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  textAlign: 'left'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '0.35rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.82rem',
  outline: 'none',
  boxSizing: 'border-box'
};
