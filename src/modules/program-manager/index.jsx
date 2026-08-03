import React from 'react';
import { 
  Briefcase, 
  RefreshCw, 
  Mail, 
  CheckCircle, 
  Clock, 
  Building, 
  UserCheck 
} from 'lucide-react';

export default function ProgramManagerModule({ user, role, workspaceName }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSupport = () => {
    window.location.href = 'mailto:support@oyengrid.com'; // Adjust as needed
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#090a0f', // Match the rest of the dark theme
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: "'Inter', sans-serif",
      color: '#fff'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '2rem'
      }}>
        
        {/* Header / Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '-0.5rem',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <Briefcase size={36} color="#D4AF37" />
        </div>

        {/* Text Content */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            color: '#D4AF37',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '1rem'
          }}>
            Welcome, {user ? user.split('@')[0] : 'Program Manager'}
          </h3>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 1rem 0',
            lineHeight: 1.3
          }}>
            Your Program Manager workspace is being prepared.
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#9ca3af', // Gray-400
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            Your administrator has successfully invited you to the workspace. We're currently configuring your programme management environment.
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#d1d5db', // Gray-300
            fontWeight: 500,
            margin: 0
          }}>
            As soon as setup is complete, you'll have access to programmes, sessions, participants, reports, and team management.
          </p>
        </div>

        {/* Details Card */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building size={18} color="#9ca3af" />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', width: '130px' }}>Workspace:</span>
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 600 }}>{workspaceName || 'Your Organization'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserCheck size={18} color="#9ca3af" />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', width: '130px' }}>Role:</span>
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 600 }}>{role || 'Program Manager'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={18} color="#10b981" />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', width: '130px' }}>Invitation:</span>
            <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>Accepted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <RefreshCw size={18} color="#3b82f6" className="animate-spin-slow" />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', width: '130px' }}>Status:</span>
            <span style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600 }}>Preparing Workspace...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={18} color="#f59e0b" />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', width: '130px' }}>Estimated:</span>
            <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>Available soon</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          marginTop: '0.5rem'
        }}>
          <button
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#D4AF37',
              color: '#000000',
              border: 'none',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C29F32';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
            }}
          >
            <RefreshCw size={18} />
            Refresh Workspace
          </button>
          
          <button
            onClick={handleSupport}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: '#d1d5db',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d1d5db';
            }}
          >
            <Mail size={18} />
            Contact Workspace Administrator
          </button>
        </div>

      </div>
    </div>
  );
}
