// Import the central API instance
import API from './api';

// Payment service
export const paymentService = {

    /**
     * Initiates an M-Pesa STK Push payment.
     * This call is made by the customer from the frontend to your backend.
     * @param {string} orderId - The ID of the order for which payment is being made.
     * @param {string} phoneNumber - The M-Pesa phone number to which the STK Push will be sent (e.g., 2547XXXXXXXX).
     * @returns {Promise<Object>} Response from your backend, typically containing CheckoutRequestID.
     */
    initiateMpesaStkPush: async (orderId, phoneNumber) => {
        try {
            // Backend route: POST /payments/mpesa/stk-push
            const res = await API.post('/payments/mpesa/stk-push', {
                orderId,
                phoneNumber
            });
            return res.data;
        } catch (error) {
            console.error('Error initiating M-Pesa STK Push:', error.response?.data || error.message);
            throw error;
        }
    },
};
