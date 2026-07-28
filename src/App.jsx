import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sun, Moon, Grid, ShieldCheck, LogOut, Users, BookOpen, 
  BrainCircuit, BarChart3, Settings, Building2, User, UserCheck, 
  Lock, CheckCircle2, Sparkles, 
  Calendar, Award, 
  ArrowRight, Check, UserPlus, 
  Globe, Menu, Search, Bell, ChevronDown, Home, Clock, Headphones,
  Shield, Rocket, FileText, Mail, HardDrive,
  Presentation, Folder, Image, Eye, Download, Book, Video, MessageSquare,
  Play, Zap, Plus
} from 'lucide-react';
import SessionDetail from './components/SessionDetail';
import { getProgramsForUser, getSessionsForUser, getLearnersForUser, getInboxForUser } from './domain/workspace/selectors';
import { updateSessionStatus } from './domain/workspace/actions';
import FacilitatorOverview from './pages/facilitator/FacilitatorOverview';
import TeamMemberOverview from './pages/owner/TeamMemberOverview';
import ViewerOverview from './pages/viewer/ViewerOverview';
import InboxTab from './components/InboxTab';
import OrgRegistrationForm from './components/OrgRegistrationForm';
import PublicEventForm from './components/PublicEventForm';
import SignInForm from './components/SignInForm';
import TeamManagement from './components/TeamManagement';
import ProgramsTab from './components/ProgramsTab';
import LearnersTab from './components/LearnersTab';
import SessionsTab from './components/SessionsTab';
import oyenLogo from './assets/logo_v2.png';
import onboardingBg from './assets/onboarding_bg_v2.png';
import dashboardHeroIllustration from './assets/dashboard_hero_illustration.jpg';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import AttendanceTab from './components/AttendanceTab';
import AssessmentsTab from './components/AssessmentsTab';
import AnnouncementsTab from './components/AnnouncementsTab';
import CertificatesTab from './components/CertificatesTab';
import NotificationsTab from './components/NotificationsTab';
import { useLoader } from './components/ui/LoaderProvider';



export default function App() {
  const [activeRoute, setActiveRoute] = useState('portal'); // 'portal' | 'signup' | 'signin' | 'forgot-password' | 'public-event' | 'accept-invite' | 'onboarding' | 'dashboard'
  const { showLoader, hideLoader } = useLoader();
  const [theme, setTheme] = useState('dark');
  const [invitationPrefill, setInvitationPrefill] = useState(null);
  // Trigger Vercel deploy demo validation refresh
  
  // Auth state
  const [user, setUser] = useState(null); 
  const [userRole, setUserRole] = useState('Workspace Super Admin');
  const [authLoading, setAuthLoading] = useState(true);

  // Sync authLoading state with context loader
  useEffect(() => {
    if (authLoading) {
      showLoader("Preparing your workspace...");
    } else {
      hideLoader();
    }
  }, [authLoading]);
  
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

  const isLoggingOutRef = useRef(false);

  // Shared workspace data — lifted so Programs + Learners stay in sync
  const [wsPrograms, setWsPrograms] = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_programs') || sessionStorage.getItem('oyen_ws_programs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [wsLearners, setWsLearners] = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_learners') || sessionStorage.getItem('oyen_ws_learners');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [wsTeam, setWsTeam]         = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_team');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [wsInvitations, setWsInvitations] = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_invitations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync team and invitations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('oyen_ws_team', JSON.stringify(wsTeam));
  }, [wsTeam]);

  useEffect(() => {
    localStorage.setItem('oyen_ws_invitations', JSON.stringify(wsInvitations));
  }, [wsInvitations]);

  // Sync state across browser tabs in real-time when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'oyen_ws_programs' && e.newValue) {
        setWsPrograms(JSON.parse(e.newValue));
      }
      if (e.key === 'oyen_ws_learners' && e.newValue) {
        setWsLearners(JSON.parse(e.newValue));
      }
      if (e.key === 'oyen_ws_team' && e.newValue) {
        setWsTeam(JSON.parse(e.newValue));
      }
      if (e.key === 'oyen_ws_invitations' && e.newValue) {
        setWsInvitations(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!user || isLoggingOutRef.current) return;
    
    const currentEmail = user.trim().toLowerCase();
    
    // Bypass checks for default/master Admin account and demo accounts
    const demoEmails = [
      'john.doe@abcenergy.com',
      'sarah.ahmed@abcenergy.com',
      'michael.ibrahim@abcenergy.com',
      'fatima.aliyu@abcenergy.com',
      'ngozi.kalu@abcenergy.com',
      'facilitator@oyengrid.test'
    ];
    if (
      userRole === 'Admin' || 
      userRole === 'Workspace Super Admin' || 
      currentEmail === 'admin@oyengrid.com' || 
      currentEmail === ownerEmail?.trim().toLowerCase() ||
      demoEmails.includes(currentEmail)
    ) {
      return;
    }
    
    const member = wsTeam.find(m => m.email && m.email.trim().toLowerCase() === currentEmail);
    
    // Invalidation check (deleted, suspended/inactive, or role mismatch)
    const isInvalid = !member || 
                      member.status === 'Suspended' || 
                      member.status === 'Inactive' ||
                      member.role !== userRole;
                      
    if (isInvalid) {
      isLoggingOutRef.current = true;
      
      // Clear storage and authentication
      localStorage.removeItem('oyen_logged_in_user');
      localStorage.removeItem('oyen_user_role');
      sessionStorage.clear();
      
      setUser(null);
      setUserRole(null);
      setActiveRoute('signin');
      addNotification('Your access to this organization has been removed. Please contact your Admin.');
    }
  }, [wsTeam, user, userRole, ownerEmail]);

  // AI Assistant Chat Mock
  const [activeSessionIdentifier, setActiveSessionIdentifier] = useState(null);

  const activeSession = useMemo(() => {
    if (!activeSessionIdentifier) return null;
    const { programId, sessionId } = activeSessionIdentifier;
    const prog = wsPrograms.find(p => p.id === programId);
    if (!prog) return null;
    const sess = prog.sessions?.find(s => s.id === sessionId);
    if (!sess) return null;
    return { ...sess, programName: prog.name, programId: prog.id, programResources: prog.resources || [] };
  }, [activeSessionIdentifier, wsPrograms]);

  const setActiveSession = (s) => {
    if (s === null) {
      setActiveSessionIdentifier(null);
    } else {
      setActiveSessionIdentifier({ programId: s.programId, sessionId: s.id });
    }
  };


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

  const [facilitatorNotifications, setFacilitatorNotifications] = useState([
    {
      id: 1,
      priority: 'Critical',
      category: '🔴',
      title: 'Session Rescheduled',
      program: 'Leadership Orientation',
      description: 'Today\'s session has been moved from 10:00 AM to 11:30 AM.',
      time: '12 minutes ago',
      read: false,
      actionText: 'View Session',
      actionType: 'view_session'
    },
    {
      id: 2,
      priority: 'Important',
      category: '🟡',
      title: 'New Resources Uploaded',
      program: 'Communication Skills',
      description: 'The Admin uploaded "Session 2 Slides.pdf" and "Workbook.docx".',
      time: '2 hours ago',
      read: false,
      actionText: 'View Resource',
      actionType: 'view_resource'
    },
    {
      id: 3,
      priority: 'Information',
      category: '🔵',
      title: 'Organization Announcement',
      program: 'General Update',
      description: 'New policy updates regarding the Q3 training guidelines have been posted.',
      time: '1 day ago',
      read: true,
      actionText: 'Read Guidelines',
      actionType: 'view_policy'
    },
    {
      id: 4,
      priority: 'Critical',
      category: '🔴',
      title: 'Classroom Changed',
      program: 'Leadership Orientation',
      description: 'The physical classroom for your session has been moved to Room 402B.',
      time: '3 hours ago',
      read: false,
      actionText: 'View Session',
      actionType: 'view_session'
    },
    {
      id: 5,
      priority: 'Important',
      category: '🟡',
      title: 'Session Starts in 30 Minutes',
      program: 'Project Review',
      description: 'Reminder: Your upcoming session "Project Review" starts in 30 minutes.',
      time: '25 minutes ago',
      read: true,
      actionText: 'View Session',
      actionType: 'view_session'
    }
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
        role: userRole || 'Admin',
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
      // Check for URL invitation params
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const inviteCode = params.get('inviteCode') || params.get('code');
      const orgId = params.get('orgId');
      const email = params.get('email');

      if (tokenParam || inviteCode) {
        // Clean URL to not clutter
        window.history.replaceState({}, document.title, window.location.pathname);

        let savedInvitations = [];
        try {
          const stored = localStorage.getItem('oyen_ws_invitations');
          if (stored) savedInvitations = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }

        let prefilledEmail = email || '';
        let prefilledCode = inviteCode || '';

        if (tokenParam) {
          const matched = savedInvitations.find(i => i.token === tokenParam);
          if (matched) {
            prefilledEmail = matched.email;
            prefilledCode = matched.accessCode;
          }
        }

        setInvitationPrefill({
          inviteCode: prefilledCode,
          email: prefilledEmail,
          orgId: orgId || ''
        });

        setActiveRoute('signin');
        setAuthLoading(false);
        return;
      }

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
            
            const savedProgs = localStorage.getItem('oyen_ws_programs') || sessionStorage.getItem('oyen_ws_programs');
            if (savedProgs) setWsPrograms(JSON.parse(savedProgs));
            const savedLearners = localStorage.getItem('oyen_ws_learners') || sessionStorage.getItem('oyen_ws_learners');
            if (savedLearners) setWsLearners(JSON.parse(savedLearners));
            const savedTeam = localStorage.getItem('oyen_ws_team') || sessionStorage.getItem('oyen_ws_team');
            if (savedTeam) setWsTeam(JSON.parse(savedTeam));
            const savedInvitations = localStorage.getItem('oyen_ws_invitations');
            if (savedInvitations) setWsInvitations(JSON.parse(savedInvitations));
            setActiveRoute('dashboard');
            setActiveTab((role === 'Facilitator' || role === 'Team Member' || role === 'Viewer') ? 'Overview' : 'Dashboard');
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
    }, 1800); // 1.8 seconds for initial loader experience
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
      localStorage.setItem('oyen_ws_programs', JSON.stringify(wsPrograms));
      sessionStorage.setItem('oyen_ws_learners', JSON.stringify(wsLearners));
      localStorage.setItem('oyen_ws_learners', JSON.stringify(wsLearners));
      sessionStorage.setItem('oyen_ws_team', JSON.stringify(wsTeam)); // Keep session sync too
      localStorage.setItem('oyen_ws_team', JSON.stringify(wsTeam));
      localStorage.setItem('oyen_ws_invitations', JSON.stringify(wsInvitations));
    }
  }, [user, userRole, activeTemplate, enabledTemplates, wsPrograms, wsLearners, wsTeam, wsInvitations]);

  // Dynamically ensure only real logged-in owner is active and demo members are excluded
  useEffect(() => {
    if (user) {
      setWsTeam(prev => {
        const ownerEmailAddr = user;
        const ownerName = (user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com')
          ? `${ownerFirstName} ${ownerLastName}`
          : user.split('@')[0];
        const ownerInitials = (user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com')
          ? `${ownerFirstName?.[0] || 'J'}${ownerLastName?.[0] || 'D'}`
          : (user?.[0] || 'U').toUpperCase();

        const demoEmails = [
          'john.doe@abcenergy.com',
          'sarah.ahmed@abcenergy.com',
          'michael.ibrahim@abcenergy.com',
          'fatima.aliyu@abcenergy.com',
          'ngozi.kalu@abcenergy.com',
          'facilitator@oyengrid.test'
        ];

        // Filter out any hardcoded demo emails from the team state
        const cleaned = prev.filter(m => m.email && !demoEmails.includes(m.email.toLowerCase()));

        const exists = cleaned.some(m => m.email?.toLowerCase() === ownerEmailAddr.toLowerCase());
        if (exists) {
          return cleaned.map(m => m.email?.toLowerCase() === ownerEmailAddr.toLowerCase() ? {
            ...m,
            name: ownerName,
            initials: ownerInitials.toUpperCase(),
            role: userRole || 'Admin',
            isYou: true
          } : m);
        } else {
          return [
            {
              initials: ownerInitials.toUpperCase(),
              color: '#D4AF37',
              name: ownerName,
              isYou: true,
              email: ownerEmailAddr,
              role: userRole || 'Admin',
              status: 'Active',
              joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            },
            ...cleaned
          ];
        }
      });
    }
  }, [user, ownerFirstName, ownerLastName, ownerEmail, userRole]);



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
    sessionStorage.setItem('oyen_session_user', JSON.stringify({
      email,
      role,
      activeTemplate,
      enabledTemplates
    }));
    isLoggingOutRef.current = false;
    triggerTransition(() => {
      setUser(email);
      setUserRole(role);
      setActiveRoute('dashboard');
      setActiveTab((role === 'Facilitator' || role === 'Team Member' || role === 'Viewer') ? 'Overview' : 'Dashboard');
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
      setUserRole('Admin');

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
    isLoggingOutRef.current = false;
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
  const triggerTransition = (callback, delay = 500) => {
    showLoader();
    setTimeout(() => {
      callback();
      setTimeout(() => {
        hideLoader();
      }, delay);
    }, 500);
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




  // Render Post-signup Onboarding Wizard Flow
  if (activeRoute === 'onboarding' && user) {
    const isSplitStep = onboardingStep === 1 || onboardingStep === 2;
    
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundImage: `url(${onboardingBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        transition: 'all 0.3s ease'
      }}>
        <div className="form-card" style={{ 
          maxWidth: isSplitStep ? '1100px' : '600px', 
          width: '100%',
          backgroundColor: 'rgba(9, 9, 11, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
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
          {/* STEP 2: Create Admin */}
          {onboardingStep === 2 && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem' }}>
              
              {/* Form Side */}
              <div>
                <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 2 of 5 Ã¢â‚¬Â¢ Admin</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>Create the admin account.</h2>
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
                      setUserRole('Admin');
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
              <button className="submit-btn" onClick={() => handleAuthSuccess(user, 'Admin')}>
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
    const showTeamMemberOverview = userRole === 'Team Member' && isWelcome;
    const showViewerOverview = userRole === 'Viewer' && isWelcome;

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

    let sidebarItems = allSidebarItems;
    if (userRole === 'Facilitator') {
      sidebarItems = [
        { id: 'Overview', label: 'Dashboard', icon: <Home size={18} /> },
        { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
        { id: 'Resources', label: 'Resources', icon: <BookOpen size={18} /> },
        { id: 'Notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
      ];
    } else if (userRole === 'Program Manager') {
      sidebarItems = [
        { id: 'Welcome', label: 'Welcome', icon: <Home size={18} /> },
        { id: 'Your Workspace', label: 'Your Workspace', icon: <Grid size={18} /> },
        { id: 'Programmes', label: 'Programmes', icon: <BookOpen size={18} /> },
        { id: 'Learners', label: 'Participants', icon: <UserCheck size={18} /> },
        { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
        { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
        { id: 'Settings', label: 'Settings', icon: <Settings size={18} /> }
      ];
    } else if (userRole === 'Team Member') {
      sidebarItems = [
        { id: 'Overview', label: 'Overview', icon: <Home size={18} /> },
        { id: 'Assigned Programs', label: 'Assigned Programs', icon: <BookOpen size={18} /> },
        { id: 'Learners', label: 'Learners', icon: <UserCheck size={18} /> },
        { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
        { id: 'Resources', label: 'Resources', icon: <Grid size={18} /> },
        { id: 'Announcements', label: 'Announcements', icon: <Bell size={18} /> },
        { id: 'Certificates', label: 'Certificates', icon: <Award size={18} /> },
        { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
      ];
    } else if (userRole === 'Viewer') {
      sidebarItems = [
        { id: 'Overview', label: 'Dashboard', icon: <Home size={18} /> },
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
      ];
    }

    const displayPrograms = getProgramsForUser(user, userRole, wsPrograms);
    const displaySessions = getSessionsForUser(user, userRole, wsPrograms);
    const displayLearners = getLearnersForUser(user, userRole, wsLearners, wsPrograms);
    const displayInbox = getInboxForUser(user, userRole, wsPrograms);

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
          backgroundColor: '#0D0D0D',
          borderBottom: '1px solid #1F1F1F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
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
              {/* Org logo — uploaded during onboarding, fallback to gold hexagon */}
              <div style={{
                background: orgLogo ? 'transparent' : 'rgba(212, 175, 55, 0.1)',
                border: orgLogo ? 'none' : '1px solid #D4AF37',
                padding: orgLogo ? '0' : '0.35rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                flexShrink: 0,
                overflow: 'hidden'
              }}>
                {orgLogo ? (
                  <img
                    src={orgLogo}
                    alt="Organization Logo"
                    style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px' }}
                  />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#D4AF37" strokeWidth="2.5" fill="rgba(212, 175, 55, 0.2)"/>
                    <path d="M12 6L9 12H15L12 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>{orgName || 'My Workspace'}</span>
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
            backgroundColor: '#151515',
            borderRight: '1px solid #252525',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem 0.5rem',
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
                      padding: '0.75rem 1rem',
                      margin: '0 0.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#151515' : '#a0aec0',
                      background: isActive ? '#F5C84C' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.background = 'rgba(245, 200, 76, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#a0aec0';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ color: isActive ? '#151515' : '#718096' }}>
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
                    <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>Admin</span>
                  </div>
                </div>
                <ChevronDown size={14} color="#718096" />
              </div>
            </div>
          </aside>

          {/* Main Workspace Frame */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#EEEAE4', backgroundImage: 'radial-gradient(circle at top right, rgba(245, 200, 76, 0.04), transparent 50%)', overflowY: 'auto' }}>
            
            {/* Conditional content based on activeTab */}
            {userRole === 'Facilitator' && activeSession ? (
              <SessionDetail 
                session={activeSession}
                onBack={() => setActiveSession(null)}
                addNotification={addNotification}
                onUpdateStatus={(newStatus) => {
                  setWsPrograms(prev => {
                    const next = updateSessionStatus(prev, activeSession.programId, activeSession.id, newStatus);
                    const updatedProg = next.find(p => p.id === activeSession.programId);
                    const updatedSess = updatedProg?.sessions?.find(s => s.id === activeSession.id);

                    localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
                    return next;
                  });
                }}
                learners={wsLearners.filter(l => l.program === activeSession.programName)}
                programResources={wsPrograms.find(p => p.id === activeSession.programId)?.resources || []}
                sessionResources={activeSession.resources || []}
              />
            ) : showFacilitatorOverview ? (
              <FacilitatorOverview 
                info={getLoggedInUserInfo()} 
                programs={displayPrograms} 
                learners={wsLearners}
                announcements={displayInbox}
                notifications={facilitatorNotifications}
                onNavigate={setActiveTab} 
                addNotification={addNotification}
                onSelectSession={(s) => {
                  setActiveSession(s);
                  setActiveTab('Sessions');
                }}
              />
            ) : showTeamMemberOverview ? (
              <TeamMemberOverview 
                info={getLoggedInUserInfo()} 
                programs={displayPrograms} 
                learners={wsLearners}
                onNavigate={setActiveTab} 
                addNotification={addNotification}
              />
            ) : showViewerOverview ? (
              <ViewerOverview 
                info={getLoggedInUserInfo()} 
                programs={displayPrograms} 
                learners={wsLearners}
                onNavigate={setActiveTab} 
                addNotification={addNotification}
              />
            ) : isWelcome ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', padding: '2.5rem 3rem' }}>
                
                {/* Center Main Panel (Left in main layout) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Hero welcome banner card */}
                  <div style={{
                    borderRadius: '18px',
                    border: orgLogo ? '1px solid #C8BFB2' : '1px solid #DDD6CB',
                    backgroundColor: '#F5F2ED',
                    backgroundImage: orgLogo
                      ? `linear-gradient(to right, rgba(15, 12, 8, 0.82) 0%, rgba(15, 12, 8, 0.55) 55%, rgba(15, 12, 8, 0.15) 100%), url(${orgLogo})`
                      : 'radial-gradient(circle at top right, rgba(245, 200, 76, 0.06), transparent 50%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '3rem',
                    minHeight: '360px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 2px 16px rgba(100, 90, 75, 0.12)'
                  }}>
                    {/* Left content column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, zIndex: 2, textAlign: 'left' }}>

                      {/* Workspace Ready Badge */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#16a34a',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '20px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        alignSelf: 'flex-start',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }}></span>
                        Workspace Ready
                      </div>

                      <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: orgLogo ? '#FFFFFF' : '#151515', margin: 0, lineHeight: 1.15, fontFamily: "'Inter', sans-serif" }}>
                        Welcome to <br />
                        <span style={{ color: '#F5C84C' }}>{orgName ? orgName.charAt(0).toUpperCase() + orgName.slice(1) : 'Your Workspace'}</span>
                      </h1>
                      
                      <p style={{ color: orgLogo ? 'rgba(255,255,255,0.75)' : '#5C5C5C', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '380px', lineHeight: '1.6' }}>
                        Your workspace is ready to power impactful learning experiences.
                      </p>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button 
                          onClick={() => triggerTransition(() => setActiveTab('Your Workspace'))}
                          style={{
                            background: '#F5C84C',
                            border: '1px solid #F5C84C',
                            color: '#151515',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(245, 200, 76, 0.25)',
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
                            background: orgLogo ? 'rgba(255,255,255,0.12)' : 'transparent',
                            border: orgLogo ? '1px solid rgba(255,255,255,0.3)' : '1px solid #ECE6DC',
                            color: orgLogo ? '#FFFFFF' : '#5C5C5C',
                            fontFamily: "'Inter', sans-serif",
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
                            e.currentTarget.style.backgroundColor = orgLogo ? 'rgba(255,255,255,0.2)' : '#F5F5F5';
                            e.currentTarget.style.borderColor = orgLogo ? 'rgba(255,255,255,0.5)' : '#D4CFC6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = orgLogo ? 'rgba(255,255,255,0.12)' : 'transparent';
                            e.currentTarget.style.borderColor = orgLogo ? 'rgba(255,255,255,0.3)' : '#ECE6DC';
                          }}
                        >
                          <UserPlus size={16} /> Invite Team
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* "What You Can Do Now" section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151515', letterSpacing: '0.3px', fontFamily: "'Inter', sans-serif" }}>What You Can Do Now</h3>
                    
                    {/* 5 columns of action cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
                      {[
                        { 
                          title: 'Programmes', 
                          desc: 'Create and manage bootcamps, training programmes and cohorts.', 
                          linkText: 'Manage',
                          icon: <Grid size={22} color="#E2B235" />
                        },
                        { 
                          title: 'Participants', 
                          desc: 'View and manage all participants enrolled in your programs.', 
                          linkText: 'View Participants',
                          icon: <User size={22} color="#E2B235" />
                        },
                        { 
                          title: 'Sessions', 
                          desc: 'Schedule, run and manage sessions and events seamlessly.', 
                          linkText: 'Manage Sessions',
                          icon: <Calendar size={22} color="#E2B235" />
                        },
                        { 
                          title: 'Reports', 
                          desc: 'Access insights and performance analytics in real time.', 
                          linkText: 'View Reports',
                          icon: <BarChart3 size={22} color="#E2B235" />
                        },
                        { 
                          title: 'Settings', 
                          desc: 'Manage workspace settings, roles, permissions and integrations.', 
                          linkText: 'Workspace Settings',
                          icon: <Settings size={22} color="#E2B235" />
                        }
                      ].map((card, i) => (
                        <div 
                          key={i}
                          style={{
                            backgroundColor: '#F5F2ED',
                            border: '1px solid #DDD6CB',
                            borderRadius: '18px',
                            padding: '2rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '250px',
                            boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(142, 135, 120, 0.12)';
                            e.currentTarget.style.borderColor = '#D4CFC6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(142, 135, 120, 0.05)';
                            e.currentTarget.style.borderColor = '#ECE6DC';
                          }}
                          onClick={() => triggerTransition(() => setActiveTab(card.title))}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ 
                              alignSelf: 'flex-start',
                              backgroundColor: 'rgba(245, 200, 76, 0.12)',
                              padding: '0.65rem',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {card.icon}
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>{card.title}</h4>
                            <p style={{ color: '#5C5C5C', fontSize: '0.78rem', lineHeight: '1.45', margin: 0 }}>{card.desc}</p>
                          </div>
                          
                          <div 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.35rem', 
                              color: '#E2B235', 
                              fontSize: '0.78rem', 
                              fontWeight: 700, 
                              marginTop: '1.25rem'
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
                    backgroundColor: '#F5F2ED',
                    border: '1px solid #DDD6CB',
                    borderRadius: '18px',
                    padding: '2rem 1.5rem',
                    boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)'
                  }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#151515', marginBottom: '1.5rem', fontFamily: "'Inter', sans-serif" }}>Workspace Summary</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DDD6CB', paddingBottom: '0.75rem' }}>
                        <span style={{ color: '#7E7E7E' }}>Solution</span>
                        <span style={{ fontWeight: 600, color: '#151515' }}>Bootcamps & Training</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DDD6CB', paddingBottom: '0.75rem' }}>
                        <span style={{ color: '#7E7E7E' }}>Plan</span>
                        <span style={{ fontWeight: 600, color: '#151515' }}>Standard</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DDD6CB', paddingBottom: '0.75rem' }}>
                        <span style={{ color: '#7E7E7E' }}>Status</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 600 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                          Active
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DDD6CB', paddingBottom: '0.75rem' }}>
                        <span style={{ color: '#7E7E7E' }}>Participants Included</span>
                        <span style={{ fontWeight: 600, color: '#151515' }}>50</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #DDD6CB', paddingBottom: '0.75rem' }}>
                        <span style={{ color: '#7E7E7E' }}>Storage</span>
                        <span style={{ fontWeight: 600, color: '#151515' }}>10 GB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#7E7E7E' }}>AI Allocation</span>
                        <span style={{ fontWeight: 600, color: '#151515' }}>Basic</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Next Steps */}
                  <div style={{
                    backgroundColor: '#F5F2ED',
                    border: '1px solid #DDD6CB',
                    borderRadius: '18px',
                    padding: '2rem 1.5rem',
                    boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)'
                  }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#151515', marginBottom: '1.5rem', fontFamily: "'Inter', sans-serif" }}>Next Steps</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {[
                        { step: 1, label: 'Organization Verified', completed: true },
                        { step: 2, label: 'Workspace Configured', completed: true },
                        { step: 3, label: 'Team Invited', completed: true }
                      ].map((st) => (
                        <div key={st.step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(22, 163, 74, 0.08)',
                            border: '1.5px solid #16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#16a34a',
                            flexShrink: 0
                          }}>
                            <Check size={11} strokeWidth={4} />
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#7E7E7E', textDecoration: 'line-through' }}>{st.label}</span>
                        </div>
                      ))}

                      {/* Active Step 4 */}
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(245, 200, 76, 0.12)',
                          border: '1.5px solid #F5C84C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#E2B235',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          marginTop: '0.15rem',
                          flexShrink: 0
                        }}>
                          4
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', textAlign: 'left' }}>
                          <span style={{ fontSize: '0.85rem', color: '#151515', fontWeight: 600 }}>Create Your First Programme</span>
                          <span style={{ fontSize: '0.75rem', color: '#5C5C5C' }}>Kickstart your learning journey.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Need Help */}
                  <div style={{
                    backgroundColor: '#F5F2ED',
                    border: '1px solid #DDD6CB',
                    borderRadius: '18px',
                    padding: '2rem 1.5rem',
                    boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(245, 200, 76, 0.12)',
                      border: '1px solid rgba(245, 200, 76, 0.2)',
                      borderRadius: '10px',
                      padding: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E2B235'
                    }}>
                      <Headphones size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Need Help?</h4>
                      <p style={{ color: '#5C5C5C', fontSize: '0.78rem', lineHeight: '1.4', margin: 0 }}>
                        Our support team is here to help you get started.
                      </p>
                      <button style={{
                        background: 'transparent',
                        border: '1px solid #ECE6DC',
                        color: '#5C5C5C',
                        borderRadius: '6px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        alignSelf: 'flex-start',
                        marginTop: '0.25rem',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F5F5F5';
                        e.currentTarget.style.borderColor = '#D4CFC6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#ECE6DC';
                      }}
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
            ) : (activeTab === 'Programmes' || activeTab === 'Programs' || activeTab === 'My Programs' || activeTab === 'Assigned Programs') ? (
              /* Programmes Tab Component */
              <ProgramsTab
                programs={displayPrograms}
                setPrograms={setWsPrograms}
                learners={wsLearners}
                setLearners={setWsLearners}
                teamMembers={wsTeam}
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
                onSelectSession={setActiveSession}
              />
            ) : activeTab === 'Reports' ? (
              /* Reports Tab Component */
              <ReportsTab
                programs={displayPrograms}
                learners={wsLearners}
              />
            ) : activeTab === 'Attendance' ? (
              <AttendanceTab
                programs={displayPrograms}
                learners={wsLearners}
                addNotification={addNotification}
              />
            ) : activeTab === 'Assessments' ? (
              <AssessmentsTab
                programs={displayPrograms}
                addNotification={addNotification}
              />
            ) : activeTab === 'Announcements' ? (
              <AnnouncementsTab
                programs={displayPrograms}
                addNotification={addNotification}
                userRole={userRole}
              />
            ) : activeTab === 'Notifications' ? (
              <NotificationsTab
                notifications={facilitatorNotifications}
                setNotifications={setFacilitatorNotifications}
                onSelectSession={(s) => {
                  setActiveSession(s);
                  setActiveTab('Sessions');
                }}
                programs={displayPrograms}
              />
            ) : activeTab === 'Certificates' ? (
              <CertificatesTab
                programs={displayPrograms}
                learners={wsLearners}
                addNotification={addNotification}
              />
            ) : activeTab === 'Your Workspace' ? (
              /* Redesigned Your Workspace Page */
              (() => {
                // Storage calculations
                let totalBytes = 0;
                displayPrograms.forEach(p => {
                  (p.resources || []).forEach(r => { totalBytes += r.sizeInBytes || 0; });
                  (p.sessions || []).forEach(s => {
                    (s.resources || []).forEach(sr => { totalBytes += sr.sizeInBytes || 0; });
                  });
                });
                const totalMB = totalBytes / (1024 * 1024);
                const limitMB = 10240; // 10 GB
                const storagePercent = Math.min((totalMB / limitMB) * 100, 100);
                const storageText = totalBytes === 0 ? '0.00 MB' : totalBytes >= 1024*1024*1024 ? `${(totalBytes / (1024*1024*1024)).toFixed(2)} GB` : `${totalMB.toFixed(2)} MB`;

                // Activity feed retrieval
                const allActivities = [];
                displayPrograms.forEach(p => {
                  (p.activity || []).forEach(act => {
                    allActivities.push({ ...act, programName: p.name });
                  });
                });
                allActivities.sort((a, b) => b.id - a.id);

                return (
                  <div className="animate-fade-in" style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
                    
                    {/* Hero Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                      <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>Your Workspace</h1>
                        <p style={{ color: '#5C5C5C', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '520px', lineHeight: '1.65' }}>
                          Manage your organization, monitor workspace usage, and configure essential settings from one place.
                        </p>
                      </div>

                      {/* Workspace Status Card */}
                      <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workspace Status</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#7E7E7E' }}>Current Plan:</span>
                            <span style={{ fontWeight: 600, color: '#151515' }}>Standard</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#7E7E7E' }}>Workspace Type:</span>
                            <span style={{ fontWeight: 600, color: '#151515' }}>Enterprise</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#7E7E7E' }}>Created Date:</span>
                            <span style={{ fontWeight: 600, color: '#151515' }}>July 2026</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #DDD6CB', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                            <span style={{ color: '#7E7E7E' }}>Workspace ID:</span>
                            <span style={{ fontFamily: 'monospace', color: '#151515' }}>ws_oyg_9f3a8b</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Workspace Overview Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                      {[
                        { label: 'Programmes', value: `${displayPrograms.length} / 3 Created`, pct: (displayPrograms.length / 3) * 100, barColor: 'linear-gradient(90deg, #F5C84C, #E2A020)', icon: <BookOpen size={20} color="#E2B235" /> },
                        { label: 'Learners', value: `${wsLearners.length} / 50 Enrolled`, pct: (wsLearners.length / 50) * 100, barColor: 'linear-gradient(90deg, #22c55e, #16a34a)', icon: <Users size={20} color="#22c55e" /> },
                        { label: 'Team Members', value: `${wsTeam.length} Active Member${wsTeam.length !== 1 ? 's' : ''}`, pct: 100, barColor: 'linear-gradient(90deg, #A855F7, #7E22CE)', icon: <UserCheck size={20} color="#A855F7" /> },
                        { label: 'Storage', value: `${storageText} / 10 GB`, pct: storagePercent, barColor: 'linear-gradient(90deg, #3b82f6, #2563eb)', icon: <HardDrive size={20} color="#3b82f6" /> },
                      ].map((card, i) => (
                        <div key={i} style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(100,90,75,0.07)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {card.icon}
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7E7E7E' }}>{card.label}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#151515' }}>{card.value}</div>
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#E8E2DA', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${card.pct}%`, background: card.barColor, borderRadius: '99px' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Workspace Configuration & Recent Activity (2-column layout) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
                      
                      {/* Left: Configuration & Recent Activity */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', fontFamily: "'Inter', sans-serif" }}>Workspace Configuration</h2>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            {[
                              { title: 'Branding', desc: 'Manage your logo and organization profile.', tab: 'Settings' },
                              { title: 'Roles & Permissions', desc: 'Control workspace access and user roles.', tab: 'Settings' },
                              { title: 'Notifications', desc: 'Configure email and system notifications.', tab: 'Settings' },
                              { title: 'Integrations', desc: 'Connect external services and applications.', tab: 'Settings' },
                            ].map((config, idx) => (
                              <div key={idx} style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => triggerTransition(() => setActiveTab(config.tab))} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 90, 75, 0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div>
                                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>{config.title}</h4>
                                  <p style={{ fontSize: '0.8rem', color: '#5C5C5C', marginTop: '0.4rem', lineHeight: '1.4' }}>{config.desc}</p>
                                </div>
                                <button style={{ background: 'transparent', border: 'none', color: '#E2B235', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                                  Manage <ArrowRight size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif" }}>Recent Activity</h2>
                          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {allActivities.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                {allActivities.slice(0, 5).map((entry, i) => (
                                  <div key={entry.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '0.9rem', borderBottom: i < 4 ? '1px solid #E8E2DA' : 'none' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F5C84C', marginTop: '0.45rem', flexShrink: 0 }} />
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                                          {entry.programName}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: '#7E7E7E' }}>{entry.time}</span>
                                      </div>
                                      <p style={{ fontSize: '0.82rem', color: '#151515', margin: '0.35rem 0 0 0', lineHeight: '1.4' }}>{entry.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(245,200,76,0.12)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#E2B235' }}>
                                  <Clock size={22} />
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: 0 }}>No recent activity yet</h4>
                                  <p style={{ color: '#5C5C5C', fontSize: '0.8rem', marginTop: '0.3rem', maxWidth: '320px', lineHeight: '1.4' }}>
                                    Activity from programmes, learners, sessions, and workspace updates will appear here once you begin using OYEN GRID.
                                  </p>
                                </div>
                                <button onClick={() => triggerTransition(() => setActiveTab('Programmes'))} style={{ background: '#F5C84C', border: 'none', color: '#151515', borderRadius: '8px', padding: '0.6rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", marginTop: '0.5rem' }}>
                                  Create Your First Programme
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Workspace Information & Usage */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Workspace Information */}
                        <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', fontFamily: "'Inter', sans-serif" }}>Workspace Information</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.8rem' }}>
                            {[
                              { label: 'Organization Name', value: orgName || 'Oyen Grid' },
                              { label: 'Workspace Name', value: 'Default Workspace' },
                              { label: 'Workspace Type', value: 'Enterprise' },
                              { label: 'Current Plan', value: 'Standard Plan' },
                              { label: 'Time Zone', value: 'GMT +1:00' },
                              { label: 'Created Date', value: 'July 27, 2026' }
                            ].map((row, idx, arr) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: idx < arr.length - 1 ? '0.8rem' : 0, borderBottom: idx < arr.length - 1 ? '1px solid #DDD6CB' : 'none' }}>
                                <span style={{ color: '#7E7E7E' }}>{row.label}</span>
                                <span style={{ fontWeight: 600, color: '#151515' }}>{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Workspace Usage */}
                        <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', fontFamily: "'Inter', sans-serif" }}>Workspace Usage</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[
                              { label: 'Programmes Used', value: `${displayPrograms.length} / 3`, pct: (displayPrograms.length / 3) * 100, barColor: '#E2B235' },
                              { label: 'Learners Enrolled', value: `${wsLearners.length} / 50`, pct: (wsLearners.length / 50) * 100, barColor: '#22c55e' },
                              { label: 'Team Members', value: `${wsTeam.length} / 10`, pct: (wsTeam.length / 10) * 100, barColor: '#A855F7' },
                              { label: 'Storage Usage', value: `${storageText} / 10 GB`, pct: storagePercent, barColor: '#3b82f6' }
                            ].map((row, idx) => (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                  <span style={{ color: '#7E7E7E', fontWeight: 500 }}>{row.label}</span>
                                  <span style={{ fontWeight: 600, color: '#151515' }}>{row.value}</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#E8E2DA', borderRadius: '99px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${row.pct}%`, backgroundColor: row.barColor, borderRadius: '99px' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', fontFamily: "'Inter', sans-serif" }}>Quick Actions</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                        {[
                          { title: 'Create Programme', desc: 'Build and launch a new educational workspace.', tab: 'Programmes', icon: <Plus size={18} color="#E2B235" /> },
                          { title: 'Invite Team Members', desc: 'Add new facilitators and managers.', tab: 'Team', icon: <UserPlus size={18} color="#E2B235" /> },
                          { title: 'Manage Workspace', desc: 'Configure brand assets, logo, and names.', tab: 'Settings', icon: <Settings size={18} color="#E2B235" /> },
                          { title: 'Upgrade Plan', desc: 'Expand workspace limits and enrollments.', tab: 'Settings', icon: <Zap size={18} color="#E2B235" /> }
                        ].map((act, i) => (
                          <div key={i} style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => triggerTransition(() => setActiveTab(act.tab))} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(100, 90, 75, 0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245,200,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {act.icon}
                              </div>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>{act.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#5C5C5C', margin: 0, lineHeight: '1.4' }}>{act.desc}</p>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2B235', display: 'flex', alignItems: 'center', gap: '0.25rem', alignSelf: 'flex-start' }}>
                              Go <ArrowRight size={14} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()
            ) : activeTab === 'Getting Started' ? (
              /* ── Getting Started Onboarding Page ── */
              (() => {
                const setupSteps = [
                  { id: 1, label: 'Workspace Created', desc: 'Your OYEN GRID workspace has been successfully provisioned.', done: true, tab: null },
                  { id: 2, label: 'Organization Profile Completed', desc: 'Your organization name, logo, and details have been saved.', done: !!(orgLogo || orgName), tab: null },
                  { id: 3, label: 'Invite Team Members', desc: 'Add administrators and facilitators to collaborate in your workspace.', done: wsTeam.length > 0, tab: 'Team' },
                  { id: 4, label: 'Configure Roles & Permissions', desc: 'Set up access levels to control what each team member can do.', done: false, tab: 'Settings' },
                  { id: 5, label: 'Create Your First Programme', desc: 'Programmes are the foundation of your workspace learning structure.', done: displayPrograms.length > 0, tab: 'Programmes' },
                  { id: 6, label: 'Add Learners', desc: 'Enroll participants into your programmes to begin their journey.', done: wsLearners.length > 0, tab: 'Participants' },
                  { id: 7, label: 'Schedule Your First Session', desc: 'Create a live session or workshop inside one of your programmes.', done: false, tab: 'Sessions' },
                  { id: 8, label: 'Configure Notifications', desc: 'Set up email and in-app notifications to keep your team updated.', done: false, tab: 'Settings' },
                  { id: 9, label: 'Generate Test Certificate', desc: 'Preview and test your certificate template before launch.', done: false, tab: 'Certificates' },
                  { id: 10, label: 'Launch Your First Programme', desc: 'Make your programme live and start enrolling learners at scale.', done: false, tab: 'Programmes' },
                ];
                const completedCount = setupSteps.filter(s => s.done).length;
                const progressPct = Math.round((completedCount / setupSteps.length) * 100);
                const nextStep = setupSteps.find(s => !s.done);
                return (
                  <div style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
                    {/* Hero */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(245,200,76,0.1)', border: '1px solid rgba(245,200,76,0.25)', borderRadius: '20px', padding: '0.35rem 0.85rem', alignSelf: 'flex-start' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E2B235', display: 'inline-block' }}></span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B8891A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Setup in Progress</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>Getting Started</h1>
                        <p style={{ color: '#5C5C5C', fontSize: '1rem', maxWidth: '520px', lineHeight: '1.65', margin: 0 }}>Complete a few simple steps to prepare your workspace before launching your first programme.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                          <button onClick={() => nextStep && nextStep.tab && triggerTransition(() => setActiveTab(nextStep.tab))} style={{ background: '#F5C84C', border: '1px solid #F5C84C', color: '#151515', fontFamily: "'Inter', sans-serif", fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,200,76,0.25)', transition: 'all 0.2s ease', fontSize: '0.9rem' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>Continue Setup <ArrowRight size={16} /></button>
                          <button style={{ background: 'transparent', border: '1px solid #DDD6CB', color: '#5C5C5C', fontFamily: "'Inter', sans-serif", fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EDE8'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>View Setup Guide</button>
                        </div>
                      </div>
                      {/* Progress Card */}
                      <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100,90,75,0.07)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#151515', fontFamily: "'Inter', sans-serif" }}>Workspace Setup Progress</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E2B235', fontFamily: "'Inter', sans-serif" }}>{progressPct}%</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#E8E2DA', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #F5C84C, #E2A020)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
                        </div>
                        <p style={{ color: '#5C5C5C', fontSize: '0.78rem', margin: '0 0 1.25rem' }}>{setupSteps.length - completedCount} steps remaining to complete setup</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {setupSteps.slice(0, 5).map(s => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: s.done ? 'rgba(22,163,74,0.12)' : 'rgba(245,200,76,0.12)', border: s.done ? '1.5px solid #16a34a' : '1.5px solid #F5C84C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {s.done ? <Check size={9} strokeWidth={3} color="#16a34a" /> : <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#E2B235', display: 'inline-block' }}></span>}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: s.done ? '#7E7E7E' : '#151515', fontWeight: s.done ? 400 : 600, textDecoration: s.done ? 'line-through' : 'none' }}>{s.label}</span>
                            </div>
                          ))}
                          <span style={{ fontSize: '0.72rem', color: '#B8891A', fontWeight: 600, marginTop: '0.25rem' }}>+ {setupSteps.length - 5} more steps below ↓</span>
                        </div>
                      </div>
                    </div>

                    {/* Main + Right Sidebar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: '2rem', alignItems: 'start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Full checklist */}
                        <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100,90,75,0.07)' }}>
                          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: '0 0 1.5rem', fontFamily: "'Inter', sans-serif" }}>Complete Your Workspace Setup</h2>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {setupSteps.map((step, idx) => (
                              <div key={step.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem 0', borderBottom: idx < setupSteps.length - 1 ? '1px solid #E8E2DA' : 'none', cursor: step.tab ? 'pointer' : 'default', transition: 'padding-left 0.2s ease', borderRadius: '4px' }} onClick={() => step.tab && triggerTransition(() => setActiveTab(step.tab))} onMouseEnter={(e) => { if (step.tab) e.currentTarget.style.paddingLeft = '0.35rem'; }} onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0'; }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step.done ? 'rgba(22,163,74,0.1)' : 'rgba(245,200,76,0.1)', border: step.done ? '1.5px solid #16a34a' : '1.5px solid #F5C84C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                                  {step.done ? <Check size={12} strokeWidth={3} color="#16a34a" /> : <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#E2B235' }}>{idx + 1}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: step.done ? '#7E7E7E' : '#151515', textDecoration: step.done ? 'line-through' : 'none', fontFamily: "'Inter', sans-serif" }}>{step.label}</span>
                                    {step.tab && !step.done && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2B235', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>Start <ArrowRight size={12} /></span>}
                                    {step.done && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>✓ Done</span>}
                                  </div>
                                  <p style={{ fontSize: '0.78rem', color: step.done ? '#A0A0A0' : '#5C5C5C', margin: '0.2rem 0 0', lineHeight: '1.4' }}>{step.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Setup Cards */}
                        <div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem', fontFamily: "'Inter', sans-serif" }}>Recommended Setup</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[
                              { label: 'Organization', desc: 'Complete company profile', btn: 'Manage', tab: 'Settings', icon: <Building2 size={20} color="#E2B235" /> },
                              { label: 'Team', desc: 'Invite administrators and facilitators', btn: 'Invite', tab: 'Team', icon: <Users size={20} color="#E2B235" /> },
                              { label: 'Programmes', desc: 'Create your first programme', btn: 'Create', tab: 'Programmes', icon: <Grid size={20} color="#E2B235" /> },
                              { label: 'Workspace', desc: 'Configure branding and preferences', btn: 'Configure', tab: 'Settings', icon: <Settings size={20} color="#E2B235" /> },
                            ].map((c, i) => (
                              <div key={i} style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '16px', padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 2px 10px rgba(100,90,75,0.05)', transition: 'all 0.25s ease', cursor: 'pointer' }} onClick={() => triggerTransition(() => setActiveTab(c.tab))} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(100,90,75,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(100,90,75,0.05)'; }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245,200,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
                                <div>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#151515', fontFamily: "'Inter', sans-serif" }}>{c.label}</div>
                                  <div style={{ fontSize: '0.74rem', color: '#5C5C5C', marginTop: '0.2rem', lineHeight: '1.35' }}>{c.desc}</div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); triggerTransition(() => setActiveTab(c.tab)); }} style={{ background: '#F5C84C', border: 'none', color: '#151515', borderRadius: '6px', padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start', fontFamily: "'Inter', sans-serif" }}>{c.btn}</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {nextStep && (
                          <div style={{ backgroundColor: '#151515', border: '1px solid #252525', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#F5C84C', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.75rem' }}>Recommended Next Step</div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem', fontFamily: "'Inter', sans-serif" }}>{nextStep.label}</h4>
                            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.58)', lineHeight: '1.5', margin: '0 0 1.25rem' }}>{nextStep.desc}</p>
                            {nextStep.tab && <button onClick={() => triggerTransition(() => setActiveTab(nextStep.tab))} style={{ background: '#F5C84C', border: 'none', color: '#151515', borderRadius: '8px', padding: '0.65rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>{nextStep.label.split(' ').slice(0, 3).join(' ')} <ArrowRight size={14} /></button>}
                          </div>
                        )}
                        <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100,90,75,0.07)' }}>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem', fontFamily: "'Inter', sans-serif" }}>Helpful Resources</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {[
                              { label: 'Setup Guide', icon: <BookOpen size={14} color="#E2B235" /> },
                              { label: 'Video Tutorials', icon: <Play size={14} color="#E2B235" /> },
                              { label: 'OYEN AI Assistant', icon: <Zap size={14} color="#E2B235" /> },
                              { label: 'Contact Support', icon: <Headphones size={14} color="#E2B235" /> },
                            ].map((r, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.55rem 0.65rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8E0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'rgba(245,200,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#151515' }}>{r.label}</span>
                                <ArrowRight size={11} color="#B8891A" style={{ marginLeft: 'auto' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100,90,75,0.07)' }}>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#151515', margin: '0 0 1.1rem', fontFamily: "'Inter', sans-serif" }}>Workspace Health</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.78rem' }}>
                            {[
                              { label: 'Status', value: 'Active', valueColor: '#16a34a' },
                              { label: 'Storage Used', value: '0.4 GB / 10 GB', valueColor: '#151515' },
                              { label: 'Team Members', value: `${wsTeam.length} active`, valueColor: '#151515' },
                              { label: 'Current Plan', value: 'Standard', valueColor: '#151515' },
                              { label: 'Programmes', value: `${displayPrograms.length} created`, valueColor: '#151515' },
                            ].map((row, i, arr) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length - 1 ? '0.8rem' : 0, borderBottom: i < arr.length - 1 ? '1px solid #E0D9D0' : 'none' }}>
                                <span style={{ color: '#7E7E7E' }}>{row.label}</span>
                                <span style={{ fontWeight: 600, color: row.valueColor }}>{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : activeTab === 'Settings' ? (
              /* Settings Tab Component */
              <SettingsTab
                programs={wsPrograms}
                learners={wsLearners}
                teamMembers={wsTeam}
                setTeamMembers={setWsTeam}
                invitations={wsInvitations}
                setInvitations={setWsInvitations}
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
                userRole={userRole}
                organizationName={orgName}
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
            ) : activeTab === 'Inbox' ? (
              <InboxTab 
                announcements={displayInbox} 
                programs={displayPrograms} 
                onSelectSession={(s) => {
                  setActiveSession(s);
                  setActiveTab('Sessions');
                }} 
              />
            ) : activeTab === 'Help' ? (
              <HelpTab />
            ) : activeTab === 'Resources' ? (
              <ResourcesTab programs={displayPrograms} addNotification={addNotification} currentUser={getLoggedInUserInfo()} />
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
    return <div style={{ minHeight: '100vh', backgroundColor: '#0B0D10' }} />;
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={oyenLogo} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(200,154,43,0.2)' }} alt="OYEN GRID logo" />
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
                      setUserRole('Admin');
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
                        onClick={() => window.open('https://oyengrid.com/pricing', '_blank')}
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
              invitationPrefill={invitationPrefill}
              setInvitationPrefill={setInvitationPrefill}
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



        </div>
      </main>
    </div>
  );
}

function ProfileTab({ info, onSaveName, addNotification, userRole, organizationName }) {
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
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: userRole === 'Facilitator' ? 'rgba(255,255,255,0.02)' : '#000', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: userRole === 'Facilitator' ? 'rgba(255,255,255,0.4)' : '#fff', fontSize: '0.85rem', outline: 'none', cursor: userRole === 'Facilitator' ? 'not-allowed' : 'text' }}
              required
              readOnly={userRole === 'Facilitator'}
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

          {userRole === 'Facilitator' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Organization</label>
                <input 
                  type="text" 
                  value={organizationName || 'ABC Energy'} 
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'not-allowed' }}
                  readOnly
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>Assigned Role</label>
                <input 
                  type="text" 
                  value={info.role || 'Facilitator'} 
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'not-allowed' }}
                  readOnly
                />
              </div>
            </>
          )}
          {userRole !== 'Facilitator' && (
            <button 
              type="submit" 
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', alignSelf: 'flex-start' }}
            >
              Save Changes
            </button>
          )}
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
    { q: 'Can I change my subscription plan?', a: 'Plan changes can be managed under Organization Settings (accessible only to Admins).' },
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








const FacilitatorResourcesView = ({ programs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Extract and flat map all resources
  const programResources = [];
  const sessionResources = [];

  programs.forEach(p => {
    (p.resources || []).forEach(r => {
      programResources.push({ ...r, programName: p.name, programId: p.id, category: 'Program Resource' });
    });
    (p.sessions || []).forEach(s => {
      (s.resources || []).forEach(r => {
        sessionResources.push({ ...r, programName: p.name, sessionName: s.title, programId: p.id, category: 'Session Resource' });
      });
    });
  });

  const allResources = [...programResources, ...sessionResources];

  // Derive counts
  const totalPrograms = programs.length;
  const totalResources = allResources.length;
  // Mock recently added and last updated for the summary
  const recentlyAdded = Math.min(2, totalResources);
  const lastUpdated = 'Today';

  const getIconForType = (name) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText size={20} color="#EF4444" />;
    if (ext === 'mp4' || ext === 'mov') return <Video size={20} color="#3B82F6" />;
    if (ext === 'ppt' || ext === 'pptx') return <Presentation size={20} color="#F59E0B" />;
    if (ext === 'png' || ext === 'jpg') return <Image size={20} color="#10B981" />;
    return <FileText size={20} color="#8D887E" />;
  };

  const getResourceType = (name) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (ext === 'mp4' || ext === 'mov') return 'Video';
    if (ext === 'ppt' || ext === 'pptx') return 'Slides';
    if (ext === 'png' || ext === 'jpg') return 'Image';
    return 'Document';
  };

  const filteredResources = allResources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.programName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Program Materials') return r.category === 'Program Resource';
    if (activeFilter === 'Session Materials') return r.category === 'Session Resource';
    
    const type = getResourceType(r.name);
    if (activeFilter === 'Documents' && type === 'Document') return true;
    if (activeFilter === 'Slides' && type === 'Slides') return true;
    if (activeFilter === 'Videos' && type === 'Video') return true;
    if (activeFilter === 'Templates') return r.name.toLowerCase().includes('template');

    // If activeFilter doesn't match the derived types directly, return false
    return false;
  });

  const filters = ['All', 'Program Materials', 'Session Materials', 'Documents', 'Slides', 'Videos', 'Templates'];

  // Sort: push newest first (mock: we just take the first as featured if it exists)
  const featuredResource = filteredResources.length > 0 ? filteredResources[0] : null;
  const gridResources = filteredResources.slice(1);

  // Group grid resources by Program Name
  const groupedGridResources = gridResources.reduce((acc, curr) => {
    if (!acc[curr.programName]) acc[curr.programName] = [];
    acc[curr.programName].push(curr);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '3rem', textAlign: 'left', fontFamily: "'Inter', sans-serif", maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#232323', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Resources</h2>
          <p style={{ color: '#5E5A53', fontSize: '15px', marginTop: '0.5rem' }}>
            All teaching materials shared for your assigned programs.
          </p>
        </div>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} color="#8D887E" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', fontSize: '15px',
              backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8',
              borderRadius: '999px', color: '#232323', outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(60,45,20,.03)'
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#C99A2E'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(201,154,46,.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E8E2D8'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(60,45,20,.03)'; }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '999px',
              border: activeFilter === f ? '1px solid #C99A2E' : '1px solid #E8E2D8',
              backgroundColor: activeFilter === f ? '#C99A2E' : '#FCFBF8',
              color: activeFilter === f ? '#FFFFFF' : '#5E5A53',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeFilter === f ? '0 4px 12px rgba(201,154,46,.2)' : '0 2px 8px rgba(60,45,20,.03)'
            }}
            onMouseEnter={e => { if(activeFilter !== f) { e.currentTarget.style.borderColor = '#C99A2E'; e.currentTarget.style.color = '#C99A2E'; } }}
            onMouseLeave={e => { if(activeFilter !== f) { e.currentTarget.style.borderColor = '#E8E2D8'; e.currentTarget.style.color = '#5E5A53'; } }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {filteredResources.length === 0 ? (
            <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 18px 40px rgba(60,45,20,.08)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(201,154,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                📚
              </div>
              <div>
                <h4 style={{ fontSize: '22px', fontWeight: 600, color: '#232323', margin: '0 0 0.5rem 0' }}>Your Resource Library</h4>
                <p style={{ color: '#8D887E', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
                  No materials have been shared yet.<br/>Resources published by your organization will automatically appear here.
                </p>
              </div>
              <button 
                style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #E8E2D8', color: '#5E5A53', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f4f4'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Contact your program administrator.
              </button>
            </div>
          ) : (
            <>
              {/* Featured Resource Hero Card */}
              {featuredResource && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#5E5A53', margin: 0 }}>Featured Resource</h3>
                  <div 
                    style={{ 
                      backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '18px', padding: '2.5rem', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      boxShadow: '0 14px 35px rgba(40,30,15,.06)', transition: 'all 220ms ease'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '16px', backgroundColor: '#F5F2EB', border: '1px solid #E8E2D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getIconForType(featuredResource.name)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#232323', margin: 0 }}>{featuredResource.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#5E5A53', fontSize: '15px' }}>
                          <span style={{ fontWeight: 600, color: '#C99A2E' }}>Program:</span> {featuredResource.programName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#8D887E', fontSize: '14px', marginTop: '0.2rem' }}>
                          <span>Updated Today</span>
                          <span>•</span>
                          <span>{getResourceType(featuredResource.name)}</span>
                          <span>•</span>
                          <span>{featuredResource.size || '3.2 MB'}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        style={{ padding: '0.8rem 1.5rem', backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', color: '#232323', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(60,45,20,.04)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f4f4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FCFBF8'; e.currentTarget.style.transform = 'none'; }}
                        onClick={() => alert(`Opening: ${featuredResource.name}`)}
                      >
                        <Eye size={18} /> Open
                      </button>
                      <button 
                        style={{ padding: '0.8rem 1.5rem', backgroundColor: '#C99A2E', border: 'none', color: '#fff', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(201,154,46,.2)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D7AE4F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C99A2E'; e.currentTarget.style.transform = 'none'; }}
                        onClick={() => alert(`Downloading: ${featuredResource.name}`)}
                      >
                        <Download size={18} /> Download
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Resource Grid Grouped by Program */}
              {Object.entries(groupedGridResources).map(([programName, resources]) => (
                <div key={programName} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Folder size={20} color="#5E5A53" />
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#232323', margin: 0 }}>{programName}</h3>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {resources.map((res, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '18px', padding: '1.5rem', 
                          display: 'flex', flexDirection: 'column', gap: '1.25rem', 
                          boxShadow: '0 14px 35px rgba(40,30,15,.06)', transition: 'all 220ms ease', cursor: 'pointer'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 18px 45px rgba(40,30,15,.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(40,30,15,.06)'; }}
                        onClick={() => alert(`Opening: ${res.name}`)}
                      >
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F5F2EB', border: '1px solid #E8E2D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {getIconForType(res.name)}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#232323', margin: 0, lineHeight: 1.3 }}>{res.name}</h4>
                            <span style={{ fontSize: '13px', color: '#C99A2E', fontWeight: 600 }}>{res.category}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E8E2D8', paddingTop: '1.25rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '13px', color: '#5E5A53' }}>Updated {i === 0 ? 'Yesterday' : 'Last Week'}</span>
                            <span style={{ fontSize: '13px', color: '#8D887E' }}>{getResourceType(res.name)} • {res.size || '2.3 MB'}</span>
                          </div>
                          <button 
                            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #E8E2D8', color: '#232323', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f4f4'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

        </div>

        {/* Sidebar Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          <div style={{ backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '20px', padding: '2rem', boxShadow: '0 14px 35px rgba(40,30,15,.06)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#232323', margin: '0 0 1.5rem 0' }}>Library Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#5E5A53', fontSize: '15px' }}>Programs</span>
                <span style={{ color: '#232323', fontSize: '16px', fontWeight: 600 }}>{totalPrograms}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#5E5A53', fontSize: '15px' }}>Resources</span>
                <span style={{ color: '#232323', fontSize: '16px', fontWeight: 600 }}>{totalResources}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#5E5A53', fontSize: '15px' }}>Recently Added</span>
                <span style={{ color: '#232323', fontSize: '16px', fontWeight: 600 }}>{recentlyAdded}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#5E5A53', fontSize: '15px' }}>Last Updated</span>
                <span style={{ color: '#C99A2E', fontSize: '15px', fontWeight: 600 }}>{lastUpdated}</span>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', borderRadius: '16px', border: '1px dashed #E8E2D8', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#232323', margin: 0 }}>Need help?</h4>
            <a href="#" style={{ fontSize: '14px', color: '#C99A2E', textDecoration: 'none', fontWeight: 500 }}>Contact Program Administrator</a>
          </div>
        </div>

      </div>
    </div>
  );
};


function ResourcesTab({ programs = [], addNotification, currentUser }) {
  const [search, setSearch] = useState('');
  const [selectedProgId, setSelectedProgId] = useState('');
  const [fileName, setFileName] = useState('');

  const canUploadResources = currentUser?.permissions?.includes('upload_resources');

  // Extract and flat map all resources for search
  const programResources = [];
  const sessionResources = [];

  programs.forEach(p => {
    (p.resources || []).forEach(r => {
      programResources.push({ ...r, programName: p.name, programId: p.id });
    });
    (p.sessions || []).forEach(s => {
      (s.resources || []).forEach(r => {
        sessionResources.push({ ...r, programName: p.name, sessionName: s.title, programId: p.id });
      });
    });
  });

  const matchesSearch = (text) => text?.toLowerCase().includes(search.toLowerCase());

  const filteredProgramResources = programResources.filter(r => matchesSearch(r.name) || matchesSearch(r.programName));
  const filteredSessionResources = sessionResources.filter(r => matchesSearch(r.name) || matchesSearch(r.sessionName) || matchesSearch(r.programName));

  const hasAnyResources = programResources.length > 0 || sessionResources.length > 0;
  const hasSearchResults = filteredProgramResources.length > 0 || filteredSessionResources.length > 0;

  // Grouping helpers
  const groupedProgramResources = filteredProgramResources.reduce((acc, curr) => {
    if (!acc[curr.programName]) acc[curr.programName] = [];
    acc[curr.programName].push(curr);
    return acc;
  }, {});

  const groupedSessionResources = filteredSessionResources.reduce((acc, curr) => {
    const key = `${curr.programName} - ${curr.sessionName}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const handleUpload = (e) => {
    e.preventDefault();
    if (!fileName.trim() || !selectedProgId) return;

    addNotification(`Resource "${fileName}" uploaded to program`);
    alert(`Resource file "${fileName}" successfully uploaded.`);
    setFileName('');
  };

  if (currentUser?.role === 'Facilitator') {
    return <FacilitatorResourcesView programs={programs} />;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Resources</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Find all materials shared for your assigned programs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: canUploadResources ? '1.6fr 1fr' : '1fr', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          {!hasAnyResources && !search ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📁</div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>No resources have been shared yet.</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
                Your organization hasn't shared any materials for your assigned programs. Resources will appear here automatically when they're published.
              </p>
            </div>
          ) : !hasSearchResults && search ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', backgroundColor: '#0e0f14', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                No resources match "{search}".
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Program Resources */}
              {Object.keys(groupedProgramResources).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F5D76E', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    Program Resources
                  </h3>
                  
                  {Object.entries(groupedProgramResources).map(([progName, resList]) => (
                    <div key={progName} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        <span style={{ color: '#3b82f6' }}>📁</span> {progName}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1.5rem' }}>
                        {resList.map((res, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <span>📄</span>
                              <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>{res.name}</span>
                            </div>
                            <button 
                              onClick={() => alert(`Downloading: ${res.name}...`)}
                              style={{ backgroundColor: 'transparent', border: 'none', color: '#F5D76E', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Session Resources */}
              {Object.keys(groupedSessionResources).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    Session Resources
                  </h3>
                  
                  {Object.entries(groupedSessionResources).map(([groupName, resList]) => (
                    <div key={groupName} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        <span style={{ color: '#a855f7' }}>📁</span> {groupName}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1.5rem' }}>
                        {resList.map((res, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <span>📄</span>
                              <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>{res.name}</span>
                            </div>
                            <button 
                              onClick={() => alert(`Downloading: ${res.name}...`)}
                              style={{ backgroundColor: 'transparent', border: 'none', color: '#F5D76E', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {canUploadResources && (
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
        )}

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
