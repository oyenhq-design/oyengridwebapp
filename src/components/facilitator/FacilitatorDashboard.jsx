import React from 'react';
import { Home, Calendar, Users, BookOpen, Star, Sparkles } from 'lucide-react';

export default function FacilitatorDashboard({ assignedSessions = [], programs = [], currentUserEmail }) {
  const upcomingSessions = assignedSessions.filter(s => s.status === 'Upcoming');
  
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Welcome back!</h1>
        <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem' }}>
          Here's what's happening with your sessions today.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div style={{ backgroundColor: '#111111', borderRadius: '16px', padding: '1.5rem', border: '1px solid #1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F5C84C', marginBottom: '0.5rem' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Upcoming Sessions</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{upcomingSessions.length}</span>
        </div>
        
        <div style={{ backgroundColor: '#111111', borderRadius: '16px', padding: '1.5rem', border: '1px solid #1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3B82F6', marginBottom: '0.5rem' }}>
            <BookOpen size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Total Assigned</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{assignedSessions.length}</span>
        </div>
      </div>
    </div>
  );
}
