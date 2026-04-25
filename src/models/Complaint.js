const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  media: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'resolved'],
      message: 'Status must be one of: pending, in-progress, resolved'
    },
    default: 'pending'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ title: 'text', description: 'text' });

// Virtual for complaint age
complaintSchema.virtual('age').get(function() {
  const now = new Date();
  const createdAt = this.createdAt;
  const diffTime = Math.abs(now - createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to validate student exists
complaintSchema.pre('save', async function() {
  if (this.isNew) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(this.studentId);
      if (!user) {
        throw new Error('Student not found');
      }
    } catch (error) {
      throw error;
    }
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
