import React, { useState } from 'react';
import { Bell, Plus, Calendar, Send, Trash2 } from 'lucide-react';

export default function AnnouncementsTab({ programs = [], addNotification }) {

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
