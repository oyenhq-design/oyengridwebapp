import React, { useState } from 'react';
import ParticipantLayout from './components/layout/ParticipantLayout';
import { ROUTE_MAP } from './routes';
import Dashboard from './pages/Dashboard';

export default function ParticipantModule({ user, wsPrograms = [], wsLearners = [], orgName, orgLogo, onSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const ActiveComponent = ROUTE_MAP[activeTab]?.component || Dashboard;

  return (
    <ParticipantLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      orgName={orgName}
      orgLogo={orgLogo}
      onSignOut={onSignOut}
    >
      <ActiveComponent user={user} wsPrograms={wsPrograms} wsLearners={wsLearners} setActiveTab={setActiveTab} />
    </ParticipantLayout>
  );
}
