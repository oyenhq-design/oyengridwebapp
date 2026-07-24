import React, { useState, useEffect, useMemo } from 'react';
import oyenLogo from '../../assets/logo.png';
import './GlobalLoader.css';

export default function GlobalLoader({ loading, message }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Debounce loading state to prevent flickering on fast loads (< 300ms)
  useEffect(() => {
    let renderTimer;
    let fadeOutTimer;

    if (loading) {
      setIsFadingOut(false);
      renderTimer = setTimeout(() => {
        setShouldRender(true);
      }, 300);
    } else {
      if (shouldRender) {
        setIsFadingOut(true);
        fadeOutTimer = setTimeout(() => {
          setShouldRender(false);
          setIsFadingOut(false);
        }, 250); // Match CSS fade out duration
      } else {
        clearTimeout(renderTimer);
      }
    }

    return () => {
      clearTimeout(renderTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [loading, shouldRender]);

  // Secondary messages cycling sequence
  const defaultMessages = useMemo(() => [
    "Preparing your workspace...",
    "Loading programs...",
    "Syncing learners...",
    "Connecting your team...",
    "Optimizing your experience...",
    "Almost ready..."
  ], []);

  const [messageIndex, setMessageIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);

  useEffect(() => {
    if (!shouldRender || message) return;

    const interval = setInterval(() => {
      // Fade out
      setTextOpacity(0);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % defaultMessages.length);
        // Fade back in
        setTextOpacity(1);
      }, 300); // Wait for fade-out to complete before changing text
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldRender, message, defaultMessages]);

  if (!shouldRender) return null;

  const currentDescMessage = message || defaultMessages[messageIndex];

  return (
    <div 
      className="global-loader-overlay"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(0.98)' : 'scale(1)',
        pointerEvents: loading ? 'all' : 'none'
      }}
    >
      {/* Subtle radial ambient background glow */}
      <div className="global-loader-radial-glow" />

      {/* Main content wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        
        {/* Animated logo wrapper */}
        <div className="global-loader-logo-wrapper global-loader-logo-size">
          <img 
            src={oyenLogo} 
            className="global-loader-logo-img" 
            alt="OYEN GRID logo"
          />
          {/* Brushed metallic reflection sweep */}
          <div className="global-loader-shine-overlay" />
        </div>

        {/* Brand Text */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: '#F5F5F5', 
            letterSpacing: '1.5px', 
            textTransform: 'uppercase',
            margin: 0,
            fontFamily: "'Geist', 'Outfit', sans-serif"
          }}>
            Loading Workspace
          </h2>
          
          {/* Cycling description messages */}
          <div 
            className="global-loader-desc-text"
            style={{ opacity: textOpacity }}
          >
            {currentDescMessage}
          </div>
        </div>

      </div>
    </div>
  );
}
