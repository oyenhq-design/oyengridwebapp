import React, { useState, useEffect, useMemo } from 'react';
import logo from '../../assets/logo.png';
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
        }, 250); // Matches the 250ms CSS exit transition
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
    "Loading sessions...",
    "Almost ready..."
  ], []);

  const [messageIndex, setMessageIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);

  useEffect(() => {
    if (!shouldRender || message) return;

    const interval = setInterval(() => {
      // Crossfade: fade out first
      setTextOpacity(0);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % defaultMessages.length);
        // Fade back in
        setTextOpacity(1);
      }, 250); // Fade duration matches crossfade timing
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldRender, message, defaultMessages]);

  if (!shouldRender) return null;

  const currentDescMessage = message || defaultMessages[messageIndex];

  return (
    <div 
      className={`global-loader-overlay ${isFadingOut ? 'fade-out' : ''}`}
      style={{
        pointerEvents: loading ? 'all' : 'none'
      }}
    >
      {/* Subtle radial ambient background glow */}
      <div className="global-loader-radial-glow" />

      {/* Main content wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        
        {/* Animated logo wrapper using the supplied PNG logo exactly */}
        {/* Animated logo wrapper rendering the PNG directly */}
        <div className="global-loader-logo-wrapper">
          <img 
            src={logo} 
            alt="OYEN GRID" 
            className="brand-loader-logo"
            draggable="false"
          />
          {/* Brushed metallic sweep */}
          <div className="global-loader-shine-overlay" />
        </div>

        {/* Brand Text */}
        <div style={{ marginTop: '2.25rem', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: '#F8F6F1', 
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
