import React from 'react';
import { Folder } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Resources() {
  return (
    <ParticipantPageShell
      title="Resources"
      category="Programme"
      description="No program resources or files uploaded yet. Shared documents, guides, and templates will be listed here."
      icon={Folder}
    />
  );
}
