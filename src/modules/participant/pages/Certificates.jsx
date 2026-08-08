import React from 'react';
import { Award } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Certificates() {
  return (
    <ParticipantPageShell
      title="Certificates"
      category="Personal"
      description="No certificates issued. Complete a program requirement to earn verifiable completion certificates."
      icon={Award}
    />
  );
}
