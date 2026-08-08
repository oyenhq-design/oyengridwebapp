import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Settings() {
  return (
    <ParticipantPageShell
      title="Settings"
      category="Personal"
      description="Learner preference settings, notification controls, and account management."
      icon={SettingsIcon}
    />
  );
}
