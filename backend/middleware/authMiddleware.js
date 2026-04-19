// e:\E-commerce store\backend\middleware\authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * This intermediary function checks for a valid JWT token in the request headers 
 * before allowing access to protected API routes.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Look for the 'Authorization' header in the incoming HTTP request.
    const authHeader = req.header('Authorization');

    // If the header doesn't exist or doesn't start with 'Bearer ', reject access.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No valid token format provided.' });
    }

    // 2. Extract the token value by splitting 'Bearer <token_string>'
    const token = authHeader.split(' ')[1];

    // 3. Verify the token using our secret key (stored in environment variables).
    // The jwt.verify function synchronously throws an error if validation fails (e.g. expired or tampered).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Token is valid. Make sure the user actually still exists in our database.
    // Sometimes tokens exist but the user might have been deleted.
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password from the result for security
    
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    // 5. Attach the authenticated user object to the request.
    // Now, any subsequent controller handling this request has access to req.user
    req.user = user;

    // 6. Signal Express to move on to the next middleware or route handler function.
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    
    // Distinguish between an expired token and other invalid token scenarios
    if (error.name === 'TokenExpiredError') {
       return res.status(401).json({ error: 'Token expired. Please login again.' });
    }

    // A catch-all for any other validation failure
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
