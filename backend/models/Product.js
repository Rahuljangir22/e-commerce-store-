// e:\E-commerce store\backend\models\Product.js

const mongoose = require('mongoose');

/**
 * Product Schema
 * This schema defines the structure for our product documents in the MongoDB database.
 * We include the fields required by the assignment: name, price, description, and stockQuantity.
 */
const productSchema = new mongoose.Schema({
  // Name of the product
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true // Removes leading/trailing whitespaces
  },
  // Price of the product in numerical value
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'] // Validation to ensure the price isn't below zero
  },
  // Detailed description of the product
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  // How many items are currently in stock
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be less than 0'] // Cannot have negative stock
  }
}, {
  // Automatically manage createdAt and updatedAt timestamps
  timestamps: true
});

// Export the Mongoose model so it can be used in other parts of the application
module.exports = mongoose.model('Product', productSchema);
