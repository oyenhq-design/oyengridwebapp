import React, { useState } from 'react';
import {
  Sparkles, Send, Paperclip, Bot, User, BookOpen, HelpCircle, FileText,
  CheckCircle2, Plus, Search, Trash2, ArrowRight, Layers, Zap, Clock, ShieldCheck
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function AI({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for chat history, active thread, input text & processing
  const [activeChatId, setActiveChatId] = useState('c1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMap, setChatMap] = useState({});

  // 1. Authenticated Participant & Enrolled Programme from database
  const participant = wsLearners.find(l => l.email && l.email.toLowerCase() === userEmail) || {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  const displayName = participant.name || userEmail.split('@')[0] || 'Learner';

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Programme contextual models for grounding AI responses
  const progName = currentProgramme?.name || currentProgramme?.title || 'Product Design Bootcamp';
  const modules = currentProgramme?.modules || currentProgramme?.curriculum || [];
  const currentModule = modules.find(m => m.status === 'Active' || m.status === 'In Progress') || modules[0] || { title: 'Module 1: Foundations' };
  const leadFacilitator = currentProgramme?.leadFacilitator || currentProgramme?.instructor || 'Sarah Ahmed';

  // Initial threads loaded with real workspace context
  const defaultChats = [
    {
      id: 'c1',
      title: `Understanding ${currentModule.title || 'Design Systems'}`,
      timestamp: 'Today',
      messages: [
        {
          id: 'm1',
          sender: 'ai',
          text: `Hello ${displayName}! I am your context-aware **OYEN AI Assistant** for **${progName}**.\n\nI have loaded your enrolled programme details, active module (**${currentModule.title || 'Foundations'}**), assignments, and facilitator materials. How can I support your study today?`,
          reference: `Source: ${progName} • ${currentModule.title || 'Core Module'}`
        }
      ]
    },
    {
      id: 'c2',
      title: 'Assignment 1 Review & Prompts',
      timestamp: 'Yesterday',
      messages: [
        {
          id: 'm2',
          sender: 'ai',
          text: 'I can help review your assignment solution against the grading rubric, generate study flashcards, or explain tricky concepts. What would you like to focus on?',
          reference: `Source: Assignment 1 Rubric • Facilitator: ${leadFacilitator}`
        }
      ]
    }
  ];

  const currentChats = defaultChats;
  const activeChat = currentChats.find(c => c.id === activeChatId) || currentChats[0];
  const activeMessages = chatMap[activeChat.id] || activeChat.messages || [];

  // Generate Context-Aware AI Answer
  const handleSendMessage = (customPrompt) => {
    const promptToUse = customPrompt || inputText;
    if (!promptToUse.trim() || isTyping) return;

    const userMsg = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text: promptToUse
    };

    const existingMsgs = chatMap[activeChat.id] || activeChat.messages || [];
    const updatedWithUser = [...existingMsgs, userMsg];
    
    setChatMap(prev => ({ ...prev, [activeChat.id]: updatedWithUser }));
    if (!customPrompt) setInputText('');
    setIsTyping(true);

    // Simulate real-time context-grounded AI streaming response
    setTimeout(() => {
      let aiReplyText = '';
      const query = promptToUse.toLowerCase();

      if (query.includes('summarize') || query.includes('lesson') || query.includes('module')) {
        aiReplyText = `### Summary of ${currentModule.title || 'Current Module'}\n\nThis module covers structural building blocks, design system tokens, typography scales, and component state trees under the guidance of **${leadFacilitator}**.\n\n**Key Takeaways:**\n- Design tokens convert design variables into scalable code assets.\n- Always maintain readable typography ratios.\n- Keep component state localized where possible.`;
      } else if (query.includes('assignment') || query.includes('help')) {
        aiReplyText = `### Assignment Guidance for ${progName}\n\nBased on your active assignment requirements:\n1. Ensure your token JSON file uses standard HSL values.\n2. Verify button and input component states (hover, active, disabled).\n3. Double-check submission rubrics before submitting your ZIP/GitHub link.`;
      } else if (query.includes('quiz') || query.includes('test') || query.includes('practice')) {
        aiReplyText = `### Practice Quiz Questions for ${currentModule.title || 'Module 1'}\n\n**Q1:** What is the primary purpose of a design system token?\n*Answer Options:* A) Store reusable brand variables, B) Render database schemas, C) Compile WebAssembly.\n\n*Correct Answer:* **A** — Design tokens store atomic visual properties.`;
      } else {
        aiReplyText = `Thank you for your question regarding **${progName}**.\n\nI have cross-referenced your query with the materials provided for **${currentModule.title || 'Module 1'}** by **${leadFacilitator}**. Please let me know if you would like me to generate a personalized study plan or explain any specific concept in greater depth.`;
      }

      const aiMsg = {
        id: `m_ai_${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        reference: `Source: ${progName} • ${currentModule.title || 'Core Module'} • Grounded in Workspace DB`
      };

      setChatMap(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), aiMsg]
      }));
      setIsTyping(false);
    }, 900);
  };

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── HEADER ── */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
          OYEN AI Learning Assistant
        </h1>
        <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
          Your personal learning companion for <strong>{progName}</strong>. Grounded 100% in your enrolled modules, assignments, and course materials.
        </p>
      </div>

      {/* ── TWO-COLUMN CHAT WORKSPACE (ChatGPT / Copilot Style) ── */}
      <div style={{
        display: 'flex',
        height: '640px',
        backgroundColor: PARTICIPANT_THEME.cardBg,
        border: `1px solid ${PARTICIPANT_THEME.border}`,
        borderRadius: PARTICIPANT_THEME.radius,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        
        {/* ── LEFT PANEL — HISTORY & QUICK PROMPTS (280px) ── */}
        <div style={{
          width: '280px',
          borderRight: `1px solid ${PARTICIPANT_THEME.border}`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAF8F5',
          padding: '16px'
        }}>
          {/* New Chat Button */}
          <button
            onClick={() => alert('New OYEN AI learning session started.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              backgroundColor: PARTICIPANT_THEME.text,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <Plus size={16} />
            <span>New AI Session</span>
          </button>

          {/* Quick Action Prompts */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Programme Quick Prompts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {[
              'Summarize current module',
              'Help with active assignment',
              'Generate practice quiz',
              'Explain difficult topics',
              'Create daily study plan'
            ].map((pText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(pText)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: PARTICIPANT_THEME.text,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={12} color={PARTICIPANT_THEME.primaryAccent} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pText}</span>
              </button>
            ))}
          </div>

          {/* History */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Recent Sessions
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {currentChats.map(c => {
              const isCurrent = c.id === activeChat.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: isCurrent ? '#FFFFFF' : 'transparent',
                    border: `1px solid ${isCurrent ? PARTICIPANT_THEME.primaryAccent : 'transparent'}`,
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: isCurrent ? 700 : 500,
                    color: PARTICIPANT_THEME.text,
                    cursor: 'pointer',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  💬 {c.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL — CONTEXT-AWARE CHAT INTERFACE ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
          
          {/* Active Header */}
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${PARTICIPANT_THEME.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229,185,60,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PARTICIPANT_THEME.primaryAccent
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                  {activeChat.title}
                </div>
                <div style={{ fontSize: '11.5px', color: PARTICIPANT_THEME.muted }}>
                  Context: <strong>{progName}</strong> • {currentModule.title || 'Module 1'}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#FAF8F5' }}>
            {activeMessages.map(msg => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isAi ? 'flex-start' : 'flex-end',
                    maxWidth: '80%'
                  }}
                >
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    borderTopLeftRadius: isAi ? '4px' : '16px',
                    borderTopRightRadius: isAi ? '16px' : '4px',
                    backgroundColor: isAi ? '#FFFFFF' : PARTICIPANT_THEME.text,
                    color: isAi ? PARTICIPANT_THEME.text : '#FFFFFF',
                    border: isAi ? `1px solid ${PARTICIPANT_THEME.border}` : 'none',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    {msg.text}

                    {msg.reference && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: `1px solid ${PARTICIPANT_THEME.border}`, fontSize: '11px', color: PARTICIPANT_THEME.primaryAccent, fontWeight: 700 }}>
                        📌 {msg.reference}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', fontSize: '12px', color: PARTICIPANT_THEME.muted, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color={PARTICIPANT_THEME.primaryAccent} />
                <span>OYEN AI is reading workspace context and formatting answer...</span>
              </div>
            )}
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
              placeholder={`Ask OYEN AI anything about ${progName}...`}
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
              onClick={() => handleSendMessage()}
              disabled={isTyping}
              style={{
                backgroundColor: PARTICIPANT_THEME.text,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: isTyping ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={15} />
              <span>Ask AI</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
