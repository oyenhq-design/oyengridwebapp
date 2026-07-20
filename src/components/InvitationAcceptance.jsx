import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Building2, KeyRound, ArrowRight, ArrowLeft, QrCode } from 'lucide-react';

export default function InvitationAcceptance({ onSwitchForm, onComplete }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    orgId: sessionStorage.getItem('prefill_orgId') || '',
    inviteCode: sessionStorage.getItem('prefill_inviteCode') || '',
    email: sessionStorage.getItem('prefill_email') || '',
    password: '',
    confirmPassword: '',
    mfaToken: ''
  });

  const [mfaSecret, setMfaSecret] = useState('');
  const [assignedRole, setAssignedRole] = useState('Programme Manager'); // Defaults based on code prefix

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validateStep1 = () => {
    const tempErrors = {};
    if (!formData.orgId.trim()) {
      tempErrors.orgId = 'Organization Code / ID is required';
    } else if (!/^ORG-[A-Z0-9]{6}$/i.test(formData.orgId) && formData.orgId !== 'ORG-43A81Q') {
      tempErrors.orgId = 'Enter a valid ID (e.g. ORG-43A81Q)';
    }

    if (!formData.inviteCode.trim()) {
      tempErrors.inviteCode = 'Invitation Code is required';
    } else if (!/^(ADM|MGR|FAC|TRN|EMP|LRN)-[A-Z0-9]{5,6}$/i.test(formData.inviteCode) && !/^OYEN-FAC-[A-Z0-9]{6}$/i.test(formData.inviteCode) && formData.inviteCode !== 'EMP-20483' && formData.inviteCode !== 'FAC-93822' && formData.inviteCode !== 'ADM-20483' && formData.inviteCode !== 'MGR-49211') {
      tempErrors.inviteCode = 'Enter a valid code (e.g. OYEN-FAC-8D4K2P or ADM-20483)';
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
      tempErrors.mfaToken = 'MFA verification code is required';
    } else if (!/^\d{6}$/.test(formData.mfaToken)) {
      tempErrors.mfaToken = 'Code must be 6 digits';
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
        // Mapped role from prefix
        const code = formData.inviteCode.toUpperCase();
        if (code.startsWith('ADM')) setAssignedRole('Organization Admin');
        else if (code.startsWith('MGR')) setAssignedRole('Programme Manager');
        else if (code.startsWith('FAC')) setAssignedRole('Facilitator');
        else if (code.startsWith('TRN')) setAssignedRole('Trainer');
        else if (code.startsWith('EMP')) setAssignedRole('Employee');
        else if (code.startsWith('LRN')) setAssignedRole('Participant');
        else setAssignedRole('Participant');

        const secret = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join(' ');
        setMfaSecret(secret);
        setStep(2);
      }, 1200);
    } else if (step === 2) {
      if (!validateStep2()) return;

      setIsLoading(true);
      setStatusMessage(null);

      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage({
          type: 'success',
          text: `Onboarding completed! Welcome to OYEN GRID as ${assignedRole}.`
        });
        setTimeout(() => {
          if (onComplete) {
            onComplete(formData.email, assignedRole);
          }
        }, 1500);
      }, 1500);
    }
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '500px' }}>
      <div className="form-header">
        <h2 className="form-title">Accept Invitation</h2>
        <p className="form-subtitle">
          Activate your organization workspace profile • <span onClick={() => onSwitchForm('portal')}>Back to portal</span>
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type}`}>
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Progress Wizard */}
      <div className="wizard-steps">
        <div className={`wizard-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`wizard-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
      </div>

      <form onSubmit={handleNext} noValidate>
        {step === 1 ? (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 1: Verify Access Codes</h3>
            
            {/* Org ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="invite-org-id">Organization Code / ID</label>
              <div className="input-container">
                <input
                  id="invite-org-id"
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
              <label className="form-label" htmlFor="invite-token">Invitation Code</label>
              <div className="input-container">
                <input
                  id="invite-token"
                  type="text"
                  className="form-input"
                  placeholder="e.g. ADM-20483 or FAC-93822"
                  value={formData.inviteCode}
                  onChange={(e) => handleInputChange('inviteCode', e.target.value)}
                  disabled={isLoading}
                />
                <KeyRound className="input-icon" size={18} />
              </div>
              {errors.inviteCode && <span className="error-msg">{errors.inviteCode}</span>}
            </div>

            {/* Email */}
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
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 2: Profile Security</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-pass">Password</label>
                <div className="input-container">
                  <input
                    id="profile-pass"
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
                <label className="form-label" htmlFor="profile-confirm">Confirm Password</label>
                <div className="input-container">
                  <input
                    id="profile-confirm"
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
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Configure Authenticator MFA</span>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Scan the QR code in your Authenticator app or use Setup Key:
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
                <label className="form-label" htmlFor="invite-mfa">Authenticator verification Code</label>
                <div className="input-container">
                  <input
                    id="invite-mfa"
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
                {step === 1 ? 'Verify Access' : 'Activate Account'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
