import React, { useState } from 'react';
import { User, Mail, Building2, Phone, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PublicEventForm({ onSwitchForm }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [eventSelected, setEventSelected] = useState('webinar');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
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

    // Simulate Event Registration
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        text: 'Registration successful! Confirmation details have been sent to your email.'
      });
    }, 1200);
  };

  return (
    <div className="form-card animate-fade-in" style={{ maxWidth: '460px' }}>
      <div className="form-header">
        <h2 className="form-title">Join Public Event</h2>
        <p className="form-subtitle">
          Register for a webinar, workshop or conference • <span onClick={() => onSwitchForm('portal')}>Back to portal</span>
        </p>
      </div>

      {statusMessage && (
        <div className={`alert-banner ${statusMessage.type}`}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {!statusMessage ? (
        <form onSubmit={handleSubmit} noValidate>
          {/* Event Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="event-type">Select Event</label>
            <div className="input-container">
              <select
                id="event-type"
                className="form-input"
                value={eventSelected}
                onChange={(e) => setEventSelected(e.target.value)}
              >
                <option value="webinar">Webinar: Scaling Enterprise LMS with AI (July 15)</option>
                <option value="workshop">Workshop: Cohort Curriculum Design Masterclass (July 22)</option>
                <option value="conference">Conference: OYEN GRID Annual Summit 2026 (Aug 10)</option>
              </select>
              <Building2 className="input-icon" size={18} />
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="event-name">Full Name</label>
            <div className="input-container">
              <input
                id="event-name"
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
            {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="event-email">Email Address</label>
            <div className="input-container">
              <input
                id="event-email"
                type="email"
                className="form-input"
                placeholder="sarah@example.com"
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

          {/* Organization (Optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="event-org">Organization (Optional)</label>
            <div className="input-container">
              <input
                id="event-org"
                type="text"
                className="form-input"
                placeholder="Cyberdyne Systems"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                disabled={isLoading}
              />
              <Building2 className="input-icon" size={18} />
            </div>
          </div>

          {/* Phone (Optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="event-phone">Phone Number (Optional)</label>
            <div className="input-container">
              <input
                id="event-phone"
                type="tel"
                className="form-input"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
              <Phone className="input-icon" size={18} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                Register for Event <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span className="back-link" onClick={() => onSwitchForm('portal')}>
            <ArrowLeft size={16} /> Back to entry portal
          </span>
        </div>
      )}
    </div>
  );
}
