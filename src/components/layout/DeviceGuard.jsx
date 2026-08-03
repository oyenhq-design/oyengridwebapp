import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, HeadphonesIcon } from 'lucide-react';

const MobileRestriction = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSupport = () => {
    window.location.href = 'mailto:support@oyengrid.com'; // Adjust to actual support email
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#F8F6F1', // soft milk
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '3rem 2rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(17, 17, 17, 0.04), 0 1px 3px rgba(17, 17, 17, 0.02)',
        border: '1px solid rgba(212, 175, 55, 0.15)', // Light gold border
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Icon / Illustration */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(212, 175, 55, 0.1)', // Gold tint
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem'
        }}>
          <Monitor size={40} color="#D4AF37" />
        </div>

        {/* Headings */}
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#111111', // Near Black
            margin: '0 0 1rem 0',
            lineHeight: 1.3
          }}>
            OYEN GRID works best on Desktop
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#666666',
            margin: '0 0 1rem 0',
            lineHeight: 1.6
          }}>
            This workspace includes programme management, live sessions, attendance tracking, grading, resources, analytics, and other professional tools that require a larger screen.
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#111111',
            fontWeight: 600,
            margin: '0'
          }}>
            Please continue using a desktop or laptop computer for the best experience.
          </p>
        </div>

        {/* Optional Info Card */}
        <div style={{
          backgroundColor: 'rgba(30, 78, 216, 0.05)', // Deep Blue tint
          borderLeft: '4px solid #1E4ED8',
          padding: '1rem',
          borderRadius: '0 8px 8px 0',
          width: '100%',
          textAlign: 'left'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#1E4ED8', // Deep Blue
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            Mobile support is currently under development.
          </p>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          marginTop: '1rem'
        }}>
          <button
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#D4AF37',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.875rem 1.5rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          
          <button
            onClick={handleSupport}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: '#666666',
              border: '1px solid #E5E7EB',
              padding: '0.875rem 1.5rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.color = '#111111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#666666';
            }}
          >
            <HeadphonesIcon size={18} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DeviceGuard({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1024);
      setHasChecked(true);
    };

    // Initial check
    checkWidth();

    // Listen to resize
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Avoid flash of desktop on mobile by waiting for first check
  if (!hasChecked) return null;

  if (isMobile) {
    return <MobileRestriction />;
  }

  return <>{children}</>;
}
