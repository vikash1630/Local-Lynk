const unblockUserService = require("../services/UnBlockUserService")

exports.unblockUser = async (req, res) => {
  try {
    const blockerId = req.user.userId || req.user.id;
    const { userId: targetUserId } = req.params;

    if (!targetUserId) {
      return res.status(400).json({
        message: "Target user ID is required"
      });
    }

    const result = await unblockUserService.unblockUser(
      blockerId,
      targetUserId
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Unblock User Error:", error.message);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};
