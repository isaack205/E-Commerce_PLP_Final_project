// Import mongoose
const mongoose = require('mongoose');

// Order model
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who placed the order
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Product reference
        quantity: { type: Number, required: true, min: 1 }, // Quantity ordered
        price: { type: Number, required: true, min: 0 } // Price at order time
    }],
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }, // Shipping address
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'paid'], default: 'pending' }, // Order status
    totalAmount: { type: Number, required: true, min: 0 }, // Total price
    paid: { type: Boolean, default: false }, // Payment status
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; // Export model