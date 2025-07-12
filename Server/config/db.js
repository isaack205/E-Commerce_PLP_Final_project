// Imports
const mongoose = require('mongoose');
const mongo_uri = process.env.MONGO_URI;

// Connecting to mongodb
const connectDB = async () => {
    try {
        await mongoose.connect(mongo_uri)
        console.log('MongoDB connected successfully') // Message when connection successful
    } catch (error) {
        console.error('Error connecting to mongoDB:', error.message) // Show the error
        process.exit(1); // Exits when not connected
    }
}

module.exports = connectDB; // Export