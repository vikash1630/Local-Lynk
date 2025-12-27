const cartService = require("../services/CartListService")

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const cartItems = await cartService.getCartService(userId);

    res.status(200).json({
      cart: cartItems,
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};
