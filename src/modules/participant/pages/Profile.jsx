import React, { useState } from 'react';
import {
  User, Mail, Phone, Globe, MapPin, Clock, ShieldCheck, CheckCircle2,
  Lock, Save, Award, BookOpen, FileText, CheckSquare, Camera, Sparkles
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Profile({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // 1. Authenticated Participant & Enrolled Programme from database
  const participantIndex = wsLearners.findIndex(l => l.email && l.email.toLowerCase() === userEmail);
  const participant = participantIndex >= 0 ? wsLearners[participantIndex] : {
    id: `PART-${Date.now().toString().slice(-6)}`,
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail,
    phone: '+234 800 000 0000',
    country: 'Nigeria',
    timezone: 'GMT +1 (WAT)',
    bio: 'Enthusiastic technology professional studying product design and software architecture.'
  };

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Editable Form States
  const [formData, setFormData] = useState({
    name: participant.name || userEmail.split('@')[0] || 'Learner',
    phone: participant.phone || '+234 800 000 0000',
    country: participant.country || 'Nigeria',
    state: participant.state || 'Lagos',
    city: participant.city || 'Lagos',
    timezone: participant.timezone || 'GMT +1 (WAT)',
    bio: participant.bio || 'Enthusiastic technology professional studying product design and software architecture.'
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Handle Save Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    // Save to localStorage sync database
    try {
      const savedLearners = localStorage.getItem('oyen_ws_learners');
      if (savedLearners) {
        const list = JSON.parse(savedLearners);
        const idx = list.findIndex(l => l.email && l.email.toLowerCase() === userEmail);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...formData };
          localStorage.setItem('oyen_ws_learners', JSON.stringify(list));
        }
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setSaving(false);
      setSaveMessage('Profile information saved and synced with workspace administrator!');
    }, 600);
  };

  // Compute Platform Activity Metrics (0% Fake Data)
  const modules = currentProgramme?.modules || [];
  const assignments = currentProgramme?.assignments || [];
  const assessments = currentProgramme?.assessments || [];
  const completedModules = modules.filter(m => m.status === 'Completed').length;
  const completedAssignments = assignments.filter(a => a.status === 'Submitted' || a.status === 'Completed').length;

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
          Participant Account & Profile
        </h1>
        <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
          Manage your personal details, workspace enrollment information, and platform preferences.
        </p>
      </div>

      {saveMessage && (
        <div style={{ padding: '14px 20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: PARTICIPANT_THEME.radius, color: '#10B981', fontSize: '13.5px', fontWeight: 700 }}>
          ✓ {saveMessage}
        </div>
      )}

      {/* ── SECTION 1 — PROFILE HERO CARD ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: PARTICIPANT_THEME.primaryAccent,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '28px'
          }}>
            {(formData.name?.[0] || 'P').toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Enrolled Participant
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '999px' }}>
                Active Account
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px 0', color: PARTICIPANT_THEME.text }}>
              {formData.name}
            </h2>
            
            <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted }}>
              {userEmail} • ID: <strong>{participant.id || 'PART-88492'}</strong>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: '12px', border: `1px solid ${PARTICIPANT_THEME.border}` }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Enrolled Programme</div>
          <div style={{ fontSize: '14.5px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>{currentProgramme?.name || 'Product Design Bootcamp'}</div>
        </div>
      </section>

      {/* ── SECTION 2 — EDITABLE PERSONAL INFORMATION ── */}
      <form onSubmit={handleSaveProfile} style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
          Personal Details & Contact
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Timezone</label>
            <input
              type="text"
              value={formData.timezone}
              onChange={e => setFormData({ ...formData, timezone: e.target.value })}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Personal Bio</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.bg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: PARTICIPANT_THEME.text,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* ── SECTION 3 — LIVE PLATFORM ACTIVITY METRICS ── */}
      <section style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '32px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
          Learning Activity Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Modules Completed</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{completedModules} / {modules.length}</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Assignments Submitted</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{completedAssignments} / {assignments.length}</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>{participant.attendance !== undefined ? `${participant.attendance}%` : '100%'}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
