import React, { useState } from 'react';
import {
  MessageSquare, Search, Send, Paperclip, CheckCheck, User, Sparkles,
  Bell, Pin, Circle, Filter, ChevronRight, X
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Messages({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for split view, active thread & message sending
  const [activeThreadId, setActiveThreadId] = useState('t1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [inputText, setInputText] = useState('');
  const [messagesMap, setMessagesMap] = useState({});

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

  // Database-driven conversation threads
  const defaultThreads = [
    {
      id: 't1',
      name: currentProgramme?.leadFacilitator || 'Sarah Ahmed',
      role: 'Lead Facilitator',
      avatar: 'S',
      online: true,
      lastMessage: "Don't forget tomorrow's live design system workshop at 10:00 AM.",
      time: '10:42 AM',
      unread: 1,
      messages: [
        { id: 'm1', sender: 'staff', text: "Hello Blessing! Welcome to the programme.", time: 'Yesterday 04:15 PM' },
        { id: 'm2', sender: 'learner', text: "Thank you Sarah! Excited to dive into Module 1.", time: 'Yesterday 04:30 PM' },
        { id: 'm3', sender: 'staff', text: "Don't forget tomorrow's live design system workshop at 10:00 AM.", time: '10:42 AM' }
      ]
    },
    {
      id: 't2',
      name: 'Programme Manager',
      role: 'Administrator',
      avatar: 'P',
      online: false,
      lastMessage: 'Your enrollment into Product Design Bootcamp has been confirmed.',
      time: 'Aug 04',
      unread: 0,
      messages: [
        { id: 'm4', sender: 'staff', text: 'Your enrollment into Product Design Bootcamp has been confirmed.', time: 'Aug 04' }
      ]
    },
    {
      id: 't3',
      name: 'OYEN AI Learning Assistant',
      role: 'AI Assistant',
      avatar: '⚡',
      online: true,
      lastMessage: 'I can summarize today\'s lesson or help with your assignment.',
      time: 'Just now',
      unread: 0,
      messages: [
        { id: 'm5', sender: 'staff', text: 'Hello! I am OYEN AI. How can I help you with your course today?', time: 'Just now' }
      ]
    }
  ];

  const threads = defaultThreads;
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const activeMessages = messagesMap[activeThread.id] || activeThread.messages || [];

  // Handle Send Message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'learner',
      text: inputText,
      time: 'Just now'
    };
    setMessagesMap(prev => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] || activeThread.messages || []), newMsg]
    }));
    setInputText('');
  };

  // Filter Threads
  const filteredThreads = threads.filter(t => {
    const matchesSearch = `${t.name} ${t.role} ${t.lastMessage}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'All' || t.role.includes(filterRole);
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── HEADER ── */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
          Communication Hub
        </h1>
        <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
          Communicate with your facilitators, programme managers, and workspace administrators.
        </p>
      </div>

      {/* ── SPLIT VIEW CONTAINER (Slack / Teams Style) ── */}
      <div style={{
        display: 'flex',
        height: '620px',
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        
        {/* ── LEFT PANEL — CONVERSATION LIST (320px) ── */}
        <div style={{
          width: '320px',
          borderRight: `1px solid ${PARTICIPANT_THEME.border}`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAF8F5'
        }}>
          {/* Search Bar */}
          <div style={{ padding: '16px', borderBottom: `1px solid ${PARTICIPANT_THEME.border}` }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} color={PARTICIPANT_THEME.muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px', overflowX: 'auto' }}>
              {['All', 'Facilitator', 'Administrator'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${filterRole === role ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                    backgroundColor: filterRole === role ? PARTICIPANT_THEME.hover : '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: filterRole === role ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Cards List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredThreads.map(t => {
              const isCurrent = t.id === activeThread.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: isCurrent ? '#FFFFFF' : 'transparent',
                    borderBottom: `1px solid ${PARTICIPANT_THEME.border}`,
                    borderLeft: isCurrent ? `4px solid ${PARTICIPANT_THEME.primaryAccent}` : '4px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: t.id === 't3' ? 'rgba(229,185,60,0.2)' : PARTICIPANT_THEME.primaryAccent,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px'
                    }}>
                      {t.avatar}
                    </div>
                    {t.online && (
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid #FFFFFF' }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: PARTICIPANT_THEME.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.name}
                      </span>
                      <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.lastMessage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL — CHAT WINDOW ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
          
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${PARTICIPANT_THEME.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: PARTICIPANT_THEME.primaryAccent,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                {activeThread.avatar}
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                  {activeThread.name}
                </div>
                <div style={{ fontSize: '11.5px', color: PARTICIPANT_THEME.muted }}>
                  {activeThread.role} • {activeThread.online ? <span style={{ color: '#10B981', fontWeight: 600 }}>Active Now</span> : 'Offline'}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#FAF8F5' }}>
            {activeMessages.map((msg) => {
              const isLearner = msg.sender === 'learner';
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isLearner ? 'flex-end' : 'flex-start',
                    maxWidth: '70%'
                  }}
                >
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: '16px',
                    borderTopRightRadius: isLearner ? '4px' : '16px',
                    borderTopLeftRadius: isLearner ? '16px' : '4px',
                    backgroundColor: isLearner ? PARTICIPANT_THEME.text : '#FFFFFF',
                    color: isLearner ? '#FFFFFF' : PARTICIPANT_THEME.text,
                    border: isLearner ? 'none' : `1px solid ${PARTICIPANT_THEME.border}`,
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '10.5px', color: PARTICIPANT_THEME.muted, marginTop: '4px', textAlign: isLearner ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${PARTICIPANT_THEME.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}>
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder={`Message ${activeThread.name}...`}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: PARTICIPANT_THEME.bg,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                borderRadius: PARTICIPANT_THEME.radius,
                fontSize: '13.5px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: PARTICIPANT_THEME.text,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
