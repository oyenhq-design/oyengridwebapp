import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Calendar, Download, Users } from 'lucide-react';

export default function AttendanceTab({ programs = [], learners = [], addNotification }) {
  const [selectedProgId, setSelectedProgId] = useState(programs[0]?.id || '');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [attendanceState, setAttendanceState] = useState({}); // { [learnerEmail]: 'Present' | 'Late' | 'Absent' }

  const program = programs.find(p => p.id === Number(selectedProgId));
  const sessions = program?.sessions || [];
  const progLearners = learners.filter(l => l.program === program?.name);

  const handleMark = (email, status) => {
    setAttendanceState(prev => ({
      ...prev,
      [email]: status
    }));
  };

  const handleSave = () => {
    if (!selectedSessionId) {
      alert('Please select a session first.');
      return;
    }
    const session = sessions.find(s => s.id === Number(selectedSessionId));
    if (session) {
      session.attendance = attendanceState;
      addNotification?.(`Attendance recorded for session "${session.title}"`);
      alert(`Attendance for "${session.title}" saved successfully.`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Attendance</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Record roll call, manage live logs, and track participation rates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '600px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Program</label>
          <select
            value={selectedProgId}
            onChange={e => {
              setSelectedProgId(e.target.value);
              setSelectedSessionId('');
              setAttendanceState({});
            }}
            style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
          >
            <option value="">Select a Program</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Session</label>
          <select
            value={selectedSessionId}
            disabled={!selectedProgId}
            onChange={e => {
              setSelectedSessionId(e.target.value);
              const sess = sessions.find(s => s.id === Number(e.target.value));
              setAttendanceState(sess?.attendance || {});
            }}
            style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', opacity: selectedProgId ? 1 : 0.5 }}
          >
            <option value="">Select a Session</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.date})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedSessionId && (
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Roll Call</h3>
            <button
              onClick={handleSave}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Save Attendance
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {progLearners.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '1rem 0' }}>
                No learners enrolled in this program.
              </div>
            ) : (
              progLearners.map(l => {
                const status = attendanceState[l.email] || 'Unmarked';
                return (
                  <div key={l.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{l.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{l.email}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleMark(l.email, 'Present')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.6rem',
                          backgroundColor: status === 'Present' ? 'rgba(34,197,94,0.15)' : 'transparent',
                          border: '1px solid',
                          borderColor: status === 'Present' ? '#22c55e' : 'rgba(255,255,255,0.1)',
                          color: status === 'Present' ? '#22c55e' : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <CheckCircle2 size={12} /> Present
                      </button>
                      <button
                        onClick={() => handleMark(l.email, 'Late')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.6rem',
                          backgroundColor: status === 'Late' ? 'rgba(245,158,11,0.15)' : 'transparent',
                          border: '1px solid',
                          borderColor: status === 'Late' ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                          color: status === 'Late' ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Clock size={12} /> Late
                      </button>
                      <button
                        onClick={() => handleMark(l.email, 'Absent')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.6rem',
                          backgroundColor: status === 'Absent' ? 'rgba(239,68,68,0.15)' : 'transparent',
                          border: '1px solid',
                          borderColor: status === 'Absent' ? '#ef4444' : 'rgba(255,255,255,0.1)',
                          color: status === 'Absent' ? '#ef4444' : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <XCircle size={12} /> Absent
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
