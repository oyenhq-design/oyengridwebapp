import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Globe, User, ChevronDown, Shield, ShieldCheck } from 'lucide-react';

export default function SignInForm({ 
  onSwitchForm, 
  onAuthSuccess, 
  teamMembers = [], 
  setTeamMembers, 
  invitations = [], 
  setInvitations,
  invitationPrefill,
  setInvitationPrefill
}) {
  const [flowStep, setFlowStep] = useState('login');

  // Input states for standard login
  const [email, setEmail] = useState(invitationPrefill ? invitationPrefill.email : '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Input states for invitation activation (in "Have an Invitation?" section)
  const [role, setRole] = useState(invitationPrefill ? invitationPrefill.role || '' : '');
  const [inviteCode, setInviteCode] = useState(invitationPrefill ? invitationPrefill.inviteCode : '');

  // Input states for password creation step
  const [fullName, setFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [matchedInvitation, setMatchedInvitation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Validate Standard Sign-In (email + password only, no role check at verification stage)
  const validateSignIn = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Standard Sign-In
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const targetEmail = email.trim().toLowerCase();
      
      const matchingMember = teamMembers.find(m => m.email.toLowerCase() === targetEmail);
      const pendingInvite = invitations.find(i => i.email.toLowerCase() === targetEmail && !i.used);

      if (!matchingMember && !pendingInvite) {
        setStatusMessage({
          type: 'error',
          text: 'This account does not exist in this workspace.'
        });
        return;
      }

      if (pendingInvite && (!matchingMember || matchingMember.status === 'Pending')) {
        setStatusMessage({
          type: 'error',
          text: 'Your invitation has not been activated yet. Please complete your invitation below before signing in.'
        });
        return;
      }

      const actualRole = matchingMember.role;
      const isOwnerDefault = (targetEmail === 'admin@oyengrid.com' || actualRole === 'Organization Owner');
      const expectedPassword = matchingMember.password || (isOwnerDefault ? 'password123' : null);

      if (!expectedPassword || password !== expectedPassword) {
        setStatusMessage({
          type: 'error',
          text: 'Invalid email or password. Please try again.'
        });
        return;
      }

      setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome back.' });
      
      if (setTeamMembers) {
        setTeamMembers(prev => prev.map(m => m.email.toLowerCase() === targetEmail ? { ...m, lastLogin: new Date().toISOString() } : m));
      }

      if (onAuthSuccess) {
        setTimeout(() => onAuthSuccess(targetEmail, actualRole), 1000);
      }
    }, 1200);
  };

  // Validate and Continue Activation for first-time invited users
  const handleContinueInvite = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!role) {
      newErrors.role = 'Please select your role';
    }
    if (!inviteCode) {
      newErrors.inviteCode = 'Invitation Code is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const codeUpper = inviteCode.trim().toUpperCase();

      const invite = invitations.find(i => i.accessCode.toUpperCase() === codeUpper);

      if (!invite) {
        setErrors({ inviteCode: 'Invalid invitation code' });
        return;
      }

      if (invite.role !== role) {
        setStatusMessage({
          type: 'error',
          text: `This invitation code is for the role of ${invite.role}, but you selected ${role}.`
        });
        return;
      }

      if (invite.used) {
        setStatusMessage({
          type: 'error',
          text: 'This invitation has already been accepted/activated.'
        });
        return;
      }

      setErrors({});
      setMatchedInvitation(invite);
      setEmail(invite.email); // Auto-prefill the email field from the invitation
      
      if (invite.name) {
        setFullName(invite.name);
      } else {
        const prefix = invite.email.split('@')[0];
        setFullName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
      }
      
      setFlowStep('invite-setup');
    }, 1200);
  };

  // Submit Password Creation and Activation
  const handleAccountSetupSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!regPassword) newErrors.regPassword = 'Password is required';
    else if (regPassword.length < 8) newErrors.regPassword = 'Password must be at least 8 characters';
    if (regPassword !== regConfirmPassword) newErrors.regConfirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const targetEmail = matchedInvitation.email;
      const assignedRole = matchedInvitation.role;
      const inviteCodeVal = matchedInvitation.accessCode;

      if (setInvitations) {
        setInvitations(prev => prev.map(i => 
          i.accessCode.toUpperCase() === inviteCodeVal.toUpperCase() 
            ? { ...i, used: true, status: 'Active', acceptedAt: new Date().toLocaleDateString('en-GB') } 
            : i
        ));
      }

      if (setTeamMembers) {
        setTeamMembers(prev => {
          const exists = prev.some(m => m.email.toLowerCase() === targetEmail.toLowerCase());
          if (exists) {
            return prev.map(m => m.email.toLowerCase() === targetEmail.toLowerCase() 
              ? { 
                  ...m, 
                  name: fullName, 
                  role: assignedRole, 
                  status: 'Active', 
                  password: regPassword, 
                  acceptedAt: new Date().toLocaleDateString('en-GB'),
                  lastLogin: new Date().toISOString(),
                  emailVerified: true
                } 
              : m
            );
          }
          const parts = fullName.split(' ');
          const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
          return [...prev, { 
            name: fullName, 
            email: targetEmail, 
            role: assignedRole, 
            status: 'Active', 
            initials, 
            color: '#4B7BEC',
            password: regPassword,
            joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            acceptedAt: new Date().toLocaleDateString('en-GB'),
            lastLogin: new Date().toISOString(),
            emailVerified: true
          }];
        });
      }

      if (setInvitationPrefill) setInvitationPrefill(null);
      setStatusMessage({ type: 'success', text: 'Account activated successfully! Redirecting...' });
      
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(targetEmail, assignedRole);
        }
      }, 1000);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'transparent' }}>
      
      {/* Language Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.7)', 
            cursor: 'pointer', 
            padding: '0.4rem 0.8rem', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '6px', 
            backgroundColor: 'rgba(255,255,255,0.02)' 
          }} 
          onClick={() => alert('Language options: English')}
        >
          <Globe size={14} color="#F5D76E" />
          <span>English</span>
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
        </div>
      </div>

      {/* STEP: Standard Login */}
      {flowStep === 'login' && (
        <>
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              <span style={{ color: '#F5D76E' }}>Welcome back</span> to OYEN GRID.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Sign in to access your organization workspace.
            </p>
          </div>

          {statusMessage && (
            <div style={{
              padding: '0.8rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              color: '#ef4444',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left'
            }}>
              <AlertCircle size={16} />
              <span style={{ flex: 1 }}>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSignInSubmit} noValidate style={{ textAlign: 'left' }}>
            {/* Work Email Field */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="signin-email-input" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="signin-email-input"
                  type="email"
                  className="form-input"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="signin-password-input" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="signin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.password}
                </span>
              )}
            </div>

            {/* Options Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#F5D76E', cursor: 'pointer' }}
                  disabled={isLoading}
                />
                Remember me
              </label>
              <span 
                onClick={() => alert('Password recovery email sent (simulation).')} 
                style={{ color: '#F5D76E', fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot password?
              </span>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              className="submit-btn"
              style={{
                background: '#F5D76E',
                border: '1px solid #F5D76E',
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
                transition: 'all 0.2s ease',
                marginBottom: '1.5rem'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </button>
          </form>

          {/* Have an Invitation? Section (with Role Dropdown and Code) */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>Have an Invitation?</h3>
            
            {/* Sign in As / Role Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Sign in As</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (errors.role) setErrors({ ...errors, role: '' });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    appearance: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="" style={{ backgroundColor: '#090a0f', color: 'rgba(255,255,255,0.4)' }}>Select your role</option>
                  <option value="Organization Owner" style={{ backgroundColor: '#090a0f' }}>Organization Owner</option>
                  <option value="Admin" style={{ backgroundColor: '#090a0f' }}>Admin</option>
                  <option value="Program Manager" style={{ backgroundColor: '#090a0f' }}>Program Manager</option>
                  <option value="Facilitator" style={{ backgroundColor: '#090a0f' }}>Facilitator</option>
                  <option value="Team Member" style={{ backgroundColor: '#090a0f' }}>Team Member</option>
                  <option value="Viewer" style={{ backgroundColor: '#090a0f' }}>Viewer</option>
                </select>
                <ChevronDown size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
              {errors.role && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.role}
                </span>
              )}
            </div>

            {/* Invitation Code */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Invitation Code</label>
              <div style={{ position: 'relative' }}>
                <Shield size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter invitation code (e.g. OYEN-FAC-XXXX)"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    if (errors.inviteCode) setErrors({ ...errors, inviteCode: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                />
              </div>
              {errors.inviteCode && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.inviteCode}
                </span>
              )}
            </div>

            {/* Continue Activation Button */}
            <button 
              type="button" 
              onClick={handleContinueInvite}
              style={{
                background: 'transparent',
                border: '1px solid #F5D76E',
                color: '#F5D76E',
                fontWeight: 700,
                borderRadius: '6px',
                padding: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem'
              }}
              disabled={isLoading}
            >
              <span>Continue Activation</span>
              <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
            </button>
          </div>

          {/* Create Organization Link */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', marginTop: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>New to OYEN GRID? </span>
            <span 
              onClick={() => onSwitchForm('portal')} 
              style={{ color: '#F5D76E', fontWeight: 600, cursor: 'pointer' }}
            >
              Create an organization →
            </span>
          </div>
        </>
      )}

      {/* STEP: Account Setup (Create Password & Name) */}
      {flowStep === 'invite-setup' && (
        <div className="animate-fade-in" style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              Account <span style={{ color: '#F5D76E' }}>Setup</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
              Set up your credentials to activate your workspace access as <strong>{role}</strong>.
            </p>
          </div>

          <form onSubmit={handleAccountSetupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Sarah Ahmed" 
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
              />
              {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.fullName}</span>}
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                readOnly
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'not-allowed' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                placeholder="Choose a password (min. 8 characters)" 
                value={regPassword}
                onChange={e => {
                  setRegPassword(e.target.value);
                  if (errors.regPassword) setErrors({ ...errors, regPassword: '' });
                }}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
              />
              {errors.regPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.regPassword}</span>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                value={regConfirmPassword}
                onChange={e => {
                  setRegConfirmPassword(e.target.value);
                  if (errors.regConfirmPassword) setErrors({ ...errors, regConfirmPassword: '' });
                }}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
              />
              {errors.regConfirmPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.regConfirmPassword}</span>}
            </div>

            {/* Submit btn */}
            <button 
              type="submit" 
              style={{ width: '100%', padding: '0.85rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : <>Create Account & Sign In <ArrowRight size={15} /></>}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setFlowStep('login');
                setRegPassword('');
                setRegConfirmPassword('');
              }}
              style={{ width: '100%', padding: '0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.25rem' }}
            >
              ← Back to Sign In
            </button>
          </form>
        </div>
      )}

      {/* Systems Status Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
        <span>All Systems Operational</span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span 
          style={{ color: '#F5D76E', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} 
          onClick={() => alert('View Status: All systems fully operational.')}
        >
          <ShieldCheck size={12} color="#F5D76E" /> View Status
        </span>
      </div>

      {/* Terms Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => alert('Navigating to Privacy Policy...')}>Privacy Policy</span>
        <span>|</span>
        <span style={{ cursor: 'pointer' }} onClick={() => alert('Navigating to Terms...')}>Terms of Service</span>
        <span>|</span>
        <span style={{ cursor: 'pointer' }} onClick={() => alert('Navigating to Support...')}>Support</span>
        <span>|</span>
        <span style={{ cursor: 'pointer' }} onClick={() => alert('Navigating to Contact Us...')}>Contact Us</span>
      </div>

    </div>
  );
}
