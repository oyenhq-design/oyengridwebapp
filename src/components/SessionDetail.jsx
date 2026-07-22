import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, CheckCircle2, Play, CircleDot, Video, Users, FileText, Download, Eye, ExternalLink } from 'lucide-react';

export default function SessionDetail({ 
  session, 
  onBack, 
  addNotification, 
  onUpdateStatus, 
  learners = [], 
  programResources = [], 
  sessionResources = [] 
}) {
  const statusState = session.status || 'Scheduled';
  const [timeLeft, setTimeLeft] = useState(0);
  const [liveTimer, setLiveTimer] = useState(0);

  // Live checklist items
  const [checklist, setChecklist] = useState({
    slides: true,
    resources: true,
    internet: true,
    camera: false,
    mic: false,
    learners: true
  });

  // Calculate actual countdown timer based on session date and time
  useEffect(() => {
    let interval = null;
    if (statusState === 'Scheduled') {
      const updateTimeLeft = () => {
        if (!session.date || !session.time) return;
        let dStr = session.date;
        const today = new Date();
        if (dStr.toLowerCase() === 'today') {
          dStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        } else if (dStr.toLowerCase() === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          dStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
        }
        
        const targetDate = new Date(`${dStr} ${session.time}`);
        if (isNaN(targetDate.getTime())) return;
        
        const now = new Date();
        const diffSecs = Math.floor((targetDate - now) / 1000);
        
        if (diffSecs <= 0) {
          setTimeLeft(0);
          // If all checklist items are ticked, we might want to automatically prompt Ready to Start, 
          // but we won't mutate state here automatically unless we trigger the parent.
        } else {
          setTimeLeft(diffSecs);
        }
      };
      
      updateTimeLeft();
      interval = setInterval(updateTimeLeft, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [statusState, session.date, session.time]);

  // Timer for Live state
  useEffect(() => {
    let interval = null;
    if (statusState === 'Live') {
      interval = setInterval(() => {
        setLiveTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [statusState]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCheck = (key) => {
    if (statusState !== 'Scheduled' && statusState !== 'Ready to Start') return;
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);

    // If all items checked, move to "Ready to Start" immutably via parent
    const allChecked = Object.values(updated).every(val => val === true);
    if (allChecked && statusState === 'Scheduled') {
      onUpdateStatus('Ready to Start');
    } else if (!allChecked && statusState === 'Ready to Start') {
      onUpdateStatus('Scheduled');
    }
  };

  const startLiveSession = () => {
    onUpdateStatus('Live');
    addNotification('OYEN Live session started.');
  };

  const endLiveSession = () => {
    onUpdateStatus('Processing');
    addNotification('Ending OYEN Live session. Processing attendance and metadata.');
    
    setTimeout(() => {
      onUpdateStatus('Completed');
      addNotification('Session completed and processed successfully.');
    }, 4000);
  };

  const currentStatusLabel = () => {
    switch (statusState) {
      case 'Scheduled': return { text: 'Scheduled', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
      case 'Ready to Start': return { text: 'Ready to Start', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' };
      case 'Live': return { text: 'Live', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
      case 'Processing': return { text: 'Processing', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
      case 'Completed': return { text: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' };
      default: return { text: statusState, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    }
  };

  // Determine Learning Objectives
  let learningObjectives = [];
  if (session.objectives && session.objectives.length > 0) {
    learningObjectives = session.objectives;
  } else if (session.programObjectives && session.programObjectives.length > 0) {
    // Note: The prop for program objectives might not be passed directly, 
    // assuming it might be in session object if mapped, or empty.
    learningObjectives = session.programObjectives;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      {/* Back link */}
      <div>
        <span 
          onClick={onBack} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F5D76E', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content' }}
        >
          <ChevronLeft size={16} /> Back to Sessions
        </span>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Brief & Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header & Status Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                {session.title || 'Untitled Session'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                {session.programName || 'Unknown Program'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '8px', backgroundColor: currentStatusLabel().bg, color: currentStatusLabel().color, fontSize: '0.78rem', fontWeight: 700 }}>
              <CircleDot size={12} className={statusState === 'Live' ? 'animate-pulse' : ''} /> {currentStatusLabel().text}
            </div>
          </div>

          {/* Dynamic teaching workspace content based on state */}
          {statusState === 'Scheduled' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Teaching Brief
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Program</strong>
                  {session.programName || 'N/A'}
                </div>
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Session Topic</strong>
                  {session.title || 'N/A'}
                </div>
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expected Learners</strong>
                  {learners.length} Learners
                </div>
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Duration</strong>
                  {session.duration || 'N/A'}
                </div>
              </div>

              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Learning Objectives</strong>
                {learningObjectives && learningObjectives.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                  </ul>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    No learning objectives available.
                  </span>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  {timeLeft > 0 ? (
                    <>Session starts in <strong style={{ color: '#F5D76E' }}>{formatTime(timeLeft)}</strong></>
                  ) : (
                    <strong style={{ color: '#F5D76E' }}>Ready to Start</strong>
                  )}
                </div>
              </div>
            </div>
          )}

          {statusState === 'Ready to Start' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(34,197,94,0.02)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '14px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Teaching Brief
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
                Everything is configured and all checklist items have been cleared. You are ready to start.
              </p>
              
              <button 
                onClick={startLiveSession}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: '#22c55e', border: 'none', color: '#fff', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Play size={16} fill="#fff" /> Start Session Now
              </button>
            </div>
          )}

          {statusState === 'Live' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  Session Live
                </h3>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{formatTime(liveTimer)}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Learners Joined', val: `${learners.length} / ${learners.length}`, icon: '👥' }, // Simplified since no mock status
                  { label: 'Camera Status', val: checklist.camera ? 'Active' : 'Muted', icon: '📹' },
                  { label: 'Mic Status', val: checklist.mic ? 'Active' : 'Muted', icon: '🎙️' },
                  { label: 'Connection', val: 'Excellent', icon: '📶' }
                ].map(item => (
                  <div key={item.label} style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>{item.icon}</span> {item.val}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => alert('Launching OYEN Live external view...')}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  Open OYEN Live <ExternalLink size={14} />
                </button>
                <button 
                  onClick={endLiveSession}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  End Session
                </button>
              </div>
            </div>
          )}

          {statusState === 'Processing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Session Ended
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: 0 }}>
                Please hold while OYEN GRID completes background session operations.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Recording Saved', status: 'done' },
                  { label: 'Attendance Capture', status: 'done' },
                  { label: 'Session Data Syncing', status: 'done' },
                  { label: 'AI Summary Generation', status: 'processing' }
                ].map(step => (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#fff' }}>
                    <span>{step.label}</span>
                    <span style={{ color: step.status === 'done' ? '#22c55e' : '#3b82f6', fontWeight: 700 }}>
                      {step.status === 'done' ? '✓ Ready' : 'Processing...'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {statusState === 'Completed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'rgba(34,197,94,0.02)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center', alignItems: 'center' }}>
              <CheckCircle2 size={42} color="#22c55e" />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  ✓ Session Completed
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                  All post-session activities completed successfully.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', width: '100%', maxWidth: '300px', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span>Recording Status</span> <strong style={{ color: '#22c55e' }}>✓ Ready</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span>Attendance Captured</span> <strong style={{ color: '#22c55e' }}>✓ Captured</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span>AI Summary</span> <strong style={{ color: '#22c55e' }}>✓ Ready</strong>
                </div>
              </div>

              <button 
                onClick={onBack}
                style={{ padding: '0.65rem 1.5rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {/* Session Information Table */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Session Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.45rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Program Name</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{session.programName || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.45rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Session Topic</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{session.title || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.45rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Date</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{session.date || 'TBD'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.45rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Time</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{session.time || 'TBD'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Duration</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{session.duration || 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Checklist, Split Resources, and Learners */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Pre-session Checklist */}
          {(statusState === 'Scheduled' || statusState === 'Ready to Start') && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Pre-session Checklist
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'slides', label: 'Slides Available' },
                  { key: 'resources', label: 'Resources Ready' },
                  { key: 'internet', label: 'Internet Connected' },
                  { key: 'camera', label: 'Camera Detected' },
                  { key: 'mic', label: 'Microphone Working' },
                  { key: 'learners', label: `${learners.length} Learners Enrolled` }
                ].map(item => (
                  <div 
                    key={item.key} 
                    onClick={() => handleToggleCheck(item.key)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.55rem 0.75rem', 
                      backgroundColor: checklist[item.key] ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.01)', 
                      border: '1px solid', 
                      borderColor: checklist[item.key] ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)', 
                      borderRadius: '8px', 
                      cursor: 'pointer' 
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: checklist[item.key] ? '#fff' : 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid', borderColor: checklist[item.key] ? '#22c55e' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: checklist[item.key] ? '#22c55e' : 'transparent' }}>
                      {checklist[item.key] && <Check size={12} color="#fff" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Resources (Program vs Session split) */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Learning Resources
            </h3>

            {/* Program Resources */}
            <div>
              <span style={{ fontSize: '0.68rem', color: '#F5D76E', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Program Resources
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.45rem' }}>
                {programResources.length === 0 ? (
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    No program resources available.
                  </span>
                ) : (
                  programResources.map(file => (
                    <div key={file.id || file.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={14} color="rgba(255,255,255,0.4)" />
                        <span style={{ color: '#fff' }}>{file.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <span onClick={() => alert(`Downloading ${file.name}...`)} style={{ color: '#F5D76E', cursor: 'pointer', fontSize: '0.72rem' }}>Download</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Session Resources */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Session Resources
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.45rem' }}>
                {sessionResources.length === 0 ? (
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    No session resources available.
                  </span>
                ) : (
                  sessionResources.map(file => (
                    <div key={file.id || file.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={14} color="rgba(255,255,255,0.4)" />
                        <span style={{ color: '#fff' }}>{file.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <span onClick={() => alert(`Downloading ${file.name}...`)} style={{ color: '#F5D76E', cursor: 'pointer', fontSize: '0.72rem' }}>Download</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Enrolled Learners */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Enrolled Learners ({learners.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {learners.length === 0 ? (
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  No learners enrolled.
                </span>
              ) : (
                learners.map(learner => (
                  <div key={learner.email || learner.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{learner.name || `${learner.firstName} ${learner.lastName}`}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: '0.1rem' }}>{learner.email}</div>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.68rem', 
                        fontWeight: 700, 
                        color: statusState === 'Live' ? '#22c55e' : 'rgba(255,255,255,0.3)',
                        backgroundColor: statusState === 'Live' ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      {statusState === 'Live' ? 'Joined' : 'Waiting'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
