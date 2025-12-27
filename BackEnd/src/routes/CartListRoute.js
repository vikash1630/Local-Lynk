const express = require("express");
const router = express.Router();

const { getCart } = require("../controllers/CartListController")
const verifyToken = require("../middlewares/verifyToken")

// LIST CART
router.get("/items", verifyToken, getCart);

module.exports = router;
