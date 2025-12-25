const express = require('express');
const router = express.Router();
const { getNearbyProducts } = require('../controllers/NearByProductController');
const verifyToken = require('../middlewares/verifyToken');
// Route to get nearby products based on user's location
router.get('/nearbyProducts/:latitude/:longitude/:distance', verifyToken, getNearbyProducts);

console.log("NearByProductsRoute Loaded");

module.exports = router;