// e:\E-commerce store\backend\models\User.js

const mongoose = require('mongoose');

/**
 * User Schema
 * Defines the user structure for our platform.
 * This model contains the user's name, email, and the hashed version of their password.
 */
const userSchema = new mongoose.Schema({
  // The user's full name
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  // The user's email address, which must be unique across the platform
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures no two users can register with the exact same email
    trim: true,
    lowercase: true, // Automatically converts email to lowercase to prevent duplicates with different casing
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ] // Basic regex validation for common email formats
  },
  // The user's hashed password (never store passwords in plain text!)
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, {
  timestamps: true // Tracks when the user was created and last updated
});

// Export the user model
module.exports = mongoose.model('User', userSchema);
