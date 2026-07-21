import React from 'react';
import { HelpCircle, AlertCircle, Phone, FileText } from 'lucide-react';

export default function InboxTab() {
  const categories = [
    {
      title: 'Today',
      messages: [
        { id: 1, type: 'Session Reminder', text: "Tomorrow's session starts at 9:00 AM", date: 'Today, 2:30 PM' },
        { id: 2, type: 'Resource Update', text: 'Module 2 slides have been updated', date: 'Today, 11:15 AM' }
      ]
    },
    {
      title: 'Yesterday',
      messages: [
        { id: 3, type: 'Admin Message', text: 'The Organization Owner added a note to your next session', date: 'Yesterday, 4:05 PM' },
        { id: 4, type: 'AI Summary Ready', text: 'AI summary is now available for Leadership Fundamentals', date: 'Yesterday, 1:20 PM' }
      ]
    },
    {
      title: 'Earlier',
      messages: [
        { id: 5, type: 'Recording Available', text: 'Session recording has finished processing', date: '18 Aug 2026' },
        { id: 6, type: 'Organization Announcement', text: 'Welcome to the Q3 Training Cycle! Materials are now ready.', date: '15 Aug 2026' }
      ]
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Inbox</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Your central workspace updates, announcements, and support.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Messages Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categories.map(cat => (
            <div key={cat.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F5D76E', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                {cat.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cat.messages.map(msg => (
                  <div 
                    key={msg.id} 
                    style={{ 
                      backgroundColor: '#0e0f14', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '12px', 
                      padding: '1.2rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', padding: '0.2rem' }}>
                      {msg.type === 'Session Reminder' ? '⏰' :
                       msg.type === 'Resource Update' ? '📄' :
                       msg.type === 'Admin Message' ? '💬' :
                       msg.type === 'AI Summary Ready' ? '✨' :
                       msg.type === 'Recording Available' ? '📹' : '📢'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>
                          {msg.type}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>{msg.date}</span>
                      </div>
                      <p style={{ color: '#fff', fontSize: '0.85rem', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Need Help Sidebar Card */}
        <div 
          style={{ 
            backgroundColor: '#0e0f14', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '14px', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <HelpCircle size={20} color="#F5D76E" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Need Help?
            </h3>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
            Experiencing technical issues or have scheduling questions? Contact support or your administrator directly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => alert('Support ticket dialogue opened.')}
              style={{ 
                width: '100%', 
                padding: '0.65rem', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '8px', 
                color: '#fff', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={14} color="#ef4444" /> Report an Issue
            </button>
            <button 
              onClick={() => alert('Message prompt for Org Owner/Admin opened.')}
              style={{ 
                width: '100%', 
                padding: '0.65rem', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '8px', 
                color: '#fff', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Phone size={14} color="#3b82f6" /> Contact Organization Admin
            </button>
            <button 
              onClick={() => alert('Opening Support Guide...')}
              style={{ 
                width: '100%', 
                padding: '0.65rem', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '8px', 
                color: '#fff', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FileText size={14} color="#a855f7" /> View Support Guide
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
