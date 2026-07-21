export const InvitationService = {
  generateToken: () => {
    return 'tok_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },

  generateInvitationCode: (role) => {
    const chars = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ';
    let prefix = 'FAC';
    const roleUpper = (role || '').toUpperCase();
    if (roleUpper.includes('OWNER')) prefix = 'OWN';
    else if (roleUpper.includes('ADMIN')) prefix = 'ADM';
    else if (roleUpper.includes('MANAGER') || roleUpper.includes('PROGRAM')) prefix = 'MGR';
    else if (roleUpper.includes('FACILITATOR')) prefix = 'FAC';
    else if (roleUpper.includes('TRAINER')) prefix = 'TRN';
    else if (roleUpper.includes('MEMBER') || roleUpper.includes('TEAM')) prefix = 'EMP';
    else if (roleUpper.includes('LEARNER') || roleUpper.includes('PARTICIPANT')) prefix = 'LRN';
    else if (roleUpper.includes('VIEWER')) prefix = 'VWR';

    let code = `OYEN-${prefix}-`;
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  },

  createInvitation: (email, role, invitedBy = 'Admin', name = '') => {
    const today = new Date();
    const expires = new Date(today.getTime() + 7 * 86400000); // 7 days expiry
    const fmt = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const code = InvitationService.generateInvitationCode(role);
    const token = InvitationService.generateToken();

    return {
      name: name || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role: role,
      workspaceId: 'WS-OYEN-GRID',
      organizationId: 'ORG-43A81Q',
      accessCode: code,
      token: token,
      status: 'Pending',
      invitedBy: invitedBy,
      invitedAt: fmt(today),
      expiresAt: fmt(expires),
      used: false,
      password: null,
      lastLogin: null
    };
  },

  sendInvitation: async (invitation) => {
    try {
      const inviteLink = `${window.location.origin}/accept?token=${invitation.token}`;
      const payload = {
        email: invitation.email,
        role: invitation.role,
        inviteLink: inviteLink,
        orgName: 'OYEN GRID',
        orgId: invitation.organizationId,
        inviteCode: invitation.accessCode
      };

      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation email');
      }
      return { success: true, message: 'Invitation Sent.', inviteLink };
    } catch (error) {
      console.warn('sendInvitation failed, returning successful creation status with link:', error.message);
      // Return success with warning so user can copy link manually
      const inviteLink = `${window.location.origin}/accept?token=${invitation.token}`;
      return { 
        success: false, 
        message: 'Invitation Created Successfully. Copy this invitation link and share it manually.',
        inviteLink 
      };
    }
  }
};
