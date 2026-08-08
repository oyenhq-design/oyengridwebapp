import React, { useState, useMemo } from 'react';
import ParticipantSidebar from './ParticipantSidebar';
import ParticipantHeader from './ParticipantHeader';
import Dashboard from '../../pages/Dashboard';
import MyProgramme from '../../pages/MyProgramme';
import Learning from '../../pages/Learning';
import Sessions from '../../pages/Sessions';
import Assignments from '../../pages/Assignments';
import Assessments from '../../pages/Assessments';
import Resources from '../../pages/Resources';
import Messages from '../../pages/Messages';
import Community from '../../pages/Community';
import AIAssistant from '../../pages/AIAssistant';
import Achievements from '../../pages/Achievements';
import Certificates from '../../pages/Certificates';
import Profile from '../../pages/Profile';
import SettingsPage from '../../pages/Settings';
import { getLearnerProgrammeData } from '../../services/participantDataService';

export default function ParticipantLayout({ user, wsPrograms, wsLearners = [], onSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const programmeData = useMemo(() => {
    return getLearnerProgrammeData(user, wsPrograms, wsLearners);
  }, [user, wsPrograms, wsLearners]);

  const learnerName = programmeData.learnerName;

  const renderPageContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} user={user} wsPrograms={wsPrograms} wsLearners={wsLearners} />;
      case 'programme':
        return <MyProgramme user={user} wsPrograms={wsPrograms} wsLearners={wsLearners} />;
      case 'learning':
        return <Learning user={user} wsPrograms={wsPrograms} wsLearners={wsLearners} />;
      case 'sessions':
        return <Sessions user={user} wsPrograms={wsPrograms} wsLearners={wsLearners} />;
      case 'assignments':
        return <Assignments />;
      case 'assessments':
        return <Assessments />;
      case 'resources':
        return <Resources />;
      case 'messages':
        return <Messages user={user} />;
      case 'community':
        return <Community />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'achievements':
        return <Achievements />;
      case 'certificates':
        return <Certificates />;
      case 'profile':
        return <Profile user={user} learnerName={learnerName} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard setActiveTab={setActiveTab} user={user} wsPrograms={wsPrograms} wsLearners={wsLearners} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      <ParticipantSidebar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={onSignOut} userName={learnerName} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        <ParticipantHeader activeTab={activeTab} setActiveTab={setActiveTab} userName={learnerName} />
        <main className="flex-1 pb-12">{renderPageContent()}</main>
      </div>
    </div>
  );
}
