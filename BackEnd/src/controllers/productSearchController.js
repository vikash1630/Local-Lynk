const searchService = require("../services/productSearchService")

exports.searchProductSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length === 0) {
      return res.status(200).json([]);
    }

    const products = await searchService.searchByName(q);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product suggestions",
      error: error.message
    });
  }
};
