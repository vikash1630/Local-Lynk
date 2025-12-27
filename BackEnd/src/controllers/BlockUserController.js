const blockUserService = require("../services/BlockUserService")

exports.blockUser = async (req, res) => {
  try {
    const blockerId = req.user.userId || req.user.id;
    const { userId: targetUserId } = req.params;

    if (!targetUserId) {
      return res.status(400).json({
        message: "Target user ID is required"
      });
    }

    const result = await blockUserService.blockUser(
      blockerId,
      targetUserId
    );

    return res.status(200).json(result);

  } catch (error) {
    console.log("Controller Error");
    console.error("Block User Error:", error.message);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};
