const express = require("express");
const router = express.Router();

const { removeFromCart } = require("../controllers/RemoveFromCartController")
const verifyToken = require("../middlewares/verifyToken");

// REMOVE FROM CART
router.delete("/remove/:productId", verifyToken, removeFromCart);

module.exports = router;
