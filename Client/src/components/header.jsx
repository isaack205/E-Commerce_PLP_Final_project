// Imports
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
          Urban Spree Mart
        </Link>
        <ul className="flex space-x-4">
          {isAuthenticated ? (
            // If authenticated, show Logout button
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
              >
                Logout ({user.name || user.email}) {/* Display user's name or email */}
              </button>
            </li>
          ) : (
            // If not authenticated, show Login and Register links
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