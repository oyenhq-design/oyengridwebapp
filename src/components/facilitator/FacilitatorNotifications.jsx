import React from 'react';
import { Bell, Clock } from 'lucide-react';

export default function FacilitatorNotifications({ notifications = [] }) {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Notifications</h1>
        <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem' }}>
          Recent alerts and updates from the workspace.
        </p>
      </div>

      <div style={{ backgroundColor: '#111111', borderRadius: '16px', padding: '2rem', border: '1px solid #1F2937', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: notif.read ? 'transparent' : 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Bell color={notif.read ? '#6B7280' : '#F5C84C'} size={18} style={{ marginTop: '0.2rem' }} />
            <div>
              <h4 style={{ color: '#FFFFFF', margin: 0, fontSize: '0.9rem', fontWeight: notif.read ? 500 : 700 }}>{notif.title || notif.text}</h4>
              {notif.description && <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0.2rem 0' }}>{notif.description}</p>}
              <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}><Clock size={12}/> {notif.time}</span>
            </div>
          </div>
        )) : (
          <div style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>You have no notifications.</div>
        )}
      </div>
    </div>
  );
}
