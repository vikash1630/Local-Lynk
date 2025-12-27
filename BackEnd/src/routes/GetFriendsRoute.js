const express = require("express");
const router = express.Router();

const { listFriends } = require("../controllers/GetFriendsController")
const verifyToken = require("../middlewares/verifyToken");

// List logged-in user's friends
router.get(
  "/",
  verifyToken,
  listFriends
);

module.exports = router;
