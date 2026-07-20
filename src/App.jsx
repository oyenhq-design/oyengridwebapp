import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Grid, ShieldCheck, LogOut, Users, BookOpen, 
  BrainCircuit, BarChart3, Settings, Building2, User, UserCheck, 
  Lock, CheckCircle2, Sparkles, 
  Calendar, Award, 
  ArrowRight, Check, UserPlus, 
  Globe, Menu, Search, Bell, ChevronDown, Home, Clock, Headphones,
  Shield, Rocket, FileText, Mail, HardDrive
} from 'lucide-react';
import OrgRegistrationForm from './components/OrgRegistrationForm';
import PublicEventForm from './components/PublicEventForm';
import InvitationAcceptance from './components/InvitationAcceptance';
import SignInForm from './components/SignInForm';
import TeamManagement from './components/TeamManagement';
import ProgramsTab from './components/ProgramsTab';
import LearnersTab from './components/LearnersTab';
import SessionsTab from './components/SessionsTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';


export default function App() {
  const [activeRoute, setActiveRoute] = useState('portal'); // 'portal' | 'signup' | 'signin' | 'forgot-password' | 'public-event' | 'accept-invite' | 'onboarding' | 'dashboard'
  const [showTransition, setShowTransition] = useState(false);
  const [transitionFading, setTransitionFading] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // Auth state
  const [user, setUser] = useState(null); 
  const [userRole, setUserRole] = useState('Workspace Super Admin');
  const [authLoading, setAuthLoading] = useState(true);
  
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
  const [invitedTeamEmail, setInvitedTeamEmail] = useState('');
  const [invitedTeamRole, setInvitedTeamRole] = useState('Programme Manager');
  // Simulation & Verification inputs
  const [verifyOrgNameInput, setVerifyOrgNameInput] = useState('');
  const [verifyOrgEmailInput, setVerifyOrgEmailInput] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // null | 'found' | 'not-found'
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');

  // Premium Onboarding Step 1 States
  const [orgLogo, setOrgLogo] = useState(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [orgName, setOrgName] = useState('abc energy'); // Prefilled from verified subscription
  const [orgIndustry, setOrgIndustry] = useState('Energy');
  const [orgSize, setOrgSize] = useState('11-50');
  const [orgCountry, setOrgCountry] = useState('United States');
  const [orgTimezone, setOrgTimezone] = useState('GMT-5 (EST)');
  const [orgDesc, setOrgDesc] = useState('');

  // Onboarding Step 2: Owner states
  const [ownerFirstName, setOwnerFirstName] = useState('John');
  const [ownerLastName, setOwnerLastName] = useState('Doe');
  const [ownerPhone, setOwnerPhone] = useState('+1 (555) 000-0000');
  const [ownerTitle, setOwnerTitle] = useState('Chief Executive Officer');
  const [ownerEmail, setOwnerEmail] = useState('abc@gmail.com');
  const [ownerPersonalEmail, setOwnerPersonalEmail] = useState('personal@email.com');
  const [ownerPassword, setOwnerPassword] = useState('password');
  const [ownerConfirmPassword, setOwnerConfirmPassword] = useState('password');
  const [isAuthorizedOwner, setIsAuthorizedOwner] = useState(false);
  const [ownerPhoto, setOwnerPhoto] = useState(null); // Base64 or object URL of the owner's profile photo

  const [activeTab, setActiveTab] = useState('Dashboard');

  // Shared workspace data — lifted so Programs + Learners stay in sync
  const [wsPrograms, setWsPrograms] = useState([]);
  const [wsLearners, setWsLearners] = useState([]);
  const [wsTeam, setWsTeam]         = useState([
    { initials: 'JD', color: '#D4AF37', name: 'John Doe',        isYou: true, email: 'john.doe@abcenergy.com',        role: 'Organization Owner', status: 'Active',  joined: 'May 22, 2025' },
    { initials: 'SA', color: '#7c3aed', name: 'Sarah Ahmed',                  email: 'sarah.ahmed@abcenergy.com',     role: 'Admin',              status: 'Active',  joined: 'May 21, 2025' },
    { initials: 'MI', color: '#16a34a', name: 'Michael Ibrahim',              email: 'michael.ibrahim@abcenergy.com', role: 'Program Manager',    status: 'Active',  joined: 'May 20, 2025' },
    { initials: 'FA', color: '#0284c7', name: 'Fatima Aliyu',                 email: 'fatima.aliyu@abcenergy.com',    role: 'Facilitator',        status: 'Active',  joined: 'May 18, 2025' },
    { initials: 'NK', color: '#b45309', name: 'Ngozi Kalu',                   email: 'ngozi.kalu@abcenergy.com',      role: 'Viewer',             status: 'Pending', joined: 'May 22, 2025' },
  ]);

  const [wsInvitations, setWsInvitations] = useState([
    {
      name: 'Test Facilitator',
      email: 'facilitator@oyengrid.test',
      accessCode: 'OYEN-FAC-7K4M9Q',
      role: 'Facilitator',
      status: 'Pending',
      used: false,
      invitedAt: '19 Jul 2026',
      expiresAt: '27 Jul 2026'
    }
  ]);

  // AI Assistant Chat Mock


  const canvasRef = useRef(null);

  // Header Search & Notification States
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Sarah Ahmed accepted your team invitation', time: '2 minutes ago', read: false },
    { id: 2, text: 'New program created', time: 'Today', read: false },
    { id: 3, text: 'Your weekly program report is ready', time: 'Yesterday', read: false }
  ]);

  useEffect(() => {
    const handleCloseDropdowns = (e) => {
      if (e.key === 'Escape') {
        setShowProfileDropdown(false);
        setShowNotifications(false);
      }
    };
    
    const handleClickOutside = (e) => {
      const trigger = document.getElementById('user-profile-trigger');
      if (trigger && !trigger.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };

    window.addEventListener('keydown', handleCloseDropdowns);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleCloseDropdowns);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);



  const getLoggedInUserInfo = () => {
    if (!user) {
      return {
        fullName: 'Guest User',
        initials: 'GU',
        role: 'Guest',
        email: '',
        photo: null
      };
    }
    if (user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com') {
      return {
        fullName: `${ownerFirstName} ${ownerLastName}`,
        initials: `${ownerFirstName?.[0] || 'J'}${ownerLastName?.[0] || 'D'}`,
        role: userRole || 'Organization Owner',
        email: user,
        photo: ownerPhoto
      };
    }
    const member = wsTeam.find(m => m.email?.toLowerCase() === user?.toLowerCase());
    if (member) {
      const names = (member.name || '').split(' ');
      const init = names.length >= 2 
        ? `${names[0]?.[0] || ''}${names[1]?.[0] || ''}` 
        : `${names[0]?.[0] || ''}${names[0]?.[1] || ''}`;
      return {
        fullName: member.name || user,
        initials: init.toUpperCase() || 'U',
        role: member.role || userRole || 'Team Member',
        email: user,
        photo: null
      };
    }
    return {
      fullName: user.split('@')[0],
      initials: (user?.[0] || 'U').toUpperCase(),
      role: userRole || 'Workspace Facilitator',
      email: user,
      photo: null
    };
  };

  // Helper to push a notification globally
  const addNotification = (text) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · ' + today;
    setNotifications(prev => [
      { id: Date.now(), text, time: nowTime, read: false },
      ...prev
    ]);
  };

  // Compile search results dynamically from all workspace items
  const getDynamicSearchItems = () => {
    const items = [];

    // Add team members
    wsTeam.forEach(m => {
      items.push({ name: m.name, type: 'Team Member', detail: m.role, tab: 'Team' });
    });

    // Add programs
    wsPrograms.forEach(p => {
      items.push({ name: p.name, type: 'Program', detail: p.desc || 'Training program', tab: 'Programmes' });

      // Add program resources
      (p.resources || []).forEach(r => {
        items.push({ name: r.name, type: 'Resource', detail: `Program file: ${r.fileName}`, tab: 'Programmes' });
      });

      // Add program assessments
      (p.assessments || []).forEach(a => {
        items.push({ name: a.name, type: 'Assessment', detail: `${a.type} assessment`, tab: 'Programmes' });
      });

      // Add sessions
      (p.sessions || []).forEach(s => {
        items.push({ name: s.title, type: 'Session', detail: `Session on ${s.date}`, tab: 'Sessions' });

        // Add session resources
        (s.resources || []).forEach(sr => {
          items.push({ name: sr.name, type: 'Resource', detail: `Session file: ${sr.fileName}`, tab: 'Sessions' });
        });
      });
    });

    wsLearners.forEach(l => {
      items.push({ name: l.name, type: 'Participant', detail: l.email, tab: 'Learners' });
    });

    return items;
  };

  const searchResults = searchQuery.trim()
    ? getDynamicSearchItems().filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Initialize and update theme attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Restore session token and workspace data on startup
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = sessionStorage.getItem('oyen_session_token');
      if (token) {
        const storedUser = sessionStorage.getItem('oyen_session_user');
        if (storedUser) {
          try {
            const { email, role, activeTemplate: tpl, enabledTemplates: enabled } = JSON.parse(storedUser);
            setUser(email);
            setUserRole(role);
            setActiveTemplate(tpl || 'enterprise');
            setEnabledTemplates(enabled || { enterprise: true, bootcamp: false, education: false, events: false });
            
            const savedProgs = sessionStorage.getItem('oyen_ws_programs');
            if (savedProgs) setWsPrograms(JSON.parse(savedProgs));
            const savedLearners = sessionStorage.getItem('oyen_ws_learners');
            if (savedLearners) setWsLearners(JSON.parse(savedLearners));
            const savedTeam = sessionStorage.getItem('oyen_ws_team');
            if (savedTeam) setWsTeam(JSON.parse(savedTeam));
            
            setActiveRoute('dashboard');
            setActiveTab(role === 'Facilitator' ? 'Overview' : 'Dashboard');
          } catch (e) {
            console.error('Error parsing session data', e);
            setActiveRoute('portal');
          }
        } else {
          setActiveRoute('portal');
        }
      } else {
        setActiveRoute('portal');
      }
      setAuthLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Save session & workspace changes to sessionStorage in real-time
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('oyen_session_user', JSON.stringify({
        email: user,
        role: userRole,
        activeTemplate,
        enabledTemplates
      }));
      sessionStorage.setItem('oyen_ws_programs', JSON.stringify(wsPrograms));
      sessionStorage.setItem('oyen_ws_learners', JSON.stringify(wsLearners));
      sessionStorage.setItem('oyen_ws_team', JSON.stringify(wsTeam));
    }
  }, [user, userRole, activeTemplate, enabledTemplates, wsPrograms, wsLearners, wsTeam]);



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
    sessionStorage.setItem('oyen_session_token', `oyen_token_${Date.now()}`);
    triggerTransition(() => {
      setUser(email);
      setUserRole(role);
      setActiveRoute('dashboard');
      setActiveTab('Dashboard');
    });
  };

  const handleOrgRegistrationComplete = (email, template) => {
    sessionStorage.setItem('oyen_session_token', `oyen_token_${Date.now()}`);
    triggerTransition(() => {
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
    });
  };

  const handleInviteAcceptanceComplete = (email, role) => {
    sessionStorage.setItem('oyen_session_token', `oyen_token_${Date.now()}`);
    triggerTransition(() => {
      setUser(email);
      setUserRole(role);
      // Switch active template depending on role or default
      setActiveRoute('dashboard');
      setActiveTab('Dashboard');
    });
  };

  const handleLogOut = () => {
    triggerTransition(() => {
      setUser(null);
      setUserRole(null);
      sessionStorage.removeItem('oyen_session_token');
      sessionStorage.removeItem('oyen_session_user');
      setActiveRoute('signin');
      setActiveTab('Welcome');
    });
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Page Transition Helper Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  // Shows the branded overlay for ~1.5s then runs the callback
  const triggerTransition = (callback, delay = 400) => {
    setTransitionFading(false);
    setShowTransition(true);
    // Start fading out 200ms before the callback fires
    setTimeout(() => setTransitionFading(true), delay - 200);
    setTimeout(() => {
      setShowTransition(false);
      setTransitionFading(false);
      callback();
    }, delay);
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

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Page Transition Overlay (every button click) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  if (showTransition) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: transitionFading ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Outer spinning arc ring */}
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          {/* Rotating SVG arc */}
          <svg
            width="140" height="140"
            viewBox="0 0 140 140"
            style={{
              position: 'absolute',
              top: 0, left: 0,
              animation: 'transitionSpin 1.2s linear infinite',
            }}
          >
            <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="3" />
            <circle
              cx="70" cy="70" r="62"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="280"
              strokeDashoffset="180"
            />
          </svg>

          {/* Center logo circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            backgroundColor: '#111111',
            border: '1px solid rgba(212,175,55,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}>
            {/* OYEN hexagon icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }}>
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#D4AF37" strokeWidth="1.5" fill="rgba(212,175,55,0.08)"/>
              <path d="M12 6L9 12H15L12 18" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* OYEN wordmark */}
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#D4AF37',
              fontFamily: 'system-ui, sans-serif',
              lineHeight: 1,
            }}>OYEN</span>
          </div>
        </div>

        {/* Brand name below */}
        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}>
            OYEN GRID
          </div>
        </div>

        <style>{`
          @keyframes transitionSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }



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
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 1 of 5 Ã¢â‚¬Â¢ Organization Profile</span>
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
                    onClick={() => triggerTransition(() => {
                      setUser(null);
                      setActiveRoute('portal');
                    })}
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
                    onClick={() => triggerTransition(() => setOnboardingStep(2))}
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 2 of 5 Ã¢â‚¬Â¢ Organization Owner</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>Create the organization owner account.</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    This account will manage your workspace, billing, security, team members and platform settings.
                  </p>
                </div>

                {/* Profile Photo Upload */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Profile Photo
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Avatar preview circle */}
                    <div
                      onClick={() => document.getElementById('owner-photo-input').click()}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: ownerPhoto ? 'transparent' : 'rgba(212,175,55,0.1)',
                        border: '2px dashed rgba(212,175,55,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        flexShrink: 0,
                        transition: 'border-color 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#D4AF37'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'}
                    >
                      {ownerPhoto ? (
                        <img
                          src={ownerPhoto}
                          alt="Profile"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'rgba(212,175,55,0.6)' }}>
                          <User size={28} />
                          <div style={{ fontSize: '0.6rem', marginTop: '2px', color: 'rgba(255,255,255,0.3)' }}>Photo</div>
                        </div>
                      )}
                    </div>

                    {/* Upload info & button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('owner-photo-input').click()}
                        style={{
                          background: 'rgba(212,175,55,0.08)',
                          border: '1px solid rgba(212,175,55,0.35)',
                          color: '#D4AF37',
                          borderRadius: '8px',
                          padding: '0.45rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          marginBottom: '0.4rem',
                          display: 'block',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
                      >
                        {ownerPhoto ? 'Change Photo' : 'Upload Photo'}
                      </button>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                        JPG, PNG up to 5MB
                      </span>
                      {ownerPhoto && (
                        <button
                          type="button"
                          onClick={() => setOwnerPhoto(null)}
                          style={{
                            display: 'block',
                            marginTop: '0.25rem',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(239,68,68,0.7)',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Remove photo
                        </button>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      id="owner-photo-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setOwnerPhoto(url);
                        }
                      }}
                    />
                  </div>
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

                {/* Email Fields */}
                <div className="form-row" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-email" style={{ color: 'var(--text-secondary)' }}>Work Email</label>
                    <input
                      id="owner-email"
                      type="email"
                      className="form-input"
                      value={ownerEmail !== '' ? ownerEmail : (user || '')}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="name@organization.com"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-personal-email" style={{ color: 'var(--text-secondary)' }}>Personal Email (Optional)</label>
                    <input
                      id="owner-personal-email"
                      type="email"
                      className="form-input"
                      value={ownerPersonalEmail}
                      onChange={(e) => setOwnerPersonalEmail(e.target.value)}
                      placeholder="personal@email.com"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* Phone & Job Title */}
                <div className="form-row" style={{ marginBottom: '1rem' }}>
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
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-title" style={{ color: 'var(--text-secondary)' }}>Job Title</label>
                    <input
                      id="owner-title"
                      type="text"
                      className="form-input"
                      value={ownerTitle}
                      onChange={(e) => setOwnerTitle(e.target.value)}
                      placeholder="e.g. Chief Executive Officer"
                      style={{ paddingLeft: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
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
                      placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
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
                      placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
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
                    onClick={() => triggerTransition(() => setOnboardingStep(1))}
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
                    onClick={() => triggerTransition(() => {
                      setUser(ownerEmail || 'abc@gmail.com');
                      setUserRole('Organization Owner');
                      setOrgName('abc energy');
                      setActiveRoute('dashboard');
                      setActiveTab('Dashboard');
                    })}
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
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>Ã¢Å“â€œ</span> Up to 50 Participants</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>Ã¢Å“â€œ</span> 3 Active Programmes</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>Ã¢Å“â€œ</span> Basic AI</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>Ã¢Å“â€œ</span> 10GB Storage</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>Ã¢Å“â€œ</span> Invite Team Members Later</li>
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
    const isWelcome = activeTab === 'Welcome' || activeTab === 'Dashboard' || activeTab === 'Overview';
    const showFacilitatorOverview = userRole === 'Facilitator' && isWelcome;

    const allSidebarItems = [
      { id: 'Welcome', label: 'Welcome', icon: <Home size={18} /> },
      { id: 'Getting Started', label: 'Getting Started', icon: <Clock size={18} /> },
      { id: 'Your Workspace', label: 'Your Workspace', icon: <Grid size={18} /> },
      { id: 'Team', label: 'Team', icon: <Users size={18} /> },
      { id: 'Programmes', label: 'Programmes', icon: <BookOpen size={18} /> },
      { id: 'Learners', label: 'Participants', icon: <UserCheck size={18} /> },
      { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
      { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
      { id: 'Settings', label: 'Settings', icon: <Settings size={18} /> }
    ];

    const sidebarItems = userRole === 'Facilitator'
      ? [
          { id: 'Overview', label: 'Overview', icon: <Home size={18} /> },
          { id: 'My Programs', label: 'My Programs', icon: <BookOpen size={18} /> },
          { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
          { id: 'Learners', label: 'Learners', icon: <UserCheck size={18} /> },
          { id: 'Resources', label: 'Resources', icon: <Grid size={18} /> },
          { id: 'Session Notes', label: 'Session Notes', icon: <FileText size={18} /> }
        ]
      : allSidebarItems;

    const displayPrograms = userRole === 'Facilitator'
      ? wsPrograms.map(p => {
          const facilitatorSessions = (p.sessions || []).filter(s => s.facilitatorEmail?.toLowerCase() === user.toLowerCase());
          return {
            ...p,
            sessions: facilitatorSessions
          };
        }).filter(p => p.sessions.length > 0 || p.facilitatorEmail?.toLowerCase() === user.toLowerCase())
      : wsPrograms;

    return (
      <div className="dashboard-root" style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#090a0f',
        color: '#fff',
        fontFamily: "var(--font-sans)",
        overflowX: 'hidden'
      }}>
        {/* Global Top Header Bar */}
        <header style={{
          height: '70px',
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Header Left: Hamburger & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: '#a0aec0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Gold hexagon with bolt logo */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid #D4AF37',
                padding: '0.35rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#D4AF37" strokeWidth="2.5" fill="rgba(212, 175, 55, 0.2)"/>
                  <path d="M12 6L9 12H15L12 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', fontFamily: 'var(--font-display)' }}>ABC ENERGY</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.5px', textTransform: 'uppercase' }}>WORKSPACE</span>
              </div>
            </div>
          </div>

          {/* Header Right: Search, Alerts, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
            
            {/* Expandable Search */}
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {searchExpanded ? (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.35rem 0.75rem', width: '260px', animation: 'scaleUp 0.15s ease' }}>
                  <Search size={16} color="rgba(255,255,255,0.4)" style={{ marginRight: '0.5rem' }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search workspace..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.82rem', outline: 'none', width: '100%', padding: 0 }}
                  />
                  <button 
                    onClick={() => { setSearchExpanded(false); setSearchQuery(''); }}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0 0 0 0.4rem', fontSize: '0.8rem' }}
                  >
                    âœ•
                  </button>

                  {/* Search Results Dropdown */}
                  {searchQuery.trim() && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '280px', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1100, overflow: 'hidden', padding: '0.5rem 0' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', padding: '0.25rem 0.85rem 0.5rem 0.85rem', borderBottom: '1px solid rgba(255,255,255,0.04)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                        Search Results
                      </div>
                      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {searchResults.length > 0 ? (
                          searchResults.map((item, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (item.type === 'Team Member') {
                                  triggerTransition(() => setActiveTab('Team'));
                                } else if (item.type === 'Program') {
                                  triggerTransition(() => setActiveTab('Programmes'));
                                }
                                setSearchExpanded(false);
                                setSearchQuery('');
                              }}
                              style={{ padding: '0.6rem 0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.1rem', textAlign: 'left' }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{item.name}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>
                                <span>{item.detail}</span>
                                <span style={{ color: '#D4AF37', fontWeight: 700 }}>{item.type}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                            No results found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setSearchExpanded(true)}
                  style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Notification Bell with Dropdown */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'transparent', border: 'none', color: showNotifications ? '#fff' : '#a0aec0', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <Bell size={20} />
                {unreadNotificationCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{unreadNotificationCount}</span>
                )}
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '1.2rem', width: '360px', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', boxShadow: '0 15px 45px rgba(0,0,0,0.6)', zIndex: 1200, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <button 
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
                          }}
                          style={{
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid rgba(255,255,255,0.02)',
                            backgroundColor: n.read ? 'transparent' : 'rgba(212,175,55,0.02)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            transition: 'background 0.2s',
                            textAlign: 'left'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(212,175,55,0.02)'}
                        >
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37', marginTop: '0.35rem', flexShrink: 0 }} />}
                            <span style={{ fontSize: '0.8rem', color: n.read ? 'rgba(255,255,255,0.65)' : '#fff', fontWeight: n.read ? 500 : 600, lineHeight: 1.4 }}>
                              {n.text}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginLeft: n.read ? 0 : '0.8rem' }}>{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        No notifications yet
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      style={{ background: 'transparent', border: 'none', color: '#D4AF37', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      View all notifications <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User profile dropdown */}
            <div 
              id="user-profile-trigger"
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem', cursor: 'pointer', userSelect: 'none' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileDropdown(!showProfileDropdown);
              }}
            >
              {(() => {
                const info = getLoggedInUserInfo();
                return (
                  <>
                    {info.photo ? (
                      <img
                        src={info.photo}
                        alt={info.fullName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(245,215,110,0.3)' }}
                      />
                    ) : (
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: '#F5D76E', color: '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                      }}>
                        {info.initials}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{info.fullName}</span>
                      <span style={{ fontSize: '0.7rem', color: '#F5D76E' }}>{info.role}</span>
                    </div>
                    <ChevronDown size={14} color="#718096" />

                    {/* Profile Dropdown Menu */}
                    {showProfileDropdown && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          top: '48px',
                          right: 0,
                          width: '220px',
                          backgroundColor: '#111111',
                          border: '1px solid #1F1F1F',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          padding: '0.75rem 0',
                          zIndex: 1000,
                          display: 'flex',
                          flexDirection: 'column',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ padding: '0.5rem 1rem 0.75rem 1rem', borderBottom: '1px solid #1F1F1F' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.fullName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.email}</div>
                        </div>

                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setActiveTab('Profile');
                          }}
                          style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                            padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left',
                            width: '100%'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Profile
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setActiveTab('Help');
                          }}
                          style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                            padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left',
                            width: '100%'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Help & Support
                        </button>

                        <div style={{ height: '1px', backgroundColor: '#1F1F1F', margin: '0.4rem 0' }} />

                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleLogOut();
                          }}
                          style={{
                            background: 'none', border: 'none', color: '#ef4444',
                            padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left',
                            width: '100%'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <LogOut size={13} /> Sign out
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </header>

        {/* Outer Layout container below header */}
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          {/* Sidebar Left */}
          <aside style={{
            width: '260px',
            backgroundColor: '#000000',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem 0',
            flexShrink: 0
          }}>
            {/* Navigation links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {sidebarItems.map((item) => {
                const isActive = (item.id === 'Welcome' && isWelcome) || (item.id === activeTab);
                return (
                  <div 
                    key={item.id}
                    onClick={() => triggerTransition(() => setActiveTab(item.id))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#D4AF37' : '#a0aec0',
                      background: isActive ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.01) 100%)' : 'transparent',
                      borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#a0aec0';
                    }}
                  >
                    <span style={{ color: isActive ? '#D4AF37' : '#718096' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </nav>

            {/* Bottom Profile card widget */}
            <div style={{ padding: '0 1rem', marginTop: 'auto' }}>
              <div 
                onClick={handleLogOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {ownerPhoto ? (
                      <img src={ownerPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      `${ownerFirstName?.[0] || 'J'}${ownerLastName?.[0] || 'D'}`
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{ownerFirstName} {ownerLastName}</span>
                    <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>Organization Owner</span>
                  </div>
                </div>
                <ChevronDown size={14} color="#718096" />
              </div>
            </div>
          </aside>

          {/* Main Workspace Frame */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#090a0f', overflowY: 'auto' }}>
            
            {/* Conditional content based on activeTab */}
            {showFacilitatorOverview ? (
              <FacilitatorOverview 
                info={getLoggedInUserInfo()} 
                programs={displayPrograms} 
                onNavigate={setActiveTab} 
                addNotification={addNotification}
              />
            ) : isWelcome ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', padding: '2rem' }}>
                
                {/* Center Main Panel (Left in main layout) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Hero welcome banner card */}
                  <div style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundImage: `linear-gradient(to right, rgba(9, 9, 11, 0.98) 40%, rgba(9, 9, 11, 0.8) 65%, rgba(9, 9, 11, 0.2) 100%), url(${orgLogo || './src/assets/abc_energy_building.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '3rem 2.5rem',
                    minHeight: '360px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.4)'
                  }}>
                    {/* Workspace Ready Badge */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      borderRadius: '20px',
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      alignSelf: 'flex-start',
                      marginBottom: '1.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
                      Workspace Ready
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
                      Welcome to <br />
                      <span style={{ color: '#D4AF37' }}>Your Workspace</span>
                    </h1>
                    
                    <p style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '1rem', maxWidth: '380px', lineHeight: '1.6' }}>
                      Your workspace is ready to power impactful learning experiences.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button 
                        onClick={() => triggerTransition(() => setActiveTab('Your Workspace'))}
                        style={{
                          background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                          border: '1px solid #D4AF37',
                          color: '#000',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(212,175,55,0.25)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Go to Workspace <ArrowRight size={16} />
                      </button>

                      <button 
                        onClick={() => triggerTransition(() => setActiveTab('Team'))}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                      >
                        <UserPlus size={16} /> Invite Team
                      </button>
                    </div>
                  </div>

                  {/* "What You Can Do Now" section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>What You Can Do Now</h3>
                    
                    {/* 5 columns of action cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                      {[
                        { 
                          title: 'Programmes', 
                          desc: 'Create and manage bootcamps, training programmes and cohorts.', 
                          linkText: 'Manage',
                          icon: <Grid size={24} color="#D4AF37" />
                        },
                        { 
                          title: 'Participants', 
                          desc: 'View and manage all participants enrolled in your programs.', 
                          linkText: 'View Participants',
                          icon: <User size={24} color="#D4AF37" />
                        },
                        { 
                          title: 'Sessions', 
                          desc: 'Schedule, run and manage sessions and events seamlessly.', 
                          linkText: 'Manage Sessions',
                          icon: <Calendar size={24} color="#D4AF37" />
                        },
                        { 
                          title: 'Reports', 
                          desc: 'Access insights and performance analytics in real time.', 
                          linkText: 'View Reports',
                          icon: <BarChart3 size={24} color="#D4AF37" />
                        },
                        { 
                          title: 'Settings', 
                          desc: 'Manage workspace settings, roles, permissions and integrations.', 
                          linkText: 'Workspace Settings',
                          icon: <Settings size={24} color="#D4AF37" />
                        }
                      ].map((card, i) => (
                        <div 
                          key={i}
                          style={{
                            backgroundColor: '#0e0f14',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '1.5rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '220px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ marginBottom: '0.25rem' }}>
                              {card.icon}
                            </div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>{card.title}</h4>
                            <p style={{ color: '#718096', fontSize: '0.75rem', lineHeight: '1.4', margin: 0 }}>{card.desc}</p>
                          </div>
                          
                          <div 
                            onClick={() => triggerTransition(() => setActiveTab(card.title))}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.35rem', 
                              color: '#D4AF37', 
                              fontSize: '0.75rem', 
                              fontWeight: 700, 
                              cursor: 'pointer',
                              marginTop: '1rem'
                            }}
                          >
                            <span>{card.linkText}</span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                  
                  {/* Card 1: Workspace Summary */}
                  <div style={{
                    backgroundColor: '#0e0f14',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>Workspace Summary</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#718096' }}>Solution</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Bootcamps & Training</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#718096' }}>Plan</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Standard</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#718096' }}>Status</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#22c55e', fontWeight: 600 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                          Active
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#718096' }}>Participants Included</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>50</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: '#718096' }}>Storage</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>10 GB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096' }}>AI Allocation</span>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Basic</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Next Steps */}
                  <div style={{
                    backgroundColor: '#0e0f14',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>Next Steps</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { step: 1, label: 'Organization Verified', completed: true },
                        { step: 2, label: 'Workspace Configured', completed: true },
                        { step: 3, label: 'Team Invited', completed: true }
                      ].map((st) => (
                        <div key={st.step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(212,175,55,0.15)',
                            border: '1.5px solid #D4AF37',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D4AF37'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#718096', textDecoration: 'line-through' }}>{st.label}</span>
                        </div>
                      ))}

                      {/* Active Step 4 */}
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '1.5px solid #D4AF37',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#D4AF37',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          marginTop: '0.1rem',
                          flexShrink: 0
                        }}>
                          4
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Create Your First Programme</span>
                          <span style={{ fontSize: '0.75rem', color: '#718096' }}>Kickstart your learning journey.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Need Help */}
                  <div style={{
                    backgroundColor: '#0e0f14',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(212,175,55,0.1)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D4AF37'
                    }}>
                      <Headphones size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>Need Help?</h4>
                      <p style={{ color: '#718096', fontSize: '0.75rem', lineHeight: '1.4', margin: 0 }}>
                        Our support team is here to help you get started.
                      </p>
                      <button style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        alignSelf: 'flex-start',
                        marginTop: '0.25rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      >
                        Contact Support <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ) : activeTab === 'Team' ? (
              /* Ã¢â€â‚¬Ã¢â€â‚¬ Team Management Component Ã¢â€â‚¬Ã¢â€â‚¬ */
              <TeamManagement
                members={wsTeam}
                setMembers={setWsTeam}
                pending={wsInvitations}
                setPending={setWsInvitations}
                addNotification={addNotification}
                onNavigateHome={() => triggerTransition(() => setActiveTab('Welcome'))}
              />
            ) : (activeTab === 'Programmes' || activeTab === 'Programs' || activeTab === 'My Programs') ? (
              /* Programmes Tab Component */
              <ProgramsTab
                programs={displayPrograms}
                setPrograms={setWsPrograms}
                learners={wsLearners}
                setLearners={setWsLearners}
                addNotification={addNotification}
                userRole={userRole}
              />
            ) : (activeTab === 'Learners' || activeTab === 'Participants') ? (
              /* Learners Tab Component */
              <LearnersTab
                programs={displayPrograms}
                setPrograms={setWsPrograms}
                learners={wsLearners}
                setLearners={setWsLearners}
                addNotification={addNotification}
                onNavigateToPrograms={() => triggerTransition(() => setActiveTab('Programmes'))}
                userRole={userRole}
              />
            ) : activeTab === 'Sessions' ? (
              /* Sessions Tab Component */
              <SessionsTab
                programs={displayPrograms}
                setPrograms={setWsPrograms}
                learners={wsLearners}
                addNotification={addNotification}
                onNavigateToPrograms={() => triggerTransition(() => setActiveTab('Programmes'))}
                userRole={userRole}
              />
            ) : activeTab === 'Reports' ? (
              /* Reports Tab Component */
              <ReportsTab
                programs={displayPrograms}
                learners={wsLearners}
              />
            ) : activeTab === 'Your Workspace' ? (
              /* Global Workspace Dashboard */
              <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Your Workspace</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Overview of your organization workspace settings, limits, and records.
                  </p>
                </div>

                {/* Workspace Summary Cards with Integrated Progress Loaders */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', maxWidth: '800px' }}>
                  {/* Programs Card */}
                  <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', flexShrink: 0 }}>
                        <BookOpen size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programs</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{displayPrograms.length} <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>/ 3 created</span></div>
                      </div>
                    </div>
                    <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min((displayPrograms.length / 3) * 100, 100)}%`, background: 'linear-gradient(90deg,#D4AF37,#C49A2A)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>

                  {/* Participants Card */}
                  <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', flexShrink: 0 }}>
                        <Users size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Participants</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{wsLearners.length} <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>/ 50 enrolled</span></div>
                      </div>
                    </div>
                    <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min((wsLearners.length / 50) * 100, 100)}%`, background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>

                  {/* Storage Card */}
                  <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(() => {
                      let totalBytes = 0;
                      displayPrograms.forEach(p => {
                        (p.resources || []).forEach(r => {
                          totalBytes += r.sizeInBytes || 0;
                        });
                        (p.sessions || []).forEach(s => {
                          (s.resources || []).forEach(sr => {
                            totalBytes += sr.sizeInBytes || 0;
                          });
                        });
                      });
                      const totalMB = totalBytes / (1024 * 1024);
                      const limitMB = 10240; // 10 GB
                      const storagePercent = Math.min((totalMB / limitMB) * 100, 100);
                      const storageText = totalBytes === 0 ? '0.00 MB' : totalBytes >= 1024*1024*1024 ? `${(totalBytes / (1024*1024*1024)).toFixed(2)} GB` : `${totalMB.toFixed(2)} MB`;
                      return (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0 }}>
                              <HardDrive size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Storage</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>{storageText} <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>/ 10 GB limit</span></div>
                            </div>
                          </div>
                          <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${storagePercent}%`, background: 'linear-gradient(90deg,#3b82f6,#2563eb)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recent Activity</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Real-time transaction feed of modifications across all programs in this workspace.
                  </p>
                </div>

                <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '2rem', maxWidth: '800px' }}>
                  {/* Merge and sort program activities */}
                  {(() => {
                    const allActivities = [];
                    displayPrograms.forEach(p => {
                      (p.activity || []).forEach(act => {
                        allActivities.push({
                          ...act,
                          programName: p.name
                        });
                      });
                    });
                    
                    // Sort descending by id
                    allActivities.sort((a, b) => b.id - a.id);

                    if (allActivities.length > 0) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                          {allActivities.slice(0, 20).map((entry, i) => (
                            <div key={entry.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.9rem 0', borderBottom: i < allActivities.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37', marginTop: '0.45rem', flexShrink: 0 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                                    {entry.programName}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{entry.time}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', margin: '0.35rem 0 0 0' }}>{entry.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2">
                          <path d="M12 20h9M3 20v-8a2 2 0 012-2h4l2-3h4l2 3h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        </svg>
                        <div>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: 0 }}>No recent activity</h4>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                            Activity entries from programs, sessions, and uploads in this workspace will populate here.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : activeTab === 'Settings' ? (
              /* Settings Tab Component */
              <SettingsTab
                programs={wsPrograms}
                learners={wsLearners}
                teamMembers={wsTeam}
                setTeamMembers={setWsTeam}
                addNotification={addNotification}
                organizationName={orgName}
                setOrganizationName={setOrgName}
                onInviteTeamClick={() => {
                  const inviteBtn = document.querySelector('[data-testid="invite-team-trigger"]') || document.getElementById('invite-team-btn');
                  if (inviteBtn) inviteBtn.click();
                  else {
                    alert("Invite dialog triggered! Open via sidebar invitation shortcut.");
                  }
                }}
                onLogout={handleLogOut}
              />
            ) : activeTab === 'Profile' ? (
              <ProfileTab 
                currentUser={user} 
                info={getLoggedInUserInfo()} 
                onSaveName={(newName) => {
                  if (user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com') {
                    const parts = newName.trim().split(' ');
                    setOwnerFirstName(parts[0] || '');
                    setOwnerLastName(parts.slice(1).join(' ') || '');
                  } else {
                    setWsTeam(prev => prev.map(m => m.email.toLowerCase() === user.toLowerCase() ? { ...m, name: newName } : m));
                  }
                  addNotification('Profile updated successfully');
                }}
                addNotification={addNotification}
              />
            ) : activeTab === 'Help' ? (
              <HelpTab />
            ) : activeTab === 'Resources' ? (
              <ResourcesTab programs={displayPrograms} addNotification={addNotification} />
            ) : activeTab === 'Session Notes' ? (
              <SessionNotesTab programs={displayPrograms} addNotification={addNotification} />
            ) : (
              /* Operational View for other tabs */
              <div style={{ padding: '2.5rem' }}>
                <div className="form-card animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#D4AF37', marginBottom: '1rem' }}>{activeTab} Workspace Operations</h3>
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
              </div>
            )}

            {/* Bottom Footer Section */}
            <footer style={{
              marginTop: 'auto',
              backgroundColor: '#000000',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '1.5rem 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundImage: 'radial-gradient(ellipse at bottom, rgba(212, 175, 55, 0.03) 0%, transparent 60%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
                <span>Powered by</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {/* Gold small hexagon logo */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#D4AF37" strokeWidth="2.5" fill="none"/>
                    <path d="M12 6L9 12H15L12 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
                    OYEN <span style={{ color: '#D4AF37' }}>GRID</span>
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Secure. Scalable. Intelligent.
              </span>
            </footer>

          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#090a0f', color: '#fff',
        fontFamily: "'Outfit', sans-serif"
      }}>
        {/* Hexagon gold loading icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid #D4AF37',
            padding: '1.25rem',
            borderRadius: '16px',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#D4AF37" strokeWidth="2.5" fill="none"/>
              <path d="M12 6L9 12H15L12 18" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
            OYEN <span style={{ color: '#D4AF37' }}>GRID</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Authorizing Secure Session...
          </div>
        </div>
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
        
        <header className="brand-header" style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#D4AF37', padding: '0.45rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid size={18} color="#000" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              OYEN <span style={{ color: '#D4AF37' }}>GRID</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.2px', marginTop: '0.15rem' }}>
              Enterprise Programme Operating System
            </span>
          </div>
        </header>

        <div className="brand-content" style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="brand-title" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, color: '#fff', fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem' }}>
              {activeRoute === 'signin' ? (
                <>Secure <span style={{ color: '#00f0ff' }}>access</span> for every OYEN GRID workspace.</>
              ) : (
                <>Secure portal built to protect <span style={{ color: '#D4AF37' }}>institutional knowledge.</span></>
              )}
            </h1>
            <p className="brand-subtitle" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              {activeRoute === 'signin' ? (
                "End-to-end workspace access. Verified. Authorized."
              ) : (
                "End-to-End Encrypted. Inspected. Authorized."
              )}
            </p>
          </div>

          {/* Feature List (Mockup Image 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(activeRoute === 'signin' ? [
              {
                icon: <Shield size={18} color="#D4AF37" />,
                title: "Workspace Security",
                desc: "Bank-level encryption and zero trust architecture."
              },
              {
                icon: <Users size={18} color="#D4AF37" />,
                title: "Role-Based Access",
                desc: "Granular access control for your entire organization."
              },
              {
                icon: <Sparkles size={18} color="#D4AF37" />,
                title: "Powered by OYEN AI",
                desc: "Intelligent systems that help you run, manage and scale programs."
              }
            ] : [
              {
                icon: <Shield size={18} color="#D4AF37" />,
                title: "Enterprise Security",
                desc: "Bank-level encryption and zero trust architecture."
              },
              {
                icon: <Building2 size={18} color="#D4AF37" />,
                title: "Workspace Verification",
                desc: "We verify your subscription to provision access."
              },
              {
                icon: <Lock size={18} color="#D4AF37" />,
                title: "Zero Trust Access",
                desc: "Only authorized organizations can activate workspaces."
              },
              {
                icon: <Sparkles size={18} color="#D4AF37" />,
                title: "Powered by OYEN AI",
                desc: "Intelligent systems that help you run, manage and scale programs."
              }
            ]).map((f, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', 
                  borderRadius: '10px', 
                  padding: '0.85rem 1.15rem',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                }}
              >
                <div style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.08)', 
                  border: '1px solid rgba(212, 175, 55, 0.2)', 
                  borderRadius: '6px', 
                  width: '34px', 
                  height: '34px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{f.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', lineHeight: 1.35 }}>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Alert Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.55)',
          marginTop: 'auto',
          zIndex: 3,
          position: 'relative'
        }}>
          <ShieldCheck size={16} color="#22c55e" style={{ flexShrink: 0 }} />
          <span>Trusted by organizations across training, education, enterprise and government.</span>
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
              
              {/* Language & Theme Row (No SIMULATE row) */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '0.4rem 0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }} onClick={() => alert('Language options: English')}>
                  <Globe size={14} color="#D4AF37" />
                  <span>English</span>
                  <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>Ã¢â€“Â¼</span>
                </div>
              </div>

              {/* CASE 1: Subscription Found */}
              {verificationResult === 'found' && (
                <div className="animate-fade-in" style={{ textAlign: 'center' }}>

                  {/* Green checkmark hero */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                      {/* Outer glow ring */}
                      <div style={{
                        position: 'absolute',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                      {/* Sparkle dots */}
                      {[
                        { top: '-10px', left: '50%', size: '4px' },
                        { top: '10px', right: '-12px', size: '3px' },
                        { bottom: '-8px', right: '10px', size: '3px' },
                        { bottom: '5px', left: '-12px', size: '4px' },
                        { top: '25px', left: '-14px', size: '3px' },
                      ].map((s, i) => (
                        <span key={i} style={{
                          position: 'absolute',
                          width: s.size,
                          height: s.size,
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          opacity: 0.6,
                          top: s.top,
                          left: s.left,
                          right: s.right,
                          bottom: s.bottom,
                        }} />
                      ))}
                      {/* Circle badge */}
                      <div style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.15)',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <CheckCircle2 size={32} color="#fff" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Label and title */}
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>
                      Verify Your Organization
                    </span>
                    <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                      Subscription Found
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.5rem', lineHeight: 1.5, maxWidth: '320px' }}>
                      We've verified your subscription details. Let's set up your workspace and get you started.
                    </p>
                  </div>

                  {/* Details card */}
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '0.25rem 0',
                    marginBottom: '1.75rem',
                    textAlign: 'left'
                  }}>
                    {[
                      {
                        icon: <Building2 size={15} color="rgba(255,255,255,0.5)" />,
                        label: 'Organization',
                        value: verifyOrgNameInput.trim() || 'abc energy',
                        valueStyle: { color: '#fff', fontWeight: 600 }
                      },
                      {
                        icon: <FileText size={15} color="rgba(255,255,255,0.5)" />,
                        label: 'Plan',
                        value: 'Bootcamps & Training',
                        valueStyle: { color: '#fff', fontWeight: 600 }
                      },
                      {
                        icon: <Award size={15} color="rgba(255,255,255,0.5)" />,
                        label: 'Tier',
                        value: 'Standard',
                        valueStyle: { color: '#D4AF37', fontWeight: 700 }
                      },
                      {
                        icon: <Sparkles size={15} color="rgba(255,255,255,0.5)" />,
                        label: 'Status',
                        value: 'Active',
                        valueStyle: { color: '#22c55e', fontWeight: 700 }
                      },
                      {
                        icon: <BrainCircuit size={15} color="rgba(255,255,255,0.5)" />,
                        label: 'AI Allocation',
                        value: 'Basic',
                        valueStyle: { color: '#fff', fontWeight: 600 }
                      }
                    ].map((row, i, arr) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.25rem',
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                          {row.icon}
                          <span>{row.label}</span>
                        </div>
                        <span style={row.valueStyle}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Continue Setup button */}
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #C49A2A 100%)',
                      border: 'none',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      borderRadius: '8px',
                      padding: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    onClick={() => triggerTransition(() => {
                      setOrgName(verifyOrgNameInput.trim() || 'ABC Energy Ltd');
                      setUser(verifyOrgEmailInput.trim());
                      setUserRole('Organization Owner');
                      handleOrgRegistrationComplete(verifyOrgEmailInput.trim(), 'bootcamp');
                    })}
                  >
                    <span>Continue Setup</span>
                    <ArrowRight size={17} />
                  </button>

                  {/* Back link */}
                  <button
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.38)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '1.1rem',
                      fontWeight: 500,
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                    onClick={() => setVerificationResult(null)}
                  >
                    Ã¢â€ Â Use different details
                  </button>

                  {/* Status row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }}></span>
                    <span>All Systems Operational</span>
                    <span
                      style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => alert('View Status: All systems fully operational.')}
                    >
                      View Status Ã¢â€ â€™
                    </span>
                  </div>

                  {/* Footer links */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.1rem', marginTop: '1.25rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <Lock size={11} color="#D4AF37" /> Privacy Policy
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <FileText size={11} color="#D4AF37" /> Terms of Service
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <Headphones size={11} color="#D4AF37" /> Support
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                      <Mail size={11} color="#D4AF37" /> Contact Us
                    </span>
                  </div>

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
                      onClick={() => window.open('https://oyengridlanding.vercel.app/pricing', '_blank')}
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
                    Ã¢â€ Â Go back to verify
                  </button>
                </div>
              )}

              {/* Default Input Form */}
              {verificationResult === null && (
                <>
                  {/* Title Header */}
                  <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                      Verify your <span style={{ color: '#D4AF37' }}>organization</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      Enter the organization name and work email used during your OYEN GRID subscription. We'll locate your licensed workspace and continue the setup.
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
                      Ã¢Å¡Â Ã¯Â¸Â {verifyError}
                    </div>
                  )}

                  {/* Form Inputs */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!verifyOrgEmailInput.trim()) {
                      setVerifyError('Work email is required to verify your subscription.');
                      return;
                    }
                    setVerifyError('');

                    triggerTransition(() => {
                      // Simulated found logic
                      setVerificationResult('found');
                    });
                  }} style={{ textAlign: 'left' }}>
                    
                    {/* Org Name */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" htmlFor="verify-name-input" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.8rem' }}>Organization Name</label>
                      <div style={{ position: 'relative' }}>
                        <Building2 size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          id="verify-name-input"
                          type="text"
                          className="form-input"
                          placeholder="e.g. ABC Energy Ltd"
                          value={verifyOrgNameInput}
                          onChange={(e) => setVerifyOrgNameInput(e.target.value)}
                          style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem', display: 'block' }}>Enter your organization or company name.</span>
                    </div>

                    {/* Org Email */}
                    <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                      <label className="form-label" htmlFor="verify-email-input" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.8rem' }}>Official Work Email</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          id="verify-email-input"
                          type="email"
                          className="form-input"
                          placeholder="name@organization.com"
                          value={verifyOrgEmailInput}
                          onChange={(e) => setVerifyOrgEmailInput(e.target.value)}
                          style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem', display: 'block' }}>Use the work email used during your OYEN GRID subscription.</span>
                    </div>

                    {/* Verify Button */}
                    <button 
                      type="submit" 
                      className="submit-btn"
                      style={{
                        background: '#D4AF37',
                        border: '1px solid #D4AF37',
                        color: '#000',
                        fontWeight: 700,
                        borderRadius: '6px',
                        padding: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ShieldCheck size={18} />
                      <span>Verify Organization</span>
                      <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                    </button>
                  </form>

                  {/* OR Separator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0', color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></span>
                    <span>OR</span>
                    <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></span>
                  </div>

                  {/* Sign In Button Block */}
                  <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>
                      Already activated your workspace?
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveRoute('signin')}
                      style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        color: '#D4AF37',
                        fontWeight: 600,
                        borderRadius: '6px',
                        padding: '0.75rem 1.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)';
                      }}
                    >
                      <User size={16} />
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Subscription Promotion Card */}
                  <div style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.01)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)', 
                    borderRadius: '8px', 
                    padding: '1.25rem',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>Don't have a subscription yet?</h4>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', margin: '0.25rem 0 0 0', lineHeight: 1.35 }}>
                        Explore plans designed for training teams, educators and enterprises.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => window.open('https://oyengridlanding.vercel.app/pricing', '_blank')}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: '6px',
                          padding: '0.6rem 0.8rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                      >
                        <FileText size={14} color="#D4AF37" />
                        <span>View Plans</span>
                      </button>
                      <button
                        onClick={() => alert('Starting free trial registration...')}
                        style={{
                          flex: 1,
                          backgroundColor: '#D4AF37',
                          border: '1px solid #D4AF37',
                          color: '#000',
                          fontWeight: 700,
                          borderRadius: '6px',
                          padding: '0.6rem 0.8rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Rocket size={14} />
                        <span>Start Free Trial</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Status and Footer Links Ã¢â‚¬â€ only show on default input form */}
              {verificationResult === null && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                    <span>All Systems Operational</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                    <span style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }} onClick={() => alert('View Status: All systems fully operational.')}>View Status Ã¢â€ â€™</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }} onClick={() => alert('Navigating to Privacy Policy...')}>
                      <Lock size={12} color="#D4AF37" /> Privacy Policy
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }} onClick={() => alert('Navigating to Terms...')}>
                      <FileText size={12} color="#D4AF37" /> Terms of Service
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }} onClick={() => alert('Navigating to Support...')}>
                      <Headphones size={12} color="#D4AF37" /> Support
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }} onClick={() => alert('Navigating to Contact Us...')}>
                      <Mail size={12} color="#D4AF37" /> Contact Us
                    </span>
                  </div>
                </>
              )}

            </div>
          )}



          {activeRoute === 'signin' && (
            <SignInForm 
              onSwitchForm={setActiveRoute} 
              onAuthSuccess={handleAuthSuccess}
              teamMembers={wsTeam}
              setTeamMembers={setWsTeam}
              programs={wsPrograms}
              invitations={wsInvitations}
              setInvitations={setWsInvitations}
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

        </div>
      </main>
    </div>
  );
}

function ProfileTab({ info, onSaveName, addNotification }) {
  const [name, setName] = useState(info.fullName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveName(name);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addNotification('Password changed successfully');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', maxWidth: '600px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Personal Profile</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Manage your personal account details, avatar, and security settings.
        </p>
      </div>

      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {info.photo ? (
            <img src={info.photo} alt={name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #F5D76E' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F5D76E', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.4rem' }}>
              {info.initials}
            </div>
          )}
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{info.fullName}</div>
            <div style={{ fontSize: '0.8rem', color: '#F5D76E', marginTop: '0.15rem' }}>{info.role}</div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              value={info.email} 
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'not-allowed' }}
              readOnly
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            Save Changes
          </button>
        </form>

        <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Change Password</h3>
          
          {passwordSuccess && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', color: '#22c55e', fontSize: '0.8rem' }}>
              Password updated successfully.
            </div>
          )}

          {passwordError && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', fontSize: '0.8rem' }}>
              {passwordError}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              placeholder="Enter current password"
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Enter new password"
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Confirm new password"
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #F5D76E', color: '#F5D76E', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            Change Password
          </button>
        </form>

      </div>
    </div>
  );
}

function HelpTab() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    { q: 'How do I add a new facilitator?', a: 'Go to the Team tab, click Invite Member, enter their email, choose Facilitator role, and hit send. An invitation with a secure access code will be generated.' },
    { q: 'How is storage calculated?', a: 'Storage is calculated based on the file sizes of uploaded program resources, session attachments, and participant materials inside your active workspace.' },
    { q: 'Can I change my subscription plan?', a: 'Plan changes can be managed under Organization Settings (accessible only to Organization Owners).' },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const filteredFaqs = faqs.filter(
    faq => faq.q.toLowerCase().includes(search.toLowerCase()) || 
           faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', maxWidth: '700px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>How can we help?</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Search help resources, read FAQs, or get in touch with our support desk.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search help articles & FAQs..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.9rem 1.25rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{faq.q}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.5rem', lineHeight: 1.5 }}>{faq.a}</div>
              </div>
            ))
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', padding: '1rem' }}>No articles match your search query.</div>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Contact Support</h3>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Send a message directly to the OYEN GRID support engineering team.</p>
        </div>

        {isSubmitted && (
          <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 500 }}>
            Support ticket submitted successfully! Our team will reply shortly.
          </div>
        )}

        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Subject</label>
            <input 
              type="text" 
              placeholder="e.g. Storage limit question" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Message</label>
            <textarea 
              rows={4}
              placeholder="Describe your issue or query here..." 
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
}

function FacilitatorOverview({ info, programs = [], onNavigate, addNotification }) {
  const allSessions = [];
  programs.forEach(p => {
    (p.sessions || []).forEach(s => {
      allSessions.push({
        ...s,
        programName: p.name,
        programId: p.id
      });
    });
  });

  const todaySession = allSessions.find(s => s.status === 'Today' || s.date?.toLowerCase().includes('today') || s.date?.toLowerCase().includes('30 may'));
  const nextSession = todaySession || allSessions[0];

  const handleJoin = (title) => {
    alert(`Joining live training session: "${title}"... Redirecting to virtual classroom...`);
    addNotification?.(`Joined live training session: "${title}"`);
  };

  const handleStartSession = () => {
    if (nextSession) {
      handleJoin(nextSession.title);
    } else {
      alert("No active session to start right now.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Good morning, {info.fullName} 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Here's what's happening across your assigned programs.
          </p>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          Friday, 30 May 2025
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#F5D76E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F5D76E' }}></span>
                Next Session
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem' }}>···</span>
            </div>

            {nextSession ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(245,215,110,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5D76E' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(245,215,110,0.1)', color: '#F5D76E', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>Today</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0.35rem 0 0.15rem 0' }}>{nextSession.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{nextSession.programName} Program</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.50rem', flexWrap: 'wrap' }}>
                      <span>📅 Today, 30 May 2025</span>
                      <span>⏰ {nextSession.time || '10:00 AM - 11:30 AM'}</span>
                      <span>👥 {nextSession.learnersCount || '24 Learners'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button 
                    onClick={() => handleJoin(nextSession.title)}
                    style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', transition: 'opacity 0.2s' }}
                  >
                    🎥 Join Session
                  </button>
                  <button 
                    onClick={() => onNavigate('Sessions')}
                    style={{ padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    👁️ View Session
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                No upcoming sessions. Your assigned programs are currently up to date.
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>My Programs</h3>
              <span onClick={() => onNavigate('My Programs')} style={{ color: '#F5D76E', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>View all programs</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
              {programs.map((p, idx) => (
                <div key={p.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: idx === 0 ? 'rgba(34,197,94,0.08)' : idx === 1 ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === 0 ? '#22c55e' : idx === 1 ? '#8b5cf6' : '#3b82f6' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>Active</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>{p.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.45rem' }}>
                      {idx === 0 ? '24' : idx === 1 ? '18' : '31'} Learners · {idx === 0 ? '3' : '2'} Upcoming Sessions
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
                      <span>Progress</span>
                      <span>{idx === 0 ? '65%' : idx === 1 ? '42%' : '78%'}</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: idx === 0 ? '65%' : idx === 1 ? '42%' : '78%', backgroundColor: '#F5D76E', borderRadius: '99px' }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      onNavigate('My Programs');
                    }}
                    style={{ width: '100%', padding: '0.55rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5D76E'; e.currentTarget.style.color = '#F5D76E'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  >
                    Open Program →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>Upcoming Sessions</h3>
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Session</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Program</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Date & Time</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Learners</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: 'Leadership Fundamentals', program: 'Leadership Development', dateTime: '30 May 2025, 10:00 AM', learners: '24', status: 'Today', isToday: true },
                    { title: 'Emotional Intelligence', program: 'Leadership Development', dateTime: '2 Jun 2025, 2:00 PM', learners: '24', status: 'Upcoming' },
                    { title: 'Team Building Strategies', program: 'Project Management', dateTime: '3 Jun 2025, 10:00 AM', learners: '31', status: 'Upcoming' }
                  ].map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#fff' }}>
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>{s.title}</td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.5)' }}>{s.program}</td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.5)' }}>{s.dateTime}</td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.5)' }}>{s.learners}</td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: s.isToday ? 'rgba(245,215,110,0.1)' : 'rgba(255,255,255,0.03)', color: s.isToday ? '#F5D76E' : 'rgba(255,255,255,0.5)' }}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleJoin(s.title)}
                          style={{ padding: '0.35rem 0.75rem', backgroundColor: s.isToday ? '#F5D76E' : 'transparent', border: s.isToday ? 'none' : '1px solid rgba(255,255,255,0.1)', color: s.isToday ? '#000' : '#fff', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {s.isToday ? 'Join' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Quick Access</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Start Next Session', icon: '▶️', action: handleStartSession },
                { label: 'View Learners', icon: '👥', action: () => onNavigate('Learners') },
                { label: 'Upload Resource', icon: '📤', action: () => onNavigate('Resources') },
                { label: 'View Session Notes', icon: '📝', action: () => onNavigate('Session Notes') }
              ].map(opt => (
                <div 
                  key={opt.label}
                  onClick={opt.action}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,215,110,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>→</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Today's Activity</h3>
              <span style={{ fontSize: '0.75rem', color: '#F5D76E', cursor: 'pointer', fontWeight: 600 }}>View all</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
              
              {[
                { title: 'Session scheduled', detail: 'Leadership Fundamentals', time: '9:00 AM', icon: '📅', color: 'rgba(245,215,110,0.1)', textCol: '#F5D76E' },
                { title: 'Learner joined a session', detail: 'David Johnson joined the session', time: '9:15 AM', icon: '👤', color: 'rgba(34,197,94,0.1)', textCol: '#22c55e' },
                { title: 'Resource uploaded', detail: 'Leadership Slides.pdf', time: '9:30 AM', icon: '📄', color: 'rgba(59,130,246,0.1)', textCol: '#3b82f6' },
                { title: 'Session completed', detail: 'Effective Communication', time: '11:00 AM', icon: '✅', color: 'rgba(16,185,129,0.1)', textCol: '#10b981' },
                { title: 'Session notes added', detail: 'Leadership Fundamentals', time: '11:15 AM', icon: '📝', color: 'rgba(139,92,246,0.1)', textCol: '#8b5cf6' }
              ].map((act, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, zIndex: 2 }}>
                    {act.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{act.title}</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{act.time}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0.15rem 0 0 0' }}>{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.85rem', textAlign: 'center' }}>
              <span onClick={() => alert("Activity history is fully up to date.")} style={{ color: '#F5D76E', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>View all activity →</span>
            </div>
          </div>

        </div>

      </div>
      
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '1rem' }}>
        © 2025 OYEN GRID. All rights reserved.
      </div>
    </div>
  );
}

function ResourcesTab({ programs = [], addNotification }) {
  const [search, setSearch] = useState('');
  const [selectedProgId, setSelectedProgId] = useState('');
  const [fileName, setFileName] = useState('');

  const allResources = [];
  programs.forEach(p => {
    (p.resources || []).forEach(r => {
      allResources.push({
        ...r,
        programName: p.name,
        programId: p.id
      });
    });
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!fileName.trim() || !selectedProgId) return;

    addNotification(`Resource "${fileName}" uploaded to program`);
    alert(`Resource file "${fileName}" successfully uploaded.`);
    setFileName('');
  };

  const filtered = allResources.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Resources</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Upload and manage training guides, slides, reference links, and handouts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.length > 0 ? (
              filtered.map((res, i) => (
                <div key={i} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.3rem' }}>📄</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{res.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
                        {res.programName} · {res.size || '3.2 MB'}
                      </div>
                    </div>
                  </div>
                  <span 
                    onClick={() => alert(`Downloading: ${res.name}...`)}
                    style={{ fontSize: '0.72rem', color: '#F5D76E', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Download 📥
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
                No resources match your query. Upload one to get started.
              </div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Upload Resource</h3>
          
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>File Name</label>
              <input 
                type="text" 
                placeholder="e.g. Leadership Workbook.pdf" 
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Program</label>
              <select 
                value={selectedProgId}
                onChange={e => setSelectedProgId(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
                required
              >
                <option value="">Select a Program</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              style={{ width: '100%', padding: '0.65rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Upload Material
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

function SessionNotesTab({ programs = [], addNotification }) {
  const [notes, setNotes] = useState({});

  const sessionsList = [];
  programs.forEach(p => {
    (p.sessions || []).forEach(s => {
      sessionsList.push({
        ...s,
        programName: p.name,
        programId: p.id
      });
    });
  });

  const handleSaveNotes = (sid, title) => {
    addNotification?.(`Session notes added to "${title}"`);
    alert(`Session notes for "${title}" saved successfully.`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Session Notes</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Document summary notes, participant engagement feedback, and takeaway points for each training module.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {sessionsList.map((s, i) => (
          <div key={i} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'rgba(245,215,110,0.1)', color: '#F5D76E', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>Notes Log</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0.35rem 0 0.15rem 0' }}>{s.title}</h3>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.programName}</span>
            </div>

            <textarea 
              rows={4}
              placeholder="Enter notes, milestones, or participant comments..."
              value={notes[s.id] || ''}
              onChange={e => setNotes({ ...notes, [s.id]: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.82rem', outline: 'none', resize: 'vertical' }}
            />

            <button 
              onClick={() => handleSaveNotes(s.id, s.title)}
              style={{ padding: '0.55rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Save Notes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
