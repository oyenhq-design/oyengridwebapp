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
  Play, Zap, Plus, X, File, ClipboardCheck, MessageCircle, Send, Paperclip, CheckCheck, Mic
} from 'lucide-react';
import {
  buildWorkspaceConversations,
  mergeConversations,
  createMessage,
  getOtherParticipant,
  MESSAGE_TYPE,
  MESSAGE_STATUS,
} from './services/chatService';
import { simulateReply } from './services/chatSimulation';
import SessionDetail from './components/SessionDetail';
import { getProgramsForUser, getSessionsForUser, getLearnersForUser, getInboxForUser, getResourcesForUser, isRoleAdmin, isRoleFacilitator, isRoleProgramManager, isRoleTeamMember, isRoleViewer } from './domain/workspace/selectors';
import { updateSessionStatus } from './domain/workspace/actions';
import FacilitatorOverview from './pages/facilitator/FacilitatorOverview';
import TeamMemberOverview from './pages/owner/TeamMemberOverview';
import ViewerOverview from './pages/viewer/ViewerOverview';
import InboxTab from './components/InboxTab';
import OrgRegistrationForm from './components/OrgRegistrationForm';
import PublicEventForm from './components/PublicEventForm';
import SignInForm from './components/SignInForm';
import ProgramManagerModule from './modules/program-manager';
import CommandCentreModule from './modules/command-centre';
import GlobalChat from './components/chat/GlobalChat';
import TeamManagement from './components/TeamManagement';
import ProgramsTab from './components/ProgramsTab';
import LearnersTab from './components/LearnersTab';
import AdminSidebar from './components/admin/AdminSidebar';
import FacilitatorSidebar from './components/facilitator/FacilitatorSidebar';
import AdminSessions from './components/admin/AdminSessions';
import FacilitatorSessions from './components/facilitator/FacilitatorSessions';
import FacilitatorDashboard from './components/facilitator/FacilitatorDashboard';
import FacilitatorResources from './components/facilitator/FacilitatorResources';
import FacilitatorNotifications from './components/facilitator/FacilitatorNotifications';
import FacilitatorProfile from './components/facilitator/FacilitatorProfile';
import oyenLogo from './assets/logo_v2.png';
import onboardingBg from './assets/onboarding_bg_v2.png';
import dashboardHeroIllustration from './assets/dashboard_hero_illustration.jpg';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import BrandingTab from './components/BrandingTab';
import RolesTab from './components/RolesTab';
import NotificationsSettingsTab from './components/NotificationsSettingsTab';
import IntegrationsTab from './components/IntegrationsTab';
import GeneralSettingsTab from './components/GeneralSettingsTab';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isLoggingOutRef = useRef(false);

  // Shared workspace data â€” lifted so Programs + Learners stay in sync
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

  const assignedSessions = useMemo(() => {
    if (userRole !== 'Facilitator' || !user) return [];
    const list = [];
    wsPrograms.forEach(prog => {
      if (prog.sessions && Array.isArray(prog.sessions)) {
        prog.sessions.forEach(sess => {
          if ((sess.facilitatorEmail || '').toLowerCase().trim() === user.toLowerCase().trim()) {
            list.push({ ...sess, programName: prog.name, programId: prog.id });
          }
        });
      }
    });
    return list;
  }, [wsPrograms, user, userRole]);

  // â”€â”€ Workspace Chat System â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Core state â€” architecture-first naming (not drawer-specific)
  const [isChatOpen,          setIsChatOpen]          = useState(false);
  const [conversations,       setConversations]       = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messageInput,        setMessageInput]        = useState('');
  const [chatSearch,          setChatSearch]          = useState('');

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('oyen_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Sync conversations whenever wsTeam or workspace metadata changes.
  // mergeConversations preserves existing message history â€” welcome messages are seeded once.
  useEffect(() => {
    if (!orgName) return;
    
    // Ensure the active facilitator or program manager is included in the conversation generation if logged in
    const teamWithFacilitator = [...(wsTeam || [])];
    const loggedInEmail = user?.trim().toLowerCase();
    if (user && (userRole === 'Facilitator' || userRole === 'FacilitatorRole')) {
      const exists = teamWithFacilitator.some(m => m.email?.toLowerCase() === loggedInEmail);
      if (!exists) {
        teamWithFacilitator.push({
          name: user.split('@')[0].toUpperCase(),
          role: 'Facilitator',
          email: user,
          online: true
        });
      }
    } else if (user && (userRole === 'Program Manager' || userRole === 'Programme Manager' || userRole === 'ProgramManager')) {
      const exists = teamWithFacilitator.some(m => m.email?.toLowerCase() === loggedInEmail);
      if (!exists) {
        teamWithFacilitator.push({
          name: user.split('@')[0].toUpperCase(),
          role: 'Program Manager',
          email: user,
          online: true
        });
      }
    }

    const generated = buildWorkspaceConversations(teamWithFacilitator, orgName, ownerEmail || 'admin@oyengrid.com');
    setConversations(prev => mergeConversations(prev, generated));
  }, [wsTeam, orgName, ownerEmail, user, userRole]);

  // â”€ Computed views â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Role-filtered list of conversations visible to the current user.
  const visibleConversations = useMemo(() => {
    const currentEmail = user?.trim().toLowerCase() || '';
    
    if (userRole === 'Facilitator') {
      return conversations.filter(c =>
        c.participants.some(p => p.userId.toLowerCase() === currentEmail)
      );
    }
    if (userRole === 'Program Manager' || userRole === 'Programme Manager' || userRole === 'ProgramManager') {
      return conversations.filter(c =>
        c.participants.some(p => p.userId.toLowerCase() === currentEmail)
      );
    }
    if (userRole === 'Workspace Super Admin' || userRole === 'Admin') {
      const adminId = (ownerEmail || 'admin@oyengrid.com').trim().toLowerCase();
      return conversations.filter(c =>
        c.participants.some(p => p.userId.toLowerCase() === adminId)
      );
    }
    return [];
  }, [conversations, userRole, user, ownerEmail]);

  // Search — Search by peer name, role, email, or message history
  const filteredConversations = useMemo(() => {
    if (!chatSearch.trim()) return visibleConversations;
    const q = chatSearch.toLowerCase();
    const selfId = (userRole === 'Facilitator' || userRole === 'Program Manager' || userRole === 'Programme Manager' || userRole === 'ProgramManager') ? user : (ownerEmail || 'admin@oyengrid.com');

    return visibleConversations.filter(c => {
      const peer = c.participants.find(p => p.userId.toLowerCase() !== selfId.toLowerCase()) || c.participants[0];
      return (
        peer.name.toLowerCase().includes(q) ||
        peer.role.toLowerCase().includes(q) ||
        (peer.email || '').toLowerCase().includes(q) ||
        c.messages.some(m => m.text.toLowerCase().includes(q))
      );
    });
  }, [visibleConversations, chatSearch, userRole, user, ownerEmail]);

  const displayPrograms = getProgramsForUser(user, userRole, wsPrograms);
  const displaySessions = getSessionsForUser(user, userRole, wsPrograms);
  const displayLearners = getLearnersForUser(user, userRole, wsLearners, wsPrograms);
  const displayInbox = getInboxForUser(user, userRole, wsPrograms);
  const displayResources = getResourcesForUser(user, userRole, wsPrograms);



  const activeConversation = useMemo(
    () => conversations.find(c => c.conversationId === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  // Derived: the participant the current user is talking to in the active conversation
  const activePeer = useMemo(() => {
    if (!activeConversation) return null;
    const selfId = (userRole === 'Facilitator' || userRole === 'Program Manager' || userRole === 'Programme Manager' || userRole === 'ProgramManager') ? user : (ownerEmail || 'admin@oyengrid.com');
    return getOtherParticipant(activeConversation, selfId);
  }, [activeConversation, userRole, user, ownerEmail]);

  // â”€â”€ BroadcastChannel for Real-Time Chat Across Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const chatStateRef = useRef({ isChatOpen, activeConversationId });
  useEffect(() => {
    chatStateRef.current = { isChatOpen, activeConversationId };
  }, [isChatOpen, activeConversationId]);

  useEffect(() => {
    const channel = new BroadcastChannel('oyen_workspace_chat');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'NEW_MESSAGE') {
        const { conversationId, message } = payload;
        setConversations(prev => prev.map(c => {
          if (c.conversationId !== conversationId) return c;
          if (c.messages.some(m => m.messageId === message.messageId)) return c;
          
          const updated = [...c.messages, message];
          const { isChatOpen: open, activeConversationId: activeId } = chatStateRef.current;
          const isViewed = open && activeId === conversationId;
          
          return {
            ...c,
            messages: updated,
            lastMessage: message,
            lastActivity: Date.now(),
            updatedAt: Date.now(),
            unreadCount: isViewed ? 0 : (c.unreadCount || 0) + 1,
          };
        }));
      } else if (type === 'TYPING') {
        setConversations(prev => prev.map(c =>
          c.conversationId === payload.conversationId
            ? { ...c, typing: { ...c.typing, isTyping: payload.isTyping } }
            : c
        ));
      }
    };
    return () => channel.close();
  }, []);

  // â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Helper: append a message to a conversation and update lastMessage + lastActivity
  const appendMessage = (conversationId, message) => {
    setConversations(prev => prev.map(c => {
      if (c.conversationId !== conversationId) return c;
      const updated = [...c.messages, message];
      return {
        ...c,
        messages:     updated,
        lastMessage:  message,
        lastActivity: Date.now(),
        updatedAt:    Date.now(),
      };
    }));
  };

  // Helper: set typing state on a conversation
  const setConversationTyping = (conversationId, isTyping) => {
    setConversations(prev => prev.map(c =>
      c.conversationId === conversationId
        ? { ...c, typing: { ...c.typing, isTyping } }
        : c
    ));
  };

  // Helper: mark conversation as read (reset unreadCount)
  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(c =>
      c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c
    ));
  };

  // Open chat drawer â€” Facilitators auto-open into their only conversation
  const openChat = () => {
    setIsChatOpen(true);
    if (userRole === 'Facilitator' && visibleConversations.length === 1) {
      setActiveConversationId(visibleConversations[0].conversationId);
      markAsRead(visibleConversations[0].conversationId);
    } else {
      setActiveConversationId(null);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setActiveConversationId(null);
    setChatSearch('');
  };

  const openConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    markAsRead(conversationId);
  };

  // Send a message â€” appends to state, then fires simulation from isolated service
  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId || !activeConversation) return;

    const selfId = (userRole === 'Facilitator' || userRole === 'Program Manager' || userRole === 'Programme Manager' || userRole === 'ProgramManager') ? user : (ownerEmail || 'admin@oyengrid.com');
    const peerId = activePeer?.userId || 'other';

    const outMsg = createMessage({
      conversationId: activeConversationId,
      senderId:       selfId,
      receiverId:     peerId,
      senderRole:     userRole,
      messageType:    MESSAGE_TYPE.TEXT,
      text:           messageInput,
      status:         MESSAGE_STATUS.SENT,
    });

    appendMessage(activeConversationId, outMsg);
    setMessageInput('');

    // Broadcast message to other tabs in real-time
    const channel = new BroadcastChannel('oyen_workspace_chat');
    channel.postMessage({
      type: 'NEW_MESSAGE',
      payload: { conversationId: activeConversationId, message: outMsg }
    });
    channel.close();

    // Isolated simulation â€” disabled for real-time conversation across tabs
    // simulateReply(activeConversation, userRole, {
    //   onTyping: (isTyping) => setConversationTyping(activeConversationId, isTyping),
    //   onReply:  (replyMsg) => appendMessage(activeConversationId, replyMsg),
    // });
  };

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
      if (e.key === 'oyen_conversations' && e.newValue) {
        setConversations(JSON.parse(e.newValue));
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
      'facilitator@oyengrid.test',
      'oyengroupp@gmail.com'
    ];
    if (
      isRoleAdmin(userRole) || 
      currentEmail === 'admin@oyengrid.com' || 
      currentEmail === ownerEmail?.trim().toLowerCase() ||
      demoEmails.includes(currentEmail)
    ) {
      return;
    }
    
    const member = wsTeam.find(m => m.email && m.email.trim().toLowerCase() === currentEmail);
    
    // Invalidation check (only if explicitly suspended/inactive)
    const isInvalid = member && (member.status === 'Suspended' || member.status === 'Inactive');
                      
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
    } else if (member && member.role && member.role !== userRole) {
      setUserRole(member.role);
      addNotification(`Your role has been updated to ${member.role}`);
      if (isRoleFacilitator(member.role) || isRoleTeamMember(member.role) || isRoleViewer(member.role)) {
        setActiveTab('Overview');
      } else {
        setActiveTab('Dashboard');
      }
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
  const [showSetupGuideModal, setShowSetupGuideModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [facilitatorNotifications, setFacilitatorNotifications] = useState([]);

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



  const [ownerTimezone, setOwnerTimezone] = useState('Africa/Lagos');
  const [ownerLanguage, setOwnerLanguage] = useState('English');
  const [ownerEmailNotifs, setOwnerEmailNotifs] = useState(true);
  const [ownerDesktopNotifs, setOwnerDesktopNotifs] = useState(false);

  const getLoggedInUserInfo = () => {
    if (!user) {
      return {
        fullName: 'Guest User',
        initials: 'GU',
        role: 'Guest',
        email: '',
        photo: null,
        phone: '',
        jobTitle: '',
        timezone: 'Africa/Lagos',
        language: 'English',
        emailNotifs: true,
        desktopNotifs: false,
      };
    }
    if (user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com') {
      return {
        fullName: `${ownerFirstName} ${ownerLastName}`,
        initials: `${ownerFirstName?.[0] || 'J'}${ownerLastName?.[0] || 'D'}`,
        role: userRole || 'Admin',
        email: user,
        photo: ownerPhoto,
        phone: ownerPhone,
        jobTitle: ownerTitle,
        timezone: ownerTimezone,
        language: ownerLanguage,
        emailNotifs: ownerEmailNotifs,
        desktopNotifs: ownerDesktopNotifs,
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
        photo: member.photo || null,
        phone: member.phone || '',
        jobTitle: member.jobTitle || '',
        timezone: member.timezone || 'Africa/Lagos',
        language: member.language || 'English',
        emailNotifs: member.emailNotifs !== undefined ? member.emailNotifs : true,
        desktopNotifs: member.desktopNotifs !== undefined ? member.desktopNotifs : false,
      };
    }
    return {
      fullName: user.split('@')[0],
      initials: (user?.[0] || 'U').toUpperCase(),
      role: userRole || 'Workspace Facilitator',
      email: user,
      photo: null,
      phone: '',
      jobTitle: '',
      timezone: 'Africa/Lagos',
      language: 'English',
      emailNotifs: true,
      desktopNotifs: false,
    };
  };

  // Helper to push a notification globally
  const addNotification = (text) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' Â· ' + today;
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
      items.push({ name: l.name, type: 'Participant', detail: l.email, tab: 'Participants' });
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

  useEffect(() => {
    if (user && wsTeam.length > 0) {
      const isOwner = user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com' || isRoleAdmin(userRole);
      if (!isOwner) {
        const currentUserInTeam = wsTeam.find(m => m.email?.toLowerCase() === user.toLowerCase());
        if (currentUserInTeam && currentUserInTeam.role && currentUserInTeam.role !== userRole) {
          setUserRole(currentUserInTeam.role);
          addNotification(`Your role has been updated to ${currentUserInTeam.role}`);
          if (isRoleFacilitator(currentUserInTeam.role) || isRoleTeamMember(currentUserInTeam.role) || isRoleViewer(currentUserInTeam.role)) {
            setActiveTab('Overview');
          } else {
            setActiveTab('Dashboard');
          }
        }
      }
    }
  }, [wsTeam, user, userRole, ownerEmail]);

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

    if (email.toLowerCase() === 'oyengroupp@gmail.com') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const seed = [
        {
          id: 'prog-1',
          name: 'Renewable Power Architecture',
          assignedFacilitators: ['oyengroupp@gmail.com'],
          sessions: [
            {
              id: 'sess-2',
              title: 'Battery Storage Systems Simulation',
              facilitatorEmail: 'oyengroupp@gmail.com',
              date: tomorrowStr,
              time: '10:00 AM - 11:30 AM',
              type: 'Lab Workshop',
              status: 'Upcoming',
              learnersCount: '24 Learners'
            },
            {
              id: 'sess-3',
              title: 'Introduction to Photovoltaic Microgrids',
              facilitatorEmail: 'oyengroupp@gmail.com',
              date: tomorrowStr,
              time: '1:00 PM - 2:30 PM',
              type: 'Live Class',
              status: 'Upcoming',
              learnersCount: '18 Learners'
            }
          ]
        }
      ];
      setWsPrograms(seed);
    }

    triggerTransition(() => {
      setUser(email);
      setUserRole(role);
      setActiveRoute('dashboard');
      setActiveTab((isRoleFacilitator(role) || isRoleTeamMember(role) || isRoleViewer(role)) ? 'Overview' : 'Dashboard');
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

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Page Transition Helper ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
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

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Page Transition Overlay (every button click) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬




  // Phase 1: Command Centre Routing interception
  if (window.location.pathname.startsWith('/command-centre')) {
    return <CommandCentreModule />;
  }

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
          </div>

          {/* STEP 1: Premium Organization Profile */}
          {onboardingStep === 1 && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem' }}>
              
              {/* Form Side */}
              <div>
                <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 1 of 5 ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Organization Profile</span>
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>Step 2 of 5 ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Admin</span>
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
                      placeholder="ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢"
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
                      placeholder="ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢"
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
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>âœ“</span> Up to 50 Participants</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>âœ“</span> 3 Active Programmes</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>âœ“</span> Basic AI</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>âœ“</span> 10GB Storage</li>
                    <li><span style={{ color: '#D4AF37', marginRight: '0.4rem', fontWeight: 'bold' }}>âœ“</span> Invite Team Members Later</li>
                  </ul>
                </div>
              </div>
            </div>
          )}



        </div>
      </div>
    );
  }


  // Render Dashboard Workspace Preview if Logged In
  if (activeRoute === 'dashboard') {
    const currentUser = user || 'admin@oyengrid.com';
    const currentRole = userRole || 'Workspace Super Admin';
    if (userRole === 'Program Manager' || userRole === 'Programme Manager' || userRole === 'ProgramManager') {
      return (
        <>
          <ProgramManagerModule 
            user={user} 
            role={userRole} 
            workspaceName={orgName}
            wsPrograms={wsPrograms}
            setWsPrograms={setWsPrograms}
            wsLearners={wsLearners}
            wsTeam={wsTeam}
            wsInvitations={wsInvitations}
            notifications={[]}
            recentUpdates={[]}
            onLogout={() => {
              setUser(null);
              setUserRole(null);
              setActiveRoute('signin');
            }}
          />
          <GlobalChat
            userRole={userRole}
            user={user}
            ownerEmail={ownerEmail}
            isChatOpen={isChatOpen}
            openChat={openChat}
            closeChat={closeChat}
            visibleConversations={visibleConversations}
            filteredConversations={filteredConversations}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            activeConversation={activeConversation}
            activePeer={activePeer}
            chatSearch={chatSearch}
            setChatSearch={setChatSearch}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            sendMessage={sendMessage}
            openConversation={openConversation}
          />
        </>
      );
    }

    const isWelcome = activeTab === 'Welcome' || activeTab === 'Dashboard' || activeTab === 'Overview';
    const showFacilitatorOverview = isRoleFacilitator(userRole) && isWelcome;
    const showTeamMemberOverview = isRoleTeamMember(userRole) && isWelcome;
    const showViewerOverview = isRoleViewer(userRole) && isWelcome;

    const allSidebarItems = [
      { id: 'Welcome', label: 'Welcome', icon: <Home size={18} /> },
      { id: 'Getting Started', label: 'Getting Started', icon: <Clock size={18} /> },
      { id: 'Your Workspace', label: 'Your Workspace', icon: <Grid size={18} /> },
      { id: 'Team', label: 'Team', icon: <Users size={18} /> },
      { id: 'Programmes', label: 'Programmes', icon: <BookOpen size={18} /> },
      { id: 'Participants', label: 'Participants', icon: <UserCheck size={18} /> },
      { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
      { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
      { id: 'Settings', label: 'Settings', icon: <Settings size={18} /> }
    ];

    let sidebarItems = allSidebarItems;
    if (isRoleFacilitator(userRole)) {
      sidebarItems = [
        { id: 'Overview', label: 'Dashboard', icon: <Home size={18} /> },
        { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
        { id: 'Resources', label: 'Resources', icon: <BookOpen size={18} /> },
        { id: 'Notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
      ];
    } else if (isRoleProgramManager(userRole)) {
      sidebarItems = [
        { id: 'Welcome', label: 'Welcome', icon: <Home size={18} /> },
        { id: 'Your Workspace', label: 'Your Workspace', icon: <Grid size={18} /> },
        { id: 'Programmes', label: 'Programmes', icon: <BookOpen size={18} /> },
        { id: 'Participants', label: 'Participants', icon: <UserCheck size={18} /> },
        { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
        { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
        { id: 'Settings', label: 'Settings', icon: <Settings size={18} /> }
      ];
    } else if (isRoleTeamMember(userRole)) {
      sidebarItems = [
        { id: 'Overview', label: 'Overview', icon: <Home size={18} /> },
        { id: 'Assigned Programs', label: 'Assigned Programs', icon: <BookOpen size={18} /> },
        { id: 'Participants', label: 'Participants', icon: <UserCheck size={18} /> },
        { id: 'Sessions', label: 'Sessions', icon: <Calendar size={18} /> },
        { id: 'Resources', label: 'Resources', icon: <Grid size={18} /> },
        { id: 'Announcements', label: 'Announcements', icon: <Bell size={18} /> },
        { id: 'Certificates', label: 'Certificates', icon: <Award size={18} /> },
        { id: 'Reports', label: 'Reports', icon: <BarChart3 size={18} /> },
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
      ];
    } else if (isRoleViewer(userRole)) {
      sidebarItems = [
        { id: 'Overview', label: 'Dashboard', icon: <Home size={18} /> },
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> }
      ];
    }

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
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
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
            

            {/* Persistent Search Bar */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${searchQuery ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px', padding: '0.42rem 0.75rem', width: '240px', gap: '0.5rem',
                  transition: 'border-color 0.2s ease', cursor: 'text',
                  boxShadow: searchQuery ? '0 0 0 3px rgba(212,175,55,0.07)' : 'none'
                }}
                onClick={() => document.getElementById('nav-search-input').focus()}
              >
                <Search size={14} color="rgba(255,255,255,0.35)" style={{ flexShrink: 0 }} />
                <input
                  id="nav-search-input"
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchExpanded(true)}
                  onBlur={() => setTimeout(() => { setSearchExpanded(false); }, 150)}
                  onKeyDown={(e) => { if (e.key === 'Escape') { setSearchQuery(''); setSearchExpanded(false); } }}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.82rem', outline: 'none', width: '100%', padding: 0, caretColor: '#D4AF37' }}
                />
                {searchQuery ? (
                  <button
                    onMouseDown={(e) => { e.preventDefault(); setSearchQuery(''); setSearchExpanded(false); }}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', fontSize: '0.85rem', lineHeight: 1 }}
                  >✕</button>
                ) : (
                  <kbd style={{ display: 'flex', alignItems: 'center', padding: '0.1rem 0.4rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.38)', fontFamily: 'inherit', flexShrink: 0 }}>⌘K</kbd>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchExpanded && searchQuery.trim() && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '320px', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', boxShadow: '0 16px 48px rgba(0,0,0,0.65)', zIndex: 1200, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', padding: '0.65rem 1rem 0.45rem 1rem', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    Results
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {searchResults.length > 0 ? (
                      searchResults.slice(0, 8).map((item, idx) => (
                        <div
                          key={idx}
                          onMouseDown={() => {
                            if (item.tab) triggerTransition(() => setActiveTab(item.tab));
                            else if (item.type === 'Team Member') triggerTransition(() => setActiveTab('Team'));
                            else if (item.type === 'Program') triggerTransition(() => setActiveTab('Programmes'));
                            setSearchQuery(''); setSearchExpanded(false);
                          }}
                          style={{ padding: '0.65rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.025)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Search size={12} color="#D4AF37" />
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
                          </div>
                          <span style={{ fontSize: '0.63rem', fontWeight: 700, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', padding: '0.13rem 0.45rem', borderRadius: '4px', flexShrink: 0 }}>{item.type}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        No results for "{searchQuery}"
                      </div>
                    )}
                  </div>
                  {searchResults.length > 8 && (
                    <div style={{ padding: '0.55rem 1rem', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                      +{searchResults.length - 8} more results
                    </div>
                  )}
                </div>
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
            width: isSidebarOpen ? '260px' : '0px',
            overflow: 'hidden',
            opacity: isSidebarOpen ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#151515',
            borderRight: '1px solid #252525',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isSidebarOpen ? '1.5rem 0.5rem' : '1.5rem 0',
            flexShrink: 0
          }}>
            {/* Navigation links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {isRoleFacilitator(userRole) ? (
                <FacilitatorSidebar 
                  activeTab={activeTab} 
                  onTabSelect={(tab) => triggerTransition(() => setActiveTab(tab))} 
                  isWelcome={isWelcome} 
                />
              ) : (
                <AdminSidebar 
                  activeTab={activeTab} 
                  onTabSelect={(tab) => triggerTransition(() => setActiveTab(tab))} 
                  isWelcome={isWelcome} 
                />
              )}
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
            {isRoleFacilitator(userRole) ? (
              activeSession ? (
                <SessionDetail 
                  session={activeSession}
                  onBack={() => setActiveSession(null)}
                  addNotification={addNotification}
                  onUpdateStatus={(newStatus) => {
                    setWsPrograms(prev => {
                      const next = updateSessionStatus(prev, activeSession.programId, activeSession.id, newStatus);
                      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
                      return next;
                    });
                  }}
                  learners={wsLearners.filter(l => l.program === activeSession.programName)}
                  programResources={wsPrograms.find(p => p.id === activeSession.programId)?.resources || []}
                  sessionResources={activeSession.resources || []}
                />
              ) : (activeTab === 'Overview' || activeTab === 'Dashboard' || activeTab === 'Welcome') ? (
                <FacilitatorDashboard
                  assignedSessions={assignedSessions}
                  assignedResources={displayResources}
                  programs={displayPrograms}
                  currentUserEmail={user}
                  userInfo={getLoggedInUserInfo()}
                  onNavigate={setActiveTab}
                  onOpenChatDrawer={openChat}
                  onSelectSession={(s) => {
                    setActiveSession(s);
                    setActiveTab('Sessions');
                  }}
                />
              ) : activeTab === 'Sessions' ? (
                <FacilitatorSessions
                  programs={displayPrograms}
                  setPrograms={setWsPrograms}
                  learners={wsLearners}
                  addNotification={addNotification}
                  currentUserEmail={user}
                />
              ) : activeTab === 'Resources' ? (
                <FacilitatorResources 
                  assignedSessions={displaySessions}
                  currentUserEmail={user}
                />
              ) : activeTab === 'Notifications' ? (
                <FacilitatorNotifications 
                  notifications={facilitatorNotifications}
                  setNotifications={setFacilitatorNotifications}
                />
              ) : activeTab === 'Profile' ? (
                <FacilitatorProfile 
                  userInfo={getLoggedInUserInfo()} 
                  assignedSessions={displaySessions}
                  assignedResources={displayResources}
                  onUpdateProfile={(updates) => {
                    setWsTeam(prev => prev.map(m => {
                      if (m.email.toLowerCase() === user.toLowerCase()) {
                        return { 
                          ...m, 
                          name: updates.fullName || m.name, 
                          phone: updates.phone || m.phone,
                          location: updates.location || m.location,
                          bio: updates.bio || m.bio,
                          timezone: updates.timezone || m.timezone
                        };
                      }
                      return m;
                    }));
                  }}
                />
              ) : (
                <FacilitatorDashboard
                  assignedSessions={assignedSessions}
                  assignedResources={displayResources}
                  programs={displayPrograms}
                  currentUserEmail={user}
                  userInfo={getLoggedInUserInfo()}
                  onNavigate={setActiveTab}
                  onOpenChatDrawer={openChat}
                  onSelectSession={(s) => {
                    setActiveSession(s);
                    setActiveTab('Sessions');
                  }}
                />
              )
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem 3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
                
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
              </div>
            ) : activeTab === 'Team' ? (
              /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Team Management Component ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
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
                setActiveTab={setActiveTab}
                triggerTransition={triggerTransition}
              />
            ) : (activeTab === 'Participants' || activeTab === 'Participants') ? (
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
              userRole === 'Facilitator' ? (
                <FacilitatorSessions
                  programs={displayPrograms}
                  setPrograms={setWsPrograms}
                  learners={wsLearners}
                  addNotification={addNotification}
                  currentUserEmail={user}
                />
              ) : (
                <AdminSessions
                  programs={displayPrograms}
                  setPrograms={setWsPrograms}
                  learners={wsLearners}
                  addNotification={addNotification}
                  onNavigateToPrograms={() => triggerTransition(() => setActiveTab('Programmes'))}
                  userRole={userRole}
                  onSelectSession={setActiveSession}
                  teamMembers={wsTeam}
                  currentUserEmail={user}
                />
              )
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
                        { label: 'Participants', value: `${wsLearners.length} / 50 Enrolled`, pct: (wsLearners.length / 50) * 100, barColor: 'linear-gradient(90deg, #22c55e, #16a34a)', icon: <Users size={20} color="#22c55e" /> },
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
                              { title: 'Branding', desc: 'Manage your logo and organization profile.', tab: 'Branding' },
                              { title: 'Roles & Permissions', desc: 'Control workspace access and user roles.', tab: 'Roles' },
                              { title: 'General Settings', desc: 'Configure default settings, languages, and regional rules.', tab: 'GeneralSettings' },
                              { title: 'Integrations', desc: 'Connect external services and applications.', tab: 'Integrations' },
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
                                    Activity from programmes, participants, sessions, and workspace updates will appear here once you begin using OYEN GRID.
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
                              { label: 'Participants Enrolled', value: `${wsLearners.length} / 50`, pct: (wsLearners.length / 50) * 100, barColor: '#22c55e' },
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
              /* â”€â”€ Getting Started Onboarding Page â”€â”€ */
              (() => {
                const setupSteps = [
                  { id: 1, label: 'Workspace Created', desc: 'Your OYEN GRID workspace has been successfully provisioned.', done: true, tab: null },
                  { id: 2, label: 'Organization Profile Completed', desc: 'Your organization name, logo, and details have been saved.', done: !!(orgLogo || orgName), tab: null },
                  { id: 3, label: 'Invite Team Members', desc: 'Add administrators and facilitators to collaborate in your workspace.', done: wsTeam.length > 0, tab: 'Team' },
                  { id: 4, label: 'Configure Roles & Permissions', desc: 'Set up access levels to control what each team member can do.', done: false, tab: 'Settings' },
                  { id: 5, label: 'Create Your First Programme', desc: 'Programmes are the foundation of your workspace learning structure.', done: displayPrograms.length > 0, tab: 'Programmes' },
                  { id: 6, label: 'Add Participants', desc: 'Enroll participants into your programmes to begin their journey.', done: wsLearners.length > 0, tab: 'Participants' },
                  { id: 7, label: 'Schedule Your First Session', desc: 'Create a live session or workshop inside one of your programmes.', done: false, tab: 'Sessions' },
                  { id: 8, label: 'Configure Notifications', desc: 'Set up email and in-app notifications to keep your team updated.', done: false, tab: 'Settings' },
                  { id: 9, label: 'Generate Test Certificate', desc: 'Preview and test your certificate template before launch.', done: false, tab: 'Certificates' },
                  { id: 10, label: 'Launch Your First Programme', desc: 'Make your programme live and start enrolling participants at scale.', done: false, tab: 'Programmes' },
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
                          <button onClick={() => triggerTransition(() => setActiveTab('Team'))} style={{ background: '#F5C84C', border: '1px solid #F5C84C', color: '#151515', fontFamily: "'Inter', sans-serif", fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,200,76,0.25)', transition: 'all 0.2s ease', fontSize: '0.9rem' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>Continue Setup <ArrowRight size={16} /></button>
                          <button onClick={() => setShowSetupGuideModal(true)} style={{ background: 'transparent', border: '1px solid #DDD6CB', color: '#5C5C5C', fontFamily: "'Inter', sans-serif", fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EDE8'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>View Setup Guide</button>
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
                          <span style={{ fontSize: '0.72rem', color: '#B8891A', fontWeight: 600, marginTop: '0.25rem' }}>+ {setupSteps.length - 5} more steps below â†“</span>
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
                                    {step.done && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>âœ“ Done</span>}
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
            ) : activeTab === 'Branding' ? (
              /* Branding Tab Component */
              <BrandingTab
                orgLogo={orgLogo}
                setOrgLogo={setOrgLogo}
                orgName={orgName}
                setOrgName={setOrgName}
                onCancel={() => triggerTransition(() => setActiveTab('Your Workspace'))}
                addNotification={addNotification}
              />
            ) : activeTab === 'Roles' ? (
              /* Roles & Permissions Tab Component */
              <RolesTab
                wsTeam={wsTeam}
                setWsTeam={setWsTeam}
                onCancel={() => triggerTransition(() => setActiveTab('Your Workspace'))}
                addNotification={addNotification}
              />
            ) : activeTab === 'GeneralSettings' ? (
              /* General Settings Tab Component */
              <GeneralSettingsTab
                orgName={orgName}
                setOrgName={setOrgName}
                onCancel={() => triggerTransition(() => setActiveTab('Your Workspace'))}
                addNotification={addNotification}
              />
            ) : activeTab === 'Integrations' ? (
              /* Integrations Tab Component */
              <IntegrationsTab
                onCancel={() => triggerTransition(() => setActiveTab('Your Workspace'))}
                addNotification={addNotification}
              />
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
                onSaveProfile={(updates) => {
                  const { name, phone, jobTitle, timezone, language, emailNotifs, desktopNotifs, photo } = updates;
                  if (user.toLowerCase() === ownerEmail?.toLowerCase() || user === 'admin@oyengrid.com') {
                    if (name !== undefined) {
                      const parts = name.trim().split(' ');
                      setOwnerFirstName(parts[0] || '');
                      setOwnerLastName(parts.slice(1).join(' ') || '');
                    }
                    if (phone !== undefined) setOwnerPhone(phone);
                    if (jobTitle !== undefined) setOwnerTitle(jobTitle);
                    if (timezone !== undefined) setOwnerTimezone(timezone);
                    if (language !== undefined) setOwnerLanguage(language);
                    if (emailNotifs !== undefined) setOwnerEmailNotifs(emailNotifs);
                    if (desktopNotifs !== undefined) setOwnerDesktopNotifs(desktopNotifs);
                    if (photo !== undefined) setOwnerPhoto(photo);
                  } else {
                    setWsTeam(prev => prev.map(m => {
                      if (m.email.toLowerCase() === user.toLowerCase()) {
                        const newM = { ...m };
                        if (name !== undefined) newM.name = name;
                        if (phone !== undefined) newM.phone = phone;
                        if (jobTitle !== undefined) newM.jobTitle = jobTitle;
                        if (timezone !== undefined) newM.timezone = timezone;
                        if (language !== undefined) newM.language = language;
                        if (emailNotifs !== undefined) newM.emailNotifs = emailNotifs;
                        if (desktopNotifs !== undefined) newM.desktopNotifs = desktopNotifs;
                        if (photo !== undefined) newM.photo = photo;
                        return newM;
                      }
                      return m;
                    }));
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

            {/* â”€â”€ ONBOARDING SETUP GUIDE MODAL â”€â”€ */}
            {showSetupGuideModal && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21, 21, 21, 0.45)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={() => setShowSetupGuideModal(false)}>
                <style>{`
                  @keyframes guideFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                  .guide-modal { animation: guideFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; max-height: 90vh; display: flex; flex-direction: column; }
                  .guide-step { position: relative; display: flex; gap: 1.25rem; }
                  .guide-step:not(:last-child)::after { content: ''; position: absolute; left: 1.25rem; top: 2.75rem; bottom: -1rem; width: 2px; background-color: #E8E2D8; }
                  .check-card { background: #FDFAF5; border: 1px solid #E8E2D8; border-radius: 12px; padding: 0.85rem 1.1rem; display: flex; alignItems: center; gap: 0.65rem; box-shadow: 0 1px 4px rgba(0,0,0,0.03); transition: all 0.15s; }
                  .check-card:hover { border-color: #D4A017; background: #FFFBEB; }
                `}</style>
                <div className="guide-modal" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '18px', width: '100%', maxWidth: '780px', boxShadow: '0 24px 60px rgba(0,0,0,0.12)', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                  {/* Modal Header */}
                  <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid #F3F0EA', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px' }}>Getting Started Guide</h2>
                      <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.35rem', margin: '0.35rem 0 0', lineHeight: 1.4 }}>Learn how to prepare your workspace and launch your first program with OYEN GROUP.</p>
                    </div>
                    <button onClick={() => setShowSetupGuideModal(false)} style={{ background: '#F5F2ED', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Modal Scrollable Content */}
                  <div style={{ padding: '2rem 2.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Introduction */}
                    <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', color: '#78350F' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.35rem' }}>Welcome to OYEN GROUP</h4>
                      <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5, color: '#92400E' }}>
                        This short guide walks you through the recommended setup process. Complete these steps in order to prepare your workspace before inviting participants.
                      </p>
                    </div>

                    {/* Steps timeline */}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#151515', marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>Step-by-Step Setup</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {[
                          {
                            step: 'Step 1',
                            title: 'Create Your First Program',
                            icon: <Folder size={16} />,
                            color: '#2563EB',
                            bg: '#EFF6FF',
                            desc: "Create the program you'll manage inside your workspace.",
                            details: ['Program name', 'Description', 'Start & End dates', 'Program status'],
                            time: 'Estimated time: 2 minutes',
                          },
                          {
                            step: 'Step 2',
                            title: 'Assign Your Team',
                            icon: <Users size={16} />,
                            color: '#7C3AED',
                            bg: '#F5F3FF',
                            desc: 'Invite the people who will help manage the program.',
                            details: ['Facilitators', 'Coordinators', 'Administrators'],
                            note: 'Each team member receives an invitation.',
                            time: 'Estimated time: 2 minutes',
                          },
                          {
                            step: 'Step 3',
                            title: 'Invite Participants',
                            icon: <UserPlus size={16} />,
                            color: '#16A34A',
                            bg: '#F0FDF4',
                            desc: 'Add participants by:',
                            details: ['Email invitation', 'CSV upload', 'Registration link'],
                            note: 'Participants automatically receive access to the program.',
                            action: () => {
                              setShowSetupGuideModal(false);
                              triggerTransition(() => setActiveTab('Participants'));
                            }
                          },
                          {
                            step: 'Step 4',
                            title: 'Schedule Sessions',
                            icon: <Calendar size={16} />,
                            color: '#D97706',
                            bg: '#FFFBEB',
                            desc: 'Create live sessions for your program.',
                            details: ['Classes', 'Workshops', 'Webinars', 'Meetings', 'Assessments'],
                            note: 'Configure: Date, Time, Duration, Facilitator',
                          },
                          {
                            step: 'Step 5',
                            title: 'Upload Resources',
                            icon: <File size={16} />,
                            color: '#0891B2',
                            bg: '#ECFEFF',
                            desc: 'Upload learning materials.',
                            details: ['PDFs', 'Documents', 'Videos', 'Slides', 'External links'],
                            note: 'Everything is organized inside your program.',
                          },
                          {
                            step: 'Step 6',
                            title: 'Create Assessments',
                            icon: <ClipboardCheck size={16} />,
                            color: '#DB2777',
                            bg: '#FDF2F8',
                            desc: 'Evaluate participant progress using:',
                            details: ['Quizzes', 'Assignments', 'Exams', 'Practical assessments'],
                            note: 'Automatic grading is available where supported.',
                          },
                          {
                            step: 'Step 7',
                            title: 'Launch Your Program',
                            icon: <Rocket size={16} />,
                            color: '#D4A017',
                            bg: '#FFFBEB',
                            desc: 'When setup is complete:',
                            details: ['Participants can join', 'Sessions become available', 'Resources are published', 'Attendance tracking begins', 'Reports become available'],
                            note: 'Your program is now ready to run.',
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="guide-step">
                            {/* Badge Icon */}
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: item.bg, border: `1.5px solid ${item.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0, zIndex: 2 }}>
                              {item.icon}
                            </div>
                            
                            {/* Text */}
                            <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.step}</span>
                              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#151515', margin: '0.1rem 0 0.35rem' }}>{item.title}</h4>
                              <p style={{ color: '#5C5C5C', fontSize: '0.84rem', margin: '0 0 0.5rem', lineHeight: 1.45 }}>{item.desc}</p>
                              
                              {item.details && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.5rem 0' }}>
                                  {item.details.map((d, i) => (
                                    <span key={i} style={{ fontSize: '0.72rem', backgroundColor: '#F3F0EA', border: '1px solid #E8E2D8', color: '#4B5563', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 500 }}>{d}</span>
                                  ))}
                                </div>
                              )}
                              
                              {item.note && <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.25rem', fontStyle: 'italic' }}>{item.note}</div>}
                              {item.time && <div style={{ fontSize: '0.76rem', color: '#B8891A', fontWeight: 600, marginTop: '0.35rem' }}>{item.time}</div>}
                              {item.action && (
                                <button
                                  type="button"
                                  onClick={item.action}
                                  style={{
                                    marginTop: '0.65rem',
                                    padding: '0.45rem 1rem',
                                    backgroundColor: item.color,
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#FFFFFF',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(22,163,74,0.15)'
                                  }}
                                >
                                  Invite Participants
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* During program checklist */}
                    <div style={{ borderTop: '1px solid #F3F0EA', paddingTop: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#151515', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>During Your Program</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        {[
                          'Attendance Tracking', 'Participant Progress', 'Session Analytics', 
                          'Resource Management', 'Certificates', 'Reports & Insights', 'AI Assistance'
                        ].map((feat, idx) => (
                          <div key={idx} className="check-card">
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#DEF7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#03543F', flexShrink: 0 }}>
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Need help footer section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', flexShrink: 0 }}>
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14532D', margin: '0 0 0.15rem' }}>Need Help?</h5>
                        <p style={{ fontSize: '0.78rem', color: '#166534', margin: 0, lineHeight: 1.4 }}>
                          If you need assistance during setup, use the built-in AI Assistant or visit the Help Center for detailed documentation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div style={{ padding: '1.25rem 2.5rem 1.75rem', borderTop: '1px solid #F3F0EA', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', backgroundColor: '#FDFAF5', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
                    <button
                      onClick={() => setShowSetupGuideModal(false)}
                      style={{ padding: '0.65rem 1.25rem', background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#374151', borderRadius: '9px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      Close Guide
                    </button>
                    <button
                      onClick={() => {
                        setShowSetupGuideModal(false);
                        triggerTransition(() => setActiveTab('Team'));
                      }}
                      style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg,#F5C84C,#E2A020)', border: 'none', color: '#151515', borderRadius: '9px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,200,76,0.2)' }}
                    >
                      Continue Setup
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Workspace Chat Button & Drawer â€” shared GlobalChat component */}
            <GlobalChat
              userRole={userRole}
              user={user}
              ownerEmail={ownerEmail}
              isChatOpen={isChatOpen}
              openChat={openChat}
              closeChat={closeChat}
              visibleConversations={visibleConversations}
              filteredConversations={filteredConversations}
              activeConversationId={activeConversationId}
              setActiveConversationId={setActiveConversationId}
              activeConversation={activeConversation}
              activePeer={activePeer}
              chatSearch={chatSearch}
              setChatSearch={setChatSearch}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              sendMessage={sendMessage}
              openConversation={openConversation}
            />

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
                  <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼</span>
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
                    ÃƒÂ¢Ã¢â‚¬Â Ã‚Â Use different details
                  </button>

                  {/* Status row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }}></span>
                    <span>All Systems Operational</span>
                    <span
                      style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => alert('View Status: All systems fully operational.')}
                    >
                      View Status ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
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
                    ÃƒÂ¢Ã¢â‚¬Â Ã‚Â Go back to verify
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
                      ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â {verifyError}
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

              {/* Status and Footer Links ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â only show on default input form */}
              {verificationResult === null && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                    <span>All Systems Operational</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                    <span style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }} onClick={() => alert('View Status: All systems fully operational.')}>View Status ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢</span>
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

function ProfileTab({ info, onSaveProfile, addNotification, userRole, organizationName }) {
  const [name, setName]                   = React.useState(info.fullName);
  const [phone, setPhone]                 = React.useState(info.phone || '');
  const [jobTitle, setJobTitle]           = React.useState(info.jobTitle || '');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword]     = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState('');
  const [profileSaved, setProfileSaved]   = React.useState(false);
  const [prefSaved, setPrefSaved]         = React.useState(false);
  const [timezone, setTimezone]           = React.useState(info.timezone || 'Africa/Lagos');
  const [language, setLanguage]           = React.useState(info.language || 'English');
  const [emailNotifs, setEmailNotifs]     = React.useState(info.emailNotifs !== undefined ? info.emailNotifs : true);
  const [desktopNotifs, setDesktopNotifs] = React.useState(info.desktopNotifs !== undefined ? info.desktopNotifs : false);
  const fileInputRef = React.useRef(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveProfile({
      name,
      phone,
      jobTitle,
    });
    setProfileSaved(true);
    addNotification?.('Profile updated successfully');
    setTimeout(() => setProfileSaved(false), 3500);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSaveProfile({
          name,
          phone,
          jobTitle,
          photo: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    addNotification?.('Password changed successfully');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleSavePrefs = (e) => {
    e.preventDefault();
    onSaveProfile({
      name,
      phone,
      jobTitle,
      timezone,
      language,
      emailNotifs,
      desktopNotifs
    });
    setPrefSaved(true);
    addNotification?.('Preferences saved');
    setTimeout(() => setPrefSaved(false), 3000);
  };

  /* shared light-theme field styles */
  const field = {
    width: '100%', padding: '0.75rem 1rem', fontSize: '0.85rem',
    backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8',
    borderRadius: '10px', color: '#151515', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const readonlyField = {
    ...field,
    backgroundColor: '#F9F7F4', color: '#9CA3AF',
    cursor: 'not-allowed', border: '1px solid #F0EDE8',
  };
  const lbl = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: '0.4rem',
  };
  const card = {
    backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8',
    borderRadius: '16px', padding: '1.75rem 2rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  };
  const sectionTitle = {
    fontSize: '1rem', fontWeight: 800, color: '#151515',
    margin: '0 0 0.25rem', fontFamily: "'Outfit', sans-serif",
  };
  const sectionDesc = {
    fontSize: '0.8rem', color: '#6B7280', margin: 0,
  };
  const goldBtn = {
    padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg,#D4A017,#C49A2A)',
    border: 'none', color: '#fff', borderRadius: '10px', fontWeight: 700,
    fontSize: '0.83rem', cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', gap: '0.4rem',
    boxShadow: '0 4px 14px rgba(212,160,23,0.25)',
  };
  const outlineBtn = {
    padding: '0.65rem 1.25rem', background: '#FFFFFF',
    border: '1px solid #E8E2D8', color: '#374151', borderRadius: '10px',
    fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  };
  const dangerBtn = {
    padding: '0.65rem 1.25rem', background: '#FEF2F2',
    border: '1px solid #FECACA', color: '#DC2626', borderRadius: '10px',
    fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  };

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '44px', height: '24px', borderRadius: '99px', cursor: 'pointer',
        backgroundColor: checked ? '#D4A017' : '#E5E7EB',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '3px',
        left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        backgroundColor: '#FFFFFF', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );

  /* avatar */
  const hue = (() => {
    let h = 0;
    for (let i = 0; i < info.fullName.length; i++) h = info.fullName.charCodeAt(i) + ((h << 5) - h);
    return [215,168,142,280,32,195,330,260][Math.abs(h) % 8];
  })();

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'left', maxWidth: '720px', fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .prof-input:focus { border-color: #D4A017 !important; box-shadow: 0 0 0 3px rgba(212,160,23,0.1); }
        .prof-card-hover { transition: box-shadow 0.2s; }
      `}</style>

      {/* â”€â”€ PAGE HEADER â”€â”€ */}
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px' }}>
          Personal Profile
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '0.3rem', margin: '0.3rem 0 0' }}>
          Manage your personal information, account security, and preferences.
        </p>
      </div>

      {/* â•â•â•â•â•â•â•â• SECTION 1 â€” Personal Information â•â•â•â•â•â•â•â• */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#D4A017" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
          <div>
            <div style={sectionTitle}>Personal Information</div>
            <div style={sectionDesc}>Update your name, photo, and contact details.</div>
          </div>
        </div>

        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#FDFAF5', borderRadius: '12px', border: '1px solid #F0EDE8' }}>
          {info.photo ? (
            <img src={info.photo} alt={name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4A017' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `hsl(${hue},65%,92%)`, border: `2px solid hsl(${hue},50%,80%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue},50%,35%)`, fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
              {info.initials}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515' }}>{info.fullName}</div>
            <div style={{ fontSize: '0.8rem', color: '#D4A017', fontWeight: 600, marginTop: '0.1rem' }}>{info.role}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ ...outlineBtn, fontSize: '0.75rem', padding: '0.5rem 0.9rem' }}
            >
              Change Photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={lbl}>Full Name</label>
              <input className="prof-input" required type="text" value={name} onChange={e => setName(e.target.value)} style={field} placeholder="Your full name" />
            </div>
            <div>
              <label style={lbl}>Phone Number</label>
              <input className="prof-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={field} placeholder="+234 800 000 0000" />
            </div>
          </div>

          <div>
            <label style={lbl}>Email Address <span style={{ color: '#9CA3AF', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(verification required to change)</span></label>
            <input type="email" value={info.email} readOnly style={readonlyField} />
          </div>

          <div>
            <label style={lbl}>Job Title <span style={{ color: '#9CA3AF', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(optional)</span></label>
            <input className="prof-input" type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={field} placeholder="e.g. Senior Trainer" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
            <button type="submit" style={goldBtn}>
              Save Changes
            </button>
            {profileSaved && (
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                âœ“ Saved
              </span>
            )}
          </div>
        </form>
      </div>

      {/* â•â•â•â•â•â•â•â• SECTION 2 â€” Workspace Information (Read Only) â•â•â•â•â•â•â•â• */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>
          </div>
          <div>
            <div style={sectionTitle}>Workspace Information</div>
            <div style={sectionDesc}>Your workspace assignment managed by the administrator.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {[
            { label: 'Organization', value: organizationName || 'OYEN GRID' },
            { label: 'Workspace', value: 'Main Workspace' },
            { label: 'Assigned Role', value: info.role || 'Facilitator' },
            { label: 'Date Joined', value: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
          ].map(item => (
            <div key={item.label}>
              <label style={lbl}>{item.label}</label>
              <input type="text" value={item.value} readOnly style={readonlyField} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.85rem 1rem', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px' }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#0284C7" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.05rem' }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span style={{ fontSize: '0.78rem', color: '#0369A1' }}>These details are managed by your workspace administrator and cannot be changed here.</span>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â• SECTION 3 â€” Security â•â•â•â•â•â•â•â• */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <div style={sectionTitle}>Security</div>
            <div style={sectionDesc}>Update your password to keep your account secure.</div>
          </div>
        </div>

        <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {passwordSuccess && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '9px', color: '#16a34a', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              âœ“ Password updated successfully.
            </div>
          )}
          {passwordError && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '9px', color: '#DC2626', fontSize: '0.82rem' }}>
              {passwordError}
            </div>
          )}

          <div>
            <label style={lbl}>Current Password</label>
            <input className="prof-input" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" style={field} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={lbl}>New Password</label>
              <input className="prof-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" style={field} />
            </div>
            <div>
              <label style={lbl}>Confirm New Password</label>
              <input className="prof-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" style={field} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.1rem' }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Use a strong password with at least 8 characters.</span>
          </div>

          <div>
            <button type="submit" style={goldBtn}>Update Password</button>
          </div>
        </form>
      </div>

      {/* â•â•â•â•â•â•â•â• SECTION 4 â€” Preferences â•â•â•â•â•â•â•â• */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          </div>
          <div>
            <div style={sectionTitle}>Preferences</div>
            <div style={sectionDesc}>Customize your workspace experience and notification settings.</div>
          </div>
        </div>

        <form onSubmit={handleSavePrefs} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={lbl}>Time Zone</label>
              <div style={{ position: 'relative' }}>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ ...field, appearance: 'none', cursor: 'pointer', paddingRight: '2.5rem' }}>
                  {['Africa/Lagos', 'Africa/Accra', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai', 'Asia/Singapore'].map(tz => (
                    <option key={tz}>{tz}</option>
                  ))}
                </select>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <div>
              <label style={lbl}>Language</label>
              <div style={{ position: 'relative' }}>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ ...field, appearance: 'none', cursor: 'pointer', paddingRight: '2.5rem' }}>
                  {['English', 'French', 'Spanish', 'Arabic', 'Portuguese', 'Yoruba', 'Igbo', 'Hausa'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2" style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem', backgroundColor: '#FDFAF5', borderRadius: '12px', border: '1px solid #F0EDE8' }}>
            {[
              { label: 'Email Notifications', desc: 'Receive updates on sessions, participants, and programs via email.', value: emailNotifs, set: setEmailNotifs },
              { label: 'Desktop Notifications', desc: 'Get browser push notifications for important workspace events.', value: desktopNotifs, set: setDesktopNotifs },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#151515' }}>{item.label}</div>
                  <div style={{ fontSize: '0.77rem', color: '#9CA3AF', marginTop: '0.15rem' }}>{item.desc}</div>
                </div>
                <Toggle checked={item.value} onChange={item.set} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" style={goldBtn}>Save Preferences</button>
            {prefSaved && <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>âœ“ Saved</span>}
          </div>
        </form>
      </div>

      {/* â•â•â•â•â•â•â•â• SECTION 5 â€” Account â•â•â•â•â•â•â•â• */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </div>
          <div>
            <div style={sectionTitle}>Account</div>
            <div style={sectionDesc}>Manage your account sessions and data.</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: '#FDFAF5', borderRadius: '12px', border: '1px solid #F0EDE8' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#151515' }}>Sign Out of All Devices</div>
              <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.1rem' }}>Terminate all active sessions across devices immediately.</div>
            </div>
            <button type="button" style={outlineBtn} onClick={() => addNotification?.('Signed out of all devices')}>
              Sign Out All
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: '#FDFAF5', borderRadius: '12px', border: '1px solid #F0EDE8' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#151515' }}>Download My Account Data</div>
              <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.1rem' }}>Export a copy of your personal profile and activity data.</div>
            </div>
            <button type="button" style={outlineBtn} onClick={() => addNotification?.('Data export request submitted')}>
              Download
            </button>
          </div>
        </div>
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
                ðŸ“š
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
                          <span>â€¢</span>
                          <span>{getResourceType(featuredResource.name)}</span>
                          <span>â€¢</span>
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
                            <span style={{ fontSize: '13px', color: '#8D887E' }}>{getResourceType(res.name)} â€¢ {res.size || '2.3 MB'}</span>
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
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>ðŸ”</span>
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
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>ðŸ“</div>
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
                        <span style={{ color: '#3b82f6' }}>ðŸ“</span> {progName}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1.5rem' }}>
                        {resList.map((res, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <span>ðŸ“„</span>
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
                        <span style={{ color: '#a855f7' }}>ðŸ“</span> {groupName}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1.5rem' }}>
                        {resList.map((res, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <span>ðŸ“„</span>
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
