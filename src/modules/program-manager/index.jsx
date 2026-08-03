import React, { useState } from 'react';
import ProgramManagerLayout from './layouts/ProgramManagerLayout';
import DashboardPage from './pages/DashboardPage';

export default function ProgramManagerModule({ 
  user, 
  role, 
  workspaceName,
  wsPrograms = [],
  wsLearners = [],
  wsTeam = [],
  wsInvitations = [],
  notifications = [],
  recentUpdates = [],
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardPage 
            user={user}
            wsPrograms={wsPrograms}
            wsLearners={wsLearners}
            wsTeam={wsTeam}
            notifications={notifications}
            recentUpdates={recentUpdates}
            setActiveTab={setActiveTab}
          />
        );
      case 'Programmes':
      case 'Learners':
      case 'Sessions':
      case 'Resources':
      case 'Reports':
      case 'Team':
      case 'Messages':
      case 'Settings':
        return (
          <div style={{ padding: '3rem', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{activeTab}</h1>
            <p style={{ color: '#6B7280' }}>
              This page is being prepared. It will display all workspace data related to {activeTab.toLowerCase()} when completed.
            </p>
          </div>
        );
      default:
        return (
          <DashboardPage 
            user={user}
            wsPrograms={wsPrograms}
            wsLearners={wsLearners}
            wsTeam={wsTeam}
            notifications={notifications}
            recentUpdates={recentUpdates}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <ProgramManagerLayout 
      user={user} 
      workspaceName={workspaceName} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}
    </ProgramManagerLayout>
  );
}
