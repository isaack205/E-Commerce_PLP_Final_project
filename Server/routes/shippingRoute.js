// Imports
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { createShipping, getAllShippings, getShippingById, getShippingByOrderId, updateShipping, deleteShipping } = require('../controllers/shippingController');

// Create a new shipping record (often triggered internally after an order is paid)
router.post('/', protect, authorize(['admin', 'manager']), createShipping);

// Get all shipping records (admin/manager access)
router.get('/', protect, authorize(['admin', 'manager']), getAllShippings);

// Get a single shipping record by ID
router.get('/:id', authorize(['admin', 'manager', 'courier']), getShippingById);

// Get shipping record by order ID
router.get('/order/:orderId', protect, authorize(['customer', 'admin', 'manager', 'courier']), getShippingByOrderId);

// Update a shipping record (e.g., status, tracking number, typically manager/courier/admin)
router.put('/:id', protect, authorize(['admin', 'manager', 'courier']), updateShipping);

// Delete a shipping record (typically admin access)
router.delete('/:id', protect, authorize(['admin']), deleteShipping);

// Export
module.exports = router;