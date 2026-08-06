import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search, X, MessageCircle, Send, Paperclip, Smile, Reply, Edit2, Trash2,
  Calendar, FileText, BookOpen, Award, ClipboardCheck, Check, CheckCheck,
  Sparkles, Pin, Star, Forward, Copy, Info, Paperclip as FileIcon, AlertCircle
} from "lucide-react";

export default function GlobalChat({
  userRole,
  user,
  ownerEmail,
  isChatOpen,
  openChat,
  closeChat,
  visibleConversations = [],
  filteredConversations = [],
  activeConversationId,
  setActiveConversationId,
  activeConversation,
  activePeer,
  chatSearch,
  setChatSearch,
  messageInput,
  setMessageInput,
  sendMessage,
  openConversation,
}) {
  const eligibleRoles = [
    "Facilitator",
    "Workspace Super Admin",
    "Admin",
    "Program Manager",
    "Programme Manager",
    "ProgramManager",
  ];

  if (!eligibleRoles.includes(userRole)) return null;

  const selfId = (userRole === "Facilitator" || userRole === "Program Manager" || userRole === "Programme Manager" || userRole === "ProgramManager") ? user : (ownerEmail || "admin@oyengrid.com");

  // Local state controls for enterprise-grade workspace redesign
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [selectedEmojiPickerMsgId, setSelectedEmojiPickerMsgId] = useState(null);
  
  // AI assistant drawer overlay inside chat
  const [showAiSummaryPanel, setShowAiSummaryPanel] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'pinned' | 'attachments'

  // Draft Messages persistence
  const [activeDrafts, setActiveDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem("oyen_chat_drafts_v2");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("oyen_chat_drafts_v2", JSON.stringify(activeDrafts));
  }, [activeDrafts]);

  // Keyboard shortcut listener (Ctrl+K to search contacts, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-chat-search-input");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeChat]);

  // Draft load
  useEffect(() => {
    if (activeConversationId) {
      setMessageInput(activeDrafts[activeConversationId] || "");
    }
  }, [activeConversationId]);

  const handleInputChange = (text) => {
    setMessageInput(text);
    if (activeConversationId) {
      setActiveDrafts(prev => ({ ...prev, [activeConversationId]: text }));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Attach reply meta to the message before sending if replying
    let finalInput = messageInput;
    if (replyingToMessage) {
      finalInput = `[Replying to: "${replyingToMessage.text}"] ${messageInput}`;
      setReplyingToMessage(null);
    }

    // Set messageInput parent state to dispatch
    setMessageInput(finalInput);
    
    // Clear drafts
    if (activeConversationId) {
      setActiveDrafts(prev => {
        const next = { ...prev };
        delete next[activeConversationId];
        return next;
      });
    }

    setTimeout(() => {
      sendMessage(e);
    }, 50);
  };

  // Reactions count compiler helper
  const handleEmojiReact = (msgId, emoji) => {
    if (!activeConversation) return;
    const conversations = JSON.parse(localStorage.getItem("oyen_conversations") || "[]");
    const updated = conversations.map(c => {
      if (c.conversationId === activeConversation.conversationId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.messageId === msgId) {
              const reactions = m.reactions || [];
              const exists = reactions.some(r => r.emoji === emoji && r.userId === selfId);
              let nextReactions = [];
              if (exists) {
                nextReactions = reactions.filter(r => !(r.emoji === emoji && r.userId === selfId));
              } else {
                nextReactions = [...reactions, { emoji, userId: selfId }];
              }
              return { ...m, reactions: nextReactions };
            }
            return m;
          })
        };
      }
      return c;
    });
    localStorage.setItem("oyen_conversations", JSON.stringify(updated));
    setSelectedEmojiPickerMsgId(null);
    window.dispatchEvent(new Event("storage"));
  };

  // Edit Message submit
  const handleStartEdit = (msg) => {
    const ageMs = Date.now() - msg.createdAt;
    if (ageMs > 30000) {
      alert("Messages can only be edited within 30 seconds.");
      return;
    }
    setEditingMessageId(msg.messageId);
    setEditText(msg.text);
  };

  const submitEdit = (msgId) => {
    if (!editText.trim()) return;
    const conversations = JSON.parse(localStorage.getItem("oyen_conversations") || "[]");
    const updated = conversations.map(c => {
      if (c.conversationId === activeConversation.conversationId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.messageId === msgId) {
              return { ...m, text: editText, isEdited: true };
            }
            return m;
          })
        };
      }
      return c;
    });
    localStorage.setItem("oyen_conversations", JSON.stringify(updated));
    setEditingMessageId(null);
    setEditText("");
    window.dispatchEvent(new Event("storage"));
  };

  // Deletion logic (within 5 minutes)
  const handleDeleteMessage = (msg) => {
    const ageMs = Date.now() - msg.createdAt;
    const forEveryone = ageMs <= 300000;

    const conversations = JSON.parse(localStorage.getItem("oyen_conversations") || "[]");
    const updated = conversations.map(c => {
      if (c.conversationId === activeConversation.conversationId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.messageId === msg.messageId) {
              if (forEveryone) {
                return { ...m, text: "This message was deleted.", isDeleted: true };
              } else {
                return { ...m, hiddenFor: [...(m.hiddenFor || []), selfId] };
              }
            }
            return m;
          })
        };
      }
      return c;
    });
    localStorage.setItem("oyen_conversations", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  // Filter messages dynamically based on local filters
  const filteredMessages = useMemo(() => {
    if (!activeConversation) return [];
    let list = activeConversation.messages.filter(m => !(m.hiddenFor || []).includes(selfId));

    if (localSearchQuery.trim()) {
      const q = localSearchQuery.toLowerCase();
      list = list.filter(m => m.text.toLowerCase().includes(q));
    }
    if (activeFilter === "pinned") {
      list = list.filter(m => m.isPinned);
    } else if (activeFilter === "attachments") {
      list = list.filter(m => m.messageType === "file" || m.messageType === "resource");
    }

    return list;
  }, [activeConversation, localSearchQuery, activeFilter]);

  // AI Assistant Summary compiler
  const aiInsights = useMemo(() => {
    if (!activeConversation || activeConversation.messages.length === 0) return null;
    const texts = activeConversation.messages.map(m => m.text).join(" ");
    
    const summary = texts.includes("slides") || texts.includes("Slides")
      ? "Team discussed week slides upload. Uploader has not finalized the resource visibility state yet."
      : "No critical topics logged yet. Chat is currently in direct configuration.";

    const actionItems = [];
    if (texts.includes("slides") || texts.includes("Slides")) {
      actionItems.push("Upload Week 4 slides to the resources folder.");
    }
    actionItems.push("Align timezone difference parameters with team.");

    return { summary, actionItems };
  }, [activeConversation]);

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={openChat}
        title="Workspace Chat (Ctrl+K)"
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "58px", height: "58px", borderRadius: "50%",
          backgroundColor: "#111111", border: "1px solid #EBE5D9", color: "#FFFFFF",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          zIndex: 1000, transition: "all 0.2s ease"
        }}
      >
        <MessageCircle size={22} color="#F4C542" />
        {!isChatOpen && totalUnread > 0 && (
          <span style={{
            position: "absolute", top: "-2px", right: "-2px",
            width: "18px", height: "18px", borderRadius: "50%",
            backgroundColor: "#EF4444", color: "#FFF",
            fontSize: "0.65rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #FFFDF9"
          }}>
            {totalUnread}
          </span>
        )}
      </button>

      {/* Slide-In Drawer */}
      {isChatOpen && (
        <div style={{
          position: "fixed", top: 0, right: 0, width: "420px", height: "100vh",
          backgroundColor: "#ffffff", borderLeft: "1px solid #EBE5D9",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.06)", zIndex: 1001,
          display: "flex", flexDirection: "column",
          borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px",
          fontFamily: "'Inter', sans-serif",
          animation: "slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>

          {/* Drawer Header Area */}
          <div style={{
            padding: "1.25rem", borderBottom: "1px solid #EBE5D9",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              {activeConversationId && (
                <button 
                  onClick={() => {
                    setActiveConversationId(null);
                    setShowAiSummaryPanel(false);
                  }} 
                  style={{ background: "#FAFAF8", border: "1px solid #EBE5D9", color: "#111", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", padding: "0.35rem 0.65rem", borderRadius: "6px" }}
                >
                  Back
                </button>
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
                  {activeConversation ? activePeer?.name || "Conversation" : "Workspace Chat"}
                </h4>
                <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  {activeConversation ? `${activePeer?.role || "Member"} • ${activePeer?.online ? "Online" : "Away"}` : "abc energy workspace"}
                </span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {activeConversationId && (
                <button 
                  onClick={() => setShowAiSummaryPanel(!showAiSummaryPanel)}
                  title="Ask OYEN AI"
                  style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 700, color: "#D8A325" }}
                >
                  <Sparkles size={15} color="#D8A325" /> Ask AI
                </button>
              )}
              <button onClick={closeChat} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* VIEW A: CONVERSATION LISTS */}
          {!activeConversationId ? (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #FAFAF8" }}>
                <div style={{ position: "relative" }}>
                  <Search size={13} color="#9CA3AF" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    id="global-chat-search-input"
                    type="text" 
                    placeholder="Search contacts... (Ctrl+K)" 
                    value={chatSearch} 
                    onChange={e => setChatSearch(e.target.value)} 
                    style={{ width: "100%", padding: "0.5rem 0.9rem 0.5rem 2rem", borderRadius: "8px", border: "1px solid #EBE5D9", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} 
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {filteredConversations.map(conv => {
                  const peer = conv.participants.find(p => p.userId.toLowerCase() !== selfId.toLowerCase()) || conv.participants[0];
                  const lastMsg = conv.lastMessage;
                  const hasUnread = (conv.unreadCount || 0) > 0;
                  return (
                    <div 
                      key={conv.conversationId} 
                      onClick={() => openConversation(conv.conversationId)} 
                      style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #FAFAF8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.85rem", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAF8"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: peer.role === "Administrator" ? "linear-gradient(135deg, #D9B233, #9B7B1A)" : "linear-gradient(135deg, #374151, #111827)", color: "#FFFDF9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                          {peer.avatarInitials || "PM"}
                        </div>
                        <span style={{ position: "absolute", bottom: "1px", right: "1px", width: "9px", height: "9px", borderRadius: "50%", backgroundColor: peer.online ? "#10B981" : "#9CA3AF", border: "2px solid #ffffff" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111111" }}>{peer.name}</span>
                          <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{lastMsg ? lastMsg._time : ""}</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#D8A325", fontWeight: 600 }}>{peer.role}</span>
                        <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.78rem", color: "#6B7280", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {lastMsg ? lastMsg.text : "Start conversation"}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {filteredConversations.length === 0 && (
                  <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#6B7280" }}>
                    <span style={{ fontSize: "2rem" }}>💬</span>
                    <h5 style={{ margin: "0.5rem 0 0.25rem 0", fontWeight: 700 }}>No conversations found.</h5>
                    <p style={{ margin: 0, fontSize: "0.75rem" }}>Invite delivery team members to collaborate.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* VIEW B: ACTIVE CHAT PANEL */
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", backgroundColor: "#ffffff", position: "relative" }}>
              
              {/* Filter controls tab row */}
              <div style={{ display: "flex", borderBottom: "1px solid #EBE5D9", padding: "0.5rem 1rem", gap: "0.75rem", backgroundColor: "#FAFAF8", fontSize: "0.78rem" }}>
                {[
                  { id: "all", label: "All Messages" },
                  { id: "pinned", label: "Pinned" },
                  { id: "attachments", label: "Attachments" }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      border: "none", background: "none", cursor: "pointer", fontWeight: activeFilter === tab.id ? 700 : 500,
                      color: activeFilter === tab.id ? "#111111" : "#6B7280", paddingBottom: "0.25rem",
                      borderBottom: activeFilter === tab.id ? "2px solid #F4C542" : "none"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Message cards virtual list */}
              <div style={{ flex: 1, padding: "1.25rem 1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredMessages.map(m => {
                  const isMe = m.senderId === selfId || m.sender === "me";
                  const reactions = m.reactions || [];
                  const reactionCounts = reactions.reduce((acc, r) => {
                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                    return acc;
                  }, {});

                  return (
                    <div 
                      key={m.messageId} 
                      onMouseEnter={() => setHoveredMessageId(m.messageId)}
                      onMouseLeave={() => {
                        setHoveredMessageId(null);
                        setSelectedEmojiPickerMsgId(null);
                      }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start",
                        position: "relative", padding: "0.25rem 0"
                      }}
                    >
                      {/* Floating actions menu (Slack style on hover) */}
                      {hoveredMessageId === m.messageId && !m.isDeleted && (
                        <div style={{
                          position: "absolute", top: "-1rem", right: isMe ? "auto" : "1rem", left: isMe ? "1rem" : "auto",
                          backgroundColor: "#ffffff", border: "1px solid #EBE5D9", borderRadius: "6px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.06)", display: "flex", gap: "0.35rem", padding: "0.25rem", zIndex: 10
                        }}>
                          <button onClick={() => setReplyingToMessage(m)} title="Reply" style={{ border: "none", background: "none", cursor: "pointer", padding: "0.15rem" }}><Reply size={14} /></button>
                          <button onClick={() => setSelectedEmojiPickerMsgId(m.messageId)} title="React" style={{ border: "none", background: "none", cursor: "pointer", padding: "0.15rem" }}><Smile size={14} /></button>
                          {isMe && (
                            <>
                              <button onClick={() => handleStartEdit(m)} title="Edit" style={{ border: "none", background: "none", cursor: "pointer", padding: "0.15rem" }}><Edit2 size={14} /></button>
                              <button onClick={() => handleDeleteMessage(m)} title="Delete" style={{ border: "none", background: "none", cursor: "pointer", padding: "0.15rem" }}><Trash2 size={14} color="#EF4444" /></button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Emoji Selector Bubble popup */}
                      {selectedEmojiPickerMsgId === m.messageId && (
                        <div style={{
                          position: "absolute", top: "-2.5rem", right: isMe ? "auto" : "2rem", left: isMe ? "2rem" : "auto",
                          backgroundColor: "#ffffff", border: "1px solid #EBE5D9", borderRadius: "20px", padding: "0.35rem", display: "flex", gap: "0.4rem", zIndex: 20, boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
                        }}>
                          {["❤️", "👍", "🔥", "🎉", "👏", "😂"].map(emoji => (
                            <button key={emoji} onClick={() => handleEmojiReact(m.messageId, emoji)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.1rem" }}>{emoji}</button>
                          ))}
                        </div>
                      )}

                      {/* Quoted block for replies */}
                      {m.text.startsWith('[Replying to:') && (
                        <div style={{ fontSize: "0.72rem", color: "#6B7280", backgroundColor: "#FAFAF8", borderLeft: "2px solid #F4C542", padding: "0.2rem 0.5rem", marginBottom: "0.2rem", maxWidth: "70%", borderRadius: "4px" }}>
                          {m.text.split(']')[0].replace('[Replying to: ', '')}
                        </div>
                      )}

                      {/* Message Bubble Card */}
                      <div style={{
                        maxWidth: "70%",
                        backgroundColor: isMe ? "transparent" : "#FAFAF8",
                        border: isMe ? "1px solid #F4C542" : "1px solid #EBE5D9",
                        color: "#111111",
                        padding: "0.75rem 1rem",
                        borderRadius: "14px",
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        boxSizing: "border-box"
                      }}>
                        
                        {/* Inline edit container */}
                        {editingMessageId === m.messageId ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <textarea 
                              value={editText} 
                              onChange={e => setEditText(e.target.value)} 
                              rows={2}
                              style={{ width: "100%", padding: "0.35rem", borderRadius: "6px", border: "1px solid #EBE5D9", fontSize: "0.8rem", outline: "none", resize: "none" }}
                            />
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button onClick={() => submitEdit(m.messageId)} style={{ padding: "0.2rem 0.55rem", backgroundColor: "#111111", border: "none", borderRadius: "4px", fontSize: "0.72rem", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}>Save</button>
                              <button onClick={() => setEditingMessageId(null)} style={{ padding: "0.2rem 0.55rem", backgroundColor: "transparent", border: "1px solid #EBE5D9", borderRadius: "4px", fontSize: "0.72rem", color: "#EF4444", cursor: "pointer" }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ margin: 0, wordBreak: "break-word" }}>
                              {m.text.includes(']') ? m.text.substring(m.text.indexOf(']') + 1).trim() : m.text}
                            </p>
                            
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.68rem", color: "#9CA3AF" }}>
                              <span>{m._time || m.time}</span>
                              {m.isEdited && <span>• Edited</span>}
                              {isMe && !m.isDeleted && (
                                <span>
                                  {m.status === "seen" ? "✓✓ Read" : m.status === "delivered" ? "✓✓ Delivered" : "✓ Sent"}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Display compiles emoji reactions */}
                      {reactions.length > 0 && (
                        <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
                          {Object.keys(reactionCounts).map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiReact(m.messageId, emoji)}
                              style={{
                                display: "flex", alignItems: "center", gap: "0.15rem", border: "1px solid #EBE5D9",
                                backgroundColor: reactions.some(r => r.emoji === emoji && r.userId === selfId) ? "rgba(244, 197, 66, 0.15)" : "#ffffff",
                                padding: "0.1rem 0.35rem", borderRadius: "10px", fontSize: "0.7rem", cursor: "pointer"
                              }}
                            >
                              <span>{emoji}</span>
                              <strong>{reactionCounts[emoji]}</strong>
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Replying quote indicator above composer */}
              {replyingToMessage && (
                <div style={{
                  padding: "0.5rem 1rem", borderTop: "1px solid #EBE5D9",
                  backgroundColor: "#FAFAF8", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem"
                }}>
                  <span style={{ color: "#6B7280" }}>Replying to: <strong style={{ color: "#111111" }}>{replyingToMessage.text}</strong></span>
                  <button onClick={() => setReplyingToMessage(null)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={14} /></button>
                </div>
              )}

              {/* Composer */}
              <form onSubmit={handleSendMessage} style={{ padding: "1rem", borderTop: "1px solid #EBE5D9", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button type="button" onClick={() => alert("Upload file")} style={{ border: "none", background: "none", cursor: "pointer", color: "#6B7280" }}><Paperclip size={16} /></button>
                  <input 
                    type="text"
                    value={messageInput}
                    onChange={e => handleInputChange(e.target.value)}
                    placeholder={`Message ${activePeer?.name || "Program Manager"}...`}
                    style={{ flex: 1, padding: "0.55rem 0.85rem", border: "1px solid #EBE5D9", borderRadius: "20px", fontSize: "0.82rem", outline: "none" }}
                  />
                  <button type="submit" style={{ backgroundColor: "#111111", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", cursor: "pointer" }}>
                    <Send size={14} color="#F4C542" />
                  </button>
                </div>
              </form>

              {/* Side OYEN AI drawer helper panel overlay */}
              {showAiSummaryPanel && aiInsights && (
                <div style={{
                  position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
                  backgroundColor: "#ffffff", borderLeft: "1px solid #EBE5D9",
                  zIndex: 100, display: "flex", flexDirection: "column",
                  padding: "1.5rem", animation: "fadeIn 0.15s ease"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #EBE5D9", paddingBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Sparkles size={16} color="#D8A325" />
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>✨ Ask OYEN AI</h4>
                    </div>
                    <button onClick={() => setShowAiSummaryPanel(false)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={16} /></button>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1, overflowY: "auto", fontSize: "0.85rem" }}>
                    <div>
                      <span style={{ fontWeight: 700, display: "block", marginBottom: "0.25rem", color: "#6B7280", textTransform: "uppercase", fontSize: "0.68rem" }}>Conversation Summary</span>
                      <p style={{ margin: 0, lineHeight: 1.5, color: "#111111" }}>{aiInsights.summary}</p>
                    </div>

                    <div>
                      <span style={{ fontWeight: 700, display: "block", marginBottom: "0.25rem", color: "#6B7280", textTransform: "uppercase", fontSize: "0.68rem" }}>Action Items Detected</span>
                      <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#111111" }}>
                        {aiInsights.actionItems.map((item, idx) => <li key={idx} style={{ marginBottom: "0.25rem" }}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}
    </>
  );
}
