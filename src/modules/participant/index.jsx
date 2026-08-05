import React from 'react';

export default function ParticipantModule({ user, onLogout }) {
  return (
    <div style={{ padding: '3rem', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', fontFamily: "'Outfit', sans-serif" }}>
        Participant Portal
      </h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Welcome, {user || 'Participant'}. The participant workspace features (My Programmes, My Sessions, Resources, Certificates, Assessments) are currently being integrated.
      </p>
    </div>
  );
}
