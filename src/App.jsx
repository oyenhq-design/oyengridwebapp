import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Grid, ShieldCheck, LogOut, LayoutDashboard, Users, BookOpen, 
  MessageSquare, BrainCircuit, BarChart3, Settings, Building2, User, UserCheck, 
  Lock, CheckCircle2, AlertCircle, ShoppingBag, Sparkles, Play, HelpCircle, 
  Layers, Landmark, Calendar, Award, RefreshCw, FileSpreadsheet, ShieldAlert,
  ArrowRight, ArrowLeft, Plus, Check, Ticket, UserPlus, ClipboardList, Laptop,
  Globe
} from 'lucide-react';
import SignInForm from './components/SignInForm';
import OrgRegistrationForm from './components/OrgRegistrationForm';
import PublicEventForm from './components/PublicEventForm';
import InvitationAcceptance from './components/InvitationAcceptance';
import ForgotPasswordForm from './components/ForgotPasswordForm';


export default function App() {
  const [activeRoute, setActiveRoute] = useState('portal'); // 'portal' | 'signup' | 'signin' | 'forgot-password' | 'public-event' | 'accept-invite' | 'onboarding' | 'dashboard'
  const [theme, setTheme] = useState('dark');
  
  // Auth state
  const [user, setUser] = useState(null); 
  const [userRole, setUserRole] = useState('Workspace Super Admin');
  
  // Workspace Template configuration
  const [activeTemplate, setActiveTemplate] = useState('enterprise'); // 'enterprise' | 'bootcamp' | 'education' | 'events'
  
  // Modules status (Dynamic activations via Marketplace/Settings)
  const [enabledTemplates, setEnabledTemplates] = useState({
    enterprise: true,
    bootcamp: false,
    education: false,
    events: false
  });

  // Onboarding wizard internal step
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [firstProgramName, setFirstProgramName] = useState('');
  const [invitedTeamEmail, setInvitedTeamEmail] = useState('');
  const [invitedTeamRole, setInvitedTeamRole] = useState('Programme Manager');
  // Simulation & Verification inputs
  const [simulateStatus, setSimulateStatus] = useState('Found'); // 'Found' | 'Not Found'
  const [verifyOrgNameInput, setVerifyOrgNameInput] = useState('');
  const [verifyOrgEmailInput, setVerifyOrgEmailInput] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // null | 'found' | 'not-found'
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');

  // Premium Onboarding Step 1 States
  const [orgLogo, setOrgLogo] = useState(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [orgName, setOrgName] = useState('ABC Energy'); // Prefilled from verified subscription
  const [orgIndustry, setOrgIndustry] = useState('Energy');
  const [orgSize, setOrgSize] = useState('11-50');
  const [orgCountry, setOrgCountry] = useState('United States');
  const [orgTimezone, setOrgTimezone] = useState('GMT-5 (EST)');
  const [orgDesc, setOrgDesc] = useState('');

  // Onboarding Step 2: Owner states
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerTitle, setOwnerTitle] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerConfirmPassword, setOwnerConfirmPassword] = useState('');
  const [isAuthorizedOwner, setIsAuthorizedOwner] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [lockedTabTarget, setLockedTabTarget] = useState(null); 

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
    if (user || activeRoute === 'onboarding') return; 

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
  }, [user, theme, activeRoute]);

  const handleCountryChange = (country) => {
    setOrgCountry(country);
    const timezoneMap = {
      'United States': 'GMT-5 (EST)',
      'United Kingdom': 'GMT+0 (BST)',
      'Nigeria': 'GMT+1 (WAT)',
      'Singapore': 'GMT+8 (SGT)',
      'Canada': 'GMT-5 (EST)',
      'Germany': 'GMT+1 (CET)',
      'Australia': 'GMT+10 (AEST)',
      'India': 'GMT+5:30 (IST)'
    };
    if (timezoneMap[country]) {
      setOrgTimezone(timezoneMap[country]);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSuccess = (email, role = 'Workspace Super Admin') => {
    setUser(email);
    setUserRole(role);
    setActiveRoute('dashboard');
    setActiveTab('Dashboard');
    setLockedTabTarget(null);
  };

  const handleOrgRegistrationComplete = (email, template) => {
    // Save template choices
    setActiveTemplate(template);
    
    // Enable the selected template specifically
    const templates = { enterprise: false, bootcamp: false, education: false, events: false };
    templates[template] = true;
    setEnabledTemplates(templates);

    // Save auth email
    setUser(email);
    setUserRole('Organization Owner');

    // Route to Onboarding Walkthrough
    setOnboardingStep(1);
    setActiveRoute('onboarding');
  };

  const handleInviteAcceptanceComplete = (email, role) => {
    setUser(email);
    setUserRole(role);
    // Switch active template depending on role or default
    setActiveRoute('dashboard');
    setActiveTab('Dashboard');
    setLockedTabTarget(null);
  };

  const handleLogOut = () => {
    setUser(null);
    setActiveRoute('portal');
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
    if (nextState) {
      setActiveTemplate(tempId);
      setActiveTab('Dashboard');
      setLockedTabTarget(null);
    }
  };

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
        { id: 'Students', label: 'Students', icon: <Users size={18} />, enabled: true },
        { id: 'Courses', label: 'Courses', icon: <BookOpen size={18} />, enabled: true },
        { id: 'Faculties', label: 'Faculties', icon: <Landmark size={18} />, enabled: true },
        { id: 'Semesters', label: 'Semesters', icon: <Calendar size={18} />, enabled: true },
        { id: 'Results', label: 'Results', icon: <FileSpreadsheet size={18} />, enabled: true }
      );
    } else if (activeTemplate === 'events') {
      modules.push(
        { id: 'Speakers', label: 'Speakers', icon: <Users size={18} />, enabled: true },
        { id: 'Sessions', label: 'Sessions', icon: <Layers size={18} />, enabled: true },
        { id: 'Registration', label: 'Registration', icon: <ClipboardList size={18} />, enabled: true },
        { id: 'Check-in', label: 'Check-in', icon: <Ticket size={18} />, enabled: true },
        { id: 'Certificates', label: 'Certificates', icon: <Award size={18} />, enabled: true }
      );
    }

    // Append platform level modules
    modules.push(
      { id: 'AI Workspace', label: 'AI Workspace', icon: <BrainCircuit size={18} />, enabled: true },
      { id: 'Marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} />, enabled: true },
      { id: 'Billing & Settings', label: 'Billing & Settings', icon: <Settings size={18} />, enabled: true }
    );

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

  const getAiSuggestions = () => {
    if (activeTemplate === 'enterprise') {
      return [
        'Generate compliance training report',
        'Outline department skill gaps policy',
        'Draft corporate code of conduct'
      ];
    } else if (activeTemplate === 'bootcamp') {
      return [
        'Create a 12-week software engineering bootcamp',
        'Generate Week 4 technical timetable schedule',
        'Draft graduation certificate templates'
      ];
    } else if (activeTemplate === 'education') {
      return [
        'Generate semester course grading thresholds',
        'Outline student faculty allocation guidelines',
        'Compile results grade spreadsheet template'
      ];
    } else if (activeTemplate === 'events') {
      return [
        'Generate masterclass speaker session templates',
        'Draft check-in confirmation correspondence',
        'Outline virtual webinar agendas'
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

    setTimeout(() => {
      let responseText = '';
      if (activeTemplate === 'bootcamp') {
        responseText = `Based on your Bootcamp Workspace, I have drafted the technical curriculum timeline. This template designates cohorts, mentors, curriculum content modules, and check-in attendance slots.`;
      } else if (activeTemplate === 'enterprise') {
        responseText = `I have compiled the compliance checkups report. This tags active employee records and flags any compliance gaps inside departments.`;
      } else if (activeTemplate === 'education') {
        responseText = `For your Education Workspace, I have mapped out course schedules across active Semesters. Let me know if you would like me to output this into student gradebook indexes.`;
      } else {
        responseText = `I have structured your virtual events session check-in logs. Confirmation links have been created for attendees.`;
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

  const generateInviteLink = () => {
    if (!invitedTeamEmail.trim()) return;
    const codes = {
      'Organization Admin': 'ADM',
      'Programme Manager': 'MGR',
      'Facilitator': 'FAC',
      'Trainer': 'TRN',
      'Employee': 'EMP',
      'Participant': 'LRN'
    };
    const codePrefix = codes[invitedTeamRole] || 'EMP';
    const randCode = `${codePrefix}-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedInviteLink(`https://app.oyengrid.com/invite/${randCode}`);
  };

  // Render Post-signup Onboarding Wizard Flow
  if (activeRoute === 'onboarding' && user) {
    const isSplitStep = onboardingStep === 1 || onboardingStep === 2;
    
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: isSplitStep ? '#09090B' : 'var(--bg-primary)', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        transition: 'background-color 0.3s ease'
      }}>
        <div className="form-card" style={{ 
          maxWidth: isSplitStep ? '1100px' : '600px', 
          width: '100%',
          backgroundColor: isSplitStep ? 'rgba(9, 9, 11, 0.95)' : 'var(--bg-card)',
          borderColor: isSplitStep ? 'rgba(255, 255, 255, 0.08)' : 'var(--border-color)',
          transition: 'all 0.3s ease'
        }}>
          
          <div className="wizard-steps" style={{ marginBottom: '2.5rem' }}>
            <div className={`wizard-step-node ${onboardingStep >= 1 ? 'completed' : ''} ${onboardingStep === 1 ? 'active' : ''}`}>1</div>
            <div className={`wizard-step-node ${onboardingStep >= 2 ? 'completed' : ''} ${onboardingStep === 2 ? 'active' : ''}`}>2</div>
            <div className={`wizard-step-node ${onboardingStep >= 3 ? 'completed' : ''} ${onboardingStep === 3 ? 'active' : ''}`}>3</div>
            <div className={`wizard-step-node ${onboardingStep >= 4 ? 'completed' : ''} ${onboardingStep === 4 ? 'active' : ''}`}>4</div>
            <div className={`wizard-step-node ${onboardingStep >= 5 ? 'completed' : ''} ${onboardingStep === 5 ? 'active' : ''}`}>5</div>
          </div>

          {/* STEP 1: Premium Organization Profile */}
          {onboardingStep === 1 && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem' }}>
              
              {/* Form Side */}
              <div>
                <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 1 of 5 • Organization Profile</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>Configure Your Organization</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Let's set up your organization's workspace before inviting your team.
                  </p>
                </div>

                {/* Drag-and-drop Logo Zone */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Organization Logo</label>
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(true);
                    }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setOrgLogo(URL.createObjectURL(e.dataTransfer.files[0]));
                      }
                    }}
                    style={{
                      border: isDraggingLogo ? '2px dashed #D4AF37' : '1px dashed rgba(255, 255, 255, 0.15)',
                      backgroundColor: isDraggingLogo ? 'rgba(212, 175, 55, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        if (e.target.files && e.target.files[0]) {
                          setOrgLogo(URL.createObjectURL(e.target.files[0]));
                        }
                      };
                      input.click();
                    }}
                  >
                    {orgLogo ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <img src={orgLogo} alt="Logo Preview" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <span style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 500 }}>Logo uploaded successfully. Click to replace.</span>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                          Drag & drop your organization logo here, or <span style={{ color: '#D4AF37', fontWeight: 600 }}>Browse Files</span>
                        </p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Supports JPG, PNG up to 2MB</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization Name (pre-filled) */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="org-config-name" style={{ color: 'var(--text-secondary)' }}>Organization Name</label>
                  <input
                    id="org-config-name"
                    type="text"
                    className="form-input"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Prefilled from verified subscription</span>
                </div>

                {/* Industry & Size */}
                <div className="form-row" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="org-config-industry" style={{ color: 'var(--text-secondary)' }}>Industry</label>
                    <select
                      id="org-config-industry"
                      className="form-input"
                      value={orgIndustry}
                      onChange={(e) => setOrgIndustry(e.target.value)}
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                      {['Energy', 'Technology', 'Education', 'Government', 'Healthcare', 'Manufacturing', 'Finance', 'NGO', 'Other'].map(ind => (
                        <option key={ind} value={ind} style={{ background: '#09090B' }}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="org-config-size" style={{ color: 'var(--text-secondary)' }}>Organization Size</label>
                    <select
                      id="org-config-size"
                      className="form-input"
                      value={orgSize}
                      onChange={(e) => setOrgSize(e.target.value)}
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                      {['1-10', '11-50', '51-200', '201-500', '500+'].map(sz => (
                        <option key={sz} value={sz} style={{ background: '#09090B' }}>{sz} employees</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Country & Timezone */}
                <div className="form-row" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="org-config-country" style={{ color: 'var(--text-secondary)' }}>Country</label>
                    <select
                      id="org-config-country"
                      className="form-input"
                      value={orgCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                      {['United States', 'United Kingdom', 'Nigeria', 'Singapore', 'Canada', 'Germany', 'Australia', 'India'].map(c => (
                        <option key={c} value={c} style={{ background: '#09090B' }}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="org-config-timezone" style={{ color: 'var(--text-secondary)' }}>Timezone</label>
                    <input
                      id="org-config-timezone"
                      type="text"
                      className="form-input"
                      value={orgTimezone}
                      onChange={(e) => setOrgTimezone(e.target.value)}
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label" htmlFor="org-config-desc" style={{ color: 'var(--text-secondary)' }}>Organization Description</label>
                  <textarea
                    id="org-config-desc"
                    className="form-input"
                    rows={3}
                    placeholder="Briefly describe your organization and its primary operations."
                    value={orgDesc}
                    onChange={(e) => setOrgDesc(e.target.value)}
                    style={{ resize: 'none', height: '80px', paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    className="secondary-btn" 
                    onClick={() => {
                      setUser(null);
                      setActiveRoute('portal');
                    }}
                    style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="submit-btn" 
                    style={{ 
                      maxWidth: '200px', 
                      background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', 
                      border: '1px solid #D4AF37',
                      color: '#000',
                      fontWeight: 700 
                    }} 
                    onClick={() => setOnboardingStep(2)}
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Side Summary Card */}
              <div style={{ 
                borderLeft: '1px solid rgba(255,255,255,0.08)', 
                paddingLeft: '2.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center' 
              }}>
                <div className="form-card" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  borderColor: 'rgba(212, 175, 55, 0.15)',
                  boxShadow: '0 0 30px rgba(212, 175, 55, 0.03)'
                }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>
                    Workspace Summary
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Organization:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{orgName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Solution:</span>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#fff' }}>
                        {activeTemplate === 'bootcamp' ? 'Bootcamps & Training' : 
                         activeTemplate === 'events' ? 'Webinars & Events' : 
                         activeTemplate === 'education' ? 'Education & Institutions' : 'Enterprise Operations'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Plan:</span>
                      <span style={{ fontWeight: 600, color: '#D4AF37' }}>Standard</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Participants Included:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>50</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Storage:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>10 GB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>AI Allocation:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>Basic</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          {/* STEP 2: Create Organization Owner */}
          {onboardingStep === 2 && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem' }}>
              
              {/* Form Side */}
              <div>
                <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 2 of 5 • Organization Owner</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>Create the organization owner account.</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    This account will manage your workspace, billing, security, team members and platform settings.
                  </p>
                </div>

                {/* Name fields */}
                <div className="form-row" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-firstname" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                    <input
                      id="owner-firstname"
                      type="text"
                      className="form-input"
                      value={ownerFirstName}
                      onChange={(e) => setOwnerFirstName(e.target.value)}
                      placeholder="John"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-lastname" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                    <input
                      id="owner-lastname"
                      type="text"
                      className="form-input"
                      value={ownerLastName}
                      onChange={(e) => setOwnerLastName(e.target.value)}
                      placeholder="Doe"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="form-row" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-email" style={{ color: 'var(--text-secondary)' }}>Work Email</label>
                    <input
                      id="owner-email"
                      type="email"
                      className="form-input"
                      value={user || ''}
                      disabled
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-phone" style={{ color: 'var(--text-secondary)' }}>Work Phone</label>
                    <input
                      id="owner-phone"
                      type="tel"
                      className="form-input"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" htmlFor="owner-title" style={{ color: 'var(--text-secondary)' }}>Job Title</label>
                  <input
                    id="owner-title"
                    type="text"
                    className="form-input"
                    value={ownerTitle}
                    onChange={(e) => setOwnerTitle(e.target.value)}
                    placeholder="e.g. Chief Executive Officer / IT Administrator"
                    style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                </div>

                {/* Passwords */}
                <div className="form-row" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-pass" style={{ color: 'var(--text-secondary)' }}>Create Password</label>
                    <input
                      id="owner-pass"
                      type="password"
                      className="form-input"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-confirmpass" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                    <input
                      id="owner-confirmpass"
                      type="password"
                      className="form-input"
                      value={ownerConfirmPassword}
                      onChange={(e) => setOwnerConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* Authorization check */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  <input
                    id="owner-auth-check"
                    type="checkbox"
                    checked={isAuthorizedOwner}
                    onChange={(e) => setIsAuthorizedOwner(e.target.checked)}
                    style={{ marginTop: '0.2rem', accentColor: '#D4AF37', cursor: 'pointer' }}
                  />
                  <label htmlFor="owner-auth-check" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
                    I confirm I am authorized to create this organization's workspace.
                  </label>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    className="secondary-btn" 
                    onClick={() => setOnboardingStep(1)}
                    style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="submit-btn" 
                    disabled={!isAuthorizedOwner || !ownerPassword || ownerPassword !== ownerConfirmPassword}
                    style={{ 
                      maxWidth: '200px', 
                      background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', 
                      border: '1px solid #D4AF37',
                      color: '#000',
                      fontWeight: 700 
                    }} 
                    onClick={() => setOnboardingStep(3)}
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Sidebar Cards */}
              <div style={{ 
                borderLeft: '1px solid rgba(255,255,255,0.08)', 
                paddingLeft: '2.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                justifyContent: 'center' 
              }}>
                {/* Card 1: Summary */}
                <div className="form-card" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  borderColor: 'rgba(212, 175, 55, 0.15)',
                  boxShadow: '0 0 30px rgba(212, 175, 55, 0.03)',
                  padding: '1.5rem'
                }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>
                    Workspace Summary
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Organization:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{orgName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Solution:</span>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#fff' }}>
                        {activeTemplate === 'bootcamp' ? 'Bootcamps & Training' : 
                         activeTemplate === 'events' ? 'Webinars & Events' : 
                         activeTemplate === 'education' ? 'Education & Institutions' : 'Enterprise Operations'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Plan:</span>
                      <span style={{ fontWeight: 600, color: '#D4AF37' }}>Standard</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Tier:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>Standard</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Participants Included:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>50</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Storage:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>10 GB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>AI Allocation:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>Basic</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Workspace Status:</span>
                      <span style={{ color: '#D4AF37', fontWeight: 600 }}>Pending Activation</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Features Included */}
                <div className="form-card" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '1.25rem'
                }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.875rem' }}>
                    Included in your plan
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: 0, margin: 0, textAlign: 'left' }}>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>✓</span> Up to 50 Participants</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>✓</span> 3 Active Programmes</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>✓</span> Basic AI</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>✓</span> 10GB Storage</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>✓</span> Invite Team Members Later</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Invite Team */}
          {onboardingStep === 3 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 3: Invite Your Team</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Invite co-workers, trainers, or managers. They will receive invitation links to configure their passwords.
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="team-email">Email Address</label>
                  <div className="input-container">
                    <input
                      id="team-email"
                      type="email"
                      className="form-input"
                      placeholder="colleague@company.com"
                      value={invitedTeamEmail}
                      onChange={(e) => setInvitedTeamEmail(e.target.value)}
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="team-role">Role</label>
                  <div className="input-container">
                    <select
                      id="team-role"
                      className="form-input"
                      value={invitedTeamRole}
                      onChange={(e) => setInvitedTeamRole(e.target.value)}
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="Organization Admin">Organization Admin</option>
                      <option value="Programme Manager">Programme Manager</option>
                      <option value="Facilitator">Facilitator</option>
                      <option value="Trainer">Trainer</option>
                      <option value="Employee">Employee</option>
                      <option value="Participant">Participant / Learner</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="button" className="secondary-btn" onClick={generateInviteLink} style={{ marginBottom: '1rem', width: '100%', justifyContent: 'center' }}>
                <UserPlus size={18} /> Generate Invite Link
              </button>

              {generatedInviteLink && (
                <div style={{ padding: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Generated Code Link (Demo)</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                    {generatedInviteLink}
                  </div>
                </div>
              )}

              <div className="wizard-footer-buttons">
                <button className="secondary-btn" onClick={() => setOnboardingStep(2)}>
                  Back
                </button>
                <button className="submit-btn" style={{ maxWidth: '200px' }} onClick={() => setOnboardingStep(4)}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Workspace Settings */}
          {onboardingStep === 4 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Step 4: Workspace Settings</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Customize default preferences for your new workspace environment.
              </p>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Active Working Days</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <span 
                      key={day} 
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '6px', 
                        backgroundColor: day !== 'Sat' && day !== 'Sun' ? 'var(--primary-glow)' : 'var(--bg-input)', 
                        border: day !== 'Sat' && day !== 'Sun' ? '1px solid var(--border-focus)' : '1px solid var(--border-color)',
                        color: day !== 'Sat' && day !== 'Sun' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="work-lang">Default Language</label>
                  <div className="input-container">
                    <select id="work-lang" className="form-input" style={{ paddingLeft: '1rem' }}>
                      <option value="English">English (US)</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="work-attendance">Attendance Verification</label>
                  <div className="input-container">
                    <select id="work-attendance" className="form-input" style={{ paddingLeft: '1rem' }}>
                      <option value="qr">Automatic QR Check-in</option>
                      <option value="manual">Manual Roster Logging</option>
                      <option value="passcode">Unique Session Passcode</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="wizard-footer-buttons">
                <button className="secondary-btn" onClick={() => setOnboardingStep(3)}>
                  Back
                </button>
                <button className="submit-btn" style={{ maxWidth: '200px' }} onClick={() => setOnboardingStep(5)}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Finish Setup */}
          {onboardingStep === 5 && (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Configuration Complete!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Your enterprise learning workspace is ready. Click below to launch the OYEN GRID administration dashboard.
              </p>
              <button className="submit-btn" onClick={() => handleAuthSuccess(user, 'Organization Owner')}>
                Launch Workspace Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Render Dashboard Workspace Preview if Logged In
  if (activeRoute === 'dashboard' && user) {
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
                  {activeTemplate} template
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
                PRO SUBSCRIPTION
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
                        <h4 style={{ fontSize: '1.15rem' }}>Enterprise Operations</h4>
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
                        <h4 style={{ fontSize: '1.15rem' }}>Bootcamps & Training</h4>
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
                        <h4 style={{ fontSize: '1.15rem' }}>Education & Institutions</h4>
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
                        <h4 style={{ fontSize: '1.15rem' }}>Webinars & Events</h4>
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
                  <p style={{ color: 'var(--text-secondary)' }}>Manage active templates and switch setups for quick testing.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                  <div className="form-card">
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Sandbox Quick Switcher</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      Test active workspace structures dynamically:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { id: 'enterprise', name: 'Enterprise Operations' },
                        { id: 'bootcamp', name: 'Bootcamp & Training' },
                        { id: 'education', name: 'Education & Institutions' },
                        { id: 'events', name: 'Webinars & Events' }
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status Plan</span>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>PRO PLAN</p>
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
                    Active Workspace Template: <code>{activeTemplate}</code>
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
      <section className="brand-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="brand-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(9, 9, 11, 0.4) 0%, rgba(9, 9, 11, 0.85) 100%)',
          zIndex: 2
        }} />

        {/* Floating Gold Hexagons Overlay */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2, opacity: 0.15 }}>
          <svg width="100%" height="100%" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, right: 0 }}>
            <polygon points="350,50 390,120 350,190 270,190 230,120 270,50" stroke="#D4AF37" strokeWidth="1.5" />
            <polygon points="310,130 350,200 310,270 230,270 190,200 230,130" stroke="#D4AF37" strokeWidth="1" />
          </svg>
        </div>
        
        <header className="brand-header" style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: '#D4AF37', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid size={16} color="#000" />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
            OYEN <span style={{ color: '#D4AF37' }}>GRID</span>
          </span>
        </header>

        <div className="brand-content" style={{ position: 'relative', zIndex: 3, maxWidth: '480px' }}>
          <h1 className="brand-title" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
            Secure portal built to protect <span style={{ color: '#D4AF37' }}>institutional knowledge.</span>
          </h1>
          <p className="brand-subtitle" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem', fontWeight: 500 }}>
            End-to-End Encrypted. Inspected. Authorized.
          </p>
        </div>

        {/* Bottom Progress Slider (3rd Segment Gold) */}
        <div style={{ display: 'flex', gap: '0.5rem', zIndex: 3, marginBottom: '1rem' }}>
          <span style={{ width: '40px', height: '3px', borderRadius: '1.5px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}></span>
          <span style={{ width: '40px', height: '3px', borderRadius: '1.5px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}></span>
          <span style={{ width: '40px', height: '3px', borderRadius: '1.5px', backgroundColor: '#D4AF37' }}></span>
          <span style={{ width: '40px', height: '3px', borderRadius: '1.5px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}></span>
        </div>
      </section>

      {/* Form Panel (Right) */}
      <main className="form-panel">
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle dark/light mode">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="form-wrapper">
          {activeRoute === 'portal' && (
            <div className="animate-fade-in" style={{ backgroundColor: 'transparent' }}>
              
              {/* Language & Simulator Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>SIMULATE:</span>
                  <button 
                    onClick={() => setSimulateStatus('Found')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: simulateStatus === 'Found' ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                      fontWeight: simulateStatus === 'Found' ? 800 : 500,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    Found
                  </button>
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                  <button 
                    onClick={() => setSimulateStatus('Not Found')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: simulateStatus === 'Not Found' ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                      fontWeight: simulateStatus === 'Not Found' ? 800 : 500,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    Not Found
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '0.4rem 0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                  <Globe size={14} />
                  <span>English</span>
                  <span style={{ fontSize: '0.6rem' }}>▼</span>
                </div>
              </div>

              {/* CASE 1: Subscription Found */}
              {verificationResult === 'found' && (
                <div className="animate-fade-in" style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Verify your organization</span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Subscription Found</h2>
                  
                  <div className="form-card" style={{ 
                    marginTop: '1.5rem', 
                    marginBottom: '2rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    borderColor: 'rgba(212, 175, 55, 0.15)',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.03)',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Organization:</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{verifyOrgNameInput.trim() || 'ABC Energy Ltd'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Plan:</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Bootcamps & Training</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Tier:</span>
                        <span style={{ fontWeight: 600, color: '#D4AF37' }}>Standard</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Status:</span>
                        <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="submit-btn"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                      border: '1px solid #D4AF37',
                      color: '#000',
                      fontWeight: 700,
                      borderRadius: '6px',
                      padding: '0.875rem'
                    }}
                    onClick={() => {
                      setOrgName(verifyOrgNameInput.trim() || 'ABC Energy Ltd');
                      setUser(verifyOrgEmailInput.trim());
                      setUserRole('Organization Owner');
                      handleOrgRegistrationComplete(verifyOrgEmailInput.trim(), 'bootcamp');
                    }}
                  >
                    Continue Setup <ArrowRight size={16} />
                  </button>

                  <button 
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '1.25rem',
                      fontWeight: 500
                    }}
                    onClick={() => setVerificationResult(null)}
                  >
                    ← Use different details
                  </button>
                </div>
              )}

              {/* CASE 2: Subscription Not Found */}
              {verificationResult === 'not-found' && (
                <div className="animate-fade-in" style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px' }}>Verification Result</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff', fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>
                    We couldn't find an active OYEN GRID subscription for this organization.
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginTop: '0.75rem', lineHeight: '1.6' }}>
                    To create a workspace, your organization needs an active subscription.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
                    <button 
                      type="button" 
                      className="submit-btn"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                        border: '1px solid #D4AF37',
                        color: '#000',
                        fontWeight: 700,
                        borderRadius: '6px',
                        padding: '0.875rem'
                      }}
                      onClick={() => alert('Demo Workspace launched inside mock container.')}
                    >
                      Start Free Demo
                    </button>
                    <button 
                      type="button" 
                      className="secondary-btn"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#fff',
                        width: '100%',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        padding: '0.875rem'
                      }}
                      onClick={() => alert('Navigating to pricing catalog...')}
                    >
                      View Plans
                    </button>
                  </div>

                  <button 
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '1.25rem',
                      fontWeight: 500
                    }}
                    onClick={() => setVerificationResult(null)}
                  >
                    ← Go back to verify
                  </button>
                </div>
              )}

              {/* Default Input Form */}
              {verificationResult === null && (
                <>
                  {/* Title Header */}
                  <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Verify your organization</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      Continue with the email used to subscribe to an OYEN GRID workspace.
                    </p>
                  </div>

                  {verifyError && (
                    <div style={{
                      padding: '0.8rem 1rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '6px',
                      color: '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      marginBottom: '1.5rem',
                      textAlign: 'left'
                    }}>
                      ⚠️ {verifyError}
                    </div>
                  )}

                  {/* Form Inputs */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!verifyOrgEmailInput.trim()) {
                      setVerifyError('Organization email is required to verify your subscription.');
                      return;
                    }
                    setVerifyError('');

                    if (simulateStatus === 'Found') {
                      setVerificationResult('found');
                    } else {
                      setVerificationResult('not-found');
                    }
                  }} style={{ textAlign: 'left' }}>
                    
                    {/* Org Name */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" htmlFor="verify-name-input" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.8rem' }}>Organization Name</label>
                      <input
                        id="verify-name-input"
                        type="text"
                        className="form-input"
                        placeholder="e.g. ABC Energy Ltd"
                        value={verifyOrgNameInput}
                        onChange={(e) => setVerifyOrgNameInput(e.target.value)}
                        style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                      />
                    </div>

                    {/* Org Email */}
                    <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                      <label className="form-label" htmlFor="verify-email-input" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.8rem' }}>Organization Email</label>
                      <input
                        id="verify-email-input"
                        type="email"
                        className="form-input"
                        placeholder="name@organization.com"
                        value={verifyOrgEmailInput}
                        onChange={(e) => setVerifyOrgEmailInput(e.target.value)}
                        style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                        border: '1px solid #D4AF37',
                        color: '#000',
                        fontWeight: 700,
                        borderRadius: '6px',
                        padding: '0.875rem'
                      }}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </form>

                  {/* Form Footer */}
                  <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                    Already have an account? <span onClick={() => setActiveRoute('signin')} style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }}>Sign In</span>
                  </div>

                  <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    Need OYEN GRID? <span style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }}>View Plans →</span>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                <span>All Systems Operational</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                <span style={{ cursor: 'pointer' }}>Terms</span>
                <span style={{ cursor: 'pointer' }}>Support</span>
                <span style={{ cursor: 'pointer' }}>Contact</span>
              </div>

            </div>
          )}

          {activeRoute === 'signin' && (
            <SignInForm 
              onSwitchForm={(route) => {
                if (route === 'portal') setActiveRoute('signup');
                else setActiveRoute(route);
              }} 
              onAuthSuccess={(email) => handleAuthSuccess(email, 'Workspace Owner')} 
            />
          )}

          {activeRoute === 'signup' && (
            <OrgRegistrationForm 
              onSwitchForm={setActiveRoute} 
              onComplete={handleOrgRegistrationComplete} 
            />
          )}

          {activeRoute === 'public-event' && (
            <PublicEventForm 
              onSwitchForm={setActiveRoute} 
            />
          )}

          {activeRoute === 'accept-invite' && (
            <InvitationAcceptance 
              onSwitchForm={setActiveRoute} 
              onComplete={handleInviteAcceptanceComplete} 
            />
          )}

          {activeRoute === 'forgot-password' && (
            <ForgotPasswordForm 
              onSwitchForm={(route) => setActiveRoute(route === 'signin' ? 'signin' : 'portal')} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
