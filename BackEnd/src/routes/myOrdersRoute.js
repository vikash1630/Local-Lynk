const express = require("express");
const router = express.Router();

const { getMyOrders } = require("../controllers/myOrdersController");
const verifyToken = require("../middlewares/verifyToken");

// 📦 GET MY ORDERS (buyer only)
router.get("/my-orders", verifyToken, getMyOrders);

module.exports = router;
