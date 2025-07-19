// Import the central API instance
import API from './api';

// Category service
export const categoryService = {

    // Create a new category (POST /categories/) - Admin/Manager only
    createCategory: async (categoryData) => {
        try {
            const res = await API.post('/categories', categoryData);
            return res.data;
        } catch (error) {
            console.error('Error creating category:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get all categories (GET /categories/) - Public access
    getAllCategories: async () => {
        try {
            const res = await API.get('/categories');
            return res.data.categories || res.data;
        } catch (error) {
            console.error('Error fetching all categories:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get category by ID (GET /categories/:id) - Public access
    getCategoryById: async (categoryId) => {
        try {
            const res = await API.get(`/categories/${categoryId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching category by ID ${categoryId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Update category by ID (PUT /categories/:id) - Admin/Manager only
    updateCategory: async (categoryId, categoryData) => {
        try {
            const res = await API.put(`/categories/${categoryId}`, categoryData);
            return res.data;
        } catch (error) {
            console.error(`Error updating category by ID ${categoryId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Delete category by ID (DELETE /categories/:id) - Admin/Manager only
    deleteCategoryById: async (categoryId) => {
        try {
            const res = await API.delete(`/categories/${categoryId}`);
            return res.data;
        } catch (error) {
            console.error(`Error deleting category by ID ${categoryId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
