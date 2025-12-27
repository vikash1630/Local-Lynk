const User = require("../models/User");

exports.unfriend = async (userId, friendId) => {
  if (!userId || !friendId) {
    const error = new Error("User ID and Friend ID are required");
    error.statusCode = 400;
    throw error;
  }

  if (userId.toString() === friendId.toString()) {
    const error = new Error("You cannot unfriend yourself");
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

  // ❌ Not friends
  if (!user.friends.includes(friendId)) {
    const error = new Error("You are not friends with this user");
    error.statusCode = 400;
    throw error;
  }

  // ✅ Remove each other
  user.friends = user.friends.filter(
    (id) => id.toString() !== friendId.toString()
  );

  friend.friends = friend.friends.filter(
    (id) => id.toString() !== userId.toString()
  );

  await user.save();
  await friend.save();

  return {
    message: "User unfriended successfully"
  };
};
