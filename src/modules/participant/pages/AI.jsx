import React from 'react';
import { Sparkles } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function AI() {
  return (
    <ParticipantPageShell
      title="OYEN AI"
      category="Communication"
      description="OYEN AI assistant is ready to help guide your learning journey once course content is connected."
      icon={Sparkles}
    />
  );
}
