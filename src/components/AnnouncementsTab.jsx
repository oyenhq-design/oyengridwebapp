import React, { useState } from 'react';
import { Bell, Plus, Calendar, Send, Trash2, MessageSquare, Clock, Users, Check, Search } from 'lucide-react';

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

  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const selectedSession = sessions.find(s => String(s.id) === String(selectedSessionId));

  const handleTemplateClick = (text) => {
    setMessage(text);
    if (!subject) setSubject(text.split('\n')[0].substring(0, 50));
  };

  const handleSend = () => {
    if (!selectedSessionId || !subject || !message) return;
    addNotification?.(`Message sent to ${selectedSession?.title}`);
    alert(`Message sent successfully to ${selectedSession?.title}`);
    setSubject('');
    setMessage('');
    setIsScheduled(false);
  };

  // Mock messages for timeline
  const mockMessages = [
    { id: 1, subject: 'Reminder', sessionName: 'Leadership Orientation', learners: 24, status: 'Sent', time: '10:20 AM', date: 'Today' },
    { id: 2, subject: 'Resources', sessionName: 'Communication Skills', learners: 18, status: 'Sent', time: 'Yesterday', date: 'Yesterday' }
  ];

  const filteredMessages = mockMessages.filter(m => {
    if (activeFilter !== 'All' && m.status !== activeFilter) return false;
    if (searchQuery && !m.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !m.sessionName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filters = ['All', 'Sent', 'Scheduled', 'Drafts'];

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '3rem', textAlign: 'left', fontFamily: "'Inter', sans-serif", maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#232323', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Learner Communication</h2>
          <p style={{ color: '#5E5A53', fontSize: '15px', marginTop: '0.5rem' }}>
            Send updates, reminders and important information to learners in your assigned sessions.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#8D887E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today</div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#232323', fontSize: '16px', fontWeight: 600 }}>
            <span>{sessions.length} Sessions</span>
            <span style={{ color: '#E8E2D8' }}>|</span>
            <span>48 Learners</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: Compose */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 18px 45px rgba(50,40,20,.04)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Recipients */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#5E5A53', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipients</label>
              <select 
                value={selectedSessionId}
                onChange={e => setSelectedSessionId(e.target.value)}
                style={{ padding: '0.8rem 1rem', fontSize: '16px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #E8E2D8', color: '#232323', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
              >
                <option value="">Select a Session...</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.title} ({s.learners || 24} Learners)</option>
                ))}
              </select>
            </div>

            {/* Quick Templates */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {['Reminder', 'Resources', 'Schedule Change', 'Welcome', 'Assessment'].map(t => (
                <button
                  key={t}
                  onClick={() => handleTemplateClick(`${t}\n\nHello everyone,\n\n`)}
                  style={{ padding: '0.4rem 0.8rem', backgroundColor: '#F5F2EB', border: '1px solid #E8E2D8', color: '#5E5A53', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FCFBF8'; e.currentTarget.style.borderColor = '#C99A2E'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F5F2EB'; e.currentTarget.style.borderColor = '#E8E2D8'; }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Subject */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#5E5A53', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
              <input 
                type="text"
                placeholder="e.g. Reminder: Join 10 minutes early"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{ padding: '0.8rem 1rem', fontSize: '16px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #E8E2D8', color: '#232323', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            {/* Message */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#5E5A53', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
              <textarea 
                rows={6}
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ padding: '1rem', fontSize: '15px', backgroundColor: 'transparent', border: '1px solid #E8E2D8', borderRadius: '12px', color: '#232323', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E8E2D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="schedule-msg"
                  checked={isScheduled}
                  onChange={e => setIsScheduled(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#C99A2E', cursor: 'pointer' }}
                />
                <label htmlFor="schedule-msg" style={{ fontSize: '14px', color: '#5E5A53', cursor: 'pointer', fontWeight: 500 }}>Schedule for later</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  style={{ padding: '0.8rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #E8E2D8', color: '#5E5A53', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f4f4'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Save Draft
                </button>
                <button 
                  onClick={handleSend}
                  style={{ padding: '0.8rem 2rem', backgroundColor: '#C99A2E', border: 'none', color: '#fff', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(201,154,46,.2)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D7AE4F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C99A2E'; e.currentTarget.style.transform = 'none'; }}
                >
                  <Send size={18} /> Send Message
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#8D887E" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', fontSize: '14px', backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '999px', color: '#232323', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '999px',
                  border: activeFilter === f ? '1px solid #C99A2E' : '1px solid #E8E2D8',
                  backgroundColor: activeFilter === f ? '#C99A2E' : '#FCFBF8',
                  color: activeFilter === f ? '#FFFFFF' : '#5E5A53',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#232323', margin: 0 }}>Recent Messages</h3>
            
            {filteredMessages.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#FCFBF8', border: '1px dashed #E8E2D8', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '24px' }}>💬</div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#232323', margin: '0 0 0.2rem 0' }}>No messages yet</h4>
                  <p style={{ color: '#8D887E', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                    Messages you send to learners will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredMessages.map(m => (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#8D887E' }}>{m.date}</div>
                    <div style={{ backgroundColor: '#FCFBF8', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 15px rgba(50,40,20,.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#232323', margin: 0 }}>{m.subject}</h4>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: m.status === 'Sent' ? '#22C55E' : '#F59E0B', backgroundColor: m.status === 'Sent' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', padding: '0.2rem 0.5rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                          {m.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#5E5A53', fontWeight: 500 }}>{m.sessionName}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F5F2EB', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                        <div style={{ fontSize: '13px', color: '#8D887E', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Users size={14} /> {m.learners} Learners
                        </div>
                        <div style={{ fontSize: '13px', color: '#8D887E', fontWeight: 500 }}>{m.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
