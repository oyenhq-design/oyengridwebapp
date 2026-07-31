import React from 'react';
import { User, Mail, Globe, MapPin } from 'lucide-react';

export default function FacilitatorProfile({ userInfo }) {
  const { fullName, email, role, timezone } = userInfo || {};
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif" }}>My Profile</h1>
        <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem' }}>
          Manage your personal information and settings.
        </p>
      </div>

      <div style={{ backgroundColor: '#111111', borderRadius: '16px', padding: '2rem', border: '1px solid #1F2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F5C84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#111111' }}>
            {fullName ? fullName.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{fullName || 'User'}</h2>
            <span style={{ color: '#F5C84C', fontSize: '0.85rem', fontWeight: 600 }}>{role || 'Facilitator'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
          <div>
            <label style={{ display: 'block', color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E2E8F0', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1F2937' }}>
              <Mail size={16} color="#94A3B8" /> {email}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Timezone</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E2E8F0', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1F2937' }}>
              <Globe size={16} color="#94A3B8" /> {timezone || 'GMT'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
