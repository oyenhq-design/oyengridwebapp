import React, { useState } from 'react';
import { ArrowLeft, Settings, Globe, Clock, Shield } from 'lucide-react';

export default function GeneralSettingsTab({
  orgName,
  setOrgName,
  onCancel,
  addNotification
}) {
  const [workspaceName, setWorkspaceName] = useState(orgName || 'OYEN GRID');
  const [timezone, setTimezone] = useState('GMT +1:00');
  const [language, setLanguage] = useState('English (US)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('USD ($)');
  const [region, setRegion] = useState('North America');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [visibility, setVisibility] = useState('Private');

  const handleSave = () => {
    setOrgName(workspaceName);
    addNotification?.('General settings saved.', 'success');
    onCancel();
  };

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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>General Settings</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Configure default settings, regional preferences, and workspace variables.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Fields */}
        <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Time Zone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="GMT -5:00">GMT -5:00 (EST)</option>
                <option value="GMT +0:00">GMT +0:00 (WET)</option>
                <option value="GMT +1:00">GMT +1:00 (CET)</option>
                <option value="GMT +8:00">GMT +8:00 (SGT)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="NGN (₦)">NGN (₦)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Default Session Duration (mins)</label>
              <input
                type="number"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Default Programme Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="Private">Private (Members only)</option>
                <option value="Public">Public (Anyone can enroll)</option>
                <option value="Shared">Shared Link Only</option>
              </select>
            </div>
          </div>

        </div>

        {/* Right Info Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif" }}>Workspace Preferences</h4>
            <p style={{ fontSize: '0.78rem', color: '#5C5C5C', lineHeight: '1.5', margin: 0 }}>
              These configurations set the default values when creating new educational programmes, scheduling live sessions, and calculating system notification intervals across OYEN GRID.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Save Changes */}
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
