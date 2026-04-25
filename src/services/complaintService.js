const Complaint = require('../models/Complaint');
const mongoose = require('mongoose');

class ComplaintService {
  /**
   * Create a new complaint
   * @param {Object} complaintData - Complaint data
   * @returns {Promise<Object>} Created complaint
   */
  static async createComplaint(complaintData) {
    try {
      const complaint = await Complaint.create(complaintData);
      
      // Populate student information for response
      return await Complaint.findById(complaint._id).populate('studentId', 'name email');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Get all complaints with pagination and search
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Complaints and pagination info
   */
  static async getAllComplaints(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      studentId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (department) query.department = department;
    if (studentId) query.studentId = studentId;

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('studentId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(query)
    ]);

    return {
      complaints,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComplaints: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get complaint by ID
   * @param {string} complaintId - Complaint ID
   * @returns {Promise<Object|null>} Complaint document
   */
  static async getComplaintById(complaintId) {
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      throw new Error('Invalid complaint ID');
    }

    const complaint = await Complaint.findById(complaintId)
      .populate('studentId', 'name email');

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    return complaint;
  }

  /**
   * Update complaint by ID
   * @param {string} complaintId - Complaint ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated complaint
   */
  static async updateComplaint(complaintId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      throw new Error('Invalid complaint ID');
    }

    try {
      const complaint = await Complaint.findByIdAndUpdate(
        complaintId,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('studentId', 'name email');

      if (!complaint) {
        throw new Error('Complaint not found');
      }

      return complaint;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Delete complaint by ID
   * @param {string} complaintId - Complaint ID
   * @returns {Promise<Object|null>} Deleted complaint
   */
  static async deleteComplaint(complaintId) {
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      throw new Error('Invalid complaint ID');
    }

    const complaint = await Complaint.findByIdAndDelete(complaintId);
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    return complaint;
  }

  /**
   * Get complaints by student ID
   * @param {string} studentId - Student ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Student complaints and pagination info
   */
  static async getComplaintsByStudent(studentId, options = {}) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const { page = 1, limit = 10, status, department } = options;
    
    const query = { studentId };
    if (status) query.status = status;
    if (department) query.department = department;

    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(query)
    ]);

    return {
      complaints,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComplaints: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get complaint statistics
   * @returns {Promise<Object>} Complaint statistics
   */
  static async getComplaintStats() {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'in-progress' }),
      Complaint.countDocuments({ status: 'resolved' })
    ]);

    return {
      totalComplaints,
      byStatus: {
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints
      }
    };
  }

  /**
   * Update complaint status
   * @param {string} complaintId - Complaint ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated complaint
   */
  static async updateComplaintStatus(complaintId, status) {
    const validStatuses = ['pending', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be one of: pending, in-progress, resolved');
    }

    return await this.updateComplaint(complaintId, { status });
  }
}

module.exports = ComplaintService;
