import React, { useState } from 'react';
import { 
  User, Mail, Globe, Clock, Shield, Award, BookOpen, 
  HelpCircle, Calendar, CheckSquare, Settings, Bell, 
  Moon, MessageSquare, ClipboardCheck, Volume2
} from 'lucide-react';

export default function FacilitatorProfile({ userInfo }) {
  const { fullName, email, role, timezone } = userInfo || {};
  const facilitatorName = fullName || 'oyengroupp';
  const initials = facilitatorName.substring(0, 2).toUpperCase();

  // Mock preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    sessionReminders: true,
    announcementAlerts: true,
    darkMode: false,
    preferredTimezone: timezone || 'Africa/Lagos',
    language: 'English'
  });

  const handleTogglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectPreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Mock timeline and stats
  const assignedProgrammes = [
    { id: 1, title: 'Leadership Development', sessions: '3 Sessions', status: 'Upcoming', statusColor: '#D6A62A' },
    { id: 2, title: 'Power Systems', sessions: '1 Session', status: 'Completed', statusColor: '#3B82F6' },
    { id: 3, title: 'Safety Workshop', sessions: '2 Sessions', status: 'Ongoing', statusColor: '#10B981' }
  ];

  const recentActivity = [
    { id: 1, text: 'Profile created', time: '1 month ago' },
    { id: 2, text: 'Assigned to Leadership Programme', time: '2 weeks ago' },
    { id: 3, text: 'New resource shared', time: '5 days ago' },
    { id: 4, text: 'Session assigned', time: '3 days ago' },
    { id: 5, text: 'Completed attendance', time: 'Yesterday' }
  ];

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F7F4ED', 
      minHeight: '100vh', 
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#111111',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* Header */}
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
          Your personal facilitator workspace card and preferences.
        </p>
      </div>

      {/* Two Column Workspace Grid Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.6fr 1fr', 
        gap: '2.5rem', 
        alignItems: 'start' 
      }}>
        
        {/* LEFT COLUMN: Personal Card, Assigned Programmes, and Availability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Personal Profile Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                width: '84px', 
                height: '84px', 
                borderRadius: '50%', 
                backgroundColor: '#111111', // OYEN GRID Black Card theme
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2.1rem', 
                fontWeight: 800, 
                color: '#FFFDF9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                {initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                    {facilitatorName}
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
                  {role || 'Facilitator'}
                </span>
                <span style={{ color: '#666666', fontSize: '0.85rem', display: 'block', marginTop: '0.1rem' }}>
                  ABC Energy Workspace
                </span>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1.5rem', 
              borderTop: '1px solid rgba(0,0,0,0.05)', 
              paddingTop: '2rem' 
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>EMAIL ADDRESS</span>
                <span style={{ color: '#111111', fontSize: '0.9rem', fontWeight: 700 }}>{email || 'oyengroupp@gmail.com'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>PHONE NUMBER</span>
                <span style={{ color: '#111111', fontSize: '0.9rem', fontWeight: 700 }}>+234 812 345 6789</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>TIMEZONE</span>
                <span style={{ color: '#111111', fontSize: '0.9rem', fontWeight: 700 }}>{preferences.preferredTimezone}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>MEMBER SINCE</span>
                <span style={{ color: '#111111', fontSize: '0.9rem', fontWeight: 700 }}>12 Jan 2026</span>
              </div>
            </div>
          </div>

          {/* Assigned Programmes */}
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
              Assigned Programmes
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {assignedProgrammes.map(prog => (
                <div 
                  key={prog.id}
                  style={{
                    backgroundColor: '#F7F4ED',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1px solid rgba(0,0,0,0.015)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111', margin: '0 0 0.5rem', fontFamily: "'Outfit', sans-serif" }}>
                    {prog.title}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>{prog.sessions}</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: prog.statusColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {prog.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Status Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2rem 2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '1px' }}>Availability Status</span>
              <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Controlled dynamically by workspace administrator</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '0.5rem 1.25rem', borderRadius: '30px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>Available</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Quick Stats, Preferences, Support, and Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Quick Stats Grid */}
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
              Quick Stats
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: '#F7F4ED', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.015)' }}>
                <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 600, display: 'block' }}>TOTAL ASSIGNED</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111111', display: 'block', marginTop: '0.25rem', fontFamily: "'Outfit', sans-serif" }}>6</span>
              </div>
              <div style={{ backgroundColor: '#F7F4ED', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.015)' }}>
                <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 600, display: 'block' }}>UPCOMING</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D6A62A', display: 'block', marginTop: '0.25rem', fontFamily: "'Outfit', sans-serif" }}>2</span>
              </div>
              <div style={{ backgroundColor: '#F7F4ED', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.015)' }}>
                <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 600, display: 'block' }}>RESOURCES</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3B82F6', display: 'block', marginTop: '0.25rem', fontFamily: "'Outfit', sans-serif" }}>12</span>
              </div>
              <div style={{ backgroundColor: '#F7F4ED', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.015)' }}>
                <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 600, display: 'block' }}>CERTIFICATES</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', display: 'block', marginTop: '0.25rem', fontFamily: "'Outfit', sans-serif" }}>4</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
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

            {/* Email Notifications toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Email Notifications</span>
                <span style={{ fontSize: '0.75rem', color: '#888888' }}>Receive daily activity logs</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.emailNotifications}
                onChange={() => handleTogglePreference('emailNotifications')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.emailNotifications ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>

            {/* Session Reminders toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Session Reminders</span>
                <span style={{ fontSize: '0.75rem', color: '#888888' }}>Reminders before start time</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.sessionReminders}
                onChange={() => handleTogglePreference('sessionReminders')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.sessionReminders ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>

            {/* Announcement Alerts toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Announcement Alerts</span>
                <span style={{ fontSize: '0.75rem', color: '#888888' }}>Admin broadcast notices</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.announcementAlerts}
                onChange={() => handleTogglePreference('announcementAlerts')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.announcementAlerts ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>

            {/* Dark Mode toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', display: 'block' }}>Dark Mode</span>
                <span style={{ fontSize: '0.75rem', color: '#888888' }}>Simulated theme preference</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.darkMode}
                onChange={() => handleTogglePreference('darkMode')}
                style={{ width: '38px', height: '20px', appearance: 'none', backgroundColor: preferences.darkMode ? '#D6A62A' : '#E2E8F0', borderRadius: '20px', position: 'relative', outline: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            </div>
          </div>

          {/* Account Status Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 0.5rem'
            }}>
              Account Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#888888' }}>Workspace Name</span>
                <span style={{ color: '#111111', fontWeight: 700 }}>ABC Energy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#888888' }}>Permission Level</span>
                <span style={{ color: '#111111', fontWeight: 700 }}>Facilitator Profile</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#888888' }}>Last Account Login</span>
                <span style={{ color: '#111111', fontWeight: 700 }}>Today</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                <span style={{ color: '#888888' }}>Security Status</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>Verified Account</span>
              </div>
            </div>
          </div>

          {/* Support Info Card */}
          <div style={{ 
            backgroundColor: '#FFFDF9', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: 0
            }}>
              Need Help?
            </h3>
            <p style={{ color: '#666666', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              Contact your Workspace Administrator or reach out directly to OYEN GRID Support.
            </p>
            <button 
              onClick={() => alert('Support ticket simulation: contact support@oyengrid.com')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #D6A62A',
                color: '#D6A62A',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D6A62A'; e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#D6A62A'; }}
            >
              Get Help
            </button>
          </div>

          {/* Recent Activity Timeline */}
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
              Recent Activity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recentActivity.map((act, i) => (
                <div key={act.id} style={{ 
                  borderBottom: i === recentActivity.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.03)',
                  paddingBottom: i === recentActivity.length - 1 ? 0 : '1.25rem'
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
          </div>

        </div>

      </div>

    </div>
  );
}
