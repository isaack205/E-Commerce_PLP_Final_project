// Imports
const mongoose = require('mongoose');

// Helper function to generate SKU
function generateSKU(brand, category, id, variant) {
    return `${brand}-${category}-${id}${variant ? '-' + variant : ''}`;
}

// ProductSchema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, maxlength: 100, default: null },
    price: { type: Number, required: true, min: [0, 'Price cannot be a negative'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, default: 'default-post.jpg' },
    brand: { type: String }, // Add brand if needed
    variant: { type: String }, // Add variant if needed
    sku: { type: String, unique: true },
    stockQuantity: { type: Number, default: 0, min: [0, 'Stock quantity cannot be negative'], required: true }
},
{ timestamps: true }
);

// Pre-save middleware to generate SKU
productSchema.pre('save', function(next) {
    if (!this.sku) {
        // Use placeholders if brand/variant not set
        const brand = this.brand || 'Brand';
        const variant = this.variant || '';
        // Use the category ObjectId as string or populate for name
        const category = this.category ? this.category.toString() : 'Category';
        // Use _id if already assigned, else will be assigned after save
        const id = this._id ? this._id.toString().slice(-4) : Math.floor(Math.random() * 10000);
        this.sku = generateSKU(brand, category, id, variant);
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

// Export model
module.exports = Product;