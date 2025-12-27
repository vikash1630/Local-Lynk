const User = require("../models/User");

exports.sendFriendRequest = async (senderId, targetUserId) => {

  // ❌ User searching himself
  if (senderId.toString() === targetUserId.toString()) {
    const error = new Error("You cannot send a friend request to yourself");
    error.statusCode = 400;
    throw error;
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(targetUserId);

  if (!sender || !receiver) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // ❌ Already friends
  if (sender.friends.includes(targetUserId)) {
    const error = new Error("Users are already friends");
    error.statusCode = 400;
    throw error;
  }

  // 🔁 If receiver already sent request → make friends
  if (sender.friendRequestsReceived.includes(targetUserId)) {

    // remove pending requests
    sender.friendRequestsReceived.pull(targetUserId);
    receiver.friendRequestsSent.pull(senderId);

    // add both as friends
    sender.friends.push(targetUserId);
    receiver.friends.push(senderId);

    await sender.save();
    await receiver.save();

    return {
      message: "Friend request accepted. You are now friends."
    };
  }

  // ❌ Request already sent
  if (sender.friendRequestsSent.includes(targetUserId)) {
    const error = new Error("Friend request already sent");
    error.statusCode = 400;
    throw error;
  }

  // ✅ Send new friend request
  sender.friendRequestsSent.push(targetUserId);
  receiver.friendRequestsReceived.push(senderId);

  await sender.save();
  await receiver.save();

  return {
    message: "Friend request sent successfully"
  };
};
