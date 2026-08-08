import React from 'react';
import { MessageSquare } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Messages() {
  return (
    <ParticipantPageShell
      title="Messages"
      category="Communication"
      description="Your conversation inbox is empty. Messages from facilitators and program administrators will appear here."
      icon={MessageSquare}
    />
  );
}
