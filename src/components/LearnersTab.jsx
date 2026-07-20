import React, { useState, useRef } from 'react';
import { Users, BookOpen, Upload, Plus, Search, X, ChevronDown, Download, AlertTriangle, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const LEARNER_LIMIT = 50;

const STATUS_COLORS = {
  Active:   { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  Pending:  { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  Inactive: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

/* ── Parse CSV text into row objects ── */
function parseCSVText(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header     = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const nameIdx    = header.findIndex(h => h.includes('name'));
  const emailIdx   = header.findIndex(h => h.includes('email') || h.includes('e-mail'));
  const programIdx = header.findIndex(h => h.includes('program') || h.includes('programme'));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols  = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const name  = nameIdx    >= 0 ? (cols[nameIdx]    || '') : (cols[0] || '');
    const email = emailIdx   >= 0 ? (cols[emailIdx]   || '') : (cols[1] || '');
    const prog  = programIdx >= 0 ? (cols[programIdx] || '') : (cols[2] || '');
    if (name || email) rows.push({ name, email, program: prog });
  }
  return rows;
}

/* ── Parse an XLSX/XLS workbook ArrayBuffer into row objects ── */
function parseWorkbook(arrayBuffer) {
  const workbook  = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet     = workbook.Sheets[sheetName];
  const json      = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return json.map(row => {
    const keys = Object.keys(row);
    const find = (...candidates) => {
      const key = keys.find(k => candidates.some(c => k.toLowerCase().includes(c)));
      return key ? String(row[key]).trim() : '';
    };
    return {
      name:    find('name'),
      email:   find('email', 'e-mail', 'mail'),
      program: find('program', 'programme', 'course'),
    };
  }).filter(r => r.name || r.email);
}

/* ── Shared styles ── */
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

/* ════════════════════════════════════════════════════════════
   LearnersTab (User-Facing: Participants)
════════════════════════════════════════════════════════════ */
export default function LearnersTab({
  programs = [],
  learners = [],
  setLearners,
  addNotification,
  userRole,
}) {
  const [search, setSearch]             = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport]     = useState(false);

  /* Add Participant form */
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', programId: '' });

  /* Import flow */
  const [importStep, setImportStep]         = useState(1);
  const [importedRows, setImportedRows]     = useState([]);
  const [importProgramId, setImportProgramId] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importError, setImportError]       = useState('');
  const fileInputRef = useRef(null);

  /* ── Derived ── */
  const activeLearners = learners.filter(l => l.status === 'Active').length;
  const uniquePrograms = [...new Set(learners.map(l => l.program).filter(p => p && p !== '—'))].length;
  const filtered       = learners.filter(l =>
    `${l.name} ${l.email} ${l.program}`.toLowerCase().includes(search.toLowerCase())
  );
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  /* ── Add Participant (single) ── */
  const handleAdd = (e) => {
    e.preventDefault();
    if (learners.length >= LEARNER_LIMIT) return;
    const name         = `${addForm.firstName.trim()} ${addForm.lastName.trim()}`.trim();
    const programLabel = programs.find(p => String(p.id) === addForm.programId)?.name || '—';
    setLearners(prev => [...prev, {
      id: Date.now(), name, email: addForm.email.trim(),
      program: programLabel, status: 'Active', joined: today,
    }]);
    addNotification?.(`Participant "${name}" added to ${programLabel}`);
    setAddForm({ firstName: '', lastName: '', email: '', programId: '' });
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
    if (ext === 'csv') {
      reader.onload  = (ev) => {
        const rows = parseCSVText(ev.target.result);
        if (rows.length === 0) { setImportError('No valid rows found. Make sure your CSV has Name and Email columns.'); return; }
        setImportedRows(rows);
        setImportStep(2);
      };
      reader.onerror = () => setImportError('Failed to read CSV file. Please try again.');
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.onload  = (ev) => {
        try {
          const rows = parseWorkbook(ev.target.result);
          if (rows.length === 0) { setImportError('No valid rows found. Make sure your sheet has Name and Email columns.'); return; }
          setImportedRows(rows);
          setImportStep(2);
        } catch {
          setImportError('Failed to parse Excel file. Please check the file is not corrupted.');
        }
      };
      reader.onerror = () => setImportError('Failed to read Excel file. Please try again.');
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  /* ── Confirm import ── */
  const handleImport = () => {
    const available    = LEARNER_LIMIT - learners.length;
    const toImport     = importedRows.slice(0, available);
    const selectedProg = programs.find(p => String(p.id) === importProgramId);
    const progLabel    = selectedProg?.name || '—';

    const newLearners = toImport.map((r, i) => ({
      id: Date.now() + i, name: r.name, email: r.email,
      program: r.program || progLabel,
      status: 'Active', joined: today,
    }));

    setLearners(prev => [...prev, ...newLearners]);
    addNotification?.(`Imported ${newLearners.length} participants from "${importFileName}"`);
    closeImport();
  };

  const closeImport = () => {
    setShowImport(false);
    setImportStep(1);
    setImportedRows([]);
    setImportProgramId('');
    setImportFileName('');
    setImportError('');
  };

  /* ── Sample CSV download ── */
  const downloadSample = () => {
    const csv  = 'Name,Email,Program\nJohn Doe,john@email.com,Leadership Development Program\nSarah Ahmed,sarah@email.com,';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'oyen_participants_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const available    = LEARNER_LIMIT - learners.length;
  const overLimit    = importedRows.length > available;
  const allowedCount = Math.min(importedRows.length, available);

  /* ── Program dropdown options ── */
  const ProgramSelect = ({ value, onChange, placeholder = '— Select Program —' }) => (
    <div style={{ position: 'relative' }}>
      <select required value={value} onChange={onChange}
        style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }}>
        <option value="" style={{ backgroundColor: '#0e0f14', color: 'rgba(255,255,255,0.4)' }}>{placeholder}</option>
        {programs.map(p => (
          <option key={p.id} value={p.id} style={{ backgroundColor: '#0e0f14', color: '#fff' }}>
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
    </div>
  );

  const NoProgramsNotice = () => (
    <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <AlertTriangle size={15} color="#ef4444" />
      <span>No active programs found. Create a program first to assign participants.</span>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Participants</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Manage participants enrolled in your programs.
          </p>
        </div>
        {userRole !== 'Facilitator' && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setShowImport(true); setImportStep(1); }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            >
              <Upload size={15} /> Import Participants
            </button>
            <button
              onClick={() => { if (learners.length >= LEARNER_LIMIT) return alert(`Participant limit reached (${LEARNER_LIMIT}). Upgrade your plan to add more.`); setShowAddModal(true); }}
              style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.82rem', borderRadius: '8px', padding: '0.65rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.25)', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={15} /> Add Participant
            </button>
          </div>
        )}
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Participant Limit', value: LEARNER_LIMIT,    icon: <Users size={20} />,    color: '#D4AF37', bg: 'rgba(212,175,55,0.08)' },
          { label: 'Active Participants', value: activeLearners,   icon: <Users size={20} />,    color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'Programs',        value: uniquePrograms,   icon: <BookOpen size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>{card.icon}</div>
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

      {/* ── All Participants Table ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>All Participants</h3>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search participants..."
              style={{ ...inputStyle, paddingLeft: '2.2rem', width: '220px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr auto', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            <span>Participant</span><span>Email</span><span>Program</span><span>Status</span><span>Joined</span><span></span>
          </div>

          {filtered.length > 0 ? filtered.map(l => (
            <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr auto', gap: '0.5rem', padding: '0.95rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', alignItems: 'center', color: 'rgba(255,255,255,0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem' }}>
                  {l.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)}
                </div>
                <span style={{ fontWeight: 600, color: '#fff' }}>{l.name}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{l.email}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{l.program}</span>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: STATUS_COLORS[l.status]?.color || '#fff', backgroundColor: STATUS_COLORS[l.status]?.bg || 'transparent', padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
                  {l.status}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{l.joined}</span>
              {userRole !== 'Facilitator' && (
                <div>
                  <button onClick={() => setLearners(prev => prev.filter(x => x.id !== l.id))}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          )) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Users size={28} color="rgba(255,255,255,0.15)" />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: 0 }}>No participants found</h4>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.3rem' }}>Participants added to your programs will appear here.</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ background: 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px', padding: '0.55rem 1.25rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' }}
              >
                Add Participant
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: Add Participant (single) ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAddModal(false)}>
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Add Participant</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input required type="text" placeholder="e.g. John" value={addForm.firstName} onChange={e => setAddForm(p => ({ ...p, firstName: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input required type="text" placeholder="e.g. Doe" value={addForm.lastName} onChange={e => setAddForm(p => ({ ...p, lastName: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input required type="email" placeholder="e.g. john@email.com" value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Assign Program</label>
                {programs.length > 0 ? (
                  <ProgramSelect value={addForm.programId} onChange={e => setAddForm(p => ({ ...p, programId: e.target.value }))} />
                ) : (
                  <NoProgramsNotice />
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={programs.length === 0} style={{ flex: 2, padding: '0.75rem', background: programs.length === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: programs.length === 0 ? 'rgba(255,255,255,0.2)' : '#000', borderRadius: '8px', cursor: programs.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Add Participant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Import Participants ── */}
      {showImport && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={closeImport}>
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem', fontFamily: "'Outfit', sans-serif" }}>Import Participants</h3>
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 600 }}>Step {importStep} of 3</span>
              </div>
              <button onClick={closeImport} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            {/* ── STEP 1: Upload File ── */}
            {importStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0, lineHeight: 1.45 }}>
                  Import participants in bulk using a standard spreadsheet file. Format should include columns for <strong style={{ color: '#fff' }}>Name</strong> and <strong style={{ color: '#fff' }}>Email Address</strong>.
                </p>

                {/* Dropzone */}
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed rgba(212,175,55,0.25)', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', backgroundColor: 'rgba(255,255,255,0.01)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
                >
                  <input type="file" ref={fileInputRef} onChange={e => handleFile(e.target.files[0])} accept=".csv, .xlsx, .xls" style={{ display: 'none' }} />
                  <Upload size={28} color="#D4AF37" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>Drag & drop your file here</h4>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Supports CSV, XLSX, XLS up to 5MB</span>
                </div>

                {importError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.75rem', backgroundColor: 'rgba(239,68,68,0.06)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <AlertTriangle size={14} /> <span>{importError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={downloadSample} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Download size={14} /> Download template CSV
                  </button>
                  <button onClick={closeImport} style={{ padding: '0.55rem 1.1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Cancel</button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Review Participants ── */}
            {importStep === 2 && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem', fontFamily: "'Outfit', sans-serif" }}>Review Participants</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                  We found <strong style={{ color: '#fff' }}>{importedRows.length}</strong> record{importedRows.length !== 1 ? 's' : ''} in <span style={{ color: '#D4AF37' }}>{importFileName}</span>.
                </p>

                {overLimit && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(184,115,9,0.06)', border: '1px solid rgba(184,115,9,0.2)', borderRadius: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <AlertTriangle size={16} color="#D4AF37" style={{ flexShrink: 0 }} />
                    <span>Your current plan allows importing only {available} more participant{available !== 1 ? 's' : ''}. Extra rows will be ignored.</span>
                  </div>
                )}

                <div style={{ backgroundColor: '#090a0f', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '200px', overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', padding: '0.55rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                    <span>Name</span><span>Email</span><span>Program Info</span>
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
                  Participants without a program in the file will be assigned to the one you select below.
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Select Program</label>
                  {programs.length > 0 ? (
                    <ProgramSelect value={importProgramId} onChange={e => setImportProgramId(e.target.value)} placeholder="— Assign to Program —" />
                  ) : (
                    <NoProgramsNotice />
                  )}
                </div>

                {programs.length > 0 && (
                  <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    <CheckCircle size={16} color="#22c55e" />
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                      <strong style={{ color: '#fff' }}>{allowedCount}</strong> participant{allowedCount !== 1 ? 's' : ''} ready to import
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setImportStep(2)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>← Back</button>
                  <button
                    onClick={handleImport}
                    disabled={programs.length === 0}
                    style={{ flex: 2, padding: '0.75rem', background: programs.length === 0 ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#D4AF37,#C49A2A)', border: 'none', color: programs.length === 0 ? 'rgba(255,255,255,0.3)' : '#000', borderRadius: '8px', cursor: programs.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Upload size={14} /> Import Participants
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
