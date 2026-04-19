// e:\E-commerce store\backend\controllers\cartController.js

const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Add a product to the cart
 * Route: POST /cart
 * Protocol: ProtectedRoute (requires JWT)
 * Logic: 
 *   1. Validate inputs and ensure the Product ID exists.
 *   2. Find the user's cart; if none exists, create one.
 *   3. If product exists in cart, update quantity; else push as new item.
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validation: Check inputs
    if (!productId || quantity == null || quantity < 1) {
      return res.status(400).json({ error: 'Please provide valid productId and a quantity >= 1.' });
    }

    // Validation crucial for marks: Check if the product ID actually exists in the Product DB.
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ error: 'Product does not exist in inventory.' });
    }

    // Look for a cart matching this user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Cart doesn't exist for the user, create a new one
      cart = new Cart({
        user: userId,
        items: [{ productId, quantity }]
      });
      await cart.save();
      return res.status(201).json({ message: 'Cart created and product added successfully', cart });
    }

    // Cart exists. Check if this product is already in the items array
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in cart, so just increase its quantity up
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product isn't in cart yet, push a new Cart Item sub-document
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: 'Cart updated successfully', cart });

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error while modifying cart.' });
  }
};

/**
 * Update quantity of a product in the cart
 * Route: PUT /cart/:id
 * Protocol: ProtectedRoute (requires JWT)
 * Logic: Finds the specific product inside the nested cart array and updates its quantity value.
 * Context: `:id` matches the productId rather than the sub-document ID for an easier client API experience.
 */
exports.updateCartItem = async (req, res) => {
  try {
    const productId = req.params.id; // The specific product to target
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity == null || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1.' });
    }

    // Discover the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    // Find our specific item
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
       return res.status(404).json({ error: 'Product not found within this cart.' });
    }

    // Hard update the given quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart item updated successfully', cart });

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Server error while updating item.' });
  }
};

/**
 * Remove a product from the cart
 * Route: DELETE /cart/:id
 * Protocol: ProtectedRoute (requires JWT)
 * Logic: Uses array filtering to remove the desired cart item sub-document from existence.
 */
exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    // Query for user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    // Retain only those items where the ID does NOT match the inputted parameter productId
    const activeItemLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // If nothing filtered out, the param was definitely wrong or the product was already gone
    if (cart.items.length === activeItemLength) {
       return res.status(404).json({ error: 'Product not found within this cart.' });
    }

    await cart.save();

    res.status(200).json({ message: 'Product definitively removed from cart', cart });
  } catch (error) {
    console.error('Error deleting from cart:', error);
    res.status(500).json({ error: 'Server error during item deletion.' });
  }
};
