const express = require("express");
const router = express.Router();

const { unblockUser } = require("../controllers/UnBlockUserController")
const verifyToken = require("../middlewares/verifyToken");

router.post(
  "/unblock/:userId",
  verifyToken,
  unblockUser
);

module.exports = router;
