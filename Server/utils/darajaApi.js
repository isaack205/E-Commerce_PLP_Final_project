// Imports
const axios = require('axios');
const mpesaConfig = require('../config/mpesa');
const { createHash } = require('crypto');

// Function to generate M-Pesa Access Token
const generateAccessToken = async () => {
    try {
        const authString = `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`;
        const auth = Buffer.from(authString).toString('base64');
        console.log('Attempting to generate M-Pesa access token...');
        console.log('OAuth URL:', mpesaConfig.oauthUrl);

        const response = await axios.get(mpesaConfig.oauthUrl, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        console.log('M-Pesa Access Token Generated Successfully.');
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating M-Pesa access token:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data); // <-- THIS IS THE KEY PART
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        throw new Error('Failed to generate M-Pesa access token');
    }
};

// Function to initiate STK Push
const stkPush = async (phoneNumber, amount, orderId) => {
    try {
        const accessToken = await generateAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');

        const payload = {
            BusinessShortCode: mpesaConfig.shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: mpesaConfig.shortcode,
            PhoneNumber: phoneNumber,
            CallBackURL: mpesaConfig.callbackUrl,
            AccountReference: orderId.toString(),
            TransactionDesc: `Payment for Order ${orderId}`
        };

        console.log('Initiating STK Push with payload:', JSON.stringify(payload, null, 2)); // For debugging
        const response = await axios.post(mpesaConfig.stkPushUrl, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error.response ? error.response.data : error.message);
        throw new Error('Failed to initiate M-Pesa STK Push');
    }
};

module.exports = {
    generateAccessToken,
    stkPush
};
