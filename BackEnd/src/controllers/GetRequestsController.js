const listFriendRequestsService = require("../services/GetRequestsService")
exports.listFriendRequests = async (req, res) => {
  try {
    // ❄️ FROZEN — DO NOT CHANGE
    const userId = req.user.userId || req.user.id;

    const requests =
      await listFriendRequestsService.listFriendRequests(userId);

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch friend requests"
    });
  }
};
