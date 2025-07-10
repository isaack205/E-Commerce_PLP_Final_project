// Import from express-validator
const { body, validationResult } = require('express-validator');

exports.validateCategoryCreation = [
    // Validate name
    body('name')
        .trim()
        .notEmpty().withMessage('Category name cannot be empty')
        .isLength({ min:3, max:20 }).withMessage('Name should be between 3 and 20'),

    // Validate description
    body('description')
        .trim()
        .notEmpty().withMessage('Category description is required')
        .isLength({ min:5, max:100 }).withMessage('Category description should be between 5 and 100'),

    // Middleware to process validationresults
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", error: errors.array() })
        }
        next(); // Pass to the next middleware
    }
]
