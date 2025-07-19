// Import the central API instance
import API from './api';

// Product service
export const productService = {

    // Create a new product (POST /products/) - Admin/Manager only, with image upload
    createProduct: async (productData) => {
        // productData should be a FormData object if it includes an image file.
        // Example:
        // const formData = new FormData();
        // formData.append('name', productName);
        // formData.append('description', productDescription);
        // formData.append('price', productPrice);
        // formData.append('category', productCategory);
        // if (imageFile) {
        //     formData.append('image', imageFile);
        // }
        // API will automatically set Content-Type to 'multipart/form-data' when FormData is used.
        try {
            const res = await API.post('/products', productData);
            return res.data;
        } catch (error) {
            console.error('Error creating product:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get all products (GET /products/) - Public access
    getAllProducts: async (params = {}) => {
        // params can be used for pagination, filtering, etc. (e.g., { page: 1, limit: 10, category: 'electronics' })
        try {
            const res = await API.get('/products', { params });
            return res.data.products || res.data;
        } catch (error) {
            console.error('Error fetching all products:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get product by ID (GET /products/:id) - Public access
    getProductById: async (productId) => {
        try {
            const res = await API.get(`/products/${productId}`);
            return res.data;
        } catch (error) {
            console.error(`Error fetching product by ID ${productId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Update product by ID (PUT /products/:id) - Admin/Manager only, with optional image upload
    updateProduct: async (productId, productData) => {
        // productData should be a FormData object if it includes an image file.
        // If only text data is updated, it can be a plain object, but using FormData is safer
        // if the backend expects multipart/form-data for this route.
        try {
            const res = await API.put(`/products/${productId}`, productData);
            return res.data;
        } catch (error) {
            console.error(`Error updating product by ID ${productId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Delete product by ID (DELETE /products/:id) - Admin/Manager only
    deleteProduct: async (productId) => {
        try {
            const res = await API.delete(`/products/${productId}`);
            return res.data;
        } catch (error) {
            console.error(`Error deleting product by ID ${productId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Get products by category (GET /products/category/:categoryId) - Public access
    getProductsByCategory: async (categoryId, params = {}) => {
        try {
            const res = await API.get(`/products/category/${categoryId}`, { params });
            return res.data.products || res.data;
        } catch (error) {
            console.error(`Error fetching products for category ID ${categoryId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
