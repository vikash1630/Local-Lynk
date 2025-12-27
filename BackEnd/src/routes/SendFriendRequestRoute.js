const express = require("express");
const router = express.Router();

const { sendFriendRequestController } = require("../controllers/SendFriendRequestController")
const verifyToken = require("../middlewares/verifyToken");

router.post("/send-friend-request/:targetUserId", verifyToken, sendFriendRequestController);

module.exports = router;
