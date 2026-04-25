import { auth } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

/**
 * Generic fetch wrapper with error handling
 * Automatically adds Authorization header if token exists
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = auth.getToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON body (not FormData)
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
};

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   * @returns {Promise<Object>} - { user, token }
   */
  async register(userData) {
    const data = await apiFetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      auth.setToken(data.token);
    }

    return data;
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { user, token }
   */
  async login(credentials) {
    const data = await apiFetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      auth.setToken(data.token);
    }

    return data;
  },

  /**
   * Logout user - removes token from storage
   */
  logout() {
    auth.removeToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return auth.isAuthenticated();
  },
};

export default authService;
