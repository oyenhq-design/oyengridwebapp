import React from 'react';
import { CheckSquare } from 'lucide-react';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Assessments() {
  return (
    <ParticipantPageShell
      title="Assessments"
      category="Programme"
      description="No assessments or quizzes published for your current modules."
      icon={CheckSquare}
    />
  );
}
