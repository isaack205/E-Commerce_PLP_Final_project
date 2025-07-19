// client/src/pages/dashboard/AddressManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  MapPinIcon, // For address icon
  EyeIcon,    // For view details
  UserIcon    // For user filter
} from '@heroicons/react/24/outline'; // Heroicons

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Services
import { addressService } from '../../services/addressApi'; // Assuming you have this service
import { authService } from '../../services/authApi'; // To get user details for filtering by ID

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null); // For viewing details
  const [filterUserId, setFilterUserId] = useState('');
  const [isSubmittingFilter, setIsSubmittingFilter] = useState(false);

  const fetchAddresses = useCallback(async (userId = null) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (userId) {
        data = await addressService.getAddressesByUserId(userId);
      } else {
        data = await addressService.getAllAddresses();
      }
      setAddresses(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch addresses.');
      console.error('Error fetching addresses:', err);
      toast.error('Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses(); // Initial fetch of all addresses
  }, [fetchAddresses]);

  const handleViewDetails = (address) => {
    setCurrentAddress(address);
    setIsModalOpen(true);
  };

  const handleFilterByUserId = async (e) => {
    e.preventDefault();
    setIsSubmittingFilter(true);
    if (filterUserId.trim()) {
      // Optional: Validate if userId exists before fetching addresses for it
      try {
        await authService.getProfileById(filterUserId.trim()); // Assuming this endpoint exists and validates user ID
        fetchAddresses(filterUserId.trim());
        toast.success(`Filtering addresses for User ID: ${filterUserId.trim()}`);
      } catch (err) {
        toast.error(err.response?.data?.message || 'User ID not found or invalid.');
        console.error('Error validating user ID:', err);
        setAddresses([]); // Clear addresses if user ID is invalid
      } finally {
        setIsSubmittingFilter(false);
      }
    } else {
      fetchAddresses(); // Fetch all if filter is cleared
      toast.info('Showing all addresses.');
      setIsSubmittingFilter(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading addresses...</p>
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
        <MapPinIcon className="h-7 w-7 mr-3 text-blue-500" /> Address Management
      </h1>

      {/* Filter by User ID Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Label htmlFor="filterUserId" className="whitespace-nowrap">Filter by User ID:</Label>
        <Input
          id="filterUserId"
          type="text"
          placeholder="Enter User ID"
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleFilterByUserId} disabled={isSubmittingFilter} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
          <UserIcon className="h-5 w-5 mr-2" /> {isSubmittingFilter ? 'Filtering...' : 'Apply Filter'}
        </Button>
        <Button onClick={() => { setFilterUserId(''); fetchAddresses(); }} variant="outline" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          Clear Filter
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">No addresses found {filterUserId && `for User ID: ${filterUserId}`}.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address Line 1
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  City
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Postal Code
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Country
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {addresses.map((address) => (
                <tr key={address._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {address.user ? address.user._id : 'N/A'} {/* Display user ID, or N/A if not populated */}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {address.addressLine1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {address.city}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {address.postalCode}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {address.country}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleViewDetails(address)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Address Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Address Details</DialogTitle>
            <DialogDescription>Full details of the selected address.</DialogDescription>
          </DialogHeader>
          {currentAddress && (
            <div className="grid gap-4 py-4 text-gray-700 dark:text-gray-300">
              <p><strong>User ID:</strong> {currentAddress.user ? currentAddress.user._id : 'N/A'}</p>
              <p><strong>Address Line 1:</strong> {currentAddress.addressLine1}</p>
              <p><strong>Address Line 2:</strong> {currentAddress.addressLine2 || 'N/A'}</p>
              <p><strong>City:</strong> {currentAddress.city}</p>
              <p><strong>State/Province:</strong> {currentAddress.stateProvince || 'N/A'}</p>
              <p><strong>Postal Code:</strong> {currentAddress.postalCode}</p>
              <p><strong>Country:</strong> {currentAddress.country}</p>
              <p><strong>Phone Number:</strong> {currentAddress.phoneNumber || 'N/A'}</p>
              <p><strong>Is Default:</strong> {currentAddress.isDefault ? 'Yes' : 'No'}</p>
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
