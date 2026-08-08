import React from 'react';
import { Video } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function LiveSessions() {
  return (
    <ParticipantPageShell
      title="Live Sessions"
      category="Programme"
      description="No upcoming live workshops or webinars scheduled. Check back later for live interactive session updates."
      icon={Video}
    />
  );
}
