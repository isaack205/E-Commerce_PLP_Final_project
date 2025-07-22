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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 }); // Initialize cart as an object with an empty items array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!isAuthenticated || !user) {
      setLoading(false);
      setCart({ items: [], total: 0 }); // Ensure cart is empty object if not authenticated
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCartByUserId(user._id);
      // Ensure response has 'items' and 'total'
      setCart({
        items: Array.isArray(response.items) ? response.items : [],
        total: response.total || 0
      });
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to load cart.');
      setCart({ items: [], total: 0 }); // Set to empty cart on error
    } finally {
      setLoading(false);
    }
  };

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
      newQuantity = 1;
    }

    const currentItem = cart.items.find(item => item.product._id === productId);
    if (!currentItem) return;

    if (newQuantity > currentItem.product.stockQuantity) {
        toast.error(`Cannot add more than available stock (${currentItem.product.stockQuantity}).`);
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item =>
                item.product._id === productId ? { ...item, quantity: currentItem.quantity } : item
            )
        }));
        return;
    }

    const updatedItems = cart.items.map(item =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(prevCart => ({ ...prevCart, items: updatedItems }));

    try {
      await cartService.updateCartItemQuantity({ productId, quantity: newQuantity });
      toast.success('Cart item quantity updated.');
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Failed to update quantity.');
      fetchCart();
      toast.error('Failed to update quantity.');
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to modify your cart.');
      return;
    }

    const updatedItems = cart.items.filter(item => item.product._id !== productId);
    setCart(prevCart => ({ ...prevCart, items: updatedItems }));

    try {
      await cartService.removeItemFromCart({ productId: productId });
      toast.success('Item removed from cart.');
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.response?.data?.message || 'Failed to remove item.');
      fetchCart();
      toast.error('Failed to remove item.');
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to clear your cart.');
      return;
    }

    if (cart.items.length === 0) {
      toast.info('Your cart is already empty!');
      return;
    }

    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setLoading(true);
    try {
      await cartService.clearCart(user._id);
      setCart({ items: [], total: 0 });
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
    if (!cart.items || cart.items.length === 0) {
      return 0;
    }
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-gray-600">
        <p className="text-lg">Please log in to view your cart.</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex flex-col sm:flex-row items-center sm:items-start border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <img
                src={item.product.image || `https://placehold.co/60x60/E0E0E0/333333?text=No+Img`}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
                <Link to={`/products/${item.product._id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                  {item.product.name}
                </Link>
                <p className="text-gray-600">Ksh {item.product.price.toFixed(2)} per item</p>
              </div>
              <div className="flex flex-col items-center sm:items-end space-y-3 sm:ml-auto">
                <div className="flex items-center space-x-2 w-full justify-center sm:justify-end">
                  <Button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 rounded-full p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                    className="w-16 text-center border rounded-md"
                    min="1"
                    max={item.product.stockQuantity}
                  />
                  <Button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stockQuantity}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 rounded-full p-0"
                  >
                    +
                  </Button>
                </div>

                <span className="text-xl font-bold text-gray-800 dark:text-gray-200 w-full text-center sm:text-right">
                  Ksh {(item.product.price * item.quantity).toFixed(2)}
                </span>

                <Button
                  onClick={() => handleRemoveItem(item.product._id)}
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto px-4 py-2 text-sm"
                >
                  <TrashIcon className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center sm:items-end sm:ml-auto space-y-2">
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