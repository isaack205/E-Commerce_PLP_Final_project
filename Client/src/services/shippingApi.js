// Import the central API instance
import API from './api';

// Shipping service
export const shippingService = {

    /**
     * Creates a new shipping record.
     * This is typically called by an admin/manager after an order is processed/paid.
     * @param {Object} shippingData - Data for the new shipping record (e.g., { orderId, addressId, status, trackingNumber }).
     * @returns {Promise<Object>} The newly created shipping record data.
     */
    createShipping: async (shippingData) => {
        try {
            const res = await API.post('/shippings', shippingData);
            return res.data;
        } catch (error) {
            console.error('Error creating shipping record:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves all shipping records (Admin/Manager access only).
     * @param {Object} [params={}] - Optional query parameters for filtering, pagination, etc.
     * @returns {Promise<Object[]>} An array of all shipping record data.
     */
    getAllShippings: async (params = {}) => {
        try {
            const res = await API.get('/shippings', { params });
            return res.data;
        } catch (error) {
            console.error('Error fetching all shipping records (Admin/Manager):', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves a single shipping record by its ID.
     * Accessible by admin, manager, and courier.
     * @param {string} shippingId - The ID of the shipping record to retrieve.
     * @returns {Promise<Object>} The shipping record data.
     */
    getShippingById: async (shippingId) => {
        try {
            const res = await API.get(`/shippings/${shippingId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching shipping record by ID ${shippingId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves a shipping record associated with a specific order ID.
     * Accessible by customer, admin, manager, and courier.
     * @param {string} orderId - The ID of the order to find the shipping record for.
     * @returns {Promise<Object>} The shipping record data for the specified order.
     */
    getShippingByOrderId: async (orderId) => {
        try {
            const res = await API.get(`/shippings/order/${orderId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching shipping record for order ID ${orderId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Updates an existing shipping record by its ID.
     * Accessible by admin, manager, and courier.
     * @param {string} shippingId - The ID of the shipping record to update.
     * @param {Object} updateData - The data to update the shipping record with (e.g., { status: 'shipped', trackingNumber: 'XYZ123' }).
     * @returns {Promise<Object>} The updated shipping record data.
     */
    updateShipping: async (shippingId, updateData) => {
        try {
            const res = await API.patch(`/shippings/${shippingId}`, updateData);
            return res.data;
        } catch (error) {
            console.error(`Error updating shipping record by ID ${shippingId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Deletes a shipping record by its ID (Admin access only).
     * @param {string} shippingId - The ID of the shipping record to delete.
     * @returns {Promise<Object>} A confirmation message for the deletion.
     */
    deleteShipping: async (shippingId) => {
        try {
            const res = await API.delete(`/shippings/${shippingId}`);
            return res.data;
        } catch (error) {
            console.error(`Error deleting shipping record by ID ${shippingId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
