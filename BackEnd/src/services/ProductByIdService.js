const Product = require("../models/Product");

exports.getProductById = async (productId) => {
  if (!productId) {
    return null;
  }

  const product = await Product.findById(productId)
    .populate("owner", "name email");

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};
