import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Globe, User, ChevronDown, Shield, ShieldCheck } from 'lucide-react';

export default function SignInForm({ onSwitchForm, onAuthSuccess, teamMembers = [], setTeamMembers, programs = [], invitations = [], setInvitations }) {
  // Step flow state: 'login' | 'verify-email' | 'create-account'
  const [flowStep, setFlowStep] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [accessCode, setAccessCode] = useState('');

  // Facilitator Onboarding/Verification States
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // Validation States
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const validate = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatusMessage(null);

    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      // In Oyen Grid, facilitators or admins can login
      // Let's accept default admin or any valid team member credentials
      // Or check temporary facilitator credentials
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
        setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome back.' });
        if (onAuthSuccess) {
          const finalRole = matchingMember ? matchingMember.role : (role || 'Workspace Super Admin');
          setTimeout(() => onAuthSuccess(email, finalRole), 1000);
        }
      }
    }, 1200);
  };

  // Step 1: Verify Access Code
  const handleVerifyAccessCode = () => {
    if (!accessCode.trim()) {
      setErrors({ accessCode: 'Access code is required' });
      return;
    }

    const codeUpper = accessCode.trim().toUpperCase();
    const invite = invitations.find(i => i.accessCode.toUpperCase() === codeUpper);

    if (!invite) {
      setErrors({ accessCode: 'Invalid organization access code' });
      return;
    }

    if (invite.used) {
      setErrors({ accessCode: 'This access code has already been used' });
      return;
    }

    if (invite.expiresAt) {
      const expiryDate = new Date(invite.expiresAt);
      if (expiryDate < new Date()) {
        setErrors({ accessCode: 'This facilitator invitation has expired' });
        return;
      }
    }

    setErrors({});
    setVerifiedEmail(invite.email);
    setFlowStep('verify-email');
  };

  // Step 2: Verify Invitation Email
  const handleVerifyEmail = (e) => {
    e.preventDefault();
    if (!verifiedEmail) {
      setErrors({ verifiedEmail: 'Email is required' });
      return;
    }

    const invite = invitations.find(
      i => i.email.toLowerCase() === verifiedEmail.toLowerCase() && 
      i.accessCode.toUpperCase() === accessCode.trim().toUpperCase()
    );

    if (!invite) {
      setErrors({ verifiedEmail: "We couldn't find a facilitator invitation for this email." });
      return;
    }

    setErrors({});
    setFlowStep('create-account');
  };

  // Step 3: Create Account
  const handleCreateAccount = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!regPassword) newErrors.regPassword = 'Password is required';
    if (regPassword !== regConfirmPassword) newErrors.regConfirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Mark code as used
      if (setInvitations) {
        setInvitations(prev => prev.map(i => i.accessCode.toUpperCase() === accessCode.trim().toUpperCase() ? { ...i, used: true, status: 'Active' } : i));
      }

      // Register facilitator in team list if not already there
      if (setTeamMembers) {
        setTeamMembers(prev => {
          if (prev.some(m => m.email.toLowerCase() === verifiedEmail.toLowerCase())) {
            return prev.map(m => m.email.toLowerCase() === verifiedEmail.toLowerCase() ? { ...m, name: fullName, role: 'Facilitator', status: 'Active' } : m);
          }
          const parts = fullName.split(' ');
          const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
          return [...prev, { name: fullName, email: verifiedEmail, role: 'Facilitator', status: 'Active', initials, color: '#0284c7' }];
        });
      }

      if (onAuthSuccess) {
        onAuthSuccess(verifiedEmail, 'Facilitator');
      }
    }, 1000);
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

      {flowStep === 'login' && (
        <>
          {/* Main Form Title */}
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
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

          <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
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

          {/* Conditional Flow Step for Facilitator First-Time Access */}
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
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (errors.accessCode) setErrors({ ...errors, accessCode: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                />
              </div>
              {errors.accessCode && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.accessCode}
                </span>
              )}
              <button 
                type="button" 
                onClick={handleVerifyAccessCode}
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

          {/* Switch to portal */}
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

      {flowStep === 'verify-email' && (
        <div className="animate-fade-in" style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              Verify Your Organization Access
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
              Enter the email address connected to your facilitator invitation.
            </p>
          </div>

          <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Facilitator Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@organization.com"
                  value={verifiedEmail}
                  onChange={(e) => {
                    setVerifiedEmail(e.target.value);
                    if (errors.verifiedEmail) setErrors({ ...errors, verifiedEmail: '' });
                  }}
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
                />
              </div>
              {errors.verifiedEmail && (
                <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={12} /> {errors.verifiedEmail}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setFlowStep('login')} 
                style={{ flex: 1, padding: '0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Back
              </button>
              <button 
                type="submit" 
                style={{ flex: 2, padding: '0.85rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>
      )}

      {flowStep === 'create-account' && (
        <div className="animate-fade-in" style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              Create Your Facilitator Account
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
              Set up your facilitator credentials to activate your workspace access.
            </p>
          </div>

          <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Ada Lovelace" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
              />
              {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.fullName}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                value={verifiedEmail}
                readOnly
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                placeholder="Choose a password" 
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
              />
              {errors.regPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.regPassword}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem', fontWeight: 600 }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                value={regConfirmPassword}
                onChange={e => setRegConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
              />
              {errors.regConfirmPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.regConfirmPassword}</span>}
            </div>

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

      {/* Status Row */}
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

      {/* Footer link row */}
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
