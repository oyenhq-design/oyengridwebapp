import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Globe, User, ChevronDown, Shield, ShieldCheck } from 'lucide-react';

export default function SignInForm({ onSwitchForm, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [accessCode, setAccessCode] = useState('');
  
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
      // Allow admin@oyengrid.com / password123 as default credentials,
      // but also accept other inputs for flexible demo testing
      if (email === 'admin@oyengrid.com' && password !== 'password123') {
        setStatusMessage({ 
          type: 'error', 
          text: 'Invalid credentials. Hint: use admin@oyengrid.com / password123' 
        });
      } else {
        setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome back.' });
        if (onAuthSuccess) {
          const finalRole = role || 'Workspace Super Admin';
          setTimeout(() => onAuthSuccess(email, finalRole), 1000);
        }
      }
    }, 1200);
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
          <Globe size={14} color="#D4AF37" />
          <span>English</span>
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
        </div>
      </div>

      {/* Main Form Title */}
      <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
          <span style={{ color: '#D4AF37' }}>Welcome back</span> to OYEN GRID.
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
              style={{ accentColor: '#D4AF37', cursor: 'pointer' }}
              disabled={isLoading}
            />
            Remember me
          </label>
          <span 
            onClick={() => alert('Password recovery email sent (simulation).')} 
            style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }}
          >
            Forgot password?
          </span>
        </div>

        {/* Submit button */}
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
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem', display: 'block', lineHeight: 1.35 }}>
          Facilitators and Team Members may be required to enter an organization access code.
        </span>
      </div>

      {/* Organization Access Code input */}
      <div className="form-group" style={{ marginBottom: '1.75rem', textAlign: 'left' }}>
        <label className="form-label" htmlFor="access-code-input" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem' }}>Organization Access Code (optional)</label>
        <div style={{ position: 'relative' }}>
          <Shield size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            id="access-code-input"
            type="text"
            className="form-input"
            placeholder="Enter access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            style={{ paddingLeft: '2.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px' }}
          />
        </div>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem', display: 'block' }}>Enter the access code provided by your organization.</span>
      </div>

      {/* Switch to portal */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>New to OYEN GRID? </span>
        <span 
          onClick={() => onSwitchForm('portal')} 
          style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer' }}
        >
          Create an organization →
        </span>
      </div>

      {/* Status Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
        <span>All Systems Operational</span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span 
          style={{ color: '#D4AF37', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} 
          onClick={() => alert('View Status: All systems fully operational.')}
        >
          <ShieldCheck size={12} color="#D4AF37" /> View Status
        </span>
      </div>

      {/* Footer link row separated by vertical lines */}
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
