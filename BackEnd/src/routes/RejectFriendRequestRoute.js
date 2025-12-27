const express = require("express");
const router = express.Router();

const {
  rejectFriendRequest
} = require("../controllers/rejectFriendRequestController")

const verifyToken = require("../middlewares/verifyToken");

router.post(
  "/reject-friend-request/:senderId",
  verifyToken,
  rejectFriendRequest
);

module.exports = router;
