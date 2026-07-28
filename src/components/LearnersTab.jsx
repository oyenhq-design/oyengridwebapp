import React, { useState, useRef, useEffect } from 'react';
import {
  Users, BookOpen, Upload, Plus, Search, X, ChevronDown, Download,
  AlertTriangle, CheckCircle, ArrowRight, Trash2, MoreVertical,
  Mail, Phone, Calendar, Clock, Award, Activity, Shield, BarChart2,
  ChevronLeft, UserCheck, ArrowUp
} from 'lucide-react';
import * as XLSX from 'xlsx';

const LEARNER_LIMIT = 50;

const STATUS_COLORS = {
  Active:   { color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  Pending:  { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  Inactive: { color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' },
};

/* ── Parse CSV ── */
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

/* ── Parse XLSX ── */
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

/* ── Avatar initials ── */
function getInitials(name = '') {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '??';
}

/* ── Avatar hue from name ── */
function getAvatarColor(name = '') {
  const hues = [215, 168, 142, 280, 32, 195, 330, 260];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return hues[Math.abs(hash) % hues.length];
}

/* ── Toast Notification ── */
function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.6rem', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          backgroundColor: '#fff', border: '1px solid #E8E2D8', borderRadius: '10px',
          padding: '0.75rem 1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '280px',
          animation: 'slideInRight 0.3s ease',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.type === 'error' ? '#ef4444' : '#16a34a', flexShrink: 0 }} />
          <span style={{ fontSize: '0.82rem', color: '#151515', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

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
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy]             = useState('Name');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport]     = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [openMenuId, setOpenMenuId]     = useState(null);
  const [toasts, setToasts]             = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  /* Add Participant form */
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', programId: '' });

  /* Import flow */
  const [importStep, setImportStep]           = useState(1);
  const [importedRows, setImportedRows]       = useState([]);
  const [importProgramId, setImportProgramId] = useState('');
  const [importFileName, setImportFileName]   = useState('');
  const [importError, setImportError]         = useState('');
  const fileInputRef = useRef(null);

  /* Simulate initial load */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  /* Close menus on outside click */
  useEffect(() => {
    const handler = () => { setOpenMenuId(null); setShowSortMenu(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* ── Toast helper ── */
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  /* ── Derived ── */
  const activeLearners = learners.filter(l => l.status === 'Active').length;
  const uniquePrograms = [...new Set(learners.map(l => l.program).filter(p => p && p !== '—'))].length;
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  /* ── Filter + Sort ── */
  let filtered = learners.filter(l => {
    const matchesSearch = `${l.name} ${l.email} ${l.program}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All'
      || (filterStatus === 'Active' && l.status === 'Active')
      || (filterStatus === 'Inactive' && l.status === 'Inactive')
      || (filterStatus === 'Pending Invite' && l.status === 'Pending');
    return matchesSearch && matchesStatus;
  });

  if (sortBy === 'Name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'Recently Added') filtered = [...filtered].sort((a, b) => b.id - a.id);
  else if (sortBy === 'Program') filtered = [...filtered].sort((a, b) => (a.program || '').localeCompare(b.program || ''));

  /* ── Add Participant ── */
  const handleAdd = (e) => {
    e.preventDefault();
    if (learners.length >= LEARNER_LIMIT) return;
    const name         = `${addForm.firstName.trim()} ${addForm.lastName.trim()}`.trim();
    const programLabel = programs.find(p => String(p.id) === addForm.programId)?.name || '—';
    const newLearner = { id: Date.now(), name, email: addForm.email.trim(), program: programLabel, status: 'Active', joined: today };
    setLearners(prev => [...prev, newLearner]);
    showToast(`${name} added successfully`);
    addNotification?.(`Participant "${name}" added to ${programLabel}`);
    setAddForm({ firstName: '', lastName: '', email: '', programId: '' });
    setShowAddModal(false);
  };

  /* ── Remove participant ── */
  const handleRemove = (id, name) => {
    setLearners(prev => prev.filter(x => x.id !== id));
    if (selectedParticipant?.id === id) { setSelectedParticipant(null); setDrawerOpen(false); }
    showToast(`${name} removed`);
    setOpenMenuId(null);
  };

  /* ── Open profile drawer ── */
  const openProfile = (learner) => {
    setSelectedParticipant(learner);
    setDrawerOpen(true);
    setOpenMenuId(null);
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
    const newLearners  = toImport.map((r, i) => ({
      id: Date.now() + i, name: r.name, email: r.email,
      program: r.program || progLabel,
      status: 'Active', joined: today,
    }));
    setLearners(prev => [...prev, ...newLearners]);
    showToast(`${newLearners.length} participants imported`);
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

  /* ── Light theme shared styles ── */
  const inputLight = {
    width: '100%', padding: '0.7rem 0.9rem', fontSize: '0.85rem',
    backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8',
    borderRadius: '8px', color: '#151515', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelLight = {
    display: 'block', fontSize: '0.72rem', fontWeight: 600,
    color: '#6B7280', marginBottom: '0.4rem',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  /* ── Program dropdown ── */
  const ProgramSelect = ({ value, onChange, placeholder = '— Select Program —' }) => (
    <div style={{ position: 'relative' }}>
      <select required value={value} onChange={onChange}
        style={{ ...inputLight, appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }}>
        <option value="" style={{ color: '#9CA3AF' }}>{placeholder}</option>
        {programs.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
    </div>
  );

  const NoProgramsNotice = () => (
    <div style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '0.78rem', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <AlertTriangle size={15} color="#EF4444" />
      <span>No active programs found. Create a program first to assign participants.</span>
    </div>
  );

  /* ─────────────────────────────────────────────────
     SKELETON LOADING
  ───────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <style>{`
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .skel { background: linear-gradient(90deg, #F0EDE8 25%, #E8E4DD 50%, #F0EDE8 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div className="skel" style={{ width: 180, height: 28, marginBottom: 8 }} /><div className="skel" style={{ width: 280, height: 16 }} /></div>
          <div style={{ display: 'flex', gap: 10 }}><div className="skel" style={{ width: 160, height: 36 }} /><div className="skel" style={{ width: 140, height: 36 }} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[0,1,2,3].map(i => <div key={i} className="skel" style={{ height: 88 }} />)}
        </div>
        <div className="skel" style={{ height: 48 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="skel" style={{ height: 40 }} />
          {[0,1,2,3,4].map(i => <div key={i} className="skel" style={{ height: 64 }} />)}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────
     MAIN RENDER
  ───────────────────────────────────────────────── */
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft  { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeInUp     { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .p-row { transition: background 0.15s, box-shadow 0.15s; cursor: pointer; }
        .p-row:hover { background: #FDFAF5 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .filter-pill { transition: all 0.15s; cursor: pointer; }
        .action-btn { transition: all 0.15s; cursor: pointer; }
        .action-btn:hover { background: #F5F2ED !important; }
        .drawer-overlay { animation: fadeInUp 0.2s ease; }
        .drawer-panel { animation: slideInRight 0.25s ease; }
      `}</style>

      {/* ── Toast Stack ── */}
      <Toast toasts={toasts} />

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px' }}>
            Participants
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '0.3rem', margin: '0.3rem 0 0' }}>
            Manage learners enrolled across your training programs.
          </p>
        </div>
        {userRole !== 'Facilitator' && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => { setShowImport(true); setImportStep(1); }}
              style={{ background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#374151', fontWeight: 600, fontSize: '0.82rem', borderRadius: '10px', padding: '0.65rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4A017'; e.currentTarget.style.color = '#D4A017'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E2D8'; e.currentTarget.style.color = '#374151'; }}
            >
              <Upload size={14} /> Import Participants
            </button>
            <button
              onClick={() => { if (learners.length >= LEARNER_LIMIT) return alert(`Participant limit reached (${LEARNER_LIMIT}). Upgrade your plan to add more.`); setShowAddModal(true); }}
              style={{ background: 'linear-gradient(135deg,#D4A017,#C49A2A)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.82rem', borderRadius: '10px', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(212,160,23,0.3)', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={15} /> Add Participant
            </button>
          </div>
        )}
      </div>

      {/* ── STATISTICS CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Participant Limit', value: LEARNER_LIMIT, icon: <Shield size={18} />, color: '#D4A017', bg: '#FFFBEB' },
          { label: 'Active Participants', value: activeLearners, icon: <UserCheck size={18} />, color: '#16a34a', bg: '#F0FDF4' },
          { label: 'Programs', value: uniquePrograms, icon: <BookOpen size={18} />, color: '#2563EB', bg: '#EFF6FF' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '14px', padding: '1.25rem 1.35rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>{card.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#151515', marginTop: '0.1rem', fontFamily: "'Outfit', sans-serif" }}>{card.value}</div>
            </div>
          </div>
        ))}
        {/* Storage / Capacity bar card */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '14px', padding: '1.25rem 1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.65rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>Capacity Used</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#151515' }}>{learners.length} / {LEARNER_LIMIT}</span>
          </div>
          <div style={{ height: '7px', backgroundColor: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((learners.length / LEARNER_LIMIT) * 100, 100)}%`, background: 'linear-gradient(90deg,#D4A017,#C49A2A)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{LEARNER_LIMIT - learners.length} slots remaining</div>
        </div>
      </div>

      {/* ── SEARCH + FILTER TOOLBAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search participants..."
            style={{ paddingLeft: '2.35rem', paddingRight: '0.9rem', paddingTop: '0.65rem', paddingBottom: '0.65rem', fontSize: '0.84rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '10px', color: '#151515', outline: 'none', width: '240px', boxSizing: 'border-box', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Status filter pills */}
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#F5F2ED', borderRadius: '10px', padding: '0.25rem' }}>
            {['All', 'Active', 'Inactive', 'Pending Invite'].map(f => (
              <button
                key={f}
                className="filter-pill"
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  backgroundColor: filterStatus === f ? '#FFFFFF' : 'transparent',
                  color: filterStatus === f ? '#151515' : '#6B7280',
                  boxShadow: filterStatus === f ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >{f}</button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setShowSortMenu(v => !v); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '10px', fontSize: '0.8rem', color: '#374151', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              Sort: {sortBy} <ChevronDown size={13} />
            </button>
            {showSortMenu && (
              <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, minWidth: '160px', overflow: 'hidden' }}>
                {['Name', 'Recently Added', 'Program'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                    style={{ display: 'block', width: '100%', padding: '0.65rem 1rem', fontSize: '0.82rem', textAlign: 'left', backgroundColor: sortBy === opt ? '#FFFBEB' : 'transparent', color: sortBy === opt ? '#D4A017' : '#374151', fontWeight: sortBy === opt ? 700 : 500, border: 'none', cursor: 'pointer' }}
                  >{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PARTICIPANTS TABLE ── */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 2fr 1.8fr 1fr 1fr 44px', gap: '0.5rem', padding: '0.85rem 1.5rem', borderBottom: '1px solid #F3F0EA', backgroundColor: '#FDFAF5' }}>
          {['Participant', 'Email', 'Program', 'Status', 'Joined', ''].map((h, i) => (
            <span key={i} style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length > 0 ? filtered.map((l, idx) => {
          const hue = getAvatarColor(l.name);
          const sc  = STATUS_COLORS[l.status] || STATUS_COLORS['Inactive'];
          return (
            <div
              key={l.id}
              className="p-row"
              onClick={() => openProfile(l)}
              style={{ display: 'grid', gridTemplateColumns: '2.2fr 2fr 1.8fr 1fr 1fr 44px', gap: '0.5rem', padding: '1.1rem 1.5rem', borderBottom: idx < filtered.length - 1 ? '1px solid #F5F3EF' : 'none', alignItems: 'center', backgroundColor: '#FFFFFF' }}
            >
              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: `hsl(${hue}, 65%, 92%)`, border: `1.5px solid hsl(${hue}, 50%, 80%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue}, 50%, 35%)`, fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                  {getInitials(l.name)}
                </div>
                <span style={{ fontWeight: 600, color: '#151515', fontSize: '0.875rem' }}>{l.name}</span>
              </div>

              {/* Email */}
              <span style={{ color: '#6B7280', fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.email}</span>

              {/* Program badge */}
              <div>
                {l.program && l.program !== '—' ? (
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #DBEAFE' }}>{l.program}</span>
                ) : (
                  <span style={{ color: '#D1D5DB', fontSize: '0.82rem' }}>—</span>
                )}
              </div>

              {/* Status badge */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: sc.color, backgroundColor: sc.bg, padding: '0.25rem 0.65rem', borderRadius: '6px', border: `1px solid ${sc.border}` }}>
                  {l.status}
                </span>
              </div>

              {/* Joined */}
              <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>{l.joined}</span>

              {/* Actions menu */}
              {userRole !== 'Facilitator' && (
                <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                  <button
                    className="action-btn"
                    onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === l.id ? null : l.id); }}
                    style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'transparent', border: '1px solid transparent', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <MoreVertical size={15} />
                  </button>
                  {openMenuId === l.id && (
                    <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 300, minWidth: '170px', overflow: 'hidden' }}>
                      <button onClick={() => openProfile(l)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#374151', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}><UserCheck size={13} /> View Profile</button>
                      <button onClick={() => { showToast('Invitation sent'); setOpenMenuId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#374151', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}><Mail size={13} /> Send Message</button>
                      <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '0.25rem 0' }} />
                      <button onClick={() => handleRemove(l.id, l.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#EF4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}><Trash2 size={13} /> Remove</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }) : (
          /* ── Empty State ── */
          <div style={{ padding: '5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#F5F2ED', border: '1px solid #E8E2D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={30} color="#D4A017" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#151515', margin: '0 0 0.4rem', fontFamily: "'Outfit', sans-serif" }}>
                {search || filterStatus !== 'All' ? 'No participants match your filters' : 'No Participants Yet'}
              </h4>
              <p style={{ color: '#6B7280', fontSize: '0.84rem', margin: 0, maxWidth: '360px' }}>
                {search || filterStatus !== 'All'
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : 'Invite learners to begin tracking attendance, assessments, progress, and certificates.'}
              </p>
            </div>
            {!(search || filterStatus !== 'All') && userRole !== 'Facilitator' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{ background: 'linear-gradient(135deg,#D4A017,#C49A2A)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.84rem', borderRadius: '10px', padding: '0.65rem 1.5rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(212,160,23,0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={15} /> Add Participant
                </button>
                <button onClick={() => {}} style={{ background: 'none', border: 'none', color: '#D4A017', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Learn how participant management works <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────
          PARTICIPANT PROFILE DRAWER
      ───────────────────────────────────────────────────── */}
      {drawerOpen && selectedParticipant && (() => {
        const p = selectedParticipant;
        const hue = getAvatarColor(p.name);
        const sc  = STATUS_COLORS[p.status] || STATUS_COLORS['Inactive'];
        return (
          <>
            {/* Overlay */}
            <div
              className="drawer-overlay"
              onClick={() => { setDrawerOpen(false); setSelectedParticipant(null); }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.35)', backdropFilter: 'blur(4px)', zIndex: 1200 }}
            />
            {/* Drawer panel */}
            <div className="drawer-panel" style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '100%', maxWidth: '420px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #E8E2D8', zIndex: 1300, overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(0,0,0,0.12)' }}>
              {/* Drawer Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F3F0EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FDFAF5', flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Profile</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#151515', fontFamily: "'Outfit', sans-serif", marginTop: '0.1rem' }}>{p.name}</div>
                </div>
                <button
                  onClick={() => { setDrawerOpen(false); setSelectedParticipant(null); }}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F5F2ED', border: '1px solid #E8E2D8', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Profile Card */}
              <div style={{ padding: '1.5rem' }}>
                {/* Avatar + Core Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `hsl(${hue}, 65%, 92%)`, border: `2px solid hsl(${hue}, 50%, 80%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue}, 50%, 35%)`, fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#151515' }}>{p.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.15rem' }}>{p.email}</div>
                    <span style={{ marginTop: '0.4rem', display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, color: sc.color, backgroundColor: sc.bg, padding: '0.2rem 0.6rem', borderRadius: '5px', border: `1px solid ${sc.border}` }}>{p.status}</span>
                  </div>
                </div>

                {/* Info rows */}
                {[
                  { icon: <BookOpen size={14} />, label: 'Program', value: p.program || '—' },
                  { icon: <Calendar size={14} />, label: 'Date Joined', value: p.joined },
                  { icon: <Clock size={14} />, label: 'Last Active', value: 'Just now' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #F5F3EF' }}>
                    <div style={{ color: '#9CA3AF', marginTop: '0.05rem', flexShrink: 0 }}>{row.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.15rem' }}>{row.label}</div>
                      <div style={{ fontSize: '0.84rem', color: '#151515', fontWeight: 500 }}>{row.value}</div>
                    </div>
                  </div>
                ))}

                {/* Learning Progress */}
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem' }}>Learning Progress</div>
                  {[
                    { label: 'Completion', value: '—', icon: <BarChart2 size={14} />, color: '#2563EB', bg: '#EFF6FF' },
                    { label: 'Attendance', value: '—', icon: <CheckCircle size={14} />, color: '#16a34a', bg: '#F0FDF4' },
                    { label: 'Certificates', value: '—', icon: <Award size={14} />, color: '#D4A017', bg: '#FFFBEB' },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem', backgroundColor: m.bg, borderRadius: '9px', marginBottom: '0.5rem', border: `1px solid ${m.bg}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: m.color }}>
                        {m.icon}
                        <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{m.label}</span>
                      </div>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem' }}>Recent Activity</div>
                  {[
                    { label: 'Last Session Attended', value: '—' },
                    { label: 'Last Assessment', value: '—' },
                    { label: 'Recent Login', value: p.joined },
                  ].map(a => (
                    <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #F5F3EF' }}>
                      <span style={{ fontSize: '0.81rem', color: '#6B7280' }}>{a.label}</span>
                      <span style={{ fontSize: '0.81rem', fontWeight: 600, color: '#374151' }}>{a.value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {userRole !== 'Facilitator' && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => { showToast('Message sent'); }} style={{ width: '100%', padding: '0.7rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '9px', fontSize: '0.83rem', color: '#374151', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                      <Mail size={14} /> Send Message
                    </button>
                    <button onClick={() => { showToast('Invitation resent'); }} style={{ width: '100%', padding: '0.7rem', backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '9px', fontSize: '0.83rem', color: '#374151', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                      <ArrowUp size={14} /> Resend Invitation
                    </button>
                    <button onClick={() => handleRemove(p.id, p.name)} style={{ width: '100%', padding: '0.7rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '9px', fontSize: '0.83rem', color: '#DC2626', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                      <Trash2 size={14} /> Remove Participant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      })()}

      {/* ── MODAL: Add Participant ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAddModal(false)}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Add Participant</h3>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0.25rem 0 0' }}>Enroll a new learner into a program.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#F5F2ED', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelLight}>First Name</label>
                  <input required type="text" placeholder="e.g. John" value={addForm.firstName} onChange={e => setAddForm(p => ({ ...p, firstName: e.target.value }))} style={inputLight} />
                </div>
                <div>
                  <label style={labelLight}>Last Name</label>
                  <input required type="text" placeholder="e.g. Doe" value={addForm.lastName} onChange={e => setAddForm(p => ({ ...p, lastName: e.target.value }))} style={inputLight} />
                </div>
              </div>
              <div>
                <label style={labelLight}>Email Address</label>
                <input required type="email" placeholder="e.g. john@email.com" value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} style={inputLight} />
              </div>
              <div>
                <label style={labelLight}>Assign Program</label>
                {programs.length > 0 ? (
                  <ProgramSelect value={addForm.programId} onChange={e => setAddForm(p => ({ ...p, programId: e.target.value }))} />
                ) : (
                  <NoProgramsNotice />
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" disabled={programs.length === 0} style={{ flex: 2, padding: '0.75rem', background: programs.length === 0 ? '#F3F4F6' : 'linear-gradient(135deg,#D4A017,#C49A2A)', border: 'none', color: programs.length === 0 ? '#9CA3AF' : '#fff', borderRadius: '10px', cursor: programs.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Add Participant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Import Participants ── */}
      {showImport && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={closeImport}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', textAlign: 'left' }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#151515', margin: '0 0 0.2rem', fontFamily: "'Outfit', sans-serif" }}>Import Participants</h3>
                <span style={{ fontSize: '0.72rem', color: '#D4A017', fontWeight: 700 }}>Step {importStep} of 3</span>
              </div>
              <button onClick={closeImport} style={{ background: '#F5F2ED', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            </div>

            {/* Step 1 */}
            {importStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  Import participants in bulk using a spreadsheet. Include columns for <strong style={{ color: '#151515' }}>Name</strong> and <strong style={{ color: '#151515' }}>Email Address</strong>.
                </p>
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #E8E2D8', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', backgroundColor: '#FDFAF5' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#D4A017'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E8E2D8'}
                >
                  <input type="file" ref={fileInputRef} onChange={e => handleFile(e.target.files[0])} accept=".csv, .xlsx, .xls" style={{ display: 'none' }} />
                  <Upload size={28} color="#D4A017" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#151515', margin: '0 0 0.25rem' }}>Drag & drop your file here</h4>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Supports CSV, XLSX, XLS up to 5MB</span>
                </div>
                {importError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontSize: '0.78rem', backgroundColor: '#FEF2F2', padding: '0.65rem 0.9rem', borderRadius: '9px', border: '1px solid #FECACA' }}>
                    <AlertTriangle size={14} /> <span>{importError}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F0EA', paddingTop: '1rem' }}>
                  <button onClick={downloadSample} style={{ background: 'none', border: 'none', color: '#D4A017', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Download size={14} /> Download template CSV
                  </button>
                  <button onClick={closeImport} style={{ padding: '0.55rem 1.1rem', background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '9px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {importStep === 2 && (
              <>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                  Found <strong style={{ color: '#151515' }}>{importedRows.length}</strong> record{importedRows.length !== 1 ? 's' : ''} in <span style={{ color: '#D4A017', fontWeight: 600 }}>{importFileName}</span>.
                </p>
                {overLimit && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', fontSize: '0.78rem', color: '#92400e', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <AlertTriangle size={16} color="#D4A017" style={{ flexShrink: 0, marginTop: '0.05rem' }} />
                    <span>Your plan allows only {available} more participant{available !== 1 ? 's' : ''}. Extra rows will be skipped.</span>
                  </div>
                )}
                <div style={{ backgroundColor: '#FDFAF5', borderRadius: '10px', border: '1px solid #E8E2D8', maxHeight: '200px', overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', padding: '0.55rem 1rem', borderBottom: '1px solid #F3F0EA', fontSize: '0.67rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    <span>Name</span><span>Email</span><span>Program</span>
                  </div>
                  {importedRows.slice(0, allowedCount).map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', padding: '0.6rem 1rem', borderBottom: '1px solid #F5F3EF', fontSize: '0.8rem', alignItems: 'center' }}>
                      <span style={{ color: '#151515', fontWeight: 500 }}>{r.name || '—'}</span>
                      <span style={{ color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email || '—'}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '0.74rem' }}>{r.program || '—'}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button onClick={() => setImportStep(1)} style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.84rem' }}>← Back</button>
                  <button onClick={() => setImportStep(3)} style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#D4A017,#C49A2A)', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {importStep === 3 && (
              <>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                  Participants without a program in the file will be assigned to the one you select below.
                </p>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelLight}>Select Program</label>
                  {programs.length > 0 ? (
                    <ProgramSelect value={importProgramId} onChange={e => setImportProgramId(e.target.value)} placeholder="— Assign to Program —" />
                  ) : (
                    <NoProgramsNotice />
                  )}
                </div>
                {programs.length > 0 && (
                  <div style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span style={{ fontSize: '0.83rem', color: '#374151' }}>
                      <strong>{allowedCount}</strong> participant{allowedCount !== 1 ? 's' : ''} ready to import
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setImportStep(2)} style={{ flex: 1, padding: '0.75rem', background: '#FFFFFF', border: '1px solid #E8E2D8', color: '#6B7280', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.84rem' }}>← Back</button>
                  <button
                    onClick={handleImport}
                    disabled={programs.length === 0}
                    style={{ flex: 2, padding: '0.75rem', background: programs.length === 0 ? '#F3F4F6' : 'linear-gradient(135deg,#D4A017,#C49A2A)', border: 'none', color: programs.length === 0 ? '#9CA3AF' : '#fff', borderRadius: '10px', cursor: programs.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.84rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
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
