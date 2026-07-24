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
        <div className="global-loader-logo-wrapper global-loader-logo-size">
          <svg className="global-loader-logo-img" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#C89A2B" />
                <stop offset="50%" stopColor="#D7A93A" />
                <stop offset="100%" stopColor="#AA7C11" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" strokeWidth="6.5" fill="none" />
            <path 
              d="M52 16 L62 42 H52 L58 58 H49 L55 84 L36 48 H46 L41 32 H52 Z" 
              fill="url(#goldGrad)" 
            />
          </svg>
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
