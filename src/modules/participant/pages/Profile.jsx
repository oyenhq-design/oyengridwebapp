import React from 'react';
import { User } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Profile() {
  return (
    <ParticipantPageShell
      title="Profile"
      category="Personal"
      description="Learner profile configuration and personal details view."
      icon={User}
    />
  );
}
