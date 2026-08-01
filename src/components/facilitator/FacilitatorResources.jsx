import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Download, Eye, FileText, ArrowLeft, ArrowRight,
  ExternalLink, Video, CheckCircle2, ChevronRight, FileSpreadsheet, 
  HelpCircle, Sparkles, Sliders, RefreshCw
} from 'lucide-react';

export default function FacilitatorResources({ 
  assignedSessions = [], 
  currentUserEmail 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Map each assigned session to its mock resources database records
  const sessionResourcesMap = useMemo(() => {
    const map = {};
    assignedSessions.forEach(s => {
      map[s.id] = [
        {
          id: `${s.id}-guide`,
          title: `${s.title} - Facilitator Guide`,
          fileName: `${s.title.replace(/\s+/g, '_')}_Facilitator_Guide.pdf`,
          category: 'Documents',
          fileType: 'PDF',
          size: '4.8 MB',
          version: 'v2.1',
          lastUpdated: '2 days ago',
          uploadedBy: 'Admin',
          groupName: 'Facilitator Guide'
        },
        {
          id: `${s.id}-slides`,
          title: `${s.title} - Presentation Slides`,
          fileName: `${s.title.replace(/\s+/g, '_')}_Slides.pptx`,
          category: 'Slides',
          fileType: 'PowerPoint',
          size: '14.2 MB',
          version: 'v1.4',
          lastUpdated: 'Yesterday',
          uploadedBy: 'Admin',
          groupName: 'Presentation Slides'
        },
        {
          id: `${s.id}-workbook`,
          title: `${s.title} - Participant Workbook`,
          fileName: `${s.title.replace(/\s+/g, '_')}_Participant_Workbook.pdf`,
          category: 'Documents',
          fileType: 'PDF',
          size: '8.5 MB',
          version: 'v1.0',
          lastUpdated: '3 days ago',
          uploadedBy: 'Admin',
          groupName: 'Learner Workbook'
        },
        {
          id: `${s.id}-attendance`,
          title: `${s.title} - Attendance Roster Checksheet`,
          fileName: `${s.title.replace(/\s+/g, '_')}_Attendance.xlsx`,
          category: 'Attendance',
          fileType: 'Excel',
          size: '145 KB',
          version: 'v1.1',
          lastUpdated: 'Yesterday',
          uploadedBy: 'Admin',
          groupName: 'Attendance Sheet'
        },
        {
          id: `${s.id}-assessment`,
          title: `${s.title} - Participant Assessment Quiz`,
          fileName: `${s.title.replace(/\s+/g, '_')}_Quiz.docx`,
          category: 'Assessments',
          fileType: 'Word',
          size: '1.9 MB',
          version: 'v1.0',
          lastUpdated: '5 days ago',
          uploadedBy: 'Admin',
          groupName: 'Assessments'
        },
        {
          id: `${s.id}-reference`,
          title: `Industry Reference Architecture Framework`,
          fileName: `Industry_Reference_Architecture.pdf`,
          category: 'Documents',
          fileType: 'PDF',
          size: '18.2 MB',
          version: 'v3.0',
          lastUpdated: '1 week ago',
          uploadedBy: 'Admin',
          groupName: 'Reference Documents'
        },
        {
          id: `${s.id}-recording`,
          title: `${s.title} - Previous Cohort Video Recording`,
          fileName: `${s.title.replace(/\s+/g, '_')}_Video.mp4`,
          category: 'Videos',
          fileType: 'MP4 Video',
          size: '235.0 MB',
          version: 'v1.0',
          lastUpdated: '4 days ago',
          uploadedBy: 'Admin',
          groupName: 'Session Recording'
        },
        {
          id: `${s.id}-ainotes`,
          title: `${s.title} - AI Transcript Summary Insight`,
          fileName: `${s.title.replace(/\s+/g, '_')}_AI_Insights.pdf`,
          category: 'AI Notes',
          fileType: 'PDF',
          size: '890 KB',
          version: 'v1.0',
          lastUpdated: 'Yesterday',
          uploadedBy: 'AI Copilot',
          groupName: 'AI Session Notes'
        }
      ];
    });
    return map;
  }, [assignedSessions]);

  // Find selected session details
  const selectedSession = useMemo(() => {
    return assignedSessions.find(s => s.id === selectedSessionId) || null;
  }, [assignedSessions, selectedSessionId]);

  // Get active session files
  const activeSessionFiles = useMemo(() => {
    if (!selectedSessionId) return [];
    return sessionResourcesMap[selectedSessionId] || [];
  }, [sessionResourcesMap, selectedSessionId]);

  // Filtered files based on search & filter category chips
  const filteredFiles = useMemo(() => {
    return activeSessionFiles.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || f.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activeSessionFiles, searchQuery, activeFilter]);

  // Available filter chips (only show categories that actually contain resources)
  const filterChips = useMemo(() => {
    if (!selectedSessionId) return [];
    const categories = new Set(['All']);
    activeSessionFiles.forEach(f => categories.add(f.category));
    return Array.from(categories);
  }, [activeSessionFiles, selectedSessionId]);

  // File icons selector
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'Excel':
        return <FileSpreadsheet size={22} color="#10B981" />;
      case 'MP4 Video':
        return <Video size={22} color="#2D6CDF" />;
      case 'PDF':
        return <FileText size={22} color="#EF4444" />;
      case 'PowerPoint':
        return <BookOpen size={22} color="#F59E0B" />;
      default:
        return <FileText size={22} color="#D4AF37" />;
    }
  };

  // Zero State (No Assigned Sessions at all)
  if (assignedSessions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ 
        backgroundColor: '#F8F5EF', 
        minHeight: '100vh', 
        padding: '3rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontFamily: "'Inter', sans-serif" 
      }}>
        <div style={{ 
          maxWidth: '520px', 
          textAlign: 'center', 
          backgroundColor: '#FFFDF9', 
          padding: '4.5rem 3.5rem', 
          borderRadius: '24px', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.015)',
          border: '1px solid rgba(0,0,0,0.02)',
          color: '#151515'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '88px', 
            height: '88px', 
            borderRadius: '50%', 
            backgroundColor: '#F8F5EF', 
            marginBottom: '2rem'
          }}>
            <BookOpen size={40} color="#D4AF37" />
          </div>
          <h2 style={{ 
            fontSize: '1.9rem', 
            fontWeight: 800, 
            color: '#151515', 
            margin: '0 0 1rem', 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.5px'
          }}>
            No resources have been shared yet.
          </h2>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            margin: '0 0 2.5rem' 
          }}>
            Learning materials for your assigned sessions will appear here automatically once your administrator publishes them.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              backgroundColor: '#D4AF37', 
              border: 'none', 
              color: '#FFFFFF', 
              padding: '0.95rem 2.2rem', 
              borderRadius: '12px', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.65rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.2)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5942D'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F8F5EF', 
      minHeight: '100vh', 
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#151515',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {selectedSessionId && (
          <button 
            onClick={() => { setSelectedSessionId(null); setActiveFilter('All'); setSearchQuery(''); }}
            style={{ 
              backgroundColor: '#FFFDF9', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '10px', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              color: '#151515',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F5EF'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFDF9'}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            color: '#151515', 
            margin: 0, 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.8px'
          }}>
            Session Resources
          </h1>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            marginTop: '0.35rem' 
          }}>
            {selectedSession ? `Files and materials for "${selectedSession.title}"` : "Everything you need for your assigned teaching sessions."}
          </p>
        </div>
      </div>

      {/* VIEW 1: Overview list of sessions resources cards */}
      {!selectedSessionId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Featured Session Resource Card (Closest upcoming session with materials) */}
          {assignedSessions[0] && (
            <div style={{ 
              backgroundColor: '#FFFDF9', 
              borderRadius: '24px', 
              padding: '2.5rem', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
              border: '1px solid rgba(212, 175, 55, 0.25)', // Premium gold soft border
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'relative'
            }}>
              <div>
                <span style={{ 
                  backgroundColor: 'rgba(45, 108, 223, 0.08)',
                  color: '#2D6CDF',
                  padding: '0.4rem 1rem',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Featured Assigned Session
                </span>
                <h2 style={{ 
                  fontSize: '2.1rem', 
                  fontWeight: 800, 
                  color: '#151515', 
                  margin: '0.75rem 0 0.25rem',
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '-0.5px'
                }}>
                  {assignedSessions[0].title}
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#666666', fontWeight: 500 }}>
                  {assignedSessions[0].programName || 'Programme'}
                </span>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '1rem' }}>
                  Available Toolkit Resources
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#151515', fontSize: '0.9rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#D4AF37" /> Facilitator Guide
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#151515', fontSize: '0.9rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#D4AF37" /> Presentation Slides
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#151515', fontSize: '0.9rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#D4AF37" /> Learner Workbook
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#151515', fontSize: '0.9rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#D4AF37" /> Attendance Sheet
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => setSelectedSessionId(assignedSessions[0].id)}
                  style={{ 
                    backgroundColor: '#D4AF37', 
                    border: 'none', 
                    color: '#FFFFFF', 
                    padding: '0.95rem 2rem', 
                    borderRadius: '12px', 
                    fontSize: '0.95rem', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5942D'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
                >
                  Open Session Resources
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* List of remaining session cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: '#888888', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '1rem 0 0'
            }}>
              All Session toolkits
            </h3>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {assignedSessions.map(session => {
                const count = (sessionResourcesMap[session.id] || []).length;
                return (
                  <div 
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    style={{ 
                      backgroundColor: '#FFFDF9',
                      borderRadius: '20px',
                      padding: '1.75rem 2rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                      border: '1px solid rgba(0,0,0,0.015)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '160px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'; }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {session.programName || 'Programme'}
                      </span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#151515', margin: '0.35rem 0 0.5rem', fontFamily: "'Outfit', sans-serif" }}>
                        {session.title}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#666666', fontWeight: 500 }}>
                        {count} Resources available
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2D6CDF', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <span>View</span>
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        
        // VIEW 2: Inside a specific session toolkit
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Search and Filters panel */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {filterChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveFilter(chip)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '30px',
                    border: '1px solid',
                    borderColor: activeFilter === chip ? '#D4AF37' : 'rgba(0,0,0,0.06)',
                    backgroundColor: activeFilter === chip ? '#D4AF37' : '#FFFDF9',
                    color: activeFilter === chip ? '#FFFFFF' : '#151515',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} color="#888888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.65rem 1rem 0.65rem 2.5rem', 
                  backgroundColor: '#FFFDF9', 
                  border: '1px solid rgba(0,0,0,0.06)', 
                  borderRadius: '12px', 
                  color: '#151515', 
                  outline: 'none', 
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.005)'
                }}
              />
            </div>
          </div>

          {/* Files Grid cards */}
          {filteredFiles.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filteredFiles.map(file => (
                <div 
                  key={file.id}
                  style={{ 
                    backgroundColor: '#FFFDF9',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                    border: '1px solid rgba(0,0,0,0.015)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2D6CDF'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.015)'}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getFileIcon(file.fileType)}
                        <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {file.fileType}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#2D6CDF', backgroundColor: 'rgba(45, 108, 223, 0.06)', padding: '0.25rem 0.65rem', borderRadius: '20px', fontWeight: 600 }}>
                        {file.groupName}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#151515', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                      {file.title}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#888888' }}>Version & Size</span>
                        <span style={{ color: '#151515', fontWeight: 600 }}>{file.version} • {file.size}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#888888' }}>Last Updated</span>
                        <span style={{ color: '#151515', fontWeight: 600 }}>{file.lastUpdated}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#888888' }}>Author</span>
                        <span style={{ color: '#151515', fontWeight: 600 }}>{file.uploadedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: '1rem' }}>
                    <button 
                      onClick={() => setPreviewFile(file)}
                      style={{ 
                        flex: 1,
                        backgroundColor: 'transparent', 
                        border: '1px solid rgba(0,0,0,0.08)', 
                        color: '#2D6CDF', 
                        padding: '0.6rem 1rem', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D6CDF'; e.currentTarget.style.backgroundColor = 'rgba(45, 108, 223, 0.02)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Eye size={14} />
                      Preview
                    </button>

                    <button 
                      onClick={() => alert(`Simulated Download: ${file.fileName}`)}
                      style={{ 
                        flex: 1,
                        backgroundColor: '#D4AF37', 
                        border: 'none', 
                        color: '#FFFFFF', 
                        padding: '0.6rem 1rem', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B5942D'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#FFFDF9', 
              borderRadius: '16px', 
              padding: '3.5rem 2rem', 
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.005)',
              border: '1px solid rgba(0,0,0,0.015)',
              color: '#666666'
            }}>
              No matching files found. Check your search query or filter options.
            </div>
          )}
        </div>
      )}

      {/* Dynamic Simulated Modal Preview */}
      {previewFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(21, 21, 21, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#FFFDF9',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'scaleUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {previewFile.fileType} • Preview Model Mode
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#151515', margin: '0.25rem 0 0', fontFamily: "'Outfit', sans-serif" }}>
                  {previewFile.title}
                </h3>
              </div>
              <button 
                onClick={() => setPreviewFile(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  color: '#888888',
                  padding: '0.25rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ 
              backgroundColor: '#F8F5EF', 
              borderRadius: '16px', 
              padding: '3rem 2rem', 
              textAlign: 'center',
              border: '1px dashed rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {getFileIcon(previewFile.fileType)}
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', display: 'block' }}>{previewFile.fileName}</span>
                <span style={{ fontSize: '0.8rem', color: '#666666' }}>Secure Sandbox Preview Only ({previewFile.size})</span>
              </div>
              
              <div style={{ 
                backgroundColor: '#FFFDF9', 
                borderRadius: '8px', 
                padding: '1rem', 
                fontSize: '0.8rem', 
                color: '#666666', 
                maxWidth: '450px',
                textAlign: 'left',
                border: '1px solid rgba(0,0,0,0.03)'
              }}>
                <strong>Document Outline:</strong> This file contains the official structure details, slides framework, and guides required for teaching your assigned session successfully. Ensure to review version <strong>{previewFile.version}</strong> prior to classroom execution.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setPreviewFile(null)}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: '1px solid rgba(0,0,0,0.08)', 
                  color: '#151515', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  cursor: 'pointer' 
                }}
              >
                Close Preview
              </button>
              <button 
                onClick={() => { alert(`Simulated Download: ${previewFile.fileName}`); setPreviewFile(null); }}
                style={{ 
                  backgroundColor: '#D4AF37', 
                  border: 'none', 
                  color: '#FFFFFF', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
