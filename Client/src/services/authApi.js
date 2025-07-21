// Import the central API instance
import API from './api';

// Authentication service
export const authService = {

    // Register user
    registerUser: async (userData) => {
        try {
            const res = await API.post('/user/register', userData);
            if (res.data.token) {
                localStorage.setItem('jwtToken', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            return res.data;
        } catch (error) {
            console.error('Error registering user:', error.response?.data || error.message);
            throw error;
        }
    },

    // Login user
    loginUser: async (userData) => {
        try {
            const res = await API.post('/user/login', userData);
            if (res.data.token) {
                localStorage.setItem('jwtToken', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            return res.data;
        } catch (error) {
            console.error('Error logging in user:', error.response?.data || error.message);
            throw error;
        }
    },

    // Logout User
    logoutUser: () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
    },

    // Get own profile (GET /user/me)
    getProfile: async () => {
        try {
            const res = await API.get('/user/me');
            return res.data;
        } catch (error) {
            console.error('Error fetching user profile:', error.response?.data || error.message);
            throw error;
        }
    },

    // Update own profile (PUT /user/me)
    updateProfile: async (profileData) => {
        try {
            const res = await API.put('/user/me', profileData);
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            return res.data;
        } catch (error) {
            console.error('Error updating user profile:', error.response?.data || error.message);
            throw error;
        }
    },

    changePassword: async (passwordData) => {
        try {
            const res = await API.put('/user/change-password', passwordData);
            return res.data;
        } catch (error) {
            console.error('Error changing password:', error.response?.data || error.message);
            throw error;
        }
    },

    // Delete own user account (DELETE /user/me)
    deleteOwnUser: async () => {
        try {
            const res = await API.delete('/user/me');
            authService.logoutUser();
            return res.data;
        } catch (error) {
            console.error('Error deleting own user account:', error.response?.data || error.message);
            throw error;
        }
    },

    // Admin: Get all users (GET /user/users)
    // getAllUsers: async () => {
    //     try {
    //         const res = await API.get('/user/users');
    //         return res.data;
    //     } catch (error) {
    //         console.error('Error fetching all users (Admin):', error.response?.data || error.message);
    //         throw error;
    //     }
    // },

    getAllUsers: async (params = {}) => { // This is the correct version with params
        try {
            const res = await API.get('/user/users', { params }); // Pass params to API.get
            console.log("AuthService: Raw response data for getAllUsers:", res.data); // DEBUG LOG
            // As per your backend, it returns { users: [...] }, so return the whole object
            return res.data; // Return res.data (which is { users: [...] })
        } catch (error) {
            console.error('Error fetching all users (Admin):', error.response?.data || error.message);
            throw error;
        }
    },

    // Admin: Get user by ID (GET /user/:id)
    getUserById: async (userId) => {
        try {
            const res = await API.get(`/user/${userId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching user by ID ${userId} (Admin):`, error.response?.data || error.message);
            throw error;
        }
    },

    // Admin: Delete user by ID (DELETE /user/users/:id)
    deleteUserById: async (userId) => {
        try {
            const res = await API.delete(`/user/users/${userId}`);
            return res.data;
        } catch (error) {
            console.error(`Error deleting user by ID ${userId} (Admin):`, error.response?.data || error.message);
            throw error;
        }
    }
};
