import React from 'react';
import { PARTICIPANT_THEME } from '../../constants/theme';

export default function ParticipantPageShell({ title, category, description, icon: Icon }) {
  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: '12px',
        fontWeight: 500,
        color: PARTICIPANT_THEME.muted,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>Learner Portal</span>
        <span>/</span>
        <span>{category}</span>
        <span>/</span>
        <span style={{ color: PARTICIPANT_THEME.text, fontWeight: 600 }}>{title}</span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: 700,
        color: PARTICIPANT_THEME.text,
        margin: '0 0 24px 0',
        letterSpacing: '-0.02em'
      }}>
        {title}
      </h1>

      {/* Empty State Card */}
      <div style={{
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        padding: '64px 32px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {Icon && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: PARTICIPANT_THEME.hover,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: PARTICIPANT_THEME.primaryAccent,
            marginBottom: '16px'
          }}>
            <Icon size={24} />
          </div>
        )}
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: PARTICIPANT_THEME.text,
          margin: '0 0 8px 0'
        }}>
          No {title.toLowerCase()} available
        </h3>
        <p style={{
          fontSize: '13px',
          color: PARTICIPANT_THEME.muted,
          margin: 0,
          maxWidth: '420px',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}
