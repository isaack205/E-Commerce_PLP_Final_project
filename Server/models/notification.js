// Import mongoose
const mongoose = require('mongoose');

// Notification model
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who receives the notification
    message: { type: String, required: true }, // Notification text
    type: { type: String, default: 'info' }, // e.g. 'info', 'order', 'payment'
    read: { type: Boolean, default: false }, // Has the user read it?
    createdAt: { type: Date, default: Date.now } // When notification was created
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;