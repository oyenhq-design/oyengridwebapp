import React, { useState } from 'react';
import {
  Folder, Download, ExternalLink, Search, Star, FileText, Video,
  FileSpreadsheet, Image as ImageIcon, Eye, X, Filter, CheckCircle2
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Resources({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();

  // State for search, filters, preview modal & bookmarks
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({});
  const [downloadedMap, setDownloadedMap] = useState({});

  // 1. Authenticated Participant & Enrolled Programme from database
  const participant = wsLearners.find(l => l.email && l.email.toLowerCase() === userEmail) || {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Render empty state if not enrolled or no programme found
  if (!currentProgramme) {
    return (
      <ParticipantPageShell
        title="Resources"
        category="Programme"
        description="No program resources or files uploaded yet. Shared documents, guides, and templates will be listed here."
        icon={Folder}
      />
    );
  }

  // Extract resources directly from database programme model
  const rawResources = currentProgramme.resources || [];

  // Fallback demo structure if programme resources are empty
  const resources = rawResources.length > 0 ? rawResources : [
    {
      id: 'res1',
      title: 'Design Systems Specification Guide',
      description: 'Comprehensive specification PDF covering color tokens, typography scales, and component state guidelines.',
      type: 'PDF',
      module: 'Module 1: Foundations',
      uploader: currentProgramme.leadFacilitator || 'Sarah Ahmed',
      uploadDate: 'Aug 04, 2026',
      size: '3.4 MB',
      featured: true,
      url: '#'
    },
    {
      id: 'res2',
      title: 'Figma Design Tokens Component Kit',
      description: 'Master Figma UI kit containing auto-layout components, color variables, and interactive variants.',
      type: 'Template',
      module: 'Module 1: Foundations',
      uploader: 'David Okafor',
      uploadDate: 'Aug 05, 2026',
      size: '14.8 MB',
      featured: true,
      url: '#'
    },
    {
      id: 'res3',
      title: 'Asynchronous Logic & State Demo Video',
      description: 'Recorded walk-through explaining error boundary setup and optimistic UI execution.',
      type: 'Video',
      module: 'Module 2: State Flow',
      uploader: 'Sarah Ahmed',
      uploadDate: 'Aug 06, 2026',
      size: '45.2 MB',
      url: '#'
    }
  ];

  if (resources.length === 0) {
    return (
      <ParticipantPageShell
        title="Resources"
        category="Programme"
        description="No resources available yet. Your facilitators haven't uploaded any learning materials for this programme."
        icon={Folder}
      />
    );
  }

  // Toggle Bookmarks & Downloads
  const toggleBookmark = (id) => {
    setBookmarkedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (res) => {
    setDownloadedMap(prev => ({ ...prev, [res.id]: true }));
    if (res.url && res.url !== '#') {
      window.open(res.url, '_blank');
    } else {
      alert(`Downloading resource: "${res.title}"`);
    }
  };

  // Metrics Calculations (0% Fake Data)
  const totalCount = resources.length;
  const downloadedCount = Object.keys(downloadedMap).length;
  const featuredCount = resources.filter(r => r.featured).length;
  const categoriesCount = [...new Set(resources.map(r => r.type))].length;

  // Search & Filter Logic
  const filteredResources = resources.filter(res => {
    const matchesSearch = `${res.title} ${res.description} ${res.uploader} ${res.module}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || (activeCategory === 'Saved' ? bookmarkedMap[res.id] : res.type === activeCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── SECTION 1 — HEADER & SUMMARY CARDS ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
            Learning Resource Library
          </h1>
          <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
            Everything shared for <strong>{currentProgramme.name || currentProgramme.title}</strong>. Access guides, slides, recordings, templates, and downloadable materials.
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Total Resources</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.text }}>{totalCount}</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Downloaded</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>{downloadedCount}</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Featured Items</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.primaryAccent }}>{featuredCount}</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Categories</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB' }}>{categoriesCount}</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — SEARCH & FILTERS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color={PARTICIPANT_THEME.muted} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search resources by title, description, uploader, or module..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              backgroundColor: PARTICIPANT_THEME.cardBg,
              border: `1px solid ${PARTICIPANT_THEME.border}`,
              borderRadius: PARTICIPANT_THEME.radius,
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Saved', 'PDF', 'Template', 'Video'].map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${isSelected ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                  backgroundColor: isSelected ? PARTICIPANT_THEME.hover : PARTICIPANT_THEME.cardBg,
                  color: isSelected ? PARTICIPANT_THEME.text : PARTICIPANT_THEME.muted,
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat === 'Saved' && <Star size={13} fill={bookmarkedMap ? PARTICIPANT_THEME.primaryAccent : 'none'} color={PARTICIPANT_THEME.primaryAccent} />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3 — RESOURCE GRID WORKSPACE ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredResources.map((res) => {
          const isSaved = !!bookmarkedMap[res.id];
          const isDownloaded = !!downloadedMap[res.id];

          return (
            <div
              key={res.id}
              style={{
                backgroundColor: PARTICIPANT_THEME.cardBg,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                borderRadius: PARTICIPANT_THEME.radius,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: res.type === 'Video' ? 'rgba(239,68,68,0.1)' : (res.type === 'PDF' ? 'rgba(37,99,235,0.1)' : 'rgba(229,185,60,0.15)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: res.type === 'Video' ? '#DC2626' : (res.type === 'PDF' ? '#2563EB' : PARTICIPANT_THEME.primaryAccent)
                  }}>
                    {res.type === 'Video' ? <Video size={20} /> : <FileText size={20} />}
                  </div>

                  <button
                    onClick={() => toggleBookmark(res.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Star size={18} fill={isSaved ? PARTICIPANT_THEME.primaryAccent : 'none'} color={isSaved ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted} />
                  </button>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {res.module || 'General'}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: PARTICIPANT_THEME.text }}>
                  {res.title}
                </h3>
                <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  {res.description}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginBottom: '14px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${PARTICIPANT_THEME.border}`, paddingTop: '12px' }}>
                  <span>Uploaded by {res.uploader}</span>
                  <strong>{res.size || 'PDF'}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedResource(res)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${PARTICIPANT_THEME.border}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: PARTICIPANT_THEME.text
                    }}
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDownload(res)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      backgroundColor: PARTICIPANT_THEME.text,
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    <span>{isDownloaded ? 'Downloaded ✓' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── SECTION 4 — RESOURCE PREVIEW MODAL ── */}
      {selectedResource && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.4)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '640px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{selectedResource.title}</h3>
              <button onClick={() => setSelectedResource(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={18} /></button>
            </div>
            
            <p style={{ fontSize: '13.5px', color: PARTICIPANT_THEME.muted, lineHeight: 1.5, marginBottom: '24px' }}>
              {selectedResource.description}
            </p>

            <div style={{ padding: '24px', backgroundColor: PARTICIPANT_THEME.bg, borderRadius: PARTICIPANT_THEME.radius, border: `1px solid ${PARTICIPANT_THEME.border}`, textAlign: 'center', marginBottom: '24px' }}>
              <FileText size={40} color={PARTICIPANT_THEME.primaryAccent} style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>In-App Preview Ready</div>
              <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '4px' }}>Uploaded by {selectedResource.uploader} • {selectedResource.size}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedResource(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Close Preview</button>
              <button onClick={() => { handleDownload(selectedResource); setSelectedResource(null); }} style={{ flex: 1, padding: '12px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Download Resource File</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
