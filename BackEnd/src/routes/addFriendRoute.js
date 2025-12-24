const express = require('express');
const router = express.Router();

const { addFriend } = require('../controllers/addFriendController');
const verifyToken = require('../middlewares/verifyToken');

// ADD FRIEND ROUTE
router.post('/add-friend/:friendId', verifyToken, addFriend);


module.exports = router;
