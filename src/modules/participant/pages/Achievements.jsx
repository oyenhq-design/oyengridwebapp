import React from 'react';
import { Trophy } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Achievements() {
  return (
    <ParticipantPageShell
      title="Achievements"
      category="Personal"
      description="No badges or milestones unlocked yet. Complete learning modules and assignments to earn achievements."
      icon={Trophy}
    />
  );
}
