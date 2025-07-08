// Import mongoose
const mongoose = require('mongoose');

// Review model
const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Product reviewed
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reviewer
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating 1-5
    comment: { type: String }, // Review text
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; // Export model