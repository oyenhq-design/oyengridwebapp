import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, ShieldCheck, ArrowRight, ArrowLeft, Lock, FileText, Users, User, Check, Copy, Key, Calendar, Laptop, BookOpen, CreditCard } from 'lucide-react';

export default function OrgRegistrationForm({ onSwitchForm, onComplete }) {
  const [step, setStep] = useState(1); // Steps 1 to 8 internally (Basic Info to Security ID generation)
  const [copiedField, setCopiedField] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 2
    orgName: '',
    email: '',
    orgType: 'Enterprise',
    industry: '',
    country: '',
    website: '',
    // Step 3 (Verification OTP)
    // Step 4
    bizRegNum: '',
    phone: '',
    address: '',
    employeeCount: '11-50',
    // Step 5
    adminName: '',
    adminTitle: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
    // Step 6
    workspaceTemplate: 'enterprise', // 'enterprise' | 'bootcamp' | 'education' | 'events'
    // Step 7
    subscriptionPlan: 'professional', // 'starter' | 'professional' | 'enterprise'
  });

  // Generated Security codes for Step 8
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
      // Step 2 in roadmap (Step 1 in form wizard container)
      if (!formData.orgName.trim()) tempErrors.orgName = 'Organization Name is required';
      if (!formData.industry.trim()) tempErrors.industry = 'Industry is required';
      if (!formData.country.trim()) tempErrors.country = 'Country is required';
      if (!formData.email) {
        tempErrors.email = 'Corporate Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Enter a valid corporate email address';
      }
    } else if (step === 3) {
      // Step 4 in roadmap (Step 3 in form wizard container)
      if (!formData.bizRegNum.trim()) tempErrors.bizRegNum = 'Business Registration Number is required';
    } else if (step === 4) {
      // Step 5 in roadmap (Step 4 in form wizard container)
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
      setOtpSent(true);
      setOtpError('');
      setStep(2);
    } else if (step === 2) {
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
      setStep(5);
    } else if (step === 5) {
      setStep(6);
    } else if (step === 6) {
      setStep(7);
    } else if (step === 7) {
      // Generate security credentials
      const randString = (len) => Math.random().toString(36).substring(2, 2 + len).toUpperCase();
      const randNum = (len) => Math.floor(Math.pow(10, len - 1) + Math.random() * 9 * Math.pow(10, len - 1)).toString();

      setSecurityData({
        orgId: `ORG-${randNum(6)}`,
        accessCode: `OYG-${randString(3)}${randNum(3)}-${randString(2)}`,
        adminId: `ADM-0001`
      });
      setStep(8);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 8) setStep(step - 1);
  };

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete(formData.email, formData.workspaceTemplate, formData.subscriptionPlan);
    }
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '640px' }}>
      <div className="form-header">
        <h2 className="form-title">Register Organization</h2>
        <p className="form-subtitle">
          Onboard your company to OYEN GRID • <span onClick={() => onSwitchForm('portal')}>Exit setup</span>
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="wizard-steps" style={{ marginBottom: '2rem' }}>
        <div className={`wizard-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`wizard-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
        <div className={`wizard-step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>3</div>
        <div className={`wizard-step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>4</div>
        <div className={`wizard-step-node ${step >= 5 ? 'completed' : ''} ${step === 5 ? 'active' : ''}`}>5</div>
        <div className={`wizard-step-node ${step >= 6 ? 'completed' : ''} ${step === 6 ? 'active' : ''}`}>6</div>
        <div className={`wizard-step-node ${step >= 7 ? 'completed' : ''} ${step === 7 ? 'active' : ''}`}>7</div>
        <div className={`wizard-step-node ${step >= 8 ? 'completed' : ''} ${step === 8 ? 'active' : ''}`}>8</div>
      </div>

      <div>
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 1: Organization Profile</h3>
            
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
                    <option value="Government">Government</option>
                    <option value="NGO">NGO / Non-Profit</option>
                    <option value="University">University</option>
                    <option value="Energy & Oil">Energy & Oil</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Technology">Technology</option>
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
              <label className="form-label" htmlFor="org-website">Website URL (optional)</label>
              <div className="input-container">
                <input
                  id="org-website"
                  type="url"
                  className="form-input"
                  placeholder="https://www.cyberdyne.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
                <Globe className="input-icon" size={18} />
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

        {/* STEP 2: Verify Corporate Email */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 2: Verify Corporate Email</h3>
            
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
                  placeholder="000000"
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 3: Organization Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="biz-reg">Registration Number</label>
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
                    placeholder="Shola Oyewole"
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
                    placeholder="Chief Executive Officer"
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

        {/* STEP 5: Choose Initial Workspace */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Step 5: Choose Your Workspace</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select the workspace template that matches how your organization operates today.
            </p>

            <div className="portal-list" style={{ gap: '0.75rem', margin: 0 }}>
              {/* Enterprise */}
              <button 
                type="button"
                className="portal-btn" 
                style={{ 
                  border: formData.workspaceTemplate === 'enterprise' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)',
                  backgroundColor: formData.workspaceTemplate === 'enterprise' ? 'var(--primary-glow)' : 'var(--bg-input)'
                }}
                onClick={() => handleInputChange('workspaceTemplate', 'enterprise')}
              >
                <div className="portal-btn-icon" style={{ background: formData.workspaceTemplate === 'enterprise' ? 'var(--gradient-brand)' : 'var(--primary-glow)', color: formData.workspaceTemplate === 'enterprise' ? 'white' : 'var(--primary)' }}>
                  <Building2 size={20} />
                </div>
                <div className="portal-btn-content">
                  <div className="portal-btn-title">Enterprise Operations</div>
                  <div className="portal-btn-desc">Best for corporates, government, NGOs, and energy companies. Includes Departments, Compliance.</div>
                </div>
              </button>

              {/* Bootcamp */}
              <button 
                type="button"
                className="portal-btn" 
                style={{ 
                  border: formData.workspaceTemplate === 'bootcamp' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)',
                  backgroundColor: formData.workspaceTemplate === 'bootcamp' ? 'var(--primary-glow)' : 'var(--bg-input)'
                }}
                onClick={() => handleInputChange('workspaceTemplate', 'bootcamp')}
              >
                <div className="portal-btn-icon" style={{ background: formData.workspaceTemplate === 'bootcamp' ? 'var(--gradient-brand)' : 'var(--primary-glow)', color: formData.workspaceTemplate === 'bootcamp' ? 'white' : 'var(--primary)' }}>
                  <Laptop size={20} />
                </div>
                <div className="portal-btn-content">
                  <div className="portal-btn-title">Bootcamp Workspace</div>
                  <div className="portal-btn-desc">Best for accelerators, fellowships, and talent programs. Includes Cohorts, Mentors, Timetables.</div>
                </div>
              </button>

              {/* Education */}
              <button 
                type="button"
                className="portal-btn" 
                style={{ 
                  border: formData.workspaceTemplate === 'education' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)',
                  backgroundColor: formData.workspaceTemplate === 'education' ? 'var(--primary-glow)' : 'var(--bg-input)'
                }}
                onClick={() => handleInputChange('workspaceTemplate', 'education')}
              >
                <div className="portal-btn-icon" style={{ background: formData.workspaceTemplate === 'education' ? 'var(--gradient-brand)' : 'var(--primary-glow)', color: formData.workspaceTemplate === 'education' ? 'white' : 'var(--primary)' }}>
                  <BookOpen size={20} />
                </div>
                <div className="portal-btn-content">
                  <div className="portal-btn-title">Education & Academies</div>
                  <div className="portal-btn-desc">Best for universities, colleges, and schools. Includes Students, Faculties, Semesters, Results.</div>
                </div>
              </button>

              {/* Events */}
              <button 
                type="button"
                className="portal-btn" 
                style={{ 
                  border: formData.workspaceTemplate === 'events' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)',
                  backgroundColor: formData.workspaceTemplate === 'events' ? 'var(--primary-glow)' : 'var(--bg-input)'
                }}
                onClick={() => handleInputChange('workspaceTemplate', 'events')}
              >
                <div className="portal-btn-icon" style={{ background: formData.workspaceTemplate === 'events' ? 'var(--gradient-brand)' : 'var(--primary-glow)', color: formData.workspaceTemplate === 'events' ? 'white' : 'var(--primary)' }}>
                  <Calendar size={20} />
                </div>
                <div className="portal-btn-content">
                  <div className="portal-btn-title">Events & Conferences</div>
                  <div className="portal-btn-desc">Best for summits, masterclasses, webinars. Includes Speakers, Schedules, Check-in tools.</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Choose Subscription Plan */}
        {step === 6 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Step 6: Choose Subscription Plan</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select a core workspace subscription package. Subscription determines active operational modules.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {/* Starter */}
              <div 
                style={{ 
                  border: formData.subscriptionPlan === 'starter' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)', 
                  borderRadius: '12px', padding: '1.25rem', backgroundColor: formData.subscriptionPlan === 'starter' ? 'var(--primary-glow)' : 'var(--bg-card)', 
                  cursor: 'pointer', textAlign: 'center' 
                }}
                onClick={() => handleInputChange('subscriptionPlan', 'starter')}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Starter Plan</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>$49<span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>/mo</span></div>
                <ul style={{ padding: 0, listStyle: 'none', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '1rem 0' }}>
                  <li>1 Active Template</li>
                  <li>Up to 25 Users</li>
                  <li>Standard AI Assistant</li>
                </ul>
              </div>

              {/* Professional */}
              <div 
                style={{ 
                  border: formData.subscriptionPlan === 'professional' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)', 
                  borderRadius: '12px', padding: '1.25rem', backgroundColor: formData.subscriptionPlan === 'professional' ? 'var(--primary-glow)' : 'var(--bg-card)', 
                  cursor: 'pointer', textAlign: 'center', position: 'relative'
                }}
                onClick={() => handleInputChange('subscriptionPlan', 'professional')}
              >
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-brand)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '10px' }}>RECOMMENDED</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Professional</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>$199<span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>/mo</span></div>
                <ul style={{ padding: 0, listStyle: 'none', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '1rem 0' }}>
                  <li>2 Active Templates</li>
                  <li>Up to 150 Users</li>
                  <li>Advanced AI Operations</li>
                  <li>Priority API Keys</li>
                </ul>
              </div>

              {/* Enterprise */}
              <div 
                style={{ 
                  border: formData.subscriptionPlan === 'enterprise' ? '2px solid var(--border-focus)' : '1px solid var(--border-color)', 
                  borderRadius: '12px', padding: '1.25rem', backgroundColor: formData.subscriptionPlan === 'enterprise' ? 'var(--primary-glow)' : 'var(--bg-card)', 
                  cursor: 'pointer', textAlign: 'center' 
                }}
                onClick={() => handleInputChange('subscriptionPlan', 'enterprise')}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Enterprise</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>Custom</div>
                <ul style={{ padding: 0, listStyle: 'none', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '1rem 0' }}>
                  <li>Unlimited Templates</li>
                  <li>Unlimited Users</li>
                  <li>Enterprise Dedicated AI</li>
                  <li>Dedicated Support</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Security Generation */}
        {step === 7 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Organization Workspace Initialized</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              OYEN GRID security protocols have established your tenant workspace configuration. Save these keys:
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
          {step > 1 && step < 7 && (
            <button type="button" className="secondary-btn" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {step < 7 ? (
            <button type="button" className="submit-btn" onClick={handleNext}>
              {step === 2 ? 'Verify Email Code' : 'Continue'} <ArrowRight size={16} />
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
