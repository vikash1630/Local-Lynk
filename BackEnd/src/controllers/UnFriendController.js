const unfriendService = require("../services/UnFriendService")

exports.unfriend = async (req, res) => {
  try {
    // ❄️ FROZEN LINE — DO NOT CHANGE
    const userId = req.user.userId || req.user.id;
    const { friendId } = req.params;

    const result = await unfriendService.unfriend(userId, friendId);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to unfriend user"
    });
  }
};
