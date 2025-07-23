// client/src/pages/dashboard/DashboardOverview.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom'; // Import Link for recent orders
import {
  UsersIcon,
  ShoppingCartIcon,
  NewspaperIcon,
  CurrencyDollarIcon, // Assuming you have a DollarSignIcon or similar for revenue
  CalendarDaysIcon, // For recent orders
} from '@heroicons/react/24/outline'; // Heroicons

// Import your service APIs
import { authService } from '../../services/authApi'; // For user count
import { productService } from '../../services/productApi'; // For product count
import { orderService } from '../../services/orderApi'; // For order count and total revenue

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [], // To store a few recent orders
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Total Users
        const usersResponse = await authService.getAllUsers();
        const totalUsers = Array.isArray(usersResponse.users) ? usersResponse.users.length : 0; // Ensure it's an array

        // Fetch Total Products
        const productsResponse = await productService.getAllProducts();
        const totalProducts = Array.isArray(productsResponse) ? productsResponse.length : 0; // Ensure it's an array

        // Fetch Total Orders and Calculate Revenue
        const ordersResponse = await orderService.getAllOrders();
        const orders = Array.isArray(ordersResponse) ? ordersResponse : []; // Ensure it's an array
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0); // Handle missing totalAmount

        // Fetch Recent Orders (e.g., last 5 orders, sorted by date)
        const recentOrders = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          recentOrders,
        });

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
        console.error('Error fetching dashboard stats:', err);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard Overview</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard icon={UsersIcon} title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard icon={NewspaperIcon} title="Total Products" value={stats.totalProducts} color="bg-green-500" />
        <StatCard icon={ShoppingCartIcon} title="Total Orders" value={stats.totalOrders} color="bg-yellow-500" />
        <StatCard icon={CurrencyDollarIcon} title="Total Revenue" value={`Ksh ${stats.totalRevenue.toFixed(2)}`} color="bg-purple-500" />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <CalendarDaysIcon className="h-6 w-6 mr-2 text-blue-500" /> Recent Orders
        </h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No recent orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {order.user?.username || order.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      Ksh {(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/dashboard/orders/${order._id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className={`${color} text-white p-4 md:p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-transform transform duration-300 hover:scale-105`}>
    <div>
      <h3 className="text-base sm:text-lg font-medium">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
    </div>
    <Icon className="h-8 w-8 sm:h-10 sm:w-10 opacity-75" />
  </div>
);
