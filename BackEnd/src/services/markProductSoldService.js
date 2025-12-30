const Product = require("../models/Product");

exports.markProductSoldService = async (userId, productId) => {
  if (!userId || !productId) {
    const error = new Error("Unauthorized or invalid product");
    error.statusCode = 400;
    throw error;
  }

  // Find product owned by this user
  const product = await Product.findOne({
    _id: productId,
    owner: userId,
  });

  if (!product) {
    const error = new Error(
      "Product not found or you are not the owner"
    );
    error.statusCode = 404;
    throw error;
  }

  // Already sold
  if (product.status === "sold") {
    const error = new Error("Product is already marked as sold");
    error.statusCode = 400;
    throw error;
  }

  // Mark as sold
  product.status = "sold";
  product.quantity = 0;

  await product.save();

  return {
    message: "Product marked as sold successfully",
    product,
  };
};
