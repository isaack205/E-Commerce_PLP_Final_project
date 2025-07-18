// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { orderService } from '../services/orderApi';
import { addressService } from '../services/addressApi';
import { cartService } from '../services/cartApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentApi';

// This component does NOT accept triggerCartRefresh as a prop
export default function CheckoutPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Local state for cart management, replacing CartContext
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddressData, setNewAddressData] = useState({ addressLine1: '', addressLine2: '', street: '', city: '', postalCode: '', country: '' });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // Default payment method
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || ''); // M-Pesa phone number

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addressFetchError, setAddressFetchError] = useState(null);

  // Function to fetch cart data locally
  const fetchCart = useCallback(async () => {
    if (authLoading) {
      setCartLoading(true);
      return;
    }

    if (!isAuthenticated || !user) {
      setCart(null);
      setCartLoading(false);
      return;
    }

    try {
      setCartLoading(true);
      setCartError(null);
      const fetchedCart = await cartService.getCartByUserId(user._id);
      setCart(fetchedCart);
    } catch (err) {
      setCartError(err.response?.data?.message || 'Failed to load cart.');
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  // Initial fetch for cart and addresses
  useEffect(() => {
    fetchCart(); // Fetch cart locally

    const fetchAddresses = async () => {
      if (!isAuthenticated || !user) {
        setLoadingAddresses(false);
        return;
      }
      try {
        setLoadingAddresses(true);
        setAddressFetchError(null);
        const response = await addressService.getAddressesByUserId(user._id);
        const addressesArray = response.addresses || response;
        const validAddresses = Array.isArray(addressesArray) ? addressesArray.filter(addr => typeof addr._id === 'string' && addr._id.length > 0) : [];
        setUserAddresses(validAddresses); 
        if (validAddresses.length > 0) {
          setSelectedAddressId(validAddresses[0]._id);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setAddressFetchError(err.response?.data?.message || 'Failed to load addresses.');
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (!authLoading && isAuthenticated && user) {
      fetchAddresses();
      // Pre-fill phone number if available from user object
      if (user.phoneNumber) {
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [isAuthenticated, user, authLoading, fetchCart]);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please log in to proceed to checkout.');
      navigate('/login');
    } else if (!authLoading && isAuthenticated && !cartLoading && (!cart || cart.items.length === 0)) {
      toast.info('Your cart is empty. Please add items before checking out.');
      navigate('/cart');
    }
  }, [authLoading, isAuthenticated, cart, cartLoading, navigate]);

  const handleNewAddressChange = (e) => {
    setNewAddressData({ ...newAddressData, [e.target.name]: e.target.value });
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    // Basic validation for new address form
    if ( !newAddressData.addressLine1 || !newAddressData.street || !newAddressData.city || !newAddressData.postalCode || !newAddressData.country) {
      toast.error('Please fill in all required new address fields.');
      return;
    }

    try {
      setLoadingAddresses(true); // Use loadingAddresses for this specific action
      const savedAddressResponse = await addressService.createAddress(newAddressData);
      const newAddr = savedAddressResponse.address || savedAddressResponse; // Adjust based on your actual backend response
      if (newAddr && typeof newAddr._id === 'string' && newAddr._id.length > 0) {
        setUserAddresses(prev => [...prev, newAddr]);
        setSelectedAddressId(newAddr._id);
        setShowNewAddressForm(false);
        setNewAddressData({ addressLine1: '', addressLine2: '', street: '', city: '', state: '', postalCode: '', country: '' });
        toast.success('New address added successfully!');
      } else {
        toast.error('Failed to add new address: Invalid response from server.');
        console.error('Invalid address response:', savedAddressResponse);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save new address.');
      console.error('Save new address error:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);

    if (!selectedAddressId && !showNewAddressForm) {
      toast.error('Please select an address or add a new one.');
      setPlacingOrder(false);
      return;
    }
    if (cart.items.length === 0) {
      toast.error('Your cart is empty.');
      setPlacingOrder(false);
      return;
    }
    if (paymentMethod === 'mpesa' && (!phoneNumber || !/^\d{10,12}$/.test(phoneNumber))) { // Basic phone number validation
      toast.error('Please provide a valid M-Pesa phone number.');
      setPlacingOrder(false);
      return;
    }

    try {
      const orderData = {
        addressId: selectedAddressId,
        // You can add paymentMethod here if your backend needs it at order creation
        // paymentMethod: paymentMethod,
      };
      const response = await orderService.createOrder(orderData); // Pass addressId
      toast.success('Order placed successfully!');
      console.log('Order placed:', response);

      // Step 2: Initiate Payment (if M-Pesa)
      if (paymentMethod === 'mpesa') {
        const paymentRes = await paymentService.initiateMpesaStkPush(response.order._id, phoneNumber);
        toast.info(paymentRes.message || 'M-Pesa STK Push initiated. Please check your phone.');
        toast.info('M-Pesa STK Push initiated. Please check your phone. (Functionality not fully implemented in frontend yet)');
      } else if (paymentMethod === 'cod') {
        toast.success('Order placed successfully! Payment will be collected on delivery.');
      }

      // After successful order creation/payment initiation, clear local cart state
      setCart({ items: [] }); // This clears the cart display on this page

      // Redirect to order history or a success page
      navigate(`/orders/${response.order._id}`); // Navigate to order details page

    } catch (err) {
      console.error('Error placing order:', err);
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateCartTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };


  if (authLoading || cartLoading || loadingAddresses) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Loading checkout details...</p>
      </div>
    );
  }

  if (cartError || addressFetchError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-red-600">
        <p className="text-lg">Error: {cartError || addressFetchError}</p>
      </div>
    );
  }

  if (!isAuthenticated || !cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex justify-between items-center text-gray-700">
                <span>{item.product.name} (x{item.quantity})</span>
                <span>Ksh {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
            <span>Total:</span>
            <span>Ksh {calculateCartTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Shipping Address</h2>
          {userAddresses.length === 0 && !showNewAddressForm ? (
            <p className="text-gray-600 mb-4">No addresses found. Please add a new one.</p>
          ) : (
            <div className="mb-6">
              <Label htmlFor="address-select" className="mb-2 block">Select Address:</Label>
              <Select onValueChange={setSelectedAddressId} value={selectedAddressId}>
                <SelectTrigger id="address-select" className="w-full">
                  <SelectValue placeholder="Select a shipping address" />
                </SelectTrigger>
                <SelectContent>
                  {userAddresses.map((address) => (
                    <SelectItem key={address._id} value={address._id}>
                      {/* FIX: Build address string more robustly to avoid ",,," */}
                      {[
                        address.addressLine1,
                        address.addressLine2,
                        address.street,
                        address.city,
                        address.state,
                        address.postalCode,
                        address.country
                      ].filter(Boolean).join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
                {/* <SelectContent>
                  {userAddresses.map((address) => (
                    <SelectItem key={address._id} value={address._id}>
                      {address.addressLine1}, {address.addressLine2}, {address.street}, {address.city}, {address.postalCode}, {address.country}
                    </SelectItem>
                  ))}
                </SelectContent> */}
              </Select>
            </div>
          )}
          <Button
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
          >
            {showNewAddressForm ? 'Hide New Address Form' : 'Add New Address'}
          </Button>

          {showNewAddressForm && (
            <form onSubmit={handleSaveNewAddress} className="mt-4 space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">New Address Details</h3>
              <Input type="text" name="addressLine1" placeholder="addressLine1" value={newAddressData.addressLine1} onChange={handleNewAddressChange} required className="w-full px-3 py-2 border rounded-md" />
              <Input type="text" name="addressLine2" placeholder="addressLine2" value={newAddressData.addressLine2} onChange={handleNewAddressChange} className="w-full px-3 py-2 border rounded-md" />
              <Input type="text" name="street" placeholder="Street" value={newAddressData.street} onChange={handleNewAddressChange} required className="w-full px-3 py-2 border rounded-md" />
              <Input type="text" name="city" placeholder="City" value={newAddressData.city} onChange={handleNewAddressChange} required className="w-full px-3 py-2 border rounded-md" />
              <Input type="text" name="postalCode" placeholder="Postal Code" value={newAddressData.postalCode} onChange={handleNewAddressChange} required className="w-full px-3 py-2 border rounded-md" />
              <Input type="text" name="country" placeholder="Country" value={newAddressData.country} onChange={handleNewAddressChange} required className="w-full px-3 py-2 border rounded-md" />
              <Button type="submit" disabled={loadingAddresses} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                {loadingAddresses ? 'Saving...' : 'Save Address'}
              </Button>
            </form>
          )}

          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 mt-8">Payment Method</h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="mpesa"
                name="paymentMethod"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <Label htmlFor="mpesa">M-Pesa</Label>
            </div>
            {paymentMethod === 'mpesa' && (
              <Input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="M-Pesa Phone Number (e.g., 2547XXXXXXXX)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required={paymentMethod === 'mpesa'}
              />
            )}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <Label htmlFor="cashOnDelivery">Cash on Delivery</Label>
            </div>
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={placingOrder || !selectedAddressId || userAddresses.length === 0 || !cart || cart.items.length === 0 || (paymentMethod === 'mpesa' && (!phoneNumber || phoneNumber.length < 10))}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors text-lg"
          >
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
