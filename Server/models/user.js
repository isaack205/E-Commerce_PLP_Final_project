// Import
const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:{ type: String, enum: ['admin', 'manager', 'courier', 'customer'], default: 'customer' }
}, 
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// Export
module.exports = User;