const express = require("express");
const router = express.Router();
const { addToCart } = require("../controllers/AddtoCartController")
const verifyToken = require("../middlewares/verifyToken")

// productId comes from params
router.post("/add/:productId", verifyToken, addToCart);

module.exports = router;
