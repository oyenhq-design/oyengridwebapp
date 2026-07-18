import React, { useState, useRef } from 'react';
import { Users, BookOpen, Upload, Plus, Search, X, ChevronDown, Download, AlertTriangle, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';

const LEARNER_LIMIT = 50;

const SAMPLE_PROGRAMS = [
  { id: '', label: '— Select Program —' },
  { id: 'prog1', label: 'Leadership Development Program' },
  { id: 'prog2', label: 'Safety & Compliance Bootcamp' },
  { id: 'prog3', label: 'Digital Skills Training' },
];

const STATUS_COLORS = {
  Active:   { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  Pending:  { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  Inactive: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols[0] || cols[1]) {
      rows.push({ name: cols[0] || '', email: cols[1] || '', program: cols[2] || '' });
    }
  }
  return rows;
}

/* ── Reusable input style ── */
const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem',
  backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

export default function LearnersTab() {
  const [learners, setLearners]         = useState([]);
  const [search, setSearch]             = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport]     = useState(false);

  /* Add Learner form */
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', program: '' });

  /* Import flow */
  const [importStep, setImportStep]       = useState(1); // 1 | 2 | 3
  const [importedRows, setImportedRows]   = useState([]);
  const [importProgram, setImportProgram] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importError, setImportError]     = useState('');
  const fileInputRef = useRef(null);

  /* ── Derived ── */
  const activeLearners = learners.filter(l => l.status === 'Active').length;
  const uniquePrograms = [...new Set(learners.map(l => l.program).filter(Boolean))].length;
  const filtered = learners.filter(l =>
    `${l.name} ${l.email} ${l.program}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Add Learner ── */
  const handleAdd = (e) => {
    e.preventDefault();
    if (learners.length >= LEARNER_LIMIT) return;
    const name = `${addForm.firstName.trim()} ${addForm.lastName.trim()}`.trim();
    setLearners(prev => [...prev, {
      id: Date.now(), name, email: addForm.email.trim(),
      program: SAMPLE_PROGRAMS.find(p => p.id === addForm.program)?.label || '—',
      status: 'Active', joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }]);
    setAddForm({ firstName: '', lastName: '', email: '', program: '' });
    setShowAddModal(false);
  };

  /* ── File upload ── */
  const handleFile = (file) => {
    if (!file) return;
    setImportError('');
    setImportFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setImportError('Unsupported file format. Please upload a .CSV or .XLSX file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      if (rows.length === 0) { setImportError('No valid learner rows found. Check your file format.'); return; }
      setImportedRows(rows);
      setImportStep(2);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  /* ── Confirm import ── */
  const handleImport = () => {
    const available = LEARNER_LIMIT - learners.length;
    const toImport  = importedRows.slice(0, available);
    const programLabel = SAMPLE_PROGRAMS.find(p => p.id === importProgram)?.label || '—';
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newLearners = toImport.map((r, i) => ({
      id: Date.now() + i, name: r.name, email: r.email,
      program: r.program || programLabel,
      status: 'Active', joined: today,
    }));
    setLearners(prev => [...prev, ...newLearners]);
    setShowImport(false);
    setImportStep(1);
    setImportedRows([]);
    setImportProgram('');
    setImportFileName('');
    setImportError('');
  };

  const closeImport = () => {
    setShowImport(false);
    setImportStep(1);
    setImportedRows([]);
    setImportProgram('');
    setImportFileName('');
    setImportError('');
  };

  /* ── Sample CSV download ── */
  const downloadSample = () => {
    const csv = 'Name,Email,Program\nJohn Doe,john@email.com,Leadership Development Program\nSarah Ahmed,sarah@email.com,Safety & Compliance Bootcamp';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'oyen_learners_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const overLimit    = importedRows.length > LEARNER_LIMIT - learners.length;
  const allowedCount = Math.min(importedRows.length, LEARNER_LIMIT - learners.length);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Learners</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Manage learners enrolled in your programs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setShowImport(true); setImportStep(1); }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = '#D4AF37'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          >
            <Upload size={15} /> Import Learners
          </button>
          <button
            onClick={() => { if (learners.length >= LEARNER_LIMIT) return alert(`Learner limit reached (${LEARNER_LIMIT}). Upgrade your plan to add more.`); setShowAddModal(true); }}
            style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.25)', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={15} /> Add Learner
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.1rem' }}>
        {[
          { label: 'Learner Limit', value: LEARNER_LIMIT, icon: <Users size={20} />, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
          { label: 'Active Learners', value: activeLearners, icon: <Users size={20} />, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'Programs', value: uniquePrograms, icon: <BookOpen size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '0.1rem' }}>{card.value}</div>
            </div>
          </div>
        ))}
        {/* Limit bar */}
        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Used</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{learners.length} / {LEARNER_LIMIT}</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((learners.length / LEARNER_LIMIT) * 100, 100)}%`, background: 'linear-gradient(90deg,#D4AF37,#C49A2A)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* ── All Learners Table ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>All Learners</h3>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search learners..."
              style={{ ...inputStyle, paddingLeft: '2.2rem', width: '220px' }}
            />
          </div>
        </div>

        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr auto', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            <span>Learner</span><span>Email</span><span>Program</span><span>Status</span><span>Joined</span><span></span>
          </div>

          {filtered.length > 0 ? filtered.map(l => (
            <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr auto', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', fontSize: '0.82rem', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ color: '#fff', fontWeight: 600 }}>{l.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.email}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.program}</span>
              <span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: STATUS_COLORS[l.status]?.color || '#fff', backgroundColor: STATUS_COLORS[l.status]?.bg, padding: '0.18rem 0.5rem', borderRadius: '5px' }}>{l.status}</span>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{l.joined}</span>
              <button onClick={() => setLearners(prev => prev.filter(x => x.id !== l.id))}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '0.2rem', display: 'flex', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
              ><Trash2 size={14} /></button>
            </div>
          )) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
                <Users size={22} />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>No learners yet</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem' }}>Learners added to your programs will appear here.</p>
              </div>
              <button onClick={() => setShowAddModal(true)}
                style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.6rem 1.25rem', cursor: 'pointer', marginTop: '0.25rem' }}>
                Add Learner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          ADD LEARNER MODAL
      ════════════════════════════════════════ */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Add Learner</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Enrol a new learner into your workspace.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input required type="text" placeholder="John" value={addForm.firstName} onChange={e => setAddForm(p => ({ ...p, firstName: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input required type="text" placeholder="Doe" value={addForm.lastName} onChange={e => setAddForm(p => ({ ...p, lastName: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input required type="email" placeholder="john@company.com" value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Assign to Program</label>
                <div style={{ position: 'relative' }}>
                  <select value={addForm.program} onChange={e => setAddForm(p => ({ ...p, program: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}>
                    {SAMPLE_PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Add Learner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          IMPORT LEARNERS MODAL  (3 steps)
      ════════════════════════════════════════ */}
      {showImport && (
        <div onClick={closeImport} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {[1, 2, 3].map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, backgroundColor: importStep >= s ? '#D4AF37' : 'rgba(255,255,255,0.06)', color: importStep >= s ? '#000' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}>{s}</div>
                  {i < 2 && <div style={{ flex: 1, height: '2px', borderRadius: '99px', backgroundColor: importStep > s ? '#D4AF37' : 'rgba(255,255,255,0.06)', transition: 'background 0.3s' }} />}
                </React.Fragment>
              ))}
              <button onClick={closeImport} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <X size={15} />
              </button>
            </div>

            {/* ── STEP 1: Upload ── */}
            {importStep === 1 && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem', fontFamily: "'Outfit', sans-serif" }}>Import Learners</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Upload your learner list to quickly add multiple learners to your workspace.</p>

                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed rgba(212,175,55,0.25)', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'rgba(212,175,55,0.02)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
                >
                  <Upload size={28} color="#D4AF37" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ color: '#fff', fontWeight: 600, margin: '0 0 0.3rem', fontSize: '0.9rem' }}>
                    {importFileName || 'Upload CSV or Excel file'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0 }}>Drag & drop or click to browse · .CSV, .XLSX</p>
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                </div>

                {importError && (
                  <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.78rem', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertTriangle size={14} /> {importError}
                  </div>
                )}

                <button onClick={downloadSample} style={{ marginTop: '1rem', width: '100%', background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.35rem' }}>
                  <Download size={13} /> Download sample template
                </button>
              </>
            )}

            {/* ── STEP 2: Review ── */}
            {importStep === 2 && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem', fontFamily: "'Outfit', sans-serif" }}>Review Learners</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                  <strong style={{ color: '#D4AF37' }}>{importedRows.length}</strong> learner{importedRows.length !== 1 ? 's' : ''} found in <span style={{ color: 'rgba(255,255,255,0.6)' }}>{importFileName}</span>
                </p>

                {overLimit && (
                  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#f59e0b', fontSize: '0.78rem', backgroundColor: 'rgba(245,158,11,0.08)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertTriangle size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <span>You are trying to import <strong>{importedRows.length}</strong> learners. Your Standard plan allows <strong>{LEARNER_LIMIT}</strong> learners. Only the first <strong>{allowedCount}</strong> will be imported, or you can upgrade your plan.</span>
                  </div>
                )}

                {/* Preview table */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden', maxHeight: '220px', overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', padding: '0.6rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    <span>Name</span><span>Email</span><span>Program</span>
                  </div>
                  {importedRows.slice(0, allowedCount).map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', padding: '0.6rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem', alignItems: 'center' }}>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{r.name || '—'}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email || '—'}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{r.program || '—'}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button onClick={() => setImportStep(1)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>← Back</button>
                  <button onClick={() => setImportStep(3)} style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: Assign Program ── */}
            {importStep === 3 && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem', fontFamily: "'Outfit', sans-serif" }}>Assign to Program</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                  Learners without a program in the file will be assigned to the one you select below.
                </p>

                <div>
                  <label style={labelStyle}>Select Program</label>
                  <div style={{ position: 'relative' }}>
                    <select value={importProgram} onChange={e => setImportProgram(e.target.value)}
                      style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}>
                      {SAMPLE_PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} color="#22c55e" />
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                    <strong style={{ color: '#fff' }}>{allowedCount}</strong> learner{allowedCount !== 1 ? 's' : ''} ready to import
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button onClick={() => setImportStep(2)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>← Back</button>
                  <button onClick={handleImport} style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <Upload size={14} /> Import Learners
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
