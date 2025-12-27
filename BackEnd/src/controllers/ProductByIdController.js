const productService = require("../services/ProductByIdService")

exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch product"
    });
  }
};
