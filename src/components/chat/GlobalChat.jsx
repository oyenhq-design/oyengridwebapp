import React, { useState, useEffect, useRef } from "react";
import {
  Search, X, MessageCircle, Send, Paperclip, Mic, Edit2, Trash2, Smile, Reply,
  Calendar, FileText, BookOpen, Award, ClipboardCheck, Check, CheckCheck, Sparkles
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

  // Local state for editing & context controls
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeDrafts, setActiveDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem("oyen_chat_drafts");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save drafts locally
  useEffect(() => {
    localStorage.setItem("oyen_chat_drafts", JSON.stringify(activeDrafts));
  }, [activeDrafts]);

  // Load draft when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      setMessageInput(activeDrafts[activeConversationId] || "");
    }
  }, [activeConversationId]);

  // Save current input to draft map
  const handleInputChange = (text) => {
    setMessageInput(text);
    if (activeConversationId) {
      setActiveDrafts(prev => ({
        ...prev,
        [activeConversationId]: text
      }));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // Clear draft
    if (activeConversationId) {
      setActiveDrafts(prev => {
        const next = { ...prev };
        delete next[activeConversationId];
        return next;
      });
    }
    
    sendMessage(e);
  };

  // Add emoji reaction
  const handleReact = (msgId, emoji) => {
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
    // Trigger storage event manually to notify App.jsx state
    window.dispatchEvent(new Event("storage"));
  };

  // Edit message (only within 30s)
  const handleStartEdit = (msg) => {
    const ageMs = Date.now() - msg.createdAt;
    if (ageMs > 30000) {
      alert("Messages can only be edited within 30 seconds.");
      return;
    }
    setEditingMessageId(msg.messageId);
    setEditText(msg.text || "");
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

  // Delete message (Everyone: 5min, otherwise Delete for Me only)
  const handleDelete = (msg) => {
    const ageMs = Date.now() - msg.createdAt;
    const forEveryone = ageMs <= 300000; // 5 minutes limit
    
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

  const totalUnread = visibleConversations.reduce((s, c) => s + (c.unreadCount || 0), 0);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={openChat}
        title="Workspace Chat"
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "58px", height: "58px", borderRadius: "50%",
          backgroundColor: "#D9B233", border: "none", color: "#FFFFFF",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 15px rgba(217, 178, 51, 0.4)",
          zIndex: 1000, transition: "all 0.2s ease-in-out",
        }}
      >
        <MessageCircle size={24} />
        {!isChatOpen && totalUnread > 0 && (
          <span style={{
            position: "absolute", top: "-2px", right: "-2px",
            width: "18px", height: "18px", borderRadius: "50%",
            backgroundColor: "#EF4444", color: "#FFF",
            fontSize: "0.6rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #FFFDF9",
          }}>
            {totalUnread}
          </span>
        )}
      </button>

      {/* Floating Chat Drawer */}
      {isChatOpen && (
        <div style={{
          position: "fixed", top: 0, right: 0, width: "420px", height: "100vh",
          backgroundColor: "#FFFDF9", borderLeft: "1px solid #E8E2D8",
          boxShadow: "-6px 0 35px rgba(0,0,0,0.08)", zIndex: 1001,
          display: "flex", flexDirection: "column"
        }}>

          {/* Drawer Header */}
          <div style={{
            padding: "1rem 1.25rem", borderBottom: "1px solid #E8E2D8",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            backgroundColor: "#FFFDF9"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              {activeConversationId && (
                <button onClick={() => setActiveConversationId(null)} style={{ background: "#F5F2ED", border: "1px solid #E8E2D8", color: "#151515", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", padding: "0.3rem 0.6rem", borderRadius: "7px" }}>
                  Back
                </button>
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>
                  {activeConversation ? activePeer?.name || "Conversation" : "Workspace Chat"}
                </h4>
                {activeConversation && (
                  <span style={{ fontSize: "0.67rem", color: activePeer?.online ? "#16A34A" : "#888888", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: activePeer?.online ? "#10B981" : "#9CA3AF" }} />
                    {activePeer?.online ? "Online" : "Away"} • {activePeer?.role || "Member"}
                  </span>
                )}
              </div>
            </div>
            <button onClick={closeChat} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888" }}>
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          {!activeConversationId ? (
            /* Contacts List */
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ position: "relative" }}>
                  <Search size={13} color="#AAAAAA" style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text" 
                    placeholder="Search contacts..." 
                    value={chatSearch} 
                    onChange={e => setChatSearch(e.target.value)} 
                    style={{ width: "100%", padding: "0.5rem 0.9rem 0.5rem 2rem", borderRadius: "9px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#F5F2ED", fontSize: "0.78rem", outline: "none" }} 
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
                      style={{ padding: "0.95rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.03)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.85rem" }}
                    >
                      <div style={{ position: "relative" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: peer.role === "Administrator" ? "linear-gradient(135deg, #D9B233, #9B7B1A)" : "linear-gradient(135deg, #374151, #111827)", color: "#FFFDF9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                          {peer.avatarInitials || "PM"}
                        </div>
                        <span style={{ position: "absolute", bottom: "1px", right: "1px", width: "9px", height: "9px", borderRadius: "50%", backgroundColor: peer.online ? "#10B981" : "#9CA3AF", border: "2px solid #FFFDF9" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.83rem", fontWeight: 700 }}>{peer.name}</span>
                          <span style={{ fontSize: "0.67rem", color: "#AAAAAA" }}>{lastMsg ? lastMsg._time : ""}</span>
                        </div>
                        <span style={{ fontSize: "0.65rem", color: "#6B7280", fontWeight: 600 }}>{peer.role}</span>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#777777", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {lastMsg ? lastMsg.text : "Start the conversation"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Chat Thread */
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", backgroundColor: "#FDFBF7" }}>
              <div style={{ flex: 1, padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                
                {activeConversation.messages.filter(m => !(m.hiddenFor || []).includes(selfId)).map((m, idx) => {
                  const isMe = m.senderId === selfId || m.sender === "me";
                  
                  // Filter out reactions counts
                  const reactions = m.reactions || [];
                  const reactionCounts = reactions.reduce((acc, r) => {
                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                    return acc;
                  }, {});

                  return (
                    <div key={m.messageId} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                      
                      {/* Message Bubble container */}
                      <div style={{
                        maxWidth: "80%",
                        backgroundColor: isMe ? "#111111" : "#F8F6F1",
                        color: isMe ? "#FFFDF9" : "#111111",
                        padding: "0.65rem 1rem",
                        borderRadius: "12px",
                        fontSize: "0.82rem",
                        position: "relative"
                      }}>
                        
                        {/* Inline Edit form */}
                        {editingMessageId === m.messageId ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input 
                              type="text" 
                              value={editText} 
                              onChange={e => setEditText(e.target.value)} 
                              style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #EBE5D9", outline: "none", color: "#111" }}
                            />
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button onClick={() => submitEdit(m.messageId)} style={{ padding: "0.2rem 0.5rem", backgroundColor: "#D9B233", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}>Save</button>
                              <button onClick={() => setEditingMessageId(null)} style={{ padding: "0.2rem 0.5rem", backgroundColor: "transparent", border: "1px solid #EBE5D9", borderRadius: "4px", fontSize: "0.7rem", color: "#EF4444", cursor: "pointer" }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ margin: 0, wordBreak: "break-word" }}>{m.text}</p>
                            
                            {/* Metadata & read receipt checkmarks */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.25rem", marginTop: "0.25rem", fontSize: "0.65rem", opacity: 0.8 }}>
                              <span>{m._time || m.time}</span>
                              {m.isEdited && <span style={{ fontStyle: "italic" }}>(Edited)</span>}
                              {isMe && !m.isDeleted && (
                                <span>
                                  {m.status === "seen" ? <CheckCircle2 size={10} color="#D9B233" /> : <Check size={10} />}
                                </span>
                              )}
                            </div>
                          </>
                        )}

                        {/* Interactive reaction toolbar shown on hover/actions */}
                        {!m.isDeleted && (
                          <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                            {["❤️", "👍", "🔥", "🎉"].map(emoji => (
                              <button 
                                key={emoji} 
                                onClick={() => handleReact(m.messageId, emoji)}
                                style={{
                                  padding: "0.15rem 0.35rem",
                                  backgroundColor: reactions.some(r => r.emoji === emoji && r.userId === selfId) ? "rgba(217, 178, 51, 0.25)" : "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "0.75rem",
                                  borderRadius: "4px"
                                }}
                              >
                                {emoji} {reactionCounts[emoji] || ""}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message actions (Edit / Delete buttons for your messages) */}
                      {isMe && !m.isDeleted && editingMessageId !== m.messageId && (
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.15rem", fontSize: "0.7rem" }}>
                          <button onClick={() => handleStartEdit(m)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}>Edit</button>
                          <button onClick={() => handleDelete(m)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444" }}>Delete</button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Inline OYEN AI Contextual Suggestion Banner */}
                {activeConversation.messages.some(m => m.text.includes("Slides") || m.text.includes("slides")) && (
                  <div style={{
                    backgroundColor: "rgba(244, 197, 66, 0.08)",
                    border: "1px solid #F4C542",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.78rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#2D2D2D" }}>
                      <Sparkles size={14} color="#D8A325" />
                      <span>This discussion mentions slides. Attach presentation?</span>
                    </div>
                    <button onClick={() => alert("Slides attached")} style={{ padding: "0.25rem 0.55rem", backgroundColor: "#F4C542", border: "none", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>Attach</button>
                  </div>
                )}
              </div>

              {/* Chat Input form with draft listener */}
              <form onSubmit={handleSendMessage} style={{ padding: "1rem 1.25rem", borderTop: "1px solid #E8E2D8", display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "#FFFDF9" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" onClick={() => alert("Upload progress checklist")} style={{ background: "none", border: "none", color: "#888888", display: "flex", alignItems: "center" }}><Paperclip size={16} /></button>
                </div>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={messageInput} 
                  onChange={e => handleInputChange(e.target.value)} 
                  style={{ flex: 1, padding: "0.55rem 0.85rem", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#F8F6F1", fontSize: "0.8rem", outline: "none" }} 
                />
                <button type="submit" style={{ backgroundColor: "#D9B233", border: "none", borderRadius: "10px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFFFFF" }}>
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
