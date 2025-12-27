const User = require("../models/User");
const mongoose = require("mongoose");

exports.rejectFriendRequest = async (receiverId, senderId) => {
  if (!mongoose.Types.ObjectId.isValid(receiverId) ||
      !mongoose.Types.ObjectId.isValid(senderId)) {
    const err = new Error("Invalid user ID");
    err.statusCode = 400;
    throw err;
  }

  if (receiverId.toString() === senderId.toString()) {
    const err = new Error("You cannot reject your own request");
    err.statusCode = 400;
    throw err;
  }

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  if (!receiver || !sender) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  // ❌ already friends
  if (receiver.friends.some(id => id.toString() === senderId.toString())) {
    const err = new Error("You are already friends");
    err.statusCode = 400;
    throw err;
  }

  // ❌ blocked
  if (
    receiver.blockedUsers.some(id => id.toString() === senderId.toString()) ||
    sender.blockedUsers.some(id => id.toString() === receiverId.toString())
  ) {
    const err = new Error("User is blocked");
    err.statusCode = 403;
    throw err;
  }

  // ✅ STRICT ObjectId-safe checks
  const hasReceived = receiver.friendRequestsReceived
    .some(id => id.toString() === senderId.toString());

  const hasSent = sender.friendRequestsSent
    .some(id => id.toString() === receiverId.toString());

  if (!hasReceived && !hasSent) {
    const err = new Error("No pending friend request found");
    err.statusCode = 404;
    throw err;
  }

  // ✅ HARD DELETE BOTH SIDES
  receiver.friendRequestsReceived =
    receiver.friendRequestsReceived.filter(
      id => id.toString() !== senderId.toString()
    );

  sender.friendRequestsSent =
    sender.friendRequestsSent.filter(
      id => id.toString() !== receiverId.toString()
    );

  await Promise.all([
    receiver.save(),
    sender.save()
  ]);

  return {
    message: "Friend request rejected successfully"
  };
};
