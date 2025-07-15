// Import 
const { body, validationResult } = require('express-validator');
const fs = require('fs'); // Import file system module for deleting files

// Validate product creation
exports.validateProductCreation = [
    // Validate name
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min:3, max:20 }).withMessage('Name can only be between 3 and 20'),
    
    // Validate desc
    body('description')
        .optional({ checkFalsy: true })
        .isString().withMessage('Description must be a string')
        .isLength({ max:100 }).withMessage('Description canoot exceed 100 chracters'),

    // Validate price 
    body('price')
        .notEmpty().withMessage('Price cannot be empty')
        .isInt({ min: 0 }).withMessage('Price should be above postive (above 0)'),

    // Validate category
    body('category')
        .notEmpty().withMessage('Category ID is required')
        .isMongoId().withMessage('Category ID must be a valid MongoDB ID'),


    // Validate image


    // Validate brand
    body('brand')
        .optional({ checkFalsy: true })
        .isString().withMessage('Brand must be a string')
        .isLength({ min: 5, max:100 }).withMessage('Brand should be between 5 and 20 chracters'),

    // Validate variant
    body('variant')
        .optional({ checkFalsy: true })
        .isString().withMessage('Variant must be a string')
        .isLength({ min: 5, max:100 }).withMessage('Variant should be between 5 and 20 chracters'),

    // Validate stock quantity
    body('stockQuantity')
        .notEmpty().withMessage('Stock Quantity cannot be empty')
        .isInt({ min: 0 }).withMessage('Stock quantity cannot be less than 0'),

    // Check for validation result
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty) {
            // If validation fails and a file was uploaded, delete it
            if (req.file) {
               fs.unlink(req.file.path, (err) => { // Use fs.unlink (async) 
                    if (err) console.error('Error deleting uploaded file after validation error:', err);
                });
            }
            return res.status(400).json({success: false, message: "Validation error", error: errors.array()})
        }
        next(); // Go to next middleware
    }
]
