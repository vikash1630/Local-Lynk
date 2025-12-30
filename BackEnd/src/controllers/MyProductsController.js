const { getMyProductsService } = require("../services/MyProductsService")

exports.getMyProductsController = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // 🔑 from JWT

    const products = await getMyProductsService(userId);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("MyProducts error:", error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};
