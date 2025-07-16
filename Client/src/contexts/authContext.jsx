// Imports
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authApi';
import { toast } from 'sonner';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the authContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data
  const [loading, setLoading] = useState(true); // Manages initial loading state
  const [error, setError] = useState(null); // Stores authentication error

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('user');

    if(token && userData) {
        setUser(JSON.parse(userData));
        authService.getProfile()
            .then(response => {
                setUser(response.data)
                localStorage.setItem('user', JSON.stringify(response.data));
            })
            .catch(() => {
                // Clear invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('jwtToken');
                setUser(null);
                toast.error("Your session has expired. Please log in again.");
            })
            .finally(() => setLoading(false));
    } else {
        setLoading(false)
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
        const res = await authService.loginUser({ email, password })
        const { token, ...userData } = res
        setUser(userData)

        toast.success('Logged in successfully');
        return { success: true }
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        setError(message);

        toast.error(message);
        throw error
    } finally {
        setLoading(false)
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
        const res = await authService.registerUser(userData)
        const { token, ...newUserData } = res

        setUser(newUserData);
        toast.success('Registered and logged in successfully');
        return { success: true }
    } catch (error) {
        const message = error.response?.data?.message;
        setError(message);
        toast.error(message);
        throw error
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    authService.logoutUser(); // Clear localStorage items
    setUser(null); // Clear user state
    setError(null); // Clear any existing errors
    toast.success('Logged out successfully'); // Notify user
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    // Specific boolean flags for common checks
    isAuthenticated: !!user, // Is any user logged in?
    isAdmin: user?.role === 'admin', // Is the logged-in user an admin?
    isManager: user?.role === 'manager', // Is the logged-in user a manager?

    // Flexible function for dynamic role checking
    hasRole: (roles) => {
        if (!user || !user.role) return false;
        if (Array.isArray(roles)) {
        return roles.includes(user.role);
        }
        return user.role === roles;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  return(
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
  )
};