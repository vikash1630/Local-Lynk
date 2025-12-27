const User = require("../models/User");
const mongoose = require("mongoose");

exports.unblockUser = async (blockerId, targetUserId) => {
  // ❌ Self unblock
  if (blockerId.toString() === targetUserId.toString()) {
    const err = new Error("You cannot unblock yourself");
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
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (!target) {
    const err = new Error("Target user not found");
    err.statusCode = 404;
    throw err;
  }

  // ❌ Not blocked
  if (!blocker.blockedUsers.includes(targetUserId)) {
    const err = new Error("User is not blocked");
    err.statusCode = 400;
    throw err;
  }

  // ✅ Remove from blockedUsers
  blocker.blockedUsers = blocker.blockedUsers.filter(
    (id) => id.toString() !== targetUserId.toString()
  );

  await blocker.save();

  return {
    message: "User unblocked successfully"
  };
};
