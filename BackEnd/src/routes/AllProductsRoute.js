// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/AllProductsController")
router.get("/", getAllProducts);

module.exports = router;
