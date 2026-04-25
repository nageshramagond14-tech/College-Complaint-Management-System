const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware called - next type:', typeof next);
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await UserService.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found.'
      });
    }

    // Add user to request object
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Server error in authentication.'
      });
    }
  }
};

module.exports = authMiddleware;
