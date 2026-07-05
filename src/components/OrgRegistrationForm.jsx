import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, ShieldCheck, ArrowRight, ArrowLeft, Lock, FileText, Users, User, Check, Copy } from 'lucide-react';

export default function OrgRegistrationForm({ onSwitchForm, onComplete }) {
  const [step, setStep] = useState(1);
  const [copiedField, setCopiedField] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 1
    orgName: '',
    orgType: 'Enterprise',
    industry: '',
    orgSize: '11-50',
    country: '',
    // Step 2
    adminName: '',
    email: '',
    adminPhone: '',
    position: '',
    linkedin: '',
    // Step 3
    workspaceTemplate: 'enterprise', // Mapped to primary solution: 'enterprise' | 'bootcamp' | 'education' | 'events'
    deliveryMode: 'Hybrid',
    participants: '',
    description: '',
    // Step 4
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Generated credentials
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
      if (!formData.industry.trim()) tempErrors.industry = 'Industry / Sector is required';
      if (!formData.country.trim()) tempErrors.country = 'Country is required';
    } else if (step === 2) {
      if (!formData.adminName.trim()) tempErrors.adminName = 'Full Name is required';
      if (!formData.email) {
        tempErrors.email = 'Work Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Enter a valid corporate email';
      }
      if (!formData.position.trim()) tempErrors.position = 'Position / Role is required';
    } else if (step === 3) {
      if (!formData.description.trim()) tempErrors.description = 'Organization Description is required';
    } else if (step === 4) {
      if (!formData.password) {
        tempErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        tempErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeTerms) {
        tempErrors.agreeTerms = 'You must accept the terms of service';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Generate security credentials
      const randString = (len) => Math.random().toString(36).substring(2, 2 + len).toUpperCase();
      const randNum = (len) => Math.floor(Math.pow(10, len - 1) + Math.random() * 9 * Math.pow(10, len - 1)).toString();

      setSecurityData({
        orgId: `ORG-${randNum(6)}`,
        accessCode: `OYG-${randString(3)}${randNum(3)}-${randString(2)}`,
        adminId: `ADM-0001`
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
      onComplete(formData.email, formData.workspaceTemplate);
    }
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '600px' }}>
      <div className="form-header">
        <h2 className="form-title">Create Organization</h2>
        <p className="form-subtitle">
          Onboard your company to OYEN GRID • <span onClick={() => onSwitchForm('portal')}>Exit</span>
        </p>
      </div>

      {/* Progress indicators */}
      <div className="wizard-steps" style={{ marginBottom: '2rem' }}>
        <div className={`wizard-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`wizard-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
        <div className={`wizard-step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>3</div>
        <div className={`wizard-step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>4</div>
        <div className={`wizard-step-node ${step >= 5 ? 'completed' : ''} ${step === 5 ? 'active' : ''}`}>5</div>
      </div>

      <div>
        {/* STEP 1: Organization Details */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 1: Organization Details</h3>
            
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
                    <option value="Enterprise">Enterprise / Corporate</option>
                    <option value="Government">Government / Public</option>
                    <option value="NGO">NGO / Non-Profit</option>
                    <option value="University">University / School</option>
                    <option value="Training Center">Training Provider</option>
                  </select>
                  <Building2 className="input-icon" size={18} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="org-size">Organization Size</label>
                <div className="input-container">
                  <select
                    id="org-size"
                    className="form-input"
                    value={formData.orgSize}
                    onChange={(e) => handleInputChange('orgSize', e.target.value)}
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="industry">Industry / Sector</label>
                <div className="input-container">
                  <input
                    id="industry"
                    type="text"
                    className="form-input"
                    placeholder="Robotics & Defense"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  />
                  <Building2 className="input-icon" size={18} />
                </div>
                {errors.industry && <span className="error-msg">{errors.industry}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="country">Country</label>
                <div className="input-container">
                  <input
                    id="country"
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
          </div>
        )}

        {/* STEP 2: Administrator Details */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 2: Administrator Details</h3>
            
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
                <label className="form-label" htmlFor="admin-position">Position / Role</label>
                <div className="input-container">
                  <input
                    id="admin-position"
                    type="text"
                    className="form-input"
                    placeholder="Chief of Operations"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                  />
                  <User className="input-icon" size={18} />
                </div>
                {errors.position && <span className="error-msg">{errors.position}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">Work Email</label>
                <div className="input-container">
                  <input
                    id="admin-email"
                    type="email"
                    className="form-input"
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <Mail className="input-icon" size={18} />
                </div>
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-phone">Phone Number</label>
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
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-linkedin">LinkedIn Profile URL (Optional)</label>
              <div className="input-container">
                <input
                  id="admin-linkedin"
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/sarahconnor"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
                <Globe className="input-icon" size={18} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Programme & Verification */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 3: Programme & Verification</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="primary-case">Primary Use Case</label>
              <div className="input-container">
                <select
                  id="primary-case"
                  className="form-input"
                  value={formData.workspaceTemplate}
                  onChange={(e) => handleInputChange('workspaceTemplate', e.target.value)}
                >
                  <option value="bootcamp">Bootcamps & Training (cohorts, mentors, timetables)</option>
                  <option value="events">Webinars & Events (speakers, tickets, webinars)</option>
                  <option value="education">Education & Institutions (students, courses, lecturers)</option>
                  <option value="enterprise">Enterprise Operations (employees, compliance, departments)</option>
                </select>
                <Building2 className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="delivery">Delivery Mode</label>
                <div className="input-container">
                  <select
                    id="delivery"
                    className="form-input"
                    value={formData.deliveryMode}
                    onChange={(e) => handleInputChange('deliveryMode', e.target.value)}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Fully Online</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                  <Globe className="input-icon" size={18} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="participants">Average Participants / Learners</label>
                <div className="input-container">
                  <input
                    id="participants"
                    type="number"
                    className="form-input"
                    placeholder="e.g. 200"
                    value={formData.participants}
                    onChange={(e) => handleInputChange('participants', e.target.value)}
                  />
                  <Users className="input-icon" size={18} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Organization Description</label>
              <div className="input-container">
                <textarea
                  id="description"
                  className="form-input"
                  rows={3}
                  placeholder="Outline your primary training or operational objectives..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  style={{ resize: 'none', height: '80px', paddingLeft: '1rem' }}
                />
              </div>
              {errors.description && <span className="error-msg">{errors.description}</span>}
            </div>
          </div>
        )}

        {/* STEP 4: Security Credentials */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Step 4: Password Security</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Create Password</label>
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

            <div className="options-bar" style={{ marginTop: '1rem' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                />
                I agree to the OYEN GRID Terms of Service & Privacy Policy
              </label>
            </div>
            {errors.agreeTerms && <span className="error-msg">{errors.agreeTerms}</span>}
          </div>
        )}

        {/* STEP 5: Creation Security Output */}
        {step === 5 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Organization Workspace Created</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              OYEN GRID security protocols have initialized your organization tenant. Save these credentials:
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
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="submit-btn" onClick={handleFinish}>
              Enter Workspace Onboarding <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
