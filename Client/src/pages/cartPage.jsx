// Imports
import React, { useState, useEffect } from 'react';
import { cartService } from '../services/cartApi';
import { useAuth } from '../contexts/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // For quantity input
import { toast } from 'sonner';
import { TrashIcon } from '@heroicons/react/20/solid'; // For delete icon
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  // Destructure 'loading' from useAuth as 'authLoading'
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true); // Internal loading state for cart fetch
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch cart data
  const fetchCart = async () => {
    // Wait for authLoading to be false
    if (authLoading) {
      setLoading(true); // Keep internal loading true while auth is loading
      return;
    }

    if (!isAuthenticated || !user) {
      setLoading(false);
      setCart(null); // Clear cart if not authenticated or user is null after auth loads
      return;
    }

    try {
      setLoading(true); // Set loading for the cart fetch itself
      setError(null);
      const response = await cartService.getCartByUserId(user._id);
      setCart(response);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to load cart.');
    } finally {
      setLoading(false); // Set internal loading to false after cart fetch attempt
    }
  };

  // Effect to fetch cart data when component mounts or user/auth state changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user, authLoading]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to modify your cart.');
      return;
    }
    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1; // Ensure quantity is at least 1
    }

    // Find the current item to check stock before optimistic update
    const currentItem = cart.items.find(item => item.product._id === productId);
    if (!currentItem) return; // Should not happen if productId is valid

    if (newQuantity > currentItem.product.stockQuantity) {
        toast.error(`Cannot add more than available stock (${currentItem.product.stockQuantity}).`);
        // Revert to current quantity if trying to exceed stock
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item =>
                item.product._id === productId ? { ...item, quantity: currentItem.quantity } : item
            )
        }));
        return;
    }

    // Optimistically update UI
    const updatedItems = cart.items.map(item =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(prevCart => ({ ...prevCart, items: updatedItems }));

    try {
      // Pass an object { productId, quantity } to updateCartItemQuantity
      await cartService.updateCartItemQuantity({ productId, quantity: newQuantity });
      toast.success('Cart item quantity updated.');
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Failed to update quantity.');
      // Revert optimistic update if API call fails
      fetchCart(); // Re-fetch the entire cart to ensure consistency
      toast.error('Failed to update quantity.');
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to modify your cart.');
      return;
    }

    // Optimistically remove item from UI
    const updatedItems = cart.items.filter(item => item.product._id !== productId);
    setCart(prevCart => ({ ...prevCart, items: updatedItems }));

    try {
      // Pass an object { productId } to removeItemFromCart
      await cartService.removeItemFromCart({ productId: productId });
      toast.success('Item removed from cart.');
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.response?.data?.message || 'Failed to remove item.');
      // Re-fetch cart to revert if API call fails
      fetchCart(); // Re-fetch the entire cart to ensure consistency
      toast.error('Failed to remove item.');
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to clear your cart.');
      return;
    }

    if (cart && cart.items.length === 0) {
      toast.info('Your cart is already empty!');
      return;
    }

    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setLoading(true); // Show loading while clearing
    try {
      // Pass user._id to clearCart
      await cartService.clearCart(user._id);
      setCart({ items: [], total: 0 }); // Set cart to empty in UI
      toast.success('Your cart has been cleared.');
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.message || 'Failed to clear cart.');
      toast.error('Failed to clear cart.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCartTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    // Ensure item.product.price is used, as product is populated
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  // Display loading indicator if authentication is still loading OR cart is loading
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Loading cart...</p>
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

  // If authLoading is false but user is not authenticated (meaning, not logged in)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-gray-600">
        <p className="text-lg">Please log in to view your cart.</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-gray-600">
        <p className="text-2xl font-semibold mb-4">Your cart is empty! 🛒</p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
              <img
                src={item.product.image || `https://placehold.co/100x100/E0E0E0/333333?text=${encodeURIComponent(item.product.name || 'Product')}`}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <Link to={`/products/${item.product._id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                  {item.product.name}
                </Link>
                <p className="text-gray-600">Ksh {item.product.price.toFixed(2)} per item</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || item.quantity >= item.product.stockQuantity} // Disable if 1 or max stock
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-md"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                  className="w-16 text-center border rounded-md"
                  min="1"
                  max={item.product.stockQuantity} // Limit quantity by stock
                />
                <Button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stockQuantity}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-md"
                >
                  +
                </Button>
                <p className="text-lg font-semibold ml-4">Ksh {(item.product.price * item.quantity).toFixed(2)}</p>
                <Button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md ml-4"
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center mt-6 pt-4 border-t">
          <h2 className="text-2xl font-bold text-gray-800 mr-4">Total: Ksh {calculateCartTotal().toFixed(2)}</h2>
          <Button
            onClick={handleClearCart}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mr-2"
          >
            Clear Cart
          </Button>
          <Button
            onClick={() => navigate('/checkout')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

