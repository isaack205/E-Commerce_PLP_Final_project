// Imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressService } from '../services/addressApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AddAddressPage() {
  const navigate = useNavigate();
  const [newAddressData, setNewAddressData] = useState({
    addressLine1: '',
    addressLine2: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewAddressChange = (e) => {
    setNewAddressData({ ...newAddressData, [e.target.name]: e.target.value });
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    // Basic validation for new address form
    if ( !newAddressData.addressLine1 || !newAddressData.street || !newAddressData.city || !newAddressData.postalCode || !newAddressData.country) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const savedAddressResponse = await addressService.createAddress(newAddressData);
      const newAddr = savedAddressResponse.address || savedAddressResponse; // Adjust based on your actual backend response
      if (newAddr && typeof newAddr._id === 'string' && newAddr._id.length > 0) {
        toast.success('New address added successfully!');
        navigate('/addresses'); // Navigate back to manage addresses page
      } else {
        toast.error('Failed to add new address: Invalid response from server.');
        console.error('Invalid address response:', savedAddressResponse);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save new address.');
      console.error('Save new address error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Add New Address</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSaveNewAddress} className="space-y-4">
          <div>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input type="text" name="addressLine1" id="addressLine1" placeholder="e.g., 123 Main St" value={newAddressData.addressLine1} onChange={handleNewAddressChange} required className="w-full mt-1" />
          </div>
          <div>
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input type="text" name="addressLine2" id="addressLine2" placeholder="e.g., Apt 4B" value={newAddressData.addressLine2} onChange={handleNewAddressChange} className="w-full mt-1" />
          </div>
          <div>
            <Label htmlFor="street">Street</Label>
            <Input type="text" name="street" id="street" placeholder="e.g., Downtown Avenue" value={newAddressData.street} onChange={handleNewAddressChange} required className="w-full mt-1" />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input type="text" name="city" id="city" placeholder="e.g., Nairobi" value={newAddressData.city} onChange={handleNewAddressChange} required className="w-full mt-1" />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input type="text" name="postalCode" id="postalCode" placeholder="e.g., 00100" value={newAddressData.postalCode} onChange={handleNewAddressChange} required className="w-full mt-1" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input type="text" name="country" id="country" placeholder="e.g., Kenya" value={newAddressData.country} onChange={handleNewAddressChange} required className="w-full mt-1" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            {isSubmitting ? 'Adding Address...' : 'Add Address'}
          </Button>
        </form>
      </div>
    </div>
  );
}
