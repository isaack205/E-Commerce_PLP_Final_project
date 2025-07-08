// Imports
const mongoose = require('mongoose');

// Cart schem
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: [1, 'Quantity cannot be negative'] },
        priceAtAddToCart: { type: Number, required: true, min: 0 }
    }],
    totalItems: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date, index: { expires: '2d' } },
}, 
    { timestamps: true }
);

cartSchema.pre('save', function(next) {
    let calculatedTotalItems = 0;
    let calculatedTotalPrice = 0;

    if (this.items && this.items.length > 0) {
        this.items.forEach(item => {
            calculatedTotalItems += item.quantity;
            calculatedTotalPrice += item.quantity * item.priceAtAddToCart;
        });
    }

    this.totalItems = calculatedTotalItems;
    this.totalPrice = calculatedTotalPrice;
    next();
})

const Cart = mongoose.model('Cart', cartSchema);

// Export model
module.exports = Cart;
