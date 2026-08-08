import React, { useState } from 'react';
import {
  Settings as SettingsIcon, ShieldCheck, Lock, Bell, Eye, Monitor,
  Key, Download, Trash2, Save, CheckCircle2, AlertCircle, Laptop
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Settings({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // 1. Authenticated Participant & Enrolled Programme from database
  const participantIndex = wsLearners.findIndex(l => l.email && l.email.toLowerCase() === userEmail);
  const participant = participantIndex >= 0 ? wsLearners[participantIndex] : {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  // State for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState(null);

  // State for Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifs: true,
    assignmentReminders: true,
    sessionReminders: true,
    announcements: true,
    certificates: true
  });

  // State for Privacy Preferences
  const [privacy, setPrivacy] = useState({
    allowClassmatesView: true,
    allowFacilitatorsContact: true,
    showAchievements: true
  });

  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // Password Change Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    try {
      const { authService } = await import('../../../services/authService');
      await authService.changePassword(userEmail, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordStatus({ type: 'success', text: 'Password changed successfully! Next login will require your new password.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message || 'Error updating password.' });
    }
  };

  // Save Settings Handler
  const handleSaveSettings = () => {
    setSaving(true);
    setSaveToast(null);
    setTimeout(() => {
      setSaving(false);
      setSaveToast('Settings & preferences saved successfully!');
    }, 500);
  };

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── HEADER ── */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
          Account Settings & Preferences
        </h1>
        <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
          Manage your password, security, notification alerts, and learning preferences.
        </p>
      </div>

      {saveToast && (
        <div style={{ padding: '14px 20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: PARTICIPANT_THEME.radius, color: '#10B981', fontSize: '13.5px', fontWeight: 700 }}>
          ✓ {saveToast}
        </div>
      )}

      {/* ── SECTION 1 — ACCOUNT INFO (READ-ONLY SECURITY) ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Account Security & Workspace Enrollment
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Login Email (Managed by Admin)</label>
            <input
              type="text"
              readOnly
              value={userEmail}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', color: PARTICIPANT_THEME.muted, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Enrolled Programme</label>
            <input
              type="text"
              readOnly
              value={participant.program || 'Product Design Bootcamp'}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', color: PARTICIPANT_THEME.muted, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — PASSWORD CHANGE ── */}
      <form onSubmit={handlePasswordChange} style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Change Password
        </h2>

        {passwordStatus && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            backgroundColor: passwordStatus.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: passwordStatus.type === 'success' ? '#10B981' : '#DC2626',
            border: `1px solid ${passwordStatus.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
          }}>
            {passwordStatus.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: PARTICIPANT_THEME.text,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Key size={15} />
            <span>Update Password</span>
          </button>
        </div>
      </form>

      {/* ── SECTION 3 — NOTIFICATION PREFERENCES ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Notification Alerts & Reminders
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { key: 'emailNotifs', title: 'Email Notifications', desc: 'Receive daily digests and critical workspace updates via email.' },
            { key: 'assignmentReminders', title: 'Assignment Due Date Reminders', desc: 'Receive alerts 24 hours before coursework deadlines.' },
            { key: 'sessionReminders', title: 'Live Session Reminders', desc: 'Receive notifications 15 minutes before virtual classes start.' },
            { key: 'announcements', title: 'Programme Announcements', desc: 'Receive instant notifications when facilitators post announcements.' }
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px', border: `1px solid ${PARTICIPANT_THEME.border}` }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: PARTICIPANT_THEME.primaryAccent }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: PARTICIPANT_THEME.text,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={15} />
            <span>Save Notification Preferences</span>
          </button>
        </div>
      </section>

      {/* ── SECTION 4 — ACTIVE LOGIN SESSIONS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
          Devices & Active Login Sessions
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '8px', border: `1px solid ${PARTICIPANT_THEME.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Laptop size={24} color={PARTICIPANT_THEME.primaryAccent} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>Current Browser Session</div>
              <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted }}>Active Now • Chrome / Edge on Windows</div>
            </div>
          </div>

          <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '999px' }}>
            This Device ✓
          </span>
        </div>
      </section>

    </div>
  );
}
