// Import modules
require('dotenv').config(); // Makes sure environment variables are loaded
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./middlewares/customLogger')
const connectDB = require('./config/db');

// Import routes
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/categoryRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const paymentRouter = require('./routes/paymentRoute');
const addressRouter = require('./routes/addressRoute');
const shippingRouter = require('./routes/shippingRoute');


// Initialize app
const app = express();

app.use(express.json()); // Parse json bodies
app.use(cors()); // Midddleware that establishes connection to frontend
app.use(helmet()); // Security middleware
app.use(logger); // Logging information

// Define API Routes endpoint
app.use('/api/users', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/shippings', shippingRouter);

// 7. Basic Health Check Route
app.get('/', (req, res) => {
    res.send('E-commerce API is running! 🛒');
});

const port = process.env.PORT || 5000; // Load from env with a fallback port
// connect database
connectDB()
.then(() => {
    // Listenning to the server only when the database is connected
    app.listen(port, () =>{
        console.log(`Server running at http://localhost:${port}`)
    });
}).catch((err) => {
    console.error('Error:', err);
    process.exit(1);
})