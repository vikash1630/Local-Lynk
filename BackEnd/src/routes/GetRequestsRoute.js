const express = require("express");
const router = express.Router();

const {
  listFriendRequests
} = require("../controllers/GetRequestsController")
const verifyToken = require("../middlewares/verifyToken");

// Get received friend requests
router.get(
  "/requests/recieved",
  verifyToken,
  listFriendRequests
);

module.exports = router;
