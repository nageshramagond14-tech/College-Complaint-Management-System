const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

// Admin only routes
router.get('/all', authMiddleware, adminMiddleware, UserController.getAllUsers);
router.get('/stats', authMiddleware, adminMiddleware, UserController.getUserStats);
router.delete('/:userId', authMiddleware, adminMiddleware, UserController.deleteUser);

module.exports = router;
