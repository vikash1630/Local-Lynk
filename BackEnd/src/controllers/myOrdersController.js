const myOrdersService = require("../services/myOrdersService");

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // from JWT

    const orders = await myOrdersService.getMyOrders(userId);

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch orders",
    });
  }
};
