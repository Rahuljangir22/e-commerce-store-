// e:\E-commerce store\backend\routes\productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * Product Routes
 * Handling all public product-fetching APIs.
 * Mount Location in Server: app.use('/products', productRoutes);
 */

// Route: GET /products
// Function: Fetch list of all products from MongoDB
router.get('/', productController.getAllProducts);

// Route: GET /products/:id
// Function: Fetch single product by MongoDB _id
router.get('/:id', productController.getProductById);

module.exports = router;
