const User = require("../models/User");

exports.addFriend = async (userId, friendId) => {
  try {
    if (userId.toString() === friendId.toString()) {
      const error = new Error("You cannot add yourself as friend");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      const error = new Error("User or Friend not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      const error = new Error("Users are already friends");
      error.statusCode = 400;
      throw error;
    }

    // Add each other as friends
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    return {
      message: "Friend added successfully"
    };
  } catch (error) {
    throw error;
  }
};
