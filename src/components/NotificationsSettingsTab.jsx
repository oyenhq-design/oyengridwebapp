import React, { useState } from 'react';
import { ArrowLeft, Mail, Bell, Clock, Info } from 'lucide-react';

export default function NotificationsSettingsTab({
  onCancel,
  addNotification
}) {
  // Email states
  const [emailStates, setEmailStates] = useState({
    newMember: true,
    learnerReg: true,
    sessionReminder: true,
    assignmentReminder: false,
    programCompletion: true,
    certificateIssued: true,
    weeklySummary: false,
    monthlyReport: false
  });

  // In-app states
  const [inAppStates, setInAppStates] = useState({
    activityUpdates: true,
    mentions: true,
    aiAlerts: false,
    attendanceAlerts: true,
    systemAnnouncements: true
  });

  // Frequency & quiet hours
  const [frequency, setFrequency] = useState('Instant');
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [timezone, setTimezone] = useState('GMT +1:00');

  const handleToggleEmail = (key) => {
    setEmailStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleInApp = (key) => {
    setInAppStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    addNotification?.('Notification preferences saved.', 'success');
    onCancel();
  };

  const renderSwitch = (label, value, onToggle) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid #E8E2DA' }}>
      <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#151515' }}>{label}</span>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '40px',
          height: '22px',
          borderRadius: '99px',
          backgroundColor: value ? '#F5C84C' : '#E8E2DA',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s ease',
          padding: 0
        }}
      >
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '3px',
          left: value ? '21px' : '3px',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
        }} />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #DDD6CB', paddingBottom: '1.5rem' }}>
        <button 
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: '1px solid #DDD6CB',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            color: '#151515'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8E0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Notifications</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Choose how your team receives updates and reminders.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left: Email & In-App Configs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Email Notifications */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Mail size={18} color="#E2B235" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Email Notifications</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderToggleEmail => (
                <>
                  {renderSwitch('New Team Member', emailStates.newMember, () => handleToggleEmail('newMember'))}
                  {renderSwitch('Learner Registration', emailStates.learnerReg, () => handleToggleEmail('learnerReg'))}
                  {renderSwitch('Session Reminder', emailStates.sessionReminder, () => handleToggleEmail('sessionReminder'))}
                  {renderSwitch('Assignment Reminder', emailStates.assignmentReminder, () => handleToggleEmail('assignmentReminder'))}
                  {renderSwitch('Programme Completion', emailStates.programCompletion, () => handleToggleEmail('programCompletion'))}
                  {renderSwitch('Certificate Issued', emailStates.certificateIssued, () => handleToggleEmail('certificateIssued'))}
                  {renderSwitch('Weekly Summary', emailStates.weeklySummary, () => handleToggleEmail('weeklySummary'))}
                  {renderSwitch('Monthly Report', emailStates.monthlyReport, () => handleToggleEmail('monthlyReport'))}
                </>
              )}
              {renderSwitch('New Team Member', emailStates.newMember, () => handleToggleEmail('newMember'))}
              {renderSwitch('Learner Registration', emailStates.learnerReg, () => handleToggleEmail('learnerReg'))}
              {renderSwitch('Session Reminder', emailStates.sessionReminder, () => handleToggleEmail('sessionReminder'))}
              {renderSwitch('Assignment Reminder', emailStates.assignmentReminder, () => handleToggleEmail('assignmentReminder'))}
              {renderSwitch('Programme Completion', emailStates.programCompletion, () => handleToggleEmail('programCompletion'))}
              {renderSwitch('Certificate Issued', emailStates.certificateIssued, () => handleToggleEmail('certificateIssued'))}
              {renderSwitch('Weekly Summary', emailStates.weeklySummary, () => handleToggleEmail('weeklySummary'))}
              {renderSwitch('Monthly Report', emailStates.monthlyReport, () => handleToggleEmail('monthlyReport'))}
            </div>
          </div>

        </div>

        {/* Right: In-App & Frequency Configurations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* In-App Notifications */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Bell size={18} color="#E2B235" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>In-App Notifications</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderSwitch('Activity Updates', inAppStates.activityUpdates, () => handleToggleInApp('activityUpdates'))}
              {renderSwitch('Mentions', inAppStates.mentions, () => handleToggleInApp('mentions'))}
              {renderSwitch('AI Alerts', inAppStates.aiAlerts, () => handleToggleInApp('aiAlerts'))}
              {renderSwitch('Attendance Alerts', inAppStates.attendanceAlerts, () => handleToggleInApp('attendanceAlerts'))}
              {renderSwitch('System Announcements', inAppStates.systemAnnouncements, () => handleToggleInApp('systemAnnouncements'))}
            </div>
          </div>

          {/* Delivery & Quiet Hours */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#E2B235" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Delivery Preferences</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Notification Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="Instant">Instant (Real-time)</option>
                <option value="Daily Digest">Daily Digest</option>
                <option value="Weekly Digest">Weekly Digest</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid #DDD6CB', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#151515' }}>Quiet Hours</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#5C5C5C' }}>Start Time</label>
                  <input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.85rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#5C5C5C' }}>End Time</label>
                  <input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.85rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#5C5C5C' }}>Time Zone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.85rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Save/Cancel */}
      <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #DDD6CB', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#F5C84C',
            border: '1px solid #F5C84C',
            color: '#151515',
            borderRadius: '8px',
            padding: '0.75rem 1.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(245, 200, 76, 0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: '1px solid #DDD6CB',
            color: '#5C5C5C',
            borderRadius: '8px',
            padding: '0.75rem 1.75rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8E0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Cancel
        </button>
      </div>

    </div>
  );
}
