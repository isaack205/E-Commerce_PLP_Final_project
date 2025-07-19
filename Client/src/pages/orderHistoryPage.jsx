// Imports
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderApi';
import { useAuth } from '../contexts/authContext';

function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        setError('Please log in to view your order history.');
        return;
      }
      try {
        setLoading(true);
        const response = await orderService.getOrdersByUserId(user._id);
        // This handles cases where the backend sends an object with an empty 'orders' array
        const ordersData = response.orders || response.data;
        const validOrders = Array.isArray(ordersData) ? ordersData.filter(addr => typeof addr._id === 'string' && addr._id.length > 0) : [];

        setOrders(validOrders); // Always set to a valid array (could be empty)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order history.');
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) { // Only fetch orders once auth state is determined
      fetchOrders();
    }
  }, [user, authLoading]); // Re-fetch if user changes or auth loading completes

  if (authLoading || loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700">Loading order history...</p>
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

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700">You have no past orders.</p>
        <Link to="/products" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Order History</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {orders.map((order) => (
          <div key={order._id} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Order ID: {order._id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'paid' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                Status: {order.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-4">Total Amount: <span className="font-bold">KES {order.totalAmount.toFixed(2)}</span></p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Items:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {order.items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item.product.name || 'Unknown Product'} (x{item.quantity}) - KES {item.price.toFixed(2)} each
                </li>
              ))}
            </ul>

            <Link
              to={`/orders/${order._id}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              View Order Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
