import { auth } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Generic API fetch helper
 * Handles auth headers, JSON parsing, and error formatting
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

export const complaintService = {
  /**
   * GET /api/complaints
   * Returns array of complaints (unwraps { complaints, pagination })
   */
  async getAllComplaints(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/complaints?${queryString}` : '/api/complaints';
    const data = await apiFetch(url);
    return data.complaints || [];
  },

  /**
   * GET /api/complaints/:id
   * Returns single complaint (unwraps { complaint })
   */
  async getComplaintById(id) {
    const data = await apiFetch(`/api/complaints/${id}`);
    return data.complaint;
  },

  /**
   * POST /api/complaints
   * Creates new complaint with optional file upload
   */
  async createComplaint(complaintData) {
    const formData = new FormData();
    formData.append('title', complaintData.title);
    formData.append('description', complaintData.description);
    formData.append('category', complaintData.category);
    formData.append('department', complaintData.department);

    if (complaintData.media) {
      formData.append('media', complaintData.media);
    }

    const data = await apiFetch('/api/complaints', {
      method: 'POST',
      body: formData,
    });

    return data.complaint;
  },

  /**
   * PUT /api/complaints/:id
   * Updates existing complaint
   */
  async updateComplaint(id, updateData) {
    const data = await apiFetch(`/api/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    return data.complaint;
  },

  /**
   * PATCH /api/complaints/:id/status
   * Updates complaint status (admin/department only)
   */
  async updateStatus(id, status) {
    const data = await apiFetch(`/api/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    return data.complaint;
  },

  /**
   * DELETE /api/complaints/:id
   * Deletes a complaint
   */
  async deleteComplaint(id) {
    await apiFetch(`/api/complaints/${id}`, {
      method: 'DELETE',
    });

    return { success: true };
  },

  /**
   * GET /api/complaints with search query
   */
  async searchComplaints(query) {
    const data = await apiFetch(`/api/complaints?search=${encodeURIComponent(query)}`);
    return data.complaints || [];
  },
};
