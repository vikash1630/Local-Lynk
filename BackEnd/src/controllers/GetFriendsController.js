const listFriendsService = require("../services/GetFriendsService")

exports.listFriends = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log("Fetching friends for user ID:", userId);

    const friends = await listFriendsService.listFriends(userId);

    return res.status(200).json({
      success: true,
      count: friends.length,
      friends
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch friends"
    });
  }
};
