
// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
}

// Mock users database - in a real app, this would be stored in a backend database
const USERS_STORAGE_KEY = 'brevity_users';
const CURRENT_USER_KEY = 'brevity_current_user';

// Helper functions to manage users in localStorage
const getUsers = (): Record<string, { id: string; name: string; email: string; password: string }> => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : {};
};

const saveUsers = (users: Record<string, any>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Register a new user
 */
export const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  
  // Check if email already exists
  if (users[email]) {
    return false;
  }
  
  // Create new user
  const userId = `user_${Date.now()}`;
  users[email] = {
    id: userId,
    name,
    email,
    password // In a real app, this would be hashed
  };
  
  saveUsers(users);
  
  // Log the user in
  const user = { id: userId, name, email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  return true;
};

/**
 * Login a user
 */
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  const user = users[email];
  
  if (user && user.password === password) {
    // Store logged in user
    const currentUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    return true;
  }
  
  return false;
};

/**
 * Get the current logged in user
 */
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(CURRENT_USER_KEY) !== null;
};
