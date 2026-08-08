import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, LogOut, ChevronDown } from 'lucide-react';
import { PARTICIPANT_THEME } from '../../constants/theme';

export default function ParticipantHeader({ user, onSignOut }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header style={{
      height: '64px',
      backgroundColor: PARTICIPANT_THEME.cardBg,
      borderBottom: `1px solid ${PARTICIPANT_THEME.border}`,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      {/* Search Input */}
      <div style={{ position: 'relative', width: '320px' }}>
        <Search size={16} style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: PARTICIPANT_THEME.muted
        }} />
        <input
          type="text"
          placeholder="Search learning materials, sessions..."
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            backgroundColor: PARTICIPANT_THEME.bg,
            border: `1px solid ${PARTICIPANT_THEME.border}`,
            borderRadius: PARTICIPANT_THEME.radius,
            color: PARTICIPANT_THEME.text,
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* OYEN AI Button */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: PARTICIPANT_THEME.hover,
          border: `1px solid ${PARTICIPANT_THEME.primaryAccent}`,
          borderRadius: PARTICIPANT_THEME.radius,
          color: PARTICIPANT_THEME.text,
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <Sparkles size={16} color={PARTICIPANT_THEME.primaryAccent} />
          <span>OYEN AI</span>
        </button>

        {/* Notifications Icon */}
        <button style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: PARTICIPANT_THEME.bg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: PARTICIPANT_THEME.text,
          cursor: 'pointer'
        }}>
          <Bell size={18} />
        </button>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: PARTICIPANT_THEME.primaryAccent,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px'
            }}>
              {(user?.email?.[0] || 'L').toUpperCase()}
            </div>
            <ChevronDown size={14} color={PARTICIPANT_THEME.muted} />
          </button>

          {showProfileDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '200px',
              backgroundColor: PARTICIPANT_THEME.cardBg,
              border: `1px solid ${PARTICIPANT_THEME.border}`,
              borderRadius: PARTICIPANT_THEME.radius,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              padding: '8px 0',
              zIndex: 30
            }}>
              <div style={{ padding: '8px 16px', borderBottom: `1px solid ${PARTICIPANT_THEME.border}` }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: PARTICIPANT_THEME.text }}>
                  {user?.email || 'Participant'}
                </div>
                <div style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted }}>
                  Participant
                </div>
              </div>
              <button
                onClick={onSignOut}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
