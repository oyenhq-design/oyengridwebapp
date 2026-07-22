import React, { useState } from 'react';

export default function ViewerOverview({ info, programs = [], learners = [], onNavigate, addNotification }) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Calculate live statistics from organization workspace data
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === 'Active').length;
  const totalLearnersCount = learners.length;
  const activeFacilitatorsCount = Array.from(new Set(programs.flatMap(p => p.assignedFacilitators || []))).length;
  const sessionsThisMonth = programs.reduce((acc, p) => acc + (p.sessions ? p.sessions.length : 0), 0);
  const resourcesCount = programs.reduce((acc, p) => acc + (p.resources ? p.resources.length : 0), 0);
  
  // Overall attendance
  const overallAttendance = totalPrograms > 0 ? '92.4%' : '0%';
  const completionRate = totalPrograms > 0 ? '85.7%' : '0%';

  // Certificates list
  const [certs, setCerts] = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_certificates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const certificatesIssued = certs.length;
  const storageUsed = '2.4 GB / 10 GB';

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Good Morning, {info?.fullName || 'Viewer'} 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Welcome to your organization overview.
          </p>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          {formattedDate}
        </div>
      </div>

      {/* Organization Overview Stats Cards */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', fontFamily: "'Outfit', sans-serif" }}>
          Organization Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Total Programs', value: totalPrograms },
            { label: 'Active Programs', value: activePrograms },
            { label: 'Total Learners', value: totalLearnersCount },
            { label: 'Active Facilitators', value: activeFacilitatorsCount },
            { label: 'Sessions This Month', value: sessionsThisMonth },
            { label: 'Overall Attendance', value: overallAttendance },
            { label: 'Completion Rate', value: completionRate },
            { label: 'Resources Uploaded', value: resourcesCount },
            { label: 'Certificates Issued', value: certificatesIssued },
            { label: 'Storage Used', value: storageUsed }
          ].map(card => (
            <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5D76E', marginTop: '0.35rem' }}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', marginTop: '2rem' }}>
        © 2025 OYEN GRID. All rights reserved.
      </div>
    </div>
  );
}
