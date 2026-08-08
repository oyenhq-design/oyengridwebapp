import React from 'react';
import { Users } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Community() {
  return (
    <ParticipantPageShell
      title="Community"
      category="Communication"
      description="Peer discussions and cohort announcements will be accessible here once cohort channels are created."
      icon={Users}
    />
  );
}
