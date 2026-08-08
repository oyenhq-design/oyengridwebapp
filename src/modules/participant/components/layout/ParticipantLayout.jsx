import React from 'react';
import ParticipantSidebar from './ParticipantSidebar';
import ParticipantHeader from './ParticipantHeader';
import { PARTICIPANT_THEME } from '../../constants/theme';

export default function ParticipantLayout({ activeTab, setActiveTab, user, orgName, orgLogo, onSignOut, children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: PARTICIPANT_THEME.bg,
      color: PARTICIPANT_THEME.text,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Sidebar */}
      <ParticipantSidebar activeTab={activeTab} setActiveTab={setActiveTab} orgName={orgName} orgLogo={orgLogo} />

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <ParticipantHeader user={user} onSignOut={onSignOut} />

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
