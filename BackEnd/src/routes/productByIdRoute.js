const express = require("express");
const router = express.Router();

const { getProductDetails } = require("../controllers/ProductByIdController")

// PRODUCT DETAILS PAGE
router.get("/:productId", getProductDetails);

module.exports = router;
