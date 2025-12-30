const User = require("../models/User");

exports.getUserById = async (userId) => {
  if (!userId) return null;

  const user = await User.findById(userId)
    .select("name email age location profilePhoto friends products services createdAt")
    .populate("friends", "name email profilePhoto")
    .populate("products", "name price images");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
