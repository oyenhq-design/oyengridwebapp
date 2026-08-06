import React, { useState, useMemo } from 'react';
import { 
  User, Bell, Calendar, Shield, Settings, Check, Sparkles, X, 
  Key, Clock, ShieldAlert, Monitor, CheckCircle2, ChevronRight, Globe, AlertCircle
} from 'lucide-react';

export default function SettingsPage({ user, role, workspaceName, wsPrograms = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('Profile');
  const [successToast, setSuccessToast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [savingField, setSavingField] = useState(null); // tracking loading states

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    firstName: 'Program',
    lastName: 'Manager',
    displayName: 'PM',
    email: user || 'pm@oyengrid.com',
    phone: '+15552345678',
    jobTitle: 'Program Manager',
    department: 'Delivery Ops',
    timezone: 'UTC -5 (EST)',
    language: 'English (US)',
    bio: 'Overseeing learning experience programmes and delivery operations.'
  });

  const [initialProfile, setInitialProfile] = useState({ ...profileForm });
  const [validationErrors, setValidationErrors] = useState({});

  // Notification States (Updates trigger auto-save simulation)
  const [notificationsConfig, setNotificationsConfig] = useState({
    programUpdates: true,
    sessionReminders: false, // Default false to trigger AI suggestion
    enrollments: true,
    submissions: true,
    attendanceAlerts: true,
    resourceUploads: false,
    reportsReady: true,
    aiSuggestions: true,
    weeklySummary: true,
    monthlySummary: false,
    inAppAssignments: true,
    inAppSessions: true,
    inAppAttendance: true,
    inAppResources: false,
    inAppAnnouncements: true,
    inAppChanges: true,
    frequency: 'Immediately',
    quietHoursEnabled: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    muteUntil: 'None'
  });

  // Calendar States
  const [calendarSync, setCalendarSync] = useState({
    google: false,
    outlook: false,
    apple: false,
    syncAuto: true,
    duration: '60 mins',
    buffer: '10 mins',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    timezone: 'UTC -5 (EST)',
    lastSync: '10 minutes ago'
  });

  const [testingCalendar, setTestingCalendar] = useState(false);

  // Security States
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [twoFactor, setTwoFactor] = useState({
    enabled: false,
    step: 'closed', // 'closed' | 'qr' | 'backup'
    code: ''
  });

  const [activeDevices, setActiveDevices] = useState([
    { id: '1', device: 'Windows Desktop', browser: 'Chrome Browser', os: 'Windows 11', ip: '192.168.1.45', location: 'London, UK', active: 'Current Device' },
    { id: '2', device: 'iPhone 15 Pro', browser: 'Safari Browser', os: 'iOS 17', ip: '10.23.4.19', location: 'Oxford, UK', active: 'Active 2 hours ago' }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState({
    newDevice: true,
    passwordChange: true,
    suspicious: true,
    failedAttempts: false
  });

  // Preferences States (Updates trigger auto-save simulation)
  const [preferences, setPreferences] = useState({
    theme: 'Dark',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12 Hour',
    defaultLanding: 'Dashboard',
    compactMode: false,
    enableAnimations: true,
    fontSize: 'Normal',
    highContrast: false
  });

  // Check if profile form is changed to show Unsaved changes warning
  const isProfileDirty = useMemo(() => {
    return Object.keys(profileForm).some(key => profileForm[key] !== initialProfile[key]);
  }, [profileForm, initialProfile]);

  // password strength check
  const passwordStrength = useMemo(() => {
    const pw = passwordForm.newPass;
    if (!pw) return { score: 0, text: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    
    const text = score === 1 ? 'Weak' : score === 2 ? 'Medium' : score === 3 ? 'Strong' : 'Very Strong';
    return { score, text };
  }, [passwordForm.newPass]);

  // Integrated AI contextual recommendations (reactive status warning)
  const aiRecommendation = useMemo(() => {
    if (!notificationsConfig.sessionReminders) {
      return {
        id: 'reminders',
        text: 'You haven\'t enabled session reminders. Turn them on to receive alerts before starting.',
        actionLabel: 'Enable Reminders',
        action: () => {
          setNotificationsConfig(prev => ({ ...prev, sessionReminders: true }));
          showToast('Notifications updated.');
        }
      };
    }
    if (profileForm.timezone !== 'UTC +0 (GMT)') {
      return {
        id: 'timezone',
        text: 'Your timezone differs from your active programme.',
        actionLabel: 'Update',
        action: () => {
          setProfileForm(prev => ({ ...prev, timezone: 'UTC +0 (GMT)' }));
          setInitialProfile(prev => ({ ...prev, timezone: 'UTC +0 (GMT)' }));
          showToast('Profile updated.');
        }
      };
    }
    return null;
  }, [notificationsConfig.sessionReminders, profileForm.timezone]);

  // Toast triggers helper
  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};
    if (!profileForm.firstName.trim()) errors.firstName = 'First Name is required.';
    if (!profileForm.lastName.trim()) errors.lastName = 'Last Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) errors.email = 'Please provide a valid email.';
    if (profileForm.phone && !/^\+?[1-9]\d{1,14}$/.test(profileForm.phone.replace(/[\s()-]/g, ''))) {
      errors.phone = 'Invalid phone number format.';
    }
    if (profileForm.bio.length > 500) errors.bio = 'Bio cannot exceed 500 characters.';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMessage('Please fix the errors before saving.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setSavingField('profile');
    setTimeout(() => {
      setSavingField(null);
      setInitialProfile({ ...profileForm });
      setValidationErrors({});
      showToast('Profile updated.');
    }, 1000);
  };

  // Preference / Toggle auto-save simulation
  const handleAutoSave = (section, updatedFields) => {
    setSavingField(section);
    setTimeout(() => {
      setSavingField(null);
      showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} updated.`);
    }, 500);
  };

  // Calendar actions
  const testCalendarConnection = (name) => {
    setTestingCalendar(true);
    setTimeout(() => {
      setTestingCalendar(false);
      showToast(`${name} synchronized successfully.`);
    }, 1200);
  };

  // Security password change
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.current) {
      alert('Current password is required.');
      return;
    }
    if (passwordStrength.score < 3) {
      alert('Password does not meet minimum strength requirements.');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert('Passwords do not match.');
      return;
    }

    setSavingField('password');
    setTimeout(() => {
      setSavingField(null);
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      showToast('Password changed.');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', gap: '2.5rem', minHeight: '100%' }}>
      
      {/* Toast alert */}
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
          animation: 'slideInRight 0.25s ease'
        }}>
          <CheckCircle2 size={16} color="#10B981" />
          {successToast}
        </div>
      )}

      {/* Settings Sub-Sidebar Links */}
      <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
        <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid #EBE5D9', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Settings</h2>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Manage your account, notifications and preferences.</span>
        </div>

        {[
          { id: 'Profile', label: 'My Profile', icon: <User size={16} /> },
          { id: 'Notifications', label: 'Notifications', icon: <Bell size={16} /> },
          { id: 'Calendar', label: 'Calendar', icon: <Calendar size={16} /> },
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
              <span><strong>⚡ OYEN AI:</strong> {aiRecommendation.text}</span>
            </div>
            <button 
              onClick={aiRecommendation.action}
              style={{ padding: '0.4rem 0.85rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', color: '#111111', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {aiRecommendation.actionLabel}
            </button>
          </div>
        )}

        {/* SUBTAB CONTENT: MY PROFILE */}
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
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.5rem'
              }}>
                PM
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => alert('Photo replaced')} style={{ padding: '0.4rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Replace</button>
                <button type="button" onClick={() => alert('Photo removed')} style={{ padding: '0.4rem 0.75rem', backgroundColor: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>First Name</label>
                <input 
                  type="text" 
                  value={profileForm.firstName}
                  onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
                {validationErrors.firstName && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{validationErrors.firstName}</span>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Last Name</label>
                <input 
                  type="text" 
                  value={profileForm.lastName}
                  onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
                {validationErrors.lastName && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{validationErrors.lastName}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Display Name</label>
                <input 
                  type="text" 
                  value={profileForm.displayName}
                  onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
                {validationErrors.email && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{validationErrors.email}</span>}
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
                {validationErrors.phone && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{validationErrors.phone}</span>}
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
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Bio</label>
              <textarea 
                rows={3}
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
              {validationErrors.bio && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{validationErrors.bio}</span>}
            </div>

            {/* Unsaved warning / Save button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                type="submit"
                disabled={savingField === 'profile'}
                style={{
                  padding: '0.65rem 1.5rem',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  opacity: savingField === 'profile' ? 0.7 : 1
                }}
              >
                {savingField === 'profile' ? 'Saving...' : 'Save Changes'}
              </button>
              {isProfileDirty && (
                <span style={{ fontSize: '0.8rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={14} /> Unsaved changes in profile.
                </span>
              )}
            </div>
          </form>
        )}

        {/* SUBTAB CONTENT: NOTIFICATIONS */}
        {activeSubTab === 'Notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Notification Center</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Every toggle updates and saves instantly.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Email Alerts</h4>
              {[
                { key: 'programUpdates', label: 'Program Updates' },
                { key: 'sessionReminders', label: 'Session Reminders' },
                { key: 'enrollments', label: 'Participant Enrollments' },
                { key: 'submissions', label: 'Assignment Submissions' },
                { key: 'attendanceAlerts', label: 'Attendance Alerts' },
                { key: 'resourceUploads', label: 'Resource Uploads' },
                { key: 'reportsReady', label: 'Reports Ready' },
                { key: 'aiSuggestions', label: 'AI Suggestions' },
                { key: 'weeklySummary', label: 'Weekly Summary' },
                { key: 'monthlySummary', label: 'Monthly Summary' }
              ].map(cfg => (
                <div key={cfg.key} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id={cfg.key}
                    checked={notificationsConfig[cfg.key]}
                    onChange={() => {
                      toggleNotificationCheckbox(cfg.key);
                      handleAutoSave('notifications', { [cfg.key]: !notificationsConfig[cfg.key] });
                    }}
                  />
                  <label htmlFor={cfg.key} style={{ fontSize: '0.88rem', color: '#2D2D2D', cursor: 'pointer' }}>{cfg.label}</label>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>In-App Notifications</h4>
              {[
                { key: 'inAppAssignments', label: 'Assignments' },
                { key: 'inAppSessions', label: 'Sessions' },
                { key: 'inAppAttendance', label: 'Attendance' },
                { key: 'inAppResources', label: 'Resources' },
                { key: 'inAppAnnouncements', label: 'Announcements' },
                { key: 'inAppChanges', label: 'Programme Changes' }
              ].map(cfg => (
                <div key={cfg.key} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input 
                    type="checkbox" 
                    id={cfg.key}
                    checked={notificationsConfig[cfg.key]}
                    onChange={() => {
                      toggleNotificationCheckbox(cfg.key);
                      handleAutoSave('notifications', { [cfg.key]: !notificationsConfig[cfg.key] });
                    }}
                  />
                  <label htmlFor={cfg.key} style={{ fontSize: '0.88rem', color: '#2D2D2D', cursor: 'pointer' }}>{cfg.label}</label>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Notification Frequency</label>
              <select
                value={notificationsConfig.frequency}
                onChange={e => {
                  setNotificationsConfig({ ...notificationsConfig, frequency: e.target.value });
                  handleAutoSave('notifications', { frequency: e.target.value });
                }}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
              >
                <option value="Immediately">Immediately</option>
                <option value="Hourly Digest">Hourly Digest</option>
                <option value="Daily Digest">Daily Digest</option>
                <option value="Weekly Digest">Weekly Digest</option>
              </select>
            </div>
          </div>
        )}

        {/* SUBTAB CONTENT: CALENDAR */}
        {activeSubTab === 'Calendar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Calendar Integrations</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Integrate and test calendar schedules.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Google Calendar', key: 'google' },
                { name: 'Microsoft Outlook', key: 'outlook' },
                { name: 'Apple Calendar (.ics)', key: 'apple' }
              ].map(cal => (
                <div key={cal.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #EBE5D9', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cal.name}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      type="button" 
                      onClick={() => testCalendarConnection(cal.name)}
                      style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Test Connection
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setCalendarSync(prev => ({ ...prev, [cal.key]: !prev[cal.key] }));
                        showToast(`${cal.name} ${!calendarSync[cal.key] ? 'Connected' : 'Disconnected'}`);
                      }}
                      style={{ padding: '0.45rem 0.85rem', backgroundColor: calendarSync[cal.key] ? '#EF4444' : '#F4C542', color: calendarSync[cal.key] ? '#ffffff' : '#111111', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {calendarSync[cal.key] ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Default Session Duration</label>
                <select
                  value={calendarSync.duration}
                  onChange={e => setCalendarSync({ ...calendarSync, duration: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option value="30 mins">30 mins</option>
                  <option value="60 mins">60 mins</option>
                  <option value="90 mins">90 mins</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Default Meeting Buffer</label>
                <select
                  value={calendarSync.buffer}
                  onChange={e => setCalendarSync({ ...calendarSync, buffer: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option value="0 mins">0 mins</option>
                  <option value="10 mins">10 mins</option>
                  <option value="15 mins">15 mins</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => showToast('Calendar synchronized successfully.')}
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
              Save Calendar Preference
            </button>
          </div>
        )}

        {/* SUBTAB CONTENT: SECURITY */}
        {activeSubTab === 'Security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Account Security</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Manage password security credentials.</p>
            </div>

            {/* Password edit form */}
            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Change Password</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input 
                  type="password" 
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Current Password" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <input 
                  type="password" 
                  value={passwordForm.newPass}
                  onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  placeholder="New Password" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
                
                {/* password requirements metrics */}
                {passwordForm.newPass && (
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                    Strength: <strong style={{ color: passwordStrength.score >= 3 ? '#10B981' : '#F59E0B' }}>{passwordStrength.text}</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{ color: passwordForm.newPass.length >= 8 ? '#10B981' : '#EF4444' }}>• 8+ Characters</span>
                      <span style={{ color: /[A-Z]/.test(passwordForm.newPass) ? '#10B981' : '#EF4444' }}>• Uppercase</span>
                      <span style={{ color: /[0-9]/.test(passwordForm.newPass) ? '#10B981' : '#EF4444' }}>• Number</span>
                    </div>
                  </div>
                )}

                <input 
                  type="password" 
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="Confirm New Password" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.55rem 1rem',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Update Password
              </button>
            </form>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            {/* 2FA Section */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Two-Factor Authentication</h4>
              <button 
                type="button"
                onClick={() => {
                  setTwoFactor({ ...twoFactor, enabled: !twoFactor.enabled });
                  showToast(`2FA ${!twoFactor.enabled ? 'Enabled' : 'Disabled'}`);
                }}
                style={{
                  padding: '0.55rem 1rem',
                  backgroundColor: twoFactor.enabled ? '#EF4444' : '#F4C542',
                  color: twoFactor.enabled ? '#ffffff' : '#111111',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {twoFactor.enabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            <div style={{ borderBottom: '1px solid #EBE5D9', margin: '0.5rem 0' }} />

            {/* Active devices log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>Connected Devices</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {activeDevices.map(dev => (
                  <div key={dev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #EBE5D9', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{dev.device}</div>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{dev.browser} • {dev.os} • {dev.ip}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>{dev.active}</span>
                      {dev.id !== '1' && (
                        <button 
                          onClick={() => {
                            setActiveDevices(activeDevices.filter(d => d.id !== dev.id));
                            showToast('Device revoked.');
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB CONTENT: PREFERENCES */}
        {activeSubTab === 'Preferences' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ borderBottom: '1px solid #EBE5D9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Preferences</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>Manage workspace layout settings and UI preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Theme Settings</label>
                <select
                  value={preferences.theme}
                  onChange={e => {
                    setPreferences({ ...preferences, theme: e.target.value });
                    handleAutoSave('preferences', { theme: e.target.value });
                  }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option value="Light">Light Mode</option>
                  <option value="Dark">Dark Mode</option>
                  <option value="System">Use System Settings</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Landing Route</label>
                <select
                  value={preferences.defaultLanding}
                  onChange={e => {
                    setPreferences({ ...preferences, defaultLanding: e.target.value });
                    handleAutoSave('preferences', { defaultLanding: e.target.value });
                  }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option value="Dashboard">Dashboard</option>
                  <option value="Programmes">Programmes</option>
                  <option value="Sessions">Sessions</option>
                  <option value="Participants">Participants</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={e => {
                    setPreferences({ ...preferences, dateFormat: e.target.value });
                    handleAutoSave('preferences', { dateFormat: e.target.value });
                  }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Time Format</label>
                <select
                  value={preferences.timeFormat}
                  onChange={e => {
                    setPreferences({ ...preferences, timeFormat: e.target.value });
                    handleAutoSave('preferences', { timeFormat: e.target.value });
                  }}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option value="12 Hour">12 Hour</option>
                  <option value="24 Hour">24 Hour</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="chk_compact"
                checked={preferences.compactMode}
                onChange={e => {
                  setPreferences({ ...preferences, compactMode: e.target.checked });
                  handleAutoSave('preferences', { compactMode: e.target.checked });
                }}
              />
              <label htmlFor="chk_compact" style={{ fontSize: '0.88rem', color: '#2D2D2D', cursor: 'pointer' }}>Use Compact View Mode</label>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
