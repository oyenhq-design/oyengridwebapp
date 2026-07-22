import React, { useState } from 'react';
import { Bell, Plus, Calendar, Send, Trash2, MessageSquare, Clock, Users, Check, Search, Paperclip, Link2 } from 'lucide-react';

const FacilitatorCommunicationView = ({ programs, addNotification }) => {
  // Extract all sessions
  const sessions = [];
  programs.forEach(p => {
    (p.sessions || []).forEach(s => {
      sessions.push({
        ...s,
        programName: p.name,
        programId: p.id,
      });
    });
  });

  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const selectedSession = sessions.find(s => String(s.id) === String(selectedSessionId));

  const handleTemplateClick = (text, defaultSubject) => {
    setMessage(text);
    if (!subject) setSubject(defaultSubject);
  };

  const handleSend = () => {
    if (!selectedSessionId || !subject || !message) return;
    addNotification?.(`Broadcast sent to ${selectedSession?.title}`);
    alert(`Broadcast sent successfully to ${selectedSession?.title}`);
    setSubject('');
    setMessage('');
    setIsScheduled(false);
  };

  // Minimal Mock broadcasts for right column
  const mockBroadcasts = [
    { id: 1, subject: 'Reminder sent', time: '10:20 AM' },
    { id: 2, subject: 'Resources shared', time: 'Yesterday' },
    { id: 3, subject: 'Welcome Message', time: '2 days ago' }
  ];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F4F1EB', minHeight: '100vh', padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 600, color: '#161616', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Learner Communication</h2>
        <p style={{ color: '#6D6D6D', fontSize: '15px', margin: 0 }}>
          Send updates to learners in your assigned sessions
        </p>
      </div>

      <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6', margin: '0.5rem 0' }}></div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Column: Flat Broadcast Composer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#161616', margin: 0 }}>+ New Message</h3>
          
          <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6' }}></div>

          {/* Audience Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '15px', fontWeight: 600, color: '#161616' }}>Audience</label>
            <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E7E1D6', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
              <select 
                value={selectedSessionId}
                onChange={e => setSelectedSessionId(e.target.value)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '15px', color: '#161616', fontWeight: 600 }}>{selectedSession?.title || 'Select Session'}</span>
                <span style={{ fontSize: '15px', color: '#6D6D6D' }}>{selectedSession?.learners || 24} Learners • {selectedSession?.date === 'Today' ? 'Today' : (selectedSession?.date || 'Today')} • {selectedSession?.time || '11:25 AM'}</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6', margin: '0.5rem 0' }}></div>

          {/* Quick Templates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '15px', fontWeight: 600, color: '#161616' }}>Quick Templates</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🕒', label: 'Reminder', text: 'Reminder\n\nHello everyone,\n\nPlease join 10 minutes early today.', subj: 'Reminder: Upcoming Session' },
                { icon: '📅', label: 'Schedule', text: 'Schedule Change\n\nHello everyone,\n\nPlease note a change in our schedule.', subj: 'Update: Schedule Change' },
                { icon: '📚', label: 'Resources', text: 'Resources\n\nHello everyone,\n\nI have attached the required reading materials.', subj: 'Resources for our session' },
                { icon: '🎓', label: 'Assessment', text: 'Assessment\n\nHello everyone,\n\nThe assessment is now available.', subj: 'Assessment Available' },
                { icon: '👋', label: 'Welcome', text: 'Welcome\n\nHello everyone,\n\nWelcome to the program! I look forward to meeting you all.', subj: 'Welcome to the Program!' },
              ].map(t => (
                <button
                  key={t.label}
                  onClick={() => handleTemplateClick(t.text, t.subj)}
                  style={{ backgroundColor: '#FAF8F4', border: '1px solid #E7E1D6', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C89A2B'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E1D6'; }}
                >
                  <span style={{ fontSize: '15px' }}>{t.icon}</span>
                  <span style={{ fontSize: '15px', color: '#161616', fontWeight: 500 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6', margin: '0.5rem 0' }}></div>

          {/* Subject & Message (Flat layout) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '15px', fontWeight: 600, color: '#161616', marginBottom: '0.5rem' }}>Subject</label>
              <input 
                type="text"
                placeholder="Message subject..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{ padding: '0.5rem 0', fontSize: '15px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #E7E1D6', color: '#161616', outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => { e.currentTarget.style.borderBottomColor = '#C89A2B'; }}
                onBlur={e => { e.currentTarget.style.borderBottomColor = '#E7E1D6'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '15px', fontWeight: 600, color: '#161616', marginBottom: '0.5rem' }}>Message</label>
              <textarea 
                rows={6}
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ padding: '0.5rem 0', fontSize: '15px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #E7E1D6', color: '#161616', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                onFocus={e => { e.currentTarget.style.borderBottomColor = '#C89A2B'; }}
                onBlur={e => { e.currentTarget.style.borderBottomColor = '#E7E1D6'; }}
              />
            </div>

            {/* Attachments */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'transparent', border: 'none', color: '#6D6D6D', fontSize: '15px', fontWeight: 500, cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = '#161616'} onMouseLeave={e => e.currentTarget.style.color = '#6D6D6D'}>
                <Paperclip size={16} /> Attach Resource
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'transparent', border: 'none', color: '#6D6D6D', fontSize: '15px', fontWeight: 500, cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = '#161616'} onMouseLeave={e => e.currentTarget.style.color = '#6D6D6D'}>
                <Link2 size={16} /> Attach Link
              </button>
            </div>

          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6', margin: '0.5rem 0' }}></div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="schedule-msg"
                checked={isScheduled}
                onChange={e => setIsScheduled(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#C89A2B', cursor: 'pointer' }}
              />
              <label htmlFor="schedule-msg" style={{ fontSize: '15px', color: '#161616', cursor: 'pointer', fontWeight: 500 }}>Schedule for later</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #E7E1D6', color: '#161616', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E7E1D6'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Save
              </button>
              <button 
                onClick={handleSend}
                style={{ padding: '0.6rem 1.2rem', backgroundColor: '#C89A2B', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D8AE45'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C89A2B'; }}
              >
                Send Broadcast
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Today's Broadcasts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#161616', margin: 0 }}>Today's Broadcasts</h3>
          <div style={{ width: '100%', height: '1px', backgroundColor: '#E7E1D6' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockBroadcasts.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: '#C89A2B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} strokeWidth={3} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '15px', color: '#161616', fontWeight: 500 }}>{b.subject}</span>
                  <span style={{ fontSize: '15px', color: '#6D6D6D' }}>{b.time}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};


export default function AnnouncementsTab({ programs = [], addNotification, userRole }) {
  if (userRole === 'Facilitator') {
    return <FacilitatorCommunicationView programs={programs} addNotification={addNotification} />;
  }

  const [selectedProgId, setSelectedProgId] = useState(programs[0]?.id || '');
  const [announcementText, setAnnouncementText] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const program = programs.find(p => p.id === Number(selectedProgId));
  const announcements = program?.announcements || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!announcementText.trim() || !selectedProgId) return;

    if (program) {
      const newAnn = {
        id: Date.now(),
        text: announcementText.trim(),
        date: isScheduled ? scheduleDate : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: isScheduled ? 'Scheduled' : 'Sent',
        by: 'Lead Facilitator'
      };
      program.announcements = [...(program.announcements || []), newAnn];
      addNotification?.(`Announcement posted for program "${program.name}"`);
      setAnnouncementText('');
      setScheduleDate('');
      setIsScheduled(false);
    }
  };

  const handleDelete = (id) => {
    if (program) {
      program.announcements = program.announcements.filter(a => a.id !== id);
      addNotification?.(`Announcement deleted`);
      // Trigger re-render by updating program state
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Announcements</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Broadcast news, schedule warnings, and alert learners about upcoming changes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Creation Box */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Create Announcement</h3>
          
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Program</label>
              <select
                value={selectedProgId}
                onChange={e => setSelectedProgId(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              >
                <option value="">Select a Program</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Message Content</label>
              <textarea
                required
                placeholder="Type your message to all learners enrolled in this program..."
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="schedule-chk"
                checked={isScheduled}
                onChange={e => setIsScheduled(e.target.checked)}
                style={{ accentColor: '#F5D76E', cursor: 'pointer' }}
              />
              <label htmlFor="schedule-chk" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Schedule for later</label>
            </div>

            {isScheduled && (
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Schedule Date</label>
                <input
                  required
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedProgId}
              style={{ width: '100%', padding: '0.7rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', opacity: selectedProgId ? 1 : 0.5 }}
            >
              <Send size={14} /> {isScheduled ? 'Schedule' : 'Send'} Announcement
            </button>
          </form>
        </div>

        {/* History Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Announcement History</h3>
          
          {announcements.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
              No announcements sent yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {announcements.map(a => (
                <div key={a.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <Calendar size={11} /> {a.date}
                    </div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: a.status === 'Sent' ? '#22c55e' : '#f59e0b', backgroundColor: a.status === 'Sent' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      {a.status}
                    </span>
                  </div>
                  <p style={{ color: '#fff', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>{a.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
