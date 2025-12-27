const express = require("express");
const router = express.Router();

const {
  listBlockedUsers
} = require("../controllers/BlockedUserListController")
const verifyToken = require("../middlewares/verifyToken");

// List blocked users
router.get(
  "/blocked",
  verifyToken,
  listBlockedUsers
);

module.exports = router;
