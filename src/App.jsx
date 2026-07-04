import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Grid, ShieldCheck, LogOut, LayoutDashboard, Users, BookOpen, 
  MessageSquare, BrainCircuit, BarChart3, Settings, Building2, User, UserCheck, 
  Lock, CheckCircle2, AlertCircle, ShoppingBag, Sparkles, Plus, Play, HelpCircle, 
  Layers, Landmark, Calendar, Award, RefreshCw, FileSpreadsheet, ShieldAlert
} from 'lucide-react';
import SignInForm from './components/SignInForm';
import OrgRegistrationForm from './components/OrgRegistrationForm';
import InvitedUserForm from './components/InvitedUserForm';
import IndividualRegistrationForm from './components/IndividualRegistrationForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

export default function App() {
  const [activeForm, setActiveForm] = useState('portal'); // 'portal' | 'signin' | 'org_signup' | 'invite_signup' | 'individual_signup' | 'forgot'
  const [theme, setTheme] = useState('dark');
  
  // Auth state
  const [user, setUser] = useState(null); 
  const [userRole, setUserRole] = useState('Workspace Super Admin');
  
  // Workspace Template configuration
  const [activeTemplate, setActiveTemplate] = useState('enterprise'); // 'enterprise' | 'bootcamp' | 'education' | 'events'
  const [activePlan, setActivePlan] = useState('growth');
  
  // Modules state (Dynamic activations via Marketplace/Billing)
  const [enabledTemplates, setEnabledTemplates] = useState({
    enterprise: true,
    bootcamp: false,
    education: false,
    events: false
  });

  // Current tab inside dashboard
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [lockedTabTarget, setLockedTabTarget] = useState(null); // Keeps track of clicked locked tab for upgrade screen

  // AI Assistant Chat Mock
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponses, setAiResponses] = useState([
    { role: 'assistant', text: 'Welcome to OYEN GRID AI Workspace. How can I assist you with your organization today?' }
  ]);

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

    const spacing = 45;
    const points = [];
    const mouse = { x: null, y: null, radius: 150 };

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

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 242, 254, 0.04)' : 'rgba(0, 242, 254, 0.06)';
      ctx.lineWidth = 1;

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

      points.forEach((p) => {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force * 1.5;
            p.vy -= Math.sin(angle) * force * 1.5;
          }
        }

        p.vx += (p.originX - p.x) * 0.1;
        p.vy += (p.originY - p.y) * 0.1;

        p.vx *= 0.8;
        p.vy *= 0.8;

        p.x += p.vx;
        p.y += p.vy;

        const opacity = mouse.x !== null && mouse.y !== null ? Math.max(0.08, 1 - (Math.sqrt((mouse.x - p.x)**2 + (mouse.y - p.y)**2) / 250)) : 0.08;
        ctx.fillStyle = `rgba(0, 242, 254, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

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

  const handleAuthSuccess = (email, role = 'Super Admin') => {
    setUser(email);
    setUserRole(role);
  };

  const handleOrgRegistrationComplete = (email, template, plan) => {
    // Set initial template based on onboarding selection
    setActiveTemplate(template);
    setActivePlan(plan);
    
    // Enable selected template, disable others initially
    const newTemplates = { enterprise: false, bootcamp: false, education: false, events: false };
    newTemplates[template] = true;
    setEnabledTemplates(newTemplates);

    // Navigate to dashboard
    setUser(email);
    setUserRole('Organization Admin');
    setActiveTab('Dashboard');
    setLockedTabTarget(null);
  };

  const handleLogOut = () => {
    setUser(null);
    setActiveForm('portal');
  };

  // Switch Templates from settings/billing easily for user testing
  const switchActiveTemplate = (tempId) => {
    setActiveTemplate(tempId);
    setActiveTab('Dashboard');
    setLockedTabTarget(null);
  };

  // Toggle Template Subscription Status inside Marketplace/Billing
  const toggleTemplateSubscription = (tempId) => {
    const nextState = !enabledTemplates[tempId];
    setEnabledTemplates({
      ...enabledTemplates,
      [tempId]: nextState
    });
    // If we enable, switch to it automatically to show features
    if (nextState) {
      setActiveTemplate(tempId);
      setActiveTab('Dashboard');
      setLockedTabTarget(null);
    }
  };

  // Dynamic Navigation Definitions based on selected Workspace Template
  const getWorkspaceModules = () => {
    const modules = [
      { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, enabled: true }
    ];

    if (activeTemplate === 'enterprise') {
      modules.push(
        { id: 'Employees', label: 'Employees', icon: <Users size={18} />, enabled: true },
        { id: 'Departments', label: 'Departments', icon: <Layers size={18} />, enabled: true },
        { id: 'Programs', label: 'Programs', icon: <BookOpen size={18} />, enabled: true },
        { id: 'Compliance', label: 'Compliance', icon: <ShieldAlert size={18} />, enabled: true },
        { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} />, enabled: true }
      );
    } else if (activeTemplate === 'bootcamp') {
      modules.push(
        { id: 'Cohorts', label: 'Cohorts', icon: <Layers size={18} />, enabled: true },
        { id: 'Mentors', label: 'Mentors', icon: <Users size={18} />, enabled: true },
        { id: 'Programs', label: 'Programs', icon: <BookOpen size={18} />, enabled: true },
        { id: 'Attendance', label: 'Attendance', icon: <CheckCircle2 size={18} />, enabled: true },
        { id: 'Certificates', label: 'Certificates', icon: <Award size={18} />, enabled: true }
      );
    } else if (activeTemplate === 'education') {
      modules.push(
        { id: 'Faculties', label: 'Faculties', icon: <Landmark size={18} />, enabled: true },
        { id: 'Courses', label: 'Courses', icon: <BookOpen size={18} />, enabled: true },
        { id: 'Semesters', label: 'Semesters', icon: <Calendar size={18} />, enabled: true },
        { id: 'Students', label: 'Students', icon: <Users size={18} />, enabled: true },
        { id: 'Results', label: 'Results', icon: <FileSpreadsheet size={18} />, enabled: true }
      );
    } else if (activeTemplate === 'events') {
      modules.push(
        { id: 'Events', label: 'Events', icon: <Calendar size={18} />, enabled: true },
        { id: 'Speakers', label: 'Speakers', icon: <Users size={18} />, enabled: true },
        { id: 'Schedules', label: 'Schedules', icon: <Layers size={18} />, enabled: true },
        { id: 'Tickets', label: 'Tickets', icon: <Award size={18} />, enabled: true },
        { id: 'Feedback', label: 'Feedback', icon: <MessageSquare size={18} />, enabled: true }
      );
    }

    // Append platform level modules
    modules.push(
      { id: 'AI Workspace', label: 'AI Workspace', icon: <BrainCircuit size={18} />, enabled: true },
      { id: 'Marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} />, enabled: true },
      { id: 'Billing & Settings', label: 'Billing & Settings', icon: <Settings size={18} />, enabled: true }
    );

    // Insert Locked Modules indicators (representing templates not active in current subscription)
    const allTemplates = [
      { id: 'enterprise', label: 'Enterprise Operations', icon: <Building2 size={18} /> },
      { id: 'bootcamp', label: 'Bootcamp Workspace', icon: <Laptop size={18} /> },
      { id: 'education', label: 'Education Workspace', icon: <BookOpen size={18} /> },
      { id: 'events', label: 'Events & Conferences', icon: <Calendar size={18} /> }
    ];

    allTemplates.forEach(t => {
      if (!enabledTemplates[t.id]) {
        modules.push({ id: `lock-${t.id}`, label: t.label, icon: t.icon, enabled: false, targetTemplate: t.id });
      }
    });

    return modules;
  };

  // AI Workspace Assistant prompts depending on active Workspace Template
  const getAiSuggestions = () => {
    if (activeTemplate === 'enterprise') {
      return [
        'Draft corporate compliance report guidelines',
        'Create a 6-week corporate training agenda',
        'Analyze department skill gaps'
      ];
    } else if (activeTemplate === 'bootcamp') {
      return [
        'Generate Week 4 Bootcamp Curriculum timetable',
        'Outline mentor review guidelines',
        'Draft graduation certificate templates'
      ];
    } else if (activeTemplate === 'education') {
      return [
        'Generate custom Semester Course syllabus',
        'Outline final exam results metrics',
        'Draft academic faculty onboarding policy'
      ];
    } else if (activeTemplate === 'events') {
      return [
        'Generate Speaker Bio invitation templates',
        'Create virtual masterclass event agenda',
        'Draft feedback questionnaire'
      ];
    }
    return [];
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    setAiPrompt('');
    setAiResponses(prev => [...prev, { role: 'user', text: userText }]);

    // Simulated workspace-specific AI responses
    setTimeout(() => {
      let responseText = '';
      if (activeTemplate === 'bootcamp') {
        responseText = `Based on your Bootcamp Workspace setup, I have generated a cohort schedule blueprint. We have mapped out daily standby stand-ups, technical courses, and weekly assessments for your learners. Let me know if you would like me to compile this into a downloadable PDF program format.`;
      } else if (activeTemplate === 'enterprise') {
        responseText = `As an Enterprise Workspace administrator, I have drafted the requested compliance checkups. We will track employee training records across departments and flag any overdue certifications before your upcoming regulatory audits.`;
      } else if (activeTemplate === 'education') {
        responseText = `Based on your Education template, I have generated the academic grade thresholds. You can assign these directly to student gradebooks under active Semesters.`;
      } else {
        responseText = `I have updated your Event Masterclass agenda. I've scheduled speakers, designated breaks, and set up automatic feedback links to send to attendees post-session.`;
      }
      setAiResponses(prev => [...prev, { role: 'assistant', text: responseText }]);
    }, 1000);
  };

  const handleModuleClick = (mod) => {
    if (mod.enabled) {
      setActiveTab(mod.id);
      setLockedTabTarget(null);
    } else {
      setLockedTabTarget(mod.targetTemplate);
      setActiveTab(`locked-${mod.targetTemplate}`);
    }
  };

  // Render Dashboard Workspace Preview if Logged In
  if (user) {
    const modules = getWorkspaceModules();
    
    return (
      <div className="dashboard-layout animate-fade-in" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Sidebar Nav */}
        <aside style={{
          width: '280px',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          maxHeight: '100vh',
          overflowY: 'auto'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--gradient-brand)', padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid size={20} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', lineHeight: 1 }}>OYEN GRID</span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {activeTemplate} workspace
                </span>
              </div>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {modules.map((mod) => {
                const isActive = activeTab === mod.id;
                
                return (
                  <div 
                    key={mod.id} 
                    onClick={() => handleModuleClick(mod)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem', 
                      borderRadius: '8px', 
                      background: isActive ? 'var(--primary-glow)' : 'transparent', 
                      color: mod.enabled ? (isActive ? 'var(--primary)' : 'var(--text-secondary)') : 'var(--text-muted)',
                      cursor: 'pointer', 
                      fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.2s ease',
                      border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {mod.icon}
                      <span style={{ fontSize: '0.9rem' }}>{mod.label}</span>
                    </div>
                    {!mod.enabled && <Lock size={14} color="var(--text-muted)" />}
                  </div>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>
                OG
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userRole}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user}</p>
              </div>
            </div>
            <button onClick={handleLogOut} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'hsl(0, 84%, 60%)', cursor: 'pointer', fontWeight: 600 }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
          {/* Header */}
          <header style={{ height: '70px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(10px)', flexShrink: 0 }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>{activeTab.replace('locked-', '')} panel</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={toggleTheme} className="theme-toggle-btn" style={{ position: 'static' }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-focus)', textTransform: 'uppercase' }}>
                {activePlan} plan
              </div>
            </div>
          </header>

          {/* Body content switcher */}
          <section style={{ padding: '2.5rem', flex: 1 }}>
            
            {/* LOCKED WORKSPACE OVERLAY SCREEN */}
            {activeTab.startsWith('locked-') && (
              <div className="form-card animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
                <Lock size={48} color="var(--primary)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Workspace Locked</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  The <strong>{lockedTabTarget ? lockedTabTarget.toUpperCase() : ''} Workspace</strong> template modules are not enabled on your current subscription plan.
                </p>

                <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Unlocking this template will enable:</h4>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <li>Full dashboard module features</li>
                    <li>Context-aware AI assistance tools</li>
                    <li>Workspace specific team structures and roles</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="secondary-btn" onClick={() => setActiveTab('Marketplace')}>
                    Explore Marketplace
                  </button>
                  <button className="submit-btn" style={{ maxWidth: '200px' }} onClick={() => toggleTemplateSubscription(lockedTabTarget)}>
                    Unlock Workspace
                  </button>
                </div>
              </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'Dashboard' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome to OYEN GRID</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Workspace Configuration Engine in Sandbox mode</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                  {/* Left Column stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="form-card" style={{ padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active Workspace Overview</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Your OYEN GRID workspace template is currently configured as <strong>{activeTemplate.toUpperCase()}</strong>. The navigation menu has adapted to display specific modules.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', backgroundColor: 'var(--bg-input)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Workspace Users</span>
                          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>18</p>
                        </div>
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', backgroundColor: 'var(--bg-input)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Enabled Modules</span>
                          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {Object.values(enabledTemplates).filter(Boolean).length}
                          </p>
                        </div>
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', backgroundColor: 'var(--bg-input)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Invites</span>
                          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>3</p>
                        </div>
                      </div>
                    </div>

                    <div className="form-card" style={{ padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Team & Invitation Activity</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>David Lee</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ADM-20483 • Admin Invite</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '4px' }}>Pending Invite</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sarah Kim</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MGR-49211 • Manager Invite</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '4px' }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>John Doe</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>FAC-93822 • Facilitator Invite</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '4px' }}>Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column AI actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="form-card" style={{ padding: '1.5rem', border: '1px solid var(--border-focus)', background: 'var(--primary-glow)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Sparkles size={20} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Workspace Recommendations</h3>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        Because you are using the <strong>{activeTemplate} workspace</strong>, OYEN GRID recommends the following AI actions:
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {getAiSuggestions().map((sug, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              setActiveTab('AI Workspace');
                              setAiPrompt(sug);
                            }}
                            style={{ 
                              padding: '0.75rem', 
                              backgroundColor: 'var(--bg-input)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '8px', 
                              fontSize: '0.85rem', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontWeight: 500
                            }}
                          >
                            <span>{sug}</span>
                            <Play size={12} color="var(--primary)" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI WORKSPACE TAB */}
            {activeTab === 'AI Workspace' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {aiResponses.map((res, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        alignSelf: res.role === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor: res.role === 'user' ? 'var(--primary-glow)' : 'var(--bg-card)',
                        border: res.role === 'user' ? '1px solid var(--border-focus)' : '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        maxWidth: '70%',
                        fontSize: '0.95rem'
                      }}
                    >
                      {res.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAiSubmit} style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type an AI prompt..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    style={{ flex: 1, paddingLeft: '1.25rem' }}
                  />
                  <button type="submit" className="submit-btn" style={{ width: 'auto', padding: '0 2rem' }}>
                    Send Prompt
                  </button>
                </form>
              </div>
            )}

            {/* MARKETPLACE TAB */}
            {activeTab === 'Marketplace' && (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Workspace Marketplace</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Add additional workspace template capabilities to your subscription</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  {/* Enterprise */}
                  <div className="form-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.15rem' }}>Enterprise Operations Workspace</h4>
                        {enabledTemplates.enterprise && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>Active</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        Enables corporate structure modules, employee directories, custom department structures, and corporate compliance audit reporting panels.
                      </p>
                    </div>
                    <button 
                      className={enabledTemplates.enterprise ? 'secondary-btn' : 'submit-btn'}
                      onClick={() => toggleTemplateSubscription('enterprise')}
                    >
                      {enabledTemplates.enterprise ? 'Disable Workspace' : 'Add to Workspace'}
                    </button>
                  </div>

                  {/* Bootcamp */}
                  <div className="form-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.15rem' }}>Bootcamp & Accelerators</h4>
                        {enabledTemplates.bootcamp && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>Active</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        Enables cohort groupings, mentor profiles, daily scheduling timetables, attendee attendance logs, and automatic certificate generation builders.
                      </p>
                    </div>
                    <button 
                      className={enabledTemplates.bootcamp ? 'secondary-btn' : 'submit-btn'}
                      onClick={() => toggleTemplateSubscription('bootcamp')}
                    >
                      {enabledTemplates.bootcamp ? 'Disable Workspace' : 'Add to Workspace'}
                    </button>
                  </div>

                  {/* Education */}
                  <div className="form-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.15rem' }}>Education & Institution</h4>
                        {enabledTemplates.education && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>Active</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        Enables university faculty modules, custom semester configurations, academic courses databases, lecturer assignment schedules, and semester result grade sheets.
                      </p>
                    </div>
                    <button 
                      className={enabledTemplates.education ? 'secondary-btn' : 'submit-btn'}
                      onClick={() => toggleTemplateSubscription('education')}
                    >
                      {enabledTemplates.education ? 'Disable Workspace' : 'Add to Workspace'}
                    </button>
                  </div>

                  {/* Events */}
                  <div className="form-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.15rem' }}>Events & Conferences</h4>
                        {enabledTemplates.events && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>Active</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        Enables event coordination builders, speaker directory indexing, ticket code validation portals, schedules scheduling, and attendee feedback response logs.
                      </p>
                    </div>
                    <button 
                      className={enabledTemplates.events ? 'secondary-btn' : 'submit-btn'}
                      onClick={() => toggleTemplateSubscription('events')}
                    >
                      {enabledTemplates.events ? 'Disable Workspace' : 'Add to Workspace'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BILLING & SETTINGS TAB */}
            {activeTab === 'Billing & Settings' && (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Billing & Subscription Settings</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Manage your active billing templates and swap templates for quick sandbox testing.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                  <div className="form-card">
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Sandbox Quick Switcher</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      As an administrator testing out OYEN GRID capabilities, you can switch the active template view directly:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { id: 'enterprise', name: 'Enterprise Operations Workspace' },
                        { id: 'bootcamp', name: 'Bootcamp & Talents Workspace' },
                        { id: 'education', name: 'Education Workspace' },
                        { id: 'events', name: 'Events & Conferences Workspace' }
                      ].map(temp => {
                        const isCurrent = activeTemplate === temp.id;
                        const isSubscribed = enabledTemplates[temp.id];

                        return (
                          <div 
                            key={temp.id}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              padding: '1rem', 
                              border: isCurrent ? '2px solid var(--border-focus)' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              backgroundColor: isCurrent ? 'var(--primary-glow)' : 'var(--bg-input)'
                            }}
                          >
                            <div>
                              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{temp.name}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {isSubscribed ? 'Subscribed ✅' : 'Trial / Locked 🔒'}
                              </span>
                            </div>

                            <button 
                              className={isCurrent ? 'secondary-btn' : 'submit-btn'}
                              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                              disabled={isCurrent}
                              onClick={() => {
                                // If not subscribed, auto-enable to make testing easier
                                if (!isSubscribed) {
                                  toggleTemplateSubscription(temp.id);
                                } else {
                                  switchActiveTemplate(temp.id);
                                }
                              }}
                            >
                              {isCurrent ? 'Active' : 'Switch Workspace'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Plan Details</h3>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Active Subscription Plan</span>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'capitalize' }}>{activePlan} Plan</p>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Base price</span>
                        <span>$199 / mo</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Additional Templates</span>
                        <span>
                          {Object.values(enabledTemplates).filter(Boolean).length > 1 ? '+$50/mo' : '$0'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <span>Total Monthly Invoice</span>
                        <span>
                          ${Object.values(enabledTemplates).filter(Boolean).length > 1 ? 249 : 199}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLACEHOLDER MODULE VIEW FOR VALIDATION */}
            {activeTab !== 'Dashboard' && activeTab !== 'AI Workspace' && activeTab !== 'Marketplace' && activeTab !== 'Billing & Settings' && !activeTab.startsWith('locked-') && (
              <div className="form-card animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>{activeTab} Workspace Operations</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  This is the operational sandbox view for the active module <strong>{activeTab}</strong>. Here, managers, trainers, and administrators configure records, track progress indicators, and generate compliance sheets.
                </p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Template Hook State</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Active Workspace Template: <code>{activeTemplate}</code> • Active Plan: <code>{activePlan}</code>
                  </p>
                </div>
              </div>
            )}
            
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
          {activeForm === 'portal' && (
            <div className="form-card animate-fade-in">
              <div className="form-header">
                <h2 className="form-title">Welcome to OYEN GRID</h2>
                <p className="form-subtitle">Choose an entry pathway to continue</p>
              </div>

              <div className="portal-list">
                {/* Organization Onboarding */}
                <button className="portal-btn" onClick={() => setActiveForm('org_signup')}>
                  <div className="portal-btn-icon">
                    <Building2 size={24} />
                  </div>
                  <div className="portal-btn-content">
                    <div className="portal-btn-title">🏢 Organization</div>
                    <div className="portal-btn-desc">Register a new company workspace group</div>
                  </div>
                </button>

                {/* Individual Learner */}
                <button className="portal-btn" onClick={() => setActiveForm('individual_signup')}>
                  <div className="portal-btn-icon">
                    <User size={24} />
                  </div>
                  <div className="portal-btn-content">
                    <div className="portal-btn-title">👤 Individual</div>
                    <div className="portal-btn-desc">Register as freelancer or guest learner</div>
                  </div>
                </button>

                {/* Invited Workspace User */}
                <button className="portal-btn" onClick={() => setActiveForm('invite_signup')}>
                  <div className="portal-btn-icon">
                    <UserCheck size={24} />
                  </div>
                  <div className="portal-btn-content">
                    <div className="portal-btn-title">🎓 Invited User</div>
                    <div className="portal-btn-desc">Join via workspace code or invite links</div>
                  </div>
                </button>
              </div>

              <div style={{ textItems: 'center', marginTop: '1rem', textAlign: 'center' }} className="form-subtitle">
                Already have an account? <span onClick={() => setActiveForm('signin')}>Sign in</span>
              </div>
            </div>
          )}

          {activeForm === 'signin' && (
            <SignInForm 
              onSwitchForm={setActiveForm} 
              onAuthSuccess={(email) => handleAuthSuccess(email, 'Workspace Super Admin')} 
            />
          )}

          {activeForm === 'org_signup' && (
            <OrgRegistrationForm 
              onSwitchForm={setActiveForm} 
              onComplete={handleOrgRegistrationComplete} 
            />
          )}

          {activeForm === 'invite_signup' && (
            <InvitedUserForm 
              onSwitchForm={setActiveForm} 
              onComplete={(email) => handleAuthSuccess(email, 'Invited Employee')} 
            />
          )}

          {activeForm === 'individual_signup' && (
            <IndividualRegistrationForm 
              onSwitchForm={setActiveForm} 
              onComplete={(email) => handleAuthSuccess(email, 'Individual User')} 
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
