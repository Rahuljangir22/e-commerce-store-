// e:\E-commerce store\backend\server.js

const dotenv = require('dotenv');

/**
 * .env Loading
 * Always load environment variables before importing other dependencies
 * to ensure modules that rely on env execution contexts work flawlessly.
 */
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');

// Create the Express application wrapper
const app = express();

/**
 * Global Middlewares
 * - express.json(): Extracts traditional JSON payloads originating from POST/PUT Requests so we can use req.body.
 */
app.use(express.json());

// Import all distinct monolithic route collections
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

/**
 * Route Mount Configurations
 * Binding generic URI starting paths to explicitly distinct modular route abstractions
 */
app.use('/', userRoutes);        // Mount POST /register and POST /login directly at root as specified
app.use('/products', productRoutes); // Maps generic '/products' 
app.use('/cart', cartRoutes);        // Maps strictly protected cart components

// Catch-all 404 middleware for unhandled route segments
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found. Check URL formatting.' });
});

// Centralized error handling wrapper responding natively with formatted JSON
app.use((err, req, res, next) => {
  console.error("Unhandled Error Instance:", err);
  res.status(500).json({ error: 'Critical Internal Express Server Fault Detected.' });
});

/**
 * Database & App Instantiation
 * Utilizing environment variables. Connecting directly to our MongoDB endpoint instances.
 */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
   console.error('FATAL ERROR: MONGO_URI is not defined into environment variables. Exiting.');
   process.exit(1);
}

// Connect aggressively to MongoDB relying gracefully on asynchronous Promises
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Database');
    // Start listening on specific port explicitly on IPv4 localhost 127.0.0.1 to avoid ECONNREFUSED errors
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Backend Express Server executing openly on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Initial MongoDB Connection Establishment Faltered:', err);
  });

module.exports = app;
