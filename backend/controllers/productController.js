// e:\E-commerce store\backend\controllers\productController.js

const Product = require('../models/Product');

/**
 * Get all products
 * Route: GET /products
 * Logic: Fetches the entire directory of products from the MongoDB database.
 */
exports.getAllProducts = async (req, res) => {
  try {
    // Basic fetch of all products.
    // Use .find() without a filter or conditions to get everything.
    const products = await Product.find({});
    
    // Return standard HTTP 200 (OK) with the returned array
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error while fetching products.' });
  }
};

/**
 * Get a single product by ID
 * Route: GET /products/:id
 * Logic: Looks up details for one particular product using its unique MongoDB _id.
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Utilize Mongoose's findById method
    const product = await Product.findById(id);

    // If the product returned is null, the ID queried did not match anything in our database
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Product successfully retrieved
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    
    // Handle invalid ObjectId errors (e.g. string that isn't exactly an ObjectId cast format)
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID format.' });
    }

    res.status(500).json({ error: 'Server error while fetching product details.' });
  }
};
