const express = require("express");
const router = express.Router();

const {
  getMyProductsController,
} = require("../controllers/MyProductsController")

const verifyToken = require("../middlewares/verifyToken");

// 🔐 GET all products sold by logged-in user
router.get("/", verifyToken, getMyProductsController);

module.exports = router;
