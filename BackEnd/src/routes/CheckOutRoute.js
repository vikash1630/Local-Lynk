const express = require("express");
const router = express.Router();

const { buyWholeCart } = require("../controllers/CheckOutController")
const verifyToken = require("../middlewares/verifyToken");

// 🛒 BUY WHOLE CART
router.post("/buy-cart", verifyToken, buyWholeCart);

module.exports = router;
