/**
 * Auth utility for token management
 * Uses localStorage to persist JWT token across page reloads
 */

const TOKEN_KEY = 'complaint_portal_token';

export const auth = {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Save token to localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Remove token (logout)
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },
};

export default auth;
