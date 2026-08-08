/**
 * Unified Auth Service — OYEN GRID Platform
 * Single user registry foundation for Admins, Facilitators, and Learners.
 */

const STORAGE_USERS_KEY = 'oyen_unified_users';

// Pre-seeded system users if registry is uninitialized
const INITIAL_USERS = [
  {
    id: 'user-admin-1',
    name: 'John Doe',
    email: 'admin@oyengrid.com',
    passwordHash: 'password',
    role: 'Admin',
    status: 'active',
    password_changed: true,
    email_verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-learner-demo',
    name: 'Blessing Aliyu',
    email: 'blessing@gmail.com',
    passwordHash: '123456',
    role: 'Learner',
    status: 'invited',
    password_changed: false,
    email_verified: false,
    createdAt: new Date().toISOString()
  }
];

export const getUnifiedUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_USERS;
  }
};

export const saveUnifiedUsers = (users) => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Authenticate user credentials
  login: async (email, password) => {
    const users = getUnifiedUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.passwordHash !== password) {
      throw new Error('Invalid email or password');
    }

    return user;
  },

  // Admin invites a new learner / participant
  inviteParticipant: async ({ name, email, program, cohort }) => {
    const users = getUnifiedUsers();
    const cleanEmail = (email || '').trim().toLowerCase();

    let existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { user: existing, isNew: false, tempPassword: 'Already registered' };
    }

    const newUser = {
      id: `user-learner-${Date.now()}`,
      name: name || email.split('@')[0],
      email: cleanEmail,
      passwordHash: '123456', // Dev default temporary password
      role: 'Learner',
      status: 'invited',
      password_changed: false,
      email_verified: false,
      program: program || '',
      cohort: cohort || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUnifiedUsers(users);

    return {
      user: newUser,
      isNew: true,
      tempPassword: '123456'
    };
  },

  // First-time password change
  changePassword: async (email, currentPassword, newPassword) => {
    const users = getUnifiedUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (index === -1) {
      throw new Error('User not found');
    }

    if (users[index].passwordHash !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    users[index].passwordHash = newPassword;
    users[index].password_changed = true;
    users[index].status = 'active';

    saveUnifiedUsers(users);
    return users[index];
  },

  // Remove participant from auth registry
  removeParticipant: async (email) => {
    const users = getUnifiedUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const updated = users.filter(u => u.email.toLowerCase() !== cleanEmail);
    saveUnifiedUsers(updated);
  }
};

export default authService;
