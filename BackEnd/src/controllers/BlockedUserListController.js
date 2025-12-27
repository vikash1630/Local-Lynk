const listBlockedUsersService = require("../services/BlockedUserListService")

exports.listBlockedUsers = async (req, res) => {
  try {
    // ❄️ FROZEN — DO NOT CHANGE
    const userId = req.user.userId || req.user.id;

    const blockedUsers =
      await listBlockedUsersService.listBlockedUsers(userId);

    return res.status(200).json({
      success: true,
      count: blockedUsers.length,
      blockedUsers
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch blocked users"
    });
  }
};
