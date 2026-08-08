import React from 'react';
import ParticipantLayout from './components/layout/ParticipantLayout';

export default function ParticipantModule({ user, wsPrograms, wsLearners, onSignOut }) {
  return (
    <ParticipantLayout
      user={user}
      wsPrograms={wsPrograms}
      wsLearners={wsLearners}
      onSignOut={onSignOut}
    />
  );
}
