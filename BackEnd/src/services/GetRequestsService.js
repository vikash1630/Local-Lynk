const User = require("../models/User");

exports.listFriendRequests = async (userId) => {
  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId)
    .populate("friendRequestsReceived", "name email");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user.friendRequestsReceived || [];
};
