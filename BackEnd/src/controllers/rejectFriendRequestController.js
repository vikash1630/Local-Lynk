const rejectFriendRequestService = require("../services/rejectFriendRequestService")

exports.rejectFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user.userId || req.user._id;
    const { senderId } = req.params;

    if (!senderId) {
      return res.status(400).json({
        message: "Sender ID is required"
      });
    }

    const result =
      await rejectFriendRequestService.rejectFriendRequest(
        receiverId,
        senderId
      );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Reject Friend Request Error:", error.message);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};
