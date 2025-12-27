const User = require("../models/User");
const mongoose = require("mongoose");

exports.blockUser = async (blockerId, targetUserId) => {
  // ❌ Self block
  if (blockerId.toString() === targetUserId.toString()) {
    const err = new Error("You cannot block yourself");
    err.statusCode = 400;
    throw err;
  }

  // ❌ Invalid ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(blockerId) ||
    !mongoose.Types.ObjectId.isValid(targetUserId)
  ) {
    const err = new Error("Invalid user ID");
    err.statusCode = 400;
    throw err;
  }

  const blocker = await User.findById(blockerId);
  const target = await User.findById(targetUserId);

  if (!blocker) {
    const err = new Error("Blocking user not found");
    err.statusCode = 404;
    throw err;
  }

  if (!target) {
    const err = new Error("Target user not found");
    err.statusCode = 404;
    throw err;
  }

  // ❌ Already blocked
  if (blocker.blockedUsers.includes(targetUserId)) {
    const err = new Error("User already blocked");
    err.statusCode = 400;
    throw err;
  }

  // ✅ Add to blockedUsers
  blocker.blockedUsers.push(targetUserId);

  // 🔥 Remove friendship (both sides)
  blocker.friends = blocker.friends.filter(
    (id) => id.toString() !== targetUserId.toString()
  );

  target.friends = target.friends.filter(
    (id) => id.toString() !== blockerId.toString()
  );

  // 🔥 Remove friend requests (both directions)
  blocker.friendRequestsSent = blocker.friendRequestsSent.filter(
    (id) => id.toString() !== targetUserId.toString()
  );

  blocker.friendRequestsReceived = blocker.friendRequestsReceived.filter(
    (id) => id.toString() !== targetUserId.toString()
  );

  target.friendRequestsSent = target.friendRequestsSent.filter(
    (id) => id.toString() !== blockerId.toString()
  );

  target.friendRequestsReceived = target.friendRequestsReceived.filter(
    (id) => id.toString() !== blockerId.toString()
  );

  await blocker.save();
  await target.save();

  return {
    message: "User blocked successfully"
  };
};
