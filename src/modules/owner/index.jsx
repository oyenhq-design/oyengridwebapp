import React from 'react';

export default function OwnerModule({ user, onLogout }) {
  return (
    <div style={{ padding: '3rem', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', fontFamily: "'Outfit', sans-serif" }}>
        Owner Command Module
      </h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Welcome, {user || 'Owner'}. Institutional owner workspace features are active.
      </p>
    </div>
  );
}
