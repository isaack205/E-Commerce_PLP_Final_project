// Import mongoose
const mongoose = require('mongoose');

// Payment model
const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Linked order
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who paid
    amount: { type: Number, required: true, min: 0 }, // Payment amount
    method: { type: String, required: true }, // e.g. 'credit card', 'paypal'
    status: { type: String, default: 'pending' }, // e.g. 'pending', 'completed', 'failed'
    transactionId: { type: String }, // From payment gateway
    paidAt: { type: Date } // When payment was made
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;