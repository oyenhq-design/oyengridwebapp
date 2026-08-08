import React from 'react';
import { BookOpen } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Programme() {
  return (
    <ParticipantPageShell
      title="My Programme"
      category="Programme"
      description="You are currently not assigned to any active learning programme. Your programme outline will appear here when assigned by your administrator."
      icon={BookOpen}
    />
  );
}
