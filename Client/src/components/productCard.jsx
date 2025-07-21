// Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';
import { cartService } from '@/services/cartApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingCartIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';

// ProductCard functional component with 'product' object as a prop, which contains all product details.
export default function ProductCard({ product, onViewDetails }) {

    const { isAuthenticated } = useAuth();
    const [addingToCart, setAddingToCart] = useState(false); // State for loading indicator on button

    const handleAddToCart = async () => {
        if (!isAuthenticated ) {
            toast.error('Please log in to add items to your cart.');
            return;
        }

        if (product.stockQuantity <= 0) {
            toast.error('This item is currently out of stock.');
            return;
        }

        setAddingToCart(true); // Set loading state for the button
        try {
            await cartService.createOrUpdateCart({items: [{ productId: product._id, quantity: 1 }]});
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(error.response?.data?.message || 'Failed to add item to cart.');
        } finally {
            setAddingToCart(false); // Reset loading state
        }
    }

  // Determine the image URL for the product with a fallback default image
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_UPLOAD_BASE_URL;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        {/* 'onError': An event handler that runs if the image fails to load. */}
        <img
          src={`${BACKEND_BASE_URL}${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // 'e.target.onerror = null': Prevents an infinite loop if the fallback image also fails.
            e.target.onerror = null;
            // Sets a new fallback image if the original image fails to load.
            e.target.src = `https://placehold.co/400x300/E0E0E0/333333?text=${encodeURIComponent(product.name || 'Image Error')}`;
          }}
        />
      </Link>
      <div className="p-4">
        {product.category && (
            <h5 className="text-gray-600 text-md">
              {product.category.name || product.category}
            </h5>
        )}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
            {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">Ksh {product.price.toFixed(2)}</span>
          {product.stockQuantity <= 0 ? (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          ) : (
            // Otherwise, display "In Stock" with the quantity.
            <span className="text-green-600 text-sm">In Stock: {product.stockQuantity}</span>
          )}
        </div>
        <div className="flex space-x-2"> 
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stockQuantity <= 0}
            className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-1" />
            {addingToCart ? 'Adding...' : (product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart')}
          </Button>
          {/* This button explicitly opens the details modal */}
          <Button
            onClick={() => onViewDetails(product._id)} // Call the prop function to open modal
            className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-md text-sm"
            title="View Details"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </Button>
         </div>
      </div>
    </div>
  );
}
