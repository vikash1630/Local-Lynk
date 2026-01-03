const express = require("express");
const router = express.Router();

const { buyNow } = require("../controllers/buyNowController");
const verifyToken = require("../middlewares/verifyToken");

// 🛒 BUY NOW
router.post("/buy-now/:productId", verifyToken, buyNow);

module.exports = router;
