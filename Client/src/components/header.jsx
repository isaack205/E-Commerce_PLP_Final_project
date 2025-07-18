// client/src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { categoryService } from '../services/categoryApi';
import { cartService } from '../services/cartApi';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';

function Header() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Effect to fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.categories || response.data || []);
      } catch (err) {
        console.error('Error fetching categories for header:', err);
      }
    };
    fetchCategories();
  }, []);

  // Effect to fetch cart item count
  useEffect(() => {
    const getCartCount = async () => {
      // Ensure authLoading is false, user is authenticated, and user object is available
      if (!authLoading && isAuthenticated && user) {
        try {
          const response = await cartService.getCartByUserId(user._id);
          const count = response.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartItemCount(count);
        } catch (err) {
          console.error('Error fetching cart count:', err);
          setCartItemCount(0); // Reset count on error
        }
      } else if (!authLoading && !isAuthenticated) {
        // If authentication is done loading but the user is not authenticated,
        // ensure the cart count is 0.
        setCartItemCount(0);
      }
    };
    getCartCount();
    // Re-run this effect when authentication status, user object, or auth loading state changes.
  }, [isAuthenticated, user, authLoading]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
          UrbanSpree Mart
        </Link>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/products" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
              Products
            </Link>
          </li>
          {categories.length > 0 && (
            <li className="relative group">
              <button className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors cursor-pointer">
                Categories
              </button>
              <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <li>
                  <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">
                    All Categories
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link to={`/products?category=${category._id}`} className="block px-4 py-2 hover:bg-gray-100">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}

          <li>
            <Link to="/carts" className="relative flex items-center hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {(user.role === 'admin' || user.role === 'manager') && (
                <li>
                  <Link to="/dashboard" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/orders" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                  Logout ({user.username || user.email})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;

