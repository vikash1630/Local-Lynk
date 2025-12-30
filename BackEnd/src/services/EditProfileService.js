const User = require("../models/User");

exports.editProfile = async (userId, data) => {
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  /* ================= BLOCK FORBIDDEN FIELDS ================= */
  delete data.email;
  delete data.password;

  delete data._id;
  delete data.friends;
  delete data.friendRequestsSent;
  delete data.friendRequestsReceived;
  delete data.blockedUsers;
  delete data.products;
  delete data.services;
  delete data.chats;
  delete data.cart;
  delete data.createdAt;
  delete data.updatedAt;

  /* ================= ALLOW ONLY VALID FIELDS ================= */
  const allowedUpdates = {};

  if (typeof data.name === "string") {
    allowedUpdates.name = data.name.trim();
  }

  if (typeof data.age === "number" && data.age >= 0) {
    allowedUpdates.age = data.age;
  }

  if (
    data.location &&
    Array.isArray(data.location.coordinates) &&
    data.location.coordinates.length === 2
  ) {
    allowedUpdates.location = {
      type: "Point",
      coordinates: data.location.coordinates,
    };
  }

  /* ================= UPDATE USER ================= */
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    {
      new: true,
      runValidators: true,
      select: "-password",
    }
  );

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};
