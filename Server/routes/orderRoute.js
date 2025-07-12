// Imports
const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

// Create a new order from a user's cart
router.post('/', protect, authorize(['customer']), createOrder);

// Get all orders (admin/manager access)
router.get('/', protect, authorize(['manager', 'admin']), getAllOrders);

// Get a single order by ID
router.get('/:id', protect, authorize(['customer', 'admin', 'manager', 'courier']), getOrderById);

// Get orders by a specific user ID
router.get('/user/:userId', protect,  authorize(['customer', 'admin', 'manager']), getOrdersByUserId);

// Update an order (e.g., status update, typically admin/manager)
router.put('/:id', protect,  authorize(['admin', 'manager']), updateOrder);

// Delete an order (typically admin access)
router.delete('/:id', protect, authorize(['admin']), deleteOrder);

// Export
module.exports = router;