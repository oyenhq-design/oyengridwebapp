import React, { useState, useMemo } from 'react';
import { 
  User, Bell, Calendar, Shield, Settings, Check, Sparkles, X, 
  Key, Clock, ShieldAlert, Monitor, CheckCircle2, ChevronRight, Globe
} from 'lucide-react';

export default function SettingsPage({ user, role, workspaceName, wsPrograms = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('Profile');
  const [successToast, setSuccessToast] = useState(null);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    fullName: 'Program Manager',
    email: user || 'pm@oyengrid.com',
    phone: '+1 (555) 234-5678',
    jobTitle: 'Program Manager',
    timezone: 'UTC -5 (EST)',
    language: 'English (US)',
    bio: 'Overseeing learning experience programmes and delivery operations.'
  });

  // Notification States
  const [notificationsConfig, setNotificationsConfig] = useState({
    programUpdates: true,
    sessionReminders: false, // Default false to trigger AI recommendation
    enrollments: true,
    submissions: true,
    attendanceAlerts: true,
    resourceUploads: false,
    weeklySummary: true,
    aiRecommendations: true,
    inApp: true,
    push: false,
    dailyDigest: true,
    instantAlerts: false
  });

  // Calendar States
  const [calendarSync, setCalendarSync] = useState({
    google: false,
    outlook: false,
    duration: '60 minutes',
    timezone: 'UTC -5 (EST)',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00'
  });

  // Preferences States
  const [preferences, setPreferences] = useState({
    theme: 'Dark',
    defaultDashboard: 'Overview',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour (AM/PM)',
    compactView: false
  });

  // OYEN AI dynamic recommendation logic
  const aiRecommendation = useMemo(() => {
    // Recommendation 1: Session reminders not enabled
    if (!notificationsConfig.sessionReminders) {
      return {
        id: 'enable_reminders',
        text: 'You haven\'t enabled session reminders. Turn them on to receive alerts 15 minutes before starting.',
        actionLabel: 'Enable Notifications',
        action: () => {
          setNotificationsConfig(prev => ({ ...prev, sessionReminders: true }));
          setSuccessToast('✓ Session reminders enabled.');
          setTimeout(() => setSuccessToast(null), 2500);
        }
      };
    }
    // Recommendation 2: Timezone mismatched with workspace
    if (profileForm.timezone !== 'UTC +0 (GMT)') {
      return {
        id: 'timezone_mismatch',
        text: 'Your timezone differs from the main programme timezone (GMT).',
        actionLabel: 'Update Timezone',
        action: () => {
          setProfileForm(prev => ({ ...prev, timezone: 'UTC +0 (GMT)' }));
          setSuccessToast('✓ Timezone aligned to GMT.');
          setTimeout(() => setSuccessToast(null), 2500);
        }
      };
    }
    return null;
  }, [notificationsConfig.sessionReminders, profileForm.timezone]);

  // Form submission handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSuccessToast('✓ Profile settings saved successfully.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const toggleNotificationCheckbox = (key) => {
    setNotificationsConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', gap: '2.5rem', minHeight: '100%' }}>
      
      {/* Toast Alert */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideInRight 0.2s ease'
        }}>
          <CheckCircle2 size={16} color="#10B981" />
          {successToast}
        </div>
      )}

      {/* Settings Sub-Sidebar Links */}
      <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
        <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid #EBE5D9', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Settings</h2>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Configure your experience.</span>
        </div>

        {[
          { id: 'Profile', label: 'Profile', icon: <User size={16} /> },
          { id: 'Notifications', label: 'Notifications', icon: <Bell size={16} /> },
          { id: 'Calendar', label: 'Calendar & Hours', icon: <Calendar size={16} /> },
          { id: 'Security', label: 'Security', icon: <Shield size={16} /> },
          { id: 'Preferences', label: 'Preferences', icon: <Settings size={16} /> }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              width: '100%',
              backgroundColor: activeSubTab === item.id ? '#FAFAF8' : 'transparent',
              color: activeSubTab === item.id ? '#111111' : '#6B7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.88rem',
              fontWeight: activeSubTab === item.id ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Settings Display Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Single Integrated AI Suggestion banner */}
        {aiRecommendation && (
          <div style={{
            backgroundColor: '#FFFBEA',
            border: '1px solid #F4C542',
            borderRadius: '12px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2D2D2D' }}>
              <Sparkles size={15} color="#D8A325" />
              <span>{aiRecommendation.text}</span>
            </div>
            <button 
              onClick={aiRecommendation.action}
              style={{ padding: '0.4rem 0.85rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', color: '#111111', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {aiRecommendation.actionLabel}
            </button>
          </div>
        )}

        {/* SUBTAB CONTENT: PROFILE */}
        {activeSubTab === 'Profile' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>My Profile</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Update your personal credentials and public info.</p>
            </div>

            {/* Profile Photo Uploader mockup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                backgroundColor: '#F4C542', color: '#111111',
                display: 'flex', alignItems: 'center', justifycontent: 'center',
                fontWeight: 800, fontSize: '1.5rem'
              }}>
                PM
              </div>
              <button 
                type="button"
                onClick={() => alert('Photo upload trigger')}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Change Photo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.fullName}
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={profileForm.email}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', backgroundColor: '#FAFAF8', boxSizing: 'border-box', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Job Title</label>
                <input 
                  type="text" 
                  value={profileForm.jobTitle}
                  onChange={e => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Timezone</label>
                <select
                  value={profileForm.timezone}
                  onChange={e => setProfileForm({ ...profileForm, timezone: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="UTC -5 (EST)">UTC -5 (EST)</option>
                  <option value="UTC +0 (GMT)">UTC +0 (GMT)</option>
                  <option value="UTC +1 (CET)">UTC +1 (CET)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Language</label>
                <select
                  value={profileForm.language}
                  onChange={e => setProfileForm({ ...profileForm, language: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Bio (Optional)</label>
              <textarea 
                rows={3}
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit"
              style={{
                alignSelf: 'flex-start',
                padding: '0.65rem 1.5rem',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </form>
        )}

        {/* SUBTAB CONTENT: NOTIFICATIONS */}
        {activeSubTab === 'Notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Notification Settings</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Select your notification channels and alert topics.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Email Notifications</h4>
              
              {[
                { key: 'programUpdates', label: 'Programme Updates' },
                { key: 'sessionReminders', label: 'Session Reminders' },
                { key: 'enrollments', label: 'Participant Enrollments' },
                { key: 'submissions', label: 'Assignment Submissions' },
                { key: 'attendanceAlerts', label: 'Attendance Alerts' },
                { key: 'resourceUploads', label: 'Resource Uploads' },
                { key: 'weeklySummary', label: 'Weekly Summary' },
                { key: 'aiRecommendations', label: 'AI Recommendations' }
              ].map(cfg => (
                <div key={cfg.key} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id={cfg.key}
                    checked={notificationsConfig[cfg.key]}
                    onChange={() => toggleNotificationCheckbox(cfg.key)}
                  />
                  <label htmlFor={cfg.key} style={{ fontSize: '0.88rem', color: '#2D2D2D', cursor: 'pointer' }}>{cfg.label}</label>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Channel Configurations</h4>
              
              {[
                { key: 'inApp', label: 'In-App Alerts' },
                { key: 'push', label: 'Push Notifications' },
                { key: 'dailyDigest', label: 'Daily Digest' },
                { key: 'instantAlerts', label: 'Instant Mobile Alerts' }
              ].map(cfg => (
                <div key={cfg.key} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id={cfg.key}
                    checked={notificationsConfig[cfg.key]}
                    onChange={() => toggleNotificationCheckbox(cfg.key)}
                  />
                  <label htmlFor={cfg.key} style={{ fontSize: '0.88rem', color: '#2D2D2D', cursor: 'pointer' }}>{cfg.label}</label>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setSuccessToast('✓ Notification preferences saved.');
                setTimeout(() => setSuccessToast(null), 2500);
              }}
              style={{
                alignSelf: 'flex-start',
                padding: '0.65rem 1.5rem',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Save Notification Preferences
            </button>
          </div>
        )}

        {/* SUBTAB CONTENT: CALENDAR */}
        {activeSubTab === 'Calendar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Calendar & Availability</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Configure integrations and scheduling rules.</p>
            </div>

            {/* Integrations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Calendar Integrations</h4>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => {
                    setCalendarSync(prev => ({ ...prev, google: !prev.google }));
                    setSuccessToast('Google Calendar synced.');
                    setTimeout(() => setSuccessToast(null), 2000);
                  }}
                  style={{
                    padding: '0.65rem 1rem',
                    backgroundColor: calendarSync.google ? 'rgba(59,130,246,0.1)' : '#ffffff',
                    border: `1px solid ${calendarSync.google ? '#3B82F6' : '#EBE5D9'}`,
                    color: calendarSync.google ? '#3B82F6' : '#2D2D2D',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {calendarSync.google ? '✓ Connected Google Calendar' : 'Sync Google Calendar'}
                </button>

                <button 
                  onClick={() => {
                    setCalendarSync(prev => ({ ...prev, outlook: !prev.outlook }));
                    setSuccessToast('Outlook Calendar synced.');
                    setTimeout(() => setSuccessToast(null), 2000);
                  }}
                  style={{
                    padding: '0.65rem 1rem',
                    backgroundColor: calendarSync.outlook ? 'rgba(59,130,246,0.1)' : '#ffffff',
                    border: `1px solid ${calendarSync.outlook ? '#3B82F6' : '#EBE5D9'}`,
                    color: calendarSync.outlook ? '#3B82F6' : '#2D2D2D',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {calendarSync.outlook ? '✓ Connected Microsoft Outlook' : 'Sync Outlook Calendar'}
                </button>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            {/* Time slot configs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Default Session Duration</label>
                <select
                  value={calendarSync.duration}
                  onChange={e => setCalendarSync({ ...calendarSync, duration: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Default Time Zone</label>
                <select
                  value={calendarSync.timezone}
                  onChange={e => setCalendarSync({ ...calendarSync, timezone: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="UTC -5 (EST)">UTC -5 (EST)</option>
                  <option value="UTC +0 (GMT)">UTC +0 (GMT)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Working Hours Start</label>
                <input 
                  type="time" 
                  value={calendarSync.workingHoursStart}
                  onChange={e => setCalendarSync({ ...calendarSync, workingHoursStart: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Working Hours End</label>
                <input 
                  type="time" 
                  value={calendarSync.workingHoursEnd}
                  onChange={e => setCalendarSync({ ...calendarSync, workingHoursEnd: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button 
              onClick={() => {
                setSuccessToast('✓ Availability rules updated.');
                setTimeout(() => setSuccessToast(null), 2500);
              }}
              style={{
                alignSelf: 'flex-start',
                padding: '0.65rem 1.5rem',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Save Working Environment Rules
            </button>
          </div>
        )}

        {/* SUBTAB CONTENT: SECURITY */}
        {activeSubTab === 'Security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Account Security</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Manage authorization updates and authentication settings.</p>
            </div>

            {/* Password updates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Key size={16} /> Update Password
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                onClick={() => {
                  setSuccessToast('✓ Security credentials updated.');
                  setTimeout(() => setSuccessToast(null), 2500);
                }}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.55rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #EBE5D9',
                  color: '#111111',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Change Password
              </button>
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            {/* Active Sessions list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Monitor size={16} /> Active Authorized Sessions
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { device: 'Windows Desktop • Chrome Browser', location: 'London, UK (Current)', active: 'Active now' },
                  { device: 'MacBook Air • Safari Browser', location: 'Oxford, UK', active: 'Active 2 days ago' }
                ].map((sess, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111111' }}>{sess.device}</div>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{sess.location}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: '#10B981' }}>{sess.active}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setSuccessToast('✓ Other sessions revoked.');
                  setTimeout(() => setSuccessToast(null), 2500);
                }}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.55rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Sign Out Other Devices
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB CONTENT: PREFERENCES */}
        {activeSubTab === 'Preferences' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Preferences</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Configure default settings and custom layouts.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Theme Settings</label>
                <select
                  value={preferences.theme}
                  onChange={e => setPreferences({ ...preferences, theme: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Light">Light Mode</option>
                  <option value="Dark">Dark Mode</option>
                  <option value="System">Use System Settings</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Default Landing View</label>
                <select
                  value={preferences.defaultDashboard}
                  onChange={e => setPreferences({ ...preferences, defaultDashboard: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Overview">Dashboard</option>
                  <option value="Programmes">Programmes</option>
                  <option value="Sessions">Sessions</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={e => setPreferences({ ...preferences, dateFormat: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Time Format</label>
                <select
                  value={preferences.timeFormat}
                  onChange={e => setPreferences({ ...preferences, timeFormat: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="12-hour (AM/PM)">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="chk_compact"
                checked={preferences.compactView}
                onChange={e => setPreferences({ ...preferences, compactView: e.target.checked })}
              />
              <label htmlFor="chk_compact" style={{ fontSize: '0.88rem', color: '#2D2D2D', cursor: 'pointer' }}>Use Compact View Mode</label>
            </div>

            <button 
              onClick={() => {
                setSuccessToast('✓ Preferences saved.');
                setTimeout(() => setSuccessToast(null), 2500);
              }}
              style={{
                alignSelf: 'flex-start',
                padding: '0.65rem 1.5rem',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Save Preferences
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
