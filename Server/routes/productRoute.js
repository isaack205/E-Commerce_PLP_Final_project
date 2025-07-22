// Imports
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { validateProductCreation } = require('../middlewares/productValidation');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory } = require('../controllers/productController');
const upload = require('../middlewares/uploadCloud');

// Create product
router.post('/', protect, authorize(['admin', 'manager']), upload.single('productImage'), validateProductCreation, createProduct);

// Get products
router.get('/', getAllProducts);

// Get product by id
router.get('/:id', getProductById);

// Update product by id
router.put('/:id', protect, authorize(['admin', 'manager']), upload.single('productImage'), updateProduct);

// Delete product by id
router.delete('/:id', protect, authorize(['admin', 'manager']), deleteProduct);

// Get product by category
router.get('/category/:categoryId', getProductsByCategory);

// Export
module.exports = router;