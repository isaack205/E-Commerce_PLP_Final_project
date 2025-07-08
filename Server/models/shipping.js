// Import mongoose
const mongoose = require('mongoose');

// Shipping model
const shippingSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Linked order
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }, // Shipping address
    status: { type: String, default: 'pending' }, // e.g. 'pending', 'shipped', 'delivered'
    trackingNumber: { type: String }, // Carrier tracking number
    shippedAt: { type: Date }, // When shipped
    deliveredAt: { type: Date } // When delivered
}, { timestamps: true });

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;