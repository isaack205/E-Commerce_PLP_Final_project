const Cart = require('../models/cart');
const Product = require('../models/product'); // Needed to get product price

// Create a new cart or add items to an existing cart
exports.createOrUpdateCart = async (req, res) => {
    try {
        const { userId, items } = req.body; // items is an array of { productId, quantity }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ user: userId, items: [] });
        }

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
            }

            const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.toString() === item.product);

            if (existingItemIndex > -1) {
                // Update quantity and priceAtAddToCart if product already in cart
                cart.items[existingItemIndex].quantity += item.quantity;
                cart.items[existingItemIndex].priceAtAddToCart = product.price; // Update to current price
            } else {
                // Add new item to cart
                cart.items.push({
                    product: item.product,
                    quantity: item.quantity,
                    priceAtAddToCart: product.price
                });
            }
        }

        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a cart by user ID
exports.getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('user').populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove an item from the cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update quantity of an item in the cart
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear the entire cart for a user
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOneAndDelete({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};