const express = require("express");
const router = express.Router();

const {
  markProductSoldController,
} = require("../controllers/markProductSoldController");

const verifyToken = require("../middlewares/verifyToken");

// 🔐 Mark product as sold (OWNER ONLY)
router.patch(
  "/mark-sold/:productId",
  verifyToken,
  markProductSoldController
);

module.exports = router;
