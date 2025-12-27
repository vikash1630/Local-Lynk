const cartService = require("../services/AddtoCartService")

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id         // from auth middleware
    const { productId } = req.params;    // ✅ FROM PARAMS

    const cart = await cartService.addToCartService(
      userId,
      productId
    );

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({
      message: "Failed to add to cart",
    });
  }
};
