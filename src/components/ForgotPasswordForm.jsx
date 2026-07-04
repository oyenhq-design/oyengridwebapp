import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordForm({ onSwitchForm }) {
  const [email, setEmail] = useState('');
  
  // Validation States
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatusMessage(null);

    // Simulate recovery email submission
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        text: 'If that email exists in our system, we have sent instructions to reset your password.'
      });
    }, 1500);
  };

  return (
    <div className="form-card animate-fade-in">
      <div className="form-header">
        <h2 className="form-title">Reset password</h2>
        <p className="form-subtitle">
          Enter your email to receive recovery instructions.
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
          <label className="form-label" htmlFor="reset-email-input">Work Email</label>
          <div className="input-container">
            <input
              id="reset-email-input"
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

        {/* Submit */}
        <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }} disabled={isLoading}>
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              Send Instructions <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Back to Sign In */}
        <span className="back-link" onClick={() => onSwitchForm('signin')}>
          <ArrowLeft size={16} /> Back to sign in
        </span>
      </form>
    </div>
  );
}
