import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Building2, KeyRound, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

export default function InvitedUserForm({ onSwitchForm, onComplete }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    orgId: '',
    inviteCode: '',
    email: '',
    password: '',
    confirmPassword: '',
    mfaToken: ''
  });

  const [mfaSecret, setMfaSecret] = useState('');

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validateStep1 = () => {
    const tempErrors = {};
    if (!formData.orgId.trim()) {
      tempErrors.orgId = 'Organization ID / Code is required';
    } else if (!/^ORG-[A-Z0-9]{6}$/i.test(formData.orgId) && formData.orgId !== 'ORG-43A81Q') {
      tempErrors.orgId = 'Enter a valid ID (e.g. ORG-43A81Q)';
    }

    if (!formData.inviteCode.trim()) {
      tempErrors.inviteCode = 'Invitation Code is required';
    } else if (!/^(EMP|FAC|MGR)-\d{5}$/i.test(formData.inviteCode) && formData.inviteCode !== 'EMP-20483' && formData.inviteCode !== 'FAC-93822') {
      tempErrors.inviteCode = 'Enter a valid invite code (e.g. EMP-20483 or FAC-93822)';
    }

    if (!formData.email) {
      tempErrors.email = 'Corporate Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Enter a valid corporate email';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep2 = () => {
    const tempErrors = {};
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.mfaToken) {
      tempErrors.mfaToken = 'Authenticator code is required';
    } else if (!/^\d{6}$/.test(formData.mfaToken)) {
      tempErrors.mfaToken = 'MFA code must be exactly 6 digits';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!validateStep1()) return;

      setIsLoading(true);
      setStatusMessage(null);

      // Verify Org and Invite Code
      setTimeout(() => {
        setIsLoading(false);
        // Generate a mock MFA secret key
        const secret = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join(' ');
        setMfaSecret(secret);
        setStep(2);
      }, 1200);
    } else if (step === 2) {
      if (!validateStep2()) return;

      setIsLoading(true);
      setStatusMessage(null);

      // Verify and register
      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage({
          type: 'success',
          text: 'Account verified and configured with Multi-Factor Authentication!'
        });
        setTimeout(() => {
          if (onComplete) {
            onComplete(formData.email);
          }
        }, 1500);
      }, 1500);
    }
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '500px' }}>
      <div className="form-header">
        <h2 className="form-title">Join Organization</h2>
        <p className="form-subtitle">
          Onboard using your corporate invite • <span onClick={() => onSwitchForm('portal')}>Back to portal</span>
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type}`}>
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Progress Node */}
      <div className="wizard-steps">
        <div className={`wizard-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`wizard-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
      </div>

      <form onSubmit={handleNext} noValidate>
        {step === 1 ? (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 1: Invitation Verification</h3>
            
            {/* Org Code */}
            <div className="form-group">
              <label className="form-label" htmlFor="org-id">Organization ID / Access Code</label>
              <div className="input-container">
                <input
                  id="org-id"
                  type="text"
                  className="form-input"
                  placeholder="e.g. ORG-43A81Q"
                  value={formData.orgId}
                  onChange={(e) => handleInputChange('orgId', e.target.value)}
                  disabled={isLoading}
                />
                <Building2 className="input-icon" size={18} />
              </div>
              {errors.orgId && <span className="error-msg">{errors.orgId}</span>}
            </div>

            {/* Invite Code */}
            <div className="form-group">
              <label className="form-label" htmlFor="invite-code">Invitation Code (Employee / Facilitator)</label>
              <div className="input-container">
                <input
                  id="invite-code"
                  type="text"
                  className="form-input"
                  placeholder="e.g. EMP-20483 or FAC-93822"
                  value={formData.inviteCode}
                  onChange={(e) => handleInputChange('inviteCode', e.target.value)}
                  disabled={isLoading}
                />
                <KeyRound className="input-icon" size={18} />
              </div>
              {errors.inviteCode && <span className="error-msg">{errors.inviteCode}</span>}
            </div>

            {/* Corporate Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="invite-email">Your Work Email</label>
              <div className="input-container">
                <input
                  id="invite-email"
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                />
                <Mail className="input-icon" size={18} />
              </div>
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 2: Password & MFA Setup</h3>
            
            {/* Passwords */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="invite-pass">Create Password</label>
                <div className="input-container">
                  <input
                    id="invite-pass"
                    type="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                  />
                  <Lock className="input-icon" size={18} />
                </div>
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="invite-confirm">Confirm Password</label>
                <div className="input-container">
                  <input
                    id="invite-confirm"
                    type="password"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                  />
                  <Lock className="input-icon" size={18} />
                </div>
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* MFA Setup Box */}
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-input)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <QrCode size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Multi-Factor Authentication (MFA)</span>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Scan the QR code in your Authenticator app (Google Authenticator / Duo) or use the Setup Key:
              </p>

              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                padding: '0.5rem',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '4px',
                textAlign: 'center',
                letterSpacing: '1px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '0.75rem'
              }}>
                {mfaSecret}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="mfa-token">Enter Authenticator 6-Digit Code</label>
                <div className="input-container">
                  <input
                    id="mfa-token"
                    type="text"
                    maxLength={6}
                    className="form-input"
                    placeholder="123456"
                    value={formData.mfaToken}
                    onChange={(e) => handleInputChange('mfaToken', e.target.value.replace(/\D/g,''))}
                    disabled={isLoading}
                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem' }}
                  />
                  <Lock className="input-icon" size={18} />
                </div>
                {errors.mfaToken && <span className="error-msg">{errors.mfaToken}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="wizard-footer-buttons">
          {step > 1 && (
            <button type="button" className="secondary-btn" onClick={() => setStep(1)} disabled={isLoading}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                {step === 1 ? 'Verify Invitation' : 'Finalize Onboarding'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
