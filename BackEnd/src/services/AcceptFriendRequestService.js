const User = require("../models/User");

exports.acceptFriendRequest = async (receiverId, senderUserId) => {

  // ❌ Missing IDs
  if (!receiverId || !senderUserId) {
    const error = new Error("Invalid user IDs");
    error.statusCode = 400;
    throw error;
  }

  // ❌ Self accept
  if (String(receiverId) === String(senderUserId)) {
    const error = new Error("You cannot accept your own friend request");
    error.statusCode = 400;
    throw error;
  }

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderUserId);

  // ❌ User not found
  if (!receiver || !sender) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // ❌ Already friends
  if (receiver.friends.includes(senderUserId)) {
    const error = new Error("Users are already friends");
    error.statusCode = 400;
    throw error;
  }

  // ❌ No pending request
  if (!receiver.friendRequestsReceived.includes(senderUserId)) {
    const error = new Error("No friend request to accept");
    error.statusCode = 400;
    throw error;
  }

  // ✅ Remove pending requests
  receiver.friendRequestsReceived.pull(senderUserId);
  sender.friendRequestsSent.pull(receiverId);

  // ✅ Add to friends list
  receiver.friends.push(senderUserId);
  sender.friends.push(receiverId);

  await receiver.save();
  await sender.save();

  return {
    message: "Friend request accepted successfully"
  };
};
