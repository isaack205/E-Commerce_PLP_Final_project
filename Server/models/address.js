// Import mongoose
const mongoose = require('mongoose');

// Address model (for user shipping addresses)
const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of address
    addressLine1: { type: String, require: true },
    addressLine2: { default: null, type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
},
 { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);