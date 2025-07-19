// Imports
import React, { useState } from 'react';
import { shippingService } from '../services/shippingApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TrackShippingPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [shippingDetails, setShippingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) {
      toast.error('Please enter an Order ID or Tracking Number.');
      return;
    }

    setLoading(true);
    setError(null);
    setShippingDetails(null); // Clear previous details

    try {
      // Attempt to fetch by Order ID first
      let data = null;
      try {
        data = await shippingService.getShippingByOrderId(trackingInput.trim());
      } catch (orderIdError) {
        // If not found by Order ID, try fetching by Shipping ID (tracking number)
        console.warn('Shipping not found by Order ID, trying as Shipping ID:', orderIdError);
        data = await shippingService.getShippingById(trackingInput.trim());
      }

      setShippingDetails(data);
      toast.success('Shipping details fetched successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipping details. Please check the ID.');
      console.error('Error fetching shipping details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Track Your Order</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleTrack} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="trackingInput">Order ID or Tracking Number</Label>
            <Input
              id="trackingInput"
              type="text"
              placeholder="Enter Order ID or Tracking Number"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            {loading ? 'Tracking...' : 'Track Order'}
          </Button>
        </form>

        {error && (
          <div className="text-red-600 text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        {shippingDetails && (
          <div className="border-t pt-6 mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Shipping Information</h2>
            <p className="text-gray-700"><span className="font-semibold">Order ID:</span> {shippingDetails.orderId || 'N/A'}</p>
            <p className="text-gray-700"><span className="font-semibold">Tracking Number:</span> {shippingDetails.trackingNumber || 'N/A'}</p>
            <p className="text-gray-700"><span className="font-semibold">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                shippingDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                shippingDetails.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                shippingDetails.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {shippingDetails.status || 'N/A'}
              </span>
            </p>
            {shippingDetails.estimatedDeliveryDate && (
              <p className="text-gray-700"><span className="font-semibold">Estimated Delivery:</span> {new Date(shippingDetails.estimatedDeliveryDate).toLocaleDateString()}</p>
            )}
            {shippingDetails.carrier && (
              <p className="text-gray-700"><span className="font-semibold">Carrier:</span> {shippingDetails.carrier}</p>
            )}
            {shippingDetails.currentLocation && (
              <p className="text-gray-700"><span className="font-semibold">Current Location:</span> {shippingDetails.currentLocation}</p>
            )}

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Shipping Address:</h3>
            {shippingDetails.addressId ? ( // Assuming addressId is populated or linked to full address
              <p className="text-gray-700">
                {shippingDetails.addressId.addressLine1}
                {shippingDetails.addressId.addressLine2 ? `, ${shippingDetails.addressId.addressLine2}` : ''}
                {shippingDetails.addressId.street ? `, ${shippingDetails.addressId.street}` : ''}
                {shippingDetails.addressId.city ? `, ${shippingDetails.addressId.city}` : ''}
                {shippingDetails.addressId.state ? `, ${shippingDetails.addressId.state}` : ''}
                {shippingDetails.addressId.postalCode ? `, ${shippingDetails.addressId.postalCode}` : ''}
                {shippingDetails.addressId.country ? `, ${shippingDetails.addressId.country}` : ''}
              </p>
            ) : (
              <p className="text-gray-600">Address details not available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
