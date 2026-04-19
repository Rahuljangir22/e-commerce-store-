// e:\E-commerce store\backend\controllers\userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * Route: POST /register
 * Logic: Validates input, checks for existing user, hashes password, and saves the new user to the DB.
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation - Ensure all required fields have been sent
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    // 2. Check if a user with this email already exists in our MongoDB database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // 3. Hash the password for security using bcrypt
    // A salt round of 10 represents a good balance of security vs performance
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user object with the hashed password 
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // 5. Save the newly created user to MongoDB
    await newUser.save();

    // 6. Return a highly successful response, excluding the password from the payload
    res.status(201).json({ 
      message: 'User registered successfully!', 
      user: { id: newUser._id, name: newUser.name, email: newUser.email } 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    // 500 signals a generic Internal Server Error if something completely unexpected happens
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

/**
 * Login existing user
 * Route: POST /login
 * Logic: Checks if the user exists, compares passwords, and signs/returns a JSON Web Token.
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Ensure email and password were provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // 2. Search for the user by their email address
    const user = await User.findOne({ email });
    if (!user) {
      // Return 401 Unauthorized for incorrect credentials
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Compare the provided plain-text password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 4. Generate the JWT (JSON Web Token)
    // We embed 'userId' into the payload, which our authMiddleware will later use
    if (!process.env.JWT_SECRET) {
      throw new Error("Missing JWT_SECRET in environment variables");
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); // Valid for 1 day

    // 5. Respond back with the token so the client can store it (e.g., in localStorage)
    res.status(200).json({
      message: 'Login successful!',
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
};
