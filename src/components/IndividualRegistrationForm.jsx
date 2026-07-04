import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function IndividualRegistrationForm({ onSwitchForm, onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Name is required';
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatusMessage(null);

    // Simulate Registration
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        text: 'Individual account created successfully! Transitioning to your Grid workspace.'
      });
      setTimeout(() => {
        if (onComplete) {
          onComplete(email);
        }
      }, 1500);
    }, 1200);
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '440px' }}>
      <div className="form-header">
        <h2 className="form-title">Individual Signup</h2>
        <p className="form-subtitle">
          Join OYEN GRID as an independent learner • <span onClick={() => onSwitchForm('portal')}>Exit</span>
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type}`}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="ind-name">Full Name</label>
          <div className="input-container">
            <input
              id="ind-name"
              type="text"
              className="form-input"
              placeholder="Alex Mercer"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              disabled={isLoading}
            />
            <User className="input-icon" size={18} />
          </div>
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="ind-email">Email Address</label>
          <div className="input-container">
            <input
              id="ind-email"
              type="email"
              className="form-input"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              disabled={isLoading}
            />
            <Mail className="input-icon" size={18} />
          </div>
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="ind-pass">Password</label>
          <div className="input-container">
            <input
              id="ind-pass"
              type="password"
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
          </div>
          {errors.password && <span className="error-msg">{errors.password}</span>}
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              Sign Up <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
