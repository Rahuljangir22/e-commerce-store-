// e:\E-commerce store\backend\models\Cart.js

const mongoose = require('mongoose');

/**
 * Cart Item Schema
 * This sub-document represents an individual product added to the cart,
 * along with the specified quantity.
 */
const cartItemSchema = new mongoose.Schema({
  // A reference to the Product model using its specific MongoDB ObjectId
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Links this ID to the 'Product' collection
    required: true
  },
  // The quantity of this specific product in the cart
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.'],
    default: 1
  }
});

/**
 * Cart Schema
 * Tied directly to a specific User. It holds an array of Cart Item sub-documents.
 */
const cartSchema = new mongoose.Schema({
  // The user who owns this cart
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this ID to the 'User' collection
    required: true,
    unique: true // A user should only have one active cart at a time
  },
  // An array of products and quantities explicitly forming the user's cart contents
  items: [cartItemSchema]
}, {
  timestamps: true // Keep track of when the cart was modified (updatedAt)
});

module.exports = mongoose.model('Cart', cartSchema);
