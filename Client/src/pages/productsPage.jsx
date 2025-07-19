// Imports
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productApi';
import ProductCard from '../components/productCard';
import { categoryService } from '@/services/categoryApi';
import ProductDetailsModal from '../components/productDetailsModal'; // Import the modal component
import { Link, useLocation } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // NEW: State for categories
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null); // State to hold the ID of the product to show in modal

  const location = useLocation();

  // Effect to fetch categories on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.categories || response.data || []); // Adjust based on actual API response
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Don't block product display if categories fail to load
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;

        // Check URL for initial category filter (e.g., /products?category=someId)
        const queryParams = new URLSearchParams(location.search);
        const categoryFromUrl = queryParams.get('category');

        // Prioritize dropdown selection, then URL parameter
        const categoryToFetch = selectedCategory || categoryFromUrl;

        if (categoryToFetch) {
          // Fetch products by specific category
          response = await productService.getProductsByCategory(categoryToFetch);
        } else {
          // Fetch all products
          response = await productService.getAllProducts();
        }
        setProducts(response.products || response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, location.search]);

  // Function to open the modal with a specific product ID
  const openProductModal = (productId) => {
    setSelectedProductId(productId);
  };

  // Function to close the modal
  const closeProductModal = () => {
    setSelectedProductId(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // Optionally, update the URL to reflect the selected category for shareability
    // navigate(`/products?category=${e.target.value}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-gray-600">
        <p className="text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Products</h1>

      {/* Category Filter Dropdown */}
      <div className="mb-8 flex justify-center">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] text-gray-600">
          <p className="text-lg">No products found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            // Pass the openProductModal function to ProductCard
            <ProductCard
              key={product._id}
              product={product}
              onViewDetails={openProductModal} // New prop to handle modal opening
            />
          ))}
        </div>
      )};

      {/* Conditionally render the ProductDetailsModal if selectedProductId is set */}
      {selectedProductId && (
        <ProductDetailsModal
          productId={selectedProductId}
          onClose={closeProductModal}
        />
      )}
    </div>
  );
}
