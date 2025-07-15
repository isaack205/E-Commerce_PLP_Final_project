// Import the central API instance
import API from './api';

// Cart service
export const cartService = {

    /**
     * Creates a new cart or updates an existing one by adding/updating items.
     * This typically sends an array of items or a single item to be added/updated.
     * @param {Object} cartData - Data for the cart operation (e.g., { productId, quantity }).
     * The backend's `createOrUpdateCart` expects this.
     * @returns {Promise<Object>} The updated cart data from the backend.
     */
    createOrUpdateCart: async (cartData) => {
        try {
            // Backend route: POST /carts/
            const res = await API.post('/carts', cartData);
            return res.data;
        } catch (error) {
            console.error('Error creating or updating cart:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves a cart by a specific user ID.
     * Note: On the backend, 'customer' can only get their own cart (via protect middleware),
     * while 'admin' can get any user's cart.
     * @param {string} userId - The ID of the user whose cart is to be retrieved.
     * @returns {Promise<Object>} The cart data for the specified user.
     */
    getCartByUserId: async (userId) => {
        try {
            // Backend route: GET /carts/user/:userId
            const res = await API.get(`/carts/user/${userId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching cart for user ID ${userId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Removes a specific item from the cart.
     * @param {Object} itemData - Data identifying the item to remove (e.g., { productId: 'abc' }).
     * @returns {Promise<Object>} The updated cart data.
     */
    removeItemFromCart: async (itemData) => {
        try {
            // Backend route: PATCH /carts/remove-item
            const res = await API.patch('/carts/remove-item', itemData);
            return res.data;
        } catch (error) {
            console.error('Error removing item from cart:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Updates the quantity of a specific item in the cart.
     * @param {Object} updateData - Data for updating quantity (e.g., { productId: 'abc', quantity: 3 }).
     * @returns {Promise<Object>} The updated cart data.
     */
    updateCartItemQuantity: async (updateData) => {
        try {
            // Backend route: PATCH /carts/update-quantity
            const res = await API.patch('/carts/update-quantity', updateData);
            return res.data;
        } catch (error) {
            console.error('Error updating cart item quantity:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Clears all items from a user's cart.
     * @param {string} userId - The ID of the user whose cart is to be cleared.
     * @returns {Promise<Object>} A confirmation message or the cleared cart data.
     */
    clearCart: async (userId) => {
        try {
            // Backend route: DELETE /carts/user/:userId
            const res = await API.delete(`/carts/user/${userId}`);
            return res.data;
        } catch (error) {
            console.error(`Error clearing cart for user ID ${userId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
