const express = require("express");
const router = express.Router();

const { searchProductSuggestions } = require("../controllers/productSearchController")

router.get("/search", searchProductSuggestions);

module.exports = router;
