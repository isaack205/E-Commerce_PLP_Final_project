// Imports
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { addressService } from '../services/addressApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ManageAddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    if (!user) {
      setLoading(false);
      setError('Please log in to manage your addresses.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await addressService.getAddressesByUserId(user._id);
      const addressesArray = response.addresses || response; // Adjust based on your backend response structure
      const validAddresses = Array.isArray(addressesArray) ? addressesArray.filter(addr => typeof addr._id === 'string' && addr._id.length > 0) : [];
      setAddresses(validAddresses);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch addresses.');
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchAddresses();
    }
  }, [user, authLoading]);

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return; // Use a custom modal instead of window.confirm in a real app
    }
    try {
      await addressService.deleteAddress(addressId);
      toast.success('Address deleted successfully!');
      fetchAddresses(); // Re-fetch addresses to update the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address.');
      console.error('Error deleting address:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-red-600">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-red-600">
        <p className="text-lg">You must be logged in to manage addresses.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Addresses</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {addresses.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">You have no saved addresses.</p>
            <Button onClick={() => navigate('/addresses/add')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
              Add New Address
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-6">
              {addresses.map((address) => (
                <div key={address._id} className="border p-4 rounded-md shadow-sm">
                  <p className="font-semibold text-gray-800">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-gray-700">{address.addressLine2}</p>}
                  <p className="text-gray-700">{address.street}, {address.city}</p>
                  <p className="text-gray-700">{address.state ? `${address.state}, ` : ''}{address.postalCode}</p>
                  <p className="text-gray-700">{address.country}</p>
                  <div className="mt-4 flex space-x-2">
                    {/* You can add an edit page later if needed */}
                    {/* <Button variant="outline" size="sm" onClick={() => navigate(`/addresses/edit/${address._id}`)}>Edit</Button> */}
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAddress(address._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate('/addresses/add')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
              Add New Address
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
