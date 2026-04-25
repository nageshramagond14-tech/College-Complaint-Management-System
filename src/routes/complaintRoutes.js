const express = require('express');
const ComplaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const departmentMiddleware = require('../middleware/department');
const { upload, handleMulterError } = require('../middleware/upload');
const complaintValidation = require('../middleware/complaintValidation');

const router = express.Router();

// Protected routes (require authentication)
router.post('/', 
  authMiddleware, 
  upload.single('media'), 
  handleMulterError,
  ComplaintController.createComplaint
);

router.get('/my-complaints', authMiddleware, ComplaintController.getMyComplaints);

// Admin/Department only routes
router.get('/stats', authMiddleware, adminMiddleware, ComplaintController.getComplaintStats);
router.patch('/:complaintId/status', authMiddleware, adminMiddleware, ComplaintController.updateComplaintStatus);

// Public/Protected routes with authorization checks in controllers
router.get('/', authMiddleware, ComplaintController.getAllComplaints);
router.get('/:complaintId', authMiddleware, ComplaintController.getComplaintById);
router.put('/:complaintId', authMiddleware, complaintValidation.updateComplaint, ComplaintController.updateComplaint);
router.delete('/:complaintId', authMiddleware, ComplaintController.deleteComplaint);

module.exports = router;
