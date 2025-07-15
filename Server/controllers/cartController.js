const Cart = require('../models/cart');
const Product = require('../models/product'); // Needed to get product price

// Create a new cart or add items to an existing cart
exports.createOrUpdateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body; // items is an array of { productId, quantity }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ user: userId, items: [] });
        }

        for (const item of items) {
            // This line checks for 'item.productId'
            if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({ message: "Each item must have a valid productId and a positive quantity." });
            }
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }

            const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.toString() === item.productId);
            let newQuantityInCart; // This will be the total quantity of this item in the cart after this operation

            if (existingItemIndex > -1) {
                // If item exists, sum existing quantity with new requested quantity
                newQuantityInCart = cart.items[existingItemIndex].quantity + item.quantity;
            } else {
                // If new item, the quantity in cart is just the requested quantity
                newQuantityInCart = item.quantity;
            }

            // --- STOCK CHECK ADDITION ---
            if (newQuantityInCart > product.stockQuantity) {
                return res.status(400).json({
                    message: `Cannot add ${item.quantity} of ${product.name}. Only ${product.stockQuantity - (existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0)} items available.`
                });
            }

            if (existingItemIndex > -1) {
                // Update quantity and priceAtAddToCart if product already in cart
                cart.items[existingItemIndex].quantity += item.quantity;
                cart.items[existingItemIndex].priceAtAddToCart = product.price; // Update to current price
            } else {
                // Add new item to cart
                cart.items.push({
                    product: item.productId,
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
        const requestedUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        if(authenticatedUserRole === 'customer' && requestedUserId !== authenticatedUserId) { 
            return res.status(403).json({message: "Forbidden: Customers can only view their own cart"})
        }
        const cart = await Cart.findOne({ user: req.params.userId }).populate('user', 'username email').populate('items.product', 'name price image');
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
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required to remove an item." });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        // Filter out item to be removed
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if(cart.items.length === initialLength) {
            return res.status(404).json({message: "Product not found in cart to remove"});
        }

        await cart.save();
        cart.populate('items.product', 'name price image')

        res.status(200).json({message: "Item removed from cart successfully", cart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update quantity of an item in the cart
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ message: 'Product ID and a positive quantity are required.' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            const product = await Product.findById(productId); // Get product to check stock
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productId} not found.` });
            }

            // --- STOCK CHECK ADDITION ---
            if (quantity > product.stockQuantity) {
                return res.status(400).json({
                    message: `Cannot set quantity to ${quantity}. Only ${product.stockQuantity} items available for ${product.name}.`
                });
            }

            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            cart = await cart.populate('items.product', 'name price image')
            res.status(200).json({message: "Item quantity updated successfully", cart});
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
        const requestedUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        if(authenticatedUserRole === 'customer' && requestedUserId !== authenticatedUserId) { 
            return res.status(403).json({message: "Forbidden: Customers can only view their own cart"})
        }
        const cart = await Cart.findOneAndDelete({ user: requestedUserId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};