import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, Mail, Phone, Globe, MapPin, Shield, Calendar, 
  BookOpen, Lock, Activity, Settings, ChevronRight, RefreshCw, Key
} from 'lucide-react';

export default function FacilitatorProfile({ 
  userInfo = {}, 
  assignedSessions = [],
  assignedResources = [],
  onUpdateProfile
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Stateful personal info driven initially from userInfo prop
  const [personalInfo, setPersonalInfo] = useState({
    fullName: userInfo.fullName || userInfo.name || '',
    email: userInfo.email || '',
    phone: userInfo.phone || '',
    timezone: userInfo.timezone || 'Africa/Lagos',
    location: userInfo.location || '',
    bio: userInfo.bio || ''
  });

  useEffect(() => {
    setPersonalInfo(prev => ({
      ...prev,
      fullName: userInfo.fullName || userInfo.name || prev.fullName,
      email: userInfo.email || prev.email,
      phone: userInfo.phone || prev.phone,
      timezone: userInfo.timezone || prev.timezone,
      location: userInfo.location || prev.location,
      bio: userInfo.bio || prev.bio
    }));
  }, [userInfo]);

  // Intermediate edit state to allow Cancelling edits
  const [editForm, setEditForm] = useState({ ...personalInfo });

  // Preferences toggles
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    sessionReminders: true,
    announcementAlerts: true,
    language: 'English',
    timezone: userInfo.timezone || 'Africa/Lagos'
  });

  // 100% Real activity history list (starts empty, and appends actions upon user actions)
  const [activityHistory, setActivityHistory] = useState([]);

  // Handle start editing
  const handleStartEdit = () => {
    setEditForm({ ...personalInfo });
    setIsEditing(true);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Handle save changes
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setPersonalInfo({ ...editForm });
    setIsEditing(false);
    
    // Bubble up to global state
    if (onUpdateProfile) {
      onUpdateProfile(editForm);
    }
    
    // Add real event to Activity History!
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityHistory(prev => [
      { id: Date.now(), text: `Profile updated (${editForm.fullName})`, time: `Today at ${timeStr}` },
      ...prev
    ]);
  };

  const handleTogglePreference = (key) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Add real event to Activity History!
      const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setActivityHistory(history => [
        { id: Date.now(), text: `Preference changed: toggled ${label}`, time: `Today at ${timeStr}` },
        ...history
      ]);
      return updated;
    });
  };

  const initials = useMemo(() => {
    return personalInfo.fullName.substring(0, 2).toUpperCase();
  }, [personalInfo.fullName]);

  // Clean UI Empty State Wrapper
  const SectionEmptyState = ({ title, description }) => (
    <div style={{
      textAlign: 'center',
      padding: '2.5rem 1.5rem',
      backgroundColor: '#FFFDF9',
      borderRadius: '16px',
      border: '1px dashed rgba(0,0,0,0.06)'
    }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111', margin: '0 0 0.25rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.8rem', color: '#666666', margin: 0, lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F8F6F1', // OYEN GRID Milk Background
      minHeight: '100vh', 
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#111111',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* Header with inline edit trigger button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            color: '#111111', 
            margin: 0, 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.8px'
          }}>
            Facilitator Profile
          </h1>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            marginTop: '0.35rem' 
          }}>
            Manage your personal information and workspace identity.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartEdit}
            style={{
              backgroundColor: '#FFFDF9',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#111111',
              boxShadow: '0 2px 8px rgba(0,0,0,0.005)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFDF9'}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Two Column Layout Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.6fr 1.1fr', 
        gap: '2.5rem', 
        alignItems: 'start' 
      }}>
        
        {/* LEFT COLUMN: Personal Info Card, Workspace Info, Sessions, Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Section 1: Personal Information Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            
            {/* Header info row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '84px', 
                height: '84px', 
                borderRadius: '50%', 
                backgroundColor: '#111111', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2.1rem', 
                fontWeight: 800, 
                color: '#FFFDF9'
              }}>
                {initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                    {personalInfo.fullName}
                  </h2>
                  <span style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.08)', 
                    color: '#3B82F6', 
                    fontSize: '0.7rem', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '20px', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <Shield size={10} /> Verified
                  </span>
                </div>
                <span style={{ color: '#D6A62A', fontSize: '0.9rem', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
                  {userInfo.role || 'Facilitator'}
                </span>
                <span style={{ color: '#666666', fontSize: '0.85rem', display: 'block', marginTop: '0.1rem' }}>
                  ABC Energy Workspace
                </span>
              </div>
            </div>

            {/* Display / Edit form */}
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>FULL NAME</span>
                    <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>{personalInfo.fullName}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>EMAIL ADDRESS</span>
                    <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>{personalInfo.email}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>PHONE NUMBER</span>
                    <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>{personalInfo.phone}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>TIMEZONE</span>
                    <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>{personalInfo.timezone}</span>
                  </div>
                  {personalInfo.location && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>LOCATION</span>
                      <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>{personalInfo.location}</span>
                    </div>
                  )}
                  {personalInfo.bio && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>BIOGRAPHY</span>
                      <span style={{ color: '#111111', fontSize: '0.9rem', lineHeight: '1.5', display: 'block' }}>{personalInfo.bio}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                  
                  {/* Name Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>FULL NAME</label>
                    <input 
                      type="text" 
                      value={editForm.fullName}
                      onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                      required
                      style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#F8F6F1' }}
                    />
                  </div>

                  {/* Email Input (Read-only / Disabled) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      disabled={true}
                      style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#EAE6DF', color: '#666666', cursor: 'not-allowed' }}
                    />
                  </div>

                  {/* Phone Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>PHONE NUMBER</label>
                    <input 
                      type="text" 
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#F8F6F1' }}
                    />
                  </div>

                  {/* Timezone Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>TIMEZONE</label>
                    <input 
                      type="text" 
                      value={editForm.timezone}
                      onChange={e => setEditForm({ ...editForm, timezone: e.target.value })}
                      style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#F8F6F1' }}
                    />
                  </div>

                  {/* Location Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>LOCATION</label>
                    <input 
                      type="text" 
                      value={editForm.location}
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#F8F6F1' }}
                    />
                  </div>

                  {/* Bio Textarea */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>BIOGRAPHY</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#F8F6F1', resize: 'vertical' }}
                    />
                  </div>

                </div>

                {/* Form Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: '1px solid rgba(0,0,0,0.08)', 
                      color: '#111111', 
                      padding: '0.65rem 1.5rem', 
                      borderRadius: '10px', 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      cursor: 'pointer' 
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ 
                      backgroundColor: '#D6A62A', 
                      border: 'none', 
                      color: '#FFFFFF', 
                      padding: '0.65rem 1.5rem', 
                      borderRadius: '10px', 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Section 2: Workspace Information (Read-Only) */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              Workspace Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>WORKSPACE</span>
                <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>ABC Energy</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>ROLE</span>
                <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>{userInfo.role || 'Facilitator'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>STATUS</span>
                <span style={{ color: '#10B981', fontSize: '0.95rem', fontWeight: 700 }}>Active</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>JOINED</span>
                <span style={{ color: '#111111', fontSize: '0.95rem', fontWeight: 700 }}>Jan 2026</span>
              </div>
            </div>
          </div>

          {/* Section 3: Assigned Sessions */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              Assigned Sessions
            </h3>

            {assignedSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {assignedSessions.map(sess => (
                  <div 
                    key={sess.id}
                    style={{ 
                      backgroundColor: '#F8F6F1', 
                      borderRadius: '12px', 
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111', margin: 0 }}>
                        {sess.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#666666', display: 'block', marginTop: '0.25rem' }}>
                        {sess.date} • {sess.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D6A62A', textTransform: 'uppercase' }}>
                        {sess.status || 'Upcoming'}
                      </span>
                      <button 
                        onClick={() => alert(`Viewing session: ${sess.title}`)}
                        style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
                      >
                        View Session <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SectionEmptyState 
                title="No sessions assigned yet" 
                description="You'll see your upcoming sessions here once an administrator assigns one." 
              />
            )}
          </div>

          {/* Section 4: My Resources */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              My Resources
            </h3>

            {assignedResources.length > 0 ? (
              <div style={{ 
                backgroundColor: '#F8F6F1', 
                borderRadius: '12px', 
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>TOTAL RESOURCES SHARED</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111111', display: 'block', marginTop: '0.15rem' }}>
                    {assignedResources.length} Files
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600 }}>RECENT RESOURCE</span>
                  <span style={{ fontSize: '0.85rem', color: '#111111', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                    {assignedResources[0]?.title || 'Shared Guide'}
                  </span>
                </div>
                <button 
                  onClick={() => alert('Navigate to Resources tab')}
                  style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
                >
                  View Resources <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <SectionEmptyState 
                title="No resources available" 
                description="Resources shared by your administrator will appear here." 
              />
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Preferences, Security, and Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Section 5: Preferences */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 0.25rem'
            }}>
              Preferences
            </h3>

            {/* Email Notifications */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Email Notifications</span>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>Receive daily activity logs</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.emailNotifications}
                onChange={() => handleTogglePreference('emailNotifications')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.emailNotifications ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>

            {/* Session Reminders */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Session Reminders</span>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>Reminders before start time</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.sessionReminders}
                onChange={() => handleTogglePreference('sessionReminders')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.sessionReminders ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>

            {/* Announcement Alerts */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Announcement Alerts</span>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>Admin broadcast notices</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.announcementAlerts}
                onChange={() => handleTogglePreference('announcementAlerts')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.announcementAlerts ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>
          </div>

          {/* Section 6: Password & Security */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 0.25rem'
            }}>
              Password & Security
            </h3>

            <button 
              onClick={() => {
                alert('Password reset link sent to registered email address.');
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setActivityHistory(prev => [
                  { id: Date.now(), text: 'Password reset link requested', time: `Today at ${timeStr}` },
                  ...prev
                ]);
              }}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#111111',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F6F1'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Key size={14} /> Change Password
            </button>

            <div style={{ fontSize: '0.8rem', color: '#666666', borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Two-factor Auth</span>
                <span style={{ fontWeight: 700, color: '#D6A62A' }}>Disabled</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Last Account Login</span>
                <span style={{ fontWeight: 700, color: '#111111' }}>Today</span>
              </div>
            </div>
          </div>

          {/* Section 7: Activity History (Real Data Only) */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 1.5rem'
            }}>
              Activity History
            </h3>

            {activityHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {activityHistory.map((act, i) => (
                  <div key={act.id} style={{ 
                    borderBottom: i === activityHistory.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.03)',
                    paddingBottom: i === activityHistory.length - 1 ? 0 : '1.25rem'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#D6A62A', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {act.time}
                    </span>
                    <p style={{ fontSize: '0.85rem', color: '#111111', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                      {act.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <SectionEmptyState 
                title="No recent account activity" 
                description="Your profile activity will appear here once you begin using the workspace." 
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
