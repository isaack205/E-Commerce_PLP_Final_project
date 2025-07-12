// Imports
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { validateProductCreation } = require('../middlewares/productValidation');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory } = require('../controllers/productController');

// Create product
router.post('/', protect, authorize(['admin', 'manager']), validateProductCreation, createProduct);

// Get products
router.get('/', getAllProducts);

// Get product by id
router.get('/:id', getProductById);

// Update product by id
router.put('/:id', protect, authorize(['admin', 'manager']), updateProduct);

// Delete product by id
router.delete('/:id', protect, authorize(['admin', 'manager']), deleteProduct);

// Get product by category
router.get('category/:categoryId', getProductsByCategory);

// Export
module.exports = router;