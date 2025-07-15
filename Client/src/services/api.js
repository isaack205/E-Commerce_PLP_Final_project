// Imports
import axios from 'axios';

// Create a base Axios instance
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for authentication
// This interceptor will run before every request made using this API instance.
API.interceptors.request.use(
    (config) => {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('jwtToken');

        // If a token exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Return the modified config
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response interceptor for error handling or token refresh
API.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // For example, if a 401 Unauthorized error occurs, you might redirect to login
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized request. Redirecting to login...');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default API; // Export the configured Axios instance
