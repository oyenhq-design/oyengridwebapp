// src/services/chatSimulation.js
// ─────────────────────────────────────────────────────────────────────────────
// OYEN GRID Workspace Chat — Auto-Reply Simulation
//
// PURPOSE:
//   Temporarily simulates the other party responding to a message.
//   This is a development-only module that lives in complete isolation from
//   both App.jsx and the UI.
//
// REPLACING THIS WITH REAL SOCKETS:
//   When Socket.IO or Firebase Realtime DB is ready:
//   1. Delete this file.
//   2. In App.jsx, replace the `simulateReply(...)` call with your socket
//      event listener (socket.on('message', onReply)).
//   3. The `onTyping` and `onReply` callback signatures stay identical.
//   Zero changes required to App.jsx state logic or the drawer UI.
//
// USAGE:
//   import { simulateReply } from './chatSimulation';
//   const cancel = simulateReply(conversation, senderRole, { onTyping, onReply });
//   // cancel() aborts the simulation if the conversation closes mid-reply
// ─────────────────────────────────────────────────────────────────────────────

import { createMessage, MESSAGE_TYPE, MESSAGE_STATUS } from './chatService';

// ── Reply content pools ────────────────────────────────────────────────────────

const ADMIN_REPLIES = [
  "Got it — I'll take a look shortly.",
  'Thanks for the update. Keep up the great work!',
  'Understood. Let me know if you need anything else.',
  'Perfect — everything looks good on my end.',
  "Noted. I'll follow up with the programme owner.",
  "Appreciated. I'll confirm with the team and get back to you.",
  "That's helpful context. I'll action it now.",
  "Thanks for flagging that — I'll sort it out.",
];

const FACILITATOR_REPLIES = [
  "Thank you! I'll get right on it.",
  "Understood. I'll prepare that for the session.",
  "Thanks for the heads up — noted.",
  "Got it. I'll submit the attendance sheet before 5 PM.",
  "I'll review the materials tonight and let you know.",
  "Confirmed. See you at the session.",
  "Received. I'll reach out if I have any questions.",
  "Will do — I'll keep you posted.",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Timing constants (ms) ──────────────────────────────────────────────────────

const TYPING_DELAY_MS = 1500;
const REPLY_DELAY_MS  = 3800;

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Simulates a reply from the other party in a conversation.
 *
 * @param {object}   conversation  - The active Conversation object (from chatService schema)
 * @param {string}   senderRole    - Role of the user who just sent a message
 *                                   ('Facilitator' | 'Administrator')
 * @param {object}   callbacks
 * @param {function} callbacks.onTyping  - Called with (boolean) to toggle typing indicator
 * @param {function} callbacks.onReply   - Called with a new Message object when reply is ready
 *
 * @returns {function} cancel — call to abort the simulation (e.g. if drawer closes)
 */
export function simulateReply(conversation, senderRole, { onTyping, onReply }) {
  // Determine who is replying (the other side of the conversation)
  const replyingParticipant = conversation.participants.find(
    p => p.role !== senderRole
  ) || conversation.participants[0];

  const sendingParticipant = conversation.participants.find(
    p => p.role === senderRole
  ) || conversation.participants[1];

  // Choose reply pool based on the replying participant's role
  const replyPool =
    replyingParticipant.role === 'Administrator'
      ? ADMIN_REPLIES
      : FACILITATOR_REPLIES;

  let cancelled = false;

  const typingTimer = setTimeout(() => {
    if (!cancelled) onTyping(true);
  }, TYPING_DELAY_MS);

  const replyTimer = setTimeout(() => {
    if (cancelled) return;
    onTyping(false);

    const replyMsg = createMessage({
      conversationId: conversation.conversationId,
      senderId:       replyingParticipant.userId,
      receiverId:     sendingParticipant.userId,
      senderRole:     replyingParticipant.role,
      messageType:    MESSAGE_TYPE.TEXT,
      text:           pickRandom(replyPool),
      status:         MESSAGE_STATUS.READ,
    });

    onReply(replyMsg);
  }, REPLY_DELAY_MS);

  // Return cancel function
  return function cancel() {
    cancelled = true;
    clearTimeout(typingTimer);
    clearTimeout(replyTimer);
    onTyping(false);
  };
}
