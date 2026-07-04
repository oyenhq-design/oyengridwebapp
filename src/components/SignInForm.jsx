import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignInForm({ onSwitchForm, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // For demonstration, let's allow access
      if (email === 'admin@oyengrid.com' && password === 'password123') {
        setStatusMessage({ type: 'success', text: 'Authentication successful! Welcome to OYEN GRID.' });
        if (onAuthSuccess) {
          setTimeout(() => onAuthSuccess(email), 1200);
        }
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: 'Invalid credentials. Hint: use admin@oyengrid.com / password123' 
        });
      }
    }, 1500);
  };

  return (
    <div className="form-card animate-fade-in">
      <div className="form-header">
        <h2 className="form-title">Welcome back</h2>
        <p className="form-subtitle">
          New to OYEN GRID? <span onClick={() => onSwitchForm('portal')}>Register account</span>
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
        {/* Email Field */}
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

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password-input">Password</label>
          <div className="input-container">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Enter your password"
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

        {/* Remember Me & Forgot Password */}
        <div className="options-bar">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            Remember me
          </label>
          <span className="forgot-link" onClick={() => onSwitchForm('forgot')}>
            Forgot password?
          </span>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
