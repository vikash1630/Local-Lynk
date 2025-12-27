const express = require("express");
const router = express.Router();

const {
  listSentFriendRequests
} = require("../controllers/GetSentRequestsController")
const verifyToken = require("../middlewares/verifyToken");

// Get sent friend requests
router.get(
  "/requests/sent",
  verifyToken,
  listSentFriendRequests
);

module.exports = router;
