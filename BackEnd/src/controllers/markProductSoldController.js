const {
  markProductSoldService,
} = require("../services/markProductSoldService")

exports.markProductSoldController = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // 🔑 from JWT
    const { productId } = req.params;

    const result = await markProductSoldService(
      userId,
      productId
    );

    res.status(200).json({
      success: true,
      message: result.message,
      product: result.product,
    });
  } catch (error) {
    console.error("Mark sold error:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to mark product as sold",
    });
  }
};
