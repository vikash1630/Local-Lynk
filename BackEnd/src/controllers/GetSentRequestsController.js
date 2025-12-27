const listSentFriendRequestsService = require("../services/GetSentRequestsService")

exports.listSentFriendRequests = async (req, res) => {
  try {
    // ❄️ FROZEN — DO NOT CHANGE
    const userId = req.user.userId || req.user.id;

    const requests =
      await listSentFriendRequestsService.listSentFriendRequests(userId);

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch sent requests"
    });
  }
};
