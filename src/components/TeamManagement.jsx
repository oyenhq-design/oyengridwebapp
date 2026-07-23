import React, { useState, useEffect, useCallback } from 'react';
import { InvitationService } from '../services/InvitationService';
import {
  Mail, Link2, UserPlus, ShieldCheck, Users, User,
  Search, Settings, X, Copy, RefreshCw,
  CheckCircle2, AlertCircle, Eye, EyeOff, MoreVertical, ExternalLink, Download
} from 'lucide-react';

const ROLES = ['Admin', 'Program Manager', 'Facilitator', 'Team Member', 'Viewer'];

const ROLE_COLORS = {
  'Organization Owner': { bg: 'rgba(212,175,55,0.12)', text: '#B98C17' },
  'Admin':              { bg: 'rgba(16,185,129,0.12)', text: '#059669' },
  'Program Manager':    { bg: 'rgba(139,92,246,0.12)', text: '#7C3AED' },
  'Facilitator':        { bg: 'rgba(59,130,246,0.12)', text: '#2563EB' },
  'Team Member':        { bg: 'rgba(107,114,128,0.12)', text: '#4B5563' },
  'Viewer':             { bg: 'rgba(107,114,128,0.12)', text: '#4B5563' }
};

const STATUS_COLOR = {
  'Active':    { bg: 'rgba(22,163,74,0.1)', text: '#16A34A' },
  'Pending':   { bg: 'rgba(212,175,55,0.1)', text: '#B98C17' },
  'Suspended': { bg: 'rgba(220,38,38,0.1)', text: '#DC2626' }
};

const MEMBER_COLORS = ['#7c3aed','#0f766e','#b45309','#0284c7','#16a34a','#dc2626','#0369a1'];

/* ───── Modal backdrop ───── */
function Modal({ onClose, children, wide }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(27,29,35,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.18s ease',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E7E2D8',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: wide ? '520px' : '460px',
          boxShadow: '0 12px 36px rgba(15,23,42,0.08)',
          animation: 'scaleUp 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1B1D23', margin: 0, fontFamily: "'Inter', sans-serif" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '13px', color: '#6D7280', marginTop: '0.3rem', lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        style={{ background: 'transparent', border: '1px solid #E7E2D8', color: '#6D7280', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '1rem' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: error ? '0.5rem' : '1rem', textAlign: 'left' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6D7280', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem', fontSize: '14px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E7E2D8', borderRadius: '8px',
  color: '#1B1D23', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s ease', fontFamily: 'inherit',
};

/* ═══════════════════════════════
   MODAL 1 — Invite by Email
   ═══════════════════════════════ */
function InviteEmailModal({ onClose, onSend }) {
  const [email,   setEmail]   = useState('');
  const [role,    setRole]    = useState('Team Member');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => { onSend({ email: email.trim(), role }); onClose(); }, 900);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Invite Team Member"
        subtitle="They'll receive an email invitation to join your workspace."
        onClose={onClose}
      />

      <Field label="Email Address" error={error}>
        <input
          autoFocus type="email"
          placeholder="name@organization.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          style={{ ...inputStyle, borderColor: error ? '#ef4444' : '#E7E2D8' }}
          onFocus={e => e.target.style.borderColor = '#D4AF37'}
          onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#E7E2D8'}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
      </Field>

      <Field label="Role">
        <select
          value={role} onChange={e => setRole(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = '#D4AF37'}
          onBlur={e => e.target.style.borderColor = '#E7E2D8'}
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button 
          onClick={onClose} 
          style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #DDD7CC', color: '#333', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
        >
          Cancel
        </button>
        <button 
          onClick={handleSend}
          disabled={loading}
          style={{ flex: 1, padding: '0.75rem', background: '#D4AF37', border: 'none', color: '#111214', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Mail size={14} /> {loading ? 'Sending...' : 'Send Invitation'}
        </button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════
   MODAL 2 — Invite with Link
   ═══════════════════════════════ */
function InviteLinkModal({ onClose, inviteLink, onRegenerate, linkEnabled, onToggleLink }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Invite with Link"
        subtitle="Share this link with anyone you want to invite to your workspace."
        onClose={onClose}
      />

      <div style={{ backgroundColor: '#F7F4EE', border: '1px solid #E7E2D8', borderRadius: '10px', padding: '1.1rem', marginBottom: '1.25rem', textAlign: 'left' }}>
        <p style={{ fontSize: '11px', color: '#6D7280', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          Invite people to your workspace
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FFFFFF', border: '1px solid #E7E2D8', borderRadius: '8px', padding: '0.6rem 0.85rem' }}>
          <Link2 size={14} color={linkEnabled ? '#16A34A' : '#6D7280'} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: linkEnabled ? '#1B1D23' : '#6D7280', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            {linkEnabled ? inviteLink : '─── link disabled ───'}
          </span>
        </div>
        {!linkEnabled && (
          <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0.5rem 0 0 0' }}>
            <AlertCircle size={11} /> This invite link is currently disabled.
          </p>
        )}
      </div>

      <button
        onClick={handleCopy}
        disabled={!linkEnabled}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: linkEnabled ? '#D4AF37' : '#E7E2D8',
          border: 'none',
          color: '#111214',
          borderRadius: '8px',
          cursor: linkEnabled ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.65rem' }}>
        <button
          onClick={onRegenerate}
          style={{ flex: 1, padding: '0.65rem', background: '#FFFFFF', border: '1px solid #DDD7CC', color: '#333', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={13} /> Regenerate
        </button>
        <button
          onClick={onToggleLink}
          style={{ flex: 1, padding: '0.65rem', background: linkEnabled ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', border: `1px solid ${linkEnabled ? 'rgba(220,38,38,0.3)' : 'rgba(22,163,74,0.3)'}`, color: linkEnabled ? '#DC2626' : '#16A34A', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          {linkEnabled ? <><EyeOff size={13} /> Disable</> : <><Eye size={13} /> Enable</>}
        </button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════
   Toast Notification
   ═══════════════════════════════ */
function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000,
      backgroundColor: '#FFFFFF',
      border: `1px solid ${type === 'success' ? '#16A34A' : '#DC2626'}`,
      borderRadius: '10px', padding: '0.85rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      animation: 'scaleUp 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
      maxWidth: '340px',
    }}>
      {type === 'success'
        ? <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
        : <AlertCircle  size={18} color="#DC2626" style={{ flexShrink: 0 }} />}
      <span style={{ fontSize: '13px', color: '#1B1D23', fontWeight: 500, flex: 1, textAlign: 'left' }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#6D7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <X size={13} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main TeamManagement export
   ═══════════════════════════════════════════ */
export default function TeamManagement({ members, setMembers, pending: propsPending, setPending: propsSetPending, addNotification, onNavigateHome }) {
  const [localPending, setLocalPending] = useState([]);
  const pending = propsPending || localPending;
  const setPending = propsSetPending || setLocalPending;

  const [activeModal, setActiveModal] = useState(null);
  const [toast,       setToast]       = useState(null);
  const [inviteLink,  setInviteLink]  = useState(`${window.location.origin}/?code=EMP-${Math.floor(10000 + Math.random() * 90000)}`);
  const [linkEnabled, setLinkEnabled] = useState(true);
  const [activeActionMenu, setActiveActionMenu] = useState(null); // { type: 'active' | 'pending', index: number }

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const closeModal = useCallback(() => setActiveModal(null), []);
  const showToast  = useCallback((message, type = 'success') => setToast({ message, type }), []);

  /* Invite by email */
  const handleInviteEmail = async ({ email, role }) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Invalid email address', 'error');
      return;
    }

    const isDuplicate = pending.some(p => p.email?.toLowerCase() === email.toLowerCase());
    if (isDuplicate) {
      showToast('A pending invitation already exists for this email', 'error');
      return;
    }

    showToast('Creating invitation...', 'info');

    const invitation = InvitationService.createInvitation(email, role, 'Owner');
    invitation.initials = email.slice(0, 2).toUpperCase();
    invitation.color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];

    setPending(prev => [...prev, invitation]);

    const sendResult = await InvitationService.sendInvitation(invitation);
    if (sendResult.success) {
      showToast(sendResult.message);
      addNotification?.(`Invitation sent to ${email} as ${role}. Code: ${invitation.accessCode}`);
    } else {
      showToast(sendResult.message, 'warning');
      addNotification?.(`Invitation created manually for ${email} as ${role} (email failed). Code: ${invitation.accessCode}`);
    }
  };

  /* Regenerate link */
  const handleRegenerate = () => {
    const email = `link-member-${Math.floor(1000 + Math.random() * 9000)}@oyengrid.com`;
    const invitation = InvitationService.createInvitation(email, 'Team Member', 'Owner');
    invitation.initials = 'LM';
    invitation.color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];

    setPending(prev => [...prev, invitation]);
    
    const inviteLinkVal = `${window.location.origin}/accept?token=${invitation.token}`;
    setInviteLink(inviteLinkVal);
    
    showToast('Invite link regenerated');
    addNotification?.(`Workspace invite link regenerated. Code: ${invitation.accessCode}`);
  };

  /* Role Change handler */
  const handleRoleChange = (type, index, newRole) => {
    if (type === 'active') {
      const target = members[index];
      if (target.isYou) {
        showToast("You cannot change your own role", "error");
        return;
      }
      setMembers(prev => prev.map((m, idx) => idx === index ? { ...m, role: newRole } : m));
      showToast(`Updated role to ${newRole}`);
      addNotification?.(`Updated role for ${target.email} to ${newRole}`);
    } else {
      const target = pending[index];
      setPending(prev => prev.map((p, idx) => idx === index ? { ...p, role: newRole } : p));
      showToast(`Updated invitation role to ${newRole}`);
      addNotification?.(`Updated invitation role for ${target.email} to ${newRole}`);
    }
  };

  /* Suspend / Activate handler */
  const handleToggleStatus = (index) => {
    const target = members[index];
    if (target.isYou) {
      showToast("You cannot suspend yourself", "error");
      return;
    }
    const nextStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    setMembers(prev => prev.map((m, idx) => idx === index ? { ...m, status: nextStatus } : m));
    showToast(`Member status set to ${nextStatus}`);
    addNotification?.(`Member status set to ${nextStatus} for ${target.email}`);
  };

  /* Remove / Revoke member handler */
  const handleRemoveMember = (type, index) => {
    if (type === 'active') {
      const target = members[index];
      if (target.isYou) {
        showToast("You cannot remove yourself", "error");
        return;
      }
      if (window.confirm(`Are you sure you want to remove ${target.name || target.email}?`)) {
        setMembers(prev => prev.filter((_, idx) => idx !== index));
        showToast("Member removed successfully");
        addNotification?.(`Removed member ${target.email}`);
      }
    } else {
      const target = pending[index];
      if (window.confirm(`Are you sure you want to revoke invitation for ${target.email}?`)) {
        setPending(prev => prev.filter((_, idx) => idx !== index));
        showToast("Invitation revoked successfully");
        addNotification?.(`Revoked invitation for ${target.email}`);
      }
    }
  };

  // Filter & Search logic
  const getFilteredItems = () => {
    let list = [];
    members.forEach((m, idx) => {
      list.push({ ...m, type: 'active', originalIndex: idx });
    });
    pending.forEach((p, idx) => {
      if (!p.used) {
        list.push({ ...p, type: 'pending', originalIndex: idx, name: p.name || p.email, status: 'Pending' });
      }
    });

    if (activeFilter === 'Owners') {
      list = list.filter(item => item.role === 'Organization Owner');
    } else if (activeFilter === 'Facilitators') {
      list = list.filter(item => item.role === 'Facilitator');
    } else if (activeFilter === 'Pending') {
      list = list.filter(item => item.status === 'Pending');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        (item.name || '').toLowerCase().includes(q) || 
        (item.email || '').toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredList = getFilteredItems();

  return (
    <>
      {/* Modals */}
      {activeModal === 'email'  && <InviteEmailModal onClose={closeModal} onSend={handleInviteEmail} />}
      {activeModal === 'link'   && <InviteLinkModal  onClose={closeModal} inviteLink={inviteLink} onRegenerate={handleRegenerate} linkEnabled={linkEnabled} onToggleLink={() => { setLinkEnabled(v => !v); showToast(linkEnabled ? 'Invite link disabled' : 'Invite link enabled'); addNotification?.(linkEnabled ? 'Workspace invite link disabled' : 'Workspace invite link enabled'); }} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="animate-fade-in" style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left', fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box' }}>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1B1D23', margin: 0, fontFamily: "'Inter', sans-serif" }}>Workspace Team</h2>
            <p style={{ color: '#6D7280', fontSize: '15px', marginTop: '4px' }}>Invite, manage, and organize everyone working in this workspace.</p>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E7E2D8', paddingBottom: '20px' }}>
          <button 
            onClick={() => setActiveModal('email')}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#D4AF37', border: 'none', color: '#111214', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2BF56'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
          >
            + Invite Member
          </button>
          
          <button 
            onClick={() => setActiveModal('link')}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#FFFFFF', border: '1px solid #DDD7CC', color: '#333', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F2EFE8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Generate Invite Link
          </button>

          <button 
            disabled 
            style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #DDD7CC', color: '#AAA', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }}
          >
            Import Members <span style={{ fontSize: '10px', marginLeft: '4px', textTransform: 'uppercase', verticalAlign: 'middle', border: '1px solid #DDD7CC', padding: '1px 4px', borderRadius: '4px' }}>Soon</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Owners', 'Facilitators', 'Pending'].map(f => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #E7E2D8',
                    backgroundColor: isActive ? '#D4AF37' : '#FFFFFF',
                    color: isActive ? '#111214' : '#6D7280',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#FAF8F3'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '320px', position: 'relative' }}>
            <Search size={15} color="#6D7280" style={{ position: 'absolute', left: '10px' }} />
            <input 
              type="text" 
              placeholder="Search people..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid #E7E2D8', borderRadius: '8px', color: '#1B1D23', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Members Table */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECE6DA', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(15,23,42,.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F4EE', borderBottom: '1px solid #E7E2D8', fontSize: '12px', fontWeight: 600, color: '#6D7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Member</th>
                <th style={{ padding: '16px 20px' }}>Role</th>
                <th style={{ padding: '16px 20px' }}>Programs</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Last Active</th>
                <th style={{ padding: '16px 20px' }}>Joined</th>
                <th style={{ padding: '16px 20px', width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, idx) => {
                const roleStyle = ROLE_COLORS[item.role] || { bg: 'rgba(107,114,128,0.12)', text: '#4B5563' };
                const statusStyle = STATUS_COLOR[item.status] || { bg: 'rgba(212,175,55,0.1)', text: '#B98C17' };
                
                // Mock visual props
                const programsList = item.role === 'Organization Owner' || item.role === 'Admin' ? 'All Programs' : 'Leadership Orientation';
                const lastActiveStr = item.status === 'Pending' ? 'Pending Invite' : (item.isYou ? 'Active now' : 'Yesterday');

                return (
                  <tr 
                    key={idx} 
                    style={{ borderBottom: '1px solid #E7E2D8', fontSize: '14px', height: '56px', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF8F3'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Member Details */}
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: item.color || '#DDD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#FFF' }}>
                          {item.initials}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 600, color: '#1B1D23', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {item.name}
                            {item.isYou && (
                              <span style={{ fontSize: '10px', backgroundColor: 'rgba(212,175,55,0.12)', color: '#B98C17', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>You</span>
                            )}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6D7280' }}>{item.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badges */}
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>
                        {item.role}
                      </span>
                    </td>

                    {/* Assigned Programs */}
                    <td style={{ padding: '12px 20px', color: '#1B1D23', fontWeight: 500 }}>
                      {programsList}
                    </td>

                    {/* Status badge pill */}
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyle.text }} />
                        {item.status === 'Pending' ? 'Pending Invite' : item.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td style={{ padding: '12px 20px', color: '#6D7280', fontWeight: 500 }}>
                      {lastActiveStr}
                    </td>

                    {/* Joined date */}
                    <td style={{ padding: '12px 20px', color: '#6D7280', fontWeight: 500 }}>
                      {item.joined || item.invitedAt || '—'}
                    </td>

                    {/* Actions Menu */}
                    <td style={{ padding: '12px 20px', position: 'relative' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMenu(activeActionMenu && activeActionMenu.type === item.type && activeActionMenu.index === item.originalIndex ? null : { type: item.type, index: item.originalIndex });
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#6D7280', cursor: 'pointer', padding: '4px' }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeActionMenu && activeActionMenu.type === item.type && activeActionMenu.index === item.originalIndex && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={(e) => { e.stopPropagation(); setActiveActionMenu(null); }} />
                          <div style={{ position: 'absolute', right: '10px', top: '36px', backgroundColor: '#FFFFFF', border: '1px solid #E7E2D8', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', width: '190px', zIndex: 100, overflow: 'hidden', textAlign: 'left' }}>
                            
                            <button onClick={(e) => { e.stopPropagation(); alert(`Viewing profile for ${item.name}`); setActiveActionMenu(null); }}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', textAlign: 'left', background: 'none', border: 'none', color: '#1B1D23', fontSize: '13px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onMouseEnter={ev => ev.currentTarget.style.backgroundColor = '#FAF8F3'}
                                    onMouseLeave={ev => ev.currentTarget.style.backgroundColor = 'transparent'}>
                              View Profile
                            </button>

                            <div style={{ padding: '0.4rem 0.8rem', borderTop: '1px solid #E7E2D8', fontSize: '10px', color: '#6D7280', fontWeight: 700, letterSpacing: '0.08em' }}>EDIT ROLE</div>
                            {ROLES.map(role => (
                              <button key={role}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRoleChange(item.type, item.originalIndex, role);
                                        setActiveActionMenu(null);
                                      }}
                                      style={{ width: '100%', padding: '0.4rem 0.8rem 0.4rem 1.2rem', textAlign: 'left', background: 'none', border: 'none', color: item.role === role ? '#B98C17' : '#1B1D23', fontSize: '12px', cursor: 'pointer' }}
                                      onMouseEnter={ev => ev.currentTarget.style.backgroundColor = '#FAF8F3'}
                                      onMouseLeave={ev => ev.currentTarget.style.backgroundColor = 'transparent'}>
                                {role}
                              </button>
                            ))}

                            <div style={{ borderBottom: '1px solid #E7E2D8', margin: '0.2rem 0' }} />
                            
                            {item.status === 'Pending' && (
                              <button onClick={(e) => {
                                        e.stopPropagation();
                                        showToast(`Invite code resent: ${item.accessCode || 'OYEN-FAC-2098X'}`);
                                        setActiveActionMenu(null);
                                      }}
                                      style={{ width: '100%', padding: '0.6rem 0.8rem', textAlign: 'left', background: 'none', border: 'none', color: '#1B1D23', fontSize: '13px', cursor: 'pointer' }}
                                      onMouseEnter={ev => ev.currentTarget.style.backgroundColor = '#FAF8F3'}
                                      onMouseLeave={ev => ev.currentTarget.style.backgroundColor = 'transparent'}>
                                Resend Invite
                              </button>
                            )}

                            <button onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard?.writeText(item.accessCode || 'OYEN-FAC-MEMBER');
                                      showToast('Activation code copied to clipboard');
                                      setActiveActionMenu(null);
                                    }}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', textAlign: 'left', background: 'none', border: 'none', color: '#1B1D23', fontSize: '13px', cursor: 'pointer' }}
                                    onMouseEnter={ev => ev.currentTarget.style.backgroundColor = '#FAF8F3'}
                                    onMouseLeave={ev => ev.currentTarget.style.backgroundColor = 'transparent'}>
                              Copy Activation Code
                            </button>

                            <button onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStatus(item.originalIndex);
                                      setActiveActionMenu(null);
                                    }}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', textAlign: 'left', background: 'none', border: 'none', color: '#1B1D23', fontSize: '13px', cursor: 'pointer' }}
                                    onMouseEnter={ev => ev.currentTarget.style.backgroundColor = '#FAF8F3'}
                                    onMouseLeave={ev => ev.currentTarget.style.backgroundColor = 'transparent'}>
                              {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>

                            <button onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveMember(item.type, item.originalIndex);
                                      setActiveActionMenu(null);
                                    }}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', textAlign: 'left', background: 'none', border: 'none', color: '#DC2626', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                                    onMouseEnter={ev => ev.currentTarget.style.backgroundColor = '#FAF8F3'}
                                    onMouseLeave={ev => ev.currentTarget.style.backgroundColor = 'transparent'}>
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '32px' }}>👥</span>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1B1D23', margin: 0 }}>No team members yet.</h4>
                      <p style={{ fontSize: '14px', color: '#6D7280', margin: 0 }}>Invite your first facilitator or admin.</p>
                      <button 
                        onClick={() => setActiveModal('email')}
                        style={{ marginTop: '8px', padding: '0.5rem 1rem', backgroundColor: '#D4AF37', border: 'none', color: '#111214', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Invite Member
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
