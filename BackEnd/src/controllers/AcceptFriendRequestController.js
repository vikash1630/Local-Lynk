const acceptFriendRequestService = require("../services/AcceptFriendRequestService")

exports.acceptFriendRequestController = async (req, res) => {
  try {
    const receiverId = req.user.userId || req.user.id;
    const { senderUserId } = req.params;
    console.log("Receiver ID:", receiverId);
    console.log("Sender User ID:", senderUserId);

    const result = await acceptFriendRequestService.acceptFriendRequest(
      receiverId,
      senderUserId
    );

    res.status(200).json(result);

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong"
    });
  }
};
