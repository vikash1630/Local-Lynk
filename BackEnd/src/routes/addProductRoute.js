const { addProductController } = require('../controllers/addProductController');

const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');

router.post('/add-product', verifyToken, addProductController);

module.exports = router;