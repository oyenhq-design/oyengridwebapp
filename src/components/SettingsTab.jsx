import React, { useState } from 'react';
import { 
  Building2, Users, HardDrive, Bell, CreditCard, Shield, Trash2, 
  UserPlus, ShieldAlert, Key, LogOut, Check, AlertTriangle
} from 'lucide-react';

export default function SettingsTab({ 
  programs = [], 
  learners = [], 
  teamMembers = [], 
  setTeamMembers,
  addNotification,
  organizationName = 'ABC ENERGY',
  setOrganizationName,
  onInviteTeamClick,
  onLogout
}) {
  const [activeSection, setActiveSection] = useState('Organization');

  // Organization settings states
  const [orgName, setOrgName] = useState(organizationName);
  const [adminEmail, setAdminEmail] = useState('admin@abcenergy.co');
  const [taxId, setTaxId] = useState('TX-8827-229');

  // Security password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification preferences states
  const [notifPrefs, setNotifPrefs] = useState({
    programActivity: true,
    sessionReminders: true,
    attendanceAlerts: false,
    learnerAlerts: true,
    reportNotifications: false
  });

  // Danger zone deletion verification state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Live storage calculator helper
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
    const totalMB = totalBytes / (1024 * 1024);
    return {
      text: totalBytes === 0 ? '0.00 MB / 10 GB' : totalBytes >= 1024*1024*1024 ? `${(totalBytes / (1024*1024*1024)).toFixed(2)} GB / 10 GB` : `${totalMB.toFixed(2)} MB / 10 GB`,
      percentage: Math.min((totalMB / 10240) * 100, 100)
    };
  };

  const storage = calculateTotalStorage();

  const handleSaveOrgSettings = (e) => {
    e.preventDefault();
    if (addNotification) {
      addNotification('success', 'Organization settings updated successfully');
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
      addNotification('success', 'Security password updated successfully');
    }
  };

  const handleDeleteOrganization = () => {
    if (deleteConfirmText !== orgName) {
      alert(`Please type "${orgName}" correctly to confirm`);
      return;
    }
    alert("Danger Zone: This demo organization deletion has been validated. In production, this would delete all data.");
    setShowDeleteModal(false);
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

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Manage your organization credentials, team seats, limits, workspace storage, and notification channels.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start', marginTop: '0.5rem' }}>
        
        {/* Left Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.85rem' }}>
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
                  backgroundColor: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                  color: isSelected ? (s.color || '#D4AF37') : (s.color ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.6)'),
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 600 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.icon}
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Right Settings Content Area */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '2rem' }}>
          
          {/* SECTION 1: ORGANIZATION */}
          {activeSection === 'Organization' && (
            <form onSubmit={handleSaveOrgSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Organization Profile</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Configure key identities and branding parameters of your enterprise workspace.</p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Organization Name</label>
                  <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Tax Registration ID</label>
                  <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Administrator Contact Email</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={inputStyle} required />
              </div>

              <button type="submit" style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '6px', padding: '0.65rem 1.25rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                Save Changes
              </button>
            </form>
          )}

          {/* SECTION 2: TEAM & ACCESS */}
          {activeSection === 'Team & Access' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Team & Access Control</h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Invite administrators and program facilitators to run sessions and review compliance.</p>
                </div>
                <button 
                  onClick={onInviteTeamClick}
                  style={{ 
                    backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37', color: '#D4AF37', 
                    borderRadius: '6px', padding: '0.45rem 0.95rem', fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' 
                  }}
                >
                  <UserPlus size={14} /> Invite Member
                </button>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

              <div style={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                {teamMembers.map((member, i) => (
                  <div key={member.email || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.1rem', borderBottom: i < teamMembers.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{member.name || member.email}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem' }}>{member.email}</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {member.role || 'Member'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: WORKSPACE & STORAGE */}
          {activeSection === 'Workspace' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Workspace Settings</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Shared organization workspace configuration and live disk storage consumption.</p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Workspace Name</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>OYEN GRID Main Space</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Active Template Hook</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>bootcamp</span>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', backgroundColor: '#000', borderRadius: '8px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <HardDrive size={16} color="#3b82f6" /> Shared Cloud Storage
                  </span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{storage.text}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${storage.percentage}%`, background: 'linear-gradient(90deg,#3b82f6,#2563eb)', borderRadius: '99px' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                  This storage calculation is derived dynamically from all resources uploaded inside programs and meeting sessions.
                </span>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === 'Notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Notification Channels</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Decide which workspace updates should trigger dashboard banners and email alerts.</p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                {[
                  { id: 'programActivity', label: 'Program activity updates', desc: 'Alerts when programs are created, modified, or completed.' },
                  { id: 'sessionReminders', label: 'Session reminders', desc: 'Get notified prior to scheduled meeting sessions.' },
                  { id: 'attendanceAlerts', label: 'Attendance warnings', desc: 'Flags when attendance records are below limits.' },
                  { id: 'learnerAlerts', label: 'Learner / Participant notifications', desc: 'Triggers when a participant registers or leaves.' },
                  { id: 'reportNotifications', label: 'Report generation notifications', desc: 'Notifies when workspace report analysis completes.' }
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={notifPrefs[item.id]} 
                      onChange={e => setNotifPrefs(p => ({ ...p, [item.id]: e.target.checked }))} 
                      style={{ cursor: 'pointer', marginTop: '0.2rem' }} 
                    />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem' }}>{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: SUBSCRIPTION & PLAN */}
          {activeSection === 'Subscription & Plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Plan & Limits</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Real-time subscription billing status and resource limits overview.</p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

              <div style={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Current Plan</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '0.15rem' }}>Professional Teams</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>$49 / mo</div>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Billed monthly</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Resource Consumption</h4>
                
                {/* Programs limit check */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Programs created</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{programs.length} / 3</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((programs.length / 3) * 100, 100)}%`, backgroundColor: '#D4AF37', borderRadius: '99px' }} />
                  </div>
                </div>

                {/* Learners limit check */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Participants enrolled</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{learners.length} / 50</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((learners.length / 50) * 100, 100)}%`, backgroundColor: '#22c55e', borderRadius: '99px' }} />
                  </div>
                </div>

                {/* Storage limit check */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Storage consumed</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{storage.text}</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${storage.percentage}%`, backgroundColor: '#3b82f6', borderRadius: '99px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SECURITY */}
          {activeSection === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Change Password</h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Ensure your account credentials are secure and updated.</p>
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

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

                <button type="submit" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', borderRadius: '6px', padding: '0.65rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={14} /> Update Password
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0' }}>Device Management</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>View or terminate active login sessions.</p>
                </div>
                <div style={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Chrome on Windows <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '0.15rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase' }}>Active Now</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>IP: 192.168.1.45 · Lagos, Nigeria</span>
                  </div>
                  {onLogout && (
                    <button 
                      onClick={onLogout}
                      style={{ 
                        backgroundColor: 'transparent', border: 'none', color: '#ef4444', 
                        fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', 
                        gap: '0.35rem', cursor: 'pointer' 
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: DANGER ZONE */}
          {activeSection === 'Danger Zone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', margin: '0 0 0.25rem 0', fontFamily: "'Outfit', sans-serif" }}>Danger Zone</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Critical destructive operations. These changes cannot be rolled back.</p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }} />

              <div style={{ backgroundColor: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <ShieldAlert size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>Delete Organization Workspace</h4>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', lineHeight: 1.45 }}>
                      Permanently delete the organization <strong>{orgName}</strong>, removing all program definitions, participant cohorts, facilitators, sessions, resource files, and generated reports.
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
              To confirm you want to delete the organization workspace, please type <strong>{orgName}</strong> in the field below:
            </div>

            <input 
              type="text" 
              placeholder={orgName} 
              value={deleteConfirmText} 
              onChange={e => setDeleteConfirmText(e.target.value)} 
              style={{ ...inputStyle, border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1.25rem' }} 
            />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} 
                style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
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
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalBox = {
  backgroundColor: '#0c0d12',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '2rem',
  width: '100%',
  maxWidth: '440px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  textAlign: 'left'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '0.35rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.82rem',
  outline: 'none',
  boxSizing: 'border-box'
};
