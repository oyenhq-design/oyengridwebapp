import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, CheckCircle2, Play, CircleDot, Video, Users, FileText, ExternalLink, Calendar, Clock } from 'lucide-react';

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

  // Updates state
  const [updateType, setUpdateType] = useState('Reminder');
  const [updateMessage, setUpdateMessage] = useState('');
  const [recentUpdates, setRecentUpdates] = useState([
    { id: 1, text: 'Reminder sent', time: '10:30 AM' },
    { id: 2, text: 'Slides shared', time: 'Yesterday' }
  ]);

  const handleSendUpdate = () => {
    if (!updateMessage.trim() && updateType !== 'Resource') return;
    const newUpdate = {
      id: Date.now(),
      text: updateType === 'Resource' ? 'Resource shared' : `${updateType} sent`,
      time: 'Just now'
    };
    setRecentUpdates([newUpdate, ...recentUpdates]);
    addNotification?.(`Session update sent to ${session.title}`);
    setUpdateMessage('');
  };

  // Calculate actual countdown timer based on session date and time
  useEffect(() => {
    let interval = null;
    if (statusState === 'Scheduled' || statusState === 'Ready to Start') {
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

  // Format time (MM:SS or HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCountdownText = () => {
    if (statusState === 'Live') return 'Live Now';
    if (statusState === 'Completed') return 'Completed';
    if (statusState === 'Processing') return 'Processing';

    if (timeLeft <= 0) return 'Ready to Start';

    const diffMins = Math.floor(timeLeft / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) return `Starts Tomorrow at ${session.time}`;
    if (diffDays > 1) return `Starts in ${diffDays} days`;
    if (diffHours >= 1) return `Starts in ${diffHours} hours`;
    return `Starts in ${diffMins} minutes`;
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

  const getLearnerStatus = () => {
    if (statusState === 'Live') return 'Joined';
    if (statusState === 'Completed' || statusState === 'Processing') return 'Attended';
    return 'Registered';
  };
  const learnerStatusText = getLearnerStatus();

  // Determine Learning Objectives
  let learningObjectives = [];
  if (session.objectives && session.objectives.length > 0) {
    learningObjectives = session.objectives;
  } else if (session.programObjectives && session.programObjectives.length > 0) {
    learningObjectives = session.programObjectives;
  }

  const hasResources = programResources.length > 0 || sessionResources.length > 0;
  const isScheduled = !!(session.date && session.time);
  const hasLearners = learners.length > 0;

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

      {/* 1. Hero Section */}
      <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', backgroundColor: currentStatusLabel().bg, color: currentStatusLabel().color, padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {statusState === 'Live' && <CircleDot size={10} className="animate-pulse" />} 
              {currentStatusLabel().text}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{session.programName || 'Unknown Program'}</span>
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0', fontFamily: "'Outfit', sans-serif" }}>
            {session.title || 'Untitled Session'}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            {session.date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> {session.date}
              </span>
            )}
            {session.time && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> {session.time}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5D76E' }}>
            {getCountdownText()}
          </div>
          
          {(statusState === 'Scheduled' || statusState === 'Ready to Start') && (
            <button 
              onClick={startLiveSession}
              style={{ padding: '0.8rem 2rem', backgroundColor: '#F5D76E', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(245,215,110,0.15)' }}
            >
              <Play size={16} fill="#000" /> Start Session
            </button>
          )}

          {statusState === 'Live' && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => alert('Launching OYEN Live external view...')}
                style={{ padding: '0.8rem 1.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Open OYEN Live <ExternalLink size={14} />
              </button>
              <button 
                onClick={endLiveSession}
                style={{ padding: '0.8rem 2rem', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                End Session
              </button>
            </div>
          )}

          {statusState === 'Completed' && (
            <button 
              onClick={onBack}
              style={{ padding: '0.8rem 2rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Brief & Preparation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 2. Teaching Brief */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Teaching Brief
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.25rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expected Learners</strong>
                {learners.length} Learners
              </div>
              {session.duration && (
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Duration</strong>
                  {session.duration}
                </div>
              )}
              {session.deliveryMode && (
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Delivery Mode</strong>
                  {session.deliveryMode}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
              <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Learning Objectives</strong>
              {learningObjectives && learningObjectives.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  No learning objectives have been defined for this session.
                </div>
              )}
            </div>
          </div>

          {/* 3. Session Preparation (Data-Driven) */}
          {(statusState === 'Scheduled' || statusState === 'Ready to Start') && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Session Preparation
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Learners Enrolled', done: hasLearners },
                  { label: 'Resources Uploaded', done: hasResources },
                  { label: 'Session Scheduled', done: isScheduled }
                ].map(item => (
                  <div 
                    key={item.label} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.65rem 0.85rem', 
                      backgroundColor: item.done ? 'rgba(34,197,94,0.03)' : 'rgba(255,255,255,0.01)', 
                      border: '1px solid', 
                      borderColor: item.done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', 
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: item.done ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid', borderColor: item.done ? '#22c55e' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: item.done ? '#22c55e' : 'transparent' }}>
                      {item.done && <Check size={12} color="#fff" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Statistics / Processing States */}
          {statusState === 'Live' && (
            <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  Live Session
                </h3>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{formatTime(liveTimer)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Learners Present</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.3rem' }}>{learners.length} / {learners.length}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Connection</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22c55e', marginTop: '0.3rem' }}>Stable</div>
                </div>
              </div>
            </div>
          )}

          {statusState === 'Processing' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
               <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                 Session Ended
               </h3>
               <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0 }}>
                 Please hold while OYEN GRID completes background session operations.
               </p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {[
                   { label: 'Recording Saved', status: 'done' },
                   { label: 'Attendance Capture', status: 'done' },
                   { label: 'Session Data Syncing', status: 'done' },
                   { label: 'AI Summary Generation', status: 'processing' }
                 ].map(step => (
                   <div key={step.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fff', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                     <span>{step.label}</span>
                     <span style={{ color: step.status === 'done' ? '#22c55e' : '#3b82f6', fontWeight: 700, fontSize: '0.8rem' }}>
                       {step.status === 'done' ? '✓ Ready' : 'Processing...'}
                     </span>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {statusState === 'Completed' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'rgba(34,197,94,0.02)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px', padding: '2rem', textAlign: 'center', alignItems: 'center' }}>
               <CheckCircle2 size={42} color="#22c55e" />
               <div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                   Session Completed
                 </h3>
                 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                   All post-session activities completed successfully.
                 </p>
               </div>
             </div>
          )}

        </div>

        {/* Right Side: Updates, Learners & Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Session Updates (New Lightweight Communication) */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Session Updates
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Compose Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                  {['Reminder', 'Resource', 'Schedule Change'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="updateType" 
                        checked={updateType === type} 
                        onChange={() => setUpdateType(type)} 
                        style={{ accentColor: '#C99A2E', cursor: 'pointer' }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
                
                {updateType === 'Resource' ? (
                  <select style={{ padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}>
                    <option>Select shared file...</option>
                    {(programResources || []).concat(sessionResources || []).map(r => (
                      <option key={r.id || r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    placeholder={updateType === 'Reminder' ? '"Session starts in 30 minutes."' : '"The session has been moved to 2 PM."'}
                    value={updateMessage}
                    onChange={e => setUpdateMessage(e.target.value)}
                    style={{ padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                  />
                )}
                
                <button 
                  onClick={handleSendUpdate}
                  style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem', backgroundColor: '#C99A2E', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {updateType === 'Resource' ? 'Share' : 'Send'}
                </button>
              </div>

              {/* Recent Updates */}
              {recentUpdates.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Recent Updates</div>
                  {recentUpdates.map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fff' }}>
                      <Check size={14} color="#C99A2E" />
                      <span>{u.text}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginLeft: 'auto' }}>{u.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. Enrolled Learners */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Learners ({learners.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {!hasLearners ? (
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                  No learners are enrolled in this session.
                </div>
              ) : (
                learners.map(learner => (
                  <div key={learner.email || learner.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{learner.name || `${learner.firstName} ${learner.lastName}`}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{learner.email}</div>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        color: statusState === 'Live' ? '#22c55e' : 'rgba(255,255,255,0.4)',
                        backgroundColor: statusState === 'Live' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px'
                      }}
                    >
                      {learnerStatusText}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. Learning Resources */}
          <div style={{ backgroundColor: '#0e0f14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              Resources
            </h3>

            {!hasResources ? (
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', padding: '1.5rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                No resources have been shared for this session yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {programResources.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#F5D76E', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Program Resources ({programResources.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.6rem' }}>
                      {programResources.map(file => (
                        <div key={file.id || file.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: '#fff' }}>{file.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sessionResources.length > 0 && (
                  <div style={{ borderTop: programResources.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingTop: programResources.length > 0 ? '1rem' : 0 }}>
                    <span style={{ fontSize: '0.7rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Session Resources ({sessionResources.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.6rem' }}>
                      {sessionResources.map(file => (
                        <div key={file.id || file.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: '#fff' }}>{file.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
