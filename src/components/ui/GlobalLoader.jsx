import React, { useState, useEffect, useMemo } from 'react';
import logo from '../../assets/logo_v2.png';
import './GlobalLoader.css';

export default function GlobalLoader({ loading }) {
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
        }, 150); // Matches the 150ms CSS exit transition
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

  // Pre-calculate coordinates for the glowing trailing dotted circular spinner
  const dots = useMemo(() => {
    const totalDots = 24;
    return Array.from({ length: totalDots }).map((_, index) => {
      // Circle radius 42 in a 100x100 viewbox
      const angle = (index / totalDots) * 2 * Math.PI - Math.PI / 2;
      const r = 42; 
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      
      // Fading trailing size and opacity
      const progress = index / (totalDots - 1);
      const dotRadius = 0.6 + progress * 2.2; // 0.6px to 2.8px
      const opacity = 0.05 + progress * 0.95; // 5% to 100% opacity
      
      return { x, y, r: dotRadius, opacity };
    });
  }, []);

  if (!shouldRender) return null;

  const activeLogo = cleanedLogo || logo;

  return (
    <div 
      className={`global-loader-overlay ${isFadingOut ? 'fade-out' : ''}`}
      style={{
        pointerEvents: loading ? 'all' : 'none'
      }}
    >
      {/* Subtle radial ambient background glow behind the logo */}
      <div className="global-loader-radial-glow" />

      {/* Loader Center Container shifted slightly above viewport center */}
      <div className="global-loader-container">
        
        {/* Trailing dotted spinner ring */}
        <svg className="global-loader-spinner-svg" viewBox="0 0 100 100">
          {dots.map((dot, i) => (
            <circle 
              key={i} 
              cx={dot.x} 
              cy={dot.y} 
              r={dot.r} 
              fill="#D4AF37" 
              opacity={dot.opacity}
              style={{
                filter: `drop-shadow(0 0 ${dot.r * 0.8}px rgba(212, 175, 55, 0.7))`
              }}
            />
          ))}
        </svg>

        {/* Masked logo wrapper */}
        <div className="global-loader-logo-wrapper">
          <img 
            src={activeLogo} 
            alt="OYEN GRID" 
            className="brand-loader-logo"
            draggable="false"
          />
          {/* Brushed metallic sweep */}
          <div 
            className="global-loader-shine-overlay" 
            style={{
              maskImage: `url(${activeLogo})`,
              WebkitMaskImage: `url(${activeLogo})`,
              maskSize: 'cover',
              WebkitMaskSize: 'cover'
            }}
          />
          {/* Lightning activation pulse */}
          <div 
            className="global-loader-lightning-pulse" 
            style={{
              maskImage: `url(${activeLogo})`,
              WebkitMaskImage: `url(${activeLogo})`,
              maskSize: 'cover',
              WebkitMaskSize: 'cover'
            }}
          />
        </div>

      </div>
    </div>
  );
}
