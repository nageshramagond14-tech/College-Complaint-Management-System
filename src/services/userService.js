const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async createUser(userData) {
    try {
      // Hash password before saving
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const newUser = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User document
   */
  static async findUserByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User document
   */
  static async findUserById(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    return await User.findById(userId);
  }

  /**
   * Get all users (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  static async getAllUsers(options = {}) {
    const { page = 1, limit = 10, role } = options;
    
    const query = role ? { role } : {};
    
    const skip = (page - 1) * limit;
    
    return await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  /**
   * Update user by ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user
   */
  static async updateUser(userId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    // Remove password from update data if present
    if (updateData.password) {
      delete updateData.password;
    }

    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
  }

  /**
   * Delete user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Deleted user
   */
  static async deleteUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    return await User.findByIdAndDelete(userId);
  }

  /**
   * Validate user password
   * @param {string} plainPassword - Plain password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} Password match result
   */
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  static async getUserStats() {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const admins = await User.countDocuments({ role: 'admin' });
    const departments = await User.countDocuments({ role: 'department' });
    
    return {
      totalUsers,
      students,
      admins,
      departments
    };
  }
}

module.exports = UserService;
