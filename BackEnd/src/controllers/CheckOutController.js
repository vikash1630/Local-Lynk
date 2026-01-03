const buyCartService = require("../services/CheckOutService")

exports.buyWholeCart = async (req, res) => {
  try {
    // 👤 buyerId from JWT
    const buyerId = req.user.userId || req.user.id;

    const result = await buyCartService.buyWholeCart(buyerId);

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to purchase cart",
    });
  }
};
