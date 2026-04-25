const Joi = require('joi');

// Complaint creation validation schema
const createComplaintSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(20)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required'
    }),
  category: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category cannot exceed 50 characters',
      'any.required': 'Category is required'
    }),
  department: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Department must be at least 2 characters long',
      'string.max': 'Department cannot exceed 50 characters',
      'any.required': 'Department is required'
    })
});

// Complaint update validation schema
const updateComplaintSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  description: Joi.string()
    .min(20)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  category: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category cannot exceed 50 characters'
    }),
  department: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Department must be at least 2 characters long',
      'string.max': 'Department cannot exceed 50 characters'
    }),
  status: Joi.string()
    .valid('pending', 'in-progress', 'resolved')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, resolved'
    })
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    console.log('Validation - req.body:', JSON.stringify(req.body, null, 2));
    console.log('Validation - req.file:', req.file);
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      console.log('Validation errors:', errorMessages);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    console.log('Validation passed, calling next');
    next();
  };
};

module.exports = {
  createComplaint: validate(createComplaintSchema),
  updateComplaint: validate(updateComplaintSchema)
};
