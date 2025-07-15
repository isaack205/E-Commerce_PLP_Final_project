// config/mpesa.js
require('dotenv').config(); // Load environment variables

module.exports = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    passkey: process.env.MPESA_PASSKEY,
    shortcode: process.env.MPESA_SHORTCODE,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
    // Base URLs for Daraja API
    oauthUrl: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkPushUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
};
