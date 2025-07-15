// Import the central API instance
import API from './api';

// Address service
export const addressService = {

    /**
     * Creates a new address for the authenticated user.
     * @param {Object} addressData - The data for the new address (e.g., { street, city, state, zipCode, country }).
     * @returns {Promise<Object>} The newly created address data.
     */
    createAddress: async (addressData) => {
        try {
            // Backend route: POST /addresses/
            const res = await API.post('/addresses', addressData);
            return res.data;
        } catch (error) {
            console.error('Error creating address:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves all addresses (Admin/Manager access only).
     * @param {Object} [params={}] - Optional query parameters for filtering, pagination, etc.
     * @returns {Promise<Object[]>} An array of all address data.
     */
    getAllAddresses: async (params = {}) => {
        try {
            // Backend route: GET /addresses/
            const res = await API.get('/addresses', { params });
            return res.data;
        } catch (error) {
            console.error('Error fetching all addresses (Admin/Manager):', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves a single address by its ID.
     * Accessible by customer (for their own address) and admin.
     * @param {string} addressId - The ID of the address to retrieve.
     * @returns {Promise<Object>} The address data.
     */
    getAddressById: async (addressId) => {
        try {
            // Backend route: GET /addresses/:id
            const res = await API.get(`/addresses/${addressId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching address by ID ${addressId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Retrieves all addresses for a specific user ID.
     * Accessible by customer (for their own addresses) and admin.
     * @param {string} userId - The ID of the user whose addresses are to be retrieved.
     * @param {Object} [params={}] - Optional query parameters.
     * @returns {Promise<Object[]>} An array of address data for the specified user.
     */
    getAddressesByUserId: async (userId, params = {}) => {
        try {
            // Backend route: GET /addresses/user/:userId
            const res = await API.get(`/addresses/user/${userId}`, { params });
            return res.data;
        } catch (error) {
            console.error(`Error fetching addresses for user ID ${userId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Updates an existing address by its ID.
     * Accessible by customer (for their own address) and admin.
     * @param {string} addressId - The ID of the address to update.
     * @param {Object} updateData - The data to update the address with.
     * @returns {Promise<Object>} The updated address data.
     */
    updateAddress: async (addressId, updateData) => {
        try {
            // Backend route: PUT /addresses/:id
            const res = await API.put(`/addresses/${addressId}`, updateData);
            return res.data;
        } catch (error) {
            console.error(`Error updating address by ID ${addressId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Deletes an address by its ID.
     * Accessible by customer (for their own address) and admin.
     * @param {string} addressId - The ID of the address to delete.
     * @returns {Promise<Object>} A confirmation message for the deletion.
     */
    deleteAddress: async (addressId) => {
        try {
            // Backend route: DELETE /addresses/:id
            const res = await API.delete(`/addresses/${addressId}`);
            return res.data;
        } catch (error) {
            console.error(`Error deleting address by ID ${addressId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
