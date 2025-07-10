// Imports
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');

// Create a new order from a user's cart
exports.createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot create an order.' });
        }

        // Prepare order items from cart items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price // Use current product price
        }));

        // Calculate total amount
        const totalAmount = orderItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paid: false // Initial status, will be updated by payment
        });

        const savedOrder = await newOrder.save();

        // Optionally, clear the cart after creating the order
        await Cart.findOneAndDelete({ user: userId });

        res.status(201).json({message: "Order created", savedOrder});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .populate('items.product');
        if(!orders || orders.length === 0) {
            return res.status(404).json({message: "No orders found"})
        }
        res.status(200).json({message: "Orders fetched successfully", orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user')
            .populate('items.product');
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
        const orders = await Order.find({ user: req.params.userId })
            .populate('user')
            .populate('items.product');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }
        res.status(200).json({message: "Orders for this user fetched successfully", orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID (e.g., status update)
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({message: "Order updated successfully", updatedOrder});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};