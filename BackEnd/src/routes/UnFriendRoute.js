const express = require("express");
const router = express.Router();

const { unfriend } = require("../controllers/UnFriendController");
const verifyToken = require("../middlewares/verifyToken");

// Unfriend a user
router.delete(
  "/unfriend/:friendId",
  verifyToken,
  unfriend
);

module.exports = router;
