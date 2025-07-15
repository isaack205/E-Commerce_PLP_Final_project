// controllers/shippingController.js
const Shipping = require('../models/shipping');
const Order = require('../models/order');
const mongoose = require('mongoose')

// Helper function to validate shipping status
const isValidShippingStatus = (status) => {
    const allowedStatuses = ['pending', 'shipped', 'in-transit', 'out-for-delivery', 'delivered', 'cancelled', 'returned'];
    return allowedStatuses.includes(status);
};

// Create a new shipping record
exports.createShipping = async (req, res) => {
    try {
        const { order, address, status, trackingNumber } = req.body;

        // Basic validation
        if (!order || !mongoose.Types.ObjectId.isValid(order)) {
            return res.status(400).json({ message: 'Order ID is required and must be valid.' });
        }
        if (!address || !mongoose.Types.ObjectId.isValid(address)) {
            return res.status(400).json({ message: 'Address ID is required and must be valid.' });
        }
        if (status && !isValidShippingStatus(status)) {
            return res.status(400).json({ message: `Invalid initial status: ${status}.` });
        }

        const shipping = await Shipping.create({
            order,
            address,
            status: status || 'pending', // Default to 'pending' if not provided
            trackingNumber
        });

        res.status(201).json({message: "Shipping created successfully", shipping});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all shipping records
exports.getAllShippings = async (req, res) => {
    try {
        const shippings = await Shipping.find()
            .populate('order', 'user, totalAmount status')
            .populate('address', 'city country postalCode');
        if (!shippings || shippings.length === 0) {
            return res.status(200).json({ message: "No shipping records found", shippings: [] });
        }
        res.status(200).json({message: "Shippings fetched successfully", shippings});
    } catch (error) {
        console.error('Error fetching all shipping records:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single shipping record by ID
exports.getShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id)
            .populate('order', 'user totalAmount status')
            .populate('address');
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping record not found' });
        }
        res.status(200).json({message: "Shipping fetched successfully", shipping});
    } catch (error) {
        console.error('Error fetching shipping record by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get shipping record by order ID
exports.getShippingByOrderId = async (req, res) => {
    try {
        const shipping = await Shipping.findOne({ order: req.params.orderId }).populate('order', 'user totalAmount status').populate('address');
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping record not found for this order' });
        }
        res.status(200).json({message: "Shipping fetched by id successfully", shipping});
    } catch (error) {
        console.error('Error fetching shipping record by order ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update a shipping record by ID
exports.updateShipping = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session for the transaction
    session.startTransaction();

    try {
        const { trackingNumber, status, shippedAt, deliveredAt } = req.body;

        const updateData = {};
        let newOrderStatus = null;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber; // Allow setting to null/empty string
        if (status !== undefined) {
            if (!isValidShippingStatus(status)) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Invalid shipping status: ${status}.` });
            }
            updateData.status = status;
            // Auto-set timestamps based on status change if not explicitly provided
            if (status === 'shipped' && !shippedAt) {
                updateData.shippedAt = new Date();
                newOrderStatus = 'shipped';
            }
            if (status === 'delivered' && !deliveredAt) {
                updateData.deliveredAt = new Date();
                newOrderStatus = 'delivered';
            }
        }
        if (shippedAt !== undefined) updateData.shippedAt = shippedAt === null ? null : new Date(shippedAt); // Allow null
        if (deliveredAt !== undefined) updateData.deliveredAt = deliveredAt === null ? null : new Date(deliveredAt); // Allow null

        // Prevent updating order/address references directly via this endpoint
        if (req.body.order || req.body.address) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Order or Address references cannot be updated directly via this endpoint.' });
        }

        const updatedShipping = await Shipping.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true, session })
            .populate('order', 'user totalAmount status')
            .populate('address');
        if (!updatedShipping) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Shipping record not found' });
        }

        // --- Synchronize Order Status ---
        if (newOrderStatus && updatedShipping.order) {
            // Fetch the order within the same session
            const orderToUpdate = await Order.findById(updatedShipping.order._id).session(session);
            if (orderToUpdate && orderToUpdate.status !== newOrderStatus) { // Only update if status is different
                orderToUpdate.status = newOrderStatus;
                await orderToUpdate.save({ session });
                console.log(`Order ${orderToUpdate._id} status updated to: ${newOrderStatus}`);
            }
        }

        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        res.status(200).json({message: "Shipping updated successfully", updatedShipping});
    } catch (error) {
        // --- Abort Transaction on Error ---
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        console.error('Error updating shipping record:', error);
        res.status(400).json({ error: error.message });
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
        console.error('Error deleting shipping record:', error);
        res.status(500).json({ error: error.message });
    }
};