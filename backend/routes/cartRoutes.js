// e:\E-commerce store\backend\routes\cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Cart Routes
 * Critical Detail: All route definitions here necessitate authorization. We attach authMiddleware 
 * to intercept these requests, guaranteeing req.user points to an authenticated customer.
 * 
 * Mount Location in Server: app.use('/cart', cartRoutes);
 */

// Require the user to be logged in for all Cart-specific actions
router.use(authMiddleware);

// Route: POST /cart
// Function: Add product to cart by executing validation and ensuring its existence
router.post('/', cartController.addToCart);

// Route: PUT /cart/:id
// Function: Extensively alter the overall quantities within the active user's cart array
router.put('/:id', cartController.updateCartItem);

// Route: DELETE /cart/:id
// Function: Decouples rendering item existence inside the cart specifically filtering out bad requests 
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
