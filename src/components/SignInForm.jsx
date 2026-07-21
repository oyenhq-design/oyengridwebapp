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
  // flowStep states: 'login' | 'invite-verify' | 'invite-setup'
  const [flowStep, setFlowStep] = useState(invitationPrefill ? 'invite-verify' : 'login');

  // Input states for standard login
  const [email, setEmail] = useState(invitationPrefill ? invitationPrefill.email : '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');

  // Input states for invitation flow
  const [inviteEmail, setInviteEmail] = useState(invitationPrefill ? invitationPrefill.email : '');
  const [inviteCode, setInviteCode] = useState(invitationPrefill ? invitationPrefill.inviteCode : '');
  const [fullName, setFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [matchedInvitation, setMatchedInvitation] = useState(null);

  // Loader & status states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Validate Standard Sign-In Form
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

  // Handle Standard Sign-In Submit
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const targetEmail = email.trim().toLowerCase();
      
      // 1. Search for the account in the workspace
      const matchingMember = teamMembers.find(m => m.email.toLowerCase() === targetEmail);
      const pendingInvite = invitations.find(i => i.email.toLowerCase() === targetEmail && !i.used);

      if (!matchingMember && !pendingInvite) {
        setStatusMessage({
          type: 'error',
          text: 'This account does not exist in this workspace.'
        });
        return;
      }

      // 2. Check if the account has not been activated yet
      if (pendingInvite && (!matchingMember || matchingMember.status === 'Pending')) {
        setStatusMessage({
          type: 'error',
          text: 'Your invitation has not been activated yet. Please complete your invitation before signing in.'
        });
        return;
      }

      // 3. Verify user's assigned role
      const actualRole = matchingMember.role;
      if (role && role !== actualRole) {
        setStatusMessage({
          type: 'error',
          text: 'You do not have permission to sign in using this role.'
        });
        return;
      }

      // 4. Verify password
      // Default credentials fallback for owner (admin@oyengrid.com or initial owner)
      const isOwnerDefault = (targetEmail === 'admin@oyengrid.com' || actualRole === 'Organization Owner');
      const expectedPassword = matchingMember.password || (isOwnerDefault ? 'password123' : null);

      if (!expectedPassword || password !== expectedPassword) {
        setStatusMessage({
          type: 'error',
          text: 'Invalid email or password. Please try again.'
        });
        return;
      }

      // 5. Account is Active and credentials are correct
      setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome back.' });
      
      // Update last login
      if (setTeamMembers) {
        setTeamMembers(prev => prev.map(m => m.email.toLowerCase() === targetEmail ? { ...m, lastLogin: new Date().toISOString() } : m));
      }

      if (onAuthSuccess) {
        setTimeout(() => onAuthSuccess(targetEmail, actualRole), 1000);
      }
    }, 1200);
  };

  // Step 1: Verify Email and Invitation Code
  const handleVerifyInvite = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!inviteEmail) {
      newErrors.inviteEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      newErrors.inviteEmail = 'Please enter a valid email address';
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
      const targetEmail = inviteEmail.trim().toLowerCase();

      // Find invitation by code (support standard codes and fallback email matching)
      const invite = invitations.find(i => i.accessCode.toUpperCase() === codeUpper);

      if (!invite) {
        setErrors({ inviteCode: 'Invalid invitation code.' });
        return;
      }

      if (invite.email.toLowerCase() !== targetEmail) {
        setErrors({ inviteEmail: 'This email does not match the invitation record.' });
        return;
      }

      if (invite.used) {
        setErrors({ inviteCode: 'This invitation has already been accepted/used.' });
        return;
      }

      if (invite.expiresAt) {
        const expiryDate = new Date(invite.expiresAt);
        if (expiryDate < new Date()) {
          setErrors({ inviteCode: 'This invitation has expired.' });
          return;
        }
      }

      // Valid invitation
      setErrors({});
      setMatchedInvitation(invite);
      
      // Pre-fill name from invite if present
      if (invite.name) {
        setFullName(invite.name);
      } else {
        const prefix = invite.email.split('@')[0];
        setFullName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
      }
      setFlowStep('invite-setup');
    }, 1200);
  };

  // Step 2 & 3: Account Setup and Account Activation
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

      // 1. Mark invitation as used
      if (setInvitations) {
        setInvitations(prev => prev.map(i => 
          i.accessCode.toUpperCase() === inviteCodeVal.toUpperCase() 
            ? { ...i, used: true, status: 'Active', acceptedAt: new Date().toLocaleDateString('en-GB') } 
            : i
        ));
      }

      // 2. Add/Update member in team roster
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

      // 3. Clear prefill context & log in
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

      {/* STEP: Standard Sign-In Login */}
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
              backgroundColor: statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)',
              border: statusMessage.type === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '6px',
              color: statusMessage.type === 'error' ? '#ef4444' : '#22c55e',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left'
            }}>
              {statusMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span style={{ flex: 1 }}>{statusMessage.text}</span>
              {statusMessage.text.includes('activate') && (
                <button 
                  onClick={() => {
                    setInviteEmail(email);
                    setFlowStep('invite-verify');
                    setStatusMessage(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#F5D76E', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', padding: 0 }}
                >
                  Activate Now
                </button>
              )}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
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
                transition: 'all 0.2s ease'
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

          {/* OR Separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0', color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></span>
            <span>OR</span>
            <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></span>
          </div>

          {/* Sign in as role select */}
          <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Sign in as</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
          </div>

          {/* Go to Invitation Verification link */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', marginTop: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Received an invitation? </span>
            <span 
              onClick={() => {
                setStatusMessage(null);
                setFlowStep('invite-verify');
              }} 
              style={{ color: '#F5D76E', fontWeight: 600, cursor: 'pointer' }}
            >
              Activate Invitation →
            </span>
          </div>
        </>
      )}

      {/* STEP: Verify Invitation Code, Email */}
      {flowStep === 'invite-verify' && (
        <>
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              Accept <span style={{ color: '#F5D76E' }}>Invitation</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Verify invitation credentials to access your organization workspace.
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
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleVerifyInvite} noValidate style={{ textAlign: 'left' }}>
            {/* Work Email Field */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  value={inviteEmail}
                  placeholder="name@organization.com"
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (errors.inviteEmail) setErrors({ ...errors, inviteEmail: '' });
                  }}
                  style={{ 
                    paddingLeft: '2.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    borderColor: 'rgba(255,255,255,0.08)', 
                    color: '#fff', 
                    borderRadius: '6px'
                  }}
                  disabled={isInvited}
                />
              </div>
              {errors.inviteEmail && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.inviteEmail}
                </span>
              )}
            </div>

            {/* Invitation Code Field */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Invitation Code / Access Code</label>
              <div style={{ position: 'relative' }}>
                <Shield size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your invitation code (e.g. OYEN-FAC-8K4M9Q)"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    if (errors.inviteCode) setErrors({ ...errors, inviteCode: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                  disabled={isLoading}
                />
              </div>
              {errors.inviteCode && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.inviteCode}
                </span>
              )}
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
                transition: 'all 0.2s ease'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Verify Invitation</span>
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </button>
          </form>

          {/* Cancel Option */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', marginTop: '1.5rem' }}>
            <span 
              onClick={() => {
                if (setInvitationPrefill) setInvitationPrefill(null);
                setFlowStep('login');
              }} 
              style={{ color: '#F5D76E', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Cancel & Sign In Normally
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
              Set up your credentials to activate your workspace access as <strong>{assignedRole}</strong>.
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
                value={verifiedEmail}
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
              {isLoading ? <span className="spinner" /> : <>Activate Account & Sign In <ArrowRight size={15} /></>}
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
