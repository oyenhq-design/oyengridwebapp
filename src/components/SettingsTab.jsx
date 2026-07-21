import React, { useState } from 'react';
import { 
  Building2, Users, HardDrive, Bell, CreditCard, Shield, Trash2, 
  UserPlus, ShieldAlert, Key, AlertTriangle, Image
} from 'lucide-react';

export default function SettingsTab({ 
  programs = [], 
  learners = [], 
  teamMembers = [], 
  setTeamMembers,
  invitations = [],
  setInvitations,
  addNotification,
  organizationName = 'ABC ENERGY',
  setOrganizationName,
  onInviteTeamClick
}) {
  const [activeSection, setActiveSection] = useState('Organization');

  // Organization settings states
  const [orgEmail, setOrgEmail] = useState('admin@abcenergy.co');
  const [orgLogo, setOrgLogo] = useState(null);

  // Security password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification preferences states
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifications: true,
    sessionReminders: true,
    learnerActivityAlerts: false,
    lowAttendanceAlerts: true,
    aiSummaryNotifications: false
  });

  // Danger zone deletion verification state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Live storage calculator helper (based on 50GB limit)
  const calculateTotalStorage = () => {
    let totalBytes = 0;
    programs.forEach(p => {
      (p.resources || []).forEach(r => {
        totalBytes += r.sizeInBytes || 0;
      });
      (p.sessions || []).forEach(s => {
        (s.resources || []).forEach(sr => {
          totalBytes += sr.sizeInBytes || 0;
        });
      });
    });
    const totalGB = totalBytes / (1024 * 1024 * 1024);
    return {
      text: totalGB >= 0.01 ? `${totalGB.toFixed(2)} GB / 50 GB` : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB / 50 GB`,
      percentage: Math.min((totalGB / 50) * 100, 100),
      rawGBText: `${totalGB.toFixed(2)} GB`
    };
  };

  const storage = calculateTotalStorage();

  const handleSaveOrgSettings = (e) => {
    e.preventDefault();
    if (addNotification) {
      addNotification('success', 'Organization Profile saved successfully');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    if (addNotification) {
      addNotification('success', 'Security credentials updated successfully');
    }
  };

  const handleDeleteOrganization = () => {
    if (deleteConfirmText !== organizationName) {
      alert(`Please type "${organizationName}" correctly to confirm`);
      return;
    }
    alert("Destructive action validated: In production, all workspace data would be wiped.");
    setShowDeleteModal(false);
  };

  const handleRemoveTeamMember = (email) => {
    if (window.confirm(`Are you sure you want to remove team member ${email}?`)) {
      if (setTeamMembers) {
        setTeamMembers(prev => prev.filter(m => m.email !== email));
        if (addNotification) addNotification('success', `Team member ${email} removed`);
      }
    }
  };

  const handleRemoveInvitation = (code, email) => {
    if (window.confirm(`Are you sure you want to revoke invitation for ${email}?`)) {
      if (setInvitations) {
        setInvitations(prev => prev.filter(i => i.accessCode !== code));
        if (addNotification) addNotification('success', `Invitation for ${email} revoked`);
      }
    }
  };

  const sections = [
    { id: 'Organization', label: 'Organization', icon: <Building2 size={16} /> },
    { id: 'Team & Access', label: 'Team & Access', icon: <Users size={16} /> },
    { id: 'Workspace', label: 'Workspace & Storage', icon: <HardDrive size={16} /> },
    { id: 'Notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'Subscription & Plan', label: 'Subscription & Plan', icon: <CreditCard size={16} /> },
    { id: 'Security', label: 'Security & Access', icon: <Shield size={16} /> },
    { id: 'Danger Zone', label: 'Danger Zone', icon: <Trash2 size={16} />, color: '#ef4444' }
  ];

  // Specific theme variables
  const themeBg = '#0A0A0A';
  const themeCard = '#111111';
  const themeBorder = '#1F1F1F';
  const goldAccent = '#F5D76E';

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.75px',
    marginBottom: '0.45rem',
    fontFamily: "'Inter', sans-serif"
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    backgroundColor: '#0A0A0A',
    border: `1px solid ${themeBorder}`,
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif"
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: themeBg, minHeight: '100vh', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem', fontFamily: "'Inter', sans-serif" }}>
          Manage your organization, team access, workspace usage, notifications, and subscription.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start', marginTop: '0.5rem' }}>
        
        {/* Left Column: Vertical Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', backgroundColor: themeCard, border: `1px solid ${themeBorder}`, borderRadius: '12px', padding: '0.85rem' }}>
          {sections.map(s => {
            const isSelected = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.95rem',
                  backgroundColor: isSelected ? 'rgba(245,215,110,0.06)' : 'transparent',
                  color: isSelected ? (s.color || goldAccent) : (s.color ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.6)'),
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 600 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {s.icon}
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Right Column: Display Selected Settings Section */}
        <div style={{ backgroundColor: themeCard, border: `1px solid ${themeBorder}`, borderRadius: '12px', padding: '2rem' }}>
          
          {/* SECTION 1: ORGANIZATION */}
          {activeSection === 'Organization' && (
            <form onSubmit={handleSaveOrgSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Organization</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Configure organization details and profile branding.</p>
              </div>

              <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Organization Name</label>
                  <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Administrator Email</label>
                  <input type="email" value={orgEmail} onChange={e => setOrgEmail(e.target.value)} style={inputStyle} required />
                </div>
              </div>

              {/* Logo upload field */}
              <div>
                <label style={labelStyle}>Organization Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#0A0A0A', border: `1px solid ${themeBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                    {orgLogo ? (
                      <img src={orgLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Image size={24} />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          setOrgLogo(URL.createObjectURL(e.target.files[0]));
                          if (addNotification) addNotification('success', 'Logo uploaded successfully');
                        }
                      }}
                      style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>PNG or JPEG up to 2MB.</span>
                  </div>
                </div>
              </div>

              <button type="submit" style={{ alignSelf: 'flex-start', background: `linear-gradient(135deg,${goldAccent},#D9BF62)`, border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '6px', padding: '0.65rem 1.25rem', cursor: 'pointer', marginTop: '0.5rem', fontFamily: "'Inter', sans-serif" }}>
                Save Changes
              </button>
            </form>
          )}

          {/* SECTION 2: TEAM & ACCESS */}
          {activeSection === 'Team & Access' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Team & Access</h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Display team members, roles, and invite coworkers to manage programs.</p>
                </div>
                <button 
                  onClick={onInviteTeamClick}
                  style={{ 
                    backgroundColor: 'rgba(245,215,110,0.1)', border: `1px solid ${goldAccent}`, color: goldAccent, 
                    borderRadius: '6px', padding: '0.45rem 0.95rem', fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: "'Inter', sans-serif"
                  }}
                >
                  <UserPlus size={14} /> Invite Member
                </button>
              </div>

              <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

              {/* Active Members Subtitle */}
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>
                Active Members ({teamMembers.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {teamMembers.map((member, i) => (
                  <div key={member.email || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.1rem', backgroundColor: '#0A0A0A', border: `1px solid ${themeBorder}`, borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif" }}>{member.name || member.email}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem', fontFamily: "'Inter', sans-serif" }}>{member.email}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: goldAccent, backgroundColor: 'rgba(245,215,110,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                        {member.role || 'Member'}
                      </span>
                      {member.role !== 'Workspace Super Admin' && (
                        <button 
                          onClick={() => handleRemoveTeamMember(member.email)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending/Invited Members Subtitle */}
              {invitations.length > 0 && (
                <>
                  <div style={{ borderBottom: `1px solid ${themeBorder}`, margin: '0.5rem 0' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                    Pending Invitations ({invitations.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {invitations.map((inv, i) => (
                      <div key={inv.accessCode || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.1rem', backgroundColor: 'rgba(212,175,55,0.02)', border: `1px solid ${themeBorder}`, borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif" }}>{inv.email}</div>
                          {inv.accessCode && (
                            <div style={{ fontSize: '0.7rem', color: goldAccent, marginTop: '0.15rem', fontFamily: 'monospace', fontWeight: 600 }}>Code: {inv.accessCode}</div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                            {inv.role}
                          </span>
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                            {inv.status || 'Pending'}
                          </span>
                          <button 
                            onClick={() => handleRemoveInvitation(inv.accessCode, inv.email)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* SECTION 3: WORKSPACE & STORAGE */}
          {activeSection === 'Workspace' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Workspace & Storage</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Limits check and storage space details for your active OYEN GRID space.</p>
              </div>

              <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: '#0A0A0A', padding: '1rem', border: `1px solid ${themeBorder}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Active Programs</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{programs.length} / 10</div>
                </div>
                <div style={{ backgroundColor: '#0A0A0A', padding: '1rem', border: `1px solid ${themeBorder}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Learners</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{learners.length} / 200</div>
                </div>
                <div style={{ backgroundColor: '#0A0A0A', padding: '1rem', border: `1px solid ${themeBorder}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Storage Used</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{storage.rawGBText} / 50 GB</div>
                </div>
              </div>

              {/* Storage Usage bar and explanation */}
              <div style={{ backgroundColor: '#0A0A0A', border: `1px solid ${themeBorder}`, borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <HardDrive size={16} color={goldAccent} /> Storage Usage
                  </span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{storage.rawGBText} of 50 GB ({(programs.length > 0 ? (storage.percentage * (10 / 50)) : 0).toFixed(2)}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(1, storage.percentage)}%`, background: `linear-gradient(90deg, ${goldAccent}, #D9BF62)`, borderRadius: '99px' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                  Uploaded program resources, session materials, and session recordings use workspace storage. Make sure to delete unused resources to free up space.
                </span>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === 'Notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Notifications</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Decide which workspace events should trigger alerts.</p>
              </div>

              <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[
                  { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive critical activity digests and billing summaries by email.' },
                  { id: 'sessionReminders', label: 'Session Reminders', desc: 'Alerts and timing countdowns for scheduled program sessions.' },
                  { id: 'learnerActivityAlerts', label: 'Learner Activity Alerts', desc: 'Notifications on participant signup, logins, and engagement warnings.' },
                  { id: 'lowAttendanceAlerts', label: 'Low Attendance Alerts', desc: 'Flags when attendance rates drop below recommended limits.' },
                  { id: 'aiSummaryNotifications', label: 'AI Summary Notifications', desc: 'Receive AI generated session summaries and report analysis notifications.' }
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={notifPrefs[item.id]} 
                      onChange={e => setNotifPrefs(p => ({ ...p, [item.id]: e.target.checked }))} 
                      style={{ cursor: 'pointer', marginTop: '0.2rem', accentColor: goldAccent }} 
                    />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif" }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem', fontFamily: "'Inter', sans-serif" }}>{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: SUBSCRIPTION & PLAN */}
          {activeSection === 'Subscription & Plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Subscription & Plan</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Real-time subscription billing status and resource limits overview.</p>
              </div>

              <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

              <div style={{ backgroundColor: '#0A0A0A', borderRadius: '8px', border: `1px solid ${themeBorder}`, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: goldAccent, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Current Plan</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>Standard</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>₦50,000 / month</div>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Billed monthly</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plan Limits</h4>
                
                {/* Programs limit check */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Programs created</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{programs.length} / 10 Programs</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((programs.length / 10) * 100, 100)}%`, backgroundColor: goldAccent, borderRadius: '99px' }} />
                  </div>
                </div>

                {/* Learners limit check */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Participants enrolled</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{learners.length} / 200 Learners</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((learners.length / 200) * 100, 100)}%`, backgroundColor: goldAccent, borderRadius: '99px' }} />
                  </div>
                </div>

                {/* Storage limit check */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Storage consumed</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{storage.rawGBText} / 50 GB Storage</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${storage.percentage}%`, backgroundColor: goldAccent, borderRadius: '99px' }} />
                  </div>
                </div>
              </div>

              <button type="button" style={{ alignSelf: 'flex-start', background: '#0A0A0A', border: `1px solid ${themeBorder}`, color: '#fff', fontWeight: 600, fontSize: '0.8rem', borderRadius: '6px', padding: '0.65rem 1.25rem', cursor: 'pointer', marginTop: '0.5rem', fontFamily: "'Inter', sans-serif" }}>
                Manage Subscription
              </button>
            </div>
          )}

          {/* SECTION 6: SECURITY */}
          {activeSection === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Change Password</h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Ensure your account credentials are secure and updated.</p>
                </div>

                <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} required />
                  </div>
                </div>

                <button type="submit" style={{ alignSelf: 'flex-start', background: '#0A0A0A', border: `1px solid ${themeBorder}`, color: '#fff', fontWeight: 700, fontSize: '0.8rem', borderRadius: '6px', padding: '0.65rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Inter', sans-serif" }}>
                  <Key size={14} /> Update Password
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0' }}>Active Sessions</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>View active login sessions for security audit.</p>
                </div>
                <div style={{ backgroundColor: '#0A0A0A', borderRadius: '8px', border: `1px solid ${themeBorder}`, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: "'Inter', sans-serif" }}>
                      Chrome on Windows <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.15rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase' }}>Active Now</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>IP: 192.168.1.45 · Lagos, Nigeria</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to sign out of all other devices?")) {
                        if (addNotification) addNotification('success', 'Logged out of all other devices');
                      }
                    }}
                    style={{ 
                      backgroundColor: 'transparent', border: 'none', color: '#ef4444', 
                      fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', 
                      gap: '0.35rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" 
                    }}
                  >
                    Sign Out of All Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: DANGER ZONE */}
          {activeSection === 'Danger Zone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Danger Zone</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: "'Inter', sans-serif" }}>Critical destructive operations. These changes cannot be rolled back.</p>
              </div>

              <div style={{ borderBottom: `1px solid ${themeBorder}`, paddingBottom: '0.5rem' }} />

              <div style={{ backgroundColor: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <ShieldAlert size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>Delete Workspace</h4>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', lineHeight: 1.45 }}>
                      Permanently delete the organization <strong>{organizationName}</strong>, removing all program definitions, participant cohorts, facilitators, sessions, resource files, and generated reports.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowDeleteModal(true)}
                  style={{ 
                    alignSelf: 'flex-start', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', 
                    color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', borderRadius: '6px', 
                    padding: '0.55rem 1.1rem', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Danger Zone Confirmation Modal */}
      {showDeleteModal && (
        <div style={modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Confirm Deletion</h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', lineHeight: 1.45 }}>
              To confirm you want to delete the organization workspace, please type <strong>{organizationName}</strong> in the field below:
            </div>

            <input 
              type="text" 
              placeholder={organizationName} 
              value={deleteConfirmText} 
              onChange={e => setDeleteConfirmText(e.target.value)} 
              style={{ ...inputStyle, border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1.25rem' }} 
            />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} 
                style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: `1px solid ${themeBorder}`, color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteOrganization} 
                style={{ flex: 1.5, padding: '0.7rem', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Layout helper objects (copied for modal alignment)
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalBox = {
  backgroundColor: '#111111',
  border: '1px solid #1F1F1F',
  borderRadius: '16px',
  padding: '2rem',
  width: '100%',
  maxWidth: '440px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  textAlign: 'left'
};
