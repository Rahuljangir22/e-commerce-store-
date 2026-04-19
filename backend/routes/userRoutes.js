// e:\E-commerce store\backend\routes\userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * User Routes
 * We use Express's Router object to modularize our RESTful user endpoints.
 * Mount Location in Server: app.use('/', userRoutes);
 */

// Route: POST /register
// Function: Create new user
router.post('/register', userController.registerUser);

// Route: POST /login
// Function: Authenticate existing user
router.post('/login', userController.loginUser);

module.exports = router;
