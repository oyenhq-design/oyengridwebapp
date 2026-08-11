import React, { useState, useEffect } from 'react';
import { Monitor, Laptop, Smartphone, Lock, Info, Mail } from 'lucide-react';

const MobileRestriction = () => {
  const handleSupport = () => {
    window.location.href = 'mailto:support@oyengrid.com'; 
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#F8F7F4', // Warm light background
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '3.5rem 3rem',
        maxWidth: '620px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.05), 0 8px 16px -4px rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        
        {/* Premium Illustration */}
        <div style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem'
        }}>
          {/* Soft beige background circle */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#FAF8F0',
            borderRadius: '50%',
            zIndex: 0
          }} />
          
          {/* Devices and Icons */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <Monitor size={56} color="#111111" strokeWidth={1.5} style={{ marginBottom: '8px' }} />
            
            <div style={{ position: 'relative' }}>
              <Smartphone size={32} color="#666666" strokeWidth={1.5} />
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-8px',
                backgroundColor: '#FFFFFF',
                borderRadius: '50%',
                padding: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Lock size={12} color="#D4AF37" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          {/* Subtle gold accent lines */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            width: '80%',
            height: '2px',
            backgroundColor: 'rgba(212, 175, 55, 0.3)',
            borderRadius: '2px',
            zIndex: 0
          }} />
        </div>

        {/* Headings */}
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#111111', 
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Desktop Access Required
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#555555',
            margin: '0 0 1rem 0',
            lineHeight: 1.6,
            maxWidth: '480px'
          }}>
            This workspace includes programme management, live sessions, attendance tracking, grading, resources, analytics, and collaboration tools designed for larger screens.
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#111111',
            fontWeight: 600,
            margin: '0'
          }}>
            Please sign in using a desktop or laptop computer to continue.
          </p>
        </div>

        {/* Soft Premium Information Panel */}
        <div style={{
          backgroundColor: '#FFF8E7',
          borderRadius: '12px',
          padding: '1.25rem',
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          textAlign: 'left',
          border: '1px solid rgba(212, 175, 55, 0.1)'
        }}>
          <Info size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#8F7113', fontWeight: 700 }}>
              Mobile Support
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#A08018', lineHeight: 1.5, fontWeight: 500 }}>
              Mobile access is currently under development and will be available in a future release.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          marginTop: '0.5rem'
        }}>
          
          <button
            onClick={handleSupport}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              backgroundColor: '#FFFFFF',
              color: '#111111',
              border: '1px solid #E2E2E2',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FAFAFA';
              e.currentTarget.style.borderColor = '#D4D4D4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2E2E2';
            }}
          >
            <Mail size={18} />
            Contact Workspace Administrator
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        marginTop: '2.5rem',
        textAlign: 'center',
        color: '#999999',
        fontSize: '0.75rem',
        lineHeight: 1.6,
        fontWeight: 500
      }}>
        <div style={{ fontWeight: 600, color: '#666666', marginBottom: '0.2rem' }}>Powered by OYEN GRID</div>
        <div>Enterprise Workspace</div>
        <div>Version 1.0</div>
      </div>
    </div>
  );
};

export default function DeviceGuard({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 600);
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
