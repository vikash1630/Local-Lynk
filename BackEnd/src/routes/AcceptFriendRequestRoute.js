const express = require("express");
const router = express.Router();

const { acceptFriendRequestController } = require("../controllers/AcceptFriendRequestController")
const verifyToken = require("../middlewares/verifyToken");

router.post("/accept-friend-request/:senderUserId", verifyToken, acceptFriendRequestController);

module.exports = router;
