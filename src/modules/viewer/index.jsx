import React from 'react';

export default function ViewerModule({ user, onLogout }) {
  return (
    <div style={{ padding: '3rem', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', fontFamily: "'Outfit', sans-serif" }}>
        Viewer Read-Only Module
      </h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Welcome, {user || 'Viewer'}. Read-only workspace view.
      </p>
    </div>
  );
}
