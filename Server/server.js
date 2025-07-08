// Import modules
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');


// Initialize app
const app = express();

app.use(express.json()); // Parse json bodies
app.use(cors()); // Midddleware that establishes connection to frontend
app.use(helmet()); // Security middleware
app.use(morgan('combined')); //Logging information


const port = process.env.PORT || 5000;
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