// Imports
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderApi';
import { useAuth } from '../contexts/authContext';

function OrderDetailsPage() {
  const { id } = useParams(); // Get the order ID from the URL
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        setLoading(false);
        setError('Please log in to view order details.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getOrderById(id); // Fetch specific order by ID
        const fetchedOrder = response.order || response.data || response;

        // Ensure it's an array before setting state
        if (fetchedOrder && typeof fetchedOrder === 'object' && !Array.isArray(fetchedOrder) && fetchedOrder._id) {
          setOrder(fetchedOrder);
        } else {
          console.error("OrderDetailsPage: Fetched order details - unexpected format or missing _id:", response);
          setOrder(null); // Set to null if format is unexpected or _id is missing
          setError('Failed to load order detail: Unexpected data format or missing order ID.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details.');
        console.error('Error fetching order details:', err);
        setOrder(null); // Ensure order is null on error
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) { // Only fetch order once auth state is determined
      fetchOrderDetails();
    }
  }, [id, user, authLoading]); // Re-fetch if order ID, user, or auth loading state changes

  if (authLoading || loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-600">Error: {error}</p>
        <Link to="/orders" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Back to Order History
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700">Order not found.</p>
        <Link to="/orders" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Order Details: {order._id}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'paid' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </p>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
            {/*<p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Total Amount:</span> KES {order.totalAmount.toFixed(2)}</p>*/}
            <p className="text-gray-700 text-lg mb-2">
              <span className="font-semibold">Total Amount:</span>{' '}
              {typeof order.totalAmount === 'number' ? `KES ${order.totalAmount.toFixed(2)}` : 'N/A'}
            </p>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Payment Method:</span> {order.paymentMethod || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Shipping Address:</h3>
            {order.shippingAddress ? (
              <p className="text-gray-700">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                {order.shippingAddress.street ? `, ${order.shippingAddress.street}` : ''}
                {order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}
                {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
                {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
                {order.shippingAddress.country ? `, ${order.shippingAddress.country}` : ''}
              </p>
            ) : (
              <p className="text-gray-600">Address details not available.</p>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-t pt-4">Order Items:</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
              <img
                src={item.productId?.image || `https://placehold.co/80x80/E0E0E0/333333?text=${encodeURIComponent(item.productId?.name || 'Product')}`}
                alt={item.productId?.name || 'Product Image'}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <p className="text-lg font-semibold text-gray-800">{item.productId?.name || 'Unknown Product'}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: KES {item.price.toFixed(2)}</p>
              </div>
              <p className="text-lg font-bold text-gray-800">KES {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <Link to="/orders" className="inline-block bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors">
            Back to Order History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
