// controllers/shippingController.js
const Shipping = require('../models/shipping');

// Create a new shipping record
exports.createShipping = async (req, res) => {
    try {
        const shipping = await Shipping.create(req.body);
        res.status(201).json({message: "Shipping created successfully", shipping});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all shipping records
exports.getAllShippings = async (req, res) => {
    try {
        const shippings = await Shipping.find().populate('order').populate('address');
        if(!shippings || shippings.length === 0) {
            return res.status(404).json({mesaage: "No shippings found"})
        }
        res.status(200).json({message: "Shippings fetched successfully", shippings});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single shipping record by ID
exports.getShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id).populate('order').populate('address');
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping record not found' });
        }
        res.status(200).json({message: "Shipping fetched successfully", shipping});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get shipping record by order ID
exports.getShippingByOrderId = async (req, res) => {
    try {
        const shipping = await Shipping.findOne({ order: req.params.orderId }).populate('order').populate('address');
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping record not found for this order' });
        }
        res.status(200).json({message: "Shipping fetched by id successfully", shipping});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a shipping record by ID
exports.updateShipping = async (req, res) => {
    try {
        const updatedShipping = await Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedShipping) {
            return res.status(404).json({ message: 'Shipping record not found' });
        }
        res.status(200).json({message: "Shipping updated successfully", updatedShipping});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a shipping record by ID
exports.deleteShipping = async (req, res) => {
    try {
        const deletedShipping = await Shipping.findByIdAndDelete(req.params.id);
        if (!deletedShipping) {
            return res.status(404).json({ message: 'Shipping record not found' });
        }
        res.status(200).json({ message: 'Shipping record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};