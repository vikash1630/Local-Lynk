const User = require("../models/User");
const mongoose = require("mongoose");

exports.rejectFriendRequest = async (receiverId, senderId) => {
  // ❌ Same user
  if (receiverId.toString() === senderId.toString()) {
    const err = new Error("You cannot reject your own request");
    err.statusCode = 400;
    throw err;
  }

  // ❌ Invalid ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(receiverId) ||
    !mongoose.Types.ObjectId.isValid(senderId)
  ) {
    const err = new Error("Invalid user ID");
    err.statusCode = 400;
    throw err;
  }

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  if (!receiver) {
    const err = new Error("Receiver not found");
    err.statusCode = 404;
    throw err;
  }

  if (!sender) {
    const err = new Error("Sender not found");
    err.statusCode = 404;
    throw err;
  }

  // ❌ Already friends
  if (receiver.friends.includes(senderId)) {
    const err = new Error("You are already friends");
    err.statusCode = 400;
    throw err;
  }

  // ❌ Blocked check
  if (
    receiver.blockedUsers.includes(senderId) ||
    sender.blockedUsers.includes(receiverId)
  ) {
    const err = new Error("User is blocked");
    err.statusCode = 403;
    throw err;
  }

  // ❌ No pending request
  const hasReceived =
    receiver.friendRequestsReceived.includes(senderId);
  const hasSent =
    sender.friendRequestsSent.includes(receiverId);

  if (!hasReceived || !hasSent) {
    const err = new Error("No pending friend request found");
    err.statusCode = 404;
    throw err;
  }

  // ✅ Remove request
  receiver.friendRequestsReceived =
    receiver.friendRequestsReceived.filter(
      (id) => id.toString() !== senderId.toString()
    );

  sender.friendRequestsSent =
    sender.friendRequestsSent.filter(
      (id) => id.toString() !== receiverId.toString()
    );

  await receiver.save();
  await sender.save();

  return {
    message: "Friend request rejected successfully"
  };
};
