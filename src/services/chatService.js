// src/services/chatService.js
// ─────────────────────────────────────────────────────────────────────────────
// OYEN GRID Workspace Chat — Data Service Layer
//
// Owns: data models, enums, message factory, conversation builder, merge logic.
// Contains: zero React, zero UI, zero side effects.
//
// Extensibility note:
//   Phase 1  → Admin ↔ Facilitator (implemented here)
//   Phase 2  → Admin ↔ Programme Owner (extend buildWorkspaceConversations)
//   Phase 3  → Facilitator ↔ assigned Learners (extend filter logic)
//   Phase 4  → Group / Channel conversations (add conversationType: 'group')
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────────────────────

export const MESSAGE_TYPE = Object.freeze({
  TEXT:         'text',
  IMAGE:        'image',
  FILE:         'file',
  VOICE:        'voice',
  RESOURCE:     'resource',
  SESSION:      'session',
  ANNOUNCEMENT: 'announcement',
  ATTENDANCE:   'attendance',
  ASSESSMENT:   'assessment',
  SYSTEM_WELCOME: 'system-welcome',
});

export const CONVERSATION_STATUS = Object.freeze({
  ACTIVE:   'active',
  ARCHIVED: 'archived',
  MUTED:    'muted',
});

export const MESSAGE_STATUS = Object.freeze({
  SENT:      'sent',
  DELIVERED: 'delivered',
  READ:      'read',
});

// ── Internal helpers ───────────────────────────────────────────────────────────

function toTitleCase(str) {
  return (str || '')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '??';
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Message Factory ────────────────────────────────────────────────────────────

/**
 * Creates a fully-formed Message object with all schema fields populated.
 * All type-specific metadata fields default to null — only set what is relevant.
 *
 * @returns {Message}
 */
export function createMessage({
  conversationId,
  senderId,
  receiverId,
  senderRole,
  messageType = MESSAGE_TYPE.TEXT,
  text = '',
  attachments = [],
  status = MESSAGE_STATUS.SENT,
  replyTo = null,
  reactions = [],
  // Type-specific metadata
  sessionMeta    = null,
  resourceMeta   = null,
  fileMeta       = null,
  attendanceMeta = null,
  assessmentMeta = null,
  // Presentation overrides (set by service, not by callers)
  _overrideId   = null,
  _overrideTime = null,
  _overrideDate = null,
}) {
  return {
    messageId:     _overrideId || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    conversationId,
    senderId,
    receiverId,
    senderRole,
    messageType,
    text,
    attachments,
    createdAt: Date.now(),
    status,
    replyTo,
    reactions,
    // Presentation helpers — precomputed at creation so the UI doesn't re-derive on every render
    _time: _overrideTime || nowTime(),
    _date: _overrideDate || 'Today',
    // Type metadata
    sessionMeta,
    resourceMeta,
    fileMeta,
    attendanceMeta,
    assessmentMeta,
  };
}

// ── Welcome Message Seeder ─────────────────────────────────────────────────────

/**
 * Builds the one-time welcome message sequence for a new conversation.
 * Called once per conversation at creation time — never again (mergeConversations
 * preserves existing messages so this is not duplicated on re-render).
 *
 * @param {string} conversationId
 * @param {string} adminId        - userId of the administrator
 * @param {string} facilitatorId  - userId of the facilitator
 * @param {string} adminName      - Display name of the admin (e.g. "Abc Energy Administrator")
 * @param {string} orgName        - Raw workspace name from state
 * @returns {Message[]}
 */
export function buildWelcomeMessages(conversationId, adminId, facilitatorId, adminName, orgName) {
  const workspaceName = toTitleCase(orgName) || 'this workspace';
  const time = nowTime();

  const base = {
    conversationId,
    senderId:    adminId,
    receiverId:  facilitatorId,
    senderRole:  'Administrator',
    status:      MESSAGE_STATUS.READ,
    _overrideDate: 'Today',
    _overrideTime: time,
  };

  return [
    createMessage({
      ...base,
      _overrideId:  `${conversationId}-sys`,
      messageType:  MESSAGE_TYPE.SYSTEM_WELCOME,
      text:         'Workspace conversation created',
    }),
    createMessage({
      ...base,
      _overrideId:  `${conversationId}-welcome`,
      messageType:  MESSAGE_TYPE.TEXT,
      status:       MESSAGE_STATUS.READ,
      text:
`👋 Welcome to ${workspaceName} Workspace.

This is your official communication channel with the workspace administration.

You'll receive:
• Session assignments
• Resources & materials
• Announcements
• Workspace updates
• Support

Feel free to message us anytime.`,
    }),
  ];
}

// ── Participant Helpers ────────────────────────────────────────────────────────

/**
 * Returns the participant who is NOT the current user in a two-party conversation.
 * Works for Phase 1. For group conversations in future phases, filter differently.
 */
export function getOtherParticipant(conversation, currentUserId) {
  return (
    conversation.participants.find(p => p.userId !== currentUserId) ||
    conversation.participants[0]
  );
}

/**
 * Returns the current user's own participant record from a conversation.
 */
export function getSelfParticipant(conversation, currentUserId) {
  return conversation.participants.find(p => p.userId === currentUserId) || null;
}

// ── Conversation Builder ───────────────────────────────────────────────────────

function buildSingleConversation({ orgName, adminId, adminDisplayName, facilitator, index }) {
  const facilitatorId   = facilitator.email   || `facilitator-${index}`;
  const facilitatorName = facilitator.name    || facilitator.email || 'Facilitator';
  const conversationId  = `conv-admin-${facilitatorId}`;

  const welcomeMessages = buildWelcomeMessages(
    conversationId,
    adminId,
    facilitatorId,
    adminDisplayName,
    orgName,
  );

  return {
    conversationId,
    workspaceId:  orgName || 'workspace',
    participants: [
      {
        userId:         adminId,
        role:           'Administrator',
        name:           adminDisplayName,
        avatarInitials: getInitials(adminDisplayName),
        online:         true,
      },
      {
        userId:         facilitatorId,
        role:           'Facilitator',
        name:           facilitatorName,
        email:          facilitator.email || '',
        avatarInitials: getInitials(facilitatorName),
        online:         index % 2 === 0,       // Simulated until real socket data
        specialization: facilitator.specialization || '',
      },
    ],
    messages:     welcomeMessages,
    unreadCount:  1,
    lastMessage:  welcomeMessages[welcomeMessages.length - 1] || null,
    lastActivity: Date.now(),
    typing:       { userId: null, isTyping: false },
    status:       CONVERSATION_STATUS.ACTIVE,
    createdAt:    Date.now(),
    updatedAt:    Date.now(),
  };
}

/**
 * Generates the full list of workspace conversations from wsTeam.
 *
 * Phase 1: one conversation per Facilitator ↔ Administrator.
 *
 * To add Phase 2 (Programme Owner ↔ Facilitator), add another block here:
 *   const ownerConvs = wsTeam.filter(m => m.role === 'Programme Owner').map(...)
 *   return [...facilitatorConvs, ...ownerConvs];
 *
 * @param {object[]} wsTeam       - Array of workspace team member objects
 * @param {string}   orgName      - Workspace/organisation name (raw, from state)
 * @param {string}   adminUserId  - UserId of the administrator (email or identifier)
 * @returns {Conversation[]}
 */
export function buildWorkspaceConversations(wsTeam, orgName, adminUserId) {
  if (!wsTeam || !orgName) return [];

  const adminDisplayName = `${toTitleCase(orgName)} Administrator`;
  const adminId          = adminUserId || 'admin';

  // Phase 1: Admin ↔ Facilitator threads
  const facilitatorConversations = wsTeam
    .filter(m => m.role === 'Facilitator')
    .map((facilitator, index) =>
      buildSingleConversation({
        orgName,
        adminId,
        adminDisplayName,
        facilitator,
        index,
      })
    );

  return facilitatorConversations;
}

/**
 * Merges newly-generated conversations with existing conversation state,
 * preserving message history, unread counts, and typing state.
 *
 * - Known conversation (same ID): keep messages + state, refresh participant metadata
 * - New conversation (not seen before): add with seeded welcome messages
 *
 * @param {Conversation[]} existing  - Current conversations[] from React state
 * @param {Conversation[]} generated - Freshly built from wsTeam
 * @returns {Conversation[]}
 */
export function mergeConversations(existing, generated) {
  const existingMap = new Map(existing.map(c => [c.conversationId, c]));

  return generated.map(gen => {
    const prev = existingMap.get(gen.conversationId);
    if (!prev) return gen;

    return {
      ...gen,                          // Refresh participant metadata (name, online status, etc.)
      messages:     prev.messages,    // Preserve message history
      lastMessage:  prev.lastMessage,
      unreadCount:  prev.unreadCount,
      typing:       prev.typing,
      lastActivity: prev.lastActivity,
    };
  });
}
