import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Dashboard() {
  return (
    <ParticipantPageShell
      title="Dashboard"
      category="Workspace"
      description="This dashboard will automatically display your programme overview, active tasks, and upcoming live sessions once enrolled."
      icon={LayoutDashboard}
    />
  );
}
