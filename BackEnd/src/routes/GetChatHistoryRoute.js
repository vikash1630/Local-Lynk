const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const {
  getChatHistoryController,
} = require("../controllers/GetChatHistoryController");

// GET one-to-one chat history
router.get(
  "/history/:friendId",
  verifyToken,
  getChatHistoryController
);

module.exports = router;
