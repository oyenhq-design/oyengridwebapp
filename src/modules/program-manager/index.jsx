import React, { useState, Component } from 'react';
import ProgramManagerLayout from './layouts/ProgramManagerLayout';
import DashboardPage from './pages/DashboardPage';
import ProgramsTab from '../../components/ProgramsTab';
import ParticipantsTab from '../../components/ParticipantsTab';
import AdminSessions from '../../components/admin/AdminSessions';
import FacilitatorResources from '../../components/facilitator/FacilitatorResources';
import ReportsTab from '../../components/ReportsTab';
import AttendanceTab from '../../components/AttendanceTab';
import AssessmentsTab from '../../components/AssessmentsTab';
import AnnouncementsTab from '../../components/AnnouncementsTab';
import TeamManagement from '../../components/TeamManagement';
import SettingsPage from './pages/SettingsPage';

class PMErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Program Manager Module Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#fff', color: '#EF4444', height: '100vh' }}>
          <h2>Something went wrong in the Program Manager Dashboard.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            <summary>Click for error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const addNotification = (msg) => {
  console.log('[PM Notification]:', msg);
};

export default function ProgramManagerModule(props) {
  return (
    <PMErrorBoundary>
      <ProgramManagerModuleInner {...props} />
    </PMErrorBoundary>
  );
}

function ProgramManagerModuleInner({ 
  user, 
  role = 'Program Manager', 
  workspaceName,
  wsPrograms = [],
  setWsPrograms,
  wsLearners = [],
  setWsLearners,
  wsTeam = [],
  setWsTeam,
  wsInvitations = [],
  setWsInvitations,
  notifications = [],
  recentUpdates = [],
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardPage 
            user={user}
            wsPrograms={wsPrograms}
            wsLearners={wsLearners}
            wsTeam={wsTeam}
            notifications={notifications}
            recentUpdates={recentUpdates}
            setActiveTab={setActiveTab}
          />
        );
      case 'Programmes':
      case 'Programs':
        return (
          <ProgramsTab
            programs={wsPrograms}
            setPrograms={setWsPrograms}
            learners={wsLearners}
            setLearners={setWsLearners || (() => {})}
            teamMembers={wsTeam}
            addNotification={addNotification}
            userRole={role}
            setActiveTab={setActiveTab}
          />
        );
      case 'Participants':
      case 'Learners':
        return (
          <ParticipantsTab
            programs={wsPrograms}
            setPrograms={setWsPrograms}
            learners={wsLearners}
            setLearners={setWsLearners || (() => {})}
            addNotification={addNotification}
            onNavigateToPrograms={() => setActiveTab('Programmes')}
            userRole={role}
          />
        );
      case 'Sessions':
        return (
          <AdminSessions
            programs={wsPrograms}
            setPrograms={setWsPrograms}
            learners={wsLearners}
            addNotification={addNotification}
            onNavigateToPrograms={() => setActiveTab('Programmes')}
            userRole={role}
            teamMembers={wsTeam}
            currentUserEmail={user}
          />
        );
      case 'Resources':
        return (
          <FacilitatorResources
            programs={wsPrograms}
            setPrograms={setWsPrograms}
            addNotification={addNotification}
            currentUserEmail={user}
            userRole={role}
          />
        );
      case 'Reports':
        return (
          <ReportsTab
            programs={wsPrograms}
            learners={wsLearners}
          />
        );
      case 'Attendance':
        return (
          <AttendanceTab
            programs={wsPrograms}
            learners={wsLearners}
            addNotification={addNotification}
          />
        );
      case 'Assessments':
        return (
          <AssessmentsTab
            programs={wsPrograms}
            addNotification={addNotification}
          />
        );
      case 'Announcements':
        return (
          <AnnouncementsTab
            programs={wsPrograms}
            addNotification={addNotification}
            userRole={role}
          />
        );
      case 'Team':
        return (
          <TeamManagement
            members={wsTeam}
            setMembers={setWsTeam || (() => {})}
            pending={wsInvitations}
            setPending={setWsInvitations || (() => {})}
            addNotification={addNotification}
            onNavigateHome={() => setActiveTab('Dashboard')}
          />
        );
      case 'Settings':
        return (
          <div style={{ padding: '2.5rem 3rem' }}>
            <SettingsPage 
              user={user}
              role={role}
              workspaceName={workspaceName}
              wsPrograms={wsPrograms}
            />
          </div>
        );
      default:
        return (
          <DashboardPage 
            user={user}
            wsPrograms={wsPrograms}
            wsLearners={wsLearners}
            wsTeam={wsTeam}
            notifications={notifications}
            recentUpdates={recentUpdates}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <ProgramManagerLayout 
      user={user} 
      workspaceName={workspaceName} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={onLogout}
      wsPrograms={wsPrograms}
      wsLearners={wsLearners}
      wsTeam={wsTeam}
    >
      {renderContent()}
    </ProgramManagerLayout>
  );
}
