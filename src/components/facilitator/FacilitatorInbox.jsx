import React, { useState, useMemo } from 'react';
import { 
  Search, Send, Paperclip, Image, Smile, Check, CheckCheck, 
  Circle, User, MessageSquare, Info, MoreVertical
} from 'lucide-react';

export default function FacilitatorInbox({ currentUserEmail = 'oyengroupp@gmail.com' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState('conv-admin');
  const [messageText, setMessageText] = useState('');

  // Conversations list containing workspace users
  const [conversations, setConversations] = useState([
    {
      id: 'conv-admin',
      name: 'Workspace Administrator',
      role: 'Admin',
      email: 'abcadmin@oyengrid.com',
      avatarInitials: 'WA',
      online: true,
      typing: false,
      unreadCount: 2,
      messages: [
        { id: 'm1', sender: 'abcadmin@oyengrid.com', text: 'Welcome to the ABC Energy Workspace. I have assigned you to the new Renewable Power Architecture programme.', time: '10:15 AM', date: 'Yesterday', read: true },
        { id: 'm2', sender: 'abcadmin@oyengrid.com', text: 'Please upload the updated simulation worksheet when you can.', time: '10:17 AM', date: 'Yesterday', read: true },
        { id: 'm3', sender: currentUserEmail, text: 'Understood. I am updating the battery storage modules now and will link them in the Resources tab shortly.', time: '11:00 AM', date: 'Yesterday', read: true },
        { id: 'm4', sender: 'abcadmin@oyengrid.com', text: 'Excellent, thanks! Let me know if you need help with any class setup details.', time: '2:15 PM', date: 'Yesterday', read: true },
        { id: 'm5', sender: 'abcadmin@oyengrid.com', text: 'Also, remember the session starts tomorrow at 10:00 AM sharp.', time: '2:16 PM', date: 'Yesterday', read: false },
        { id: 'm6', sender: 'abcadmin@oyengrid.com', text: 'I just uploaded the cohort participant sheets.', time: '3:05 PM', date: 'Yesterday', read: false }
      ]
    },
    {
      id: 'conv-owner',
      name: 'Programme Owner',
      role: 'Owner',
      email: 'owner@oyengrid.com',
      avatarInitials: 'PO',
      online: false,
      typing: false,
      unreadCount: 0,
      messages: [
        { id: 'o1', sender: 'owner@oyengrid.com', text: 'Hi, can you review the course outline draft for the safety workshop?', time: '09:00 AM', date: 'Yesterday', read: true },
        { id: 'o2', sender: currentUserEmail, text: 'Will review and leave comments by this evening.', time: '12:30 PM', date: 'Yesterday', read: true }
      ]
    },
    {
      id: 'conv-learner-1',
      name: 'Sarah Ahmed',
      role: 'Participant',
      email: 'sarah.ahmed@energy.com',
      avatarInitials: 'SA',
      online: true,
      typing: true,
      unreadCount: 0,
      messages: [
        { id: 'l1', sender: 'sarah.ahmed@energy.com', text: 'Hello Facilitator, I completed the Simulation Quiz submission, but did not receive the AI Notes. Is there an delay?', time: '08:45 AM', date: 'Today', read: true },
        { id: 'l2', sender: currentUserEmail, text: 'No worries Sarah, the notes are published as soon as the Admin processes them. Check the Resources hub now.', time: '08:50 AM', date: 'Today', read: true }
      ]
    },
    {
      id: 'conv-facilitator-2',
      name: 'John Doe',
      role: 'Facilitator Partner',
      email: 'john.doe@oyengrid.com',
      avatarInitials: 'JD',
      online: true,
      typing: false,
      unreadCount: 0,
      messages: [
        { id: 'f1', sender: 'john.doe@oyengrid.com', text: 'Hey! I will take care of the opening introduction slides for our lab session tomorrow.', time: '1:10 PM', date: 'Today', read: true },
        { id: 'f2', sender: currentUserEmail, text: 'Awesome, that works great. I will cover the microgrid sandbox workshop exercises.', time: '1:15 PM', date: 'Today', read: true }
      ]
    }
  ]);

  // Find selected conversation
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || conversations[0];
  }, [conversations, activeConversationId]);

  // Filter conversations list by search query
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMsg = c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchName || matchMsg;
    });
  }, [conversations, searchQuery]);

  // Mark active conversation messages as read
  const handleSelectConv = (id) => {
    setActiveConversationId(id);
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          unreadCount: 0,
          messages: c.messages.map(m => ({ ...m, read: true }))
        };
      }
      return c;
    }));
  };

  // Handle Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg = {
      id: `m-sent-${Date.now()}`,
      sender: currentUserEmail,
      text: messageText,
      time: timeStr,
      date: 'Today',
      read: true
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setMessageText('');

    // Simulate Admin auto-reply simulation to make it feel extremely interactive and alive
    if (activeConversationId === 'conv-admin') {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReply = {
          id: `m-recv-${Date.now()}`,
          sender: 'abcadmin@oyengrid.com',
          text: 'Got it. Synchronizing workspace sessions now.',
          time: replyTime,
          date: 'Today',
          read: false
        };

        setConversations(prev => prev.map(c => {
          if (c.id === 'conv-admin') {
            return {
              ...c,
              unreadCount: c.id === activeConversationId ? 0 : c.unreadCount + 1,
              messages: [...c.messages, autoReply]
            };
          }
          return c;
        }));
      }, 2500);
    }
  };

  // Group active conversation messages by Date separators
  const groupedMessages = useMemo(() => {
    const groups = {};
    activeConversation.messages.forEach(m => {
      const dateKey = m.date || 'Today';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(m);
    });
    return groups;
  }, [activeConversation]);

  return (
    <div className="animate-fade-in" style={{ 
      backgroundColor: '#F8F6F1', 
      minHeight: '100vh', 
      padding: '3.5rem 4.5rem', 
      fontFamily: "'Inter', sans-serif", 
      color: '#111111',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      
      {/* Header */}
      <div>
        <h1 style={{ 
          fontSize: '2.4rem', 
          fontWeight: 800, 
          color: '#111111', 
          margin: 0, 
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.8px'
        }}>
          Workspace Inbox
        </h1>
        <p style={{ 
          color: '#666666', 
          fontSize: '1.05rem', 
          marginTop: '0.35rem' 
        }}>
          Real-time updates, administrator channels, and facilitator communications.
        </p>
      </div>

      {/* Main Inbox Dashboard Interface Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        backgroundColor: '#FFFDF9',
        borderRadius: '24px',
        border: '1px solid #E8E2D8',
        boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
        minHeight: '620px',
        overflow: 'hidden'
      }}>
        
        {/* LEFT COLUMN: Conversation List */}
        <div style={{
          borderRight: '1px solid #E8E2D8',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFDF9'
        }}>
          
          {/* Search box header area */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #E8E2D8', position: 'relative' }}>
            <Search size={16} color="#888888" style={{ position: 'absolute', left: '2.25rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                backgroundColor: '#F8F6F1',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#111111'
              }}
            />
          </div>

          {/* List items */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredConversations.map(conv => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(214, 166, 42, 0.04)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.01)'; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Round initials avatar */}
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#111111',
                        color: '#FFFDF9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {conv.avatarInitials}
                      </div>
                      
                      {/* Online status indicator */}
                      <span style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '0px',
                        width: '11px',
                        height: '11px',
                        borderRadius: '50%',
                        backgroundColor: conv.online ? '#10B981' : '#CBD5E1',
                        border: '2px solid #FFFDF9'
                      }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111111' }}>{conv.name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#888888', fontWeight: 500 }}>{conv.role}</span>
                      </div>
                      <p style={{
                        fontSize: '0.78rem',
                        color: conv.unreadCount > 0 ? '#111111' : '#666666',
                        fontWeight: conv.unreadCount > 0 ? 700 : 400,
                        margin: '0.2rem 0 0',
                        maxWidth: '160px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {conv.typing ? <span style={{ color: '#D6A62A', fontWeight: 600 }}>typing...</span> : lastMsg ? lastMsg.text : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#888888' }}>{lastMsg ? lastMsg.time : ''}</span>
                    {conv.unreadCount > 0 && (
                      <span style={{
                        backgroundColor: '#D6A62A',
                        color: '#FFFDF9',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Active Chat Messages Display */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFDF9',
          position: 'relative'
        }}>
          
          {/* Active Chat Header */}
          <div style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #E8E2D8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#111111',
                color: '#FFFDF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {activeConversation.avatarInitials}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>{activeConversation.name}</h4>
                <span style={{ fontSize: '0.75rem', color: activeConversation.online ? '#10B981' : '#666666', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeConversation.online ? '#10B981' : '#666666' }} />
                  {activeConversation.online ? 'Online' : 'Offline'}
                  {activeConversation.typing && <span style={{ marginLeft: '0.5rem', color: '#D6A62A', fontStyle: 'italic' }}>typing...</span>}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', color: '#888888' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888' }}>
                <Info size={18} />
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888' }}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages Log Feed */}
          <div style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {Object.keys(groupedMessages).map(dateGroup => (
              <div key={dateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Date Separator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#888888',
                    textTransform: 'uppercase',
                    backgroundColor: '#F8F6F1',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    border: '1px solid #E8E2D8'
                  }}>
                    {dateGroup}
                  </span>
                </div>

                {groupedMessages[dateGroup].map(msg => {
                  const isSentByMe = msg.sender === currentUserEmail;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        backgroundColor: isSentByMe ? '#111111' : '#F8F6F1',
                        color: isSentByMe ? '#FFFDF9' : '#111111',
                        padding: '0.9rem 1.25rem',
                        borderRadius: '16px',
                        borderTopRightRadius: isSentByMe ? '4px' : '16px',
                        borderTopLeftRadius: isSentByMe ? '16px' : '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                        position: 'relative'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.4', wordBreak: 'break-word' }}>
                          {msg.text}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          justifyContent: 'flex-end',
                          marginTop: '0.35rem',
                          fontSize: '0.68rem',
                          color: isSentByMe ? 'rgba(255,255,255,0.6)' : '#888888'
                        }}>
                          <span>{msg.time}</span>
                          {isSentByMe && (
                            msg.read ? <CheckCheck size={12} color="#D6A62A" /> : <Check size={12} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Active Chat Footer Input form */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #E8E2D8',
              backgroundColor: '#FFFDF9',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', color: '#888888' }}>
              <button type="button" onClick={() => alert('Attachments limit simulation: select file')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888' }}>
                <Paperclip size={18} />
              </button>
              <button type="button" onClick={() => alert('Image picker simulation')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888' }}>
                <Image size={18} />
              </button>
              <button type="button" onClick={() => setMessageText(prev => prev + ' 😊')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888' }}>
                <Smile size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder={`Message ${activeConversation.name}...`}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                backgroundColor: '#F8F6F1',
                fontSize: '0.88rem',
                outline: 'none',
                color: '#111111'
              }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: '#D6A62A',
                border: 'none',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(214, 166, 42, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B58C1F'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D6A62A'}
            >
              <Send size={16} />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
