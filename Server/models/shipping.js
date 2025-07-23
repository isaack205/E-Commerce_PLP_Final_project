// Import mongoose
const mongoose = require('mongoose');

// Shipping model
const shippingSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Linked order
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }, // Shipping address
    status: { type: String, enum: ['pending', 'shipped', 'in-transit', 'delivered', 'canceled', 'returned'], default: 'pending' },
    trackingNumber: { type: String, default: null }, // Carrier tracking number
    shippedAt: { type: Date, default: null }, // When shipped
    deliveredAt: { type: Date, default: null } // When delivered
}, { timestamps: true });

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;