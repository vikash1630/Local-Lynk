const Chat = require("../models/Chat");
const mongoose = require("mongoose");

exports.getChatHistory = async (userId, friendId) => {
  // validate ids
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(friendId)
  ) {
    const err = new Error("Invalid user id");
    err.statusCode = 400;
    throw err;
  }

  if (userId.toString() === friendId.toString()) {
    const err = new Error("Cannot fetch chat with yourself");
    err.statusCode = 400;
    throw err;
  }

  const chats = await Chat.find({
    $or: [
      { from: userId, to: friendId },
      { from: friendId, to: userId },
    ],
  })
    .sort({ createdAt: 1 }) // oldest → newest
    .lean();

    console.log(chats)

  return chats;
};
