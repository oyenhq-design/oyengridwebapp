import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Grid, ShieldCheck, LogOut, LayoutDashboard, Users, BookOpen, MessageSquare, BrainCircuit, BarChart3, Settings } from 'lucide-react';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

export default function App() {
  const [activeForm, setActiveForm] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null); // When authenticated, holds user email
  const canvasRef = useRef(null);

  // Initialize and update theme attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Canvas Animation for Left Brand Panel (Interactive Digital Grid)
  useEffect(() => {
    if (user) return; // Don't run canvas code if logged in

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Grid points configuration
    const spacing = 45;
    const points = [];
    const mouse = { x: null, y: null, radius: 150 };

    // Initialize points
    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        points.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
        });
      }
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      // Background color
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      // Grid lines configuration
      ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 242, 254, 0.04)' : 'rgba(0, 242, 254, 0.06)';
      ctx.lineWidth = 1;

      // Draw Grid Horizontal & Vertical Lines
      ctx.beginPath();
      for (let x = 0; x < width; x += spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += spacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Render interactive nodes
      points.forEach((p) => {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            
            // Push point away from mouse
            p.vx -= Math.cos(angle) * force * 1.5;
            p.vy -= Math.sin(angle) * force * 1.5;
          }
        }

        // Return to origin spring force
        p.vx += (p.originX - p.x) * 0.1;
        p.vy += (p.originY - p.y) * 0.1;

        // Friction
        p.vx *= 0.8;
        p.vy *= 0.8;

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Draw dot
        const opacity = mouse.x !== null && mouse.y !== null ? Math.max(0.08, 1 - (Math.sqrt((mouse.x - p.x)**2 + (mouse.y - p.y)**2) / 250)) : 0.08;
        ctx.fillStyle = `rgba(0, 242, 254, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby points to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(79, 172, 254, ${(1 - dist/100) * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [user, theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSuccess = (email) => {
    setUser(email);
  };

  const handleLogOut = () => {
    setUser(null);
    setActiveForm('signin');
  };

  // Render Dashboard Workspace Preview if Logged In
  if (user) {
    return (
      <div className="dashboard-layout animate-fade-in" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Sidebar Nav */}
        <aside style={{
          width: '260px',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--gradient-brand)', padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>OYEN GRID</span>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="nav-item active" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                <LayoutDashboard size={18} /> Dashboard
              </div>
              <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Users size={18} /> People Management
              </div>
              <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <BookOpen size={18} /> Learning Program
              </div>
              <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <MessageSquare size={18} /> Collaboration
              </div>
              <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <BrainCircuit size={18} /> AI Workspace
              </div>
              <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <BarChart3 size={18} /> Reports
              </div>
              <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Settings size={18} /> Settings
              </div>
            </nav>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>
                OG
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Administrator</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user}</p>
              </div>
            </div>
            <button onClick={handleLogOut} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'hsl(0, 84%, 60%)', cursor: 'pointer', fontWeight: 600 }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <header style={{ height: '70px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(10px)' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Workspace Shell Preview</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={toggleTheme} className="theme-toggle-btn" style={{ position: 'static' }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-focus)' }}>
                MVP Mode
              </div>
            </div>
          </header>

          {/* Body */}
          <section style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
            <div className="form-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <ShieldCheck size={32} />
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Authentication Complete</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Welcome to OYEN GRID. You have logged in successfully with <strong>{user}</strong>. The application scaffolding and entry point authentication is now verified.
              </p>
              
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Next Sprints from Roadmap:</h3>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><strong>Sprint 1 Foundation</strong> — Shell Layout, Responsive Workspace Sidebar, Header Navigation, Dark/Light Theme controls.</li>
                  <li><strong>Sprint 2 Setup</strong> — Organization creation dialogs, invite workflows, multi-role workspace profiles.</li>
                  <li><strong>Sprint 3 Dashboard Insights</strong> — Integration of personalized activity grids, today's sessions list, and mock AI insight items.</li>
                </ul>
              </div>

              <button className="submit-btn" onClick={handleLogOut} style={{ maxWidth: '200px', marginTop: '2rem' }}>
                <LogOut size={18} /> Exit Sandbox
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Auth Layout (Not logged in)
  return (
    <div className="auth-container">
      {/* Brand Panel (Left) */}
      <section className="brand-panel">
        <canvas ref={canvasRef} className="brand-canvas" />
        <div className="brand-overlay" />
        
        <header className="brand-header">
          <div style={{ background: 'var(--gradient-brand)', padding: '0.35rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid size={18} color="#fff" />
          </div>
          <span className="logo-text">OYEN GRID</span>
        </header>

        <div className="brand-content">
          <h1 className="brand-title">
            The intelligent <span>enterprise workspace</span>
          </h1>
          <p className="brand-subtitle">
            Scale your organization's learning programs, workforce directories, chat collaborations, and AI operations inside a single, unified grid ecosystem.
          </p>
        </div>

        <footer className="brand-footer">
          © {new Date().getFullYear()} OYEN GRID. All rights reserved.
        </footer>
      </section>

      {/* Form Panel (Right) */}
      <main className="form-panel">
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle dark/light mode">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="form-wrapper">
          {activeForm === 'signin' && (
            <SignInForm 
              onSwitchForm={setActiveForm} 
              onAuthSuccess={handleAuthSuccess} 
            />
          )}
          {activeForm === 'signup' && (
            <SignUpForm 
              onSwitchForm={setActiveForm} 
            />
          )}
          {activeForm === 'forgot' && (
            <ForgotPasswordForm 
              onSwitchForm={setActiveForm} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
