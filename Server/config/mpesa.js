// config/mpesa.js
require('dotenv').config(); // Load environment variables

module.exports = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    passkey: process.env.MPESA_PASSKEY,
    shortcode: process.env.MPESA_SHORTCODE,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
    // Base URLs for Daraja API
    oauthUrl: process.env.MPESA_OAUTH_URL,
    stkPushUrl: process.env.MPESA_STK_PUSH_URL
};
