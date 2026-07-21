import React, { useState } from 'react';
import { Award, Plus, Calendar, Check, Download, RotateCcw, ShieldCheck } from 'lucide-react';

export default function CertificatesTab({ programs = [], learners = [], addNotification }) {
  const [selectedProgId, setSelectedProgId] = useState(programs[0]?.id || '');
  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('oyen_ws_certificates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveCerts = (newCerts) => {
    setCertificates(newCerts);
    localStorage.setItem('oyen_ws_certificates', JSON.stringify(newCerts));
  };

  const program = programs.find(p => p.id === Number(selectedProgId));
  const progLearners = learners.filter(l => l.program === program?.name);

  const handleGenerate = (learnerEmail, name) => {
    if (certificates.some(c => c.email === learnerEmail && c.programId === Number(selectedProgId))) {
      alert('Certificate already generated for this learner.');
      return;
    }
    const newCert = {
      id: Date.now(),
      name,
      email: learnerEmail,
      programId: Number(selectedProgId),
      programName: program?.name || '',
      status: 'Issued',
      date: new Date().toLocaleDateString('en-GB')
    };
    const updated = [newCert, ...certificates];
    saveCerts(updated);
    addNotification?.(`Generated certificate for "${name}"`);
  };

  const handleReissue = (id) => {
    const updated = certificates.map(c => 
      c.id === id 
        ? { ...c, date: new Date().toLocaleDateString('en-GB'), status: 'Reissued' } 
        : c
    );
    saveCerts(updated);
    addNotification?.('Certificate reissued successfully');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Certificates</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Generate, download, verify, and reissue course completion credentials.
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Program</label>
        <select
          value={selectedProgId}
          onChange={e => setSelectedProgId(e.target.value)}
          style={{ width: '100%', maxWidth: '300px', padding: '0.65rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
        >
          <option value="">Select a Program</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedProgId && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          {/* Issue Section */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Enrolled Learners</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {progLearners.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>No learners in this program.</div>
              ) : (
                progLearners.map(l => {
                  const hasCert = certificates.some(c => c.email === l.email && c.programId === Number(selectedProgId));
                  return (
                    <div key={l.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{l.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{l.email}</div>
                      </div>
                      <button
                        onClick={() => handleGenerate(l.email, l.name)}
                        disabled={hasCert}
                        style={{
                          padding: '0.4rem 0.85rem',
                          backgroundColor: hasCert ? 'rgba(255,255,255,0.04)' : '#F5D76E',
                          border: 'none',
                          color: hasCert ? 'rgba(255,255,255,0.3)' : '#000',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: hasCert ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {hasCert ? 'Generated' : 'Generate'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Certificate Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Issued Credentials</h3>
            {certificates.filter(c => c.programId === Number(selectedProgId)).length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                No certificates issued for this program yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {certificates.filter(c => c.programId === Number(selectedProgId)).map(c => (
                  <div key={c.id} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{c.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <ShieldCheck size={12} color="#22c55e" /> Status: {c.status} · Issued {c.date}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => alert(`Downloading Certificate PDF...`)} style={{ padding: '0.3rem 0.55rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}><Download size={11} /></button>
                      <button onClick={() => handleReissue(c.id)} style={{ padding: '0.3rem 0.55rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}><RotateCcw size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
