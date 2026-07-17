import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail, Link2, UserPlus, ShieldCheck, Users, User, Lock,
  Search, Settings, ArrowRight, X, Copy, RefreshCw,
  CheckCircle2, AlertCircle, Eye, EyeOff, UserCheck
} from 'lucide-react';

const ROLES = ['Admin', 'Program Manager', 'Facilitator', 'Team Member', 'Viewer'];

const ROLE_COLORS = {
  'Organization Owner': '#D4AF37',
  'Admin':              '#3b82f6',
  'Program Manager':    '#8b5cf6',
  'Facilitator':        '#0284c7',
  'Team Member':        '#16a34a',
  'Viewer':             '#b45309',
};

const STATUS_COLOR = { Active: '#22c55e', Pending: '#D4AF37', Declined: '#ef4444', Suspended: '#6b7280' };

const INITIAL_MEMBERS = [
  { initials: 'JD', color: '#D4AF37', name: 'John Doe',        isYou: true, email: 'john.doe@abcenergy.com',        role: 'Organization Owner', status: 'Active',  joined: 'May 22, 2025' },
  { initials: 'SA', color: '#7c3aed', name: 'Sarah Ahmed',                  email: 'sarah.ahmed@abcenergy.com',     role: 'Admin',              status: 'Active',  joined: 'May 21, 2025' },
  { initials: 'MI', color: '#16a34a', name: 'Michael Ibrahim',              email: 'michael.ibrahim@abcenergy.com', role: 'Program Manager',    status: 'Active',  joined: 'May 20, 2025' },
  { initials: 'FA', color: '#0284c7', name: 'Fatima Aliyu',                 email: 'fatima.aliyu@abcenergy.com',    role: 'Facilitator',        status: 'Active',  joined: 'May 18, 2025' },
  { initials: 'NK', color: '#b45309', name: 'Ngozi Kalu',                   email: 'ngozi.kalu@abcenergy.com',      role: 'Viewer',             status: 'Pending', joined: 'May 22, 2025' },
];

const MEMBER_COLORS = ['#7c3aed','#0f766e','#b45309','#0284c7','#16a34a','#dc2626','#0369a1'];

/* ───── shared input style ───── */
const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem',
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
  color: '#fff', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s ease', fontFamily: 'inherit',
};

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
        backgroundColor: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.18s ease',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0e0f14',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: wide ? '520px' : '460px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
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
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '1rem' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: error ? '0.5rem' : '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}

function GoldBtn({ onClick, disabled, loading, icon, label, fullWidth }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: fullWidth ? '100%' : undefined,
        padding: '0.75rem 1.25rem',
        background: (disabled || loading) ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg,#D4AF37,#C49A2A)',
        border: 'none', color: '#000', borderRadius: '9px',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        fontWeight: 700, fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        transition: 'opacity 0.2s',
      }}
    >
      {icon} {loading ? 'Please wait…' : label}
    </button>
  );
}

function GhostBtn({ onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '0.72rem 1rem',
        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.6)', borderRadius: '9px',
        cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
    >
      {icon} {label}
    </button>
  );
}

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
          style={{ ...inputStyle, borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
          onFocus={e => e.target.style.borderColor = '#D4AF37'}
          onBlur={e => e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.1)'}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
      </Field>

      <Field label="Role">
        <select
          value={role} onChange={e => setRole(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
          onFocus={e => e.target.style.borderColor = '#D4AF37'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          {ROLES.map(r => <option key={r} value={r} style={{ backgroundColor: '#0e0f14' }}>{r}</option>)}
        </select>
      </Field>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <GhostBtn onClick={onClose} label="Cancel" />
        <GoldBtn onClick={handleSend} loading={loading} icon={<Mail size={15} />} label="Send Invitation" fullWidth />
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

      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.1rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
          Invite people to your workspace
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.85rem' }}>
          <Link2 size={14} color={linkEnabled ? '#22c55e' : '#6b7280'} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: linkEnabled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', letterSpacing: '0.3px' }}>
            {linkEnabled ? inviteLink : '─── link disabled ───'}
          </span>
        </div>
        {!linkEnabled && (
          <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertCircle size={11} /> This invite link is currently disabled.
          </p>
        )}
      </div>

      <GoldBtn
        onClick={handleCopy}
        disabled={!linkEnabled}
        icon={copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
        label={copied ? 'Copied!' : 'Copy Link'}
        fullWidth
      />

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.65rem' }}>
        <button
          onClick={onRegenerate}
          style={{ flex: 1, padding: '0.65rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <RefreshCw size={13} /> Regenerate
        </button>
        <button
          onClick={onToggleLink}
          style={{ flex: 1, padding: '0.65rem', background: linkEnabled ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${linkEnabled ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: linkEnabled ? '#ef4444' : '#22c55e', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
        >
          {linkEnabled ? <><EyeOff size={13} /> Disable</> : <><Eye size={13} /> Enable</>}
        </button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════
   MODAL 3 — Add Manually
═══════════════════════════════ */
function AddManuallyModal({ onClose, onAdd }) {
  const [form,    setForm]    = useState({ firstName: '', lastName: '', email: '', role: 'Team Member' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onAdd({ name: `${form.firstName.trim()} ${form.lastName.trim()}`, email: form.email.trim(), role: form.role });
      onClose();
    }, 900);
  };

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader
        title="Add Team Member"
        subtitle="They'll receive an invitation email. Their account remains pending until accepted."
        onClose={onClose}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <Field label="First Name" error={errors.firstName}>
          <input autoFocus placeholder="First name" value={form.firstName}
            onChange={e => set('firstName', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.firstName ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = '#D4AF37'}
            onBlur={e => e.target.style.borderColor = errors.firstName ? '#ef4444' : 'rgba(255,255,255,0.1)'}
          />
        </Field>
        <Field label="Last Name" error={errors.lastName}>
          <input placeholder="Last name" value={form.lastName}
            onChange={e => set('lastName', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.lastName ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = '#D4AF37'}
            onBlur={e => e.target.style.borderColor = errors.lastName ? '#ef4444' : 'rgba(255,255,255,0.1)'}
          />
        </Field>
      </div>

      <Field label="Email" error={errors.email}>
        <input type="email" placeholder="name@organization.com" value={form.email}
          onChange={e => set('email', e.target.value)}
          style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
          onFocus={e => e.target.style.borderColor = '#D4AF37'}
          onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)'}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
      </Field>

      <Field label="Role">
        <select value={form.role} onChange={e => set('role', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
          onFocus={e => e.target.style.borderColor = '#D4AF37'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          {ROLES.map(r => <option key={r} value={r} style={{ backgroundColor: '#0e0f14' }}>{r}</option>)}
        </select>
      </Field>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', padding: '0.6rem 0.75rem', backgroundColor: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '7px' }}>
        <Mail size={12} color="#D4AF37" style={{ flexShrink: 0 }} />
        An invitation email will be sent. Account stays pending until they accept.
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <GhostBtn onClick={onClose} label="Cancel" />
        <GoldBtn onClick={handleAdd} loading={loading} icon={<UserPlus size={15} />} label="Add Team Member" fullWidth />
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
      backgroundColor: '#0e0f14',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
      borderRadius: '10px', padding: '0.85rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      animation: 'scaleUp 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
      maxWidth: '340px',
    }}>
      {type === 'success'
        ? <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0 }} />
        : <AlertCircle  size={18} color="#ef4444" style={{ flexShrink: 0 }} />}
      <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <X size={13} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main TeamManagement export
═══════════════════════════════════════════ */
export default function TeamManagement({ onNavigateHome }) {
  const [members,     setMembers]     = useState(INITIAL_MEMBERS);
  const [pending,     setPending]     = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [toast,       setToast]       = useState(null);
  const [inviteLink,  setInviteLink]  = useState('https://oyengrid.com/join/abc123');
  const [linkEnabled, setLinkEnabled] = useState(true);

  const closeModal = useCallback(() => setActiveModal(null), []);
  const showToast  = useCallback((message, type = 'success') => setToast({ message, type }), []);

  /* Invite by email */
  const handleInviteEmail = ({ email, role }) => {
    const initials = email.slice(0, 2).toUpperCase();
    const color    = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    const today    = new Date();
    const expires  = new Date(today.getTime() + 7 * 86400000);
    const fmt      = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setPending(prev => [...prev, { email, role, initials, color, invitedAt: fmt(today), expiresAt: fmt(expires), status: 'Pending' }]);
    showToast(`Invitation sent to ${email}`);
  };

  /* Add manually → pending, not active */
  const handleAddManually = ({ name, email, role }) => {
    const parts    = name.split(' ');
    const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
    const color    = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    const today    = new Date();
    const expires  = new Date(today.getTime() + 7 * 86400000);
    const fmt      = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setPending(prev => [...prev, { name, email, role, initials, color, invitedAt: fmt(today), expiresAt: fmt(expires), status: 'Pending' }]);
    showToast(`Invitation sent to ${name}`);
  };

  /* Regenerate link */
  const handleRegenerate = () => {
    const id = Math.random().toString(36).slice(2, 9);
    setInviteLink(`https://oyengrid.com/join/${id}`);
    showToast('Invite link regenerated');
  };

  /* Derived counts */
  const activeCount  = members.filter(m => m.status === 'Active').length;
  const pendingCount = members.filter(m => m.status === 'Pending').length + pending.length;
  const totalMembers = members.length + pending.length;

  const rolesData = [
    { label: 'Organization Owner', icon: <ShieldCheck size={14} color="#D4AF37" />, count: members.filter(m => m.role === 'Organization Owner').length },
    { label: 'Admin (max 2)',       icon: <ShieldCheck size={14} color="#ef4444"  />, count: members.filter(m => m.role === 'Admin').length },
    { label: 'Program Manager',    icon: <Users size={14}       color="#8b5cf6"  />, count: members.filter(m => m.role === 'Program Manager').length },
    { label: 'Facilitator',        icon: <User size={14}        color="#3b82f6"  />, count: members.filter(m => m.role === 'Facilitator').length },
    { label: 'Team Member',        icon: <User size={14}        color="#22c55e"  />, count: members.filter(m => m.role === 'Team Member').length },
    { label: 'Viewer',             icon: <User size={14}        color="#6b7280"  />, count: members.filter(m => m.role === 'Viewer').length },
  ];

  const inviteMethods = [
    { key: 'email',  icon: <Mail size={22} color="#D4AF37" />,    title: 'Invite by Email',  desc: 'Send email invitations to team members' },
    { key: 'link',   icon: <Link2 size={22} color="#22c55e" />,   title: 'Invite with Link', desc: 'Share a link for anyone to join your workspace' },
    { key: 'manual', icon: <UserPlus size={22} color="#3b82f6" />,title: 'Add Manually',     desc: 'Add team members one by one' },
  ];

  return (
    <>
      {/* Modals */}
      {activeModal === 'email'  && <InviteEmailModal onClose={closeModal} onSend={handleInviteEmail} />}
      {activeModal === 'link'   && <InviteLinkModal  onClose={closeModal} inviteLink={inviteLink} onRegenerate={handleRegenerate} linkEnabled={linkEnabled} onToggleLink={() => { setLinkEnabled(v => !v); showToast(linkEnabled ? 'Invite link disabled' : 'Invite link enabled'); }} />}
      {activeModal === 'manual' && <AddManuallyModal onClose={closeModal} onAdd={handleAddManually} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* ── Main column ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Breadcrumb */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ cursor: 'pointer' }} onClick={onNavigateHome}>Home</span>
              <span>›</span><span>Team</span>
              <span>›</span><span style={{ color: 'rgba(255,255,255,0.7)' }}>Team Management</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit',sans-serif" }}>Team Management</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Manage your team members and their roles in this workspace.</p>
          </div>

          {/* Invite Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {inviteMethods.map(m => (
              <div key={m.key}
                onClick={() => setActiveModal(m.key)}
                style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; e.currentTarget.style.backgroundColor = '#13141a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.backgroundColor = '#0e0f14'; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{m.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Member Table */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>

            {/* Tab bar */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', fontSize: '0.8rem', fontWeight: 600 }}>
                {[
                  ['All Members', String(totalMembers), '#D4AF37'],
                  ['Active',      String(activeCount),  '#22c55e'],
                  ['Pending',     String(pendingCount), '#D4AF37'],
                  ['Declined',    '0',                  '#ef4444'],
                  ['Suspended',   '0',                  '#6b7280'],
                ].map(([label, count, color], i) => (
                  <div key={i} style={{ padding: '0.4rem 0.85rem', color: i === 0 ? '#D4AF37' : 'rgba(255,255,255,0.5)', borderBottom: i === 0 ? '2px solid #D4AF37' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                    {label}
                    <span style={{ backgroundColor: i === 0 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.06)', color, borderRadius: '10px', padding: '0.1rem 0.45rem', fontSize: '0.7rem', fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                  <Search size={13} /> Search members...
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                  <Settings size={13} /> Filter
                </div>
              </div>
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2.2fr 1.4fr 1fr 1.1fr 0.4fr', padding: '0.6rem 1.25rem', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Joined On</span><span />
            </div>

            {/* Active members */}
            {members.map((m, i) => (
              <div key={i}
                style={{ display: 'grid', gridTemplateColumns: '2fr 2.2fr 1.4fr 1fr 1.1fr 0.4fr', padding: '0.85rem 1.25rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.initials}</div>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{m.name}</span>
                  {m.isYou && <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', padding: '0.05rem 0.3rem', fontWeight: 700 }}>You</span>}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{m.email}</span>
                <span style={{ backgroundColor: `${ROLE_COLORS[m.role]}18`, color: ROLE_COLORS[m.role], border: `1px solid ${ROLE_COLORS[m.role]}40`, borderRadius: '5px', padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block' }}>{m.role}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: STATUS_COLOR[m.status], fontSize: '0.78rem', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: STATUS_COLOR[m.status] }} />{m.status}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{m.joined}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>···</div>
              </div>
            ))}

            {/* Pending rows */}
            {pending.map((p, i) => (
              <div key={`p-${i}`}
                style={{ display: 'grid', gridTemplateColumns: '2fr 2.2fr 1.4fr 1fr 1.1fr 0.4fr', padding: '0.85rem 1.25rem', alignItems: 'center', borderBottom: i < pending.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', fontSize: '0.82rem', backgroundColor: 'rgba(212,175,55,0.02)', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.02)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                  <span style={{ color: p.name ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{p.name || p.email}</span>
                  <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '4px', padding: '0.05rem 0.3rem', fontWeight: 700 }}>Invited</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{p.email}</span>
                <span style={{ backgroundColor: `${ROLE_COLORS[p.role] ?? '#888'}18`, color: ROLE_COLORS[p.role] ?? '#888', border: `1px solid ${ROLE_COLORS[p.role] ?? '#888'}40`, borderRadius: '5px', padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block' }}>{p.role}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontSize: '0.78rem', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />Pending
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{p.invitedAt}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>···</div>
              </div>
            ))}

            {/* Pagination (only when > 5 total) */}
            {totalMembers > 5 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                <span>Showing 1 to {totalMembers} of {totalMembers} members</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {['‹','1','›'].map((n, i) => (
                    <button key={i} style={{ background: n === '1' ? '#D4AF37' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: n === '1' ? '#000' : 'rgba(255,255,255,0.5)', borderRadius: '5px', width: '28px', height: '28px', fontWeight: n === '1' ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>{n}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Team Overview donut */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Team Overview</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" strokeWidth="14"
                  strokeDasharray={`${(activeCount / Math.max(totalMembers, 1)) * 238.76} 238.76`} strokeLinecap="butt" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#D4AF37" strokeWidth="14"
                  strokeDasharray={`${(pendingCount / Math.max(totalMembers, 1)) * 238.76} 238.76`}
                  strokeDashoffset={`${-(activeCount / Math.max(totalMembers, 1)) * 238.76}`} strokeLinecap="butt" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{totalMembers}</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>Total<br />Members</div>
              </div>
            </div>
            {[['#22c55e', activeCount,  'Active'], ['#D4AF37', pendingCount, 'Pending'], ['#ef4444', 0, 'Declined'], ['#6b7280', 0, 'Suspended']].map(([color, count, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.55)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />{label}
                </div>
                <span style={{ fontWeight: 700, color: '#fff' }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Roles in Workspace */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.9rem' }}>Roles in Workspace</h4>
            {rolesData.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'rgba(255,255,255,0.6)' }}>{r.icon} {r.label}</div>
                <span style={{ fontWeight: 700, color: '#fff' }}>{r.count}</span>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.9rem' }}>Quick Tips</h4>
            {[
              { icon: <UserCheck size={13} color="#D4AF37" />, title: 'Assign the right role',  desc: 'Roles help control access and responsibilities.' },
              { icon: <Users size={13}     color="#D4AF37" />, title: 'Use groups',              desc: 'Organize your team for better collaboration.' },
              { icon: <Lock size={13}      color="#D4AF37" />, title: 'Review permissions',     desc: 'Ensure members have the right access.' },
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '0.1rem', flexShrink: 0 }}>{tip.icon}</div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.1rem' }}>{tip.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{tip.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
              View all tips <ArrowRight size={11} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
