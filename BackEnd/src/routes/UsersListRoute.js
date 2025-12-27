const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/UserListController")
const verifyToken = require("../middlewares/verifyToken");

// Get top 5 users (search by name or email)
router.get(
  "/",
  verifyToken,
  getUsers
);

module.exports = router;
