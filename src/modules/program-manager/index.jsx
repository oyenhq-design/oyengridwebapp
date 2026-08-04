import React, { useState, Component } from 'react';
import ProgramManagerLayout from './layouts/ProgramManagerLayout';
import DashboardPage from './pages/DashboardPage';

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

export default function ProgramManagerModule(props) {
  return (
    <PMErrorBoundary>
      <ProgramManagerModuleInner {...props} />
    </PMErrorBoundary>
  );
}

function ProgramManagerModuleInner({ 
  user, 
  role, 
  workspaceName,
  wsPrograms = [],
  wsLearners = [],
  wsTeam = [],
  wsInvitations = [],
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
      case 'Learners':
      case 'Sessions':
      case 'Resources':
      case 'Reports':
      case 'Team':
      case 'Messages':
      case 'Settings':
        return (
          <div style={{ padding: '3rem', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{activeTab}</h1>
            <p style={{ color: '#6B7280' }}>
              This page is being prepared. It will display all workspace data related to {activeTab.toLowerCase()} when completed.
            </p>
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
    >
      {renderContent()}
    </ProgramManagerLayout>
  );
}
