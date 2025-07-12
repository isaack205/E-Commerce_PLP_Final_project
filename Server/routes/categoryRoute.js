// Imports
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { validateCategoryCreation } = require('../middlewares/categoryValidation');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategoryById } = require('../controllers/categoryController');

// Create a category
router.post('/', protect, authorize(['admin', 'manager']), validateCategoryCreation, createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get category by id
router.get('/:id', getCategoryById);

// Update category by id
router.put(':id', protect, authorize(['admin', 'manager']), updateCategory);

// Delete category by id
router.delete('/:id', protect, authorize(['admin', 'manager']), deleteCategoryById);

// Export
module.exports = router;