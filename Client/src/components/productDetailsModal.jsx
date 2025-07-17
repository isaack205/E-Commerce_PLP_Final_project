// Imports
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productApi';
import { cartService } from '../services/cartApi';
import { useAuth } from '../contexts/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/20/solid';

// This component will be rendered as a modal
// It receives productId to fetch details and onClose to close itself
export default function ProductDetailsModal({ productId, onClose }) {
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity to add to cart
  const [addingToCart, setAddingToCart] = useState(false); // State for add to cart button loading

  useEffect(() => {
    // Only fetch if a productId is provided
    if (!productId) {
      setLoading(false);
      setError('No product ID provided.');
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProductById(productId);
        setProduct(response.product || response.data); // Adjust based on actual API response structure
      } catch (err) {
        console.error('Error fetching product details for modal:', err);
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Re-run effect if productId changes

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && product && value <= product.stockQuantity) {
      setQuantity(value);
    } else if (value < 1) {
      setQuantity(1); // Minimum quantity is 1
    } else if (product && value > product.stockQuantity) {
      setQuantity(product.stockQuantity); // Cannot exceed stock
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    if (product.stockQuantity <= 0) {
      toast.error('This item is currently out of stock.');
      return;
    }

    if (quantity > product.stockQuantity) {
      toast.error(`Cannot add more than available stock (${product.stockQuantity}).`);
      setQuantity(product.stockQuantity);
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addItemToCart(product._id, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
      onClose(); // Close modal after successful add to cart
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    // Overlay for the modal (darkens background, closes on click outside)
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      {/* Modal content area, stops propagation so clicking inside doesn't close it */}
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Conditional rendering based on loading/error/product state */}
        {loading && (
          <div className="p-8 flex items-center justify-center min-h-[200px]">
            <p className="text-lg text-gray-700">Loading product details...</p>
          </div>
        )}

        {error && (
          <div className="p-8 flex items-center justify-center min-h-[200px] text-red-600">
            <p className="text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && !product && (
          <div className="p-8 flex items-center justify-center min-h-[200px] text-gray-600">
            <p className="text-lg">Product not found.</p>
          </div>
        )}

        {/* Actual Product Details Content (only if product is loaded) */}
        {!loading && !error && product && (
          <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* Product Image Section */}
            <div className="md:w-1/2 flex-shrink-0">
              <img
                src={product.image || `https://placehold.co/600x400/E0E0E0/333333?text=${encodeURIComponent(product.name || 'No Image')}`}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400/E0E0E0/333333?text=${encodeURIComponent(product.name || 'Image Error')}`;
                }}
              />
            </div>

            {/* Product Details Section */}
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-600">
                  <span className="font-semibold">Brand:</span> {product.brand}
                </p>
              )}
              {product.category && (
                <p className="text-gray-600">
                  <span className="font-semibold">Category:</span> {product.category.name || product.category}
                </p>
              )}
              <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>

              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-blue-700">Ksh {product.price.toFixed(2)}</span>
                {product.stockQuantity > 0 && (
                  <span className="text-green-600 text-sm font-semibold">({product.stockQuantity} in stock)</span>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="flex items-center space-x-4 mt-4">
                <Label htmlFor="quantity" className="text-lg font-semibold">Quantity:</Label>
                <Input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-24 text-center border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={product.stockQuantity <= 0 || addingToCart}
                />
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stockQuantity <= 0 || quantity > product.stockQuantity || quantity < 1}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-base transition-colors" // Adjusted padding/font size
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Adding...' : (product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart')}
                </Button>
              </div>

              {product.stockQuantity <= 0 && (
                <p className="text-red-600 font-semibold mt-2">This item is currently out of stock.</p>
              )}

              {product.sku && (
                <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
              )}
              {product.variant && (
                <p className="text-gray-500 text-sm">Variant: {product.variant}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
