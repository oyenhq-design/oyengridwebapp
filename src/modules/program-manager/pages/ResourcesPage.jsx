import React, { useState, useMemo } from 'react';
import { 
  Plus, FileText, FolderPlus, Search, ChevronDown, Sparkles, X, 
  CheckCircle2, Folder, Download, Eye, Calendar, User, Trash2, 
  BarChart3, MessageSquare, AlertCircle, Share2, FileVideo, FileImage, 
  FileCheck, Globe, Lock, Edit3
} from 'lucide-react';

export default function ResourcesPage({ wsPrograms = [], setWsPrograms }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detail'
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [sortKey, setSortKey] = useState('Newest');

  // Modals & Drawers
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Form States for Upload
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    programId: '',
    folderName: '',
    type: 'PDF',
    visibility: 'Published',
    sessionId: '',
    notifyParticipants: false
  });

  // Folders State (Mocked database folders mapping, editable/extendable)
  const [folders, setFolders] = useState([
    { id: 'f1', name: 'Week 1', resourceCount: 3, lastUpdated: 'Today' },
    { id: 'f2', name: 'Week 2', resourceCount: 2, lastUpdated: 'Yesterday' },
    { id: 'f3', name: 'Assignments', resourceCount: 1, lastUpdated: '2 days ago' },
    { id: 'f4', name: 'Recordings', resourceCount: 0, lastUpdated: 'Never' }
  ]);

  const [newFolderName, setNewFolderName] = useState('');

  // Extract all resources directly from wsPrograms
  const allResources = useMemo(() => {
    const list = [];
    wsPrograms.forEach(p => {
      // Direct resources attached to program
      const progResources = p.resources || [];
      progResources.forEach((r, idx) => {
        list.push({
          id: r.id || `res_prog_${p.id}_${idx}`,
          title: r.name || r.title,
          description: r.description || 'Core program learning material.',
          programId: p.id,
          programName: p.name || p.title,
          type: r.type || 'PDF',
          visibility: r.visibility || 'Published',
          lastUpdated: r.lastUpdated || 'Today',
          views: r.views || 0,
          downloads: r.downloads || 0,
          uploader: r.uploader || 'Program Manager',
          sessionId: r.sessionId || '',
          folderName: r.folderName || 'Week 1',
          comments: r.comments || [],
          versionHistory: r.versionHistory || [{ version: '1.0', date: 'Yesterday', editor: 'Program Manager' }]
        });
      });

      // Resources attached to program's sessions
      const sessions = p.sessions || [];
      sessions.forEach(s => {
        const sessRes = s.resources || [];
        sessRes.forEach((r, idx) => {
          // Prevent duplicates if already added
          const exists = list.some(item => item.title === r.name);
          if (!exists) {
            list.push({
              id: r.id || `res_sess_${s.id}_${idx}`,
              title: r.name,
              description: `Session material for ${s.title}`,
              programId: p.id,
              programName: p.name || p.title,
              type: r.type || 'PDF',
              visibility: r.visibility || 'Published',
              lastUpdated: s.date || 'Today',
              views: r.views || 0,
              downloads: r.downloads || 0,
              uploader: r.uploader || 'Program Manager',
              sessionId: s.id,
              folderName: r.folderName || 'Week 2',
              comments: r.comments || [],
              versionHistory: r.versionHistory || [{ version: '1.0', date: '2 days ago', editor: 'Program Manager' }]
            });
          }
        });
      });
    });

    // Populate fallback default high-fidelity data if none are found in the empty database
    if (list.length === 0) {
      list.push(
        {
          id: 'def_res_1',
          title: 'Week 4 Systems Slides',
          description: 'Lecture slides covering advanced battery storage systems.',
          programId: wsPrograms[0]?.id || '1',
          programName: wsPrograms[0]?.name || 'Battery Storage Bootcamp',
          type: 'Presentation',
          visibility: 'Published',
          lastUpdated: 'Today',
          views: 24,
          downloads: 18,
          uploader: 'Program Manager',
          folderName: 'Week 1',
          comments: [],
          versionHistory: [{ version: '1.0', date: 'Yesterday', editor: 'Program Manager' }]
        },
        {
          id: 'def_res_2',
          title: 'Solar Inverter Configuration Guide',
          description: 'Step-by-step PDF guide for solar inverter setups.',
          programId: wsPrograms[0]?.id || '1',
          programName: wsPrograms[0]?.name || 'Solar Tech Fellowship',
          type: 'PDF',
          visibility: 'Draft',
          lastUpdated: 'Yesterday',
          views: 0,
          downloads: 0,
          uploader: 'Program Manager',
          folderName: 'Week 2',
          comments: [],
          versionHistory: [{ version: '1.0', date: '2 days ago', editor: 'Program Manager' }]
        },
        {
          id: 'def_res_3',
          title: 'Smart Grid Capstone Briefing',
          description: 'Guidelines and criteria for the smart grid capstone project.',
          programId: wsPrograms[0]?.id || '1',
          programName: wsPrograms[0]?.name || 'Smart Grid Fellowship',
          type: 'Document',
          visibility: 'Private',
          lastUpdated: '3 days ago',
          views: 12,
          downloads: 6,
          uploader: 'Program Manager',
          folderName: 'Assignments',
          comments: [],
          versionHistory: [{ version: '1.0', date: '3 days ago', editor: 'Program Manager' }]
        }
      );
    }
    return list;
  }, [wsPrograms]);

  // Stats Counters computed dynamically
  const stats = useMemo(() => {
    return {
      published: allResources.filter(r => r.visibility === 'Published').length,
      draft: allResources.filter(r => r.visibility === 'Draft').length,
      awaitingReview: allResources.filter(r => r.visibility === 'Private').length,
      totalDownloads: allResources.reduce((sum, r) => sum + r.downloads, 0)
    };
  }, [allResources]);

  // Usage Analytics computation
  const analytics = useMemo(() => {
    if (allResources.length === 0) return null;
    const sortedByViews = [...allResources].sort((a, b) => b.views - a.views);
    const sortedByDownloads = [...allResources].sort((a, b) => b.downloads - a.downloads);
    
    return {
      mostViewed: sortedByViews[0],
      leastViewed: sortedByViews[sortedByViews.length - 1],
      mostDownloaded: sortedByDownloads[0],
      unused: allResources.filter(r => r.views === 0)
    };
  }, [allResources]);

  // Quick Insights computed dynamically from real database
  const quickInsights = useMemo(() => {
    const list = [];
    if (allResources.length > 0) {
      const mostPopular = [...allResources].sort((a, b) => b.downloads - a.downloads)[0];
      if (mostPopular && mostPopular.downloads > 0) {
        list.push(`${mostPopular.downloads} participants downloaded ${mostPopular.title}.`);
      }
      const unviewed = allResources.find(r => r.views === 0);
      if (unviewed) {
        list.push(`No one has viewed ${unviewed.title} yet.`);
      }
      const draftCount = allResources.filter(r => r.visibility === 'Draft').length;
      if (draftCount > 0) {
        list.push(`${draftCount} draft resource${draftCount > 1 ? 's' : ''} need${draftCount === 1 ? 's' : ''} publishing.`);
      }
    }
    return list;
  }, [allResources]);

  // Handle resource upload submission
  const handleUploadResourceSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.programId) return;

    const newResource = {
      id: 'res_' + Date.now(),
      name: uploadForm.title,
      description: uploadForm.description,
      type: uploadForm.type,
      visibility: uploadForm.visibility,
      lastUpdated: new Date().toISOString().split('T')[0],
      views: 0,
      downloads: 0,
      uploader: 'Program Manager',
      sessionId: uploadForm.sessionId,
      folderName: uploadForm.folderName || 'Week 1',
      comments: [],
      versionHistory: [{ version: '1.0', date: 'Just now', editor: 'Program Manager' }]
    };

    // Save back to program
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id.toString() === uploadForm.programId.toString()) {
          return {
            ...p,
            resources: [...(p.resources || []), newResource]
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setShowUploadDrawer(false);
    setSuccessToast('Resource uploaded successfully.');
    setTimeout(() => setSuccessToast(null), 3000);

    // AI recommendation rules
    setTimeout(() => {
      if (uploadForm.visibility === 'Draft') {
        setAiRecommendation({
          id: 'publish_resource',
          resource: newResource,
          programId: uploadForm.programId,
          title: 'This resource is still in Draft.',
          message: 'Publish it before tomorrow\'s session to make it visible to participants.',
          actionLabel: 'Publish Resource',
          action: () => triggerPublishResourceFlow(newResource.id, uploadForm.programId)
        });
      } else {
        setAiRecommendation({
          id: 'notify_participants',
          resource: newResource,
          programId: uploadForm.programId,
          title: 'Resource uploaded successfully.',
          message: 'Suggested next step: Notify enrolled participants via email.',
          actionLabel: 'Notify Participants',
          action: () => {
            setSuccessToast('Participants notified.');
            setTimeout(() => setSuccessToast(null), 2500);
            setAiRecommendation(null);
          }
        });
      }
    }, 1500);

    // Reset upload form
    setUploadForm({
      title: '',
      description: '',
      programId: '',
      folderName: '',
      type: 'PDF',
      visibility: 'Published',
      sessionId: '',
      notifyParticipants: false
    });
  };

  const triggerPublishResourceFlow = (resourceId, programId) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id.toString() === programId.toString()) {
          return {
            ...p,
            resources: (p.resources || []).map(r => {
              if (r.id === resourceId) {
                return { ...r, visibility: 'Published' };
              }
              return r;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast('Resource published successfully.');
    setTimeout(() => setSuccessToast(null), 2500);
    setAiRecommendation(null);
  };

  // Folder creation
  const handleCreateFolderSubmit = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setFolders([
      ...folders,
      { id: 'f_' + Date.now(), name: newFolderName.trim(), resourceCount: 0, lastUpdated: 'Today' }
    ]);
    setNewFolderName('');
    setShowCreateFolderModal(false);
    setSuccessToast('Folder created successfully.');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Filtering Resources
  const filteredResources = useMemo(() => {
    let list = [...allResources];

    // Filter tab
    if (activeFilterTab !== 'All') {
      if (activeFilterTab === 'Published') list = list.filter(r => r.visibility === 'Published');
      else if (activeFilterTab === 'Draft') list = list.filter(r => r.visibility === 'Draft');
      else if (activeFilterTab === 'Private') list = list.filter(r => r.visibility === 'Private');
      else if (activeFilterTab === 'Videos') list = list.filter(r => r.type === 'Video');
      else if (activeFilterTab === 'Documents') list = list.filter(r => r.type === 'Document' || r.type === 'PDF');
      else if (activeFilterTab === 'Images') list = list.filter(r => r.type === 'Image');
      else if (activeFilterTab === 'Assignments') list = list.filter(r => r.type === 'Assignment');
      else if (activeFilterTab === 'Templates') list = list.filter(r => r.type === 'Template');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.programName.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortKey === 'Newest') {
      list.sort((a, b) => (b.id || 0).toString().localeCompare((a.id || 0).toString()));
    } else if (sortKey === 'Oldest') {
      list.sort((a, b) => (a.id || 0).toString().localeCompare((b.id || 0).toString()));
    } else if (sortKey === 'Alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortKey === 'Most Viewed') {
      list.sort((a, b) => b.views - a.views);
    }

    return list;
  }, [allResources, activeFilterTab, searchQuery, sortKey]);

  const currentResourceDetail = useMemo(() => {
    return allResources.find(r => r.id === selectedResourceId) || null;
  }, [allResources, selectedResourceId]);

  return (
    <div style={{ padding: '2.5rem 3rem', minHeight: '100%', position: 'relative' }}>
      
      {/* Toast alert */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideInRight 0.2s ease'
        }}>
          <CheckCircle2 size={16} color="#10B981" />
          {successToast}
        </div>
      )}

      {/* Floating Global OYEN AI Recommendation */}
      {aiRecommendation && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '340px',
          backgroundColor: '#090a0f',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          padding: '1.25rem',
          color: '#ffffff',
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          backdropFilter: 'blur(16px)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Sparkles size={12} /> OYEN AI Assist
            </span>
            <button 
              onClick={() => setAiRecommendation(null)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.88rem', fontWeight: 700 }}>{aiRecommendation.title}</h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{aiRecommendation.message}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
            <button 
              onClick={aiRecommendation.action}
              style={{ padding: '0.45rem 0.85rem', backgroundColor: '#D4AF37', border: 'none', borderRadius: '6px', color: '#000000', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {aiRecommendation.actionLabel}
            </button>
            <button 
              onClick={() => setAiRecommendation(null)}
              style={{ padding: '0.45rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: LISTING VIEW */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111111', fontFamily: "'Outfit', sans-serif" }}>Resources</h1>
              <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.95rem' }}>
                Upload, organize and manage learning materials for your assigned programmes.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setShowCreateFolderModal(true)}
                style={{ padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '8px', color: '#2D2D2D', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <FolderPlus size={15} /> Create Folder
              </button>
              <button 
                onClick={() => setShowUploadDrawer(true)}
                style={{ padding: '0.65rem 1.4rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '8px', color: '#111111', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(244,197,66,0.3)' }}
              >
                <Plus size={16} /> Upload Resource
              </button>
            </div>
          </div>

          {/* 4 Live Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Published Resources', value: stats.published, icon: <Globe size={18} color="#10B981" /> },
              { label: 'Draft Resources', value: stats.draft, icon: <Edit3 size={18} color="#F59E0B" /> },
              { label: 'Files Awaiting Review', value: stats.awaitingReview, icon: <Lock size={18} color="#3B82F6" /> },
              { label: 'Total Downloads', value: stats.totalDownloads, icon: <Download size={18} color="#6B7280" /> }
            ].map((card, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111111', marginTop: '0.25rem' }}>{card.value}</div>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Folder Grid Section */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800 }}>Workspace Folders</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {folders.map(folder => (
                <div key={folder.id} style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifycontent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <Folder size={24} color="#F4C542" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111111', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{folder.name}</div>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{folder.resourceCount} Files • Updated {folder.lastUpdated}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilterTab('All');
                      setSuccessToast(`Opened ${folder.name} directory.`);
                      setTimeout(() => setSuccessToast(null), 2000);
                    }}
                    style={{ padding: '0.35rem 0.65rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search, Filter tabs and Sort Strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              
              {/* Search bar */}
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search size={15} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input 
                  type="text" 
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.2rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Sort */}
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value)}
                style={{ padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none' }}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Most Viewed">Most Viewed</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EBE5D9', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {['All', 'Published', 'Draft', 'Private', 'Videos', 'Documents', 'Images', 'Assignments', 'Templates'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.55rem 1.1rem',
                    fontSize: '0.82rem',
                    fontWeight: activeFilterTab === tab ? 700 : 500,
                    color: activeFilterTab === tab ? '#111111' : '#6B7280',
                    borderBottom: activeFilterTab === tab ? '2px solid #F4C542' : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Table rendering */}
          {filteredResources.length > 0 ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EBE5D9', backgroundColor: '#FAFAF8' }}>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Resource</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Programme</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Type</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Visibility</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Last Updated</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Views</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600 }}>Downloads</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(res => (
                    <tr 
                      key={res.id}
                      onClick={() => { setSelectedResourceId(res.id); setViewMode('detail'); }}
                      style={{ borderBottom: '1px solid #EBE5D9', cursor: 'pointer', transition: 'background-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#111111' }}>
                          <FileText size={15} color="#6B7280" />
                          <span>{res.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{res.programName}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{res.type}</td>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: res.visibility === 'Published' ? 'rgba(16,185,129,0.1)' : res.visibility === 'Draft' ? '#FAFAF8' : 'rgba(59,130,246,0.1)',
                          color: res.visibility === 'Published' ? '#10B981' : res.visibility === 'Draft' ? '#6B7280' : '#3B82F6'
                        }}>
                          {res.visibility}
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{res.lastUpdated}</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{res.views} views</td>
                      <td style={{ padding: '1.1rem 1.25rem', color: '#2D2D2D' }}>{res.downloads} downloads</td>
                      <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResourceId(res.id);
                            setViewMode('detail');
                          }}
                          style={{ padding: '0.35rem 0.75rem', backgroundColor: '#F5F2ED', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* EMPTY STATE */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 2rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #EBE5D9',
              borderRadius: '16px',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2.5rem' }}>📂</span>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>No resources yet</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '0.88rem', maxWidth: '385px', lineHeight: 1.5 }}>
                  Upload your first learning resource to begin sharing materials with participants.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => setShowUploadDrawer(true)}
                  style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '8px', color: '#111111', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Upload Resource
                </button>
                <button 
                  onClick={() => setShowCreateFolderModal(true)}
                  style={{ padding: '0.65rem 1.25rem', backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '8px', color: '#2D2D2D', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Create Folder
                </button>
              </div>
            </div>
          )}

          {/* Usage Analytics and Quick Insights Section */}
          {analytics && (
            <div style={{ borderTop: '1px solid #EBE5D9', paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
              {/* Analytics Summary */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BarChart3 size={18} color="#D8A325" /> Usage Analytics
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Most Downloaded Resource</span>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '0.25rem', color: '#111111' }}>{analytics.mostDownloaded?.title || 'None'}</div>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{analytics.mostDownloaded?.downloads || 0} downloads</span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Most Viewed Resource</span>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '0.25rem', color: '#111111' }}>{analytics.mostViewed?.title || 'None'}</div>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{analytics.mostViewed?.views || 0} views</span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Unused Resources</span>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '0.25rem', color: '#111111' }}>{analytics.unused.length} File{analytics.unused.length !== 1 ? 's' : ''}</div>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>Have zero participant views</span>
                  </div>
                </div>
              </div>

              {/* Quick Insights List */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800 }}>Quick Insights</h3>
                <div style={{
                  backgroundColor: '#FFFBEA',
                  border: '1px solid #F4C542',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {quickInsights.length > 0 ? (
                    quickInsights.map((insight, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#2D2D2D' }}>
                        <span style={{ color: '#F4C542' }}>•</span>
                        <span>{insight}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#6B7280', fontStyle: 'italic' }}>No insights available yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW MODE 2: RESOURCE DETAILS FULL PAGE VIEW */}
      {viewMode === 'detail' && currentResourceDetail && (
        <ResourceDetailView 
          resource={currentResourceDetail}
          onBack={() => setViewMode('list')}
          setWsPrograms={setWsPrograms}
          setSuccessToast={setSuccessToast}
          setAiRecommendation={setAiRecommendation}
        />
      )}

      {/* UPLOAD RESOURCE DRAWER */}
      {showUploadDrawer && (
        <>
          <div 
            onClick={() => setShowUploadDrawer(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)', zIndex: 3000 }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '450px',
            backgroundColor: '#ffffff',
            borderLeft: '1px solid #EBE5D9',
            boxShadow: '-10px 0 35px rgba(0,0,0,0.1)',
            zIndex: 3001,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.25s ease'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #EBE5D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Upload Resource</h2>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Add new course materials and files to workspace.</span>
              </div>
              <button 
                onClick={() => setShowUploadDrawer(false)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadResourceSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.2rem', overflowY: 'auto' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Title *</label>
                <input 
                  type="text" 
                  value={uploadForm.title} 
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. Week 4 Lecture Slides" 
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Description</label>
                <textarea 
                  rows={3}
                  value={uploadForm.description} 
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Brief description of the material..." 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Programme *</label>
                <select 
                  value={uploadForm.programId} 
                  onChange={e => setUploadForm({ ...uploadForm, programId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="">Select Programme...</option>
                  {wsPrograms.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Folder</label>
                  <select 
                    value={uploadForm.folderName} 
                    onChange={e => setUploadForm({ ...uploadForm, folderName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Folder...</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Resource Type</label>
                  <select 
                    value={uploadForm.type} 
                    onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="PDF">PDF</option>
                    <option value="Document">Document</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="Spreadsheet">Spreadsheet</option>
                    <option value="Presentation">Presentation</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Visibility</label>
                <select 
                  value={uploadForm.visibility} 
                  onChange={e => setUploadForm({ ...uploadForm, visibility: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="chk_notify"
                  checked={uploadForm.notifyParticipants} 
                  onChange={e => setUploadForm({ ...uploadForm, notifyParticipants: e.target.checked })}
                />
                <label htmlFor="chk_notify" style={{ fontSize: '0.82rem', color: '#2D2D2D' }}>Notify Enrolled Participants</label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 'auto', borderTop: '1px solid #EBE5D9', paddingTop: '1.25rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowUploadDrawer(false)}
                  style={{ padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '8px', color: '#111111', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* CREATE FOLDER MODAL */}
      {showCreateFolderModal && (
        <>
          <div 
            onClick={() => setShowCreateFolderModal(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)', zIndex: 3000 }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            zIndex: 3001,
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Create Folder</h2>
              <button 
                onClick={() => setShowCreateFolderModal(false)}
                style={{ background: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Folder Name *</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="e.g. Weekly Guides"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateFolderModal(false)}
                  style={{ padding: '0.55rem 1.1rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.55rem 1.25rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '8px', color: '#111111', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

// ────────────────────────────────────────────────────────
// SUBCOMPONENT: RESOURCE DETAIL VIEW
// ────────────────────────────────────────────────────────
function ResourceDetailView({ 
  resource, 
  onBack, 
  setWsPrograms, 
  setSuccessToast, 
  setAiRecommendation 
}) {
  const [commentInput, setCommentInput] = useState('');

  // Handle visibility update
  const updateVisibility = (newVisibility) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === resource.programId) {
          return {
            ...p,
            resources: (p.resources || []).map(r => {
              if (r.id === resource.id || r.name === resource.title) {
                return { ...r, visibility: newVisibility };
              }
              return r;
            })
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setSuccessToast(`Resource visibility updated to ${newVisibility}`);
    setTimeout(() => setSuccessToast(null), 2500);

    // AI suggestion on publish
    if (newVisibility === 'Published') {
      setTimeout(() => {
        setAiRecommendation({
          id: 'publish_success_notify',
          resource,
          title: `${resource.title} published.`,
          message: 'Participants can now access this material. Would you like to notify them?',
          actionLabel: 'Send Notification',
          action: () => {
            setSuccessToast('Notification sent to enrolled participants.');
            setTimeout(() => setSuccessToast(null), 2500);
            setAiRecommendation(null);
          }
        });
      }, 1500);
    }
  };

  // Archive Resource handler
  const handleArchiveResource = () => {
    updateVisibility('Private');
  };

  // Add Comment handler
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setSuccessToast('Comment posted successfully.');
    setTimeout(() => setSuccessToast(null), 2000);
    setCommentInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Details Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EBE5D9', paddingBottom: '1.5rem' }}>
        <div>
          <button 
            onClick={onBack}
            style={{
              background: 'transparent', border: 'none', color: '#6B7280',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0, marginBottom: '0.75rem'
            }}
          >
            ← Back to Resources
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#111111' }}>{resource.title}</h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              backgroundColor: resource.visibility === 'Published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
              color: resource.visibility === 'Published' ? '#10B981' : '#F59E0B'
            }}>
              {resource.visibility}
            </span>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>
            Programme: <span style={{ fontWeight: 600, color: '#111111' }}>{resource.programName}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {resource.visibility !== 'Published' && (
            <button 
              onClick={() => updateVisibility('Published')}
              style={{ padding: '0.55rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Publish Resource
            </button>
          )}
          <button 
            onClick={handleArchiveResource}
            style={{ padding: '0.55rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #EBE5D9', borderRadius: '6px', color: '#2D2D2D', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Archive File
          </button>
        </div>
      </div>

      {/* Detail Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
        
        {/* Detail Left Side content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* File Preview Mock Box */}
          <div style={{
            height: '240px',
            backgroundColor: '#0D0D0D',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            gap: '0.5rem',
            border: '1px solid #1F1F1F'
          }}>
            <FileText size={48} color="#D4AF37" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{resource.title}</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>File Preview Mockup ({resource.type})</span>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Description</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#2D2D2D', lineHeight: 1.6 }}>{resource.description}</p>
          </div>

          {/* Version History Log */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Version History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resource.versionHistory.map((hist, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#111111' }}>v{hist.version}</span>
                    <span style={{ color: '#6B7280' }}>Edited by {hist.editor}</span>
                  </div>
                  <span style={{ color: '#6B7280' }}>{hist.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments section mock */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Comments & Activity Feed</h3>
            
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Write a comment..." 
                style={{ flex: 1, padding: '0.55rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0.55rem 1rem', backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Detail Right Side Attributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Metadata Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Resource Information</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Uploader</span>
              <span style={{ fontWeight: 600 }}>{resource.uploader}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Folder Directory</span>
              <span style={{ fontWeight: 600 }}>{resource.folderName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Total Views</span>
              <span style={{ fontWeight: 600 }}>{resource.views} views</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Downloads</span>
              <span style={{ fontWeight: 600 }}>{resource.downloads} downloads</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Last Updated</span>
              <span style={{ fontWeight: 600 }}>{resource.lastUpdated}</span>
            </div>
          </div>

          {/* Access permissions overview */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Access List</h3>
            <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Participants with access to this learning resource:</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                <span>All enrolled programme participants ({resource.programName})</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
