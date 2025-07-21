// client/src/pages/dashboard/ShippingManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  TruckIcon, // For shipping icon
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon, // For view details
} from '@heroicons/react/24/outline'; // Heroicons

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // For description
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
import { shippingService } from '../../services/shippingApi'; // Import your shipping service

export default function ShippingManagementPage() {
  const [shippingRecords, setShippingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShippingRecord, setCurrentShippingRecord] = useState(null); // For editing/viewing
  const [formData, setFormData] = useState({ // For form inputs
    order: '', // Will store order ID
    address: '', // Will store address ID
    status: 'pending', // Default status for new records
    trackingNumber: '',
    shippedAt: '', // For update
    deliveredAt: '', // For update
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingStatuses = ['pending', 'shipped', 'in-transit', 'out-for-delivery', 'delivered', 'cancelled', 'returned'];

  const fetchShippingRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shippingService.getAllShippings();
      console.log("ShippingManagementPage: Raw data from getAllShippings:", data); // Debug log
      // CRITICAL FIX: Extract the 'shippings' array from the response object
      setShippingRecords(Array.isArray(data.shippings) ? data.shippings : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipping records.');
      console.error('ShippingManagementPage: Error fetching shipping records:', err);
      toast.error('Failed to load shipping records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShippingRecords();
  }, [fetchShippingRecords]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle status select change in the modal
  const handleStatusSelectChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      status: value
    }));
  };

  // Open modal for creating a new shipping record
  const handleCreateNewRecord = () => {
    setIsEditing(false);
    setCurrentShippingRecord(null);
    setFormData({
      order: '',
      address: '',
      status: 'pending',
      trackingNumber: '',
      shippedAt: '',
      deliveredAt: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing shipping record
  const handleEditRecord = (record) => {
    setIsEditing(true);
    setCurrentShippingRecord(record);
    setFormData({
      order: record.order?._id || '', // Use order ID for display/edit
      address: record.address?._id || '', // Use address ID for display/edit
      status: record.status,
      trackingNumber: record.trackingNumber || '',
      shippedAt: record.shippedAt ? new Date(record.shippedAt).toISOString().split('T')[0] : '',
      deliveredAt: record.deliveredAt ? new Date(record.deliveredAt).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation for required fields
    if (!formData.order && !isEditing) { // Order ID only required for creation
      toast.error('Order ID is required for new shipping records.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.address && !isEditing) { // Address ID only required for creation
      toast.error('Address ID is required for new shipping records.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.status) {
      toast.error('Status is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        // For update, only send fields that are meant to be updated via this form
        const updatePayload = {
          status: formData.status,
          trackingNumber: formData.trackingNumber,
          shippedAt: formData.shippedAt || null, // Send null if empty string
          deliveredAt: formData.deliveredAt || null, // Send null if empty string
        };
        await shippingService.updateShipping(currentShippingRecord._id, updatePayload);
        toast.success('Shipping record updated successfully!');
      } else {
        // For creation, send all required fields
        const createPayload = {
          order: formData.order,
          address: formData.address,
          status: formData.status,
          trackingNumber: formData.trackingNumber,
        };
        await shippingService.createShipping(createPayload);
        toast.success('Shipping record created successfully!');
      }
      setIsModalOpen(false); // Close modal
      fetchShippingRecords(); // Re-fetch records to update the list
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} shipping record.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} shipping record:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status change from dropdown menu (for table row actions)
  const handleUpdateStatusFromDropdown = async (recordId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change shipping status to "${newStatus}"?`)) {
      return;
    }
    try {
      await shippingService.updateShipping(recordId, { status: newStatus });
      toast.success(`Shipping record ${recordId} status updated to ${newStatus}!`);
      fetchShippingRecords(); // Re-fetch records to update the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update shipping status.');
      console.error('Error updating shipping status:', err);
    }
  };

  // Handle shipping record deletion
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this shipping record? This action cannot be undone.')) {
      return;
    }
    try {
      await shippingService.deleteShipping(recordId);
      toast.success('Shipping record deleted successfully!');
      fetchShippingRecords(); // Re-fetch records
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete shipping record.');
      console.error('Error deleting shipping record:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading shipping records...</p>
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
        <TruckIcon className="h-7 w-7 mr-3 text-blue-500" /> Shipping Management
      </h1>

      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNewRecord} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Add New Shipping Record
        </Button>
      </div>

      {shippingRecords.length === 0 ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">No shipping records found. Add a new record or ensure orders are processed.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Record ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tracking No.
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Shipped At
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Delivered At
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {shippingRecords.map((record) => (
                <tr key={record._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {record._id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.order?._id || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {record.address ? `${record.address.city}, ${record.address.country}` : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.trackingNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.shippedAt ? new Date(record.shippedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.deliveredAt ? new Date(record.deliveredAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleEditRecord(record)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-1"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
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
                        {shippingStatuses.map((statusOption) => (
                          <DropdownMenuItem
                            key={statusOption}
                            onClick={() => handleUpdateStatusFromDropdown(record._id, statusOption)}
                            className="cursor-pointer hover:bg-gray-100"
                            disabled={record.status === statusOption}
                          >
                            {statusOption}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      onClick={() => handleDeleteRecord(record._id)}
                      variant="destructive"
                      size="sm"
                      className="ml-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Shipping Record Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Shipping Record' : 'Create New Shipping Record'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Make changes to the shipping record here.' : 'Fill in the details for a new shipping record.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">Order ID</Label>
              <Input
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={isEditing} // Order ID should not be editable after creation
                required={!isEditing} // Required only for creation
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address ID</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={isEditing} // Address ID should not be editable after creation
                required={!isEditing} // Required only for creation
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={handleStatusSelectChange} value={formData.status} className="col-span-3">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {shippingStatuses.map(statusOption => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackingNumber" className="text-right">Tracking No.</Label>
              <Input
                id="trackingNumber"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            {isEditing && ( // Only show these fields when editing
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shippedAt" className="text-right">Shipped At</Label>
                  <Input
                    id="shippedAt"
                    name="shippedAt"
                    type="date"
                    value={formData.shippedAt}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deliveredAt" className="text-right">Delivered At</Label>
                  <Input
                    id="deliveredAt"
                    name="deliveredAt"
                    type="date"
                    value={formData.deliveredAt}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Record')}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
