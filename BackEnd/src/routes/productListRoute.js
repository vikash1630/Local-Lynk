const express = require("express");
const router = express.Router();

const { getProducts } = require("../controllers/productListController")

// PRODUCT LIST (SEARCH BASED)
router.get("/", getProducts);

module.exports = router;
