// Imports
const express = require('express');
const router = express.Router();
const { createOrUpdateCart, getCartByUserId, removeItemFromCart, updateCartItemQuantity, clearCart } = require('../controllers/cartController');
const { protect, authorize } = require('../middlewares/auth');

// Create or update a cart (add/update items)
router.post('/', protect, authorize(['customer']), createOrUpdateCart);

// Get a cart by user ID
router.get('/user/:userId', protect, authorize(['customer', 'admin']), getCartByUserId);

// Remove an item from the cart
router.patch('/remove-item', protect, authorize(['customer']), removeItemFromCart);

// Update quantity of an item in the cart
router.patch('/update-quantity', protect, authorize(['customer']), updateCartItemQuantity);

// Clear the entire cart for a user
router.delete('/user/:userId', protect, authorize(['customer']), clearCart);

// Export
module.exports = router;