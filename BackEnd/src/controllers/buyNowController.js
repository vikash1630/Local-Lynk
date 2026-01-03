const buyNowService = require("../services/buyNowService");

exports.buyNow = async (req, res) => {
  try {
    const buyerId = req.user.userId || req.user.id; // JWT
    const { productId } = req.params;

    const order = await buyNowService.buyNow({
      buyerId,
      productId,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to place order",
    });
  }
};
