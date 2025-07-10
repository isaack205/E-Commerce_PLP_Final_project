// middleware/userValidation.js
const { body, validationResult } = require('express-validator');

// Validation rules for user registration
exports.validateUserRegistration = [
  // Validate firstname
  body('firstname')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),

  // Validate lastname
  body('lastname')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),

  // Validate username
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric().withMessage('Username can only contain letters and numbers'),

  // Validate email
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  // Validate password
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),

  // Validate confirmPassword
  body('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      // 'value' is the confirmPassword, 'req.body.password' is the original password
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true; // Indicate that the custom validation passed
    }),

  // Validate role
  body('role')
    .optional() // Role is optional
    .isIn(['admin', 'manager', 'courier', 'customer']).withMessage('Invalid role specified'),

  // Middleware to process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    next(); // If all validations pass, proceed to the controller
  }
];

// Validation rules for login
exports.validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required for login')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required for login'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    next();
  }
];