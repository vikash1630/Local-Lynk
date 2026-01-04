const chatHistoryService = require("../services/GetChatHistoryService")
exports.getChatHistoryController = async (req, res) => {
    try {
    const userId = req.user.userId || req.user.id;  // from JWT
    const { friendId } = req.params;   // from URL
    // console.log(userId)
    // console.log(friendId)

    const chats = await chatHistoryService.getChatHistory(
      userId,
      friendId
    );

    res.status(200).json(chats);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch chat history",
    });
  }
};
