// Imports
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/productApi';
import { categoryService } from '../services/categoryApi';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../contexts/authContext';
import { cartService } from '../services/cartApi';

import ProductCard from '../components/productCard';
import ProductDetailsModal from '../components/productDetailsModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'all' for "All Categories"
  const [selectedProductId, setSelectedProductId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_UPLOAD_BASE_URL; // IMPORTANT: Replace with your actual backend URL

  const fetchProducts = useCallback(async (categoryToFilter = 'all') => { // Renamed param for clarity
    setLoading(true);
    setError(null);
    try {
      let data;
      if (categoryToFilter && categoryToFilter !== 'all') {
        // Call the specific API endpoint for category filtering
        data = await productService.getProductsByCategory(categoryToFilter); // <--- CRITICAL CHANGE HERE
      } else {
        // Call the general API endpoint for all products
        data = await productService.getAllProducts(); // <--- CRITICAL CHANGE HERE
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products.');
      console.error('Error fetching products:', err);
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories.');
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('category') || 'all'; // Default to 'all'
    
    setSelectedCategory(categoryFromUrl);
    fetchProducts(categoryFromUrl); // Pass the category to the fetch function
  }, [location.search, fetchProducts]);

  const handleCategoryChange = (value) => { // Value comes directly from Shadcn Select
    setSelectedCategory(value);
    const newSearchParams = new URLSearchParams();

    // If a specific category is selected (not 'all'), add it to URL
    if (value && value !== 'all') {
      newSearchParams.set('category', value);
    }
    navigate(`/products?${newSearchParams.toString()}`);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await cartService.addItemToCart(user._id, productId, 1);
      toast.success('Product added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
      console.error('Error adding to cart:', err);
    }
  };

  const openProductModal = (productId) => {
    setSelectedProductId(productId);
  };

  const closeProductModal = () => {
    setSelectedProductId(null);
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
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Our Products</h1>

      {/* Category Filter Dropdown */}
      <div className="flex justify-center mb-8">
        <div className="w-full sm:w-1/3 max-w-xs">
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onViewDetails={openProductModal}
            />
          ))}
        </div>
      )}

      {selectedProductId && (
        <ProductDetailsModal
          productId={selectedProductId}
          onClose={closeProductModal}
        />
      )}
    </div>
  );
}
