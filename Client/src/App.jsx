// Imports
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";

// Import layout & protected routes
import Layout from '';
import ProtectedRoute from './components/protectedRoute';

// Import page components
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/register';

export default function App() {
    return (
        <>
            {/* Toaster for notifications, positioned at top-right */}
            <Toaster richColors position="top-right" />

            {/* Layout wraps all routes to provide consistent header/footer */}
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes for Customers, Admins, Managers */}
                    {/* These routes require authentication and specific roles */}
                    <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'manager']} />}>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrderHistoryPage />} />
                    </Route>

                    {/* Protected Routes for Admins and Managers (Dashboard and related admin pages) */}
                    {/* These routes require authentication and 'admin' or 'manager' role */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>

                    {/* Catch-all for undefined routes */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </>
    );
}