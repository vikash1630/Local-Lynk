const express = require("express");
const router = express.Router();

const { getUserDetails } = require("../controllers/GetProfileDetailsController")
const verifyToken = require("../middlewares/verifyToken");

// Get user details by ID
router.post(
  "/",
  verifyToken,
  getUserDetails
);

module.exports = router;
