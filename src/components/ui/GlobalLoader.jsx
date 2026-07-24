import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo_v2.png';
import './GlobalLoader.css';

export default function GlobalLoader({ loading, message }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cleanedLogo, setCleanedLogo] = useState('');

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

  useEffect(() => {
    // Process image to dynamically remove checkerboard patterns
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logo;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const diffRG = Math.abs(r - g);
        const diffRB = Math.abs(r - b);
        const diffGB = Math.abs(g - b);
        
        // Key out dark-gray and black checkerboard squares
        if (diffRG < 15 && diffRB < 15 && diffGB < 15 && r < 90) {
          data[i + 3] = 0; // Set Alpha to 0
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setCleanedLogo(canvas.toDataURL());
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`global-loader-overlay ${isFadingOut ? 'fade-out' : ''}`}
      style={{
        pointerEvents: loading ? 'all' : 'none'
      }}
    >
      {/* Subtle radial ambient background glow behind the logo */}
      <div className="global-loader-radial-glow" />

      {/* Main content wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        
        {/* Animated logo wrapper rendering the PNG directly */}
        <div className="global-loader-logo-wrapper">
          <img 
            src={cleanedLogo || logo} 
            alt="OYEN GRID" 
            className="brand-loader-logo"
            draggable="false"
          />
          {/* Brushed metallic sweep */}
          <div className="global-loader-shine-overlay" />
        </div>

        {/* Brand Text */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div className="global-loader-desc-text">
            {message || "Loading..."}
          </div>
        </div>

      </div>
    </div>
  );
}
