import React from 'react';
import * as Icons from 'lucide-react';
import { NAV_GROUPS } from '../../routes';
import { PARTICIPANT_THEME } from '../../constants/theme';
import logo from '../../../../assets/logo_v2.png';

export default function ParticipantSidebar({ activeTab, setActiveTab }) {
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Circle;
    return <IconComponent size={18} />;
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: PARTICIPANT_THEME.cardBg,
      borderRight: `1px solid ${PARTICIPANT_THEME.border}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Header */}
      <div style={{
        height: '64px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: `1px solid ${PARTICIPANT_THEME.border}`
      }}>
        <img src={logo} alt="OYEN GRID" style={{ height: '28px', width: 'auto' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text, letterSpacing: '-0.02em' }}>
            OYEN GRID
          </div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Participant Portal
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: PARTICIPANT_THEME.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0 12px 8px 12px'
            }}>
              {group.group}
            </div>

            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: PARTICIPANT_THEME.radius,
                    backgroundColor: isActive ? PARTICIPANT_THEME.hover : 'transparent',
                    color: isActive ? PARTICIPANT_THEME.text : PARTICIPANT_THEME.muted,
                    border: 'none',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    marginBottom: '2px'
                  }}
                >
                  <span style={{ color: isActive ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted }}>
                    {renderIcon(item.icon)}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
