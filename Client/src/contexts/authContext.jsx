// Imports
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authApi';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateUser = useCallback((newUserData) => {
    // Ensure newUserData is the actual user object, not a nested one
    const actualNewUser = newUserData.user || newUserData;
    setUser(actualNewUser);
    // Also update localStorage to keep it in sync
    localStorage.setItem('user', JSON.stringify(actualNewUser));
  }, []); // Empty dependency array means this function is stable and won't change on re-renders

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      const storedUserString = localStorage.getItem('user'); // Keep this to potentially use for optimistic UI

      if (storedToken) { // Only proceed if a token exists
        try {
          // Optimistic update from localStorage while fetching fresh data
          if (storedUserString) {
            try {
              const parsedStoredUser = JSON.parse(storedUserString);
              // Check if the parsed user object has an _id or is nested
              setUser(parsedStoredUser.user || parsedStoredUser); // Handle both direct and nested user objects
            } catch (parseError) {
              console.error("AuthContext: Error parsing stored user from localStorage:", parseError);
              localStorage.removeItem('user'); // Clear corrupted data
            }
          }

          // ALWAYS fetch fresh user data from the backend if a token exists.
          const freshUserData = await authService.getProfile();
          // Check if freshUserData is nested (e.g., { user: {...} }) or direct {...}
          const actualUser = freshUserData.user || freshUserData;
          setUser(actualUser); // Set user state with the actual user object
          localStorage.setItem('user', JSON.stringify(actualUser)); // Store the actual user object

        } catch (err) {
          console.error("AuthContext: Authentication check failed (getProfile):", err);
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('user');
          setUser(null);
          toast.error("Your session has expired. Please log in again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setUser(null);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
        const res = await authService.loginUser({ email, password });
        // authService.loginUser already handles setting jwtToken and user in localStorage
        const storedUserAfterLogin = localStorage.getItem('user');
        if (storedUserAfterLogin) {
            // Ensure the user object is correctly parsed and extracted if nested
            const parsedUser = JSON.parse(storedUserAfterLogin);
            setUser(parsedUser.user || parsedUser);
        } else {
            setUser(null);
        }
        toast.success('Logged in successfully');
        return { success: true };
    } catch (err) {
        const message = err.response?.data?.message || 'Login failed';
        setError(message);
        toast.error(message);
        throw err;
    } finally {
        setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
        const res = await authService.registerUser(userData);
        // authService.registerUser already handles setting jwtToken and user in localStorage
        const storedUserAfterRegister = localStorage.getItem('user');
        if (storedUserAfterRegister) {
            // Ensure the user object is correctly parsed and extracted if nested
            const parsedUser = JSON.parse(storedUserAfterRegister);
            setUser(parsedUser.user || parsedUser);
        } else {
            setUser(null);
        }
        toast.success('Registered and logged in successfully');
        return { success: true };
    } catch (err) {
        const message = err.response?.data?.message || 'Registration failed';
        setError(message);
        toast.error(message);
        throw err;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    authService.logoutUser();
    setUser(null);
    setError(null);
    toast.info('Logged out successfully');
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !loading,
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};