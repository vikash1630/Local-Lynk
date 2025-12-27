// controllers/productController.js
const {
  getAllProductsService,
} = require("../services/AllProductsService")

exports.getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();

    res.status(200).json({
      success: true,
      count: Object.keys(products).length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
