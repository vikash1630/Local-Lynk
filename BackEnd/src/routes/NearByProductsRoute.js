const express = require('express');
const router = express.Router();
const { getNearbyProducts } = require('../controllers/NearByProductController');

// Route to get nearby products based on user's location
router.get('/nearbyProducts/:latitude/:longitude/:distance', getNearbyProducts);

console.log("NearByProductsRoute Loaded");

module.exports = router;