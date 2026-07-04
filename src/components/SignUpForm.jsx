import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignUpForm({ onSwitchForm }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Form states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!organization.trim()) newErrors.organization = 'Organization name is required';
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatusMessage(null);

    // Simulate API registration
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        text: 'Organization registered successfully! Verification email sent.'
      });
      setTimeout(() => {
        onSwitchForm('signin');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="form-card animate-fade-in">
      <div className="form-header">
        <h2 className="form-title">Create account</h2>
        <p className="form-subtitle">
          Already have an account? <span onClick={() => onSwitchForm('signin')}>Sign in</span>
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type}`}>
          {statusMessage.type === 'error' ? (
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name-input">Full Name</label>
          <div className="input-container">
            <input
              id="name-input"
              type="text"
              className="form-input"
              placeholder="Sarah Connor"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              disabled={isLoading}
            />
            <User className="input-icon" size={18} />
          </div>
          {errors.fullName && (
            <span className="error-msg">
              <AlertCircle size={12} /> {errors.fullName}
            </span>
          )}
        </div>

        {/* Work Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">Work Email</label>
          <div className="input-container">
            <input
              id="email-input"
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              disabled={isLoading}
            />
            <Mail className="input-icon" size={18} />
          </div>
          {errors.email && (
            <span className="error-msg">
              <AlertCircle size={12} /> {errors.email}
            </span>
          )}
        </div>

        {/* Organization Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="org-input">Organization Name</label>
          <div className="input-container">
            <input
              id="org-input"
              type="text"
              className="form-input"
              placeholder="Cyberdyne Systems"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                if (errors.organization) setErrors({ ...errors, organization: '' });
              }}
              disabled={isLoading}
            />
            <Briefcase className="input-icon" size={18} />
          </div>
          {errors.organization && (
            <span className="error-msg">
              <AlertCircle size={12} /> {errors.organization}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password-input">Password</label>
          <div className="input-container">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              disabled={isLoading}
            />
            <Lock className="input-icon" size={18} />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="error-msg">
              <AlertCircle size={12} /> {errors.password}
            </span>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="options-bar" style={{ marginBottom: '1.5rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
              }}
              disabled={isLoading}
            />
            I agree to the Terms of Service and Privacy Policy.
          </label>
          {errors.agreeTerms && (
            <span className="error-msg">
              <AlertCircle size={12} /> {errors.agreeTerms}
            </span>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              Register Organization <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
