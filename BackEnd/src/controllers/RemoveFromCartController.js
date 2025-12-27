const cartService = require("../services/RemoveFromCartService")

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id           // from auth middleware
    const { productId } = req.params;     // from URL params

    const updatedCart = await cartService.removeFromCartService(
      userId,
      productId
    );

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error.message);

    return res.status(400).json({
      message: error.message,
    });
  }
};
