// Import the central API instance
import API from './api';

// Order service
export const orderService = {

    /**
     * Creates a new order from the authenticated user's cart.
     * @returns {Promise<Object>} The newly created order data.
     */
    createOrder: async () => {
        try {
            // Backend route: POST /orders/
            const res = await API.post('/orders');
            return res.data;
        } catch (error) {
            console.error('Error creating order:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves all orders (Admin/Manager access only).
     * @param {Object} [params={}] - Optional query parameters for filtering, pagination, etc.
     * @returns {Promise<Object[]>} An array of all order data.
     */
    getAllOrders: async (params = {}) => {
        try {
            const res = await API.get('/orders', { params });
            return res.data;
        } catch (error) {
            console.error('Error fetching all orders (Admin/Manager):', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves a single order by its ID.
     * Accessible by customer (for their own orders), admin, manager, and courier.
     * @param {string} orderId - The ID of the order to retrieve.
     * @returns {Promise<Object>} The order data.
     */
    getOrderById: async (orderId) => {
        try {
            const res = await API.get(`/orders/${orderId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching order by ID ${orderId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves orders associated with a specific user ID.
     * Accessible by customer (for their own orders), admin, and manager.
     * @param {string} userId - The ID of the user whose orders are to be retrieved.
     * @param {Object} [params={}] - Optional query parameters for filtering, pagination, etc.
     * @returns {Promise<Object[]>} An array of order data for the specified user.
     */
    getOrdersByUserId: async (userId, params = {}) => {
        try {
            const res = await API.get(`/orders/user/${userId}`, { params });
            return res.data;
        } catch (error) {
            console.error(`Error fetching orders for user ID ${userId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Updates an existing order by its ID (Admin/Manager access only).
     * @param {string} orderId - The ID of the order to update.
     * @param {Object} updateData - The data to update the order with (e.g., { status: 'shipped' }).
     * @returns {Promise<Object>} The updated order data.
     */
    updateOrder: async (orderId, updateData) => {
        try {
            const res = await API.put(`/orders/${orderId}`, updateData);
            return res.data;
        } catch (error) {
            console.error(`Error updating order by ID ${orderId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Deletes an order by its ID (Admin access only).
     * @param {string} orderId - The ID of the order to delete.
     * @returns {Promise<Object>} A confirmation message for the deletion.
     */
    deleteOrder: async (orderId) => {
        try {
            const res = await API.delete(`/orders/${orderId}`);
            return res.data;
        } catch (error) {
            console.error(`Error deleting order by ID ${orderId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
