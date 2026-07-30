import React, { useState } from 'react';
import { 
  Users, BookOpen, Calendar, Percent, ArrowLeft, ArrowUpRight, 
  Download, AlertTriangle, FileText, X, TrendingUp, Sparkles,
  Award, BarChart3, ChevronDown, CheckCircle, RefreshCw, Star,
  Clock, ShieldAlert, ArrowDownRight, Share2, Mail, Check
} from 'lucide-react';

export default function ReportsTab({ programs = [], learners = [], addNotification }) {
  // Global Filters State
  const [workspaceFilter, setWorkspaceFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [facilitatorFilter, setFacilitatorFilter] = useState('All');
  const [learnerFilter, setLearnerFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('Last 30 Days');
  const [statusFilter, setStatusFilter] = useState('All');

  // Chart & Interactive states
  const [chartMetric, setChartMetric] = useState('Attendance');
  const [chartDateRange, setChartDateRange] = useState('Last 30 Days');
  
  // Custom Generate Report State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    attendance: true,
    learners: true,
    assessments: true,
    facilitators: true,
    certificates: true
  });
  const [selectedReportType, setSelectedReportType] = useState('Executive Summary');
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  // Scheduled reports states
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, name: 'Weekly Workspace Summary', schedule: 'Every Monday', enabled: true },
    { id: 2, name: 'Monthly Executive Report', schedule: '1st of every month', enabled: true },
    { id: 3, name: 'Quarterly Performance Report', schedule: '1st of quarter', enabled: false }
  ]);

  // Recent generated reports list
  const [recentReports, setRecentReports] = useState([
    { id: 1, name: 'Attendance Summary', format: 'PDF', generated: 'Yesterday' },
    { id: 2, name: 'Assessment Analytics', format: 'Excel', generated: '2 days ago' },
    { id: 3, name: 'Executive Leadership Report', format: 'PDF', generated: 'Last week' }
  ]);

  const resetFilters = () => {
    setWorkspaceFilter('All');
    setProgramFilter('All');
    setFacilitatorFilter('All');
    setLearnerFilter('All');
    setDateRangeFilter('Last 30 Days');
    setStatusFilter('All');
    addNotification?.('Filters reset to default');
  };

  const handleToggleSchedule = (id) => {
    setScheduledReports(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    addNotification?.('Scheduled report preference updated');
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    const newRep = {
      id: Date.now(),
      name: `${selectedReportType} (${Object.keys(selectedSections).filter(k=>selectedSections[k]).join(', ')})`,
      format: selectedFormat,
      generated: 'Just now'
    };
    setRecentReports(prev => [newRep, ...prev]);
    setShowConfigModal(false);
    addNotification?.(`Successfully generated ${selectedReportType} Report in ${selectedFormat} format!`);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>Reports</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem', margin: 0 }}>
            Understand program performance, learner engagement, attendance, assessments, and operational activity across your workspace.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select 
            value={dateRangeFilter} 
            onChange={e => setDateRangeFilter(e.target.value)}
            style={{ padding: '0.6rem 0.85rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '10px', fontSize: '0.82rem', color: '#151515', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          
          <button 
            onClick={() => addNotification?.('Exporting workspace records...')}
            style={{ padding: '0.6rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '10px', fontSize: '0.82rem', color: '#151515', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}
          >
            <Download size={15} /> Export
          </button>
          
          <button 
            onClick={() => setShowConfigModal(true)}
            style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5C84C', border: '1px solid #F5C84C', borderRadius: '10px', fontSize: '0.82rem', color: '#151515', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,200,76,0.15)' }}
          >
            <FileText size={15} /> Generate Report
          </button>
        </div>
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '14px', padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(100,90,75,0.02)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workspace</span>
            <select value={workspaceFilter} onChange={e => setWorkspaceFilter(e.target.value)} style={{ padding: '0.35rem 0.5rem', border: '1px solid #F3EFE6', borderRadius: '6px', fontSize: '0.78rem', color: '#374151', cursor: 'pointer' }}>
              <option>All</option>
              <option>ABC Energy</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program</span>
            <select value={programFilter} onChange={e => setProgramFilter(e.target.value)} style={{ padding: '0.35rem 0.5rem', border: '1px solid #F3EFE6', borderRadius: '6px', fontSize: '0.78rem', color: '#374151', cursor: 'pointer' }}>
              <option>All</option>
              <option>Leadership Orientation</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facilitator</span>
            <select value={facilitatorFilter} onChange={e => setFacilitatorFilter(e.target.value)} style={{ padding: '0.35rem 0.5rem', border: '1px solid #F3EFE6', borderRadius: '6px', fontSize: '0.78rem', color: '#374151', cursor: 'pointer' }}>
              <option>All</option>
              <option>Sarah Ahmed</option>
              <option>Michael Ibrahim</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Participant</span>
            <select value={learnerFilter} onChange={e => setLearnerFilter(e.target.value)} style={{ padding: '0.35rem 0.5rem', border: '1px solid #F3EFE6', borderRadius: '6px', fontSize: '0.78rem', color: '#374151', cursor: 'pointer' }}>
              <option>All</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.35rem 0.5rem', border: '1px solid #F3EFE6', borderRadius: '6px', fontSize: '0.78rem', color: '#374151', cursor: 'pointer' }}>
              <option>All</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        <button 
          onClick={resetFilters}
          style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid #E8E2D8', borderRadius: '8px', fontSize: '0.78rem', color: '#4B5563', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
        >
          <RefreshCw size={12} /> Reset Filters
        </button>
      </div>

      {/* ── WORKSPACE KPI SECTION (6-Card Grid) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Total Programs', value: '12', trend: '+2 this month', isUp: true, icon: <BookOpen size={18} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Active Learners', value: '486', trend: '+8% this week', isUp: true, icon: <Users size={18} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Sessions Completed', value: '124', trend: '+15 this month', isUp: true, icon: <Calendar size={18} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Average Attendance', value: '91%', trend: '+3% improvement', isUp: true, icon: <Percent size={18} />, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
          { label: 'Assessment Completion', value: '84%', trend: '+6% this month', isUp: true, icon: <Award size={18} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
          { label: 'Certificates Issued', value: '276', trend: '+24 this month', isUp: true, icon: <Award size={18} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="kpi-card" 
            style={{ 
              backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '1.5rem', 
              display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
              transition: 'transform 0.2s', cursor: 'pointer' 
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                {kpi.icon}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>{kpi.value}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: kpi.isUp ? '#34D399' : '#F87171' }}>
              {kpi.isUp ? <TrendingUp size={12} /> : <ArrowDownRight size={12} />}
              <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI EXECUTIVE SUMMARY ── */}
      <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="#F5D76E" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>AI Executive Summary</h3>
          </div>
          <button 
            onClick={() => addNotification?.('Opening full cognitive report breakdown...')}
            style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #374151', borderRadius: '8px', fontSize: '0.78rem', color: '#F5D76E', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            View Full Analysis <ArrowUpRight size={13} />
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            'Attendance increased by 12% over the last 30 days.',
            '3 learners may require follow-up due to low engagement.',
            'Assessment completion reached 84% across active programs.',
            'Leadership Orientation is currently the highest-performing program.',
            'Facilitator response time improved by 18% this month.'
          ].map((insight, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(245,215,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5D76E', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem' }}>
                {idx + 1}
              </div>
              <span style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROGRAM ACTIVITY TREND & ATTENDANCE OVERVIEW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Line Chart Trend */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#F5D76E" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Activity Trend</h3>
            </div>
            
            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {['Attendance', 'Engagement', 'Sessions', 'Assessments', 'Certificates', 'AI Insights'].map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setChartMetric(m);
                    addNotification?.(`Switched activity trend metric to ${m}`);
                  }}
                  style={{
                    backgroundColor: chartMetric === m ? '#F5D76E' : 'transparent',
                    color: chartMetric === m ? '#0B0F17' : '#94A3B8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.50rem', justifyContent: 'flex-end', fontSize: '0.72rem', color: '#94A3B8' }}>
            {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'Custom Range'].map(range => (
              <span 
                key={range} 
                onClick={() => setChartDateRange(range)}
                style={{ cursor: 'pointer', color: chartDateRange === range ? '#F5D76E' : '#94A3B8', fontWeight: chartDateRange === range ? 700 : 400, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: chartDateRange === range ? 'rgba(245,215,110,0.1)' : 'transparent' }}
              >
                {range}
              </span>
            ))}
          </div>

          {/* Interactive SVG Chart Graphic */}
          <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 700 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5D76E" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#F5D76E" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Y Gridlines */}
              {[0, 25, 50, 75, 100].map((val, i) => {
                const y = 150 - (val / 100) * 120;
                return (
                  <g key={i}>
                    <line x1="40" y1={y} x2="680" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <text x="30" y={y + 3} fill="#94A3B8" fontSize="9" textAnchor="end">{val}%</text>
                  </g>
                );
              })}
              
              {/* X Date Labels */}
              {['05 Jul', '10 Jul', '15 Jul', '20 Jul', '25 Jul', '30 Jul'].map((label, idx) => {
                const x = 40 + (idx / 5) * 640;
                return (
                  <text key={idx} x={x} y="170" fill="#94A3B8" fontSize="9" textAnchor="middle">{label}</text>
                );
              })}

              {/* Area & Trend line */}
              <path d="M 40 90 Q 168 110 296 60 T 552 40 L 680 80 L 680 150 L 40 150 Z" fill="url(#trendGrad)" />
              <path d="M 40 90 Q 168 110 296 60 T 552 40 L 680 80" fill="none" stroke="#F5D76E" strokeWidth="2.5" strokeLinecap="round" />

              {/* Sparkles Highlights */}
              {[
                { x: 40, y: 90, tooltip: '05 Jul: 75%' },
                { x: 168, y: 110, tooltip: '10 Jul: 68%' },
                { x: 296, y: 60, tooltip: '15 Jul: 85%' },
                { x: 424, y: 50, tooltip: '20 Jul: 88%' },
                { x: 552, y: 40, tooltip: '25 Jul: 91%' },
                { x: 680, y: 80, tooltip: '30 Jul: 80%' }
              ].map((pt, idx) => (
                <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="#F5D76E" stroke="#0B0F17" strokeWidth="1.5" style={{ cursor: 'pointer' }}>
                  <title>{pt.tooltip}</title>
                </circle>
              ))}
            </svg>
          </div>
        </div>

        {/* Weekly Attendance Bar Chart Card */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Attendance Overview</h3>
            <button 
              onClick={() => addNotification?.('Downloading attendance audit CSV...')}
              style={{ background: 'none', border: 'none', color: '#F5D76E', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Download CSV
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>91%</span>
            <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>Average turnout</span>
          </div>

          {/* Sparkbar chart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '90px', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {[85, 92, 78, 94, 88, 96, 91].map((val, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '24px' }}>
                <div style={{ height: `${(val / 100) * 60}px`, width: '100%', backgroundColor: '#F5D76E', borderRadius: '4px 4px 0 0', opacity: idx === 6 ? 1 : 0.6 }} />
                <span style={{ fontSize: '8px', color: '#94A3B8' }}>W{idx+1}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.78rem', color: '#94A3B8' }}>
            <div>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Late Arrivals</span>
              <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>4.2% average</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Absences</span>
              <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>8.8% average</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ── PROGRAM PERFORMANCE TABLE & LEARNER ENGAGEMENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Program Performance Table */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Program Performance</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1F2937', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Program</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Participants</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Attendance</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Completion</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Assessments</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Leadership Orientation', learners: 184, attendance: '94%', completion: '88%', assessments: '86%', status: 'Excellent', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                  { name: 'Technical Bootcamp v2', learners: 156, attendance: '91%', completion: '82%', assessments: '80%', status: 'Good', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                  { name: 'Graduate Fellowship', learners: 92, attendance: '88%', completion: '76%', assessments: '74%', status: 'Needs Attention', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
                  { name: 'Basic Corporate Onboarding', learners: 54, attendance: '72%', completion: '64%', assessments: '58%', status: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', color: '#E2E8F0' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{row.name}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{row.participants}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{row.attendance}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{row.completion}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{row.assessments}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: row.color, backgroundColor: row.bg, padding: '0.25rem 0.55rem', borderRadius: '6px' }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Learner Engagement Donut + List */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Participant Engagement</h3>
          
          {/* Donut Simulation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', border: '8px solid #F5D76E', borderTopColor: '#3B82F6', borderRightColor: '#10B981', borderLeftColor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>92%</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Highly Engaged (65%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} /> Moderately Engaged (20%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} /> Low Engagement (10%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} /> At Risk (5%)</div>
            </div>
          </div>

          {/* Top Active Learners List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Active Participants</span>
            {[
              { name: 'Adewale Kalu', program: 'Leadership Orientation', score: '98', time: 'Active 2m ago', init: 'AK' },
              { name: 'Sarah Ahmed', program: 'Technical Bootcamp', score: '96', time: 'Active 12m ago', init: 'SA' },
              { name: 'Michael Ibrahim', program: 'Graduate Fellowship', score: '94', time: 'Active 1h ago', init: 'MI' }
            ].map((usr, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(245,215,110,0.1)', border: '1px solid rgba(245,215,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#F5D76E', flexShrink: 0 }}>
                  {usr.init}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usr.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usr.program}</div>
                </div>
                <div style={{ textAnchor: 'end', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F5D76E' }}>{usr.score}%</div>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>{usr.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── FACILITATOR LEADERBOARD & ASSESSMENT ANALYTICS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Facilitator Leaderboard */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Facilitator Performance Leaderboard</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: 'Dr. Ngozi Aliyu', sessions: 48, rating: 4.9, attendanceImpact: '+12%', completion: '96%', init: 'NA' },
              { name: 'Michael Ibrahim', sessions: 38, rating: 4.8, attendanceImpact: '+8%', completion: '92%', init: 'MI' },
              { name: 'Sarah Ahmed', sessions: 32, rating: 4.7, attendanceImpact: '+6%', completion: '89%', init: 'SA' }
            ].map((fac, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1rem', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {fac.init}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{fac.name}</div>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                    <span>{fac.sessions} Sessions Done</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: '#F5D76E' }}>
                      <Star size={10} fill="#F5D76E" /> {fac.rating} Rating
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', textAlign: 'right' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '8px', color: '#6B7280', textTransform: 'uppercase' }}>Attendance Impact</span>
                    <strong style={{ color: '#34D399' }}>{fac.attendanceImpact}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '8px', color: '#6B7280', textTransform: 'uppercase' }}>Completion Contribution</span>
                    <strong style={{ color: '#FFFFFF' }}>{fac.completion}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Analytics Card */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Assessment Analytics</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.1rem' }}>
            <div>
              <span style={{ fontSize: '8px', color: '#6B7280', textTransform: 'uppercase', display: 'block' }}>Average Score</span>
              <strong style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>82.4%</strong>
            </div>
            <div>
              <span style={{ fontSize: '8px', color: '#6B7280', textTransform: 'uppercase', display: 'block' }}>Pass Rate</span>
              <strong style={{ fontSize: '1.4rem', color: '#34D399' }}>94.2%</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.50rem', fontSize: '0.72rem', color: '#94A3B8' }}>
            <div>
              <span style={{ display: 'block', fontSize: '8px', color: '#6B7280' }}>Highest Score</span>
              <strong style={{ color: '#FFFFFF' }}>99%</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '8px', color: '#6B7280' }}>Lowest Score</span>
              <strong style={{ color: '#EF4444' }}>46%</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '8px', color: '#6B7280' }}>Fail Rate</span>
              <strong style={{ color: '#EF4444' }}>5.8%</strong>
            </div>
          </div>

          {/* Mini trend sparkline SVG */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '8px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Trend Over Time</span>
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: '35px', overflow: 'visible' }}>
              <path d="M 0 30 Q 40 10 80 25 T 160 15 L 200 5" fill="none" stroke="#F5D76E" strokeWidth="2" />
            </svg>
          </div>
        </div>

      </div>

      {/* ── WORKSPACE HEALTH SCORE & RISK DETECTION PANEL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Workspace Health Score circular gauge */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif", width: '100%', textAlign: 'left' }}>Workspace Health</h3>
          
          <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
            <svg width="100%" height="100%" viewBox="0 0 36 36" style={{ overflow: 'visible' }}>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F5D76E" strokeWidth="3" strokeDasharray="92 8" strokeDashoffset="25" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>92%</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>Excellent</span>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.76rem', color: '#94A3B8' }}>
            {[
              { label: 'Attendance', val: 91 },
              { label: 'Engagement', val: 94 },
              { label: 'Assessments', val: 84 },
              { label: 'Facilitators', val: 96 }
            ].map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{m.label}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{m.val}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${m.val}%`, backgroundColor: '#F5D76E', borderRadius: '99px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Detection Alert Monitoring Panel */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="#F5D76E" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Risk Detection & Alert Panel</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { text: '4 participants have not attended in 14 days', action: 'Follow Up', type: 'risk' },
              { text: '2 assessments are due within 24 hours', action: 'Send Reminder', type: 'alert' },
              { text: 'Leadership Orientation attendance dropped 10%', action: 'View Analysis', type: 'risk' },
              { text: '1 session has no facilitator assigned', action: 'Assign Facilitator', type: 'critical' }
            ].map((alert, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(248,113,113,0.03)', border: '1px solid rgba(248,113,113,0.1)', padding: '0.85rem 1.25rem', borderRadius: '12px', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontSize: '0.82rem', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.text}</span>
                </div>
                
                <button 
                  onClick={() => addNotification?.(`Triggered action: "${alert.action}"`)}
                  style={{ padding: '0.35rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #374151', borderRadius: '6px', fontSize: '0.72rem', color: '#F5D76E', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                >
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── AUTOMATED REPORT SCHEDULER & RECENT AUTOMATIONS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Recent reports output history */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Generated Reports</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentReports.map(rep => (
              <div key={rep.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.85rem 1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245,215,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5D76E' }}>
                    <FileText size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{rep.name}</div>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Generated {rep.generated} · Format: {rep.format}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => addNotification?.('Downloading file...')} style={{ background: 'none', border: 'none', color: '#F5D76E', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Download</button>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                  <button onClick={() => addNotification?.('Previewing document...')} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer' }}>Preview</button>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                  <button onClick={() => addNotification?.('Link copied to clipboard')} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer' }}>Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Automation Rules */}
        <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Scheduled Report Automations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {scheduledReports.map(rule => (
              <div key={rule.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.85rem 1.25rem', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{rule.name}</div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{rule.schedule}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div 
                    onClick={() => handleToggleSchedule(rule.id)}
                    style={{ width: '38px', height: '20px', borderRadius: '99px', backgroundColor: rule.enabled ? '#F5D76E' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                  >
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: rule.enabled ? '#0B0F17' : '#FFFFFF', position: 'absolute', top: '3px', left: rule.enabled ? '21px' : '3px', transition: 'left 0.2s' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: rule.enabled ? '#34D399' : '#6B7280' }}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── GENERATE REPORT CONFIGURATION MODAL ── */}
      {showConfigModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowConfigModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0B0F17', border: '1px solid #1F2937', borderRadius: '18px', width: '100%', maxWidth: '480px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', boxShadow: '0 12px 30px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Generate a Report</h3>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem', margin: 0 }}>Configure parameters and select sections to export.</p>
              </div>
              <button onClick={() => setShowConfigModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#94A3B8', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Report Type</label>
                <select value={selectedReportType} onChange={e => setSelectedReportType(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                  <option style={{ backgroundColor: '#0B0F17' }}>Executive Summary</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Attendance Report</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Participant Report</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Assessment Report</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Facilitator Report</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Certificate Report</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Custom Report</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>Export Format</label>
                <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                  <option style={{ backgroundColor: '#0B0F17' }}>PDF</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Excel</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>CSV</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Share Link</option>
                  <option style={{ backgroundColor: '#0B0F17' }}>Email Report</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Include Sections</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { key: 'attendance', label: 'Attendance Details' },
                    { key: 'learners', label: 'Participant Engagement distribution' },
                    { key: 'assessments', label: 'Assessment performance stats' },
                    { key: 'facilitators', label: 'Facilitator Leaderboard rating' },
                    { key: 'certificates', label: 'Certificates tracking metrics' }
                  ].map(sec => (
                    <div 
                      key={sec.key} 
                      onClick={() => setSelectedSections(prev => ({ ...prev, [sec.key]: !prev[sec.key] }))}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: '#E2E8F0', cursor: 'pointer' }}
                    >
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #374151', backgroundColor: selectedSections[sec.key] ? '#F5D76E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedSections[sec.key] && <Check size={11} color="#0B0F17" strokeWidth={3} />}
                      </div>
                      <span>{sec.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowConfigModal(false)} style={{ flex: 1, padding: '0.65rem', backgroundColor: 'transparent', border: '1px solid #1F2937', color: '#94A3B8', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.65rem', backgroundColor: '#F5C84C', border: 'none', color: '#151515', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>Run Analysis & Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
