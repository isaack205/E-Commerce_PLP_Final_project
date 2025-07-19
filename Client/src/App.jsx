// Imports
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "sonner";

// Import layout & protected routes
import Layout from './components/layout';
import ProtectedRoute from './components/protectedRoute';

// Import page components
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/register';
import ProductsPage from './pages/productsPage';
import ProductDetailsPage from './pages/productDetailsPage';
import CartPage from './pages/cartPage';
import CheckoutPage from './pages/checkoutPage';
import OrderHistoryPage from './pages/orderHistoryPage';
import OrderDetailsPage from './pages/orderDetailsPage';
import UpdateProfilePage from './pages/updateProfilePage';
import ChangePasswordPage from './pages/changePasswordPage';
import ManageAddressesPage from './pages/manageAddressesPage';
import AddAddressPage from './pages/addAddressPage';
import TrackShippingPage from './pages/trackShipping';
import AboutPage from './pages/aboutPage';
import ContactPage from './pages/contactPage';

export default function App() {
    return (
        <>
            {/* Toaster for notifications, positioned at top-right */}
            <Toaster richColors position="top-right" />

            {/* Layout wraps all routes to provide consistent header/footer */}
            <Layout>
                <Routes>

                    <Route path="/" element={<Navigate to="/products" replace />} /> 
                    {/* Public Routes */}
                    {/* <Route path="/" element={<HomePage />} />*/}
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Protected Routes for Customers, Admins, Managers */}
                    {/* These routes require authentication and specific roles */}
                    <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'manager']} />}>
                        <Route path="/carts" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrderHistoryPage />} />
                        <Route path="/orders/:id" element={<OrderDetailsPage />} />
                        <Route path="/profile/update" element={<UpdateProfilePage />} />
                        <Route path="/profile/change-password" element={<ChangePasswordPage />} />
                        <Route path="/addresses" element={<ManageAddressesPage />} />
                        <Route path="/addresses/add" element={<AddAddressPage />} />
                        <Route path="/track-shipping" element={<TrackShippingPage />} />
                    </Route>

                    {/* Protected Routes for Admins and Managers (Dashboard and related admin pages) */}
                    {/* These routes require authentication and 'admin' or 'manager' role */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
                        {/* <Route path="/dashboard" element={<DashboardPage />} />*/}
                    </Route>

                    {/* Catch-all for undefined routes */}
                    {/* <Route path="*" element={<NotFoundPage />} />*/}
                </Routes>
            </Layout>
        </>
    );
}