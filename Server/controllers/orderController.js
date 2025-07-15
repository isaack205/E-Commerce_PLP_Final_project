// Imports
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Address = require('../models/address');
const Shipping = require('../models/shipping');
const mongoose = require('mongoose');

// Create a new order from a user's cart
exports.createOrder = async (req, res) => {

    const userId = req.user.id;
    const { addressId } = req.body;

    // --- Start Transaction ---
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Valid addressId is required to create an order.' });
        }

        // Verify the address belongs to the user
        const shippingAddress = await Address.findOne({ _id: addressId, user: userId }).session(session);
        if (!shippingAddress) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Shipping address not found or does not belong to this user.' });
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session); // Use session
        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Cart is empty. Cannot create an order.' });
        }

        // Prepare order items and perform stock checks/deductions
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id).session(session); // Use session
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product ${item.product.name || item.product._id} not found.` });
            }

            // --- Stock Check at Order Creation ---
            if (item.quantity > product.stockQuantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Requested ${item.quantity}, but only ${product.stockQuantity} available.`
                });
            }

            // Deduct stock
            product.stockQuantity -= item.quantity;
            await product.save({ session }); // Use session for saving product

            orderItems.push({
                product: item.product._id, // Use _id for reference
                quantity: item.quantity,
                price: item.priceAtAddToCart // Reflects price when added to cart
            });

            totalAmount += item.quantity * item.priceAtAddToCart; // Use priceAtAddToCart for total calculation
        }

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingAddress: addressId,
            totalAmount,
            paid: false, // Initial status, will be updated by payment
            status: 'pending'
        });

        const savedOrder = await newOrder.save({ session });

        // --- IMPORTANT: Create the Shipping document ---
        const newShipping = new Shipping({
            order: savedOrder._id,
            address: addressId,
            status: 'pending' // Initial status for the shipment itself
        });
        await newShipping.save({ session });

        // Clear the cart after creating the order
        await Cart.findOneAndDelete({ user: userId }).session(session);

        // --- Commit Transaction ---
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({message: "Order created", order: savedOrder, shipping: newShipping});
    } catch (error) {
        // --- Abort Transaction on Error ---
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();

        res.status(500).json({ Error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('items.product', 'name price image');
        if(!orders || orders.length === 0) {
            return res.status(200).json({message: "No orders found", orders: []})
        }
        res.status(200).json({message: "Orders fetched successfully", orders});
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username email')
            .populate('items.product', 'name price image');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({message: "Order fetched successfully", order});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
    try {
        const requestedUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        // Authorization check: Customer can only view their own orders
        if (authenticatedUserRole === 'customer' && requestedUserId !== authenticatedUserId) {
            return res.status(403).json({ message: "Forbidden: Customers can only view their own orders." });
        }
        const orders = await Order.find({ user: requestedUserId })
            .populate('user', 'username email')
            .populate('items.product', 'name price image');
        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this user.' });
        }
        res.status(200).json({message: "Orders for this user fetched successfully", orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID (e.g., status update)
exports.updateOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const authenticatedUserRole = req.user.role;
        const orderId = req.params.id;
        const updateData = req.body;

        // Determine allowed updates based on role
        if (authenticatedUserRole === 'customer') {
            // Abort transaction on forbidden access
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Forbidden: Customers cannot update orders.' });
        }

        let newShippingStatus = null;
        if (updateData.status !== undefined) {
            // Mapping order status to shipping status
            switch (updateData.status) {
                case 'pending':
                    newShippingStatus = 'pending';
                    break;
                case 'shipped': 
                    newShippingStatus = 'shipped';
                    break;
                case 'delivered':
                    newShippingStatus = 'delivered';
                    break;
                default:
                    // If an unknown status is provided, don't update shipping status
                    break;
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true, runValidators: true, session })
            .populate('user', 'username email')
            .populate('items.product', 'name price image');
        
        if (!updatedOrder) {
            // Abort transaction on order not found
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Order not found' });
        }

        // Add synchronization logic for Shipping status
        if (newShippingStatus && updatedOrder.shippingAddress) {
            // Find the associated shipping record within the same transaction
            const shippingToUpdate = await Shipping.findOne({ order: updatedOrder._id }).session(session);

            if (shippingToUpdate && shippingToUpdate.status !== newShippingStatus) { // Only update if status is different
                shippingToUpdate.status = newShippingStatus;
                // Auto-set timestamps in shipping if status changes to shipped/delivered via order update
                if (newShippingStatus === 'shipped' && !shippingToUpdate.shippedAt) {
                    shippingToUpdate.shippedAt = new Date();
                }
                if (newShippingStatus === 'delivered' && !shippingToUpdate.deliveredAt) {
                    shippingToUpdate.deliveredAt = new Date();
                }
                await shippingToUpdate.save({ session });
                console.log(`Shipping record for Order ${updatedOrder._id} status updated to: ${newShippingStatus}`);
            }
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({message: "Order updated successfully", updatedOrder});
    } catch (error) {
        // Abort transaction on error
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        console.error('Error updating order:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const authenticatedUserRole = req.user.role;
        const orderId = req.params.id;

        // Authorization check: Only admins should delete orders
        if (authenticatedUserRole === 'customer') {
            return res.status(403).json({ message: 'Forbidden: Customers cannot delete orders.' });
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};