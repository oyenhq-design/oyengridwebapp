import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, ShieldCheck, ArrowRight, ArrowLeft, Lock, FileText, Users, User, Check, Copy, Key } from 'lucide-react';

export default function OrgRegistrationForm({ onSwitchForm, onComplete }) {
  const [step, setStep] = useState(1);
  const [copiedField, setCopiedField] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 1
    orgName: '',
    email: '',
    orgType: 'Enterprise',
    industry: '',
    country: '',
    // Step 2 (Verification OTP)
    // Step 3
    bizRegNum: '',
    website: '',
    phone: '',
    address: '',
    employeeCount: '1-10',
    // Step 4
    adminName: '',
    adminTitle: '',
    adminPhone: '',
    password: '',
    confirmPassword: ''
  });

  // Generated Security codes for Step 5
  const [securityData, setSecurityData] = useState({
    orgId: '',
    accessCode: '',
    adminId: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validateStep = () => {
    const tempErrors = {};
    if (step === 1) {
      if (!formData.orgName.trim()) tempErrors.orgName = 'Organization Name is required';
      if (!formData.industry.trim()) tempErrors.industry = 'Industry is required';
      if (!formData.country.trim()) tempErrors.country = 'Country is required';
      if (!formData.email) {
        tempErrors.email = 'Corporate Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Enter a valid corporate email address';
      }
    } else if (step === 3) {
      if (!formData.bizRegNum.trim()) tempErrors.bizRegNum = 'Business Registration Number is required';
    } else if (step === 4) {
      if (!formData.adminName.trim()) tempErrors.adminName = 'Full Name is required';
      if (!formData.adminTitle.trim()) tempErrors.adminTitle = 'Job Title is required';
      if (!formData.password) {
        tempErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        tempErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep()) return;
      // Simulate sending OTP
      setOtpSent(true);
      setOtpError('');
      setStep(2);
    } else if (step === 2) {
      // Validate OTP code (mock expected value is 482913)
      if (verificationCode === '482913') {
        setStep(3);
      } else {
        setOtpError('Invalid verification code. Hint: use 482913');
      }
    } else if (step === 3) {
      if (!validateStep()) return;
      setStep(4);
    } else if (step === 4) {
      if (!validateStep()) return;
      // Generate security credentials for Step 5
      const randString = (len) => Math.random().toString(36).substring(2, 2 + len).toUpperCase();
      const randNum = (len) => Math.floor(Math.pow(10, len - 1) + Math.random() * 9 * Math.pow(10, len - 1)).toString();

      setSecurityData({
        orgId: `ORG-2026-${randNum(5)}`,
        accessCode: `OYG-${randString(3)}${randNum(3)}-${randString(2)}`,
        adminId: `ADM-00001`
      });
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep(step - 1);
  };

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete(formData.email);
    }
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '580px' }}>
      <div className="form-header">
        <h2 className="form-title">Register Organization</h2>
        <p className="form-subtitle">
          Onboard your company to OYEN GRID • <span onClick={() => onSwitchForm('portal')}>Exit setup</span>
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="wizard-steps">
        <div className={`wizard-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`wizard-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
        <div className={`wizard-step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>3</div>
        <div className={`wizard-step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>4</div>
        <div className={`wizard-step-node ${step >= 5 ? 'completed' : ''} ${step === 5 ? 'active' : ''}`}>5</div>
      </div>

      <div>
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 1: Basic Information</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="org-name">Organization Name</label>
              <div className="input-container">
                <input
                  id="org-name"
                  type="text"
                  className="form-input"
                  placeholder="Cyberdyne Systems"
                  value={formData.orgName}
                  onChange={(e) => handleInputChange('orgName', e.target.value)}
                />
                <Building2 className="input-icon" size={18} />
              </div>
              {errors.orgName && <span className="error-msg">{errors.orgName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="org-email">Corporate Email</label>
              <div className="input-container">
                <input
                  id="org-email"
                  type="email"
                  className="form-input"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <Mail className="input-icon" size={18} />
              </div>
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="org-type">Organization Type</label>
                <div className="input-container">
                  <select
                    id="org-type"
                    className="form-input"
                    value={formData.orgType}
                    onChange={(e) => handleInputChange('orgType', e.target.value)}
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Government">Government / Public Sector</option>
                    <option value="NGO">NGO / Non-Profit</option>
                    <option value="University">University / Academy</option>
                    <option value="Energy">Energy & Infrastructure</option>
                  </select>
                  <Building2 className="input-icon" size={18} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="org-industry">Industry</label>
                <div className="input-container">
                  <input
                    id="org-industry"
                    type="text"
                    className="form-input"
                    placeholder="Robotics / AI"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  />
                  <Building2 className="input-icon" size={18} />
                </div>
                {errors.industry && <span className="error-msg">{errors.industry}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="org-country">Country</label>
              <div className="input-container">
                <input
                  id="org-country"
                  type="text"
                  className="form-input"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
                <Globe className="input-icon" size={18} />
              </div>
              {errors.country && <span className="error-msg">{errors.country}</span>}
            </div>
          </div>
        )}

        {/* STEP 2: Verify Corporate Email (OTP) */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 2: Verify Corporate Email</h3>
            
            {/* Simulated Email Delivery Information Banner */}
            <div className="alert-banner success" style={{ marginBottom: '1.5rem', flexDirection: 'column' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>📬 Mock Mailbox — Verification Code Sent</div>
              <div style={{ fontSize: '0.85rem' }}><strong>From:</strong> OYEN GRID Support</div>
              <div style={{ fontSize: '0.85rem' }}><strong>Subject:</strong> Verify your organization email</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
                Your verification code is: <strong>482913</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="otp-input" style={{ textAlign: 'center', display: 'block', width: '100%', marginBottom: '0.75rem' }}>
                Enter 6-Digit OTP Verification Code
              </label>
              <div className="input-container">
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  className="form-input"
                  placeholder="0 0 0 0 0 0"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, ''));
                    setOtpError('');
                  }}
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.4rem' }}
                />
                <Key className="input-icon" size={18} />
              </div>
              {otpError && <span className="error-msg" style={{ justifyContent: 'center' }}>{otpError}</span>}
            </div>
          </div>
        )}

        {/* STEP 3: Complete Organization Details */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 3: Complete Organization Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="biz-reg">Company Registration #</label>
                <div className="input-container">
                  <input
                    id="biz-reg"
                    type="text"
                    className="form-input"
                    placeholder="REG-2026-9810"
                    value={formData.bizRegNum}
                    onChange={(e) => handleInputChange('bizRegNum', e.target.value)}
                  />
                  <FileText className="input-icon" size={18} />
                </div>
                {errors.bizRegNum && <span className="error-msg">{errors.bizRegNum}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="website">Website</label>
                <div className="input-container">
                  <input
                    id="website"
                    type="url"
                    className="form-input"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                  <Globe className="input-icon" size={18} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <div className="input-container">
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 555-9081"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <Phone className="input-icon" size={18} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="org-size">Organization Size</label>
                <div className="input-container">
                  <select
                    id="org-size"
                    className="form-input"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-250">51-250 employees</option>
                    <option value="251-1000">251-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                  <Users className="input-icon" size={18} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <div className="input-container">
                <input
                  id="address"
                  type="text"
                  className="form-input"
                  placeholder="100 Innovation Way, Suite 400"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                <Building2 className="input-icon" size={18} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Primary Administrator */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 4: Primary Administrator</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-name">Full Name</label>
                <div className="input-container">
                  <input
                    id="admin-name"
                    type="text"
                    className="form-input"
                    placeholder="Sarah Connor"
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                  />
                  <User className="input-icon" size={18} />
                </div>
                {errors.adminName && <span className="error-msg">{errors.adminName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-title">Job Title</label>
                <div className="input-container">
                  <input
                    id="admin-title"
                    type="text"
                    className="form-input"
                    placeholder="HR / Workspace Admin"
                    value={formData.adminTitle}
                    onChange={(e) => handleInputChange('adminTitle', e.target.value)}
                  />
                  <User className="input-icon" size={18} />
                </div>
                {errors.adminTitle && <span className="error-msg">{errors.adminTitle}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-phone">Phone Number (optional)</label>
              <div className="input-container">
                <input
                  id="admin-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 555-0320"
                  value={formData.adminPhone}
                  onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                />
                <Phone className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Lock className="input-icon" size={18} />
                </div>
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-pass">Confirm Password</label>
                <div className="input-container">
                  <input
                    id="confirm-pass"
                    type="password"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  <Lock className="input-icon" size={18} />
                </div>
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Create Organization (Credentials Generation) */}
        {step === 5 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Organization Configuration Created</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              We have initialized OYEN GRID for your company. Please save the secure configuration profiles below:
            </p>

            <div className="security-codes-grid">
              {/* Organization ID */}
              <div className="security-code-card">
                <div className="security-code-info">
                  <span className="security-code-label">Organization ID</span>
                  <span className="security-code-value">{securityData.orgId}</span>
                </div>
                <button
                  type="button"
                  className="copy-badge"
                  onClick={() => handleCopy('orgId', securityData.orgId)}
                >
                  {copiedField === 'orgId' ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Organization Access Code */}
              <div className="security-code-card">
                <div className="security-code-info">
                  <span className="security-code-label">Organization Code</span>
                  <span className="security-code-value">{securityData.accessCode}</span>
                </div>
                <button
                  type="button"
                  className="copy-badge"
                  onClick={() => handleCopy('accessCode', securityData.accessCode)}
                >
                  {copiedField === 'accessCode' ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Primary Admin ID */}
              <div className="security-code-card">
                <div className="security-code-info">
                  <span className="security-code-label">Primary Admin ID</span>
                  <span className="security-code-value">{securityData.adminId}</span>
                </div>
                <button
                  type="button"
                  className="copy-badge"
                  onClick={() => handleCopy('adminId', securityData.adminId)}
                >
                  {copiedField === 'adminId' ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer wizard navigation buttons */}
        <div className="wizard-footer-buttons">
          {step > 1 && step < 5 && (
            <button type="button" className="secondary-btn" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {step < 5 ? (
            <button type="button" className="submit-btn" onClick={handleNext}>
              {step === 2 ? 'Verify Email' : 'Continue'} <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="submit-btn" onClick={handleFinish}>
              Enter Admin Workspace <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
