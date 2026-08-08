import React from 'react';
import { FileText } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Assignments() {
  return (
    <ParticipantPageShell
      title="Assignments"
      category="Programme"
      description="No pending assignments. Tasks and projects assigned by your facilitators will appear here."
      icon={FileText}
    />
  );
}
