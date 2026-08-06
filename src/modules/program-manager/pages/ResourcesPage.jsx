import React, { useState, useMemo } from 'react';
import { 
  Plus, FileText, FolderPlus, Search, X, Folder, Download, Eye, 
  User, Trash2, Calendar, Sparkles, Globe, Lock, Edit3, ArrowRight,
  MoreHorizontal, Play, CheckCircle2, MessageSquare, Clock, Copy
} from 'lucide-react';

export default function ResourcesPage({ wsPrograms = [], setWsPrograms }) {
  // Navigation: 'folders' | 'folder-detail' | 'resource-detail'
  const [viewMode, setViewMode] = useState('folders'); 
  const [selectedFolderName, setSelectedFolderName] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedVisibility, setSelectedVisibility] = useState('All');
  const [sortKey, setSortKey] = useState('Newest');

  // Interactive controls
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
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

  // Load Folders & Files dynamically from wsPrograms state
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
    return list;
  }, [wsPrograms]);

  // Dynamic Folders populated from real resources
  const dynamicFolders = useMemo(() => {
    const map = {};
    // Pre-populate core operational folder categories
    const defaults = ['Week 1', 'Week 2', 'Assignments', 'Recordings', 'Templates', 'Certificates', 'Policies'];
    defaults.forEach(def => {
      map[def] = { name: def, files: [], lastUpdated: 'Never' };
    });

    allResources.forEach(res => {
      const fName = res.folderName || 'Week 1';
      if (!map[fName]) {
        map[fName] = { name: fName, files: [], lastUpdated: 'Never' };
      }
      map[fName].files.push(res);
      if (res.lastUpdated !== 'Never') {
        map[fName].lastUpdated = res.lastUpdated;
      }
    });

    return Object.values(map);
  }, [allResources]);

  // Operational metrics computed from live database only
  const operationalCards = useMemo(() => {
    const uniqueFolders = new Set(allResources.map(r => r.folderName || 'Week 1'));
    // Filter actual draft files
    const draftCount = allResources.filter(r => r.visibility === 'Draft').length;
    // Determine recently updated files
    const todayStr = new Date().toISOString().split('T')[0];
    const recentlyUpdated = allResources.filter(r => r.lastUpdated === 'Today' || r.lastUpdated === todayStr).length;

    return [
      { label: 'Folders', value: Math.max(dynamicFolders.length, uniqueFolders.size) },
      { label: 'Resources', value: allResources.length },
      { label: 'Pending Reviews', value: draftCount },
      { label: 'Recently Updated', value: recentlyUpdated }
    ];
  }, [allResources, dynamicFolders]);

  // AI single integrated suggestion banner
  const aiSuggestion = useMemo(() => {
    // Check if there is a draft resource that needs publishing
    const draftRes = allResources.find(r => r.visibility === 'Draft');
    if (draftRes) {
      return {
        id: 'publish_draft',
        text: `"${draftRes.title}" is still in Draft. Publish it to make it visible to participants.`,
        actionLabel: 'Publish',
        action: () => triggerPublishFlow(draftRes.id, draftRes.programId)
      };
    }
    // Check if there is a resource with zero downloads
    const unusedRes = allResources.find(r => r.downloads === 0 && r.visibility === 'Published');
    if (unusedRes) {
      return {
        id: 'notify_unused',
        text: `Participants haven't downloaded "${unusedRes.title}" yet.`,
        actionLabel: 'Notify Participants',
        action: () => {
          setSuccessToast('Notification sent to enrolled participants.');
          setTimeout(() => setSuccessToast(null), 2500);
        }
      };
    }
    return null;
  }, [allResources]);

  const triggerPublishFlow = (resourceId, programId) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === programId) {
          return {
            ...p,
            resources: (p.resources || []).map(r => {
              if (r.id === resourceId) {
                return { ...r, visibility: 'Published', lastUpdated: 'Today' };
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

    setSuccessToast('✓ Resource published successfully.');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Upload new learning resource handler
  const handleUploadResource = (e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.programId) return;

    const newRes = {
      id: 'res_' + Date.now(),
      name: uploadForm.title,
      description: uploadForm.description || 'Uploaded programme material.',
      type: uploadForm.type,
      visibility: uploadForm.visibility,
      lastUpdated: 'Today',
      views: 0,
      downloads: 0,
      uploader: 'Program Manager',
      sessionId: uploadForm.sessionId,
      folderName: uploadForm.folderName || 'Week 1',
      comments: [],
      versionHistory: [{ version: '1.0', date: 'Today', editor: 'Program Manager' }]
    };

    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id.toString() === uploadForm.programId.toString()) {
          return {
            ...p,
            resources: [...(p.resources || []), newRes]
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setShowUploadDrawer(false);
    setSuccessToast('✓ Resource uploaded successfully.');
    setTimeout(() => setSuccessToast(null), 3000);

    // Reset Form
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

  // Create folder action
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setSuccessToast(`✓ Folder "${newFolderName}" created.`);
    setTimeout(() => setSuccessToast(null), 2500);
    setNewFolderName('');
    setShowCreateFolderModal(false);
  };

  // Delete Resource handler
  const handleDeleteResource = (resourceId, programId) => {
    setWsPrograms(prev => {
      const next = prev.map(p => {
        if (p.id === programId) {
          return {
            ...p,
            resources: (p.resources || []).filter(r => r.id !== resourceId)
          };
        }
        return p;
      });
      localStorage.setItem('oyen_ws_programs', JSON.stringify(next));
      return next;
    });

    setViewMode('folders');
    setSuccessToast('✓ Resource permanently deleted.');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Search filter matching folders and files
  const searchFilteredResources = useMemo(() => {
    let list = [...allResources];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) ||
        (r.folderName || '').toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        (r.programName || '').toLowerCase().includes(q)
      );
    }

    if (selectedProgram !== 'All') {
      list = list.filter(r => r.programId.toString() === selectedProgram.toString());
    }
    if (selectedType !== 'All') {
      list = list.filter(r => r.type === selectedType);
    }
    if (selectedVisibility !== 'All') {
      list = list.filter(r => r.visibility === selectedVisibility);
    }

    // Sort
    if (sortKey === 'Newest') {
      list.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    } else if (sortKey === 'Alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [allResources, searchQuery, selectedProgram, selectedType, selectedVisibility, sortKey]);

  // Files inside selected folder detail view
  const currentFolderFiles = useMemo(() => {
    return searchFilteredResources.filter(r => r.folderName === selectedFolderName);
  }, [searchFilteredResources, selectedFolderName]);

  const currentResourceDetail = useMemo(() => {
    return allResources.find(r => r.id === selectedResourceId) || null;
  }, [allResources, selectedResourceId]);

  return (
    <div style={{ padding: '2.5rem 3rem', minHeight: '100%', position: 'relative' }}>
      
      {/* Toast Notifications */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideInRight 0.25s ease'
        }}>
          <CheckCircle2 size={16} color="#10B981" />
          {successToast}
        </div>
      )}

      {/* Hero Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111111', fontFamily: "'Outfit', sans-serif" }}>Resources</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.95rem' }}>
            Manage all learning materials across your assigned programmes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowCreateFolderModal(true)}
            style={{ padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #EBE5D9', borderRadius: '8px', color: '#2D2D2D', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Create Folder
          </button>
          <button 
            onClick={() => setShowUploadDrawer(true)}
            style={{ padding: '0.65rem 1.4rem', backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Upload Resource
          </button>
        </div>
      </div>

      {/* AI Integrated single banner */}
      {aiSuggestion && (
        <div style={{
          backgroundColor: '#FFFBEA',
          border: '1px solid #F4C542',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#2D2D2D' }}>
            <Sparkles size={16} color="#D8A325" />
            <strong>⚡ OYEN AI:</strong>
            <span>{aiSuggestion.text}</span>
          </div>
          <button 
            onClick={aiSuggestion.action}
            style={{ padding: '0.45rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', color: '#111111', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {aiSuggestion.actionLabel}
          </button>
        </div>
      )}

      {/* 4 Live Stats Cards */}
      {allResources.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {operationalCards.map(card => (
            <div key={card.label} style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111111', marginTop: '0.25rem' }}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {allResources.length === 0 ? (
        /* 10. EMPTY STATE */
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
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>No resources have been uploaded yet.</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.88rem', maxWidth: '380px', lineHeight: 1.5 }}>
              Resources help participants prepare for sessions and complete assignments.
            </p>
          </div>
          <button 
            onClick={() => setShowUploadDrawer(true)}
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Upload First Resource
          </button>
        </div>
      ) : (
        <>
          {/* VIEW MODE 1: FOLDER NAVIGATION */}
          {viewMode === 'folders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800 }}>Workspace Folders</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {dynamicFolders.map(folder => (
                    <div 
                      key={folder.name}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #EBE5D9',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Folder size={24} color="#F4C542" style={{ flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111111', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{folder.name}</div>
                          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{folder.files.length} Resources</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', borderTop: '1px solid #FAFAF8', paddingTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Updated {folder.lastUpdated}</span>
                        <button 
                          onClick={() => {
                            setSelectedFolderName(folder.name);
                            setViewMode('folder-detail');
                          }}
                          style={{ padding: '0.35rem 0.75rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Open Directory
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiny Recent Activity Section */}
              <div style={{ borderTop: '1px solid #EBE5D9', paddingTop: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Recently Updated</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
                  {allResources.slice(0, 3).map(res => (
                    <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F5F2ED' }}>
                      <span style={{ fontWeight: 600, color: '#111111' }}>{res.title}</span>
                      <span style={{ color: '#6B7280' }}>{res.lastUpdated}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: FOLDER DETAIL LIST (CARDS) */}
          {viewMode === 'folder-detail' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <button 
                    onClick={() => setViewMode('folders')}
                    style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0, marginBottom: '0.5rem' }}
                  >
                    ← Back to Folders
                  </button>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{selectedFolderName}</h2>
                </div>
              </div>

              {/* Advanced search filters inside folder */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '10px' }}>
                <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
                  <Search size={14} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input 
                    type="text" 
                    placeholder={`Search within ${selectedFolderName}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem 0.85rem 0.45rem 2rem', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <select
                  value={selectedProgram}
                  onChange={e => setSelectedProgram(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
                >
                  <option value="All">All Programmes</option>
                  {wsPrograms.map(p => <option key={p.id} value={p.id}>{p.name || p.title}</option>)}
                </select>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
                >
                  <option value="All">All Types</option>
                  <option value="PDF">PDF</option>
                  <option value="Document">Document</option>
                  <option value="Video">Video</option>
                  <option value="Image">Image</option>
                  <option value="Presentation">Presentation</option>
                </select>
                <select
                  value={selectedVisibility}
                  onChange={e => setSelectedVisibility(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
                >
                  <option value="All">All Visibilities</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              {/* Resource Cards grid */}
              {currentFolderFiles.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {currentFolderFiles.map(res => (
                    <div 
                      key={res.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #EBE5D9',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '180px',
                        transition: 'box-shadow 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>📄</span>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: res.visibility === 'Published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            color: res.visibility === 'Published' ? '#10B981' : '#F59E0B'
                          }}>{res.visibility}</span>
                        </div>

                        <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#111111' }}>{res.title}</h4>
                        <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.5rem' }}>{res.programName}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #F5F2ED', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9CA3AF' }}>
                          <span>{res.type}</span>
                          <span>Updated {res.lastUpdated}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => {
                              setSelectedResourceId(res.id);
                              setViewMode('resource-detail');
                            }}
                            style={{ flex: 1, padding: '0.45rem', backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Open
                          </button>
                          <button 
                            onClick={() => {
                              setSuccessToast('✓ File downloaded successfully.');
                              setTimeout(() => setSuccessToast(null), 2500);
                            }}
                            style={{ padding: '0.45rem', backgroundColor: '#FAFAF8', border: '1px solid #EBE5D9', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280', border: '2px dashed #EBE5D9', borderRadius: '16px' }}>
                  No matching resources in this folder.
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 3: RESOURCE DETAILS */}
          {viewMode === 'resource-detail' && currentResourceDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Back & Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EBE5D9', paddingBottom: '1.25rem' }}>
                <div>
                  <button 
                    onClick={() => setViewMode('folder-detail')}
                    style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0, marginBottom: '0.5rem' }}
                  >
                    ← Back to {currentResourceDetail.folderName}
                  </button>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{currentResourceDetail.title}</h2>
                  <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Programme: <strong style={{ color: '#111111' }}>{currentResourceDetail.programName}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {currentResourceDetail.visibility !== 'Published' && (
                    <button 
                      onClick={() => triggerPublishFlow(currentResourceDetail.id, currentResourceDetail.programId)}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#F4C542', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Publish
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteResource(currentResourceDetail.id, currentResourceDetail.programId)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Delete File
                  </button>
                </div>
              </div>

              {/* Resource attributes & info page layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
                
                {/* Details Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* File preview block mock */}
                  <div style={{
                    height: '200px', backgroundColor: '#0D0D0D', borderRadius: '12px', border: '1px solid #1F1F1F',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', gap: '0.5rem'
                  }}>
                    <FileText size={40} color="#F4C542" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentResourceDetail.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>File Preview Mockup ({currentResourceDetail.type})</span>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.9rem', fontWeight: 800 }}>Description</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#2D2D2D', lineHeight: 1.5 }}>{currentResourceDetail.description}</p>
                  </div>

                  {/* Version history log */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 800 }}>Version History</h4>
                    {currentResourceDetail.versionHistory.map((hist, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#2D2D2D' }}>
                        <span>v{hist.version} • Edited by {hist.editor}</span>
                        <span style={{ color: '#6B7280' }}>{hist.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #EBE5D9', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 800 }}>Details</h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Type</span>
                      <span style={{ fontWeight: 600 }}>{currentResourceDetail.type}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Directory</span>
                      <span style={{ fontWeight: 600 }}>{currentResourceDetail.folderName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Visibility</span>
                      <span style={{ fontWeight: 700, color: currentResourceDetail.visibility === 'Published' ? '#10B981' : '#F59E0B' }}>{currentResourceDetail.visibility}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Uploader</span>
                      <span style={{ fontWeight: 600 }}>{currentResourceDetail.uploader}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Last Updated</span>
                      <span style={{ fontWeight: 600 }}>{currentResourceDetail.lastUpdated}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      )}

      {/* 11. UPLOAD RESOURCE FLOW DRAWER */}
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
            width: '440px',
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

            <form onSubmit={handleUploadResource} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.2rem', overflowY: 'auto' }}>
              
              {/* Drag & Drop mockup container */}
              <div style={{
                border: '2px dashed #EBE5D9',
                borderRadius: '12px',
                padding: '2rem 1rem',
                textAlign: 'center',
                backgroundColor: '#FAFAF8',
                cursor: 'pointer'
              }}
                onClick={() => document.getElementById('file_uploader_element').click()}
              >
                <input type="file" id="file_uploader_element" style={{ display: 'none' }} onChange={(e) => {
                  if (e.target.files.length) {
                    setUploadForm({ ...uploadForm, title: e.target.files[0].name });
                  }
                }} />
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📤</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111111', display: 'block' }}>Drag & Drop</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>or Choose Files</span>
              </div>

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
                    {dynamicFolders.map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Type</label>
                  <select 
                    value={uploadForm.type} 
                    onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #EBE5D9', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="PDF">PDF</option>
                    <option value="Document">Document</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="Presentation">Presentation</option>
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
                  style={{ padding: '0.65rem 1.5rem', backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
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

            <form onSubmit={handleCreateFolder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  style={{ padding: '0.55rem 1.25rem', backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
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
