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
  // Determine if starting in invitation acceptance mode
  const isInvited = !!invitationPrefill;

  // Resolve role from invitation code prefix or invitations state
  const getPredefinedRole = () => {
    if (!invitationPrefill) return '';
    const targetCode = invitationPrefill.inviteCode || '';
    const targetEmail = invitationPrefill.email || '';
    
    const invite = invitations.find(i => 
      (i.accessCode && i.accessCode.toUpperCase() === targetCode.toUpperCase()) ||
      (i.email && i.email.toLowerCase() === targetEmail.toLowerCase())
    );
    if (invite) return invite.role;

    // Fallback based on code prefix
    const codeUpper = targetCode.toUpperCase();
    if (codeUpper.startsWith('ADM')) return 'Organization Admin';
    if (codeUpper.startsWith('MGR')) return 'Programme Manager';
    if (codeUpper.startsWith('FAC')) return 'Facilitator';
    if (codeUpper.startsWith('TRN')) return 'Trainer';
    if (codeUpper.startsWith('EMP')) return 'Employee';
    if (codeUpper.startsWith('LRN')) return 'Participant';
    return 'Participant';
  };

  // Flow step state: 'login' | 'invite-verify' | 'invite-setup' | 'verify-email' | 'create-account'
  const [flowStep, setFlowStep] = useState(isInvited ? 'invite-verify' : 'login');

  // Input states
  const [email, setEmail] = useState(invitationPrefill ? invitationPrefill.email : '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(invitationPrefill ? getPredefinedRole() : '');
  const [accessCode, setAccessCode] = useState(invitationPrefill ? invitationPrefill.inviteCode : '');

  // Setup account states
  const [verifiedEmail, setVerifiedEmail] = useState(invitationPrefill ? invitationPrefill.email : '');
  const [fullName, setFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [assignedRole, setAssignedRole] = useState(invitationPrefill ? getPredefinedRole() : '');

  // Facilitator legacy access steps
  const [legacyAccessCode, setLegacyAccessCode] = useState('');

  // Status and loader states
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
      const matchingMember = teamMembers.find(m => m.email.toLowerCase() === email.toLowerCase());
      
      if (email.toLowerCase() === 'facilitator@oyengrid.test' && password === 'Oyen@1234') {
        setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome back.' });
        if (onAuthSuccess) {
          setTimeout(() => onAuthSuccess(email, 'Facilitator'), 1000);
        }
      } else if (email === 'admin@oyengrid.com' && password !== 'password123') {
        setStatusMessage({ 
          type: 'error', 
          text: 'Invalid credentials. Hint: use admin@oyengrid.com / password123' 
        });
      } else {
        // Allow login of active members or admins
        if (matchingMember && matchingMember.status === 'Suspended') {
          setStatusMessage({ type: 'error', text: 'Your account access has been suspended by the administrator.' });
          return;
        }
        setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome back.' });
        if (onAuthSuccess) {
          const finalRole = matchingMember ? matchingMember.role : (role || 'Workspace Super Admin');
          setTimeout(() => onAuthSuccess(email, finalRole), 1000);
        }
      }
    }, 1200);
  };

  // Step 1: Verify Invitation Access Codes
  const handleVerifyInvite = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!accessCode) {
      newErrors.accessCode = 'Invitation Code is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const codeUpper = accessCode.trim().toUpperCase();
      const targetEmail = email.trim().toLowerCase();

      // Find invitation by code
      const invite = invitations.find(i => i.accessCode.toUpperCase() === codeUpper);

      if (!invite) {
        setErrors({ accessCode: 'Invalid invitation code' });
        return;
      }

      if (invite.email.toLowerCase() !== targetEmail) {
        setErrors({ email: 'This email does not match the invitation record' });
        return;
      }

      if (invite.role !== role) {
        setErrors({ role: 'Selected role does not match your invitation' });
        return;
      }

      if (invite.used) {
        setErrors({ accessCode: 'This invitation has already been accepted/used' });
        return;
      }

      if (invite.expiresAt) {
        const expiryDate = new Date(invite.expiresAt);
        if (expiryDate < new Date()) {
          setErrors({ accessCode: 'This invitation has expired' });
          return;
        }
      }

      // Valid invitation! Go to setup step
      setErrors({});
      setVerifiedEmail(invite.email);
      setAssignedRole(invite.role);
      
      // Auto-prefill name if present in invite
      if (invite.name) {
        setFullName(invite.name);
      } else {
        const prefix = invite.email.split('@')[0];
        setFullName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
      }
      setFlowStep('invite-setup');
    }, 1200);
  };

  // Step 2: Account Setup (Register User and Mark Used)
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
      
      // 1. Mark invitation as used
      if (setInvitations) {
        setInvitations(prev => prev.map(i => 
          i.accessCode.toUpperCase() === accessCode.trim().toUpperCase() ? { ...i, used: true, status: 'Active' } : i
        ));
      }

      // 2. Add member to team roster
      if (setTeamMembers) {
        setTeamMembers(prev => {
          const exists = prev.some(m => m.email.toLowerCase() === verifiedEmail.toLowerCase());
          if (exists) {
            return prev.map(m => m.email.toLowerCase() === verifiedEmail.toLowerCase() 
              ? { ...m, name: fullName, role: assignedRole, status: 'Active' } 
              : m
            );
          }
          const parts = fullName.split(' ');
          const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
          return [...prev, { 
            name: fullName, 
            email: verifiedEmail, 
            role: assignedRole, 
            status: 'Active', 
            initials, 
            color: '#4B7BEC',
            joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          }];
        });
      }

      // 3. Clear prefill context & log in
      if (setInvitationPrefill) setInvitationPrefill(null);
      
      setStatusMessage({ type: 'success', text: 'Account activated successfully! Redirecting...' });
      
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(verifiedEmail, assignedRole);
        }
      }, 1000);
    }, 1500);
  };

  // Legacy Facilitator Verification
  const handleVerifyLegacyAccessCode = () => {
    if (!legacyAccessCode.trim()) {
      setErrors({ legacyAccessCode: 'Access code is required' });
      return;
    }

    const codeUpper = legacyAccessCode.trim().toUpperCase();
    const invite = invitations.find(i => i.accessCode.toUpperCase() === codeUpper);

    if (!invite) {
      setErrors({ legacyAccessCode: 'Invalid organization access code' });
      return;
    }

    if (invite.used) {
      setErrors({ legacyAccessCode: 'This access code has already been used' });
      return;
    }

    if (invite.expiresAt) {
      const expiryDate = new Date(invite.expiresAt);
      if (expiryDate < new Date()) {
        setErrors({ legacyAccessCode: 'This facilitator invitation has expired' });
        return;
      }
    }

    setErrors({});
    setVerifiedEmail(invite.email);
    setAssignedRole('Facilitator');
    setAccessCode(legacyAccessCode);
    setFlowStep('invite-setup');
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
              <span>{statusMessage.text}</span>
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
                <option value="Workspace Super Admin" style={{ backgroundColor: '#090a0f' }}>Workspace Super Admin</option>
                <option value="Organization Owner" style={{ backgroundColor: '#090a0f' }}>Organization Owner</option>
                <option value="Programme Manager" style={{ backgroundColor: '#090a0f' }}>Programme Manager</option>
                <option value="Facilitator" style={{ backgroundColor: '#090a0f' }}>Facilitator</option>
                <option value="Team Member" style={{ backgroundColor: '#090a0f' }}>Team Member</option>
              </select>
              <ChevronDown size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Conditional Flow Step for Facilitator Legacy Onboarding */}
          {role === 'Facilitator' && (
            <div className="form-group animate-fade-in" style={{ marginBottom: '1.75rem', textAlign: 'left', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <label className="form-label" htmlFor="access-code-input" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Organization Access Code</label>
              <div style={{ position: 'relative' }}>
                <Shield size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="access-code-input"
                  type="text"
                  className="form-input"
                  placeholder="Enter organization code for first-time setup"
                  value={legacyAccessCode}
                  onChange={(e) => {
                    setLegacyAccessCode(e.target.value);
                    if (errors.legacyAccessCode) setErrors({ ...errors, legacyAccessCode: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                />
              </div>
              {errors.legacyAccessCode && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.legacyAccessCode}
                </span>
              )}
              <button 
                type="button" 
                onClick={handleVerifyLegacyAccessCode}
                style={{ 
                  marginTop: '1rem', width: '100%', padding: '0.75rem', backgroundColor: 'transparent',
                  border: '1px solid #F5D76E', color: '#F5D76E', borderRadius: '6px', fontWeight: 600,
                  fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' 
                }}
              >
                Verify & Onboard Facilitator <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Switch to signup / Create Org */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', marginTop: '1.5rem' }}>
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

      {/* STEP: Verify Invitation Code, Email, and Selected Role */}
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
            {/* Work Email Field (Locked/Prefilled) */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  readOnly
                  style={{ 
                    paddingLeft: '2.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.04)', 
                    borderColor: 'rgba(255,255,255,0.08)', 
                    color: 'rgba(255,255,255,0.5)', 
                    borderRadius: '6px',
                    cursor: 'not-allowed'
                  }}
                  disabled={true}
                />
              </div>
              {errors.email && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Invitation Code / Organization Access Code Field */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Invitation Code / Organization Access Code</label>
              <div style={{ position: 'relative' }}>
                <Shield size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your invitation code (e.g. ADM-20483)"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (errors.accessCode) setErrors({ ...errors, accessCode: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                  disabled={isLoading}
                />
              </div>
              {errors.accessCode && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.accessCode}
                </span>
              )}
            </div>

            {/* Role Dropdown Selector (Locked/Prefilled) */}
            <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Invited Role</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  value={role}
                  disabled={true}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px',
                    appearance: 'none',
                    cursor: 'not-allowed',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value={role}>{role || 'Select role'}</option>
                </select>
                <ChevronDown size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
              {errors.role && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.role}
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

      {/* STEP: Account Setup */}
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

          {statusMessage && (
            <div style={{
              padding: '0.8rem 1rem',
              backgroundColor: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '6px',
              color: '#22c55e',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left'
            }}>
              <CheckCircle2 size={16} />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleAccountSetupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Ada Lovelace" 
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
              {isLoading ? <span className="spinner" /> : <>Create Account & Sign In <ArrowRight size={15} /></>}
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
