import { useState, useEffect, useCallback } from 'react';
import { complaintService } from '../services/complaintService';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all complaints
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load complaints on mount
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Create a new complaint
  const createComplaint = async (complaintData) => {
    setLoading(true);
    try {
      const newComplaint = await complaintService.createComplaint(complaintData);
      setComplaints(prev => [newComplaint, ...prev]);
      return newComplaint;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update complaint
  const updateComplaint = async (id, updateData) => {
    setLoading(true);
    try {
      const updated = await complaintService.updateComplaint(id, updateData);
      setComplaints(prev =>
        prev.map(c => (c.id === id ? updated : c))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete complaint
  const deleteComplaint = async (id) => {
    setLoading(true);
    try {
      await complaintService.deleteComplaint(id);
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status
  const updateStatus = async (id, status) => {
    try {
      const updated = await complaintService.updateStatus(id, status);
      setComplaints(prev =>
        prev.map(c => (c.id === id ? updated : c))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Search complaints
  const searchComplaints = async (query) => {
    setLoading(true);
    try {
      const results = await complaintService.searchComplaints(query);
      setComplaints(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    complaints,
    loading,
    error,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    updateStatus,
    searchComplaints,
    refreshComplaints: fetchComplaints,
  };
};
