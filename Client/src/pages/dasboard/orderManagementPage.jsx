// Imports
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ClipboardIcon, // Corrected icon import
  EyeIcon,
} from '@heroicons/react/24/outline'; // Heroicons

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Services
import { orderService } from '../../services/orderApi'; // Assuming you have this service

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null); // For viewing details
  // FIX: Initialize selectedStatus with a non-empty string for "All Statuses"
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchOrders = useCallback(async (status = 'all') => { // Default to 'all'
    setLoading(true);
    setError(null);
    try {
      const params = {};
      // FIX: Only add status param if it's not 'all'
      if (status && status !== 'all') params.status = status;
      const data = await orderService.getAllOrders(params); // Assuming getAllOrders can take status param
      setOrders(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(selectedStatus); // Fetch orders based on selected status
  }, [fetchOrders, selectedStatus]);

  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change order status to "${newStatus}"?`)) {
      return;
    }
    try {
      // This call is correct, the stringification happens in orderService.updateOrderStatus
      await orderService.updateOrder(orderId, newStatus);
      toast.success(`Order ${orderId} status updated to ${newStatus}!`);
      fetchOrders(selectedStatus); // Re-fetch orders to update the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
      console.error('Error updating order status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading orders...</p>
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
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <ClipboardIcon className="h-7 w-7 mr-3 text-blue-500" /> Order Management
      </h1>

      {/* Filter by Status Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <span className="whitespace-nowrap">Filter by Status:</span>
        <Select onValueChange={handleStatusChange} value={selectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {/* FIX: Change value from "" to "all" */}
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">No orders found {selectedStatus && selectedStatus !== 'all' && `with status: ${selectedStatus}`}.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total (Ksh)
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order Date
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order._id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {order.user ? (order.user.username || order.user.email || order.user._id) : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleViewDetails(order)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-1"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
                          Change Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-md shadow-lg">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((statusOption) => (
                          <DropdownMenuItem
                            key={statusOption}
                            onClick={() => handleUpdateOrderStatus(order._id, statusOption)}
                            className="cursor-pointer hover:bg-gray-100"
                            disabled={order.status === statusOption}
                          >
                            {statusOption}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Order Details - {currentOrder?._id}</DialogTitle>
            <DialogDescription>Full details of the selected order.</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="grid gap-4 py-4 text-gray-700 dark:text-gray-300 max-h-[70vh] overflow-y-auto">
              <p><strong>Order ID:</strong> {currentOrder._id}</p>
              <p><strong>Customer:</strong> {currentOrder.user ? (currentOrder.user.username || currentOrder.user.email || currentOrder.user._id) : 'N/A'}</p>
              <p><strong>Total Amount:</strong> Ksh {currentOrder.totalAmount ? currentOrder.totalAmount.toFixed(2) : '0.00'}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(currentOrder.status)}`}>{currentOrder.status}</span></p>
              <p><strong>Order Date:</strong> {new Date(currentOrder.orderDate).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {currentOrder.paymentMethod || 'N/A'}</p>
              <p><strong>Shipping Address:</strong></p>
              <div className="ml-4 border-l-2 pl-4 border-gray-200 dark:border-gray-700">
                <p>{currentOrder.shippingAddress?.addressLine1}</p>
                {currentOrder.shippingAddress?.addressLine2 && <p>{currentOrder.shippingAddress.addressLine2}</p>}
                <p>{currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.stateProvince}</p>
                <p>{currentOrder.shippingAddress?.postalCode}, {currentOrder.shippingAddress?.country}</p>
                <p>Phone: {currentOrder.shippingAddress?.phoneNumber}</p>
              </div>

              <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">Order Items:</h3>
              <div className="border rounded-md overflow-hidden dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentOrder.items.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.product ? item.product.name : 'Unknown Product'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">Ksh {item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
