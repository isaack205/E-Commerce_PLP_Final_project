// Imports
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/auth');

// Route to initiate M-Pesa STK Push
router.post('/mpesa/stk-push', protect, authorize(['customer']), paymentController.initiateMpesaPayment);

// M-Pesa Callback URL (Webhook) - This route should NOT be protected by authentication
// M-Pesa will send data to this, not a user.
router.post('/mpesa/callback', paymentController.mpesaCallback);

// Export
module.exports = router;