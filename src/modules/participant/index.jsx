import React from 'react';
import ParticipantLayout from './components/layout/ParticipantLayout';

export default function ParticipantModule({ user, wsPrograms, onSignOut }) {
  return (
    <ParticipantLayout
      user={user}
      wsPrograms={wsPrograms}
      onSignOut={onSignOut}
    />
  );
}
