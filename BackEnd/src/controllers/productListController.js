const productListService = require("../services/productListService")

exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const products = await productListService.getProducts(search);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
};
