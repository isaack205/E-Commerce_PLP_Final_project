// Imports
const Payment = require('../models/payment');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body)
        res.status(201).json({message: "Payment created successfully", payment});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order').populate('user');
        if(!payments || payments.length === 0) {
            return res.status(404).json({messsage: "Payments not found"})
        }
        res.status(200).json({message: "Payments fetched successfully", payments});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('order').populate('user');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({message: "Payment fetched successfully", payment});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({message: "Payment updated successfully", updatedPayment});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};