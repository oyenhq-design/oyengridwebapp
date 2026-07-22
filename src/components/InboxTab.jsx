import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageSquare, FileText, Calendar, Zap, Sparkles, Megaphone, Play } from 'lucide-react';

export default function InboxTab({ announcements = [], programs = [], onSelectSession }) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state parsing
  const { 
    actionRequiredSessions, 
    upcomingSessions, 
    messageAnnouncements, 
    resourceAnnouncements, 
    aiAnnouncements, 
    orgAnnouncements 
  } = useMemo(() => {
    const allSessions = [];
    (programs || []).forEach(p => {
      (p.sessions || []).forEach(s => {
        allSessions.push({ ...s, programName: p.name, programId: p.id });
      });
    });

    const actionReq = [];
    const upcoming = [];

    allSessions.forEach(s => {
      if (s.status === 'Live' || s.status === 'Ready to Start') {
        actionReq.push(s);
        return;
      }
      if (s.status === 'Completed' || s.status === 'Processing') {
        return;
      }
      
      let isSoon = false;
      if (s.date && s.time) {
        let dStr = s.date;
        const today = new Date();
        if (dStr.toLowerCase() === 'today') {
          dStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        } else if (dStr.toLowerCase() === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          dStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
        }
        
        const targetDate = new Date(`${dStr} ${s.time}`);
        if (!isNaN(targetDate.getTime())) {
          const diffMins = Math.floor((targetDate - today) / 60000);
          if (diffMins <= 60 && diffMins >= -120) {
            isSoon = true;
          }
        }
      }
      
      if (isSoon) {
        actionReq.push(s);
      } else {
        upcoming.push(s);
      }
    });

    const messages = [];
    const resources = [];
    const ai = [];
    const org = [];

    (announcements || []).forEach(a => {
      const textLower = (a.title || a.text || '').toLowerCase();
      const typeLower = (a.type || '').toLowerCase();
      
      if (typeLower.includes('message') || textLower.includes('message') || typeLower.includes('note') || typeLower.includes('reply')) {
        messages.push(a);
      } else if (typeLower.includes('resource') || textLower.includes('resource') || typeLower.includes('slide') || typeLower.includes('guide') || textLower.includes('module')) {
        resources.push(a);
      } else if (typeLower.includes('ai') || textLower.includes('summary')) {
        ai.push(a);
      } else {
        org.push(a);
      }
    });

    return { 
      actionRequiredSessions: actionReq, 
      upcomingSessions: upcoming, 
      messageAnnouncements: messages, 
      resourceAnnouncements: resources, 
      aiAnnouncements: ai, 
      orgAnnouncements: org 
    };
  }, [announcements, programs]);

  // Filtering Logic
  const matchesSearch = (text) => text.toLowerCase().includes(searchQuery.toLowerCase());

  const filteredActionRequired = actionRequiredSessions.filter(s => matchesSearch(s.title) || matchesSearch(s.programName));
  const filteredUpcoming = upcomingSessions.filter(s => matchesSearch(s.title) || matchesSearch(s.programName));
  const filteredMessages = messageAnnouncements.filter(a => matchesSearch(a.text) || matchesSearch(a.type));
  const filteredResources = resourceAnnouncements.filter(a => matchesSearch(a.text) || matchesSearch(a.type));
  const filteredAi = aiAnnouncements.filter(a => matchesSearch(a.text) || matchesSearch(a.type));
  const filteredOrg = orgAnnouncements.filter(a => matchesSearch(a.text) || matchesSearch(a.type));

  const showAction = filter === 'All' || filter === 'Action Required';
  const showMessages = filter === 'All' || filter === 'Messages';
  const showSessions = filter === 'All' || filter === 'Sessions';
  const showResources = filter === 'All' || filter === 'Resources';
  const showOrg = filter === 'All'; // Org and AI only on All tab
  const showAi = filter === 'All';

  const filterTabs = ['All', 'Action Required', 'Messages', 'Sessions', 'Resources'];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Inbox</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Your operational activity center for sessions, messages, resources, and organization updates.
          </p>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {filterTabs.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                style={{ 
                  padding: '0.4rem 1rem', 
                  backgroundColor: filter === t ? '#F5D76E' : 'rgba(255,255,255,0.05)', 
                  border: 'none', 
                  color: filter === t ? '#000' : 'rgba(255,255,255,0.6)', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feeds */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* Action Required */}
        {showAction && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={14} /> Action Required
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredActionRequired.length === 0 ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center' }}>
                  You're all caught up.
                </div>
              ) : (
                filteredActionRequired.map(s => (
                  <div key={s.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {s.status === 'Live' ? 'Live Now' : 'Starting Soon'}
                      </div>
                      <h4 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 0.3rem 0' }}>{s.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>
                        {s.programName} • {s.time}
                      </p>
                    </div>
                    <button 
                      onClick={() => onSelectSession && onSelectSession(s)}
                      style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Play size={14} fill="#000" /> Open Session
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {showMessages && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={14} /> Messages
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredMessages.length === 0 ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center' }}>
                  No new messages.
                </div>
              ) : (
                filteredMessages.map(a => (
                  <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {a.type || 'Message'} • {a.date}
                      </div>
                      <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                        {a.text}
                      </p>
                    </div>
                    <button 
                      onClick={() => alert('Opening message thread...')}
                      style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Resources */}
        {showResources && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} /> Resources
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredResources.length === 0 ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center' }}>
                  No recent resource updates.
                </div>
              ) : (
                filteredResources.map(a => (
                  <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {a.type || 'Resource Update'} • {a.date}
                      </div>
                      <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                        {a.text}
                      </p>
                    </div>
                    <button 
                      onClick={() => alert('Viewing resource...')}
                      style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      View Resource
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        {showSessions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} /> Upcoming Sessions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredUpcoming.length === 0 ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center' }}>
                  No upcoming sessions.
                </div>
              ) : (
                filteredUpcoming.map(s => (
                  <div key={s.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {s.date} • {s.time}
                      </div>
                      <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: '0 0 0.3rem 0' }}>{s.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>
                        {s.programName}
                      </p>
                    </div>
                    <button 
                      onClick={() => onSelectSession && onSelectSession(s)}
                      style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Open Session
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AI Announcements */}
        {showAi && filteredAi.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> AI
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredAi.map(a => (
                <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      {a.type || 'AI Notice'} • {a.date}
                    </div>
                    <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                      {a.text}
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Viewing AI item...')}
                    style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organization */}
        {showOrg && filteredOrg.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Megaphone size={14} /> Organization
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredOrg.map(a => (
                <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      {a.type || 'Announcement'} • {a.date}
                    </div>
                    <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                      {a.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
