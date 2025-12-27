const sendFriendRequestService = require("../services/SendFriendRequestService")

exports.sendFriendRequestController = async (req, res) => {
  try {
    const senderId = req.user.id;
    console.log("Sender ID:", senderId);
    const { targetUserId } = req.params;

    const result = await sendFriendRequestService.sendFriendRequest(
      senderId,
      targetUserId
    );


    res.status(200).json(result);

  } catch (error) {
    console.error("Error in sendFriendRequestController:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong"
    });
  }
};
