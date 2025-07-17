// client/src/components/common/Header.jsx
import React, { useState, useEffect } from 'react'; // NEW: Import useState, useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { categoryService } from '../../api/categoryApi'; // NEW: Import categoryService

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // NEW: State for categories in header

  // Fetch categories for the header dropdown/links
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
          E-Shop
        </Link>
        <ul className="flex space-x-4 items-center"> {/* Added items-center for vertical alignment */}
          <li>
            <Link to="/products" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
              Products
            </Link>
          </li>
          {/* NEW: Categories Dropdown/Links */}
          {categories.length > 0 && (
            <li className="relative group"> {/* For dropdown effect */}
              <button className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors cursor-pointer">
                Categories
              </button>
              <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                {/* Link to show all products */}
                <li>
                  <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">
                    All Categories
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    {/* Link to products page with category filter */}
                    <Link to={`/products?category=${category._id}`} className="block px-4 py-2 hover:bg-gray-100">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}

          <li>
            <Link to="/cart" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
              Cart
            </Link>
          </li>
          {user ? (
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
                  Logout ({user.name || user.email})
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
