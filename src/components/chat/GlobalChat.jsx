import React from "react";
import {
  Search, X, MessageCircle, Send, Paperclip, Mic,
  Calendar, FileText, BookOpen, Award, ClipboardCheck, Check, CheckCheck
} from "lucide-react";

/**
 * GlobalChat — floating workspace chat button + slide-in drawer.
 * Accepts all required state and action props from App.jsx so it can be
 * rendered outside the main layout (e.g. alongside ProgramManagerModule).
 */
export default function GlobalChat({
  userRole,
  user,
  ownerEmail,
  isChatOpen,
  openChat,
  closeChat,
  visibleConversations,
  filteredConversations,
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

  const totalUnread = visibleConversations.reduce((s, c) => s + (c.unreadCount || 0), 0);
  const selfId = userRole === "Facilitator" ? user : (ownerEmail || "admin@oyengrid.com");

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
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(217, 178, 51, 0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(217, 178, 51, 0.4)"; }}
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
          position: "fixed", top: 0, right: 0, width: "390px", height: "100vh",
          backgroundColor: "#FFFDF9", borderLeft: "1px solid #E8E2D8",
          boxShadow: "-6px 0 35px rgba(0,0,0,0.08)", zIndex: 1001,
          display: "flex", flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>

          {/* Drawer Header */}
          <div style={{
            padding: "1rem 1.25rem", borderBottom: "1px solid #E8E2D8",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            backgroundColor: "#FFFDF9",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              {activeConversationId && userRole !== "Facilitator" && (
                <button onClick={() => setActiveConversationId(null)} style={{ background: "#F5F2ED", border: "1px solid #E8E2D8", color: "#151515", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", padding: "0.3rem 0.6rem", borderRadius: "7px", whiteSpace: "nowrap" }}>
                  Back
                </button>
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#111111", fontFamily: "'Outfit', sans-serif", lineHeight: 1.2 }}>
                  {activeConversation ? activePeer?.name || "Conversation" : "Workspace Chat"}
                </h4>
                {activeConversation ? (
                  <span style={{ fontSize: "0.67rem", color: activePeer?.online ? "#16A34A" : "#888888", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem", fontWeight: 600 }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: activePeer?.online ? "#10B981" : "#9CA3AF", display: "inline-block", flexShrink: 0 }} />
                    {activePeer?.online ? "Online" : "Away"} {activePeer?.specialization || activePeer?.role || "Member"}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.67rem", color: "#888888", marginTop: "0.15rem", display: "block", fontWeight: 500 }}>
                    {userRole === "Facilitator" ? "Direct line to your workspace administrator" : `${visibleConversations.length} contact${visibleConversations.length !== 1 ? "s" : ""}`}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {activeConversationId && (
                <button type="button" title="Audio call" onClick={() => alert("Audio call feature coming soon")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", display: "flex", alignItems: "center", padding: "0.2rem" }}>
                  📞
                </button>
              )}
              <button onClick={closeChat} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", padding: "0.2rem", display: "flex", alignItems: "center" }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          {!activeConversationId ? (
            /* VIEW A: Conversations List */
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.6rem" }}>
                  {userRole === "Facilitator" ? "Your Administrator" : "Contacts"}
                </div>
                <div style={{ position: "relative" }}>
                  <Search size={13} color="#AAAAAA" style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" placeholder={userRole === "Facilitator" ? "Search messages..." : "Search contacts..."} value={chatSearch} onChange={e => setChatSearch(e.target.value)} style={{ width: "100%", padding: "0.5rem 0.9rem 0.5rem 2rem", borderRadius: "9px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#F5F2ED", fontSize: "0.78rem", outline: "none", color: "#111111", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {filteredConversations.length > 0 ? filteredConversations.map(conv => {
                  const peer = conv.participants.find(p => p.role !== (userRole === "Facilitator" ? "Facilitator" : "Administrator")) || conv.participants[0];
                  const lastMsg = conv.lastMessage;
                  const hasUnread = (conv.unreadCount || 0) > 0;
                  return (
                    <div key={conv.conversationId} onClick={() => openConversation(conv.conversationId)} style={{ padding: "0.95rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.03)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.85rem", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(217,178,51,0.04)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: peer.role === "Administrator" ? "linear-gradient(135deg, #D9B233, #9B7B1A)" : "linear-gradient(135deg, #374151, #111827)", color: "#FFFDF9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", fontFamily: "'Outfit', sans-serif" }}>
                          {peer.avatarInitials}
                        </div>
                        <span style={{ position: "absolute", bottom: "1px", right: "1px", width: "9px", height: "9px", borderRadius: "50%", backgroundColor: peer.online ? "#10B981" : "#9CA3AF", border: "2px solid #FFFDF9" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.15rem" }}>
                          <span style={{ fontSize: "0.83rem", fontWeight: hasUnread ? 800 : 700, color: "#111111", fontFamily: "'Outfit', sans-serif" }}>{peer.name}</span>
                          <span style={{ fontSize: "0.67rem", color: "#AAAAAA", fontWeight: 500, flexShrink: 0, marginLeft: "0.5rem" }}>{lastMsg ? lastMsg._time || lastMsg.time : ""}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.1rem" }}>
                          <span style={{ fontSize: "0.6rem", backgroundColor: peer.role === "Administrator" ? "rgba(217,178,51,0.12)" : "rgba(107,114,128,0.1)", color: peer.role === "Administrator" ? "#C49B0A" : "#4B5563", padding: "0.08rem 0.38rem", borderRadius: "3px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px" }}>{peer.role}</span>
                          {peer.online && <span style={{ fontSize: "0.6rem", color: "#10B981", fontWeight: 600 }}>Online</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: hasUnread ? "#222" : "#777777", fontWeight: hasUnread ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                            {lastMsg ? (lastMsg.type === "system-welcome" ? "Workspace conversation started" : lastMsg.sender === "me" ? `You: ${lastMsg.text}` : lastMsg.text) : "Start the conversation"}
                          </p>
                          {hasUnread && <span style={{ backgroundColor: "#D9B233", color: "#FFFDF9", fontSize: "0.6rem", fontWeight: 800, borderRadius: "10px", padding: "0.05rem 0.4rem", flexShrink: 0 }}>{conv.unreadCount}</span>}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: "center", padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <div style={{ fontSize: "2rem" }}>💬</div>
                    <div>
                      <h5 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111111", margin: "0 0 0.35rem", fontFamily: "'Outfit', sans-serif" }}>
                        {userRole === "Facilitator" ? "No admin conversation" : "No contacts yet"}
                      </h5>
                      <p style={{ fontSize: "0.72rem", margin: 0, lineHeight: 1.5, color: "#888888" }}>
                        {userRole === "Facilitator" ? "Your workspace administrator conversation will appear here automatically." : "Invite team members and their conversations will appear here automatically."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* VIEW B: Active Chat */
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", backgroundColor: "#FDFBF7" }}>
              <div style={{ flex: 1, padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {(() => {
                  let lastDate = null;
                  return activeConversation.messages.map(m => {
                    const showDate = (m._date || m.date) !== lastDate;
                    lastDate = m._date || m.date;
                    const isMe = m.senderId === selfId || m.sender === "me";
                    return (
                      <div key={m.messageId || m.id} style={{ width: "100%" }}>
                        {showDate && (
                          <div style={{ display: "flex", justifyContent: "center", margin: "1.25rem 0 0.85rem" }}>
                            <span style={{ fontSize: "0.7rem", backgroundColor: "#EAE5DB", color: "#6B665E", padding: "0.25rem 0.75rem", borderRadius: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{m._date || m.date}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", width: "100%" }}>
                          {m.messageType === "system-welcome" || m.type === "system-welcome" ? (
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "0.5rem 0 1rem", gap: "0.5rem" }}>
                              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #D9B233, #9B7B1A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <MessageCircle size={18} color="#FFFFFF" />
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#555" }}>Workspace conversation created</div>
                                <div style={{ fontSize: "0.65rem", color: "#AAAAAA", marginTop: "0.1rem" }}>{m.time} · This is the beginning of your conversation</div>
                              </div>
                              <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, #E8E2D8, transparent)", margin: "0.25rem 0" }} />
                            </div>
                          ) : m.messageType === "system" || m.type === "system" || m.messageType === "session" || m.type === "session" ? (
                            <div style={{ width: "100%", maxWidth: "310px", backgroundColor: "#FFFDF9", border: "1px solid #E8E2D8", borderRadius: "12px", padding: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D9B233", fontWeight: 800, fontSize: "0.8rem", marginBottom: "0.4rem" }}><Calendar size={14} /><span>Session Updated</span></div>
                              <h5 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111111", margin: "0 0 0.25rem" }}>{m.sessionMeta?.title}</h5>
                              <p style={{ fontSize: "0.75rem", color: "#666", margin: "0 0 0.75rem" }}>{m.sessionMeta?.day} {m.sessionMeta?.time} {m.sessionMeta?.location}</p>
                              <button onClick={() => alert("Opening Session details")} style={{ width: "100%", padding: "0.45rem", backgroundColor: "#111111", border: "none", borderRadius: "6px", color: "#FFFDF9", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>View Session</button>
                            </div>
                          ) : m.messageType === "file" || m.type === "file" ? (
                            <div style={{ width: "100%", maxWidth: "310px", backgroundColor: "#FFFDF9", border: "1px solid #E8E2D8", borderRadius: "12px", padding: "1rem" }}>
                              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(217, 178, 51, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D9B233" }}><FileText size={18} /></div>
                                <div><h6 style={{ margin: 0, fontSize: "0.8rem", fontWeight: 800, color: "#111" }}>{m.fileMeta?.name}</h6><span style={{ fontSize: "0.68rem", color: "#888" }}>{m.fileMeta?.size} {m.fileMeta?.date}</span></div>
                              </div>
                              <button onClick={() => alert("Downloading file...")} style={{ width: "100%", padding: "0.45rem", backgroundColor: "#F5F2ED", border: "1px solid #E8E2D8", borderRadius: "6px", color: "#111", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Download</button>
                            </div>
                          ) : m.messageType === "resource" || m.type === "resource" ? (
                            <div style={{ width: "100%", maxWidth: "310px", backgroundColor: "#FFFDF9", border: "1px solid #E8E2D8", borderRadius: "12px", padding: "1rem" }}>
                              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(45, 108, 223, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2D6CDF" }}><BookOpen size={18} /></div>
                                <div><h6 style={{ margin: 0, fontSize: "0.8rem", fontWeight: 800, color: "#111" }}>{m.resourceMeta?.name}</h6><span style={{ fontSize: "0.68rem", color: "#888" }}>{m.resourceMeta?.date}</span></div>
                              </div>
                              <button onClick={() => alert("Opening Resource details")} style={{ width: "100%", padding: "0.45rem", backgroundColor: "#111", border: "none", borderRadius: "6px", color: "#FFF", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Open Resource</button>
                            </div>
                          ) : m.messageType === "assessment" || m.type === "assessment" ? (
                            <div style={{ width: "100%", maxWidth: "310px", backgroundColor: "#FFFDF9", border: "1px solid #E8E2D8", borderRadius: "12px", padding: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D9B233", fontWeight: 800, fontSize: "0.8rem", marginBottom: "0.4rem" }}><Award size={14} /><span>Assessment Published</span></div>
                              <h5 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111111", margin: "0 0 0.25rem" }}>{m.assessmentMeta?.title}</h5>
                              <p style={{ fontSize: "0.75rem", color: "#666", margin: "0 0 0.75rem" }}>{m.assessmentMeta?.due}</p>
                              <button onClick={() => alert("Opening assessment")} style={{ width: "100%", padding: "0.45rem", backgroundColor: "#111", border: "none", borderRadius: "6px", color: "#FFF", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Open Assessment</button>
                            </div>
                          ) : m.messageType === "attendance" || m.type === "attendance" ? (
                            <div style={{ width: "100%", maxWidth: "310px", backgroundColor: "#FFFDF9", border: "1px solid #E8E2D8", borderRadius: "12px", padding: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D9B233", fontWeight: 800, fontSize: "0.8rem", marginBottom: "0.4rem" }}><ClipboardCheck size={14} /><span>Attendance Reminder</span></div>
                              <p style={{ fontSize: "0.78rem", color: "#111", margin: "0 0 0.75rem", lineHeight: 1.4 }}>Please submit attendance for <strong>{m.attendanceMeta?.title}</strong> before 5 PM.</p>
                              <button onClick={() => alert("Opening attendance sheet")} style={{ width: "100%", padding: "0.45rem", backgroundColor: "#D9B233", border: "none", borderRadius: "6px", color: "#FFF", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Open Attendance</button>
                            </div>
                          ) : (
                            <div style={{ maxWidth: "80%", backgroundColor: isMe ? "#111111" : "#F8F6F1", color: isMe ? "#FFFDF9" : "#111111", padding: "0.65rem 1rem", borderRadius: "12px", fontSize: "0.8rem", lineHeight: 1.45 }}>
                              <p style={{ margin: 0, wordBreak: "break-word" }}>{m.text}</p>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.25rem", marginTop: "0.25rem" }}>
                                <span style={{ fontSize: "0.65rem", color: isMe ? "rgba(255,255,255,0.6)" : "#888888" }}>{m.time}</span>
                                {isMe && (
                                  <span style={{ display: "flex", alignItems: "center" }}>
                                    {(m.status || m.readStatus) === "sent" ? <Check size={11} color="rgba(255,255,255,0.5)" /> : (m.status || m.readStatus) === "delivered" ? <CheckCheck size={12} color="rgba(255,255,255,0.5)" /> : <CheckCheck size={12} color="#D9B233" />}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {activeConversation?.typing?.isTyping && (
                <div style={{ padding: "0.5rem 1.5rem", fontSize: "0.72rem", color: "#D9B233", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#D9B233", animation: "bounce 1s infinite" }} />
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#D9B233", animation: "bounce 1s infinite 0.2s" }} />
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#D9B233", animation: "bounce 1s infinite 0.4s" }} />
                  </span>
                  <span style={{ fontStyle: "italic", fontSize: "0.7rem" }}>{activePeer?.name || "Workspace"} is typing</span>
                </div>
              )}

              <form onSubmit={sendMessage} style={{ padding: "1rem 1.25rem", borderTop: "1px solid #E8E2D8", display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "#FFFDF9" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" onClick={() => alert("Attachments: Files, Images, Videos, Voice Notes")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", display: "flex", alignItems: "center" }}><Paperclip size={16} /></button>
                  <button type="button" onClick={() => alert("Emoji Drawer")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", display: "flex", alignItems: "center" }}>😊</button>
                </div>
                <input type="text" placeholder="Type a message..." value={messageInput} onChange={e => setMessageInput(e.target.value)} style={{ flex: 1, padding: "0.55rem 0.85rem", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#F8F6F1", fontSize: "0.8rem", outline: "none", color: "#111111" }} />
                {messageInput.trim() === "" ? (
                  <button type="button" onClick={() => alert("Voice notes recording...")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}><Mic size={16} /></button>
                ) : (
                  <button type="submit" style={{ backgroundColor: "#D9B233", border: "none", borderRadius: "10px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFFFFF" }}><Send size={14} /></button>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
