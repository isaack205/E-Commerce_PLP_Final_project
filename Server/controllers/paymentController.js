// Imports
const Order = require('../models/order');
const Payment = require('../models/payment');
const { stkPush } = require('../utils/darajaApi');
const mongoose = require('mongoose');

// Initiate M-Pesa STK Push payment
exports.initiateMpesaPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { orderId, phoneNumber } = req.body; // phoneNumber should be from user input/profile

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Valid orderId is required.' });
        }
        if (!phoneNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Phone number is required for M-Pesa payment.' });
        }

        const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Order not found or does not belong to this user.' });
        }
        if (order.paid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Order is already paid.' });
        }

        // Create a pending payment record
        const newPayment = new Payment({
            order: order._id,
            user: userId,
            amount: order.totalAmount,
            method: 'M-Pesa STK Push',
            status: 'pending', // Initial status
            transactionId: null, // Will be updated by callback
            paidAt: null
        });
        await newPayment.save({ session });

        // Initiate STK Push
        const stkResponse = await stkPush(phoneNumber, order.totalAmount, order._id.toString());

        // Check STK Push response code
        if (stkResponse.ResponseCode === '0') {
            // STK Push initiated successfully on Safaricom's side
            newPayment.transactionId = stkResponse.CheckoutRequestID; // Store this for callback matching
            await newPayment.save({ session }); // Update payment record with CheckoutRequestID
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({
                message: 'M-Pesa STK Push initiated successfully. Please check your phone.',
                checkoutRequestID: stkResponse.CheckoutRequestID,
                responseCode: stkResponse.ResponseCode
            });
        } else {
            // STK Push failed to initiate (e.g., invalid phone number, insufficient balance)
            newPayment.status = 'failed';
            newPayment.transactionId = stkResponse.CheckoutRequestID || 'N/A'; // Store if available
            await newPayment.save({ session }); // Update payment record to failed
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                message: 'Failed to initiate M-Pesa STK Push.',
                responseDescription: stkResponse.ResponseDescription,
                errorCode: stkResponse.ResponseCode
            });
        }

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        console.error('Error initiating M-Pesa payment:', error);
        res.status(500).json({ message: error.message });
    }
};

// M-Pesa Callback URL (Webhook)
exports.mpesaCallback = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const callbackData = req.body;
        console.log('M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

        const result = callbackData.Body.stkCallback;
        const checkoutRequestID = result.CheckoutRequestID;
        const resultCode = result.ResultCode;
        const resultDesc = result.ResultDesc;

        const payment = await Payment.findOne({ transactionId: checkoutRequestID }).session(session);

        if (!payment) {
            console.error('M-Pesa Callback: Payment record not found for CheckoutRequestID:', checkoutRequestID);
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Payment record not found.' });
        }

        if (resultCode === 0) {
            // Payment was successful
            const mpesaReceiptNumber = result.CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value;
            const transactionDate = result.CallbackMetadata.Item.find(item => item.Name === 'TransactionDate').Value;
            const amount = result.CallbackMetadata.Item.find(item => item.Name === 'Amount').Value;
            const phoneNumber = result.CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber').Value;

            payment.status = 'completed';
            payment.transactionId = mpesaReceiptNumber; // Update to actual M-Pesa receipt
            payment.paidAt = new Date(transactionDate);
            payment.amount = amount; // Confirm amount
            payment.phoneNumber = phoneNumber;
            await payment.save({ session });

            // Update the associated Order
            const order = await Order.findById(payment.order).session(session);
            if (order) {
                order.paid = true;
                order.status = 'paid';
                await order.save({ session });
                console.log(`Order ${order._id} marked as paid.`);
            } else {
                console.error('M-Pesa Callback: Associated order not found for payment:', payment._id);
            }
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: 'M-Pesa payment processed successfully.' });
        } else {
            // Payment failed or was cancelled by user
            payment.status = 'failed';
            payment.paidAt = new Date();
            await payment.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: `M-Pesa payment failed: ${resultDesc}` });
        }

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        console.error('Error processing M-Pesa callback:', error);
        res.status(500).json({ message: 'Internal server error processing M-Pesa callback.' });
    }
};