const ComplaintService = require('../services/complaintService');

class ComplaintController {
  /**
   * Create a new complaint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createComplaint(req, res) {
    try {
      console.log('Create complaint - req.body:', req.body);
      console.log('Create complaint - req.file:', req.file);
      console.log('Create complaint - req.user:', req.user);
      
      const { title, description, category, department } = req.body;
      
      // Manual validation for FormData
      if (!title || title.length < 5) {
        return res.status(400).json({
          success: false,
          message: 'Title must be at least 5 characters long'
        });
      }
      if (!description || description.length < 20) {
        return res.status(400).json({
          success: false,
          message: 'Description must be at least 20 characters long'
        });
      }
      if (!category || category.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Category is required'
        });
      }
      if (!department || department.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Department is required'
        });
      }
      
      const complaintData = {
        title,
        description,
        category,
        department,
        studentId: req.user.userId,
        media: req.file ? `/uploads/${req.file.filename}` : null
      };

      const complaint = await ComplaintService.createComplaint(complaintData);

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: {
          complaint
        }
      });
    } catch (error) {
      console.error('Create complaint error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create complaint'
      });
    }
  }

  /**
   * Get all complaints with pagination and search
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllComplaints(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        department,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await ComplaintService.getAllComplaints({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        department,
        search,
        sortBy,
        sortOrder
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get complaints'
      });
    }
  }

  /**
   * Get complaint by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getComplaintById(req, res) {
    try {
      const { complaintId } = req.params;

      const complaint = await ComplaintService.getComplaintById(complaintId);

      // Check if user is authorized to view this complaint
      if (req.user.role !== 'admin' && req.user.role !== 'department' && 
          complaint.studentId._id.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this complaint'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          complaint
        }
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Complaint not found'
      });
    }
  }

  /**
   * Update complaint by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateComplaint(req, res) {
    try {
      const { complaintId } = req.params;
      const updateData = req.body;

      // First get the complaint to check authorization
      const existingComplaint = await ComplaintService.getComplaintById(complaintId);

      // Check if user is authorized to update this complaint
      if (req.user.role !== 'admin' && req.user.role !== 'department' && 
          existingComplaint.studentId._id.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this complaint'
        });
      }

      // Students can only update certain fields
      if (req.user.role === 'student') {
        const allowedFields = ['title', 'description', 'category'];
        const filteredData = {};
        
        Object.keys(updateData).forEach(key => {
          if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
          }
        });
        
        Object.assign(updateData, filteredData);
      }

      const updatedComplaint = await ComplaintService.updateComplaint(complaintId, updateData);

      res.status(200).json({
        success: true,
        message: 'Complaint updated successfully',
        data: {
          complaint: updatedComplaint
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update complaint'
      });
    }
  }

  /**
   * Delete complaint by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteComplaint(req, res) {
    try {
      const { complaintId } = req.params;

      // First get the complaint to check authorization
      const existingComplaint = await ComplaintService.getComplaintById(complaintId);

      // Check if user is authorized to delete this complaint
      if (req.user.role !== 'admin' && 
          existingComplaint.studentId._id.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this complaint'
        });
      }

      await ComplaintService.deleteComplaint(complaintId);

      res.status(200).json({
        success: true,
        message: 'Complaint deleted successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Complaint not found'
      });
    }
  }

  /**
   * Get complaints for the logged-in student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getMyComplaints(req, res) {
    try {
      const { page = 1, limit = 10, status, department } = req.query;

      const result = await ComplaintService.getComplaintsByStudent(req.user.userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        department
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get your complaints'
      });
    }
  }

  /**
   * Update complaint status (admin/department only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateComplaintStatus(req, res) {
    try {
      const { complaintId } = req.params;
      const { status } = req.body;

      const updatedComplaint = await ComplaintService.updateComplaintStatus(complaintId, status);

      res.status(200).json({
        success: true,
        message: 'Complaint status updated successfully',
        data: {
          complaint: updatedComplaint
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update complaint status'
      });
    }
  }

  /**
   * Get complaint statistics (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getComplaintStats(req, res) {
    try {
      const stats = await ComplaintService.getComplaintStats();

      res.status(200).json({
        success: true,
        data: {
          stats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get complaint statistics'
      });
    }
  }
}

module.exports = ComplaintController;
