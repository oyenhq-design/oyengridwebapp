import React from 'react';
import { Layers } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Modules() {
  return (
    <ParticipantPageShell
      title="Learning Modules"
      category="Programme"
      description="No learning modules published yet. Structured learning paths and course modules will be unlocked as you progress."
      icon={Layers}
    />
  );
}
