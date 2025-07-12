// Imports
const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/auth');

// Create a new payment (often triggered internally after an order)
router.post('/', protect, authorize(['customer', 'admin']), createPayment);

// Get all payments (typically admin/manager access)
router.get('/', protect, authorize(['admin', 'manager']), getAllPayments);

// Get a single payment by ID
router.get('/:id', protect, authorize(['admin', 'manager', 'customer']), getPaymentById);

// Update a payment (e.g., status update, typically admin/system)
router.put('/:id', protect, authorize(['admin']), updatePayment);

// Delete a payment (typically admin access)
router.delete('/:id', protect, authorize(['admin']), deletePayment);

// Export
module.exports = router;