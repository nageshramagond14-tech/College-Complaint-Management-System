const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');

class UserController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async register(req, res) {
    try {
      const { name, email, password, role = 'student' } = req.body;

      // Create user
      const user = await UserService.createUser({
        name,
        email,
        password,
        role
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  /**
   * Login user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Validate password
      const isPasswordValid = await UserService.validatePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Remove password from response
      user.password = undefined;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  /**
   * Get user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      
      const user = await UserService.findUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  }

  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, email } = req.body;

      const updatedUser = await UserService.updateUser(userId, { name, email });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  /**
   * Get all users (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role } = req.query;

      const users = await UserService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        role
      });

      res.status(200).json({
        success: true,
        data: {
          users
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }

  /**
   * Delete user (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const deletedUser = await UserService.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }

  /**
   * Get user statistics (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getUserStats(req, res) {
    try {
      const stats = await UserService.getUserStats();

      res.status(200).json({
        success: true,
        data: {
          stats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user statistics'
      });
    }
  }
}

module.exports = UserController;
